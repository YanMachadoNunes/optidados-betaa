"use server";

import prisma from "@/lib/utils";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { Prisma } from "@prisma/client";

function parseCurrency(value: string) {
  return Number(value.replace(/[^0-9,-]+/g, "").replace(",", "."));
} // Adicione esta linha!

export async function createCustomer(formData: FormData) {
  const name = formData.get("name") as string;
  const email = formData.get("email") as string;
  const phone = formData.get("phone") as string;
  const cpf = formData.get("cpf") as string;
  const address = formData.get("address") as string;
  const city = formData.get("city") as string;
  const state = formData.get("state") as string;
  const zipCode = formData.get("zipCode") as string;

  try {
    await prisma.customer.create({
      data: { 
        name, 
        email: email || null, 
        phone: phone || null, 
        cpf: cpf || null,
        address: address || null,
        city: city || null,
        state: state || null,
        zipCode: zipCode || null,
      },
    });
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === "P2002") {
        throw new Error("Este CPF já está cadastrado no sistema.");
      }
    }
    throw error;
  }

  revalidatePath("/customers");
  redirect("/customers");
}

// Adicione isso no final do arquivo actions.ts
export async function deleteCustomer(id: string) {
  // Primeiro deleta as receitas associadas
  await prisma.prescription.deleteMany({
    where: { customerId: id },
  });
  
  await prisma.customer.delete({
    where: { id },
  });

  revalidatePath("/customers");
  redirect("/customers"); // Deleta e volta pra lista
}

// app/customers/actions.ts

export async function updateCustomer(formData: FormData) {
  const id = formData.get("id") as string;
  const name = formData.get("name") as string;
  const email = formData.get("email") as string;
  const phone = formData.get("phone") as string;
  const cpf = formData.get("cpf") as string;
  const address = formData.get("address") as string;
  const city = formData.get("city") as string;
  const state = formData.get("state") as string;
  const zipCode = formData.get("zipCode") as string;

  await prisma.customer.update({
    where: { id },
    data: { 
      name, 
      email: email || null, 
      phone: phone || null, 
      cpf: cpf || null,
      address: address || null,
      city: city || null,
      state: state || null,
      zipCode: zipCode || null,
    },
  });

  revalidatePath("/customers");
  revalidatePath(`/customers/${id}`);
  redirect(`/customers/${id}`);
}

// Adicione isso no final de app/customers/actions.ts

export async function createPrescription(formData: FormData) {
  "use server"; // Garante que roda no servidor

  const customerId = formData.get("customerId") as string;

  // Função auxiliar para converter texto vazio em 0 (zero)
  const parseDecimal = (value: any) => {
    if (!value || value === "") return 0;
    return Number(value); // Converte " -2.50 " para -2.5
  };

  const parseIntVal = (value: any) => {
    if (!value || value === "") return 0;
    return parseInt(value);
  };

  await prisma.prescription.create({
    data: {
      customerId,
      doctorName: formData.get("doctorName") as string,

      // Olho Direito (OD)
      odSpherical: parseDecimal(formData.get("odSpherical")),
      odCylindrical: parseDecimal(formData.get("odCylindrical")),
      odAxis: parseIntVal(formData.get("odAxis")),

      // Olho Esquerdo (OE)
      oeSpherical: parseDecimal(formData.get("oeSpherical")),
      oeCylindrical: parseDecimal(formData.get("oeCylindrical")),
      oeAxis: parseIntVal(formData.get("oeAxis")),

      // Adições (perto)
      additionOD: parseDecimal(formData.get("additionOD")),
      additionOE: parseDecimal(formData.get("additionOE")),

      // Datas
      examDate: new Date((formData.get("examDate") as string) || new Date()),
      dueDate: formData.get("dueDate")
        ? new Date(formData.get("dueDate") as string)
        : null,
    },
  });

  revalidatePath(`/customers/${customerId}`);
  redirect(`/customers/${customerId}`); // Volta para o dossiê do cliente
}

type SaleItemInput = {
  productId: string;
  quantity: number;
};

export async function createSale(
  userId: string,
  customerId: string | null,
  items: SaleItemInput[],
) {
  if (!items || items.length === 0) {
    return { error: "O carrinho está vazio." };
  }

  if (!userId) {
    return { error: "Usuário não autenticado." };
  }

  try {
    let finalUserId = userId;
    
    const userExists = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!userExists) {
      const defaultUser = await prisma.user.findFirst();
      if (!defaultUser) {
        return { error: "Nenhum usuário encontrado no sistema." };
      }
      finalUserId = defaultUser.id;
    }

    await prisma.$transaction(async (tx) => {
      let totalAmount = 0;

      // 2. Preparar os itens para salvar e calcular total REAL
      const itemsToCreate: { productId: string; quantity: number; unitPrice: any }[] = [];

      for (const item of items) {
        // Busca o produto no banco para pegar preço e estoque ATUAIS
        const product = await tx.product.findUnique({
          where: { id: item.productId },
        });

        if (!product) {
          throw new Error(`Produto não encontrado: ${item.productId}`);
        }

        // Verifica Estoque
        if (product.stock < item.quantity) {
          throw new Error(`Estoque insuficiente para: ${product.name}`);
        }

        // Calcula preço (Preço do Banco * Quantidade)
        const itemTotal = Number(product.price) * item.quantity;
        totalAmount += itemTotal;

        // Adiciona na lista para criar depois
        itemsToCreate.push({
          productId: product.id,
          quantity: item.quantity,
          unitPrice: new Prisma.Decimal(product.price.toString()), // Salva o preço histórico
        });

        // 3. Baixa no Estoque IMEDIATAMENTE
        await tx.product.update({
          where: { id: product.id },
          data: {
            stock: {
              decrement: item.quantity,
            },
          },
        });
      }

      // 4. Cria a Venda com o valor total calculado
      await tx.sale.create({
        data: {
          userId: finalUserId,
          customerId: customerId === "anonymous" ? null : customerId, // Trata cliente anônimo
          totalAmount: new Prisma.Decimal(totalAmount),
          status: "COMPLETED", // Venda balcão já sai completa
          items: {
            create: itemsToCreate,
          },
        },
      });
    });

    // 5. Se deu tudo certo
    revalidatePath("/sales");
    revalidatePath("/inventory"); // Atualiza estoque na visualização também
    return { success: true };
  } catch (error: any) {
    console.error("Erro ao processar venda:", error);
    return { error: error.message || "Erro ao processar venda." };
  }
}

export async function createProduct(formData: FormData) {
  const name = formData.get("name") as string;
  const category = formData.get("category") as string;
  const stock = parseInt(formData.get("stock") as string);
  const labCode = formData.get("labCode") as string;

  const price = parseCurrency(formData.get("price") as string);
  const costPrice = parseCurrency(formData.get("costPrice") as string);

  await prisma.product.create({
    data: {
      name,
      category,
      stock,
      price,
      costPrice,
      labCode: labCode || null,
    },
  });

  revalidatePath("/inventory");
  redirect("/inventory");
}

export async function deleteProduct(id: string) {
  await prisma.product.delete({
    where: { id },
  });

  revalidatePath("/inventory");
}

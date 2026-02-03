"use server";

import { prisma } from "../../lib/prisma";
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

  try {
    // Tenta materializar a energia em dados
    await prisma.customer.create({
      data: { name, email, phone, cpf },
    });
  } catch (error) {
    // Se o erro for de unicidade (P2002)
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === "P2002") {
        // Em Server Actions, você pode retornar um objeto com o erro
        // para o seu componente de formulário exibir uma mensagem.
        return { error: "Este CPF já está cadastrado no sistema." };
      }
    }
    // Se for outro erro, lança para o Next.js tratar
    throw error;
  }

  // Só chega aqui se a criação deu certo
  revalidatePath("/customers");
  redirect("/customers");
}

// Adicione isso no final do arquivo actions.ts
export async function deleteCustomer(id: string) {
  await prisma.customer.delete({
    where: { id },
  });

  revalidatePath("/customers");
  redirect("/customers"); // Deleta e volta pra lista
}

// app/customers/actions.ts

export async function updateCustomer(formData: FormData) {
  const id = formData.get("id") as string; // O ID vem escondido no formulário
  const name = formData.get("name") as string;
  const email = formData.get("email") as string;
  const phone = formData.get("phone") as string;
  const cpf = formData.get("cpf") as string;

  await prisma.customer.update({
    where: { id },
    data: { name, email, phone, cpf },
  });

  revalidatePath("/customers");
  revalidatePath(`/customers/${id}`); // Atualiza também a página de detalhes
  redirect(`/customers/${id}`); // Volta para o Dossiê do cliente atualizado
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

      // Adição
      addition: parseDecimal(formData.get("addition")),

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
  customerId: string | null,
  items: SaleItemInput[],
) {
  // 1. Validar se tem itens
  if (!items || items.length === 0) {
    return { error: "O carrinho está vazio." };
  }

  try {
    // A MÁGICA: Transaction
    // Tudo aqui dentro roda junto. Se um falhar, tudo falha.
    await prisma.$transaction(async (tx) => {
      let totalAmount = 0;

      // 2. Preparar os itens para salvar e calcular total REAL
      const itemsToCreate = [];

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
          unitPrice: product.price, // Salva o preço histórico
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
          customerId: customerId === "anonymous" ? null : customerId, // Trata cliente anônimo
          totalAmount: totalAmount,
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

  // Tratamento de valores monetários
  const price = parseCurrency(formData.get("price") as string);
  const costPrice = parseCurrency(formData.get("costPrice") as string);

  await prisma.product.create({
    data: {
      name,
      category,
      stock,
      price,
      costPrice,
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

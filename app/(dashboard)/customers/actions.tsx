"use server";

import { prisma } from "../../lib/prisma";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function createCustomer(formData: FormData) {
  const name = formData.get("name") as string;
  const email = formData.get("email") as string;
  const phone = formData.get("phone") as string;
  const cpf = formData.get("cpf") as string;

  // Aqui o Prisma materializa a energia em dados
  await prisma.customer.create({
    data: { name, email, phone, cpf },
  });

  revalidatePath("/customers"); // Atualiza a lista
  redirect("/customers"); // Te joga de volta pra lista
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

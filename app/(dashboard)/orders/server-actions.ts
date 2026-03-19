"use server"

import { prisma } from "@/lib/prisma"
import { Prisma } from "@prisma/client"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"

export async function createOrderAction(formData: FormData) {
  let userId = ""
  
  const defaultUser = await prisma.user.findFirst()
  if (!defaultUser) {
    throw new Error("Nenhum usuário encontrado no sistema")
  }
  userId = defaultUser.id

  const customerId = formData.get("customerId") as string
  if (!customerId) {
    throw new Error("Cliente é obrigatório")
  }

  const frameId = formData.get("frameId") as string | null
  const paymentMethod = formData.get("paymentMethod") as string | null
  const prescriptionId = formData.get("prescriptionId") as string | null
  const totalAmountParam = formData.get("totalAmount") as string
  const totalAmount = parseFloat(totalAmountParam) || 0

  const items: { productId: string; quantity: number; unitPrice: Prisma.Decimal }[] = []

  if (frameId) {
    const frame = await prisma.product.findUnique({ where: { id: frameId } })
    if (frame) {
      await prisma.product.update({
        where: { id: frameId },
        data: { stock: { decrement: 1 } },
      })
    }
  }

  let index = 0
  while (formData.has(`items[${index}][productId]`)) {
    const productId = formData.get(`items[${index}][productId]`) as string
    const quantity = parseInt(formData.get(`items[${index}][quantity]`) as string) || 1

    if (productId) {
      const product = await prisma.product.findUnique({ where: { id: productId } })
      if (product) {
        items.push({
          productId,
          quantity,
          unitPrice: new Prisma.Decimal(product.price.toString()),
        })
        await prisma.product.update({
          where: { id: productId },
          data: { stock: { decrement: quantity } },
        })
      }
    }
    index++
  }

  if (items.length === 0 && !frameId) {
    throw new Error("Adicione pelo menos um produto ao pedido")
  }

  await prisma.order.create({
    data: {
      userId,
      customerId,
      prescriptionId: prescriptionId || null,
      paymentMethod: paymentMethod || null,
      totalAmount: new Prisma.Decimal(totalAmount),
      status: "PENDING",
      frameId: frameId || null,
      items: { create: items },
    },
  })

  revalidatePath("/orders")
  redirect("/orders")
}

export async function updateOrderAction(formData: FormData) {
  const orderId = formData.get("orderId") as string
  const status = formData.get("status") as string

  if (!orderId) {
    throw new Error("ID do pedido é obrigatório")
  }

  await prisma.order.update({
    where: { id: orderId },
    data: { status },
  })

  revalidatePath("/orders")
  revalidatePath(`/orders/${orderId}`)
  redirect(`/orders/${orderId}`)
}

export async function deleteOrderAction(id: string) {
  await prisma.order.delete({ where: { id } })
  revalidatePath("/orders")
  redirect("/orders")
}

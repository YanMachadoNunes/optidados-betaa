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
  const lensProductId = formData.get("items[0][productId]") as string
  const lensQuantity = parseInt(formData.get("items[0][quantity]") as string) || 1

  let totalAmount = 0
  const items: { productId: string; quantity: number; unitPrice: Prisma.Decimal }[] = []

  if (frameId) {
    const frame = await prisma.product.findUnique({ where: { id: frameId } })
    if (frame) {
      totalAmount += Number(frame.price)
      items.push({
        productId: frameId,
        quantity: 1,
        unitPrice: new Prisma.Decimal(frame.price.toString()),
      })
      await prisma.product.update({
        where: { id: frameId },
        data: { stock: { decrement: 1 } },
      })
    }
  }

  if (lensProductId) {
    const lens = await prisma.product.findUnique({ where: { id: lensProductId } })
    if (lens) {
      const lensTotal = Number(lens.price) * lensQuantity
      totalAmount += lensTotal
      items.push({
        productId: lensProductId,
        quantity: lensQuantity,
        unitPrice: new Prisma.Decimal(lens.price.toString()),
      })
    }
  }

  await prisma.order.create({
    data: {
      userId,
      customerId,
      prescriptionId: prescriptionId || null,
      paymentMethod: paymentMethod || null,
      totalAmount: new Prisma.Decimal(totalAmount),
      status: "PENDING",
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

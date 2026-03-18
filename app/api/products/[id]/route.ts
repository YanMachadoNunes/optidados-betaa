import { NextResponse } from "next/server"
import prisma from "@/lib/utils"

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  
  const product = await prisma.product.findUnique({
    where: { id },
  })

  if (!product) {
    return NextResponse.json({ error: "Produto não encontrado" }, { status: 404 })
  }

  return NextResponse.json(product)
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const body = await request.json()

  const product = await prisma.product.update({
    where: { id },
    data: {
      name: body.name,
      category: body.category,
      price: body.price,
      costPrice: body.costPrice,
      stock: body.stock,
      labCode: body.labCode || null,
    },
  })

  return NextResponse.json(product)
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params

  await prisma.product.delete({
    where: { id },
  })

  return NextResponse.json({ success: true })
}

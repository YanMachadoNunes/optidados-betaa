import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    const formData = await request.formData();

    const customerId = formData.get("customerId") as string;
    const frameId = formData.get("frameId") as string | null;
    const paymentMethod = formData.get("paymentMethod") as string | null;
    const lensProductId = formData.get("items[0][productId]") as string;
    const lensQuantity = parseInt(formData.get("items[0][quantity]") as string) || 1;

    if (!customerId) {
      return NextResponse.json(
        { error: "Cliente é obrigatório" },
        { status: 400 }
      );
    }

    let totalAmount = 0;

    const items: {
      productId: string;
      quantity: number;
      unitPrice: number;
    }[] = [];

    if (frameId) {
      const frame = await prisma.product.findUnique({
        where: { id: frameId },
      });
      if (frame) {
        totalAmount += Number(frame.price);
        items.push({
          productId: frameId,
          quantity: 1,
          unitPrice: Number(frame.price),
        });
      }
    }

    if (lensProductId) {
      const lens = await prisma.product.findUnique({
        where: { id: lensProductId },
      });
      if (lens) {
        const lensTotal = Number(lens.price) * lensQuantity;
        totalAmount += lensTotal;
        items.push({
          productId: lensProductId,
          quantity: lensQuantity,
          unitPrice: Number(lens.price),
        });
      }
    }

    const order = await prisma.order.create({
      data: {
        customerId,
        frameId: frameId || null,
        paymentMethod: paymentMethod || null,
        totalAmount,
        status: "PENDING",
        items: {
          create: items,
        },
      },
    });

    if (frameId) {
      await prisma.product.update({
        where: { id: frameId },
        data: {
          stock: {
            decrement: 1,
          },
        },
      });
    }

    return NextResponse.json(order, { status: 201 });
  } catch (error) {
    console.error("Erro ao criar pedido:", error);
    return NextResponse.json(
      { error: "Erro ao criar pedido" },
      { status: 500 }
    );
  }
}

export async function GET() {
  const orders = await prisma.order.findMany({
    include: {
      customer: true,
      frame: true,
      items: {
        include: {
          product: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });
  return NextResponse.json(orders);
}

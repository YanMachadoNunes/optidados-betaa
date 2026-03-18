import { NextResponse } from "next/server";
import prisma from "@/lib/utils";

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    await prisma.order.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Erro ao excluir pedido:", error);
    return NextResponse.json(
      { error: "Erro ao excluir pedido" },
      { status: 500 }
    );
  }
}

import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    const prescriptions = await prisma.prescription.findMany({
      where: { customerId: id },
      orderBy: { examDate: "desc" },
      select: {
        id: true,
        doctorName: true,
        examDate: true,
        odSpherical: true,
        odCylindrical: true,
        odAxis: true,
        oeSpherical: true,
        oeCylindrical: true,
        oeAxis: true,
        additionOD: true,
        additionOE: true,
      }
    })

    return NextResponse.json(prescriptions)
  } catch (error) {
    console.error("Erro ao buscar receitas:", error)
    return NextResponse.json([], { status: 500 })
  }
}

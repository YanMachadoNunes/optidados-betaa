import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"

export async function GET() {
  try {
    let settings = await prisma.storeSettings.findFirst()
    
    if (!settings) {
      settings = await prisma.storeSettings.create({
        data: { name: "OptiGestão" }
      })
    }
    
    return NextResponse.json(settings)
  } catch (error) {
    console.error("Erro ao buscar configurações:", error)
    return NextResponse.json({ error: "Erro interno" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { name, cnpj, ie, address, city, state, zipCode, phone, email } = body
    
    let settings = await prisma.storeSettings.findFirst()
    
    if (settings) {
      settings = await prisma.storeSettings.update({
        where: { id: settings.id },
        data: {
          name,
          cnpj: cnpj || null,
          ie: ie || null,
          address: address || null,
          city: city || null,
          state: state || null,
          zipCode: zipCode || null,
          phone: phone || null,
          email: email || null,
        }
      })
    } else {
      settings = await prisma.storeSettings.create({
        data: {
          name,
          cnpj: cnpj || null,
          ie: ie || null,
          address: address || null,
          city: city || null,
          state: state || null,
          zipCode: zipCode || null,
          phone: phone || null,
          email: email || null,
        }
      })
    }
    
    return NextResponse.json(settings)
  } catch (error) {
    console.error("Erro ao salvar configurações:", error)
    return NextResponse.json({ error: "Erro interno" }, { status: 500 })
  }
}

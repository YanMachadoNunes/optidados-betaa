import { NextRequest, NextResponse } from "next/server"
import prisma from "@/lib/utils"
import { MercadoPagoConfig, Payment } from "mercadopago"

const client = new MercadoPagoConfig({ 
  accessToken: process.env.MERCADOPAGO_ACCESS_TOKEN! 
})

export async function POST(req: NextRequest) {
  try {
    const body = await req.text()

    const data = JSON.parse(body)
    
    if (data.type === "payment") {
      const paymentId = data.data?.id
      
      if (paymentId) {
        const paymentClient = new Payment(client)
        const payment = await paymentClient.get({ id: String(paymentId) })
        
        if (payment.status === "approved") {
          const userId = payment.external_reference
          
          if (userId) {
            await prisma.user.update({
              where: { id: userId },
              data: { plan: "PREMIUM" }
            })
            
            console.log(`[STATUS] Usuário ${userId} atualizado para PREMIUM com sucesso!`)
            
            return NextResponse.json({ 
              success: true, 
              message: "Plano atualizado com sucesso" 
            })
          }
        }
      }
    }

    return NextResponse.json({ 
      success: true, 
      message: "Notificação recebida" 
    })
  } catch (error) {
    console.error("Webhook error:", error)
    return NextResponse.json(
      { success: false, error: "Erro ao processar webhook" },
      { status: 500 }
    )
  }
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const paymentId = searchParams.get("payment_id")
  const userId = searchParams.get("user_id")

  if (!paymentId || !userId) {
    return NextResponse.json(
      { success: false, error: "Parâmetros inválidos" },
      { status: 400 }
    )
  }

  try {
    const paymentClient = new Payment(client)
    const payment = await paymentClient.get({ id: String(paymentId) })
    
    if (payment.status === "approved") {
      await prisma.user.update({
        where: { id: userId },
        data: { plan: "PREMIUM" }
      })
      
      return NextResponse.json({ 
        success: true, 
        plan: "PREMIUM",
        message: "Plano atualizado" 
      })
    }

    return NextResponse.json({ 
      success: false, 
      status: payment.status 
    })
  } catch (error) {
    console.error("Error checking payment:", error)
    return NextResponse.json(
      { success: false, error: "Erro ao verificar pagamento" },
      { status: 500 }
    )
  }
}

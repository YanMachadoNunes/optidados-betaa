import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "../auth/[...nextauth]/route"

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, error: "Usuário não autenticado" },
        { status: 401 }
      )
    }

    const body = await request.json()
    const { planName, price, planId } = body

    const accessToken = process.env.MERCADOPAGO_ACCESS_TOKEN

    if (!accessToken) {
      return NextResponse.json(
        { success: false, error: "Token do Mercado Pago não configurado" },
        { status: 500 }
      )
    }

    console.log("Access Token exists:", !!accessToken)
    console.log("Access Token:", accessToken?.substring(0, 20) + "...")

    // URL base para redirects
    const baseUrl = process.env.NEXTAUTH_URL || "http://localhost:3000"
    
    console.log("NEXTAUTH_URL env:", process.env.NEXTAUTH_URL)
    console.log("baseUrl used:", baseUrl)

    // Mapeamento de planos para nomes internos
    const planMap: Record<string, string> = {
      "1": "BASIC",
      "2": "STANDARD", 
      "3": "PREMIUM",
    }
    const planType = planMap[planId] || "STANDARD"

    const preferenceData = {
      items: [
        {
          title: `Plano ${planName} - OptiGestão`,
          unit_price: Number(price),
          quantity: 1,
        },
      ],
      external_reference: session.user.id,
    }

    console.log("Preference Data:", JSON.stringify(preferenceData, null, 2))

    const prefResponse = await fetch("https://api.mercadopago.com/checkout/preferences", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify(preferenceData),
    })

    const preference = await prefResponse.json()

    console.log("MP Response Status:", prefResponse.status)
    console.log("MP Response:", JSON.stringify(preference, null, 2))

    // Para APP_USR em modo teste, usar sandbox_init_point
    const paymentUrl = preference.sandbox_init_point || preference.init_point

    if (preference.id) {
      return NextResponse.json({
        success: true,
        preferenceId: preference.id,
        paymentUrl: paymentUrl,
        message: "Pagamento criado com sucesso",
      })
    }

    return NextResponse.json({
      success: false,
      error: preference.message || "Erro ao criar preferência",
    })
  } catch (error: any) {
    console.error("Error:", error)
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    )
  }
}

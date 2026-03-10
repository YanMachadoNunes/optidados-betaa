import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { planName, price } = body;

    const accessToken = process.env.MERCADOPAGO_ACCESS_TOKEN;

    // Primeiro, criar uma preferência de pagamento PIX
    const preferenceData = {
      items: [
        {
          title: `Plano ${planName} - OptiGestão`,
          description: "Acesso completo ao sistema de gestão para óticas",
          quantity: 1,
          currency_id: "BRL",
          unit_price: Number(price),
        },
      ],
      payment_methods: {
        included_payment_types: [{ id: "pix" }],
      },
      payment_type_id: "pix",
      expires: true,
      expiration_date_from: new Date().toISOString(),
      expiration_date_to: new Date(Date.now() + 30 * 60 * 1000).toISOString(),
    };

    const prefResponse = await fetch("https://api.mercadopago.com/checkout/preferences", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify(preferenceData),
    });

    const preference = await prefResponse.json();

    if (preference.id) {
      // Agora buscar os dados do PIX usando o ID da preferência
      // O Mercado Pago não retorna QR code via API, então retornamos o link de pagamento
      return NextResponse.json({
        success: true,
        preferenceId: preference.id,
        paymentUrl: preference.init_point,
        qrCode: null,
        qrCodeBase64: null,
        message: "Use o link para pagar via PIX",
      });
    }

    return NextResponse.json({
      success: false,
      error: preference.message || "Erro ao criar preferência",
    });
  } catch (error: any) {
    console.error("Error:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

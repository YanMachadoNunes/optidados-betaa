import { MercadoPagoConfig, Payment } from "mercadopago";
import { NextResponse } from "next/server";

// 1. Inicializa o cliente do Mercado Pago com a sua chave secreta
const client = new MercadoPagoConfig({
  accessToken: process.env.MERCADOPAGO_ACCESS_TOKEN as string,
});

export async function POST(request: Request) {
  try {
    // 2. Recebe os dados do comprador que vieram do seu Frontend
    const body = await request.json();
    const { email, valor } = body;

    // 3. Monta o pacote de cobrança PIX
    const payment = new Payment(client);
    const requestOptions = {
      body: {
        transaction_amount: valor,
        description: "Assinatura do meu SaaS",
        payment_method_id: "pix",
        payer: {
          email: email,
        },
      },
    };

    // 4. Manda pro Mercado Pago gerar o código
    const result = await payment.create(requestOptions);

    // 5. Devolve o "Copia e Cola" e o link do QR Code pro seu Frontend mostrar na tela!
    return NextResponse.json({
      qr_code: result.point_of_interaction?.transaction_data?.qr_code,
      qr_code_base64:
        result.point_of_interaction?.transaction_data?.qr_code_base64,
      id_transacao: result.id,
    });
  } catch (error) {
    console.error("Erro ao gerar PIX:", error);
    return NextResponse.json(
      { error: "Falha ao gerar pagamento" },
      { status: 500 },
    );
  }
}

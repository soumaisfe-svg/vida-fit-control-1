import { NextRequest, NextResponse } from 'next/server';

// TOKEN DA PAGSEGURO – VALIDAÇÃO DO WEBHOOK
const PAGSEGURO_TOKEN = "036a6e8d-436c-46a2-80f5-410fbbb7cb41a5858aed451f97f6486ed2f647a6b0c16cc3-911e-41da-a20f-bf9d458afa76";

export async function POST(req: NextRequest) {
  try {
    // Validação do token
    const tokenRecebido = req.headers.get("x-auth-token") || req.nextUrl.searchParams.get("token");

    // Segurança: confirma que só o PagSeguro pode chamar
    if (tokenRecebido !== PAGSEGURO_TOKEN) {
      return NextResponse.json(
        { error: "Token inválido" },
        { status: 401 }
      );
    }

    const notificacao = await req.json();

    console.log("🔥 NOTIFICAÇÃO PAGSEGURO RECEBIDA:");
    console.log(JSON.stringify(notificacao, null, 2));

    // EXEMPLOS DE EVENTOS POSSÍVEIS:
    // assinatura criada
    // assinatura paga
    // pagamento recusado
    // assinatura cancelada

    let resposta = "Evento recebido";
    let statusCode = 200;

    // Processar eventos do PagSeguro
    if (notificacao.event === "subscription_charged") {
      resposta = "💰 Assinatura paga com sucesso";
      
      // Aqui você pode:
      // 1. Buscar o usuário pelo email/ID na notificação
      // 2. Atualizar o status isPremium no banco de dados
      // 3. Enviar email de confirmação
      
      // Exemplo de dados que você pode receber:
      const { customer, subscription } = notificacao;
      
      console.log("✅ Pagamento confirmado para:", customer?.email);
      console.log("📋 ID da assinatura:", subscription?.id);
      
      // TODO: Implementar lógica de ativação do Premium
      // await updateUserPremiumStatus(customer.email, true);
    }

    if (notificacao.event === "subscription_canceled") {
      resposta = "🚫 Assinatura cancelada";
      
      // Aqui você pode:
      // 1. Buscar o usuário
      // 2. Desativar o status Premium
      // 3. Enviar email de cancelamento
      
      console.log("❌ Assinatura cancelada");
      
      // TODO: Implementar lógica de desativação do Premium
      // await updateUserPremiumStatus(customer.email, false);
    }

    if (notificacao.event === "charge_failed") {
      resposta = "⚠️ Pagamento recusado";
      
      // Aqui você pode:
      // 1. Notificar o usuário sobre a falha
      // 2. Tentar cobrar novamente após alguns dias
      // 3. Enviar email com instruções
      
      console.log("⚠️ Falha no pagamento");
    }

    if (notificacao.event === "subscription_created") {
      resposta = "📝 Assinatura criada";
      
      console.log("📝 Nova assinatura criada");
    }

    return NextResponse.json({
      status: "ok",
      message: resposta,
      produto: "Viva Fit Control"
    }, { status: statusCode });

  } catch (error) {
    console.error("❌ Erro no webhook:", error);
    return NextResponse.json(
      { error: "Erro interno no processamento do webhook" },
      { status: 500 }
    );
  }
}

// Método GET para verificar se o webhook está ativo
export async function GET() {
  return NextResponse.json({
    status: "active",
    message: "Webhook PagSeguro está funcionando",
    produto: "Viva Fit Control"
  });
}

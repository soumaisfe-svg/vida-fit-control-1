import { NextRequest, NextResponse } from 'next/server';
import { dbHelpers } from '@/lib/db';

export async function POST(request: NextRequest) {
  try {
    const { userId, plan, paymentMethod } = await request.json();

    // Validação básica
    if (!userId || !plan || !paymentMethod) {
      return NextResponse.json(
        { success: false, error: 'Dados incompletos' },
        { status: 400 }
      );
    }

    // Determinar valor baseado no plano
    const prices: { [key: string]: number } = {
      'monthly': 5.00,
      'single': 10.00
    };

    const amount = prices[plan] || 0;

    // Criar assinatura
    const subscription = dbHelpers.createSubscription({
      userId,
      plan,
      amount,
      paymentMethod,
      status: 'pending'
    });

    // Em produção, aqui você integraria com Mercado Pago
    // const mercadoPagoResponse = await createMercadoPagoPayment(subscription);

    return NextResponse.json({
      success: true,
      subscriptionId: subscription.subscriptionId,
      amount: subscription.amount,
      paymentUrl: 'https://mercadopago.com.br/checkout/...',
      qrCode: 'data:image/png;base64,...', // QR Code do PIX
      message: 'Assinatura criada! Aguardando pagamento...'
    });

  } catch (error) {
    console.error('Erro ao criar assinatura:', error);
    return NextResponse.json(
      { success: false, error: 'Erro ao criar assinatura' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json(
        { success: false, error: 'userId é obrigatório' },
        { status: 400 }
      );
    }

    // Buscar assinaturas do usuário
    const userSubscriptions = dbHelpers.getSubscriptionsByUser(userId);

    return NextResponse.json({
      success: true,
      subscriptions: userSubscriptions
    });

  } catch (error) {
    console.error('Erro ao buscar assinaturas:', error);
    return NextResponse.json(
      { success: false, error: 'Erro ao buscar assinaturas' },
      { status: 500 }
    );
  }
}

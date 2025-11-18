import { NextRequest, NextResponse } from 'next/server';
import { dbHelpers } from '@/lib/db';

export async function POST(request: NextRequest) {
  try {
    const { subscriptionId, userId } = await request.json();

    // Validação básica
    if (!subscriptionId || !userId) {
      return NextResponse.json(
        { success: false, error: 'Dados incompletos' },
        { status: 400 }
      );
    }

    // Buscar assinatura
    const subscription = dbHelpers.findSubscriptionById(subscriptionId);

    if (!subscription) {
      return NextResponse.json(
        { success: false, error: 'Assinatura não encontrada' },
        { status: 404 }
      );
    }

    // Atualizar status da assinatura
    const updatedSubscription = dbHelpers.updateSubscription(subscriptionId, {
      status: 'active',
      confirmedAt: new Date().toISOString()
    });

    // Atualizar usuário para Premium
    dbHelpers.updateUser(userId, {
      isPremium: true,
      premiumSince: new Date().toISOString()
    });

    return NextResponse.json({
      success: true,
      subscription: updatedSubscription,
      message: 'Pagamento confirmado! Você agora é Premium! 🎉'
    });

  } catch (error) {
    console.error('Erro ao confirmar assinatura:', error);
    return NextResponse.json(
      { success: false, error: 'Erro ao confirmar pagamento' },
      { status: 500 }
    );
  }
}

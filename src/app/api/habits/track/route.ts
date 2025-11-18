import { NextRequest, NextResponse } from 'next/server';
import { dbHelpers } from '@/lib/db';

export async function POST(request: NextRequest) {
  try {
    const { userId, type, value, date } = await request.json();

    // Validação básica
    if (!userId || !type || value === undefined || !date) {
      return NextResponse.json(
        { success: false, error: 'Dados incompletos' },
        { status: 400 }
      );
    }

    // Criar registro de hábito
    const habitRecord = dbHelpers.createHabit({
      userId,
      type,
      value,
      date
    });

    return NextResponse.json({
      success: true,
      habit: habitRecord,
      message: 'Hábito registrado com sucesso!'
    });

  } catch (error) {
    console.error('Erro ao registrar hábito:', error);
    return NextResponse.json(
      { success: false, error: 'Erro ao registrar hábito' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    const date = searchParams.get('date');

    if (!userId) {
      return NextResponse.json(
        { success: false, error: 'userId é obrigatório' },
        { status: 400 }
      );
    }

    // Buscar hábitos do usuário
    const userHabits = dbHelpers.getHabitsByUser(userId, date || undefined);

    return NextResponse.json({
      success: true,
      habits: userHabits
    });

  } catch (error) {
    console.error('Erro ao buscar hábitos:', error);
    return NextResponse.json(
      { success: false, error: 'Erro ao buscar hábitos' },
      { status: 500 }
    );
  }
}

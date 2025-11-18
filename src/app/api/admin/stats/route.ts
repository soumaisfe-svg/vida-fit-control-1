import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET() {
  try {
    // Calcular estatísticas
    const totalUsers = db.users.length;
    const premiumUsers = db.users.filter(u => u.isPremium).length;
    const activeSubscriptions = db.subscriptions.filter(s => s.status === 'active').length;
    const totalReports = db.aiReports.length;
    const totalHabits = db.habits.length;

    return NextResponse.json({
      totalUsers,
      premiumUsers,
      activeSubscriptions,
      totalReports,
      totalHabits
    });
  } catch (error) {
    console.error('Erro ao buscar estatísticas:', error);
    return NextResponse.json(
      { error: 'Erro ao buscar estatísticas' },
      { status: 500 }
    );
  }
}

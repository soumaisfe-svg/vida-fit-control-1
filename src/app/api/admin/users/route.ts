import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET() {
  try {
    // Retornar todos os usuários (sem senha por segurança)
    const users = db.users.map(({ password, ...user }) => user);

    return NextResponse.json({
      users,
      total: users.length
    });
  } catch (error) {
    console.error('Erro ao buscar usuários:', error);
    return NextResponse.json(
      { error: 'Erro ao buscar usuários' },
      { status: 500 }
    );
  }
}

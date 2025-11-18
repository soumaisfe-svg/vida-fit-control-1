import { NextRequest, NextResponse } from 'next/server';
import { dbHelpers } from '@/lib/db';

export async function POST(request: NextRequest) {
  try {
    const { email, password, name } = await request.json();

    // Validação básica
    if (!email || !password || !name) {
      return NextResponse.json(
        { success: false, error: 'Todos os campos são obrigatórios' },
        { status: 400 }
      );
    }

    // Verificar se usuário já existe
    const existingUser = dbHelpers.findUserByEmail(email);
    if (existingUser) {
      return NextResponse.json(
        { success: false, error: 'Email já cadastrado' },
        { status: 400 }
      );
    }

    // Criar novo usuário
    const newUser = dbHelpers.createUser({
      email,
      name,
      password, // Em produção, use hash (bcrypt)
      isPremium: false,
      coins: 0
    });

    // Retornar usuário sem senha
    const { password: _, ...userWithoutPassword } = newUser;

    return NextResponse.json({
      success: true,
      user: userWithoutPassword,
      message: 'Conta criada com sucesso!'
    });

  } catch (error) {
    console.error('Erro ao registrar:', error);
    return NextResponse.json(
      { success: false, error: 'Erro ao criar conta' },
      { status: 500 }
    );
  }
}

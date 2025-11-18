import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

// Cliente admin com service role key
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  }
);

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();

    // Buscar usuário pelo email
    const { data: users, error: listError } = await supabaseAdmin.auth.admin.listUsers();
    
    if (listError) {
      return NextResponse.json(
        { error: listError.message },
        { status: 400 }
      );
    }

    const user = users.users.find(u => u.email === email);
    
    if (!user) {
      return NextResponse.json(
        { error: 'Usuário não encontrado' },
        { status: 404 }
      );
    }

    // Atualizar senha do usuário
    const { data, error } = await supabaseAdmin.auth.admin.updateUserById(
      user.id,
      { password }
    );

    if (error) {
      return NextResponse.json(
        { error: error.message },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Senha atualizada com sucesso!',
      user: {
        id: data.user.id,
        email: data.user.email
      }
    });

  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Erro ao atualizar senha' },
      { status: 500 }
    );
  }
}

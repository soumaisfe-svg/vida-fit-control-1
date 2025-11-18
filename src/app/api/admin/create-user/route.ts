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
    const { email, password, name } = await request.json();

    // Criar usuário com admin API (bypassa confirmação de email)
    const { data, error } = await supabaseAdmin.auth.admin.createUser({
      email,
      password,
      email_confirm: true, // Confirma email automaticamente
      user_metadata: {
        name: name || email.split('@')[0]
      }
    });

    if (error) {
      return NextResponse.json(
        { error: error.message },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Usuário criado e confirmado com sucesso!',
      user: {
        id: data.user.id,
        email: data.user.email
      }
    });

  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Erro ao criar usuário' },
      { status: 500 }
    );
  }
}

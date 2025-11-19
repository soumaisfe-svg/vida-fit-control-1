import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(req: NextRequest) {
  // Verificar se há um código de confirmação de email na URL
  const code = req.nextUrl.searchParams.get('code');
  
  if (code && req.nextUrl.pathname === '/') {
    // Se houver código na página inicial, redirecionar para a página de autenticação com onboarding
    const redirectUrl = new URL('/auth', req.url);
    redirectUrl.searchParams.set('onboarding', 'true');
    return NextResponse.redirect(redirectUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/',
    '/dashboard/:path*',
    '/habits/:path*',
    '/reports/:path*',
    '/profile/:path*',
    '/ai/:path*',
    '/focus/:path*',
  ],
};

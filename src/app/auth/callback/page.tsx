"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { Card } from '@/components/ui/card';
import { Heart, CheckCircle, Loader2 } from 'lucide-react';

export default function AuthCallbackPage() {
  const router = useRouter();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('Verificando sua confirmação...');

  useEffect(() => {
    const handleCallback = async () => {
      try {
        // Processar o callback de confirmação de email do Supabase
        const { data, error } = await supabase.auth.exchangeCodeForSession(window.location.search);

        if (error) {
          throw error;
        }

        if (data?.session) {
          setStatus('success');
          setMessage('Email confirmado com sucesso! Redirecionando para o login...');
          
          // Fazer logout para forçar novo login
          await supabase.auth.signOut();
          
          // Aguardar 2 segundos antes de redirecionar para a página de login
          setTimeout(() => {
            router.push('/auth/login');
          }, 2000);
        } else {
          throw new Error('Sessão não encontrada');
        }
      } catch (error) {
        console.error('Erro no callback:', error);
        setStatus('error');
        setMessage('Erro ao confirmar email. Tente fazer login novamente.');
        
        // Redirecionar para login após 3 segundos
        setTimeout(() => {
          router.push('/auth/login');
        }, 3000);
      }
    };

    handleCallback();
  }, [router]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-teal-50/30 to-white flex items-center justify-center p-4">
      {/* Header */}
      <div className="absolute top-0 left-0 right-0 border-b bg-white/80 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4 flex items-center justify-center">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-teal-400 to-teal-600 flex items-center justify-center">
              <Heart className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-teal-600 to-teal-500 bg-clip-text text-transparent">
              VivaFit Control
            </span>
          </div>
        </div>
      </div>

      {/* Status Card */}
      <Card className="w-full max-w-md p-8 shadow-2xl">
        <div className="text-center">
          {status === 'loading' && (
            <>
              <div className="w-16 h-16 rounded-full bg-teal-100 flex items-center justify-center mx-auto mb-4">
                <Loader2 className="w-8 h-8 text-teal-600 animate-spin" />
              </div>
              <h1 className="text-2xl font-bold mb-2">Verificando...</h1>
              <p className="text-gray-600">{message}</p>
            </>
          )}

          {status === 'success' && (
            <>
              <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-8 h-8 text-green-600" />
              </div>
              <h1 className="text-2xl font-bold mb-2 text-green-600">Sucesso!</h1>
              <p className="text-gray-600">{message}</p>
            </>
          )}

          {status === 'error' && (
            <>
              <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </div>
              <h1 className="text-2xl font-bold mb-2 text-red-600">Erro</h1>
              <p className="text-gray-600">{message}</p>
            </>
          )}
        </div>
      </Card>
    </div>
  );
}

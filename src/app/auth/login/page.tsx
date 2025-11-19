"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Heart, Mail, Lock, Loader2, AlertCircle } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (isSignUp) {
        // Cadastro
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: `${window.location.origin}/auth/callback`,
          },
        });

        if (error) throw error;

        if (data.user) {
          setError('');
          alert('Cadastro realizado! Verifique seu email para confirmar sua conta.');
          setIsSignUp(false);
          setEmail('');
          setPassword('');
        }
      } else {
        // Login
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (error) {
          // Verificar se é erro de email não confirmado
          if (error.message.includes('Email not confirmed') || 
              error.message.includes('email not confirmed')) {
            setError('Por favor, confirme seu email antes de fazer login. Verifique sua caixa de entrada e clique no link de confirmação.');
          } else {
            setError(error.message || 'Erro ao fazer login');
          }
          setLoading(false);
          return;
        }

        if (data.user && data.session) {
          // Verificar se já tem assinatura ativa
          const hasSubscription = localStorage.getItem('subscriptionActive') === 'true';
          
          if (hasSubscription) {
            // Se já pagou, vai direto pro dashboard
            router.push('/dashboard');
          } else {
            // Se não pagou, vai pro questionário primeiro
            router.push('/questionnaire');
          }
        }
      }
    } catch (error: any) {
      setError(error.message || 'Erro ao processar sua solicitação');
      setLoading(false);
    } finally {
      if (!error) {
        setLoading(false);
      }
    }
  };

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

      {/* Login/Signup Card */}
      <Card className="w-full max-w-md p-8 shadow-2xl">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2">
            {isSignUp ? 'Criar Conta' : 'Bem-vindo de volta!'}
          </h1>
          <p className="text-gray-600">
            {isSignUp
              ? 'Preencha os dados para criar sua conta'
              : 'Entre com suas credenciais para continuar'}
          </p>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-start gap-2">
            <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-red-600">{error}</p>
          </div>
        )}

        <form onSubmit={handleAuth} className="space-y-4">
          <div>
            <Label htmlFor="email" className="flex items-center gap-2 mb-2">
              <Mail className="w-4 h-4" />
              Email
            </Label>
            <Input
              id="email"
              type="email"
              placeholder="seu@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={loading}
            />
          </div>

          <div>
            <Label htmlFor="password" className="flex items-center gap-2 mb-2">
              <Lock className="w-4 h-4" />
              Senha
            </Label>
            <Input
              id="password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={loading}
              minLength={6}
            />
          </div>

          <Button
            type="submit"
            className="w-full bg-gradient-to-r from-teal-500 to-teal-600 hover:from-teal-600 hover:to-teal-700"
            disabled={loading}
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Processando...
              </>
            ) : (
              <>{isSignUp ? 'Criar Conta' : 'Entrar'}</>
            )}
          </Button>
        </form>

        <div className="mt-6 text-center">
          <button
            onClick={() => {
              setIsSignUp(!isSignUp);
              setError('');
            }}
            className="text-teal-600 hover:text-teal-700 text-sm font-medium"
            disabled={loading}
          >
            {isSignUp
              ? 'Já tem uma conta? Faça login'
              : 'Não tem uma conta? Cadastre-se'}
          </button>
        </div>
      </Card>
    </div>
  );
}

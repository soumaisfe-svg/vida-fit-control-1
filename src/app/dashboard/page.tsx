"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Heart, CreditCard, CheckCircle, Loader2, LogOut } from 'lucide-react';

interface UserProfile {
  age: number;
  weight: number;
  height: number;
  activity_level: string;
  goal: string;
  health_conditions: string;
  questionnaire_completed: boolean;
}

export default function DashboardPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [hasPaid, setHasPaid] = useState(false);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) {
        router.push('/auth/login');
        return;
      }

      // Buscar perfil do usuário
      const { data: profileData } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (!profileData?.questionnaire_completed) {
        router.push('/questionnaire');
        return;
      }

      setProfile(profileData);

      // Verificar status de pagamento (simulado)
      // Aqui você integraria com seu sistema de pagamento real
      const { data: paymentData } = await supabase
        .from('user_subscriptions')
        .select('status')
        .eq('user_id', user.id)
        .single();

      setHasPaid(paymentData?.status === 'active');
    } catch (error) {
      console.error('Erro ao verificar autenticação:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/auth/login');
  };

  const handlePayment = () => {
    // Aqui você redirecionaria para sua página de pagamento
    alert('Redirecionando para página de pagamento...');
    // router.push('/payment');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-white via-teal-50/30 to-white flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-teal-600 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-teal-50/30 to-white">
      {/* Header */}
      <div className="border-b bg-white/80 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-teal-400 to-teal-600 flex items-center justify-center">
              <Heart className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-teal-600 to-teal-500 bg-clip-text text-transparent">
              VivaFit Control
            </span>
          </div>
          <Button
            onClick={handleLogout}
            variant="outline"
            size="sm"
            className="flex items-center gap-2"
          >
            <LogOut className="w-4 h-4" />
            Sair
          </Button>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto space-y-6">
          {/* Welcome Card */}
          <Card className="p-6 shadow-lg">
            <h1 className="text-3xl font-bold mb-2">Bem-vindo ao seu Dashboard!</h1>
            <p className="text-gray-600">
              Aqui você terá acesso a todas as suas métricas personalizadas
            </p>
          </Card>

          {/* Profile Summary */}
          {profile && (
            <Card className="p-6 shadow-lg">
              <h2 className="text-xl font-bold mb-4">Seu Perfil</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600">Idade</p>
                  <p className="text-lg font-semibold">{profile.age} anos</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Peso</p>
                  <p className="text-lg font-semibold">{profile.weight} kg</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Altura</p>
                  <p className="text-lg font-semibold">{profile.height} cm</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Objetivo</p>
                  <p className="text-lg font-semibold capitalize">
                    {profile.goal.replace('_', ' ')}
                  </p>
                </div>
              </div>
            </Card>
          )}

          {/* Payment Status */}
          {!hasPaid ? (
            <Card className="p-6 shadow-lg border-2 border-teal-200 bg-teal-50/50">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-full bg-teal-100 flex items-center justify-center flex-shrink-0">
                  <CreditCard className="w-6 h-6 text-teal-600" />
                </div>
                <div className="flex-1">
                  <h2 className="text-xl font-bold mb-2">Complete sua Assinatura</h2>
                  <p className="text-gray-600 mb-4">
                    Para ter acesso completo às suas métricas personalizadas e acompanhamento,
                    complete o pagamento da sua assinatura.
                  </p>
                  <Button
                    onClick={handlePayment}
                    className="bg-gradient-to-r from-teal-500 to-teal-600 hover:from-teal-600 hover:to-teal-700"
                  >
                    <CreditCard className="w-4 h-4 mr-2" />
                    Ir para Pagamento
                  </Button>
                </div>
              </div>
            </Card>
          ) : (
            <Card className="p-6 shadow-lg border-2 border-green-200 bg-green-50/50">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                  <CheckCircle className="w-6 h-6 text-green-600" />
                </div>
                <div className="flex-1">
                  <h2 className="text-xl font-bold mb-2">Assinatura Ativa</h2>
                  <p className="text-gray-600">
                    Sua assinatura está ativa! Aproveite todas as funcionalidades do VivaFit Control.
                  </p>
                </div>
              </div>
            </Card>
          )}

          {/* Metrics Preview */}
          <Card className="p-6 shadow-lg">
            <h2 className="text-xl font-bold mb-4">Suas Métricas</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 bg-teal-50 rounded-lg">
                <p className="text-sm text-gray-600 mb-1">IMC</p>
                <p className="text-2xl font-bold text-teal-600">
                  {profile ? (profile.weight / Math.pow(profile.height / 100, 2)).toFixed(1) : '-'}
                </p>
              </div>
              <div className="p-4 bg-blue-50 rounded-lg">
                <p className="text-sm text-gray-600 mb-1">Meta Calórica</p>
                <p className="text-2xl font-bold text-blue-600">
                  {hasPaid ? '2000 kcal' : '🔒'}
                </p>
              </div>
              <div className="p-4 bg-purple-50 rounded-lg">
                <p className="text-sm text-gray-600 mb-1">Progresso</p>
                <p className="text-2xl font-bold text-purple-600">
                  {hasPaid ? '75%' : '🔒'}
                </p>
              </div>
            </div>
            {!hasPaid && (
              <p className="text-sm text-gray-500 mt-4 text-center">
                Complete o pagamento para desbloquear todas as métricas
              </p>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
}

"use client";

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Heart, Check, CreditCard, Shield, Zap, ArrowRight, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function PaymentPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState<'pending' | 'processing' | 'success' | 'error'>('pending');

  // Verificar se usuário já pagou
  useEffect(() => {
    const hasPaid = localStorage.getItem('subscriptionActive');
    if (hasPaid === 'true') {
      router.push('/dashboard');
    }
  }, [router]);

  const handlePayment = async () => {
    setLoading(true);
    setPaymentStatus('processing');

    // Redirecionar para o link de pagamento do PagSeguro
    // Substitua pelo seu link real de pagamento do PagSeguro
    const pagSeguroLink = 'https://pag.ae/81djx3ANK';
    
    // Salvar tentativa de pagamento
    localStorage.setItem('paymentAttempt', 'true');
    localStorage.setItem('paymentTimestamp', new Date().toISOString());
    
    // Redirecionar para PagSeguro
    window.location.href = pagSeguroLink;
  };

  if (paymentStatus === 'success') {
    return (
      <div className="min-h-screen bg-gradient-to-b from-white via-teal-50/30 to-white flex items-center justify-center p-4">
        <Card className="w-full max-w-md p-8 text-center shadow-2xl">
          <div className="w-20 h-20 rounded-full bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center mx-auto mb-6">
            <Check className="w-10 h-10 text-white" />
          </div>
          <h2 className="text-3xl font-bold mb-4">Pagamento Confirmado! 🎉</h2>
          <p className="text-gray-600 mb-6">
            Sua assinatura foi ativada com sucesso. Redirecionando para o dashboard...
          </p>
          <div className="flex justify-center">
            <Loader2 className="w-8 h-8 animate-spin text-teal-600" />
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-teal-50/30 to-white">
      {/* Header */}
      <div className="border-b bg-white/80 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-teal-400 to-teal-600 flex items-center justify-center">
              <Heart className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-teal-600 to-teal-500 bg-clip-text text-transparent">
              VivaFit Control
            </span>
          </Link>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 py-12 max-w-4xl">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Finalize sua Assinatura
          </h1>
          <p className="text-xl text-gray-600">
            Apenas R$ 5,00/mês para transformar sua saúde
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 mb-12">
          {/* Plano */}
          <Card className="p-8 shadow-2xl border-2 border-teal-500 relative overflow-hidden">
            <div className="absolute top-0 right-0 bg-gradient-to-br from-teal-500 to-teal-600 text-white px-4 py-1 text-sm font-bold rounded-bl-lg">
              MELHOR VALOR
            </div>
            
            <div className="mb-6">
              <h3 className="text-2xl font-bold mb-2">Plano Mensal</h3>
              <div className="flex items-baseline gap-2">
                <span className="text-5xl font-bold bg-gradient-to-r from-teal-600 to-teal-500 bg-clip-text text-transparent">
                  R$ 5
                </span>
                <span className="text-gray-600">/mês</span>
              </div>
            </div>

            <div className="space-y-4 mb-8">
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-teal-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Check className="w-4 h-4 text-teal-600" />
                </div>
                <div>
                  <p className="font-semibold">Contador de Calorias Inteligente</p>
                  <p className="text-sm text-gray-600">Acompanhe sua alimentação diária</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-teal-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Check className="w-4 h-4 text-teal-600" />
                </div>
                <div>
                  <p className="font-semibold">Painel de Hábitos</p>
                  <p className="text-sm text-gray-600">Crie e monitore hábitos saudáveis</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-teal-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Check className="w-4 h-4 text-teal-600" />
                </div>
                <div>
                  <p className="font-semibold">IA Personalizada</p>
                  <p className="text-sm text-gray-600">Assistente inteligente 24/7</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-teal-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Check className="w-4 h-4 text-teal-600" />
                </div>
                <div>
                  <p className="font-semibold">Relatórios Semanais</p>
                  <p className="text-sm text-gray-600">Insights sobre seu progresso</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-teal-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Check className="w-4 h-4 text-teal-600" />
                </div>
                <div>
                  <p className="font-semibold">Modo Foco</p>
                  <p className="text-sm text-gray-600">Exercícios de respiração guiada</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-teal-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Check className="w-4 h-4 text-teal-600" />
                </div>
                <div>
                  <p className="font-semibold">Perfil Personalizado</p>
                  <p className="text-sm text-gray-600">Métricas e acompanhamento completo</p>
                </div>
              </div>
            </div>

            <Button
              onClick={handlePayment}
              disabled={loading}
              className="w-full bg-gradient-to-r from-teal-500 to-teal-600 hover:from-teal-600 hover:to-teal-700 text-white shadow-lg shadow-teal-500/30"
              size="lg"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  Redirecionando...
                </>
              ) : (
                <>
                  <CreditCard className="w-5 h-5 mr-2" />
                  Assinar Agora
                  <ArrowRight className="w-5 h-5 ml-2" />
                </>
              )}
            </Button>
          </Card>

          {/* Benefícios */}
          <div className="space-y-6">
            <Card className="p-6 shadow-lg">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-teal-400 to-teal-600 flex items-center justify-center flex-shrink-0">
                  <Shield className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h4 className="font-bold text-lg mb-2">Pagamento Seguro</h4>
                  <p className="text-gray-600 text-sm">
                    Processado pelo PagSeguro, uma das plataformas de pagamento mais seguras do Brasil.
                  </p>
                </div>
              </div>
            </Card>

            <Card className="p-6 shadow-lg">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-400 to-purple-600 flex items-center justify-center flex-shrink-0">
                  <Zap className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h4 className="font-bold text-lg mb-2">Acesso Imediato</h4>
                  <p className="text-gray-600 text-sm">
                    Assim que o pagamento for confirmado, você terá acesso instantâneo a todas as funcionalidades.
                  </p>
                </div>
              </div>
            </Card>

            <Card className="p-6 shadow-lg">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center flex-shrink-0">
                  <Check className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h4 className="font-bold text-lg mb-2">Cancele Quando Quiser</h4>
                  <p className="text-gray-600 text-sm">
                    Sem compromisso de longo prazo. Cancele sua assinatura a qualquer momento.
                  </p>
                </div>
              </div>
            </Card>

            <div className="p-6 rounded-xl bg-gradient-to-br from-teal-50 to-teal-100 border-2 border-teal-200">
              <p className="text-center text-teal-800 font-semibold mb-2">
                💰 Investimento Mínimo, Resultados Máximos
              </p>
              <p className="text-center text-sm text-teal-700">
                Menos de R$ 0,17 por dia para transformar sua saúde e bem-estar!
              </p>
            </div>
          </div>
        </div>

        {/* FAQ */}
        <Card className="p-8 shadow-lg">
          <h3 className="text-2xl font-bold mb-6 text-center">Perguntas Frequentes</h3>
          <div className="space-y-4">
            <div>
              <h4 className="font-semibold mb-2">❓ Por que preciso pagar?</h4>
              <p className="text-gray-600 text-sm">
                O VivaFit Control é uma plataforma profissional com IA avançada, armazenamento seguro e atualizações constantes. 
                O valor de R$ 5,00/mês é simbólico e garante a sustentabilidade do serviço.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-2">❓ Posso testar antes de pagar?</h4>
              <p className="text-gray-600 text-sm">
                Não oferecemos período de teste gratuito. O valor é extremamente acessível (R$ 5,00/mês) 
                para garantir usuários comprometidos com sua transformação.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-2">❓ Como funciona a cobrança?</h4>
              <p className="text-gray-600 text-sm">
                A cobrança é mensal e automática via PagSeguro. Você receberá um e-mail antes de cada renovação.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-2">❓ Posso cancelar a qualquer momento?</h4>
              <p className="text-gray-600 text-sm">
                Sim! Você pode cancelar sua assinatura a qualquer momento sem multas ou taxas adicionais.
              </p>
            </div>
          </div>
        </Card>

        {/* Garantia */}
        <div className="mt-8 text-center">
          <div className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-green-100 border-2 border-green-300">
            <Shield className="w-5 h-5 text-green-600" />
            <span className="font-semibold text-green-800">
              Pagamento 100% Seguro via PagSeguro
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

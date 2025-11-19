"use client";

import { useState, useEffect, Suspense } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Heart, Mail, Lock, User, ArrowRight, ArrowLeft, AlertCircle } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';
import { hasMasterAccess, setMasterAccess, MASTER_CREDENTIALS } from '@/lib/masterAccess';

// Componente de loading para o Suspense
function AuthLoading() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-teal-50/30 to-white flex items-center justify-center p-4">
      <Card className="w-full max-w-md p-6 sm:p-8 shadow-2xl">
        <div className="text-center">
          <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-gradient-to-br from-teal-400 to-teal-600 flex items-center justify-center mx-auto mb-4 animate-pulse">
            <Heart className="w-7 h-7 sm:w-8 sm:h-8 text-white" />
          </div>
          <p className="text-gray-600">Carregando...</p>
        </div>
      </Card>
    </div>
  );
}

// Componente interno que usa useSearchParams
function AuthContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isLogin, setIsLogin] = useState(true);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [onboardingStep, setOnboardingStep] = useState(1);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  // Dados do questionário de onboarding
  const [onboardingData, setOnboardingData] = useState({
    age: '',
    gender: '',
    height: '',
    weight: '',
    goalWeight: '',
    activityLevel: '',
    goal: '',
    dietaryRestrictions: '',
    sleepHours: '',
    waterIntake: '',
    exerciseFrequency: '',
    healthConditions: ''
  });

  // Verificar se deve mostrar onboarding após confirmação de email
  useEffect(() => {
    const onboarding = searchParams.get('onboarding');
    if (onboarding === 'true') {
      setShowOnboarding(true);
    }
  }, [searchParams]);

  // Verificar se o Supabase está configurado ao montar o componente
  useEffect(() => {
    if (!isSupabaseConfigured()) {
      setError('⚠️ Sistema de autenticação não configurado. Por favor, configure as variáveis de ambiente do Supabase ou clique no banner laranja acima para conectar sua conta.');
    }
  }, []);

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccessMessage('');
    setLoading(true);

    try {
      if (!isSupabaseConfigured()) {
        throw new Error('Sistema de autenticação não configurado. Configure as variáveis de ambiente do Supabase.');
      }

      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth/reset-password`,
      });

      if (error) {
        if (error.message.includes('Failed to fetch') || error.message.includes('fetch')) {
          throw new Error('Erro de conexão. Verifique sua internet e tente novamente.');
        }
        throw error;
      }

      setSuccessMessage('Email de recuperação enviado! Verifique sua caixa de entrada.');
      setTimeout(() => {
        setShowForgotPassword(false);
        setSuccessMessage('');
      }, 3000);
    } catch (error: any) {
      console.error('Erro ao enviar email:', error);
      setError(error.message || 'Erro ao enviar email de recuperação');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccessMessage('');
    setLoading(true);
    
    try {
      if (isLogin) {
        // Verificar se é login com credenciais master
        if (email.toLowerCase() === MASTER_CREDENTIALS.email.toLowerCase() && 
            password === MASTER_CREDENTIALS.password) {
          // Login master - bypass Supabase
          setMasterAccess(email);
          setSuccessMessage('✅ Login master realizado com sucesso!');
          setTimeout(() => {
            router.push('/dashboard');
          }, 1000);
          return;
        }

        // Verificar se o Supabase está configurado para login normal
        if (!isSupabaseConfigured()) {
          throw new Error('⚠️ Sistema de autenticação não configurado.\n\nPara usar o sistema de autenticação, você precisa:\n\n1. Conectar sua conta Supabase clicando no banner laranja acima, OU\n2. Configurar as variáveis de ambiente:\n   - NEXT_PUBLIC_SUPABASE_URL\n   - NEXT_PUBLIC_SUPABASE_ANON_KEY\n\nSem essas configurações, o login não funcionará.');
        }

        // Login com Supabase
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (error) {
          // Mensagens de erro mais amigáveis
          if (error.message.includes('Invalid login credentials')) {
            throw new Error('Email ou senha incorretos. Verifique suas credenciais e tente novamente.');
          } else if (error.message.includes('Email not confirmed')) {
            throw new Error('Por favor, confirme seu email antes de fazer login. Verifique sua caixa de entrada.');
          } else if (error.message.includes('Failed to fetch') || error.message.includes('fetch') || error.message.includes('NetworkError')) {
            throw new Error('Erro de conexão com o servidor. Verifique sua internet e tente novamente.');
          } else {
            throw error;
          }
        }

        if (data.user) {
          // Verificar se é um usuário master
          if (hasMasterAccess(email)) {
            setMasterAccess(email);
            router.push('/dashboard');
            return;
          }
          
          // Verificar se já preencheu o questionário
          const hasCompletedQuestionnaire = localStorage.getItem('questionnaireCompleted');
          
          if (hasCompletedQuestionnaire === 'true') {
            // Se já preencheu o questionário, verificar assinatura
            const hasSubscription = localStorage.getItem('subscriptionActive');
            if (hasSubscription === 'true') {
              router.push('/dashboard');
            } else {
              router.push('/payment');
            }
          } else {
            // Se não preencheu o questionário, redirecionar para ele
            setShowOnboarding(true);
          }
        }
      } else {
        // Validação de senha antes de cadastrar
        if (password.length < 6) {
          throw new Error('A senha deve ter pelo menos 6 caracteres.');
        }

        // Verificar se o Supabase está configurado
        if (!isSupabaseConfigured()) {
          throw new Error('⚠️ Sistema de autenticação não configurado.\n\nPara criar uma conta, você precisa:\n\n1. Conectar sua conta Supabase clicando no banner laranja acima, OU\n2. Configurar as variáveis de ambiente:\n   - NEXT_PUBLIC_SUPABASE_URL\n   - NEXT_PUBLIC_SUPABASE_ANON_KEY');
        }

        // Cadastro com Supabase
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              name: name,
            },
            emailRedirectTo: `${window.location.origin}/auth/callback`,
          },
        });

        if (error) {
          // Mensagens de erro mais amigáveis para cadastro
          if (error.message.includes('User already registered')) {
            throw new Error('Este email já está cadastrado. Faça login ou recupere sua senha.');
          } else if (error.message.includes('Password should be at least')) {
            throw new Error('A senha deve ter pelo menos 6 caracteres.');
          } else if (error.message.includes('Failed to fetch') || error.message.includes('fetch') || error.message.includes('NetworkError')) {
            throw new Error('Erro de conexão com o servidor. Verifique sua internet e tente novamente.');
          } else {
            throw error;
          }
        }

        if (data.user) {
          setSuccessMessage('Cadastro realizado! Verifique seu email para confirmar sua conta.');
          // Limpar campos
          setEmail('');
          setPassword('');
          setName('');
        }
      }
    } catch (error: any) {
      console.error('Erro na autenticação:', error);
      setError(error.message || 'Erro ao processar sua solicitação');
    } finally {
      setLoading(false);
    }
  };

  const handleOnboardingNext = () => {
    if (onboardingStep < 4) {
      setOnboardingStep(onboardingStep + 1);
    } else {
      // Salvar dados e marcar questionário como completo
      localStorage.setItem('userProfile', JSON.stringify({
        name,
        email,
        ...onboardingData
      }));
      localStorage.setItem('questionnaireCompleted', 'true');
      // Ir para página de pagamento
      router.push('/payment');
    }
  };

  const handleOnboardingBack = () => {
    if (onboardingStep > 1) {
      setOnboardingStep(onboardingStep - 1);
    }
  };

  if (showOnboarding) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-white via-teal-50/30 to-white flex items-center justify-center p-4 sm:p-6 md:p-8">
        <Card className="w-full max-w-2xl p-4 sm:p-6 md:p-8 shadow-2xl">
          {/* Progress Bar */}
          <div className="mb-6 sm:mb-8">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs sm:text-sm font-medium text-gray-600">Passo {onboardingStep} de 4</span>
              <span className="text-xs sm:text-sm font-medium text-teal-600">{(onboardingStep / 4 * 100).toFixed(0)}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-gradient-to-r from-teal-500 to-teal-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${(onboardingStep / 4) * 100}%` }}
              />
            </div>
          </div>

          {/* Step 1: Dados Físicos */}
          {onboardingStep === 1 && (
            <div className="space-y-4 sm:space-y-6">
              <div className="text-center mb-4 sm:mb-6">
                <h2 className="text-2xl sm:text-3xl font-bold mb-2">Vamos conhecer você! 👋</h2>
                <p className="text-sm sm:text-base text-gray-600">Precisamos de algumas informações para personalizar sua experiência</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                <div className="space-y-2">
                  <Label htmlFor="age" className="text-sm sm:text-base">Idade</Label>
                  <Input
                    id="age"
                    type="number"
                    placeholder="Ex: 25"
                    value={onboardingData.age}
                    onChange={(e) => setOnboardingData({...onboardingData, age: e.target.value})}
                    required
                    className="text-sm sm:text-base"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="gender" className="text-sm sm:text-base">Sexo</Label>
                  <select
                    id="gender"
                    className="w-full px-3 py-2 text-sm sm:text-base border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
                    value={onboardingData.gender}
                    onChange={(e) => setOnboardingData({...onboardingData, gender: e.target.value})}
                    required
                  >
                    <option value="">Selecione</option>
                    <option value="male">Masculino</option>
                    <option value="female">Feminino</option>
                    <option value="other">Outro</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="height" className="text-sm sm:text-base">Altura (cm)</Label>
                  <Input
                    id="height"
                    type="number"
                    placeholder="Ex: 170"
                    value={onboardingData.height}
                    onChange={(e) => setOnboardingData({...onboardingData, height: e.target.value})}
                    required
                    className="text-sm sm:text-base"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="weight" className="text-sm sm:text-base">Peso Atual (kg)</Label>
                  <Input
                    id="weight"
                    type="number"
                    placeholder="Ex: 70"
                    value={onboardingData.weight}
                    onChange={(e) => setOnboardingData({...onboardingData, weight: e.target.value})}
                    required
                    className="text-sm sm:text-base"
                  />
                </div>

                <div className="space-y-2 sm:col-span-2">
                  <Label htmlFor="goalWeight" className="text-sm sm:text-base">Peso Desejado (kg)</Label>
                  <Input
                    id="goalWeight"
                    type="number"
                    placeholder="Ex: 65"
                    value={onboardingData.goalWeight}
                    onChange={(e) => setOnboardingData({...onboardingData, goalWeight: e.target.value})}
                    required
                    className="text-sm sm:text-base"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Objetivos e Atividade */}
          {onboardingStep === 2 && (
            <div className="space-y-4 sm:space-y-6">
              <div className="text-center mb-4 sm:mb-6">
                <h2 className="text-2xl sm:text-3xl font-bold mb-2">Seus objetivos 🎯</h2>
                <p className="text-sm sm:text-base text-gray-600">Vamos entender o que você busca alcançar</p>
              </div>

              <div className="space-y-3 sm:space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="goal" className="text-sm sm:text-base">Qual é seu principal objetivo?</Label>
                  <select
                    id="goal"
                    className="w-full px-3 py-2 text-sm sm:text-base border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
                    value={onboardingData.goal}
                    onChange={(e) => setOnboardingData({...onboardingData, goal: e.target.value})}
                    required
                  >
                    <option value="">Selecione</option>
                    <option value="lose_weight">Perder peso</option>
                    <option value="gain_weight">Ganhar peso</option>
                    <option value="maintain">Manter peso</option>
                    <option value="muscle">Ganhar massa muscular</option>
                    <option value="health">Melhorar saúde geral</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="activityLevel" className="text-sm sm:text-base">Nível de atividade física</Label>
                  <select
                    id="activityLevel"
                    className="w-full px-3 py-2 text-sm sm:text-base border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
                    value={onboardingData.activityLevel}
                    onChange={(e) => setOnboardingData({...onboardingData, activityLevel: e.target.value})}
                    required
                  >
                    <option value="">Selecione</option>
                    <option value="sedentary">Sedentário (pouco ou nenhum exercício)</option>
                    <option value="light">Leve (exercício 1-3 dias/semana)</option>
                    <option value="moderate">Moderado (exercício 3-5 dias/semana)</option>
                    <option value="active">Ativo (exercício 6-7 dias/semana)</option>
                    <option value="very_active">Muito ativo (exercício intenso diariamente)</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="exerciseFrequency" className="text-sm sm:text-base">Quantas vezes por semana você se exercita?</Label>
                  <Input
                    id="exerciseFrequency"
                    type="number"
                    placeholder="Ex: 3"
                    value={onboardingData.exerciseFrequency}
                    onChange={(e) => setOnboardingData({...onboardingData, exerciseFrequency: e.target.value})}
                    required
                    className="text-sm sm:text-base"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Hábitos de Saúde */}
          {onboardingStep === 3 && (
            <div className="space-y-4 sm:space-y-6">
              <div className="text-center mb-4 sm:mb-6">
                <h2 className="text-2xl sm:text-3xl font-bold mb-2">Seus hábitos 💪</h2>
                <p className="text-sm sm:text-base text-gray-600">Informações sobre sua rotina diária</p>
              </div>

              <div className="space-y-3 sm:space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="sleepHours" className="text-sm sm:text-base">Quantas horas você dorme por noite?</Label>
                  <Input
                    id="sleepHours"
                    type="number"
                    step="0.5"
                    placeholder="Ex: 7.5"
                    value={onboardingData.sleepHours}
                    onChange={(e) => setOnboardingData({...onboardingData, sleepHours: e.target.value})}
                    required
                    className="text-sm sm:text-base"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="waterIntake" className="text-sm sm:text-base">Quantos litros de água você bebe por dia?</Label>
                  <Input
                    id="waterIntake"
                    type="number"
                    step="0.1"
                    placeholder="Ex: 2.0"
                    value={onboardingData.waterIntake}
                    onChange={(e) => setOnboardingData({...onboardingData, waterIntake: e.target.value})}
                    required
                    className="text-sm sm:text-base"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="dietaryRestrictions" className="text-sm sm:text-base">Restrições alimentares (opcional)</Label>
                  <Input
                    id="dietaryRestrictions"
                    type="text"
                    placeholder="Ex: Vegetariano, intolerância à lactose..."
                    value={onboardingData.dietaryRestrictions}
                    onChange={(e) => setOnboardingData({...onboardingData, dietaryRestrictions: e.target.value})}
                    className="text-sm sm:text-base"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Step 4: Condições de Saúde */}
          {onboardingStep === 4 && (
            <div className="space-y-4 sm:space-y-6">
              <div className="text-center mb-4 sm:mb-6">
                <h2 className="text-2xl sm:text-3xl font-bold mb-2">Quase lá! 🎉</h2>
                <p className="text-sm sm:text-base text-gray-600">Últimas informações para personalizar sua experiência</p>
              </div>

              <div className="space-y-3 sm:space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="healthConditions" className="text-sm sm:text-base">Condições de saúde ou observações (opcional)</Label>
                  <textarea
                    id="healthConditions"
                    className="w-full px-3 py-2 text-sm sm:text-base border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 min-h-[100px]"
                    placeholder="Ex: Diabetes, hipertensão, alergias..."
                    value={onboardingData.healthConditions}
                    onChange={(e) => setOnboardingData({...onboardingData, healthConditions: e.target.value})}
                  />
                </div>

                <div className="p-3 sm:p-4 rounded-xl bg-teal-50 border border-teal-200">
                  <p className="text-xs sm:text-sm text-teal-800">
                    🔒 <strong>Privacidade:</strong> Seus dados são privados e seguros. Usamos essas informações apenas para personalizar sua experiência e fornecer recomendações mais precisas.
                  </p>
                </div>

                <div className="p-3 sm:p-4 rounded-xl bg-gradient-to-br from-purple-50 to-purple-100 border-2 border-purple-200">
                  <p className="text-center text-sm sm:text-base text-purple-800 font-semibold mb-2">
                    💳 Próximo Passo: Pagamento
                  </p>
                  <p className="text-center text-xs sm:text-sm text-purple-700">
                    Após finalizar o questionário, você será direcionado para a página de pagamento seguro (R$ 5,00/mês)
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mt-6 sm:mt-8">
            {onboardingStep > 1 && (
              <Button
                onClick={handleOnboardingBack}
                variant="outline"
                size="lg"
                className="w-full sm:flex-1 text-sm sm:text-base"
              >
                <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                Voltar
              </Button>
            )}
            <Button
              onClick={handleOnboardingNext}
              size="lg"
              className="w-full sm:flex-1 bg-gradient-to-r from-teal-500 to-teal-600 hover:from-teal-600 hover:to-teal-700 text-white shadow-lg shadow-teal-500/30 text-sm sm:text-base"
            >
              {onboardingStep === 4 ? 'Ir para Pagamento' : 'Próximo'}
              <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 ml-2" />
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  // Tela de recuperação de senha
  if (showForgotPassword) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-white via-teal-50/30 to-white flex items-center justify-center p-4">
        {/* Header */}
        <div className="absolute top-0 left-0 right-0 border-b bg-white/80 backdrop-blur-sm z-10">
          <div className="container mx-auto px-4 py-3 sm:py-4 flex items-center justify-between">
            <button 
              onClick={() => router.push('/')}
              className="flex items-center gap-2"
            >
              <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-2xl bg-gradient-to-br from-teal-400 to-teal-600 flex items-center justify-center">
                <Heart className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
              </div>
              <span className="text-lg sm:text-2xl font-bold bg-gradient-to-r from-teal-600 to-teal-500 bg-clip-text text-transparent">
                VivaFit Control
              </span>
            </button>
            <Button 
              variant="ghost"
              onClick={() => setShowForgotPassword(false)}
              className="text-sm sm:text-base"
            >
              Voltar
            </Button>
          </div>
        </div>

        {/* Forgot Password Card */}
        <Card className="w-full max-w-md p-6 sm:p-8 shadow-2xl mt-20 sm:mt-24">
          <div className="text-center mb-6 sm:mb-8">
            <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-gradient-to-br from-teal-400 to-teal-600 flex items-center justify-center mx-auto mb-4">
              <Mail className="w-7 h-7 sm:w-8 sm:h-8 text-white" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold mb-2">Recuperar senha</h1>
            <p className="text-sm sm:text-base text-gray-600">
              Digite seu email e enviaremos um link para redefinir sua senha
            </p>
          </div>

          {/* Mensagens de erro e sucesso */}
          {error && (
            <div className="mb-4 p-3 rounded-lg bg-red-50 border border-red-200">
              <div className="flex items-start gap-2">
                <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                <p className="text-xs sm:text-sm text-red-600 whitespace-pre-line">{error}</p>
              </div>
            </div>
          )}

          {successMessage && (
            <div className="mb-4 p-3 rounded-lg bg-green-50 border border-green-200">
              <p className="text-xs sm:text-sm text-green-600">{successMessage}</p>
            </div>
          )}

          <form onSubmit={handleForgotPassword} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm sm:text-base">E-mail</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-gray-400" />
                <Input
                  id="email"
                  type="email"
                  placeholder="seu@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-9 sm:pl-10 text-sm sm:text-base"
                  required
                />
              </div>
            </div>

            <Button
              type="submit"
              className="w-full bg-gradient-to-r from-teal-500 to-teal-600 hover:from-teal-600 hover:to-teal-700 text-white shadow-lg shadow-teal-500/30 text-sm sm:text-base"
              size="lg"
              disabled={loading}
            >
              {loading ? 'Enviando...' : 'Enviar link de recuperação'}
              {!loading && <ArrowRight className="ml-2 w-4 h-4 sm:w-5 sm:h-5" />}
            </Button>
          </form>

          <div className="mt-6">
            <Button
              onClick={() => setShowForgotPassword(false)}
              variant="outline"
              className="w-full text-sm sm:text-base"
            >
              Voltar para login
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-teal-50/30 to-white flex items-center justify-center p-4">
      {/* Header */}
      <div className="absolute top-0 left-0 right-0 border-b bg-white/80 backdrop-blur-sm z-10">
        <div className="container mx-auto px-4 py-3 sm:py-4 flex items-center justify-between">
          <button 
            onClick={() => router.push('/')}
            className="flex items-center gap-2"
          >
            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-2xl bg-gradient-to-br from-teal-400 to-teal-600 flex items-center justify-center">
              <Heart className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
            </div>
            <span className="text-lg sm:text-2xl font-bold bg-gradient-to-r from-teal-600 to-teal-500 bg-clip-text text-transparent">
              VivaFit Control
            </span>
          </button>
          <Button 
            variant="ghost"
            onClick={() => router.push('/')}
            className="text-sm sm:text-base"
          >
            Voltar
          </Button>
        </div>
      </div>

      {/* Auth Card */}
      <Card className="w-full max-w-md p-6 sm:p-8 shadow-2xl mt-20 sm:mt-24">
        <div className="text-center mb-6 sm:mb-8">
          <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-gradient-to-br from-teal-400 to-teal-600 flex items-center justify-center mx-auto mb-4">
            <Heart className="w-7 h-7 sm:w-8 sm:h-8 text-white" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold mb-2">
            {isLogin ? 'Bem-vindo de volta!' : 'Crie sua conta'}
          </h1>
          <p className="text-sm sm:text-base text-gray-600">
            {isLogin 
              ? 'Entre para continuar sua jornada de bem-estar' 
              : 'Comece sua transformação hoje mesmo'}
          </p>
        </div>

        {/* Mensagens de erro e sucesso */}
        {error && (
          <div className="mb-4 p-3 rounded-lg bg-red-50 border border-red-200">
            <div className="flex items-start gap-2">
              <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
              <p className="text-xs sm:text-sm text-red-600 whitespace-pre-line">{error}</p>
            </div>
          </div>
        )}

        {successMessage && (
          <div className="mb-4 p-3 rounded-lg bg-green-50 border border-green-200">
            <p className="text-xs sm:text-sm text-green-600">{successMessage}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {!isLogin && (
            <div className="space-y-2">
              <Label htmlFor="name" className="text-sm sm:text-base">Nome completo</Label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-gray-400" />
                <Input
                  id="name"
                  type="text"
                  placeholder="Seu nome"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="pl-9 sm:pl-10 text-sm sm:text-base"
                  required
                />
              </div>
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="email" className="text-sm sm:text-base">E-mail</Label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-gray-400" />
              <Input
                id="email"
                type="email"
                placeholder="seu@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="pl-9 sm:pl-10 text-sm sm:text-base"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="password" className="text-sm sm:text-base">Senha</Label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-gray-400" />
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="pl-9 sm:pl-10 text-sm sm:text-base"
                required
              />
            </div>
          </div>

          {isLogin && (
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-0 text-xs sm:text-sm">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" className="rounded border-gray-300" />
                <span className="text-gray-600">Lembrar de mim</span>
              </label>
              <button
                type="button"
                onClick={() => setShowForgotPassword(true)}
                className="text-teal-600 hover:text-teal-700 font-medium text-left sm:text-right"
              >
                Esqueceu a senha?
              </button>
            </div>
          )}

          <Button
            type="submit"
            className="w-full bg-gradient-to-r from-teal-500 to-teal-600 hover:from-teal-600 hover:to-teal-700 text-white shadow-lg shadow-teal-500/30 text-sm sm:text-base"
            size="lg"
            disabled={loading}
          >
            {loading ? 'Processando...' : (isLogin ? 'Entrar' : 'Criar conta')}
            {!loading && <ArrowRight className="ml-2 w-4 h-4 sm:w-5 sm:h-5" />}
          </Button>
        </form>

        {/* Botão de alternância entre Login e Cadastro - DESTACADO PARA MOBILE */}
        <div className="mt-6">
          <Button
            onClick={() => {
              setIsLogin(!isLogin);
              setError('');
              setSuccessMessage('');
            }}
            variant="outline"
            className="w-full border-2 border-teal-500 text-teal-600 hover:bg-teal-50 font-semibold text-sm sm:text-base"
            size="lg"
          >
            {isLogin ? 'Criar nova conta' : 'Já tenho conta - Fazer login'}
          </Button>
        </div>

        <div className="mt-6 sm:mt-8 pt-6 border-t">
          <p className="text-center text-xs sm:text-sm text-gray-500 mb-4">Ou continue com</p>
          <div className="grid grid-cols-2 gap-3">
            <Button variant="outline" className="w-full text-xs sm:text-sm">
              <svg className="w-4 h-4 sm:w-5 sm:h-5 mr-2" viewBox="0 0 24 24">
                <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              Google
            </Button>
            <Button variant="outline" className="w-full text-xs sm:text-sm">
              <svg className="w-4 h-4 sm:w-5 sm:h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
              </svg>
              Facebook
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}

// Componente principal exportado com Suspense
export default function AuthPage() {
  return (
    <Suspense fallback={<AuthLoading />}>
      <AuthContent />
    </Suspense>
  );
}

"use client";

import { useEffect, useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Heart, 
  Flame, 
  TrendingUp, 
  Target, 
  Activity,
  Brain,
  BarChart3,
  Focus,
  User,
  Calendar,
  ArrowRight,
  Plus,
  LogOut
} from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { checkMasterAccess } from '@/lib/masterAccess';

export default function DashboardPage() {
  const router = useRouter();
  const [userName, setUserName] = useState('');
  const [userProfile, setUserProfile] = useState<any>(null);

  useEffect(() => {
    // Verificar se tem acesso master
    const isMaster = checkMasterAccess();
    
    // Verificar se tem assinatura ativa
    const hasSubscription = localStorage.getItem('subscriptionActive');
    
    if (!isMaster && hasSubscription !== 'true') {
      router.push('/payment');
      return;
    }

    // Carregar dados do perfil
    const profile = localStorage.getItem('userProfile');
    if (profile) {
      const data = JSON.parse(profile);
      setUserName(data.name || 'Usuário');
      setUserProfile(data);
    }
  }, [router]);

  const handleLogout = () => {
    // Limpar dados do localStorage
    localStorage.removeItem('subscriptionActive');
    localStorage.removeItem('userProfile');
    localStorage.removeItem('userEmail');
    localStorage.removeItem('masterAccess');
    
    // Redirecionar para página inicial
    router.push('/');
  };

  const quickStats = [
    {
      label: 'Calorias Hoje',
      value: '1,850',
      target: '2,000',
      icon: Flame,
      color: 'from-orange-400 to-red-500',
      progress: 92.5
    },
    {
      label: 'Peso Atual',
      value: userProfile?.weight ? `${userProfile.weight}kg` : '70kg',
      target: userProfile?.goalWeight ? `${userProfile.goalWeight}kg` : '65kg',
      icon: TrendingUp,
      color: 'from-teal-400 to-teal-600',
      progress: 75
    },
    {
      label: 'Hábitos Hoje',
      value: '5/8',
      target: 'completos',
      icon: Target,
      color: 'from-purple-400 to-purple-600',
      progress: 62.5
    },
    {
      label: 'Atividade',
      value: '45min',
      target: '60min',
      icon: Activity,
      color: 'from-green-400 to-green-600',
      progress: 75
    }
  ];

  const features = [
    {
      title: 'Contador de Calorias',
      description: 'Acompanhe sua alimentação diária',
      icon: Flame,
      color: 'from-orange-400 to-red-500',
      href: '/app'
    },
    {
      title: 'Painel de Hábitos',
      description: 'Crie e monitore hábitos saudáveis',
      icon: Target,
      color: 'from-purple-400 to-purple-600',
      href: '/habits'
    },
    {
      title: 'IA Personalizada',
      description: 'Assistente inteligente 24/7',
      icon: Brain,
      color: 'from-blue-400 to-blue-600',
      href: '/ai'
    },
    {
      title: 'Relatórios Semanais',
      description: 'Insights sobre seu progresso',
      icon: BarChart3,
      color: 'from-teal-400 to-teal-600',
      href: '/reports'
    },
    {
      title: 'Modo Foco',
      description: 'Exercícios de respiração guiada',
      icon: Focus,
      color: 'from-pink-400 to-pink-600',
      href: '/focus'
    },
    {
      title: 'Meu Perfil',
      description: 'Métricas e configurações',
      icon: User,
      color: 'from-indigo-400 to-indigo-600',
      href: '/profile'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-teal-50/30 to-white">
      {/* Header */}
      <div className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-teal-400 to-teal-600 flex items-center justify-center">
                <Heart className="w-6 h-6 text-white" />
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-teal-600 to-teal-500 bg-clip-text text-transparent">
                VivaFit Control
              </span>
            </Link>
            <div className="flex items-center gap-4">
              <Link href="/profile">
                <Button variant="ghost" size="sm">
                  <User className="w-5 h-5 mr-2" />
                  {userName}
                </Button>
              </Link>
              <Button 
                variant="outline" 
                size="sm"
                onClick={handleLogout}
                className="border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700"
              >
                <LogOut className="w-5 h-5 mr-2" />
                Sair
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">
            Olá, {userName}! 👋
          </h1>
          <p className="text-gray-600 text-lg">
            Bem-vindo ao seu painel de controle de saúde e bem-estar
          </p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {quickStats.map((stat, index) => (
            <Card key={index} className="p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-start justify-between mb-4">
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center`}>
                  <stat.icon className="w-6 h-6 text-white" />
                </div>
                <span className="text-sm text-gray-500">{stat.progress}%</span>
              </div>
              <h3 className="text-sm font-medium text-gray-600 mb-1">{stat.label}</h3>
              <div className="flex items-baseline gap-2 mb-3">
                <span className="text-2xl font-bold">{stat.value}</span>
                <span className="text-sm text-gray-500">/ {stat.target}</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className={`bg-gradient-to-r ${stat.color} h-2 rounded-full transition-all duration-300`}
                  style={{ width: `${stat.progress}%` }}
                />
              </div>
            </Card>
          ))}
        </div>

        {/* Today's Summary */}
        <Card className="p-6 mb-8 bg-gradient-to-br from-teal-50 to-teal-100 border-2 border-teal-200">
          <div className="flex items-center gap-3 mb-4">
            <Calendar className="w-6 h-6 text-teal-600" />
            <h2 className="text-xl font-bold">Resumo de Hoje</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-4">
            <div className="bg-white/80 backdrop-blur-sm rounded-xl p-4">
              <p className="text-sm text-gray-600 mb-1">Refeições Registradas</p>
              <p className="text-2xl font-bold text-teal-600">3/5</p>
            </div>
            <div className="bg-white/80 backdrop-blur-sm rounded-xl p-4">
              <p className="text-sm text-gray-600 mb-1">Água Consumida</p>
              <p className="text-2xl font-bold text-blue-600">1.5L / 2.0L</p>
            </div>
            <div className="bg-white/80 backdrop-blur-sm rounded-xl p-4">
              <p className="text-sm text-gray-600 mb-1">Passos</p>
              <p className="text-2xl font-bold text-purple-600">7,234 / 10,000</p>
            </div>
          </div>
        </Card>

        {/* Features Grid */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-6">Suas Ferramentas</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <Link key={index} href={feature.href}>
                <Card className="p-6 hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 cursor-pointer group">
                  <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${feature.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                    <feature.icon className="w-7 h-7 text-white" />
                  </div>
                  <h3 className="text-xl font-bold mb-2 group-hover:text-teal-600 transition-colors">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 mb-4">{feature.description}</p>
                  <div className="flex items-center text-teal-600 font-semibold group-hover:gap-3 transition-all">
                    Acessar
                    <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                  </div>
                </Card>
              </Link>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <Card className="p-6">
          <h2 className="text-xl font-bold mb-4">Ações Rápidas</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            <Link href="/app">
              <Button className="w-full bg-gradient-to-r from-orange-400 to-red-500 hover:from-orange-500 hover:to-red-600 text-white">
                <Plus className="w-5 h-5 mr-2" />
                Adicionar Refeição
              </Button>
            </Link>
            <Link href="/habits">
              <Button className="w-full bg-gradient-to-r from-purple-400 to-purple-600 hover:from-purple-500 hover:to-purple-700 text-white">
                <Target className="w-5 h-5 mr-2" />
                Marcar Hábito
              </Button>
            </Link>
            <Link href="/ai">
              <Button className="w-full bg-gradient-to-r from-blue-400 to-blue-600 hover:from-blue-500 hover:to-blue-700 text-white">
                <Brain className="w-5 h-5 mr-2" />
                Consultar IA
              </Button>
            </Link>
            <Link href="/focus">
              <Button className="w-full bg-gradient-to-r from-pink-400 to-pink-600 hover:from-pink-500 hover:to-pink-700 text-white">
                <Focus className="w-5 h-5 mr-2" />
                Modo Foco
              </Button>
            </Link>
          </div>
        </Card>
      </div>
    </div>
  );
}

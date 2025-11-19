"use client";

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Heart, Droplets, Moon, TrendingUp, Sparkles, Check, Star, Zap, Shield, Award, Flame } from 'lucide-react';
import Link from 'next/link';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-teal-50/30 to-white">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-teal-400 to-teal-600 flex items-center justify-center">
              <Heart className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-teal-600 to-teal-500 bg-clip-text text-transparent">
              VivaFit Control
            </span>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/auth">
              <Button variant="ghost" className="hidden sm:inline-flex">
                Entrar
              </Button>
            </Link>
            <Link href="/auth">
              <Button className="bg-gradient-to-r from-teal-500 to-teal-600 hover:from-teal-600 hover:to-teal-700 text-white shadow-lg shadow-teal-500/30">
                Assinar por R$ 5/mês
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20 md:py-32">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="space-y-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-teal-100 text-teal-700 text-sm font-medium">
              <Sparkles className="w-4 h-4" />
              Mais de 10.000 usuários transformando suas vidas
            </div>
            
            <h1 className="text-5xl md:text-6xl font-bold leading-tight">
              Transforme sua rotina em{' '}
              <span className="bg-gradient-to-r from-teal-600 to-teal-500 bg-clip-text text-transparent">
                equilíbrio
              </span>
            </h1>
            
            <p className="text-xl text-gray-600 leading-relaxed">
              Controle suas calorias, melhore seus hábitos e receba relatórios inteligentes. 
              Viva com mais leveza e praticidade.
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/auth" className="flex-1 sm:flex-initial">
                <Button size="lg" className="w-full sm:w-auto bg-gradient-to-r from-teal-500 to-teal-600 hover:from-teal-600 hover:to-teal-700 text-white shadow-xl shadow-teal-500/30 text-lg px-8 py-6">
                  Assinar Agora
                  <Zap className="ml-2 w-5 h-5" />
                </Button>
              </Link>
              <Button size="lg" variant="outline" className="w-full sm:w-auto border-2 border-teal-200 hover:bg-teal-50 text-lg px-8 py-6">
                Ver Demonstração
              </Button>
            </div>

            <div className="flex items-center gap-8 pt-4">
              <div className="flex items-center gap-2">
                <div className="flex -space-x-2">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="w-10 h-10 rounded-full bg-gradient-to-br from-teal-400 to-teal-600 border-2 border-white" />
                  ))}
                </div>
                <div className="text-sm">
                  <div className="font-semibold text-gray-900">10k+ usuários</div>
                  <div className="text-gray-500">ativos hoje</div>
                </div>
              </div>
              <div className="flex items-center gap-1">
                {[1, 2, 3, 4, 5].map((i) => (
                  <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                ))}
                <span className="ml-2 text-sm font-semibold text-gray-900">4.9/5</span>
              </div>
            </div>
          </div>

          <div className="relative">
            <div className="relative z-10 bg-gradient-to-br from-teal-500 to-teal-600 rounded-3xl shadow-2xl shadow-teal-500/40 p-8 transform rotate-2 hover:rotate-0 transition-transform duration-300">
              <div className="bg-white rounded-2xl p-6 space-y-6 transform -rotate-2">
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-bold text-gray-900">Hoje</h3>
                  <span className="text-sm text-teal-600 font-medium">85% completo</span>
                </div>
                
                <div className="space-y-4">
                  <HabitCard icon={Flame} label="Calorias" value="1.850" goal="2.000" color="orange" />
                  <HabitCard icon={TrendingUp} label="Passos" value="8.432" goal="10.000" color="teal" />
                  <HabitCard icon={Droplets} label="Água" value="1.8L" goal="2.5L" color="blue" />
                  <HabitCard icon={Moon} label="Sono" value="7h 30m" goal="8h" color="purple" />
                </div>

                <div className="pt-4 border-t">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Moedas de Energia</span>
                    <span className="font-bold text-teal-600 flex items-center gap-1">
                      <Award className="w-4 h-4" />
                      245
                    </span>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Decorative elements */}
            <div className="absolute -top-4 -right-4 w-24 h-24 bg-teal-200 rounded-full blur-3xl opacity-50" />
            <div className="absolute -bottom-4 -left-4 w-32 h-32 bg-teal-300 rounded-full blur-3xl opacity-40" />
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gradient-to-b from-white to-teal-50/50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              O que é o <span className="text-teal-600">VivaFit Control</span>?
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Uma plataforma completa para transformar seus hábitos em resultados reais
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <FeatureCard
              icon={Flame}
              title="Contador de Calorias"
              description="Acompanhe sua alimentação diária com precisão. Registre refeições e monitore seu consumo calórico em tempo real."
              color="orange"
            />
            <FeatureCard
              icon={Heart}
              title="Painel de Hábitos"
              description="Acompanhe passos, água, sono, humor e alimentação em um só lugar. Visualize seu progresso com gráficos inteligentes."
              color="teal"
            />
            <FeatureCard
              icon={Sparkles}
              title="IA Personalizada"
              description="Faça perguntas e receba relatórios personalizados sobre saúde, nutrição e bem-estar gerados por inteligência artificial."
              color="purple"
            />
            <FeatureCard
              icon={Award}
              title="Gamificação"
              description="Ganhe moedas de energia, desbloqueie conquistas e mantenha-se motivado com nosso sistema de recompensas."
              color="yellow"
            />
            <FeatureCard
              icon={TrendingUp}
              title="Relatórios Semanais"
              description="Receba análises automáticas toda sexta-feira com insights sobre seu progresso e sugestões personalizadas."
              color="blue"
            />
            <FeatureCard
              icon={Shield}
              title="Modo Foco"
              description="Sessões guiadas de respiração e meditação de 5 minutos para momentos de autocuidado."
              color="green"
            />
          </div>
        </div>
      </section>

      {/* How it Works */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              Como funciona a <span className="text-teal-600">IA</span>?
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Tecnologia avançada para respostas personalizadas
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <StepCard
              number="1"
              title="Faça sua pergunta"
              description="Digite qualquer dúvida sobre saúde, nutrição, sono ou bem-estar"
            />
            <StepCard
              number="2"
              title="IA analisa"
              description="Nossa inteligência artificial processa sua pergunta e gera um relatório completo"
            />
            <StepCard
              number="3"
              title="Receba insights"
              description="Obtenha recomendações personalizadas e salve no seu histórico"
            />
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="py-20 bg-gradient-to-b from-teal-50/50 to-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              Plano <span className="text-teal-600">Premium</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Acesso completo por apenas R$ 5,00 por mês
            </p>
          </div>

          <div className="max-w-md mx-auto">
            <PricingCard
              name="Premium"
              price="R$ 5"
              period="por mês"
              features={[
                'Contador de calorias ilimitado',
                'Painel completo de hábitos',
                'Histórico sem limites',
                'Relatórios semanais automáticos',
                'IA personalizada incluída',
                'Modo respiração e foco',
                'Notificações personalizadas',
                'Suporte prioritário'
              ]}
              cta="Assinar Agora"
              variant="primary"
              popular
            />
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              O que dizem nossos <span className="text-teal-600">usuários</span>
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <TestimonialCard
              name="Maria Silva"
              role="Professora"
              text="O VivaFit mudou minha rotina! Consigo acompanhar meus hábitos facilmente e os relatórios da IA são incríveis."
              rating={5}
            />
            <TestimonialCard
              name="João Santos"
              role="Desenvolvedor"
              text="A gamificação me mantém motivado todos os dias. Já perdi 8kg em 3 meses usando o app!"
              rating={5}
            />
            <TestimonialCard
              name="Ana Costa"
              role="Designer"
              text="Interface linda e funcional. O modo foco me ajuda muito nos momentos de ansiedade."
              rating={5}
            />
          </div>
        </div>
      </section>

      {/* CTA Final */}
      <section className="py-20 bg-gradient-to-br from-teal-500 to-teal-600">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Comece sua transformação hoje
          </h2>
          <p className="text-xl text-teal-50 mb-8 max-w-2xl mx-auto">
            Junte-se a milhares de pessoas que já estão vivendo com mais equilíbrio e bem-estar
          </p>
          <Link href="/auth">
            <Button size="lg" className="bg-white text-teal-600 hover:bg-teal-50 shadow-xl text-lg px-12 py-6">
              Assinar por R$ 5/mês
              <Zap className="ml-2 w-5 h-5" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 py-12">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-teal-400 to-teal-600 flex items-center justify-center">
                  <Heart className="w-5 h-5 text-white" />
                </div>
                <span className="text-white font-bold">VivaFit Control</span>
              </div>
              <p className="text-sm">
                Controle sua vida com praticidade e inteligência.
              </p>
            </div>
            
            <div>
              <h4 className="text-white font-semibold mb-4">Produto</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:text-teal-400 transition-colors">Funcionalidades</a></li>
                <li><a href="#" className="hover:text-teal-400 transition-colors">Preços</a></li>
                <li><a href="#" className="hover:text-teal-400 transition-colors">FAQ</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-white font-semibold mb-4">Empresa</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:text-teal-400 transition-colors">Sobre</a></li>
                <li><a href="#" className="hover:text-teal-400 transition-colors">Blog</a></li>
                <li><a href="#" className="hover:text-teal-400 transition-colors">Contato</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-white font-semibold mb-4">Legal</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:text-teal-400 transition-colors">Privacidade</a></li>
                <li><a href="#" className="hover:text-teal-400 transition-colors">Termos</a></li>
                <li><a href="#" className="hover:text-teal-400 transition-colors">Cookies</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-12 pt-8 text-center text-sm">
            <p>© 2024 VivaFit Control. Todos os direitos reservados.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

// Components
function HabitCard({ icon: Icon, label, value, goal, color }: any) {
  const colors: any = {
    teal: 'bg-teal-100 text-teal-600',
    blue: 'bg-blue-100 text-blue-600',
    purple: 'bg-purple-100 text-purple-600',
    pink: 'bg-pink-100 text-pink-600',
    orange: 'bg-orange-100 text-orange-600'
  };

  return (
    <div className="flex items-center gap-3 p-3 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors">
      <div className={`w-10 h-10 rounded-lg ${colors[color]} flex items-center justify-center`}>
        <Icon className="w-5 h-5" />
      </div>
      <div className="flex-1">
        <div className="text-sm text-gray-600">{label}</div>
        <div className="font-semibold text-gray-900">{value} <span className="text-xs text-gray-500">/ {goal}</span></div>
      </div>
    </div>
  );
}

function FeatureCard({ icon: Icon, title, description, color }: any) {
  const colors: any = {
    teal: 'from-teal-500 to-teal-600',
    purple: 'from-purple-500 to-purple-600',
    yellow: 'from-yellow-500 to-yellow-600',
    blue: 'from-blue-500 to-blue-600',
    green: 'from-green-500 to-green-600',
    orange: 'from-orange-500 to-orange-600'
  };

  return (
    <Card className="p-6 hover:shadow-xl transition-all duration-300 border-2 hover:border-teal-200">
      <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${colors[color]} flex items-center justify-center mb-4`}>
        <Icon className="w-6 h-6 text-white" />
      </div>
      <h3 className="text-xl font-bold mb-2 text-gray-900">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </Card>
  );
}

function StepCard({ number, title, description }: any) {
  return (
    <div className="text-center">
      <div className="w-16 h-16 rounded-full bg-gradient-to-br from-teal-500 to-teal-600 text-white text-2xl font-bold flex items-center justify-center mx-auto mb-4 shadow-lg shadow-teal-500/30">
        {number}
      </div>
      <h3 className="text-xl font-bold mb-2 text-gray-900">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </div>
  );
}

function PricingCard({ name, price, period, features, cta, variant, popular }: any) {
  return (
    <Card className={`p-8 relative ${popular ? 'border-2 border-teal-500 shadow-xl shadow-teal-500/20' : ''}`}>
      {popular && (
        <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-gradient-to-r from-teal-500 to-teal-600 text-white px-4 py-1 rounded-full text-sm font-semibold">
          Mais Popular
        </div>
      )}
      
      <div className="text-center mb-6">
        <h3 className="text-2xl font-bold mb-2 text-gray-900">{name}</h3>
        <div className="text-4xl font-bold text-teal-600 mb-1">{price}</div>
        <div className="text-sm text-gray-500">{period}</div>
      </div>

      <ul className="space-y-3 mb-8">
        {features.map((feature: string, i: number) => (
          <li key={i} className="flex items-start gap-2">
            <Check className="w-5 h-5 text-teal-600 flex-shrink-0 mt-0.5" />
            <span className="text-gray-600">{feature}</span>
          </li>
        ))}
      </ul>

      <Link href="/auth">
        <Button 
          className={`w-full ${
            variant === 'primary' 
              ? 'bg-gradient-to-r from-teal-500 to-teal-600 hover:from-teal-600 hover:to-teal-700 text-white shadow-lg shadow-teal-500/30' 
              : 'border-2 border-teal-200 hover:bg-teal-50'
          }`}
          variant={variant === 'primary' ? 'default' : 'outline'}
        >
          {cta}
        </Button>
      </Link>
    </Card>
  );
}

function TestimonialCard({ name, role, text, rating }: any) {
  return (
    <Card className="p-6 hover:shadow-xl transition-shadow">
      <div className="flex gap-1 mb-4">
        {[...Array(rating)].map((_, i) => (
          <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
        ))}
      </div>
      <p className="text-gray-600 mb-4 italic">&quot;{text}&quot;</p>
      <div>
        <div className="font-semibold text-gray-900">{name}</div>
        <div className="text-sm text-gray-500">{role}</div>
      </div>
    </Card>
  );
}

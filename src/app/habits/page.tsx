"use client";

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Heart, TrendingUp, Droplets, Moon, Utensils, Dumbbell, Check, Plus, Calendar, Smartphone, Activity, Clock, Zap, AlertCircle, CheckCircle } from 'lucide-react';
import Link from 'next/link';

interface ManualActivity {
  duration: number; // minutos
  intensity: 'light' | 'moderate' | 'intense';
}

export default function HabitsPage() {
  const [habits, setHabits] = useState([
    { id: 1, name: 'Passos', icon: TrendingUp, current: 0, goal: 10000, unit: 'passos', color: 'teal' },
    { id: 2, name: 'Água', icon: Droplets, current: 1.8, goal: 2.5, unit: 'L', color: 'blue' },
    { id: 3, name: 'Sono', icon: Moon, current: 7.5, goal: 8, unit: 'horas', color: 'purple' },
    { id: 4, name: 'Refeições', icon: Utensils, current: 3, goal: 5, unit: 'refeições', color: 'orange' },
    { id: 5, name: 'Exercícios', icon: Dumbbell, current: 30, goal: 60, unit: 'min', color: 'green' },
  ]);

  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  
  // Estados para sistema de passos
  const [stepPermission, setStepPermission] = useState<'pending' | 'granted' | 'denied'>('pending');
  const [showStepModal, setShowStepModal] = useState(false);
  const [showManualActivity, setShowManualActivity] = useState(false);
  const [manualActivity, setManualActivity] = useState<ManualActivity>({ duration: 20, intensity: 'moderate' });
  const [isTrackingSteps, setIsTrackingSteps] = useState(false);

  // Verificar permissão de sensores ao carregar
  useEffect(() => {
    const savedPermission = localStorage.getItem('stepPermission');
    if (savedPermission) {
      setStepPermission(savedPermission as 'granted' | 'denied');
      if (savedPermission === 'granted') {
        startStepTracking();
      }
    } else {
      // Mostrar modal de permissão na primeira vez
      setShowStepModal(true);
    }

    // Carregar passos salvos do dia
    const savedSteps = localStorage.getItem(`steps_${selectedDate}`);
    if (savedSteps) {
      updateHabitValue(1, parseInt(savedSteps));
    }
  }, []);

  // Função para solicitar permissão e iniciar rastreamento
  const requestStepPermission = async () => {
    try {
      // Verificar se o navegador suporta sensores
      if ('Accelerometer' in window || 'LinearAccelerationSensor' in window) {
        // Solicitar permissão
        if (typeof (DeviceMotionEvent as any).requestPermission === 'function') {
          // iOS 13+ requer permissão explícita
          const permission = await (DeviceMotionEvent as any).requestPermission();
          if (permission === 'granted') {
            setStepPermission('granted');
            localStorage.setItem('stepPermission', 'granted');
            startStepTracking();
            setShowStepModal(false);
          } else {
            setStepPermission('denied');
            localStorage.setItem('stepPermission', 'denied');
            setShowManualActivity(true);
          }
        } else {
          // Android e outros navegadores
          setStepPermission('granted');
          localStorage.setItem('stepPermission', 'granted');
          startStepTracking();
          setShowStepModal(false);
        }
      } else {
        // Navegador não suporta sensores
        setStepPermission('denied');
        localStorage.setItem('stepPermission', 'denied');
        setShowManualActivity(true);
        setShowStepModal(false);
      }
    } catch (error) {
      console.error('Erro ao solicitar permissão:', error);
      setStepPermission('denied');
      localStorage.setItem('stepPermission', 'denied');
      setShowManualActivity(true);
      setShowStepModal(false);
    }
  };

  // Função para iniciar rastreamento de passos
  const startStepTracking = () => {
    setIsTrackingSteps(true);
    
    // Simular contagem de passos (em produção, usar acelerômetro real)
    // Este é um exemplo simplificado - em produção, você usaria algoritmos mais complexos
    let stepCount = habits.find(h => h.id === 1)?.current || 0;
    
    // Verificar se há API de pedômetro nativa (alguns dispositivos Android)
    if ('Pedometer' in window) {
      // @ts-ignore
      const pedometer = new Pedometer();
      pedometer.start();
      pedometer.addEventListener('reading', (event: any) => {
        stepCount = event.steps;
        updateHabitValue(1, stepCount);
        localStorage.setItem(`steps_${selectedDate}`, stepCount.toString());
      });
    } else {
      // Fallback: usar acelerômetro para detectar passos
      if ('Accelerometer' in window) {
        try {
          // @ts-ignore
          const accelerometer = new Accelerometer({ frequency: 60 });
          let lastY = 0;
          let stepThreshold = 1.2;
          
          accelerometer.addEventListener('reading', () => {
            // @ts-ignore
            const currentY = accelerometer.y;
            
            // Detectar pico de aceleração (passo)
            if (Math.abs(currentY - lastY) > stepThreshold) {
              stepCount++;
              updateHabitValue(1, stepCount);
              localStorage.setItem(`steps_${selectedDate}`, stepCount.toString());
            }
            
            lastY = currentY;
          });
          
          accelerometer.start();
        } catch (error) {
          console.error('Erro ao iniciar acelerômetro:', error);
        }
      }
    }
  };

  // Função para negar permissão
  const denyStepPermission = () => {
    setStepPermission('denied');
    localStorage.setItem('stepPermission', 'denied');
    setShowStepModal(false);
    setShowManualActivity(true);
  };

  // Função para registrar atividade manual
  const registerManualActivity = () => {
    const { duration, intensity } = manualActivity;
    
    // Estimativa de passos baseada em tempo e intensidade
    // Fonte: estudos de biomecânica (valores médios)
    const stepsPerMinute = {
      light: 80,      // Caminhada leve
      moderate: 120,  // Caminhada moderada
      intense: 160    // Corrida leve
    };
    
    const estimatedSteps = duration * stepsPerMinute[intensity];
    const currentSteps = habits.find(h => h.id === 1)?.current || 0;
    const newSteps = currentSteps + estimatedSteps;
    
    updateHabitValue(1, newSteps);
    localStorage.setItem(`steps_${selectedDate}`, newSteps.toString());
    setShowManualActivity(false);
    
    // Resetar formulário
    setManualActivity({ duration: 20, intensity: 'moderate' });
  };

  const updateHabit = (id: number, increment: number) => {
    setHabits(habits.map(habit => 
      habit.id === id 
        ? { ...habit, current: Math.max(0, Math.min(habit.current + increment, habit.goal * 1.5)) }
        : habit
    ));
  };

  const updateHabitValue = (id: number, value: number) => {
    setHabits(habits.map(habit => 
      habit.id === id 
        ? { ...habit, current: value }
        : habit
    ));
  };

  const getProgressPercentage = (current: number, goal: number) => {
    return Math.min((current / goal) * 100, 100);
  };

  const getColorClasses = (color: string) => {
    const colors: any = {
      teal: { bg: 'bg-teal-100', text: 'text-teal-600', progress: 'bg-teal-500' },
      blue: { bg: 'bg-blue-100', text: 'text-blue-600', progress: 'bg-blue-500' },
      purple: { bg: 'bg-purple-100', text: 'text-purple-600', progress: 'bg-purple-500' },
      orange: { bg: 'bg-orange-100', text: 'text-orange-600', progress: 'bg-orange-500' },
      green: { bg: 'bg-green-100', text: 'text-green-600', progress: 'bg-green-500' },
    };
    return colors[color];
  };

  const totalProgress = habits.reduce((acc, habit) => acc + getProgressPercentage(habit.current, habit.goal), 0) / habits.length;

  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-teal-50/30 to-white">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/dashboard" className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-purple-400 to-purple-600 flex items-center justify-center">
              <Heart className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-purple-500 bg-clip-text text-transparent">
              Painel de Hábitos
            </span>
          </Link>
          <Link href="/dashboard">
            <Button variant="ghost">
              Voltar
            </Button>
          </Link>
        </div>
      </header>

      {/* Modal de Permissão de Passos */}
      {showStepModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <Card className="max-w-md w-full p-8 animate-in fade-in slide-in-from-bottom-4 duration-300">
            <div className="text-center mb-6">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-teal-400 to-teal-600 flex items-center justify-center mx-auto mb-4">
                <Smartphone className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-2xl font-bold mb-2">Rastreamento Automático de Passos</h2>
              <p className="text-gray-600">
                Deseja permitir que o app acesse os sensores do seu celular para contar seus passos automaticamente?
              </p>
            </div>

            <div className="space-y-4 mb-6">
              <div className="flex items-start gap-3 p-4 rounded-xl bg-teal-50 border border-teal-200">
                <CheckCircle className="w-5 h-5 text-teal-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-teal-900 mb-1">Contagem Automática</p>
                  <p className="text-sm text-teal-700">Seus passos serão contados automaticamente durante o dia</p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-4 rounded-xl bg-teal-50 border border-teal-200">
                <CheckCircle className="w-5 h-5 text-teal-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-teal-900 mb-1">Dados Precisos</p>
                  <p className="text-sm text-teal-700">Sincronização com os sensores do celular</p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-4 rounded-xl bg-teal-50 border border-teal-200">
                <CheckCircle className="w-5 h-5 text-teal-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-teal-900 mb-1">Privacidade</p>
                  <p className="text-sm text-teal-700">Os dados ficam apenas no seu dispositivo</p>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <Button 
                onClick={requestStepPermission}
                className="w-full bg-gradient-to-r from-teal-500 to-teal-600 hover:from-teal-600 hover:to-teal-700 text-white"
                size="lg"
              >
                <Smartphone className="w-5 h-5 mr-2" />
                Permitir Acesso aos Sensores
              </Button>
              
              <Button 
                onClick={denyStepPermission}
                variant="outline"
                className="w-full"
                size="lg"
              >
                Registrar Manualmente
              </Button>
            </div>

            <p className="text-xs text-gray-500 text-center mt-4">
              Você pode alterar essa configuração a qualquer momento
            </p>
          </Card>
        </div>
      )}

      {/* Modal de Atividade Manual */}
      {showManualActivity && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <Card className="max-w-md w-full p-8 animate-in fade-in slide-in-from-bottom-4 duration-300">
            <div className="text-center mb-6">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center mx-auto mb-4">
                <Activity className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-2xl font-bold mb-2">Registrar Atividade Física</h2>
              <p className="text-gray-600">
                Informe o tempo e intensidade da sua caminhada para estimarmos os passos
              </p>
            </div>

            <div className="space-y-6 mb-6">
              {/* Duração */}
              <div>
                <label className="block text-sm font-semibold mb-3 text-gray-700">
                  <Clock className="w-4 h-4 inline mr-2" />
                  Duração da Atividade
                </label>
                <div className="flex items-center gap-4">
                  <input
                    type="range"
                    min="5"
                    max="120"
                    step="5"
                    value={manualActivity.duration}
                    onChange={(e) => setManualActivity({ ...manualActivity, duration: parseInt(e.target.value) })}
                    className="flex-1"
                  />
                  <span className="text-2xl font-bold text-teal-600 w-20 text-right">
                    {manualActivity.duration} min
                  </span>
                </div>
              </div>

              {/* Intensidade */}
              <div>
                <label className="block text-sm font-semibold mb-3 text-gray-700">
                  <Zap className="w-4 h-4 inline mr-2" />
                  Intensidade
                </label>
                <div className="grid grid-cols-3 gap-3">
                  <button
                    onClick={() => setManualActivity({ ...manualActivity, intensity: 'light' })}
                    className={`p-4 rounded-xl border-2 transition-all ${
                      manualActivity.intensity === 'light'
                        ? 'border-green-500 bg-green-50'
                        : 'border-gray-200 hover:border-green-300'
                    }`}
                  >
                    <div className="text-2xl mb-1">🚶</div>
                    <div className="text-xs font-semibold">Leve</div>
                    <div className="text-xs text-gray-500">~80 passos/min</div>
                  </button>

                  <button
                    onClick={() => setManualActivity({ ...manualActivity, intensity: 'moderate' })}
                    className={`p-4 rounded-xl border-2 transition-all ${
                      manualActivity.intensity === 'moderate'
                        ? 'border-green-500 bg-green-50'
                        : 'border-gray-200 hover:border-green-300'
                    }`}
                  >
                    <div className="text-2xl mb-1">🚶‍♂️</div>
                    <div className="text-xs font-semibold">Moderada</div>
                    <div className="text-xs text-gray-500">~120 passos/min</div>
                  </button>

                  <button
                    onClick={() => setManualActivity({ ...manualActivity, intensity: 'intense' })}
                    className={`p-4 rounded-xl border-2 transition-all ${
                      manualActivity.intensity === 'intense'
                        ? 'border-green-500 bg-green-50'
                        : 'border-gray-200 hover:border-green-300'
                    }`}
                  >
                    <div className="text-2xl mb-1">🏃</div>
                    <div className="text-xs font-semibold">Intensa</div>
                    <div className="text-xs text-gray-500">~160 passos/min</div>
                  </button>
                </div>
              </div>

              {/* Estimativa */}
              <div className="p-4 rounded-xl bg-teal-50 border border-teal-200">
                <p className="text-sm text-teal-700 mb-1">Passos Estimados:</p>
                <p className="text-3xl font-bold text-teal-600">
                  ~{manualActivity.duration * (manualActivity.intensity === 'light' ? 80 : manualActivity.intensity === 'moderate' ? 120 : 160)} passos
                </p>
              </div>
            </div>

            <div className="space-y-3">
              <Button 
                onClick={registerManualActivity}
                className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white"
                size="lg"
              >
                <Check className="w-5 h-5 mr-2" />
                Registrar Atividade
              </Button>
              
              <Button 
                onClick={() => setShowManualActivity(false)}
                variant="outline"
                className="w-full"
              >
                Cancelar
              </Button>
            </div>
          </Card>
        </div>
      )}

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Date Selector */}
          <Card className="p-6 mb-8">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <Calendar className="w-6 h-6 text-purple-600" />
                <h2 className="text-xl font-bold">Selecione a Data</h2>
              </div>
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>
            
            {/* Overall Progress */}
            <div className="mt-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-600">Progresso Geral</span>
                <span className="text-sm font-bold text-purple-600">{totalProgress.toFixed(0)}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div 
                  className="bg-gradient-to-r from-purple-500 to-purple-600 h-3 rounded-full transition-all duration-500"
                  style={{ width: `${totalProgress}%` }}
                />
              </div>
            </div>
          </Card>

          {/* Status de Rastreamento de Passos */}
          {stepPermission === 'granted' && isTrackingSteps && (
            <Card className="p-4 mb-6 bg-gradient-to-r from-teal-50 to-teal-100 border-2 border-teal-200">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-teal-500 flex items-center justify-center">
                  <Smartphone className="w-5 h-5 text-white animate-pulse" />
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-teal-900">Rastreamento Ativo</p>
                  <p className="text-sm text-teal-700">Seus passos estão sendo contados automaticamente</p>
                </div>
              </div>
            </Card>
          )}

          {/* Habits List */}
          <div className="space-y-4">
            {habits.map((habit) => {
              const Icon = habit.icon;
              const colors = getColorClasses(habit.color);
              const progress = getProgressPercentage(habit.current, habit.goal);
              const isComplete = habit.current >= habit.goal;
              const isStepsHabit = habit.id === 1;

              return (
                <Card key={habit.id} className="p-6 hover:shadow-lg transition-shadow">
                  <div className="flex items-center gap-4">
                    <div className={`w-14 h-14 rounded-xl ${colors.bg} flex items-center justify-center flex-shrink-0`}>
                      <Icon className={`w-7 h-7 ${colors.text}`} />
                    </div>

                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="text-lg font-bold text-gray-900">{habit.name}</h3>
                        {isComplete && (
                          <div className="flex items-center gap-1 px-3 py-1 rounded-full bg-green-100 text-green-700">
                            <Check className="w-4 h-4" />
                            <span className="text-xs font-medium">Completo!</span>
                          </div>
                        )}
                      </div>

                      <div className="flex items-center gap-4 mb-3">
                        <span className="text-2xl font-bold text-gray-900">
                          {habit.current.toLocaleString('pt-BR')}
                        </span>
                        <span className="text-sm text-gray-500">
                          / {habit.goal.toLocaleString('pt-BR')} {habit.unit}
                        </span>
                      </div>

                      <div className="w-full bg-gray-200 rounded-full h-2 mb-3">
                        <div 
                          className={`${colors.progress} h-2 rounded-full transition-all duration-500`}
                          style={{ width: `${progress}%` }}
                        />
                      </div>

                      {/* Botões específicos para Passos */}
                      {isStepsHabit ? (
                        <div className="flex gap-2">
                          {stepPermission === 'denied' && (
                            <Button
                              onClick={() => setShowManualActivity(true)}
                              size="sm"
                              className="flex-1 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white"
                            >
                              <Activity className="w-4 h-4 mr-2" />
                              Registrar Caminhada
                            </Button>
                          )}
                          {stepPermission === 'pending' && (
                            <Button
                              onClick={() => setShowStepModal(true)}
                              size="sm"
                              className="flex-1 bg-gradient-to-r from-teal-500 to-teal-600 hover:from-teal-600 hover:to-teal-700 text-white"
                            >
                              <Smartphone className="w-4 h-4 mr-2" />
                              Ativar Rastreamento
                            </Button>
                          )}
                        </div>
                      ) : (
                        // Botões normais para outros hábitos
                        <div className="flex gap-2">
                          <Button
                            onClick={() => updateHabit(habit.id, -habit.goal * 0.1)}
                            variant="outline"
                            size="sm"
                            className="flex-1"
                          >
                            -
                          </Button>
                          <Button
                            onClick={() => updateHabit(habit.id, habit.goal * 0.1)}
                            size="sm"
                            className={`flex-1 ${colors.bg} ${colors.text} hover:opacity-80`}
                          >
                            <Plus className="w-4 h-4 mr-1" />
                            Adicionar
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>

          {/* Add New Habit */}
          <Card className="p-6 mt-6 border-2 border-dashed border-gray-300 hover:border-purple-400 transition-colors cursor-pointer">
            <div className="flex items-center justify-center gap-3 text-gray-500 hover:text-purple-600 transition-colors">
              <Plus className="w-6 h-6" />
              <span className="font-medium">Adicionar Novo Hábito</span>
            </div>
          </Card>
        </div>
      </main>
    </div>
  );
}

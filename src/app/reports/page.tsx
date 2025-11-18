"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { TrendingUp, Calendar, Award, Target, Activity, Zap } from 'lucide-react';
import Link from 'next/link';

export default function ReportsPage() {
  const [selectedWeek, setSelectedWeek] = useState('current');

  const weeklyData = {
    current: {
      week: 'Semana Atual (15-21 Jan)',
      summary: {
        totalSteps: 58432,
        avgWater: 2.1,
        avgSleep: 7.2,
        workouts: 4,
        caloriesBurned: 2840
      },
      insights: [
        '🎉 Você atingiu sua meta de passos 5 dias esta semana!',
        '💧 Sua hidratação melhorou 15% comparado à semana passada',
        '⚠️ Tente dormir 30 minutos mais cedo para atingir 8h de sono',
        '💪 Excelente consistência nos treinos! Continue assim!'
      ],
      goals: [
        { name: 'Passos', achieved: 5, total: 7, percentage: 71 },
        { name: 'Água', achieved: 6, total: 7, percentage: 86 },
        { name: 'Sono', achieved: 4, total: 7, percentage: 57 },
        { name: 'Exercícios', achieved: 4, total: 5, percentage: 80 }
      ]
    },
    last: {
      week: 'Semana Passada (8-14 Jan)',
      summary: {
        totalSteps: 52100,
        avgWater: 1.8,
        avgSleep: 6.9,
        workouts: 3,
        caloriesBurned: 2340
      },
      insights: [
        '📈 Você aumentou seus passos em 12% esta semana',
        '💧 Hidratação abaixo da meta - tente beber mais água',
        '😴 Sono irregular durante a semana',
        '🏃 Adicione mais um dia de treino para melhores resultados'
      ],
      goals: [
        { name: 'Passos', achieved: 4, total: 7, percentage: 57 },
        { name: 'Água', achieved: 4, total: 7, percentage: 57 },
        { name: 'Sono', achieved: 3, total: 7, percentage: 43 },
        { name: 'Exercícios', achieved: 3, total: 5, percentage: 60 }
      ]
    }
  };

  const data = weeklyData[selectedWeek as keyof typeof weeklyData];

  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-green-50/30 to-white">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/dashboard" className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-green-600 to-green-500 bg-clip-text text-transparent">
              Relatórios Semanais
            </span>
          </Link>
          <Link href="/dashboard">
            <Button variant="ghost">
              Voltar
            </Button>
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-5xl mx-auto">
          {/* Week Selector */}
          <Card className="p-6 mb-8">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Calendar className="w-6 h-6 text-green-600" />
                <h2 className="text-xl font-bold">Selecione o Período</h2>
              </div>
              <div className="flex gap-2">
                <Button
                  onClick={() => setSelectedWeek('current')}
                  variant={selectedWeek === 'current' ? 'default' : 'outline'}
                  className={selectedWeek === 'current' ? 'bg-gradient-to-r from-green-500 to-green-600 text-white' : ''}
                >
                  Semana Atual
                </Button>
                <Button
                  onClick={() => setSelectedWeek('last')}
                  variant={selectedWeek === 'last' ? 'default' : 'outline'}
                  className={selectedWeek === 'last' ? 'bg-gradient-to-r from-green-500 to-green-600 text-white' : ''}
                >
                  Semana Passada
                </Button>
              </div>
            </div>
          </Card>

          {/* Summary Cards */}
          <div className="grid md:grid-cols-5 gap-4 mb-8">
            <Card className="p-4">
              <div className="flex items-center gap-2 mb-2">
                <Activity className="w-5 h-5 text-teal-600" />
                <span className="text-sm text-gray-600">Passos</span>
              </div>
              <p className="text-2xl font-bold text-gray-900">{data.summary.totalSteps.toLocaleString()}</p>
              <p className="text-xs text-gray-500 mt-1">Total na semana</p>
            </Card>

            <Card className="p-4">
              <div className="flex items-center gap-2 mb-2">
                <Activity className="w-5 h-5 text-blue-600" />
                <span className="text-sm text-gray-600">Água</span>
              </div>
              <p className="text-2xl font-bold text-gray-900">{data.summary.avgWater}L</p>
              <p className="text-xs text-gray-500 mt-1">Média diária</p>
            </Card>

            <Card className="p-4">
              <div className="flex items-center gap-2 mb-2">
                <Activity className="w-5 h-5 text-purple-600" />
                <span className="text-sm text-gray-600">Sono</span>
              </div>
              <p className="text-2xl font-bold text-gray-900">{data.summary.avgSleep}h</p>
              <p className="text-xs text-gray-500 mt-1">Média diária</p>
            </Card>

            <Card className="p-4">
              <div className="flex items-center gap-2 mb-2">
                <Activity className="w-5 h-5 text-orange-600" />
                <span className="text-sm text-gray-600">Treinos</span>
              </div>
              <p className="text-2xl font-bold text-gray-900">{data.summary.workouts}</p>
              <p className="text-xs text-gray-500 mt-1">Sessões completas</p>
            </Card>

            <Card className="p-4">
              <div className="flex items-center gap-2 mb-2">
                <Zap className="w-5 h-5 text-yellow-600" />
                <span className="text-sm text-gray-600">Calorias</span>
              </div>
              <p className="text-2xl font-bold text-gray-900">{data.summary.caloriesBurned}</p>
              <p className="text-xs text-gray-500 mt-1">Queimadas</p>
            </Card>
          </div>

          {/* Goals Progress */}
          <Card className="p-6 mb-8">
            <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
              <Target className="w-6 h-6 text-green-600" />
              Progresso das Metas
            </h3>
            <div className="space-y-4">
              {data.goals.map((goal, index) => (
                <div key={index}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium text-gray-900">{goal.name}</span>
                    <span className="text-sm text-gray-600">
                      {goal.achieved}/{goal.total} dias
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div
                      className="bg-gradient-to-r from-green-500 to-green-600 h-3 rounded-full transition-all duration-500"
                      style={{ width: `${goal.percentage}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Insights */}
          <Card className="p-6 mb-8">
            <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
              <Award className="w-6 h-6 text-green-600" />
              Insights e Recomendações
            </h3>
            <div className="space-y-3">
              {data.insights.map((insight, index) => (
                <div
                  key={index}
                  className="p-4 rounded-xl bg-green-50 border border-green-200"
                >
                  <p className="text-gray-800">{insight}</p>
                </div>
              ))}
            </div>
          </Card>

          {/* Next Steps */}
          <Card className="p-6 bg-gradient-to-br from-green-500 to-green-600 text-white">
            <h3 className="text-xl font-bold mb-4">🎯 Próximos Passos</h3>
            <ul className="space-y-2">
              <li className="flex items-start gap-2">
                <span className="text-green-200">•</span>
                <span>Mantenha a consistência nos hábitos que estão funcionando</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-200">•</span>
                <span>Foque em melhorar as áreas com menor progresso</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-200">•</span>
                <span>Estabeleça pequenas metas diárias para facilitar o progresso</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-200">•</span>
                <span>Celebre suas conquistas, por menores que sejam!</span>
              </li>
            </ul>
          </Card>
        </div>
      </main>
    </div>
  );
}

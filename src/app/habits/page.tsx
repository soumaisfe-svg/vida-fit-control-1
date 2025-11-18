"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Heart, TrendingUp, Droplets, Moon, Utensils, Dumbbell, Check, Plus, Calendar } from 'lucide-react';
import Link from 'next/link';

export default function HabitsPage() {
  const [habits, setHabits] = useState([
    { id: 1, name: 'Passos', icon: TrendingUp, current: 8432, goal: 10000, unit: 'passos', color: 'teal' },
    { id: 2, name: 'Água', icon: Droplets, current: 1.8, goal: 2.5, unit: 'L', color: 'blue' },
    { id: 3, name: 'Sono', icon: Moon, current: 7.5, goal: 8, unit: 'horas', color: 'purple' },
    { id: 4, name: 'Refeições', icon: Utensils, current: 3, goal: 5, unit: 'refeições', color: 'orange' },
    { id: 5, name: 'Exercícios', icon: Dumbbell, current: 30, goal: 60, unit: 'min', color: 'green' },
  ]);

  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);

  const updateHabit = (id: number, increment: number) => {
    setHabits(habits.map(habit => 
      habit.id === id 
        ? { ...habit, current: Math.max(0, Math.min(habit.current + increment, habit.goal * 1.5)) }
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

          {/* Habits List */}
          <div className="space-y-4">
            {habits.map((habit) => {
              const Icon = habit.icon;
              const colors = getColorClasses(habit.color);
              const progress = getProgressPercentage(habit.current, habit.goal);
              const isComplete = habit.current >= habit.goal;

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
                          {habit.current}
                        </span>
                        <span className="text-sm text-gray-500">
                          / {habit.goal} {habit.unit}
                        </span>
                      </div>

                      <div className="w-full bg-gray-200 rounded-full h-2 mb-3">
                        <div 
                          className={`${colors.progress} h-2 rounded-full transition-all duration-500`}
                          style={{ width: `${progress}%` }}
                        />
                      </div>

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

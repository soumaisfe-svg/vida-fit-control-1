"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Heart, User, Calendar, Activity, Target, Loader2 } from 'lucide-react';

export default function QuestionnairePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [formData, setFormData] = useState({
    age: '',
    weight: '',
    height: '',
    activityLevel: '',
    goal: '',
    healthConditions: '',
  });

  // Evitar hidratação e navegação automática problemática
  useEffect(() => {
    setMounted(true);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Salvar dados do questionário no localStorage temporariamente
      localStorage.setItem('questionnaireData', JSON.stringify({
        age: parseInt(formData.age),
        weight: parseFloat(formData.weight),
        height: parseFloat(formData.height),
        activity_level: formData.activityLevel,
        goal: formData.goal,
        health_conditions: formData.healthConditions,
        completed_at: new Date().toISOString(),
      }));

      // Marcar questionário como completo
      localStorage.setItem('questionnaireCompleted', 'true');

      // Usar window.location para evitar problemas de prefetch
      window.location.href = '/payment';
    } catch (error: any) {
      alert('Erro ao salvar suas informações. Tente novamente.');
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  if (!mounted) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-teal-50/30 to-white p-4">
      {/* Header */}
      <div className="fixed top-0 left-0 right-0 border-b bg-white/80 backdrop-blur-sm z-10">
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

      {/* Questionnaire Form */}
      <div className="container mx-auto max-w-2xl pt-24 pb-8">
        <Card className="p-8 shadow-2xl">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold mb-2">Conte-nos sobre você</h1>
            <p className="text-gray-600">
              Essas informações nos ajudarão a criar métricas personalizadas para você
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Idade */}
            <div>
              <Label htmlFor="age" className="flex items-center gap-2 mb-2">
                <Calendar className="w-4 h-4" />
                Idade
              </Label>
              <Input
                id="age"
                name="age"
                type="number"
                placeholder="Ex: 30"
                value={formData.age}
                onChange={handleChange}
                required
                min="1"
                max="120"
                disabled={loading}
              />
            </div>

            {/* Peso */}
            <div>
              <Label htmlFor="weight" className="flex items-center gap-2 mb-2">
                <Activity className="w-4 h-4" />
                Peso (kg)
              </Label>
              <Input
                id="weight"
                name="weight"
                type="number"
                step="0.1"
                placeholder="Ex: 70.5"
                value={formData.weight}
                onChange={handleChange}
                required
                min="1"
                disabled={loading}
              />
            </div>

            {/* Altura */}
            <div>
              <Label htmlFor="height" className="flex items-center gap-2 mb-2">
                <User className="w-4 h-4" />
                Altura (cm)
              </Label>
              <Input
                id="height"
                name="height"
                type="number"
                step="0.1"
                placeholder="Ex: 175"
                value={formData.height}
                onChange={handleChange}
                required
                min="1"
                disabled={loading}
              />
            </div>

            {/* Nível de Atividade */}
            <div>
              <Label htmlFor="activityLevel" className="flex items-center gap-2 mb-2">
                <Activity className="w-4 h-4" />
                Nível de Atividade Física
              </Label>
              <select
                id="activityLevel"
                name="activityLevel"
                value={formData.activityLevel}
                onChange={handleChange}
                required
                disabled={loading}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
              >
                <option value="">Selecione...</option>
                <option value="sedentary">Sedentário (pouco ou nenhum exercício)</option>
                <option value="light">Leve (exercício 1-3 dias/semana)</option>
                <option value="moderate">Moderado (exercício 3-5 dias/semana)</option>
                <option value="active">Ativo (exercício 6-7 dias/semana)</option>
                <option value="very_active">Muito Ativo (exercício intenso diariamente)</option>
              </select>
            </div>

            {/* Objetivo */}
            <div>
              <Label htmlFor="goal" className="flex items-center gap-2 mb-2">
                <Target className="w-4 h-4" />
                Seu Objetivo Principal
              </Label>
              <select
                id="goal"
                name="goal"
                value={formData.goal}
                onChange={handleChange}
                required
                disabled={loading}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
              >
                <option value="">Selecione...</option>
                <option value="lose_weight">Perder Peso</option>
                <option value="gain_muscle">Ganhar Massa Muscular</option>
                <option value="maintain">Manter Peso</option>
                <option value="improve_health">Melhorar Saúde Geral</option>
                <option value="increase_energy">Aumentar Energia</option>
              </select>
            </div>

            {/* Condições de Saúde */}
            <div>
              <Label htmlFor="healthConditions" className="mb-2 block">
                Condições de Saúde (opcional)
              </Label>
              <textarea
                id="healthConditions"
                name="healthConditions"
                placeholder="Ex: Diabetes, hipertensão, alergias alimentares..."
                value={formData.healthConditions}
                onChange={handleChange}
                disabled={loading}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
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
                  Salvando...
                </>
              ) : (
                'Continuar para Pagamento'
              )}
            </Button>
          </form>
        </Card>
      </div>
    </div>
  );
}

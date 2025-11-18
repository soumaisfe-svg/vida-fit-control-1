"use client";

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { User, Mail, Lock, Edit2, Save, TrendingUp, Target, Activity, Award } from 'lucide-react';
import Link from 'next/link';

interface UserProfile {
  name: string;
  email: string;
  age: string;
  gender: string;
  height: string;
  weight: string;
  goalWeight: string;
  activityLevel: string;
  goal: string;
  dietaryRestrictions: string;
  sleepHours: string;
  waterIntake: string;
  exerciseFrequency: string;
  healthConditions: string;
}

export default function ProfilePage() {
  const [isEditing, setIsEditing] = useState(false);
  const [profile, setProfile] = useState<UserProfile>({
    name: 'Usuário',
    email: 'usuario@email.com',
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

  useEffect(() => {
    // Carregar dados do localStorage
    const savedProfile = localStorage.getItem('userProfile');
    if (savedProfile) {
      setProfile(JSON.parse(savedProfile));
    }
  }, []);

  const handleSave = () => {
    localStorage.setItem('userProfile', JSON.stringify(profile));
    setIsEditing(false);
  };

  const calculateBMI = () => {
    if (profile.height && profile.weight) {
      const heightM = parseFloat(profile.height) / 100;
      const weightKg = parseFloat(profile.weight);
      const bmi = weightKg / (heightM * heightM);
      return bmi.toFixed(1);
    }
    return '-';
  };

  const calculateCalories = () => {
    if (profile.weight && profile.height && profile.age && profile.gender) {
      const weight = parseFloat(profile.weight);
      const height = parseFloat(profile.height);
      const age = parseFloat(profile.age);
      
      // Fórmula de Harris-Benedict
      let bmr;
      if (profile.gender === 'male') {
        bmr = 88.362 + (13.397 * weight) + (4.799 * height) - (5.677 * age);
      } else {
        bmr = 447.593 + (9.247 * weight) + (3.098 * height) - (4.330 * age);
      }

      // Multiplicador de atividade
      const activityMultipliers: any = {
        sedentary: 1.2,
        light: 1.375,
        moderate: 1.55,
        active: 1.725,
        very_active: 1.9
      };

      const multiplier = activityMultipliers[profile.activityLevel] || 1.2;
      return Math.round(bmr * multiplier);
    }
    return '-';
  };

  const getGoalText = (goalKey: string) => {
    const goals: any = {
      lose_weight: 'Perder peso',
      gain_weight: 'Ganhar peso',
      maintain: 'Manter peso',
      muscle: 'Ganhar massa muscular',
      health: 'Melhorar saúde geral'
    };
    return goals[goalKey] || goalKey;
  };

  const getActivityText = (activityKey: string) => {
    const activities: any = {
      sedentary: 'Sedentário',
      light: 'Leve',
      moderate: 'Moderado',
      active: 'Ativo',
      very_active: 'Muito ativo'
    };
    return activities[activityKey] || activityKey;
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-orange-50/30 to-white">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/dashboard" className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center">
              <User className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-orange-600 to-orange-500 bg-clip-text text-transparent">
              Meu Perfil
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
          {/* Profile Header */}
          <Card className="p-8 mb-8">
            <div className="flex items-start justify-between mb-6">
              <div className="flex items-center gap-4">
                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center text-white text-3xl font-bold">
                  {profile.name.charAt(0).toUpperCase()}
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-gray-900">{profile.name}</h1>
                  <p className="text-gray-600">{profile.email}</p>
                </div>
              </div>
              <Button
                onClick={() => isEditing ? handleSave() : setIsEditing(true)}
                className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white"
              >
                {isEditing ? (
                  <>
                    <Save className="w-4 h-4 mr-2" />
                    Salvar
                  </>
                ) : (
                  <>
                    <Edit2 className="w-4 h-4 mr-2" />
                    Editar
                  </>
                )}
              </Button>
            </div>

            {/* Metrics Cards */}
            <div className="grid md:grid-cols-4 gap-4">
              <Card className="p-4 bg-gradient-to-br from-teal-50 to-teal-100 border-teal-200">
                <div className="flex items-center gap-2 mb-2">
                  <TrendingUp className="w-5 h-5 text-teal-600" />
                  <span className="text-sm font-medium text-teal-900">IMC</span>
                </div>
                <p className="text-3xl font-bold text-teal-900">{calculateBMI()}</p>
                <p className="text-xs text-teal-700 mt-1">Índice de Massa Corporal</p>
              </Card>

              <Card className="p-4 bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
                <div className="flex items-center gap-2 mb-2">
                  <Activity className="w-5 h-5 text-blue-600" />
                  <span className="text-sm font-medium text-blue-900">Calorias</span>
                </div>
                <p className="text-3xl font-bold text-blue-900">{calculateCalories()}</p>
                <p className="text-xs text-blue-700 mt-1">Necessidade diária</p>
              </Card>

              <Card className="p-4 bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
                <div className="flex items-center gap-2 mb-2">
                  <Target className="w-5 h-5 text-purple-600" />
                  <span className="text-sm font-medium text-purple-900">Meta</span>
                </div>
                <p className="text-2xl font-bold text-purple-900">{profile.goalWeight || '-'} kg</p>
                <p className="text-xs text-purple-700 mt-1">Peso desejado</p>
              </Card>

              <Card className="p-4 bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200">
                <div className="flex items-center gap-2 mb-2">
                  <Award className="w-5 h-5 text-orange-600" />
                  <span className="text-sm font-medium text-orange-900">Progresso</span>
                </div>
                <p className="text-3xl font-bold text-orange-900">
                  {profile.weight && profile.goalWeight 
                    ? Math.abs(parseFloat(profile.weight) - parseFloat(profile.goalWeight)).toFixed(1)
                    : '-'}
                </p>
                <p className="text-xs text-orange-700 mt-1">kg para a meta</p>
              </Card>
            </div>
          </Card>

          {/* Personal Information */}
          <Card className="p-8 mb-8">
            <h2 className="text-2xl font-bold mb-6 text-gray-900">Informações Pessoais</h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="name">Nome Completo</Label>
                <Input
                  id="name"
                  value={profile.name}
                  onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                  disabled={!isEditing}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">E-mail</Label>
                <Input
                  id="email"
                  type="email"
                  value={profile.email}
                  onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                  disabled={!isEditing}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="age">Idade</Label>
                <Input
                  id="age"
                  type="number"
                  value={profile.age}
                  onChange={(e) => setProfile({ ...profile, age: e.target.value })}
                  disabled={!isEditing}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="gender">Sexo</Label>
                <select
                  id="gender"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 disabled:bg-gray-100"
                  value={profile.gender}
                  onChange={(e) => setProfile({ ...profile, gender: e.target.value })}
                  disabled={!isEditing}
                >
                  <option value="">Selecione</option>
                  <option value="male">Masculino</option>
                  <option value="female">Feminino</option>
                  <option value="other">Outro</option>
                </select>
              </div>
            </div>
          </Card>

          {/* Physical Data */}
          <Card className="p-8 mb-8">
            <h2 className="text-2xl font-bold mb-6 text-gray-900">Dados Físicos</h2>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <Label htmlFor="height">Altura (cm)</Label>
                <Input
                  id="height"
                  type="number"
                  value={profile.height}
                  onChange={(e) => setProfile({ ...profile, height: e.target.value })}
                  disabled={!isEditing}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="weight">Peso Atual (kg)</Label>
                <Input
                  id="weight"
                  type="number"
                  value={profile.weight}
                  onChange={(e) => setProfile({ ...profile, weight: e.target.value })}
                  disabled={!isEditing}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="goalWeight">Peso Desejado (kg)</Label>
                <Input
                  id="goalWeight"
                  type="number"
                  value={profile.goalWeight}
                  onChange={(e) => setProfile({ ...profile, goalWeight: e.target.value })}
                  disabled={!isEditing}
                />
              </div>
            </div>
          </Card>

          {/* Goals and Activity */}
          <Card className="p-8 mb-8">
            <h2 className="text-2xl font-bold mb-6 text-gray-900">Objetivos e Atividade</h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="goal">Objetivo Principal</Label>
                {isEditing ? (
                  <select
                    id="goal"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                    value={profile.goal}
                    onChange={(e) => setProfile({ ...profile, goal: e.target.value })}
                  >
                    <option value="">Selecione</option>
                    <option value="lose_weight">Perder peso</option>
                    <option value="gain_weight">Ganhar peso</option>
                    <option value="maintain">Manter peso</option>
                    <option value="muscle">Ganhar massa muscular</option>
                    <option value="health">Melhorar saúde geral</option>
                  </select>
                ) : (
                  <Input value={getGoalText(profile.goal)} disabled />
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="activityLevel">Nível de Atividade</Label>
                {isEditing ? (
                  <select
                    id="activityLevel"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                    value={profile.activityLevel}
                    onChange={(e) => setProfile({ ...profile, activityLevel: e.target.value })}
                  >
                    <option value="">Selecione</option>
                    <option value="sedentary">Sedentário</option>
                    <option value="light">Leve</option>
                    <option value="moderate">Moderado</option>
                    <option value="active">Ativo</option>
                    <option value="very_active">Muito ativo</option>
                  </select>
                ) : (
                  <Input value={getActivityText(profile.activityLevel)} disabled />
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="exerciseFrequency">Frequência de Exercícios (dias/semana)</Label>
                <Input
                  id="exerciseFrequency"
                  type="number"
                  value={profile.exerciseFrequency}
                  onChange={(e) => setProfile({ ...profile, exerciseFrequency: e.target.value })}
                  disabled={!isEditing}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="sleepHours">Horas de Sono (por noite)</Label>
                <Input
                  id="sleepHours"
                  type="number"
                  step="0.5"
                  value={profile.sleepHours}
                  onChange={(e) => setProfile({ ...profile, sleepHours: e.target.value })}
                  disabled={!isEditing}
                />
              </div>
            </div>
          </Card>

          {/* Health Information */}
          <Card className="p-8">
            <h2 className="text-2xl font-bold mb-6 text-gray-900">Informações de Saúde</h2>
            <div className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="dietaryRestrictions">Restrições Alimentares</Label>
                <Input
                  id="dietaryRestrictions"
                  value={profile.dietaryRestrictions}
                  onChange={(e) => setProfile({ ...profile, dietaryRestrictions: e.target.value })}
                  disabled={!isEditing}
                  placeholder="Ex: Vegetariano, intolerância à lactose..."
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="waterIntake">Consumo de Água (litros/dia)</Label>
                <Input
                  id="waterIntake"
                  type="number"
                  step="0.1"
                  value={profile.waterIntake}
                  onChange={(e) => setProfile({ ...profile, waterIntake: e.target.value })}
                  disabled={!isEditing}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="healthConditions">Condições de Saúde</Label>
                <textarea
                  id="healthConditions"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 min-h-[100px] disabled:bg-gray-100"
                  value={profile.healthConditions}
                  onChange={(e) => setProfile({ ...profile, healthConditions: e.target.value })}
                  disabled={!isEditing}
                  placeholder="Ex: Diabetes, hipertensão, alergias..."
                />
              </div>
            </div>
          </Card>
        </div>
      </main>
    </div>
  );
}

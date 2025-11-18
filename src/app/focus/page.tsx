"use client";

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Moon, Play, Pause, RotateCcw, Wind } from 'lucide-react';
import Link from 'next/link';

type FocusMode = 'breathing' | 'stress' | 'focus';

export default function FocusPage() {
  const [isActive, setIsActive] = useState(false);
  const [timeLeft, setTimeLeft] = useState(300); // 5 minutos em segundos
  const [selectedDuration, setSelectedDuration] = useState(300);
  const [breathPhase, setBreathPhase] = useState<'inhale' | 'hold' | 'exhale'>('inhale');
  const [focusMode, setFocusMode] = useState<FocusMode>('breathing');

  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((time) => time - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      setIsActive(false);
    }

    return () => clearInterval(interval);
  }, [isActive, timeLeft]);

  useEffect(() => {
    if (isActive) {
      const breathCycle = setInterval(() => {
        setBreathPhase((phase) => {
          if (phase === 'inhale') return 'hold';
          if (phase === 'hold') return 'exhale';
          return 'inhale';
        });
      }, 4000);

      return () => clearInterval(breathCycle);
    }
  }, [isActive]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleStart = () => {
    setIsActive(true);
  };

  const handlePause = () => {
    setIsActive(false);
  };

  const handleReset = () => {
    setIsActive(false);
    setTimeLeft(selectedDuration);
    setBreathPhase('inhale');
  };

  const handleDurationChange = (duration: number) => {
    setSelectedDuration(duration);
    setTimeLeft(duration);
    setIsActive(false);
  };

  const handleModeChange = (mode: FocusMode) => {
    setFocusMode(mode);
    setIsActive(false);
    setBreathPhase('inhale');
  };

  const getBreathInstruction = () => {
    if (focusMode === 'breathing') {
      switch (breathPhase) {
        case 'inhale':
          return 'Inspire profundamente...';
        case 'hold':
          return 'Segure a respiração...';
        case 'exhale':
          return 'Expire lentamente...';
      }
    } else if (focusMode === 'stress') {
      switch (breathPhase) {
        case 'inhale':
          return 'Inspire paz e calma...';
        case 'hold':
          return 'Sinta a tranquilidade...';
        case 'exhale':
          return 'Libere toda tensão...';
      }
    } else {
      switch (breathPhase) {
        case 'inhale':
          return 'Energize sua mente...';
        case 'hold':
          return 'Concentre sua energia...';
        case 'exhale':
          return 'Libere distrações...';
      }
    }
  };

  const getCircleScale = () => {
    switch (breathPhase) {
      case 'inhale':
        return 'scale-150';
      case 'hold':
        return 'scale-150';
      case 'exhale':
        return 'scale-100';
    }
  };

  const getModeTitle = () => {
    switch (focusMode) {
      case 'breathing':
        return 'Respiração Guiada';
      case 'stress':
        return 'Reduza o Estresse';
      case 'focus':
        return 'Foco Total';
    }
  };

  const getModeDescription = () => {
    switch (focusMode) {
      case 'breathing':
        return 'Siga o ritmo do círculo para uma respiração profunda e relaxante';
      case 'stress':
        return 'Libere a ansiedade e encontre paz interior através da respiração consciente';
      case 'focus':
        return 'Aumente sua concentração e clareza mental para máxima produtividade';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-900 via-purple-900 to-indigo-900">
      {/* Header */}
      <header className="border-b border-indigo-800 bg-indigo-900/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/dashboard" className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-indigo-400 to-indigo-600 flex items-center justify-center">
              <Moon className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-bold text-white">
              Modo Foco
            </span>
          </Link>
          <Link href="/dashboard">
            <Button variant="ghost" className="text-white hover:bg-indigo-800">
              Voltar
            </Button>
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          {/* Mode Selector */}
          <div className="grid md:grid-cols-3 gap-6 mb-12">
            <Card 
              onClick={() => handleModeChange('breathing')}
              className={`p-6 cursor-pointer transition-all hover:scale-105 ${
                focusMode === 'breathing' 
                  ? 'bg-gradient-to-br from-indigo-600 to-indigo-700 border-indigo-400 shadow-2xl' 
                  : 'bg-indigo-800/50 border-indigo-700 hover:bg-indigo-800/70'
              } backdrop-blur-sm`}
            >
              <div className="text-center">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-4 ${
                  focusMode === 'breathing' ? 'bg-white/20' : 'bg-indigo-600'
                }`}>
                  <Wind className="w-6 h-6 text-white" />
                </div>
                <h3 className="font-semibold mb-2 text-white">Respiração Guiada</h3>
                <p className="text-sm text-indigo-200">
                  Siga o ritmo do círculo para uma respiração profunda e relaxante
                </p>
              </div>
            </Card>

            <Card 
              onClick={() => handleModeChange('stress')}
              className={`p-6 cursor-pointer transition-all hover:scale-105 ${
                focusMode === 'stress' 
                  ? 'bg-gradient-to-br from-purple-600 to-purple-700 border-purple-400 shadow-2xl' 
                  : 'bg-indigo-800/50 border-indigo-700 hover:bg-indigo-800/70'
              } backdrop-blur-sm`}
            >
              <div className="text-center">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-4 ${
                  focusMode === 'stress' ? 'bg-white/20' : 'bg-purple-600'
                }`}>
                  <Moon className="w-6 h-6 text-white" />
                </div>
                <h3 className="font-semibold mb-2 text-white">Reduza o Estresse</h3>
                <p className="text-sm text-indigo-200">
                  Apenas 5 minutos podem reduzir significativamente a ansiedade
                </p>
              </div>
            </Card>

            <Card 
              onClick={() => handleModeChange('focus')}
              className={`p-6 cursor-pointer transition-all hover:scale-105 ${
                focusMode === 'focus' 
                  ? 'bg-gradient-to-br from-pink-600 to-pink-700 border-pink-400 shadow-2xl' 
                  : 'bg-indigo-800/50 border-indigo-700 hover:bg-indigo-800/70'
              } backdrop-blur-sm`}
            >
              <div className="text-center">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-4 ${
                  focusMode === 'focus' ? 'bg-white/20' : 'bg-pink-600'
                }`}>
                  <span className="text-2xl">🧘</span>
                </div>
                <h3 className="font-semibold mb-2 text-white">Foco Total</h3>
                <p className="text-sm text-indigo-200">
                  Melhore sua concentração e clareza mental
                </p>
              </div>
            </Card>
          </div>

          {/* Current Mode Info */}
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-white mb-2">{getModeTitle()}</h2>
            <p className="text-indigo-200">{getModeDescription()}</p>
          </div>

          {/* Duration Selector */}
          <div className="flex justify-center gap-4 mb-12">
            {[
              { label: '3 min', value: 180 },
              { label: '5 min', value: 300 },
              { label: '10 min', value: 600 },
              { label: '15 min', value: 900 }
            ].map((option) => (
              <Button
                key={option.value}
                onClick={() => handleDurationChange(option.value)}
                variant={selectedDuration === option.value ? 'default' : 'outline'}
                className={
                  selectedDuration === option.value
                    ? 'bg-gradient-to-r from-indigo-500 to-indigo-600 text-white'
                    : 'border-indigo-400 text-indigo-200 hover:bg-indigo-800'
                }
              >
                {option.label}
              </Button>
            ))}
          </div>

          {/* Breathing Circle */}
          <div className="flex flex-col items-center justify-center mb-12">
            <div className="relative w-80 h-80 flex items-center justify-center">
              {/* Outer glow */}
              <div className="absolute inset-0 rounded-full bg-indigo-500/20 blur-3xl" />
              
              {/* Animated circle */}
              <div
                className={`absolute w-64 h-64 rounded-full bg-gradient-to-br from-indigo-400 to-purple-600 transition-transform duration-4000 ease-in-out ${
                  isActive ? getCircleScale() : 'scale-100'
                }`}
                style={{ transitionDuration: '4000ms' }}
              />

              {/* Center content */}
              <div className="relative z-10 text-center">
                <div className="text-6xl font-bold text-white mb-4">
                  {formatTime(timeLeft)}
                </div>
                {isActive && (
                  <div className="flex items-center justify-center gap-2 text-indigo-200">
                    <Wind className="w-5 h-5" />
                    <p className="text-lg font-medium">{getBreathInstruction()}</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Controls */}
          <div className="flex justify-center gap-4 mb-12">
            {!isActive ? (
              <Button
                onClick={handleStart}
                size="lg"
                className="bg-gradient-to-r from-indigo-500 to-indigo-600 hover:from-indigo-600 hover:to-indigo-700 text-white shadow-xl px-12"
              >
                <Play className="w-6 h-6 mr-2" />
                Iniciar
              </Button>
            ) : (
              <Button
                onClick={handlePause}
                size="lg"
                className="bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white shadow-xl px-12"
              >
                <Pause className="w-6 h-6 mr-2" />
                Pausar
              </Button>
            )}
            <Button
              onClick={handleReset}
              size="lg"
              variant="outline"
              className="border-indigo-400 text-indigo-200 hover:bg-indigo-800"
            >
              <RotateCcw className="w-6 h-6 mr-2" />
              Reiniciar
            </Button>
          </div>

          {/* Tips */}
          <Card className="p-6 mt-8 bg-gradient-to-br from-indigo-600 to-purple-600 border-0">
            <h3 className="text-xl font-bold mb-4 text-white">💡 Dicas para uma sessão melhor</h3>
            <ul className="space-y-2 text-indigo-50">
              <li className="flex items-start gap-2">
                <span>•</span>
                <span>Encontre um lugar tranquilo e confortável</span>
              </li>
              <li className="flex items-start gap-2">
                <span>•</span>
                <span>Use fones de ouvido para uma experiência imersiva</span>
              </li>
              <li className="flex items-start gap-2">
                <span>•</span>
                <span>Feche os olhos e concentre-se apenas na respiração</span>
              </li>
              <li className="flex items-start gap-2">
                <span>•</span>
                <span>Pratique diariamente para melhores resultados</span>
              </li>
            </ul>
          </Card>
        </div>
      </main>
    </div>
  );
}

"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Camera, Upload, Loader2, Apple, TrendingUp, Flame, AlertCircle } from 'lucide-react';
import Link from 'next/link';

export default function AppPage() {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [result, setResult] = useState<{ food: string; calories: string } | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedImage(reader.result as string);
        setResult(null);
        setError(null);
      };
      reader.readAsDataURL(file);
    }
  };

  const analyzeFood = async () => {
    if (!selectedImage) return;

    setAnalyzing(true);
    setError(null);

    try {
      const response = await fetch('/api/analyze-food', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          imageUrl: selectedImage,
          context: 'Analise esta imagem de alimento e identifique: 1) Nome específico do alimento ou prato, 2) Quantidade aproximada de calorias totais. Seja preciso e detalhado na identificação. Responda APENAS no formato: "ALIMENTO: [nome] | CALORIAS: [número]"'
        }),
      });

      const data = await response.json();

      if (data.success && data.analysis) {
        // Parse da resposta no formato "ALIMENTO: [nome] | CALORIAS: [número]"
        const parts = data.analysis.split('|');
        const foodPart = parts[0]?.replace('ALIMENTO:', '').trim() || 'Alimento não identificado';
        const caloriesPart = parts[1]?.replace('CALORIAS:', '').trim() || 'N/A';
        
        setResult({
          food: foodPart,
          calories: caloriesPart
        });
      } else {
        setError(data.message || data.error || 'Erro ao analisar imagem');
      }
    } catch (err) {
      setError('Erro ao conectar com o servidor');
      console.error(err);
    } finally {
      setAnalyzing(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-teal-50/30 to-white">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/dashboard" className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-teal-400 to-teal-600 flex items-center justify-center">
              <Apple className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-teal-600 to-teal-500 bg-clip-text text-transparent">
              VivaFit Control
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
      <main className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          {/* Title Section */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-teal-100 text-teal-700 text-sm font-medium mb-4">
              <Camera className="w-4 h-4" />
              Contador de Calorias por Foto
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Descubra as <span className="bg-gradient-to-r from-teal-600 to-teal-500 bg-clip-text text-transparent">calorias</span> da sua refeição
            </h1>
            <p className="text-xl text-gray-600">
              Tire uma foto do seu prato e nossa IA identificará o alimento e calculará as calorias
            </p>
          </div>

          {/* Upload Section */}
          <Card className="p-8 mb-8">
            <div className="space-y-6">
              {/* Upload Area */}
              {!selectedImage ? (
                <label className="block cursor-pointer">
                  <div className="border-2 border-dashed border-teal-300 rounded-2xl p-12 text-center hover:border-teal-500 hover:bg-teal-50/50 transition-all">
                    <Upload className="w-16 h-16 mx-auto mb-4 text-teal-500" />
                    <h3 className="text-xl font-semibold mb-2 text-gray-900">
                      Clique para fazer upload
                    </h3>
                    <p className="text-gray-600 mb-4">
                      ou arraste e solte uma imagem aqui
                    </p>
                    <p className="text-sm text-gray-500">
                      PNG, JPG ou JPEG (máx. 10MB)
                    </p>
                  </div>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                </label>
              ) : (
                <div className="space-y-6">
                  {/* Image Preview */}
                  <div className="relative rounded-2xl overflow-hidden">
                    <img
                      src={selectedImage}
                      alt="Alimento selecionado"
                      className="w-full h-auto max-h-96 object-cover"
                    />
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-4">
                    <Button
                      onClick={analyzeFood}
                      disabled={analyzing}
                      className="flex-1 bg-gradient-to-r from-teal-500 to-teal-600 hover:from-teal-600 hover:to-teal-700 text-white shadow-lg shadow-teal-500/30"
                      size="lg"
                    >
                      {analyzing ? (
                        <>
                          <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                          Analisando...
                        </>
                      ) : (
                        <>
                          <TrendingUp className="w-5 h-5 mr-2" />
                          Analisar Calorias
                        </>
                      )}
                    </Button>
                    <Button
                      onClick={() => {
                        setSelectedImage(null);
                        setResult(null);
                        setError(null);
                      }}
                      variant="outline"
                      size="lg"
                    >
                      Nova Foto
                    </Button>
                  </div>
                </div>
              )}

              {/* Error Message */}
              {error && (
                <div className="p-6 rounded-xl border bg-red-50 border-red-200">
                  <div className="flex items-start gap-3">
                    <AlertCircle className="w-6 h-6 flex-shrink-0 text-red-600" />
                    <div className="flex-1">
                      <p className="font-semibold mb-2 text-red-900">
                        ⚠️ Erro na Análise
                      </p>
                      <p className="text-sm text-red-700">
                        {error}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Result */}
              {result && (
                <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
                  <div className="p-6 rounded-2xl bg-gradient-to-br from-teal-500 to-teal-600 text-white">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center">
                        <Flame className="w-6 h-6" />
                      </div>
                      <h3 className="text-2xl font-bold">Resultado da Análise</h3>
                    </div>
                    
                    <div className="space-y-3">
                      <div className="p-4 rounded-xl bg-white/10 backdrop-blur-sm">
                        <p className="text-sm text-teal-100 mb-1">Alimento Identificado</p>
                        <p className="text-xl font-bold">{result.food}</p>
                      </div>
                      
                      <div className="p-4 rounded-xl bg-white/10 backdrop-blur-sm">
                        <p className="text-sm text-teal-100 mb-1">Calorias Estimadas</p>
                        <p className="text-3xl font-bold">{result.calories}</p>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 rounded-xl bg-blue-50 border border-blue-200">
                    <p className="text-sm text-blue-800">
                      💡 <strong>Dica:</strong> Os valores são estimativas baseadas em porções médias. 
                      Para resultados mais precisos, considere pesar seus alimentos.
                    </p>
                  </div>
                </div>
              )}
            </div>
          </Card>

          {/* Info Cards */}
          <div className="grid md:grid-cols-3 gap-6">
            <Card className="p-6 text-center">
              <div className="w-12 h-12 rounded-xl bg-teal-100 flex items-center justify-center mx-auto mb-4">
                <Camera className="w-6 h-6 text-teal-600" />
              </div>
              <h3 className="font-semibold mb-2 text-gray-900">Rápido e Fácil</h3>
              <p className="text-sm text-gray-600">
                Tire uma foto e receba a análise em segundos
              </p>
            </Card>

            <Card className="p-6 text-center">
              <div className="w-12 h-12 rounded-xl bg-purple-100 flex items-center justify-center mx-auto mb-4">
                <TrendingUp className="w-6 h-6 text-purple-600" />
              </div>
              <h3 className="font-semibold mb-2 text-gray-900">IA Avançada</h3>
              <p className="text-sm text-gray-600">
                Tecnologia de ponta para identificação precisa
              </p>
            </Card>

            <Card className="p-6 text-center">
              <div className="w-12 h-12 rounded-xl bg-orange-100 flex items-center justify-center mx-auto mb-4">
                <Flame className="w-6 h-6 text-orange-600" />
              </div>
              <h3 className="font-semibold mb-2 text-gray-900">Controle Total</h3>
              <p className="text-sm text-gray-600">
                Acompanhe suas calorias de forma inteligente
              </p>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}

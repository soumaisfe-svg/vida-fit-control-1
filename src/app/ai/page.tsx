"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Sparkles, Send, Loader2, FileText, Trash2 } from 'lucide-react';
import Link from 'next/link';

interface Message {
  id: number;
  type: 'user' | 'ai';
  content: string;
  timestamp: Date;
}

export default function AIPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [savedReports, setSavedReports] = useState<Message[]>([]);

  const handleSend = async () => {
    if (!input.trim() || loading) return;

    const userMessage: Message = {
      id: Date.now(),
      type: 'user',
      content: input,
      timestamp: new Date()
    };

    setMessages([...messages, userMessage]);
    setInput('');
    setLoading(true);

    // Simular resposta da IA (em produção, chamar API real)
    setTimeout(() => {
      const aiMessage: Message = {
        id: Date.now() + 1,
        type: 'ai',
        content: `Baseado na sua pergunta sobre "${input}", aqui está uma análise personalizada:\n\n✅ **Recomendações:**\n- Mantenha uma rotina consistente de exercícios\n- Hidrate-se adequadamente (2-3L por dia)\n- Durma 7-8 horas por noite\n\n📊 **Insights:**\nSeus hábitos atuais estão no caminho certo! Continue assim e você verá resultados em 2-3 semanas.\n\n💡 **Dica Personalizada:**\nConsidere adicionar 15 minutos de caminhada após as refeições para melhorar a digestão.`,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, aiMessage]);
      setLoading(false);
    }, 2000);
  };

  const saveReport = (message: Message) => {
    if (message.type === 'ai' && !savedReports.find(r => r.id === message.id)) {
      setSavedReports([...savedReports, message]);
    }
  };

  const deleteReport = (id: number) => {
    setSavedReports(savedReports.filter(r => r.id !== id));
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-blue-50/30 to-white">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/dashboard" className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-blue-500 bg-clip-text text-transparent">
              IA Personalizada
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
        <div className="max-w-6xl mx-auto grid lg:grid-cols-3 gap-8">
          {/* Chat Area */}
          <div className="lg:col-span-2">
            <Card className="h-[calc(100vh-200px)] flex flex-col">
              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-6 space-y-4">
                {messages.length === 0 ? (
                  <div className="h-full flex items-center justify-center">
                    <div className="text-center max-w-md">
                      <div className="w-20 h-20 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center mx-auto mb-6">
                        <Sparkles className="w-10 h-10 text-white" />
                      </div>
                      <h3 className="text-2xl font-bold mb-3 text-gray-900">Como posso ajudar?</h3>
                      <p className="text-gray-600 mb-6">
                        Faça perguntas sobre saúde, nutrição, exercícios ou bem-estar
                      </p>
                      <div className="space-y-2 text-left">
                        <button
                          onClick={() => setInput('Como posso melhorar meu sono?')}
                          className="w-full p-3 text-sm text-left rounded-lg border border-gray-200 hover:border-blue-300 hover:bg-blue-50 transition-colors"
                        >
                          💤 Como posso melhorar meu sono?
                        </button>
                        <button
                          onClick={() => setInput('Qual a melhor dieta para perder peso?')}
                          className="w-full p-3 text-sm text-left rounded-lg border border-gray-200 hover:border-blue-300 hover:bg-blue-50 transition-colors"
                        >
                          🥗 Qual a melhor dieta para perder peso?
                        </button>
                        <button
                          onClick={() => setInput('Quantas calorias devo consumir por dia?')}
                          className="w-full p-3 text-sm text-left rounded-lg border border-gray-200 hover:border-blue-300 hover:bg-blue-50 transition-colors"
                        >
                          🔥 Quantas calorias devo consumir por dia?
                        </button>
                      </div>
                    </div>
                  </div>
                ) : (
                  messages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`max-w-[80%] rounded-2xl p-4 ${
                          message.type === 'user'
                            ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white'
                            : 'bg-gray-100 text-gray-900'
                        }`}
                      >
                        <p className="whitespace-pre-wrap">{message.content}</p>
                        {message.type === 'ai' && (
                          <Button
                            onClick={() => saveReport(message)}
                            variant="ghost"
                            size="sm"
                            className="mt-3 text-xs"
                          >
                            <FileText className="w-3 h-3 mr-1" />
                            Salvar Relatório
                          </Button>
                        )}
                      </div>
                    </div>
                  ))
                )}
                {loading && (
                  <div className="flex justify-start">
                    <div className="bg-gray-100 rounded-2xl p-4">
                      <Loader2 className="w-5 h-5 animate-spin text-blue-600" />
                    </div>
                  </div>
                )}
              </div>

              {/* Input */}
              <div className="border-t p-4">
                <div className="flex gap-3">
                  <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                    placeholder="Digite sua pergunta..."
                    className="flex-1 px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                    disabled={loading}
                  />
                  <Button
                    onClick={handleSend}
                    disabled={loading || !input.trim()}
                    className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white"
                    size="lg"
                  >
                    <Send className="w-5 h-5" />
                  </Button>
                </div>
              </div>
            </Card>
          </div>

          {/* Saved Reports */}
          <div className="lg:col-span-1">
            <Card className="p-6">
              <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                <FileText className="w-5 h-5 text-blue-600" />
                Relatórios Salvos
              </h3>
              
              {savedReports.length === 0 ? (
                <div className="text-center py-8">
                  <FileText className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                  <p className="text-sm text-gray-500">
                    Nenhum relatório salvo ainda
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {savedReports.map((report) => (
                    <div
                      key={report.id}
                      className="p-4 rounded-lg bg-blue-50 border border-blue-200"
                    >
                      <div className="flex items-start justify-between mb-2">
                        <span className="text-xs text-blue-600 font-medium">
                          {report.timestamp.toLocaleDateString()}
                        </span>
                        <button
                          onClick={() => deleteReport(report.id)}
                          className="text-red-500 hover:text-red-700"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                      <p className="text-sm text-gray-700 line-clamp-3">
                        {report.content}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </Card>

            {/* Info Card */}
            <Card className="p-6 mt-6 bg-gradient-to-br from-blue-500 to-blue-600 text-white">
              <h4 className="font-bold mb-2">💡 Dica</h4>
              <p className="text-sm text-blue-50">
                Faça perguntas específicas para receber recomendações mais personalizadas baseadas no seu perfil e hábitos.
              </p>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}

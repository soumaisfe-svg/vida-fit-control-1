import { NextRequest, NextResponse } from 'next/server';
import { dbHelpers } from '@/lib/db';

export async function POST(request: NextRequest) {
  try {
    const { userId, question } = await request.json();

    // Validação básica
    if (!userId || !question) {
      return NextResponse.json(
        { success: false, error: 'userId e question são obrigatórios' },
        { status: 400 }
      );
    }

    // Gerar resposta usando IA real
    const aiAnswer = await generateAIResponse(question);

    // Criar relatório
    const report = dbHelpers.createAIReport({
      userId,
      question,
      answer: aiAnswer
    });

    return NextResponse.json({
      success: true,
      report,
      message: 'Pesquisa realizada com sucesso!'
    });

  } catch (error) {
    console.error('Erro ao fazer pesquisa:', error);
    return NextResponse.json(
      { success: false, error: 'Erro ao processar pesquisa' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json(
        { success: false, error: 'userId é obrigatório' },
        { status: 400 }
      );
    }

    // Buscar relatórios do usuário
    const userReports = dbHelpers.getReportsByUser(userId);

    return NextResponse.json({
      success: true,
      reports: userReports
    });

  } catch (error) {
    console.error('Erro ao buscar relatórios:', error);
    return NextResponse.json(
      { success: false, error: 'Erro ao buscar relatórios' },
      { status: 500 }
    );
  }
}

// Função para gerar resposta usando OpenAI API
async function generateAIResponse(question: string): Promise<string> {
  try {
    // Verificar se a API key está configurada
    const apiKey = process.env.OPENAI_API_KEY;
    
    if (!apiKey) {
      console.warn('OPENAI_API_KEY não configurada, usando resposta simulada');
      return generateSimulatedResponse(question);
    }

    // Fazer requisição para OpenAI
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: 'gpt-4o',
        messages: [
          {
            role: 'system',
            content: `Você é um assistente especializado em saúde, bem-estar e hábitos saudáveis. 
Responda de forma clara, prática e motivadora em português do Brasil. 
Formate sua resposta em markdown com títulos, listas e dicas práticas.
Seja específico e forneça recomendações acionáveis.`
          },
          {
            role: 'user',
            content: question
          }
        ],
        temperature: 0.7,
        max_tokens: 1000
      })
    });

    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.status}`);
    }

    const data = await response.json();
    return data.choices[0].message.content;

  } catch (error) {
    console.error('Erro ao chamar OpenAI:', error);
    // Fallback para resposta simulada
    return generateSimulatedResponse(question);
  }
}

// Função auxiliar para gerar resposta simulada (fallback)
function generateSimulatedResponse(question: string): string {
  const responses: { [key: string]: string } = {
    'dormir': `**Como Melhorar Seu Sono:**

1. **Estabeleça uma rotina**: Vá para a cama e acorde no mesmo horário todos os dias
2. **Ambiente adequado**: Mantenha o quarto escuro, silencioso e fresco (18-22°C)
3. **Evite telas**: Desligue dispositivos eletrônicos 1 hora antes de dormir
4. **Relaxamento**: Pratique técnicas de respiração ou meditação
5. **Alimentação**: Evite cafeína após 14h e refeições pesadas à noite

**Dica extra:** Experimente chás calmantes como camomila ou melissa antes de dormir.`,

    'cardápio': `**Cardápio Saudável Personalizado:**

**Café da Manhã (7h-8h):**
- 2 fatias de pão integral
- 1 ovo mexido
- 1 fruta (banana ou maçã)
- Café ou chá sem açúcar

**Lanche da Manhã (10h):**
- 1 iogurte natural
- Castanhas (30g)

**Almoço (12h-13h):**
- Arroz integral (3 colheres)
- Feijão (1 concha)
- Frango grelhado (150g)
- Salada verde à vontade
- Legumes cozidos

**Lanche da Tarde (16h):**
- Frutas variadas
- Queijo branco

**Jantar (19h-20h):**
- Sopa de legumes
- Peixe grelhado
- Salada

**Dica:** Beba 2-3 litros de água ao longo do dia!`,

    'default': `**Análise Personalizada:**

Com base na sua pergunta, aqui estão algumas recomendações:

1. **Estabeleça metas claras**: Defina objetivos específicos e mensuráveis
2. **Crie uma rotina**: Consistência é fundamental para mudanças duradouras
3. **Monitore seu progresso**: Use o app para acompanhar sua evolução
4. **Seja paciente**: Mudanças reais levam tempo, mantenha o foco
5. **Celebre pequenas vitórias**: Reconheça cada progresso, por menor que seja

**Lembre-se:** Você está no caminho certo! Continue usando o VivaFit Control para alcançar seus objetivos.`
  };

  // Detectar palavras-chave na pergunta
  const lowerQuestion = question.toLowerCase();
  
  if (lowerQuestion.includes('dormir') || lowerQuestion.includes('sono')) {
    return responses['dormir'];
  } else if (lowerQuestion.includes('cardápio') || lowerQuestion.includes('alimentação') || lowerQuestion.includes('comer')) {
    return responses['cardápio'];
  } else {
    return responses['default'];
  }
}

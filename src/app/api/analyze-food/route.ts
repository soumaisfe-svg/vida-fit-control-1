import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { imageUrl, context } = await request.json();

    if (!imageUrl) {
      return NextResponse.json(
        { error: 'URL da imagem é obrigatória' },
        { status: 400 }
      );
    }

    // Buscar chave da API das variáveis de ambiente
    const openaiApiKey = process.env.OPENAI_API_KEY;

    if (!openaiApiKey || openaiApiKey === 'sua_chave_aqui') {
      console.error('OPENAI_API_KEY não configurada nas variáveis de ambiente');
      return NextResponse.json(
        { 
          error: 'Chave da API OpenAI não configurada',
          message: 'Configure a variável OPENAI_API_KEY nas configurações do projeto'
        },
        { status: 500 }
      );
    }

    console.log('Iniciando análise de imagem...');
    console.log('URL da imagem:', imageUrl);

    // Fazer análise com OpenAI Vision API
    const openaiResponse = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${openaiApiKey}`
      },
      body: JSON.stringify({
        model: 'gpt-4o',
        messages: [
          {
            role: 'user',
            content: [
              {
                type: 'text',
                text: context || 'Analise esta imagem de alimento e identifique: 1) Nome específico do alimento ou prato, 2) Quantidade aproximada de calorias totais. Seja preciso e detalhado na identificação. Responda APENAS no formato: "ALIMENTO: [nome] | CALORIAS: [número]"'
              },
              {
                type: 'image_url',
                image_url: {
                  url: imageUrl
                }
              }
            ]
          }
        ],
        max_tokens: 300
      })
    });

    console.log('Status da resposta OpenAI:', openaiResponse.status);

    if (!openaiResponse.ok) {
      const errorData = await openaiResponse.json();
      console.error('Erro detalhado da OpenAI:', JSON.stringify(errorData, null, 2));
      
      // Mensagens de erro mais amigáveis
      let errorMessage = 'Erro ao analisar imagem com a OpenAI';
      
      if (errorData.error?.code === 'invalid_api_key') {
        errorMessage = 'Chave da API OpenAI inválida ou expirada. Verifique sua chave nas configurações.';
      } else if (errorData.error?.code === 'insufficient_quota') {
        errorMessage = 'Limite de uso da API OpenAI excedido. Verifique seu plano na OpenAI.';
      } else if (errorData.error?.message) {
        errorMessage = errorData.error.message;
      }
      
      return NextResponse.json(
        { error: errorMessage, details: errorData },
        { status: openaiResponse.status }
      );
    }

    const data = await openaiResponse.json();
    console.log('Resposta completa da OpenAI:', JSON.stringify(data, null, 2));
    
    const analysis = data.choices[0]?.message?.content || '';
    console.log('Análise extraída:', analysis);

    if (!analysis) {
      return NextResponse.json(
        { error: 'Nenhuma análise foi retornada pela OpenAI' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      analysis: analysis
    });

  } catch (error) {
    console.error('Erro na API de análise:', error);
    
    // Tratamento específico para erros de rede
    if (error instanceof TypeError && error.message.includes('fetch')) {
      return NextResponse.json(
        { error: 'Erro de conexão com a API da OpenAI. Verifique sua conexão com a internet.' },
        { status: 503 }
      );
    }
    
    return NextResponse.json(
      { error: 'Erro interno do servidor', details: String(error) },
      { status: 500 }
    );
  }
}

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

    // Buscar chave da API das variáveis de ambiente (configurada de forma definitiva)
    const openaiApiKey = process.env.OPENAI_API_KEY;

    if (!openaiApiKey) {
      console.error('OPENAI_API_KEY não configurada nas variáveis de ambiente');
      return NextResponse.json(
        { 
          error: 'Serviço temporariamente indisponível',
          message: 'Entre em contato com o suporte'
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
      let errorMessage = 'Erro ao analisar imagem. Tente novamente em alguns instantes.';
      
      if (errorData.error?.code === 'invalid_api_key') {
        errorMessage = 'Erro de configuração do serviço. Entre em contato com o suporte.';
      } else if (errorData.error?.code === 'insufficient_quota') {
        errorMessage = 'Limite de uso temporariamente excedido. Tente novamente mais tarde.';
      } else if (errorData.error?.message) {
        errorMessage = 'Erro ao processar imagem. Tente com outra foto.';
      }
      
      return NextResponse.json(
        { error: errorMessage },
        { status: 500 }
      );
    }

    const data = await openaiResponse.json();
    console.log('Resposta completa da OpenAI:', JSON.stringify(data, null, 2));
    
    const analysis = data.choices[0]?.message?.content || '';
    console.log('Análise extraída:', analysis);

    if (!analysis) {
      return NextResponse.json(
        { error: 'Não foi possível analisar a imagem. Tente com uma foto mais clara.' },
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
        { error: 'Erro de conexão. Verifique sua internet e tente novamente.' },
        { status: 503 }
      );
    }
    
    return NextResponse.json(
      { error: 'Erro ao processar sua solicitação. Tente novamente.' },
      { status: 500 }
    );
  }
}

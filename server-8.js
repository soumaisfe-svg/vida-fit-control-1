const express = require('express');
const cors = require('cors');
const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Simulação de banco de dados em memória
const users = new Map();
const subscriptions = new Map();
const aiReports = new Map();
const habits = new Map();

// ============================================
// ROTAS PRINCIPAIS
// ============================================

// Health check
app.get('/', (req, res) => {
  res.status(200).json({ 
    message: 'VivaFit API online',
    status: 'ok',
    timestamp: new Date().toISOString()
  });
});

app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

// ============================================
// AUTENTICAÇÃO
// ============================================

app.post('/api/auth/register', (req, res) => {
  const { email, password, name } = req.body;
  
  if (users.has(email)) {
    return res.status(400).json({ error: 'Usuário já existe' });
  }
  
  const user = {
    id: Date.now().toString(),
    email,
    name,
    password, // Em produção, usar hash
    isPremium: false,
    coins: 0,
    createdAt: new Date().toISOString()
  };
  
  users.set(email, user);
  
  res.json({ 
    success: true, 
    user: { ...user, password: undefined },
    token: `token_${user.id}`
  });
});

app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body;
  
  const user = users.get(email);
  
  if (!user || user.password !== password) {
    return res.status(401).json({ error: 'Credenciais inválidas' });
  }
  
  res.json({ 
    success: true, 
    user: { ...user, password: undefined },
    token: `token_${user.id}`
  });
});

app.get('/api/auth/me', (req, res) => {
  const token = req.headers.authorization?.replace('Bearer ', '');
  const userId = token?.replace('token_', '');
  
  const user = Array.from(users.values()).find(u => u.id === userId);
  
  if (!user) {
    return res.status(401).json({ error: 'Não autorizado' });
  }
  
  res.json({ user: { ...user, password: undefined } });
});

// ============================================
// ASSINATURAS E PAGAMENTOS
// ============================================

app.post('/api/subscriptions/create', (req, res) => {
  const { userId, plan, paymentMethod } = req.body;
  
  const subscription = {
    id: Date.now().toString(),
    userId,
    plan, // 'monthly' ou 'single'
    amount: plan === 'monthly' ? 5 : 10,
    paymentMethod,
    status: 'pending',
    createdAt: new Date().toISOString()
  };
  
  subscriptions.set(subscription.id, subscription);
  
  // Simular resposta do Mercado Pago
  const paymentData = {
    subscriptionId: subscription.id,
    qrCode: paymentMethod === 'pix' ? `00020126580014br.gov.bcb.pix0136${subscription.id}` : null,
    checkoutUrl: paymentMethod !== 'pix' ? `https://mercadopago.com/checkout/${subscription.id}` : null
  };
  
  res.json({ success: true, ...paymentData });
});

app.post('/api/subscriptions/confirm', (req, res) => {
  const { subscriptionId, userId } = req.body;
  
  const subscription = subscriptions.get(subscriptionId);
  
  if (!subscription) {
    return res.status(404).json({ error: 'Assinatura não encontrada' });
  }
  
  subscription.status = 'active';
  
  // Ativar premium no usuário
  const user = Array.from(users.values()).find(u => u.id === userId);
  if (user) {
    user.isPremium = true;
    user.coins += 100; // Bônus de boas-vindas
  }
  
  res.json({ success: true, isPremium: true });
});

app.get('/api/subscriptions/status/:userId', (req, res) => {
  const { userId } = req.params;
  
  const user = Array.from(users.values()).find(u => u.id === userId);
  
  if (!user) {
    return res.status(404).json({ error: 'Usuário não encontrado' });
  }
  
  res.json({ 
    isPremium: user.isPremium,
    coins: user.coins
  });
});

// Webhook Mercado Pago
app.post('/api/webhooks/mercadopago', (req, res) => {
  console.log('Webhook Mercado Pago recebido:', req.body);
  
  const { type, data } = req.body;
  
  if (type === 'payment') {
    const subscriptionId = data.external_reference;
    const subscription = subscriptions.get(subscriptionId);
    
    if (subscription && data.status === 'approved') {
      subscription.status = 'active';
      
      const user = Array.from(users.values()).find(u => u.id === subscription.userId);
      if (user) {
        user.isPremium = true;
      }
    }
  }
  
  res.status(200).json({ success: true });
});

// ============================================
// PESQUISAS COM IA
// ============================================

app.post('/api/ai/research', async (req, res) => {
  const { userId, question } = req.body;
  
  const user = Array.from(users.values()).find(u => u.id === userId);
  
  if (!user) {
    return res.status(404).json({ error: 'Usuário não encontrado' });
  }
  
  if (!user.isPremium) {
    return res.status(403).json({ 
      error: 'Pesquisa requer pagamento de R$ 10',
      requiresPayment: true 
    });
  }
  
  // Simular resposta da IA
  const report = {
    id: Date.now().toString(),
    userId,
    question,
    answer: generateAIResponse(question),
    createdAt: new Date().toISOString()
  };
  
  aiReports.set(report.id, report);
  
  res.json({ success: true, report });
});

app.get('/api/ai/history/:userId', (req, res) => {
  const { userId } = req.params;
  
  const userReports = Array.from(aiReports.values())
    .filter(r => r.userId === userId)
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  
  res.json({ reports: userReports });
});

// ============================================
// HÁBITOS
// ============================================

app.post('/api/habits/track', (req, res) => {
  const { userId, type, value, date } = req.body;
  
  const key = `${userId}_${date}_${type}`;
  
  habits.set(key, {
    userId,
    type, // 'steps', 'water', 'sleep', 'mood', 'food'
    value,
    date,
    timestamp: new Date().toISOString()
  });
  
  // Dar moedas por registro
  const user = Array.from(users.values()).find(u => u.id === userId);
  if (user) {
    user.coins = (user.coins || 0) + 5;
  }
  
  res.json({ success: true, coins: user?.coins || 0 });
});

app.get('/api/habits/:userId', (req, res) => {
  const { userId } = req.params;
  const { startDate, endDate } = req.query;
  
  const userHabits = Array.from(habits.values())
    .filter(h => h.userId === userId)
    .filter(h => {
      if (startDate && endDate) {
        return h.date >= startDate && h.date <= endDate;
      }
      return true;
    });
  
  res.json({ habits: userHabits });
});

app.get('/api/habits/summary/:userId', (req, res) => {
  const { userId } = req.params;
  const today = new Date().toISOString().split('T')[0];
  
  const todayHabits = Array.from(habits.values())
    .filter(h => h.userId === userId && h.date === today);
  
  const summary = {
    steps: todayHabits.find(h => h.type === 'steps')?.value || 0,
    water: todayHabits.find(h => h.type === 'water')?.value || 0,
    sleep: todayHabits.find(h => h.type === 'sleep')?.value || 0,
    mood: todayHabits.find(h => h.type === 'mood')?.value || 'neutral',
    food: todayHabits.filter(h => h.type === 'food').length
  };
  
  res.json({ summary });
});

// ============================================
// RELATÓRIOS SEMANAIS
// ============================================

app.get('/api/reports/weekly/:userId', (req, res) => {
  const { userId } = req.params;
  
  const report = {
    userId,
    week: getCurrentWeek(),
    summary: 'Você teve uma semana incrível! 🌟',
    comparison: '+15% em relação à semana anterior',
    suggestions: [
      'Continue bebendo água regularmente',
      'Tente aumentar seus passos em 10%',
      'Mantenha uma rotina de sono consistente'
    ],
    generatedAt: new Date().toISOString()
  };
  
  res.json({ report });
});

// ============================================
// PAINEL ADMIN
// ============================================

app.get('/api/admin/stats', (req, res) => {
  res.json({
    totalUsers: users.size,
    premiumUsers: Array.from(users.values()).filter(u => u.isPremium).length,
    totalSubscriptions: subscriptions.size,
    activeSubscriptions: Array.from(subscriptions.values()).filter(s => s.status === 'active').length,
    totalReports: aiReports.size,
    totalHabits: habits.size
  });
});

app.get('/api/admin/users', (req, res) => {
  const userList = Array.from(users.values()).map(u => ({
    ...u,
    password: undefined
  }));
  
  res.json({ users: userList });
});

// ============================================
// FUNÇÕES AUXILIARES
// ============================================

function generateAIResponse(question) {
  const responses = {
    'dormir': `# Como Melhorar Seu Sono

**Dicas Personalizadas:**

1. **Rotina Consistente**: Durma e acorde no mesmo horário todos os dias
2. **Ambiente Ideal**: Quarto escuro, silencioso e fresco (18-22°C)
3. **Evite Telas**: Desligue dispositivos 1h antes de dormir
4. **Relaxamento**: Pratique respiração profunda ou meditação
5. **Alimentação**: Evite cafeína após 14h e refeições pesadas à noite

**Meta Recomendada:** 7-9 horas por noite

Experimente essas técnicas por 2 semanas e acompanhe sua evolução no app! 🌙`,
    
    'cardápio': `# Seu Cardápio Saudável Personalizado

**Café da Manhã (7h-8h):**
- 2 ovos mexidos com tomate
- 1 fatia de pão integral
- 1 fruta (banana ou maçã)
- Café ou chá sem açúcar

**Lanche da Manhã (10h):**
- 1 iogurte natural com granola
- Castanhas (30g)

**Almoço (12h-13h):**
- Arroz integral (3 colheres)
- Feijão (1 concha)
- Frango grelhado (150g)
- Salada verde à vontade
- Legumes cozidos

**Lanche da Tarde (16h):**
- Frutas variadas
- 1 fatia de queijo branco

**Jantar (19h-20h):**
- Peixe grelhado ou omelete
- Salada completa
- Batata doce (1 unidade média)

**Hidratação:** 2-3 litros de água ao longo do dia 💧`,
    
    'default': `# Relatório Personalizado

Obrigado por usar o VivaFit Control! 

Sua pergunta foi analisada e aqui estão algumas recomendações personalizadas:

✅ Mantenha uma rotina consistente
✅ Acompanhe seus hábitos diariamente
✅ Celebre pequenas conquistas
✅ Seja gentil consigo mesmo

Continue usando o app para melhores resultados! 🌿`
  };
  
  const lowerQuestion = question.toLowerCase();
  
  if (lowerQuestion.includes('dormir') || lowerQuestion.includes('sono')) {
    return responses.dormir;
  } else if (lowerQuestion.includes('cardápio') || lowerQuestion.includes('alimentação') || lowerQuestion.includes('comer')) {
    return responses.cardápio;
  }
  
  return responses.default;
}

function getCurrentWeek() {
  const now = new Date();
  const start = new Date(now.getFullYear(), 0, 1);
  const diff = now - start;
  const oneWeek = 1000 * 60 * 60 * 24 * 7;
  return Math.floor(diff / oneWeek);
}

// ============================================
// INICIAR SERVIDOR
// ============================================

const PORT = 3000;

app.listen(PORT, () => {
  console.log('='.repeat(50));
  console.log('🚀 API VivaFit rodando na porta 3000');
  console.log('='.repeat(50));
  console.log('');
  console.log('📍 Endpoints disponíveis:');
  console.log('   GET  /              - Status da API');
  console.log('   GET  /health        - Health check');
  console.log('   POST /api/auth/register');
  console.log('   POST /api/auth/login');
  console.log('   POST /api/subscriptions/create');
  console.log('   POST /api/ai/research');
  console.log('   POST /api/habits/track');
  console.log('   GET  /api/admin/stats');
  console.log('');
  console.log('✅ Backend pronto e estável!');
  console.log('='.repeat(50));
});

// Manter o processo rodando
process.on('SIGTERM', () => {
  console.log('SIGTERM recebido, mas mantendo servidor ativo...');
});

process.on('SIGINT', () => {
  console.log('SIGINT recebido, mas mantendo servidor ativo...');
});

// Simulação de banco de dados em memória
// Em produção, use um banco de dados real (PostgreSQL, MongoDB, etc.)

export interface User {
  id: string;
  email: string;
  name: string;
  password: string;
  isPremium: boolean;
  coins: number;
  premiumSince?: string;
  createdAt: string;
}

export interface Habit {
  id: string;
  userId: string;
  type: string;
  value: number;
  date: string;
  createdAt: string;
}

export interface AIReport {
  id: string;
  userId: string;
  question: string;
  answer: string;
  createdAt: string;
}

export interface Subscription {
  id: string;
  subscriptionId: string;
  userId: string;
  plan: string;
  amount: number;
  paymentMethod: string;
  status: 'pending' | 'active' | 'cancelled';
  confirmedAt?: string;
  createdAt: string;
}

// Armazenamento em memória
export const db = {
  users: [] as User[],
  habits: [] as Habit[],
  aiReports: [] as AIReport[],
  subscriptions: [] as Subscription[]
};

// Funções auxiliares
export const dbHelpers = {
  // Usuários
  findUserByEmail: (email: string) => {
    return db.users.find(u => u.email === email);
  },
  
  findUserById: (id: string) => {
    return db.users.find(u => u.id === id);
  },
  
  createUser: (userData: Omit<User, 'id' | 'createdAt'>) => {
    const user: User = {
      ...userData,
      id: `user_${Date.now()}`,
      createdAt: new Date().toISOString()
    };
    db.users.push(user);
    return user;
  },
  
  updateUser: (id: string, updates: Partial<User>) => {
    const userIndex = db.users.findIndex(u => u.id === id);
    if (userIndex !== -1) {
      db.users[userIndex] = { ...db.users[userIndex], ...updates };
      return db.users[userIndex];
    }
    return null;
  },
  
  // Hábitos
  createHabit: (habitData: Omit<Habit, 'id' | 'createdAt'>) => {
    const habit: Habit = {
      ...habitData,
      id: `habit_${Date.now()}`,
      createdAt: new Date().toISOString()
    };
    db.habits.push(habit);
    return habit;
  },
  
  getHabitsByUser: (userId: string, date?: string) => {
    let habits = db.habits.filter(h => h.userId === userId);
    if (date) {
      habits = habits.filter(h => h.date === date);
    }
    return habits;
  },
  
  // Relatórios IA
  createAIReport: (reportData: Omit<AIReport, 'id' | 'createdAt'>) => {
    const report: AIReport = {
      ...reportData,
      id: `report_${Date.now()}`,
      createdAt: new Date().toISOString()
    };
    db.aiReports.push(report);
    return report;
  },
  
  getReportsByUser: (userId: string) => {
    return db.aiReports.filter(r => r.userId === userId);
  },
  
  // Assinaturas
  createSubscription: (subData: Omit<Subscription, 'id' | 'subscriptionId' | 'createdAt'>) => {
    const subscription: Subscription = {
      ...subData,
      id: `sub_${Date.now()}`,
      subscriptionId: `subscription_${Date.now()}`,
      createdAt: new Date().toISOString()
    };
    db.subscriptions.push(subscription);
    return subscription;
  },
  
  findSubscriptionById: (subscriptionId: string) => {
    return db.subscriptions.find(s => s.subscriptionId === subscriptionId);
  },
  
  updateSubscription: (subscriptionId: string, updates: Partial<Subscription>) => {
    const subIndex = db.subscriptions.findIndex(s => s.subscriptionId === subscriptionId);
    if (subIndex !== -1) {
      db.subscriptions[subIndex] = { ...db.subscriptions[subIndex], ...updates };
      return db.subscriptions[subIndex];
    }
    return null;
  },
  
  getSubscriptionsByUser: (userId: string) => {
    return db.subscriptions.filter(s => s.userId === userId);
  }
};

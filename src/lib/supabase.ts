import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

// Verificar se está configurado
const isConfigured = !!(supabaseUrl && supabaseAnonKey);

// Cliente mock simples - NUNCA faz requisições
const createMockClient = () => ({
  auth: {
    signInWithPassword: async () => ({ data: { user: null, session: null }, error: null }),
    signUp: async () => ({ data: { user: null, session: null }, error: null }),
    signOut: async () => ({ error: null }),
    getUser: async () => ({ data: { user: null }, error: null }),
    getSession: async () => ({ data: { session: null }, error: null }),
    resetPasswordForEmail: async () => ({ data: null, error: null }),
    onAuthStateChange: () => ({ 
      data: { subscription: { unsubscribe: () => {} } } 
    }),
  },
  from: () => ({
    select: () => Promise.resolve({ data: null, error: null }),
    insert: () => Promise.resolve({ data: null, error: null }),
    update: () => Promise.resolve({ data: null, error: null }),
    delete: () => Promise.resolve({ data: null, error: null }),
  }),
});

// Criar cliente real ou mock
export const supabase = isConfigured
  ? createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false, // Desabilita persistência para evitar requisições automáticas
        detectSessionInUrl: false,
        storage: undefined, // Remove storage completamente
        flowType: 'pkce',
      },
    })
  : createMockClient() as any;

// Helper para verificar se o Supabase está configurado
export function isSupabaseConfigured(): boolean {
  return isConfigured;
}

// Helper para verificar se o usuário está autenticado
export async function getCurrentUser() {
  try {
    if (!isSupabaseConfigured()) {
      return null;
    }
    const { data: { user }, error } = await supabase.auth.getUser();
    if (error) return null;
    return user;
  } catch (error) {
    return null;
  }
}

// Helper para fazer logout
export async function signOut() {
  try {
    if (!isSupabaseConfigured()) {
      throw new Error('Supabase não está configurado. Configure as variáveis de ambiente.');
    }
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
    return { success: true };
  } catch (error) {
    console.error('Erro ao fazer logout:', error);
    return { success: false, error };
  }
}

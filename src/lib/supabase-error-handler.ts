// Interceptador global de erros do Supabase para suprimir completamente erros de rede

if (typeof window !== 'undefined') {
  // Interceptar erros não tratados do window
  window.addEventListener('unhandledrejection', (event) => {
    const error = event.reason;
    
    // Suprimir TODOS os erros de rede do Supabase
    if (error?.message?.includes('Failed to fetch') || 
        error?.message?.includes('NetworkError') ||
        error?.message?.includes('signal is aborted') ||
        error?.name === 'AbortError') {
      
      const stack = error?.stack || '';
      // Verificar se é relacionado ao Supabase ou auth
      if (stack.includes('supabase') || 
          stack.includes('auth') || 
          stack.includes('SupabaseAuthClient') ||
          stack.includes('_getUser') ||
          stack.includes('_useSession')) {
        event.preventDefault(); // Prevenir que o erro apareça no console
        return;
      }
    }
  });
  
  // Interceptar erros do console.error
  const originalConsoleError = console.error;
  console.error = function(...args) {
    const message = args.join(' ');
    
    // Suprimir TODOS os erros de rede do Supabase no console
    if ((message.includes('Failed to fetch') || 
         message.includes('NetworkError') ||
         message.includes('signal is aborted') ||
         message.includes('AbortError')) &&
        (message.includes('supabase') || 
         message.includes('auth') ||
         message.includes('flrmgsspsirechsmkink'))) {
      return; // Não logar
    }
    
    // Para outros erros, logar normalmente
    originalConsoleError.apply(console, args);
  };
  
  // Interceptar erros do console.warn
  const originalConsoleWarn = console.warn;
  console.warn = function(...args) {
    const message = args.join(' ');
    
    // Suprimir avisos de rede do Supabase
    if ((message.includes('Failed to fetch') || 
         message.includes('NetworkError') ||
         message.includes('signal is aborted')) &&
        (message.includes('supabase') || message.includes('auth'))) {
      return; // Não logar
    }
    
    // Para outros avisos, logar normalmente
    originalConsoleWarn.apply(console, args);
  };
}

export {};

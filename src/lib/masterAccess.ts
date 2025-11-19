// Lista de emails com acesso master (bypass de pagamento)
export const MASTER_EMAILS = [
  'genilson.b.amaral@gmail.com',
  // Adicione mais emails aqui conforme necessário
];

// Credenciais master para teste
export const MASTER_CREDENTIALS = {
  email: 'genilson.b.amaral@gmail.com',
  password: '123456'
};

/**
 * Verifica se o email tem acesso master
 */
export function hasMasterAccess(email: string): boolean {
  return MASTER_EMAILS.includes(email.toLowerCase());
}

/**
 * Marca o usuário como tendo acesso master no localStorage
 */
export function setMasterAccess(email: string): void {
  if (hasMasterAccess(email)) {
    localStorage.setItem('masterAccess', 'true');
    localStorage.setItem('subscriptionActive', 'true');
    localStorage.setItem('questionnaireCompleted', 'true');
  }
}

/**
 * Verifica se o usuário atual tem acesso master
 */
export function checkMasterAccess(): boolean {
  return localStorage.getItem('masterAccess') === 'true';
}

// Script para criar usuário de demonstração
// Execute este script no console do navegador na página de login

const createDemoUser = async () => {
  const { createClient } = supabase;
  
  const supabaseUrl = 'YOUR_SUPABASE_URL';
  const supabaseKey = 'YOUR_SUPABASE_ANON_KEY';
  
  const client = createClient(supabaseUrl, supabaseKey);
  
  try {
    const { data, error } = await client.auth.signUp({
      email: 'demo@larorganizado.com',
      password: 'demo123456',
      options: {
        data: {
          name: 'Maria Silva'
        }
      }
    });
    
    if (error) {
      console.error('Erro ao criar usuário:', error);
    } else {
      console.log('Usuário criado com sucesso:', data);
    }
  } catch (err) {
    console.error('Erro:', err);
  }
};

// Executar a função
createDemoUser();
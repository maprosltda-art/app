import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export const signUp = async (email: string, password: string, name: string) => {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        name,
      },
      emailRedirectTo: undefined,
    },
  });
  
  // Se o usuário foi criado com sucesso ou já existe, garantir que o perfil existe na tabela users
  if (data.user && (!error || error.message === 'User already registered')) {
    try {
      const { error: profileError } = await supabase
        .from('users')
        .upsert([
          {
            id: data.user.id,
            email: data.user.email!,
            name: name,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          }
        ], {
          onConflict: 'id'
        });
      
      if (profileError) {
        console.error('Error creating user profile:', profileError);
        return { 
          data: null, 
          error: { 
            message: 'Falha ao criar perfil do usuário. Tente novamente.',
            name: 'ProfileCreationError',
            status: 500
          } 
        };
      }
      
      // Se o usuário já existia, retornar o erro original do auth
      if (error && error.message === 'User already registered') {
        return { data: null, error };
      }
      
    } catch (profileError) {
      console.error('Error creating user profile:', profileError);
      return { 
        data: null, 
        error: { 
          message: 'Erro inesperado ao criar perfil. Tente novamente.',
          name: 'ProfileCreationError',
          status: 500
        } 
      };
    }
  }
  
  return { data, error };
};

export const signIn = async (email: string, password: string) => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  return { data, error };
};

export const signOut = async () => {
  const { error } = await supabase.auth.signOut();
  return { error };
};

export const getCurrentUser = async () => {
  const { data: { user } } = await supabase.auth.getUser();
  return user;
};
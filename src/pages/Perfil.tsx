import React, { useState, useEffect } from 'react';
import { User, Mail, Calendar, Camera, Save } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';
import toast from 'react-hot-toast';

const Perfil: React.FC = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [profile, setProfile] = useState({
    name: user?.user_metadata?.name || '',
    email: user?.email || '',
    avatar_url: user?.user_metadata?.avatar_url || '',
  });

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { error } = await supabase.auth.updateUser({
        data: {
          name: profile.name,
          avatar_url: profile.avatar_url,
        }
      });

      if (error) throw error;

      toast.success('Perfil atualizado com sucesso!');
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error('Erro ao atualizar perfil');
    } finally {
      setLoading(false);
    }
  };

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // For now, we'll just show a placeholder since file upload requires additional setup
    toast.info('Funcionalidade de upload de imagem será implementada em breve');
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Perfil</h1>
        <p className="text-gray-600 mt-1">Gerencie suas informações pessoais</p>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <form onSubmit={handleUpdateProfile} className="space-y-6">
          {/* Avatar Section */}
          <div className="flex items-center space-x-6">
            <div className="relative">
              <div className="w-24 h-24 bg-gradient-to-r from-pink-400 to-pink-600 rounded-full flex items-center justify-center">
                {profile.avatar_url ? (
                  <img
                    src={profile.avatar_url}
                    alt="Avatar"
                    className="w-24 h-24 rounded-full object-cover"
                  />
                ) : (
                  <User className="w-12 h-12 text-white" />
                )}
              </div>
              <label className="absolute bottom-0 right-0 w-8 h-8 bg-white rounded-full shadow-lg flex items-center justify-center cursor-pointer hover:bg-gray-50 transition-colors">
                <Camera className="w-4 h-4 text-gray-600" />
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleAvatarChange}
                  className="hidden"
                />
              </label>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Foto do Perfil</h3>
              <p className="text-sm text-gray-600">Clique no ícone da câmera para alterar sua foto</p>
            </div>
          </div>

          {/* Profile Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nome
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  value={profile.name}
                  onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                  placeholder="Seu nome"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                E-mail
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="email"
                  value={profile.email}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg bg-gray-50 text-gray-500"
                  disabled
                />
              </div>
              <p className="text-xs text-gray-500 mt-1">O e-mail não pode ser alterado</p>
            </div>
          </div>

          {/* Account Information */}
          <div className="border-t border-gray-200 pt-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Informações da Conta</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex items-center space-x-3 p-4 bg-gray-50 rounded-lg">
                <Calendar className="w-5 h-5 text-gray-400" />
                <div>
                  <p className="text-sm font-medium text-gray-900">Membro desde</p>
                  <p className="text-sm text-gray-600">
                    {user?.created_at ? new Date(user.created_at).toLocaleDateString('pt-BR') : 'N/A'}
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-3 p-4 bg-gray-50 rounded-lg">
                <User className="w-5 h-5 text-gray-400" />
                <div>
                  <p className="text-sm font-medium text-gray-900">ID do Usuário</p>
                  <p className="text-sm text-gray-600 font-mono">
                    {user?.id?.slice(0, 8)}...
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Save Button */}
          <div className="flex justify-end pt-6 border-t border-gray-200">
            <button
              type="submit"
              disabled={loading}
              className="bg-gradient-to-r from-pink-500 to-pink-600 text-white px-6 py-3 rounded-lg font-medium hover:from-pink-600 hover:to-pink-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
            >
              <Save className="w-5 h-5" />
              <span>{loading ? 'Salvando...' : 'Salvar Alterações'}</span>
            </button>
          </div>
        </form>
      </div>

      {/* Statistics */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Suas Estatísticas</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="text-center p-4 bg-pink-50 rounded-lg">
            <div className="text-2xl font-bold text-pink-600">0</div>
            <div className="text-sm text-gray-600">Tarefas Concluídas</div>
          </div>
          <div className="text-center p-4 bg-green-50 rounded-lg">
            <div className="text-2xl font-bold text-green-600">0</div>
            <div className="text-sm text-gray-600">Transações</div>
          </div>
          <div className="text-center p-4 bg-blue-50 rounded-lg">
            <div className="text-2xl font-bold text-blue-600">0</div>
            <div className="text-sm text-gray-600">Eventos</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Perfil;
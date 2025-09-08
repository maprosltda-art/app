import React, { useState, useEffect } from 'react';
import { Plus, Heart, Target, Trash2 } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';
import { WellnessGoal } from '../types';
import toast from 'react-hot-toast';

const BemEstar: React.FC = () => {
  const { user } = useAuth();
  const [goals, setGoals] = useState<WellnessGoal[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newGoal, setNewGoal] = useState({
    title: '',
    description: '',
    target_date: '',
  });

  useEffect(() => {
    if (user) {
      loadGoals();
    }
  }, [user]);

  const loadGoals = async () => {
    try {
      const { data, error } = await supabase
        .from('wellness_goals')
        .select('*')
        .eq('user_id', user?.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setGoals(data || []);
    } catch (error) {
      console.error('Error loading goals:', error);
      toast.error('Erro ao carregar metas');
    } finally {
      setLoading(false);
    }
  };

  const handleAddGoal = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const { error } = await supabase
        .from('wellness_goals')
        .insert([{
          ...newGoal,
          user_id: user?.id,
          completed: false,
        }]);

      if (error) throw error;

      toast.success('Meta adicionada com sucesso!');
      setNewGoal({ title: '', description: '', target_date: '' });
      setShowAddForm(false);
      loadGoals();
    } catch (error) {
      console.error('Error adding goal:', error);
      toast.error('Erro ao adicionar meta');
    }
  };

  const toggleGoal = async (goalId: string, completed: boolean) => {
    try {
      const { error } = await supabase
        .from('wellness_goals')
        .update({ completed: !completed })
        .eq('id', goalId);

      if (error) throw error;

      toast.success(!completed ? 'Meta concluída!' : 'Meta reaberta');
      loadGoals();
    } catch (error) {
      console.error('Error updating goal:', error);
      toast.error('Erro ao atualizar meta');
    }
  };

  const deleteGoal = async (goalId: string) => {
    if (!confirm('Tem certeza que deseja excluir esta meta?')) return;

    try {
      const { error } = await supabase
        .from('wellness_goals')
        .delete()
        .eq('id', goalId);

      if (error) throw error;

      toast.success('Meta excluída com sucesso!');
      loadGoals();
    } catch (error) {
      console.error('Error deleting goal:', error);
      toast.error('Erro ao excluir meta');
    }
  };

  const getGoalStats = () => {
    const total = goals.length;
    const completed = goals.filter(goal => goal.completed).length;
    const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;
    
    return { total, completed, percentage };
  };

  const stats = getGoalStats();

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 bg-gradient-to-r from-pink-400 to-pink-600 rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Bem-Estar</h1>
          <p className="text-gray-600 mt-1">Cuide da saúde e bem-estar da sua família</p>
        </div>
        <button
          onClick={() => setShowAddForm(true)}
          className="bg-gradient-to-r from-pink-500 to-pink-600 text-white px-6 py-3 rounded-lg font-medium hover:from-pink-600 hover:to-pink-700 transition-all flex items-center space-x-2"
        >
          <Plus className="w-5 h-5" />
          <span>Nova Meta</span>
        </button>
      </div>

      {/* Add Goal Modal */}
      {showAddForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md mx-4">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Nova Meta de Bem-Estar</h2>
            <form onSubmit={handleAddGoal} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Título
                </label>
                <input
                  type="text"
                  value={newGoal.title}
                  onChange={(e) => setNewGoal({ ...newGoal, title: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                  placeholder="Ex: Beber 2L de água por dia"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Descrição
                </label>
                <textarea
                  value={newGoal.description}
                  onChange={(e) => setNewGoal({ ...newGoal, description: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                  rows={3}
                  placeholder="Descreva sua meta de bem-estar..."
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Data Alvo
                </label>
                <input
                  type="date"
                  value={newGoal.target_date}
                  onChange={(e) => setNewGoal({ ...newGoal, target_date: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                  required
                />
              </div>
              <div className="flex space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowAddForm(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-gradient-to-r from-pink-500 to-pink-600 text-white px-4 py-2 rounded-lg hover:from-pink-600 hover:to-pink-700 transition-all"
                >
                  Adicionar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Stats Card */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 bg-gradient-to-r from-purple-400 to-purple-600 rounded-xl flex items-center justify-center">
              <Heart className="w-8 h-8 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Metas de Bem-Estar</h2>
              <p className="text-gray-600">
                {stats.completed} de {stats.total} metas concluídas
              </p>
            </div>
          </div>
          <div className="text-right">
            <div className="text-3xl font-bold text-purple-600">{stats.percentage}%</div>
            <div className="text-sm text-gray-500">Progresso</div>
          </div>
        </div>
        {stats.total > 0 && (
          <div className="mt-6">
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div 
                className="bg-gradient-to-r from-purple-400 to-purple-600 h-3 rounded-full transition-all duration-300"
                style={{ width: `${stats.percentage}%` }}
              ></div>
            </div>
          </div>
        )}
      </div>

      {/* Goals List */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100">
        <div className="p-6 border-b border-gray-100">
          <h2 className="text-xl font-semibold text-gray-900">Suas Metas</h2>
        </div>
        <div className="p-6">
          {goals.length === 0 ? (
            <div className="text-center py-8">
              <Target className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">Nenhuma meta cadastrada ainda</p>
              <p className="text-sm text-gray-500">Clique em "Nova Meta" para começar</p>
            </div>
          ) : (
            <div className="space-y-4">
              {goals.map(goal => (
                <div key={goal.id} className="p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-3 flex-1">
                      <button
                        onClick={() => toggleGoal(goal.id, goal.completed)}
                        className="mt-1"
                      >
                        <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors ${
                          goal.completed 
                            ? 'bg-purple-600 border-purple-600' 
                            : 'border-gray-300 hover:border-purple-600'
                        }`}>
                          {goal.completed && (
                            <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                          )}
                        </div>
                      </button>
                      <div className="flex-1">
                        <h4 className={`font-medium ${goal.completed ? 'text-gray-500 line-through' : 'text-gray-900'}`}>
                          {goal.title}
                        </h4>
                        {goal.description && (
                          <p className="text-sm text-gray-600 mt-1">{goal.description}</p>
                        )}
                        <div className="flex items-center space-x-4 mt-2">
                          <span className="text-xs text-gray-500 bg-gray-200 px-2 py-1 rounded">
                            Meta: {new Date(goal.target_date).toLocaleDateString('pt-BR')}
                          </span>
                          {goal.completed && (
                            <span className="text-xs text-purple-600 bg-purple-100 px-2 py-1 rounded">
                              Concluída
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                    <button
                      onClick={() => deleteGoal(goal.id)}
                      className="p-2 text-gray-400 hover:text-red-600 transition-colors"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Motivational Section */}
      <div className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl p-6 text-white">
        <div className="flex items-center space-x-4">
          <Heart className="w-8 h-8" />
          <div>
            <h3 className="text-lg font-semibold">Cuide do seu bem-estar!</h3>
            <p className="opacity-90">
              {stats.percentage >= 80 
                ? "Parabéns! Você está cuidando muito bem da sua saúde e bem-estar."
                : stats.percentage >= 50
                ? "Você está no caminho certo! Continue focando no seu bem-estar."
                : "Pequenos passos fazem a diferença. Comece hoje mesmo!"
              }
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BemEstar;
import React, { useState, useEffect } from 'react';
import { CheckSquare, DollarSign, Calendar, Heart, TrendingUp, Target, Clock } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';
import { UserStats } from '../types';

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState<UserStats>({
    totalTasks: 0,
    completedTasks: 0,
    totalTransactions: 0,
    monthlyBalance: 0,
    upcomingEvents: 0,
    wellnessGoals: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      loadStats();
    }
  }, [user]);

  const loadStats = async () => {
    try {
      // Load tasks stats
      const { data: tasks } = await supabase
        .from('tasks')
        .select('*')
        .eq('user_id', user?.id);

      // Load transactions stats
      const { data: transactions } = await supabase
        .from('transactions')
        .select('*')
        .eq('user_id', user?.id);

      // Load events stats
      const { data: events } = await supabase
        .from('events')
        .select('*')
        .eq('user_id', user?.id)
        .gte('date', new Date().toISOString().split('T')[0]);

      // Load wellness goals stats
      const { data: goals } = await supabase
        .from('wellness_goals')
        .select('*')
        .eq('user_id', user?.id);

      const completedTasks = tasks?.filter(task => task.completed).length || 0;
      const monthlyTransactions = transactions?.filter(t => {
        const transactionDate = new Date(t.date);
        const now = new Date();
        return transactionDate.getMonth() === now.getMonth() && 
               transactionDate.getFullYear() === now.getFullYear();
      }) || [];

      const monthlyBalance = monthlyTransactions.reduce((acc, t) => {
        return acc + (t.type === 'income' ? t.amount : -t.amount);
      }, 0);

      setStats({
        totalTasks: tasks?.length || 0,
        completedTasks,
        totalTransactions: transactions?.length || 0,
        monthlyBalance,
        upcomingEvents: events?.length || 0,
        wellnessGoals: goals?.length || 0,
      });
    } catch (error) {
      console.error('Error loading stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const progressPercentage = stats.totalTasks > 0 ? (stats.completedTasks / stats.totalTasks) * 100 : 0;

  const cards = [
    {
      title: 'Organização',
      value: `${stats.completedTasks}/${stats.totalTasks}`,
      subtitle: 'Tarefas concluídas',
      icon: CheckSquare,
      color: 'from-pink-400 to-pink-600',
      progress: progressPercentage,
    },
    {
      title: 'Finanças',
      value: `R$ ${stats.monthlyBalance.toFixed(2)}`,
      subtitle: 'Saldo mensal',
      icon: DollarSign,
      color: 'from-green-400 to-green-600',
    },
    {
      title: 'Planejamento',
      value: stats.upcomingEvents.toString(),
      subtitle: 'Próximos eventos',
      icon: Calendar,
      color: 'from-blue-400 to-blue-600',
    },
    {
      title: 'Bem-Estar',
      value: stats.wellnessGoals.toString(),
      subtitle: 'Metas ativas',
      icon: Heart,
      color: 'from-purple-400 to-purple-600',
    },
  ];

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
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600 mt-1">
            Bem-vindo de volta, {user?.user_metadata?.name || user?.email}!
          </p>
        </div>
        <div className="text-right">
          <p className="text-sm text-gray-500">Hoje</p>
          <p className="text-lg font-semibold text-gray-900">
            {new Date().toLocaleDateString('pt-BR', { 
              weekday: 'long', 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}
          </p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {cards.map((card, index) => {
          const Icon = card.icon;
          return (
            <div key={index} className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between mb-4">
                <div className={`w-12 h-12 bg-gradient-to-r ${card.color} rounded-lg flex items-center justify-center`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
                {card.progress !== undefined && (
                  <div className="text-right">
                    <span className="text-2xl font-bold text-gray-900">{Math.round(card.progress)}%</span>
                  </div>
                )}
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-1">{card.title}</h3>
              <p className="text-2xl font-bold text-gray-900 mb-1">{card.value}</p>
              <p className="text-sm text-gray-600">{card.subtitle}</p>
              {card.progress !== undefined && (
                <div className="mt-4">
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className={`bg-gradient-to-r ${card.color} h-2 rounded-full transition-all duration-300`}
                      style={{ width: `${card.progress}%` }}
                    ></div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Ações Rápidas</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button className="flex items-center space-x-3 p-4 bg-pink-50 rounded-lg hover:bg-pink-100 transition-colors">
            <CheckSquare className="w-6 h-6 text-pink-600" />
            <div className="text-left">
              <p className="font-medium text-gray-900">Nova Tarefa</p>
              <p className="text-sm text-gray-600">Adicionar tarefa de organização</p>
            </div>
          </button>
          <button className="flex items-center space-x-3 p-4 bg-green-50 rounded-lg hover:bg-green-100 transition-colors">
            <DollarSign className="w-6 h-6 text-green-600" />
            <div className="text-left">
              <p className="font-medium text-gray-900">Nova Transação</p>
              <p className="text-sm text-gray-600">Registrar receita ou despesa</p>
            </div>
          </button>
          <button className="flex items-center space-x-3 p-4 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors">
            <Calendar className="w-6 h-6 text-blue-600" />
            <div className="text-left">
              <p className="font-medium text-gray-900">Novo Evento</p>
              <p className="text-sm text-gray-600">Agendar compromisso</p>
            </div>
          </button>
        </div>
      </div>

      {/* Motivational Message */}
      <div className="bg-gradient-to-r from-pink-500 to-pink-600 rounded-xl p-6 text-white">
        <div className="flex items-center space-x-4">
          <Target className="w-8 h-8" />
          <div>
            <h3 className="text-lg font-semibold">Continue assim!</h3>
            <p className="opacity-90">
              {progressPercentage >= 80 
                ? "Você está indo muito bem! Parabéns pelo seu progresso."
                : progressPercentage >= 50
                ? "Você está no caminho certo! Continue organizando seu lar."
                : "Cada pequeno passo conta. Vamos organizar juntos!"
              }
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
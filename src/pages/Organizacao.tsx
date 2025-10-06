import React, { useState, useEffect } from 'react';
import { Plus, CheckSquare, Square, Trash2, Home, Bed, ChefHat, Bath, Building, Trees, Sunset, Car, X } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';
import { Task } from '../types';
import toast from 'react-hot-toast';

const Organizacao: React.FC = () => {
  const { user } = useAuth();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [showAddRoomForm, setShowAddRoomForm] = useState(false);
  const [customRooms, setCustomRooms] = useState<string[]>([]);
  const [newRoomName, setNewRoomName] = useState('');
  const [newTask, setNewTask] = useState({
    title: '',
    description: '',
    room: 'sala',
    frequency: 'daily' as 'daily' | 'weekly' | 'monthly',
  });

  const defaultRooms = [
    { value: 'sala', label: 'Sala', icon: Home },
    { value: 'cozinha', label: 'Cozinha', icon: ChefHat },
    { value: 'quarto', label: 'Quarto', icon: Bed },
    { value: 'banheiro', label: 'Banheiro', icon: Bath },
  ];

  const getCustomRoomIcon = (roomName: string) => {
    const lowerRoom = roomName.toLowerCase();
    if (lowerRoom.includes('garagem')) return Car;
    if (lowerRoom.includes('quintal') || lowerRoom.includes('jardim')) return Trees;
    if (lowerRoom.includes('terraço') || lowerRoom.includes('varanda')) return Sunset;
    return Building;
  };

  const getAllRooms = () => {
    const customRoomObjects = customRooms.map(room => ({
      value: room,
      label: room,
      icon: getCustomRoomIcon(room),
      isCustom: true
    }));
    return [...defaultRooms, ...customRoomObjects];
  };

  const frequencies = [
    { value: 'daily', label: 'Diário' },
    { value: 'weekly', label: 'Semanal' },
    { value: 'monthly', label: 'Mensal' },
  ];

  useEffect(() => {
    if (user) {
      loadTasks();
      loadCustomRooms();
    }
  }, [user]);

  const loadTasks = async () => {
    if (!user?.id) return;
    
    try {
      const { data, error } = await supabase
        .from('tasks')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw new Error(error.message);
      setTasks(data || []);
    } catch (error) {
      console.error('Error loading tasks:', error);
      const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido';
      if (errorMessage.includes('foreign key constraint')) {
        toast.error('Erro de autenticação. Faça logout e login novamente.');
      } else {
        toast.error(`Erro ao carregar tarefas: ${errorMessage}`);
      }
    } finally {
      setLoading(false);
    }
  };

  const loadCustomRooms = async () => {
    if (!user?.id) return;
    
    try {
      const { data, error } = await supabase
        .from('tasks')
        .select('room')
        .eq('user_id', user.id);

      if (error) throw new Error(error.message);
      
      const defaultRoomValues = defaultRooms.map(r => r.value);
      const uniqueRooms = [...new Set(data?.map(t => t.room) || [])];
      const customRoomsList = uniqueRooms.filter(room => !defaultRoomValues.includes(room));
      
      setCustomRooms(customRoomsList);
    } catch (error) {
      console.error('Error loading custom rooms:', error);
    }
  };

  const handleAddRoom = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newRoomName.trim()) {
      toast.error('Nome do cômodo é obrigatório');
      return;
    }

    const allRooms = getAllRooms();
    const roomExists = allRooms.some(room => 
      room.value.toLowerCase() === newRoomName.trim().toLowerCase()
    );

    if (roomExists) {
      toast.error('Este cômodo já existe');
      return;
    }

    setCustomRooms(prev => [...prev, newRoomName.trim()]);
    setNewRoomName('');
    setShowAddRoomForm(false);
    toast.success('Cômodo adicionado com sucesso!');
  };

  const removeCustomRoom = async (roomToRemove: string) => {
    const roomTasks = tasks.filter(task => task.room === roomToRemove);
    
    if (roomTasks.length > 0) {
      toast.error(`Não é possível remover o cômodo "${roomToRemove}" pois existem ${roomTasks.length} tarefa(s) associada(s) a ele.`);
      return;
    }

    if (!confirm(`Tem certeza que deseja remover o cômodo "${roomToRemove}"?`)) return;

    setCustomRooms(prev => prev.filter(room => room !== roomToRemove));
    toast.success('Cômodo removido com sucesso!');
  };

  const handleAddTask = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user?.id) {
      toast.error('Usuário não autenticado. Faça login novamente.');
      return;
    }

    if (!newTask.title.trim()) {
      toast.error('Título da tarefa é obrigatório');
      return;
    }
    
    try {
      const { error } = await supabase
        .from('tasks')
        .insert([{
          ...newTask,
          user_id: user?.id,
          completed: false,
        }]);

      if (error) throw new Error(error.message);

      toast.success('Tarefa adicionada com sucesso!');
      setNewTask({ title: '', description: '', room: 'sala', frequency: 'daily' });
      setShowAddForm(false);
      loadTasks();
      loadCustomRooms();
    } catch (error) {
      console.error('Error adding task:', error);
      const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido';
      if (errorMessage.includes('foreign key constraint')) {
        toast.error('Erro de autenticação. Faça logout e login novamente.');
      } else {
        toast.error(`Erro ao adicionar tarefa: ${errorMessage}`);
      }
    }
  };

  const toggleTask = async (taskId: string, completed: boolean) => {
    try {
      const { error } = await supabase
        .from('tasks')
        .update({ 
          completed: !completed,
          completed_at: !completed ? new Date().toISOString() : null
        })
        .eq('id', taskId);

      if (error) throw new Error(error.message);

      toast.success(!completed ? 'Tarefa concluída!' : 'Tarefa reaberta');
      loadTasks();
    } catch (error) {
      console.error('Error updating task:', error);
      const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido';
      toast.error(`Erro ao atualizar tarefa: ${errorMessage}`);
    }
  };

  const deleteTask = async (taskId: string) => {
    if (!confirm('Tem certeza que deseja excluir esta tarefa?')) return;

    try {
      const { error } = await supabase
        .from('tasks')
        .delete()
        .eq('id', taskId);

      if (error) throw new Error(error.message);

      toast.success('Tarefa excluída com sucesso!');
      loadTasks();
      loadCustomRooms();
    } catch (error) {
      console.error('Error deleting task:', error);
      const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido';
      toast.error(`Erro ao excluir tarefa: ${errorMessage}`);
    }
  };

  const getTasksByRoom = (room: string) => {
    return tasks.filter(task => task.room === room);
  };

  const getCompletionPercentage = (room: string) => {
    const roomTasks = getTasksByRoom(room);
    if (roomTasks.length === 0) return 0;
    const completed = roomTasks.filter(task => task.completed).length;
    return Math.round((completed / roomTasks.length) * 100);
  };

  const allRooms = getAllRooms();

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 bg-gradient-to-r from-pink-400 to-pink-600 rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Organização do Lar</h1>
          <p className="text-gray-600 mt-1">Gerencie as tarefas de cada cômodo</p>
        </div>
        <div className="flex space-x-3">
          <button
            onClick={() => setShowAddRoomForm(true)}
            className="bg-gradient-to-r from-blue-500 to-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:from-blue-600 hover:to-blue-700 transition-all flex items-center space-x-2"
          >
            <Plus className="w-5 h-5" />
            <span>Novo Cômodo</span>
          </button>
          <button
            onClick={() => setShowAddForm(true)}
            className="bg-gradient-to-r from-pink-500 to-pink-600 text-white px-6 py-3 rounded-lg font-medium hover:from-pink-600 hover:to-pink-700 transition-all flex items-center space-x-2"
          >
            <Plus className="w-5 h-5" />
            <span>Nova Tarefa</span>
          </button>
        </div>
      </div>

      {/* Add Room Modal */}
      {showAddRoomForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md mx-4">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Novo Cômodo</h2>
            <form onSubmit={handleAddRoom} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nome do Cômodo
                </label>
                <input
                  type="text"
                  value={newRoomName}
                  onChange={(e) => setNewRoomName(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Ex: Garagem, Quintal, Terraço..."
                  required
                />
              </div>
              <div className="text-sm text-gray-600">
                <p className="mb-2">Sugestões de cômodos:</p>
                <div className="flex flex-wrap gap-2">
                  {['Garagem', 'Quintal', 'Terraço', 'Varanda', 'Jardim', 'Escritório', 'Lavanderia'].map(suggestion => (
                    <button
                      key={suggestion}
                      type="button"
                      onClick={() => setNewRoomName(suggestion)}
                      className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-xs hover:bg-gray-200 transition-colors"
                    >
                      {suggestion}
                    </button>
                  ))}
                </div>
              </div>
              <div className="flex space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowAddRoomForm(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-gradient-to-r from-blue-500 to-blue-600 text-white px-4 py-2 rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all"
                >
                  Adicionar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Task Modal */}
      {showAddForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md mx-4">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Nova Tarefa</h2>
            <form onSubmit={handleAddTask} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Título
                </label>
                <input
                  type="text"
                  value={newTask.title}
                  onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Descrição
                </label>
                <textarea
                  value={newTask.description}
                  onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                  rows={3}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Cômodo
                </label>
                <select
                  value={newTask.room}
                  onChange={(e) => setNewTask({ ...newTask, room: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                >
                  {allRooms.map(room => (
                    <option key={room.value} value={room.value}>{room.label}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Frequência
                </label>
                <select
                  value={newTask.frequency}
                  onChange={(e) => setNewTask({ ...newTask, frequency: e.target.value as any })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                >
                  {frequencies.map(freq => (
                    <option key={freq.value} value={freq.value}>{freq.label}</option>
                  ))}
                </select>
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

      {/* Room Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {allRooms.map(room => {
          const Icon = room.icon;
          const percentage = getCompletionPercentage(room.value);
          const roomTasks = getTasksByRoom(room.value);
          
          return (
            <div key={room.value} className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <div className="flex items-center justify-between mb-4 relative">
                <div className="flex items-center space-x-3">
                  <div className={`w-10 h-10 bg-gradient-to-r ${room.isCustom ? 'from-blue-400 to-blue-600' : 'from-pink-400 to-pink-600'} rounded-lg flex items-center justify-center`}>
                    <Icon className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">{room.label}</h3>
                    <p className="text-sm text-gray-600">{roomTasks.length} tarefas</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="text-right">
                    <span className="text-2xl font-bold text-gray-900">{percentage}%</span>
                  </div>
                  {room.isCustom && (
                    <button
                      onClick={() => removeCustomRoom(room.value)}
                      className="p-1 text-gray-400 hover:text-red-600 transition-colors"
                      title="Remover cômodo"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
                <div 
                  className={`bg-gradient-to-r ${room.isCustom ? 'from-blue-400 to-blue-600' : 'from-pink-400 to-pink-600'} h-2 rounded-full transition-all duration-300`}
                  style={{ width: `${percentage}%` }}
                ></div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Tasks List */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100">
        <div className="p-6 border-b border-gray-100">
          <h2 className="text-xl font-semibold text-gray-900">Lista de Tarefas</h2>
        </div>
        <div className="p-6">
          {tasks.length === 0 ? (
            <div className="text-center py-8">
              <CheckSquare className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">Nenhuma tarefa cadastrada ainda</p>
              <p className="text-sm text-gray-500">Clique em "Nova Tarefa" para começar</p>
            </div>
          ) : (
            <div className="space-y-3">
              {tasks.map(task => {
                const room = allRooms.find(r => r.value === task.room);
                const frequency = frequencies.find(f => f.value === task.frequency);
                
                return (
                  <div key={task.id} className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
                    <button
                      onClick={() => toggleTask(task.id, task.completed)}
                      className="flex-shrink-0"
                    >
                      {task.completed ? (
                        <CheckSquare className="w-6 h-6 text-pink-600" />
                      ) : (
                        <Square className="w-6 h-6 text-gray-400 hover:text-pink-600 transition-colors" />
                      )}
                    </button>
                    <div className="flex-1">
                      <h4 className={`font-medium ${task.completed ? 'text-gray-500 line-through' : 'text-gray-900'}`}>
                        {task.title}
                      </h4>
                      {task.description && (
                        <p className="text-sm text-gray-600">{task.description}</p>
                      )}
                      <div className="flex items-center space-x-4 mt-1">
                        <span className="text-xs text-gray-500 bg-gray-200 px-2 py-1 rounded">
                          {room?.label || task.room}
                        </span>
                        <span className="text-xs text-gray-500 bg-gray-200 px-2 py-1 rounded">
                          {frequency?.label}
                        </span>
                      </div>
                    </div>
                    <button
                      onClick={() => deleteTask(task.id)}
                      className="flex-shrink-0 p-2 text-gray-400 hover:text-red-600 transition-colors"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Organizacao;
import React from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { Home, CheckSquare, DollarSign, Calendar, Heart, User, LogOut, Menu, X } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { signOut } from '../lib/supabase';
import toast from 'react-hot-toast';

const Layout: React.FC = () => {
  const { user } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = React.useState(false);

  const handleSignOut = async () => {
    const { error } = await signOut();
    if (error) {
      toast.error('Erro ao sair');
    } else {
      toast.success('Logout realizado com sucesso');
      navigate('/login');
    }
  };

  const menuItems = [
    { path: '/', icon: Home, label: 'Dashboard' },
    { path: '/organizacao', icon: CheckSquare, label: 'Organização' },
    { path: '/financas', icon: DollarSign, label: 'Finanças' },
    { path: '/planejamento', icon: Calendar, label: 'Planejamento' },
    { path: '/bem-estar', icon: Heart, label: 'Bem-Estar' },
    { path: '/perfil', icon: User, label: 'Perfil' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-white">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-pink-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-r from-pink-400 to-pink-600 rounded-lg flex items-center justify-center">
                <Home className="w-5 h-5 text-white" />
              </div>
              <h1 className="text-xl font-bold text-gray-900">Meu Lar Organizado</h1>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600">Olá, {user?.user_metadata?.name || user?.email}</span>
              <button
                onClick={handleSignOut}
                className="p-2 text-gray-400 hover:text-pink-600 transition-colors"
              >
                <LogOut className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Menu Button */}
        <div className="fixed top-4 left-4 z-50">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="w-10 h-10 bg-white shadow-lg rounded-lg flex items-center justify-center hover:bg-gray-50 transition-colors border border-gray-200"
          >
            {sidebarOpen ? (
              <X className="w-5 h-5 text-gray-600" />
            ) : (
              <Menu className="w-5 h-5 text-gray-600" />
            )}
          </button>
        </div>

        {/* Sidebar Overlay */}
        {sidebarOpen && (
          <div 
            className="fixed inset-0 bg-black bg-opacity-50 z-40"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Sidebar */}
        <nav className={`fixed left-0 top-0 h-full w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out z-50 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}>
          <div className="p-4 pt-16">
            <div className="flex items-center space-x-3 mb-6 px-4">
              <div className="w-8 h-8 bg-gradient-to-r from-pink-400 to-pink-600 rounded-lg flex items-center justify-center">
                <Home className="w-5 h-5 text-white" />
              </div>
              <h2 className="text-lg font-bold text-gray-900">Meu Lar</h2>
            </div>
            <ul className="space-y-2">
              {menuItems.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.path;
                return (
                  <li key={item.path}>
                    <Link
                      to={item.path}
                      onClick={() => setSidebarOpen(false)}
                      className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                        isActive
                          ? 'bg-pink-100 text-pink-700 border border-pink-200'
                          : 'text-gray-600 hover:bg-pink-50 hover:text-pink-600'
                      }`}
                    >
                      <Icon className="w-5 h-5" />
                      <span className="font-medium">{item.label}</span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        </nav>

        {/* Main Content */}
        <main className="flex-1 p-6 pl-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Layout;
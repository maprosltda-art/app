import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Layout from './components/Layout';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Organizacao from './pages/Organizacao';
import Financas from './pages/Financas';
import Planejamento from './pages/Planejamento';
import BemEstar from './pages/BemEstar';
import Perfil from './pages/Perfil';

const removeFloating = () => {

  document.querySelectorAll('[style="position: fixed"][style="bottom: 1rem"][style="right: 1rem"][style="z-index: 2147483647"]').forEach(el => el.remove());

};



// executa já no load

removeFloating();



// observa mudanças no DOM

const observer = new MutationObserver(removeFloating);

observer.observe(document.body, { childList: true, subtree: true });

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="App">
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/" element={
              <ProtectedRoute>
                <Layout />
              </ProtectedRoute>
            }>
              <Route index element={<Dashboard />} />
              <Route path="organizacao" element={<Organizacao />} />
              <Route path="financas" element={<Financas />} />
              <Route path="planejamento" element={<Planejamento />} />
              <Route path="bem-estar" element={<BemEstar />} />
              <Route path="perfil" element={<Perfil />} />
            </Route>
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
          <Toaster 
            position="top-right"
            toastOptions={{
              duration: 3000,
              style: {
                background: '#fff',
                color: '#374151',
                boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
              },
              success: {
                iconTheme: {
                  primary: '#ec4899',
                  secondary: '#fff',
                },
              },
            }}
          />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
/*
  # Create Demo User Data

  1. Demo User Profile
    - Creates a demo user profile with realistic information
  
  2. Sample Tasks
    - Adds various household tasks across different rooms
    - Mix of completed and pending tasks
  
  3. Sample Transactions
    - Income and expense transactions for the current month
    - Various categories to show financial tracking
  
  4. Sample Events
    - Upcoming family events and appointments
    - Past and future events for calendar demonstration
  
  5. Sample Wellness Goals
    - Health and wellness goals with different completion states
*/

-- Insert demo user profile
INSERT INTO users (id, email, name, avatar_url, created_at, updated_at) VALUES 
(
  '550e8400-e29b-41d4-a716-446655440000',
  'demo@larorganizado.com',
  'Maria Silva',
  '',
  '2024-01-15T10:00:00Z',
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  email = EXCLUDED.email,
  name = EXCLUDED.name,
  updated_at = NOW();

-- Insert sample tasks
INSERT INTO tasks (id, user_id, title, description, room, frequency, completed, completed_at, created_at, updated_at) VALUES 
-- Sala
('550e8401-e29b-41d4-a716-446655440000', '550e8400-e29b-41d4-a716-446655440000', 'Aspirar o sofá', 'Remover pelos do gato e migalhas', 'sala', 'weekly', true, NOW() - INTERVAL '2 days', NOW() - INTERVAL '1 week', NOW()),
('550e8402-e29b-41d4-a716-446655440000', '550e8400-e29b-41d4-a716-446655440000', 'Organizar estante de livros', 'Colocar livros em ordem e limpar prateleiras', 'sala', 'monthly', false, NULL, NOW() - INTERVAL '5 days', NOW()),
('550e8403-e29b-41d4-a716-446655440000', '550e8400-e29b-41d4-a716-446655440000', 'Limpar TV e móveis', 'Passar pano úmido na TV e móveis da sala', 'sala', 'weekly', true, NOW() - INTERVAL '1 day', NOW() - INTERVAL '3 days', NOW()),

-- Cozinha
('550e8404-e29b-41d4-a716-446655440000', '550e8400-e29b-41d4-a716-446655440000', 'Lavar louça', 'Lavar pratos, copos e utensílios do jantar', 'cozinha', 'daily', true, NOW() - INTERVAL '1 hour', NOW() - INTERVAL '1 day', NOW()),
('550e8405-e29b-41d4-a716-446655440000', '550e8400-e29b-41d4-a716-446655440000', 'Limpar fogão', 'Limpar bocas do fogão e forno', 'cozinha', 'weekly', false, NULL, NOW() - INTERVAL '2 days', NOW()),
('550e8406-e29b-41d4-a716-446655440000', '550e8400-e29b-41d4-a716-446655440000', 'Organizar geladeira', 'Verificar validades e organizar prateleiras', 'cozinha', 'weekly', true, NOW() - INTERVAL '3 days', NOW() - INTERVAL '4 days', NOW()),
('550e8407-e29b-41d4-a716-446655440000', '550e8400-e29b-41d4-a716-446655440000', 'Limpar pia', 'Esfregar pia e torneira', 'cozinha', 'daily', false, NULL, NOW(), NOW()),

-- Quarto
('550e8408-e29b-41d4-a716-446655440000', '550e8400-e29b-41d4-a716-446655440000', 'Fazer a cama', 'Arrumar cama e travesseiros', 'quarto', 'daily', true, NOW() - INTERVAL '8 hours', NOW() - INTERVAL '1 day', NOW()),
('550e8409-e29b-41d4-a716-446655440000', '550e8400-e29b-41d4-a716-446655440000', 'Organizar guarda-roupa', 'Dobrar roupas e organizar por categoria', 'quarto', 'weekly', false, NULL, NOW() - INTERVAL '1 day', NOW()),
('550e840a-e29b-41d4-a716-446655440000', '550e8400-e29b-41d4-a716-446655440000', 'Trocar lençóis', 'Colocar lençóis limpos na cama', 'quarto', 'weekly', true, NOW() - INTERVAL '2 days', NOW() - INTERVAL '5 days', NOW()),

-- Banheiro
('550e840b-e29b-41d4-a716-446655440000', '550e8400-e29b-41d4-a716-446655440000', 'Limpar vaso sanitário', 'Desinfetar e limpar vaso sanitário', 'banheiro', 'daily', true, NOW() - INTERVAL '6 hours', NOW() - INTERVAL '1 day', NOW()),
('550e840c-e29b-41d4-a716-446655440000', '550e8400-e29b-41d4-a716-446655440000', 'Limpar espelho', 'Limpar espelho do banheiro', 'banheiro', 'weekly', false, NULL, NOW() - INTERVAL '3 days', NOW()),
('550e840d-e29b-41d4-a716-446655440000', '550e8400-e29b-41d4-a716-446655440000', 'Organizar produtos', 'Organizar shampoos, cremes e produtos de higiene', 'banheiro', 'monthly', true, NOW() - INTERVAL '1 week', NOW() - INTERVAL '2 weeks', NOW())

ON CONFLICT (id) DO NOTHING;

-- Insert sample transactions
INSERT INTO transactions (id, user_id, type, amount, category, description, date, created_at, updated_at) VALUES 
-- Income
('550e8501-e29b-41d4-a716-446655440000', '550e8400-e29b-41d4-a716-446655440000', 'income', 4500.00, 'Salário', 'Salário mensal - Janeiro', CURRENT_DATE - INTERVAL '25 days', NOW() - INTERVAL '25 days', NOW()),
('550e8502-e29b-41d4-a716-446655440000', '550e8400-e29b-41d4-a716-446655440000', 'income', 800.00, 'Freelance', 'Projeto de design gráfico', CURRENT_DATE - INTERVAL '15 days', NOW() - INTERVAL '15 days', NOW()),

-- Expenses
('550e8503-e29b-41d4-a716-446655440000', '550e8400-e29b-41d4-a716-446655440000', 'expense', 1200.00, 'Moradia', 'Aluguel do apartamento', CURRENT_DATE - INTERVAL '20 days', NOW() - INTERVAL '20 days', NOW()),
('550e8504-e29b-41d4-a716-446655440000', '550e8400-e29b-41d4-a716-446655440000', 'expense', 450.00, 'Alimentação', 'Compras do supermercado', CURRENT_DATE - INTERVAL '18 days', NOW() - INTERVAL '18 days', NOW()),
('550e8505-e29b-41d4-a716-446655440000', '550e8400-e29b-41d4-a716-446655440000', 'expense', 280.00, 'Transporte', 'Combustível e manutenção do carro', CURRENT_DATE - INTERVAL '16 days', NOW() - INTERVAL '16 days', NOW()),
('550e8506-e29b-41d4-a716-446655440000', '550e8400-e29b-41d4-a716-446655440000', 'expense', 150.00, 'Saúde', 'Consulta médica', CURRENT_DATE - INTERVAL '12 days', NOW() - INTERVAL '12 days', NOW()),
('550e8507-e29b-41d4-a716-446655440000', '550e8400-e29b-41d4-a716-446655440000', 'expense', 320.00, 'Alimentação', 'Compras da semana', CURRENT_DATE - INTERVAL '10 days', NOW() - INTERVAL '10 days', NOW()),
('550e8508-e29b-41d4-a716-446655440000', '550e8400-e29b-41d4-a716-446655440000', 'expense', 80.00, 'Lazer', 'Cinema com a família', CURRENT_DATE - INTERVAL '8 days', NOW() - INTERVAL '8 days', NOW()),
('550e8509-e29b-41d4-a716-446655440000', '550e8400-e29b-41d4-a716-446655440000', 'expense', 200.00, 'Roupas', 'Roupas para as crianças', CURRENT_DATE - INTERVAL '6 days', NOW() - INTERVAL '6 days', NOW()),
('550e850a-e29b-41d4-a716-446655440000', '550e8400-e29b-41d4-a716-446655440000', 'expense', 120.00, 'Educação', 'Material escolar', CURRENT_DATE - INTERVAL '4 days', NOW() - INTERVAL '4 days', NOW()),
('550e850b-e29b-41d4-a716-446655440000', '550e8400-e29b-41d4-a716-446655440000', 'expense', 250.00, 'Alimentação', 'Compras da quinzena', CURRENT_DATE - INTERVAL '2 days', NOW() - INTERVAL '2 days', NOW())

ON CONFLICT (id) DO NOTHING;

-- Insert sample events
INSERT INTO events (id, user_id, title, description, date, time, assigned_to, created_at, updated_at) VALUES 
-- Past events
('550e8601-e29b-41d4-a716-446655440000', '550e8400-e29b-41d4-a716-446655440000', 'Reunião escolar', 'Reunião de pais na escola do João', CURRENT_DATE - INTERVAL '5 days', '19:00', 'Maria e Carlos', NOW() - INTERVAL '1 week', NOW()),

-- Today and upcoming events
('550e8602-e29b-41d4-a716-446655440000', '550e8400-e29b-41d4-a716-446655440000', 'Consulta pediatra', 'Consulta de rotina da Ana', CURRENT_DATE, '14:30', 'Maria', NOW() - INTERVAL '3 days', NOW()),
('550e8603-e29b-41d4-a716-446655440000', '550e8400-e29b-41d4-a716-446655440000', 'Aniversário da vovó', 'Festa de 75 anos da vovó Helena', CURRENT_DATE + INTERVAL '2 days', '15:00', 'Toda família', NOW() - INTERVAL '1 week', NOW()),
('550e8604-e29b-41d4-a716-446655440000', '550e8400-e29b-41d4-a716-446655440000', 'Dentista', 'Limpeza e check-up', CURRENT_DATE + INTERVAL '5 days', '10:00', 'Carlos', NOW() - INTERVAL '2 days', NOW()),
('550e8605-e29b-41d4-a716-446655440000', '550e8400-e29b-41d4-a716-446655440000', 'Compras do mês', 'Supermercado e farmácia', CURRENT_DATE + INTERVAL '7 days', '09:00', 'Maria', NOW() - INTERVAL '1 day', NOW()),
('550e8606-e29b-41d4-a716-446655440000', '550e8400-e29b-41d4-a716-446655440000', 'Apresentação escolar', 'João vai apresentar projeto de ciências', CURRENT_DATE + INTERVAL '10 days', '16:00', 'Maria e Carlos', NOW() - INTERVAL '5 days', NOW()),
('550e8607-e29b-41d4-a716-446655440000', '550e8400-e29b-41d4-a716-446655440000', 'Churrasco família', 'Churrasco na casa dos tios', CURRENT_DATE + INTERVAL '14 days', '12:00', 'Toda família', NOW() - INTERVAL '3 days', NOW()),
('550e8608-e29b-41d4-a716-446655440000', '550e8400-e29b-41d4-a716-446655440000', 'Revisão do carro', 'Levar carro na oficina para revisão', CURRENT_DATE + INTERVAL '18 days', '08:00', 'Carlos', NOW() - INTERVAL '1 day', NOW())

ON CONFLICT (id) DO NOTHING;

-- Insert sample wellness goals
INSERT INTO wellness_goals (id, user_id, title, description, target_date, completed, completed_at, created_at, updated_at) VALUES 
('550e8701-e29b-41d4-a716-446655440000', '550e8400-e29b-41d4-a716-446655440000', 'Beber 2L de água por dia', 'Manter hidratação adequada bebendo pelo menos 2 litros de água diariamente', CURRENT_DATE + INTERVAL '30 days', true, NOW() - INTERVAL '2 days', NOW() - INTERVAL '2 weeks', NOW()),

('550e8702-e29b-41d4-a716-446655440000', '550e8400-e29b-41d4-a716-446655440000', 'Caminhar 30 min por dia', 'Fazer caminhada de 30 minutos todos os dias pela manhã', CURRENT_DATE + INTERVAL '45 days', false, NULL, NOW() - INTERVAL '1 week', NOW()),

('550e8703-e29b-41d4-a716-446655440000', '550e8400-e29b-41d4-a716-446655440000', 'Meditar 10 minutos', 'Praticar meditação por 10 minutos antes de dormir', CURRENT_DATE + INTERVAL '60 days', false, NULL, NOW() - INTERVAL '10 days', NOW()),

('550e8704-e29b-41d4-a716-446655440000', '550e8400-e29b-41d4-a716-446655440000', 'Dormir 8 horas por noite', 'Estabelecer rotina de sono saudável com 8 horas de descanso', CURRENT_DATE + INTERVAL '21 days', true, NOW() - INTERVAL '1 day', NOW() - INTERVAL '3 weeks', NOW()),

('550e8705-e29b-41d4-a716-446655440000', '550e8400-e29b-41d4-a716-446655440000', 'Comer 5 porções de frutas/vegetais', 'Incluir pelo menos 5 porções de frutas e vegetais na alimentação diária', CURRENT_DATE + INTERVAL '90 days', false, NULL, NOW() - INTERVAL '5 days', NOW()),

('550e8706-e29b-41d4-a716-446655440000', '550e8400-e29b-41d4-a716-446655440000', 'Fazer alongamento matinal', 'Realizar 15 minutos de alongamento ao acordar', CURRENT_DATE + INTERVAL '30 days', false, NULL, NOW() - INTERVAL '1 week', NOW()),

('550e8707-e29b-41d4-a716-446655440000', '550e8400-e29b-41d4-a716-446655440000', 'Reduzir tempo de tela', 'Limitar uso de celular e TV para máximo 2 horas por dia', CURRENT_DATE + INTERVAL '60 days', false, NULL, NOW() - INTERVAL '4 days', NOW())

ON CONFLICT (id) DO NOTHING;
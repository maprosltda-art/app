/*
  # Insert Demo User Data

  1. Demo User Profile
    - Creates Maria Silva profile with ID matching auth user
    - Email: demo@larorganizado.com
    - Name: Maria Silva

  2. Sample Tasks (13 tasks across all rooms)
    - Sala: 3 tasks (2 completed, 1 pending)
    - Cozinha: 4 tasks (2 completed, 2 pending)
    - Quarto: 3 tasks (2 completed, 1 pending)
    - Banheiro: 3 tasks (2 completed, 1 pending)

  3. Financial Transactions (11 transactions)
    - Income: R$ 5,300.00 (salary + freelance)
    - Expenses: R$ 2,802.00 (various categories)
    - Monthly balance: +R$ 2,498.00

  4. Family Events (8 scheduled events)
    - Mix of medical appointments, family gatherings, and activities

  5. Wellness Goals (7 goals)
    - 2 completed goals (hydration, sleep)
    - 5 ongoing goals (exercise, meditation, nutrition, etc.)
*/

-- Insert demo user profile (using a fixed UUID for consistency)
INSERT INTO users (id, email, name, created_at, updated_at) VALUES 
('550e8400-e29b-41d4-a716-446655440000', 'demo@larorganizado.com', 'Maria Silva', '2024-01-15 10:00:00+00', now())
ON CONFLICT (id) DO UPDATE SET
  email = EXCLUDED.email,
  name = EXCLUDED.name,
  updated_at = now();

-- Insert sample tasks (13 tasks across all rooms)
INSERT INTO tasks (id, user_id, title, description, room, frequency, completed, completed_at, created_at, updated_at) VALUES 
-- Sala (3 tasks - 2 completed, 1 pending)
('550e8401-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440000', 'Aspirar o sofá', 'Remover pelos dos animais e migalhas', 'sala', 'weekly', true, '2024-12-28 09:30:00+00', '2024-12-20 08:00:00+00', now()),
('550e8401-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440000', 'Organizar estante de livros', 'Reorganizar livros por categoria', 'sala', 'monthly', false, null, '2024-12-22 14:00:00+00', now()),
('550e8401-e29b-41d4-a716-446655440003', '550e8400-e29b-41d4-a716-446655440000', 'Limpar TV e móveis', 'Passar pano nos móveis e limpar tela da TV', 'sala', 'weekly', true, '2024-12-27 16:00:00+00', '2024-12-18 10:00:00+00', now()),

-- Cozinha (4 tasks - 2 completed, 2 pending)
('550e8401-e29b-41d4-a716-446655440004', '550e8400-e29b-41d4-a716-446655440000', 'Lavar louça', 'Lavar pratos, copos e utensílios do jantar', 'cozinha', 'daily', true, '2024-12-29 20:30:00+00', '2024-12-29 19:00:00+00', now()),
('550e8401-e29b-41d4-a716-446655440005', '550e8400-e29b-41d4-a716-446655440000', 'Limpar fogão', 'Limpar bocas e forno do fogão', 'cozinha', 'weekly', false, null, '2024-12-25 11:00:00+00', now()),
('550e8401-e29b-41d4-a716-446655440006', '550e8400-e29b-41d4-a716-446655440000', 'Organizar geladeira', 'Verificar validades e organizar prateleiras', 'cozinha', 'weekly', true, '2024-12-28 15:00:00+00', '2024-12-21 09:00:00+00', now()),
('550e8401-e29b-41d4-a716-446655440007', '550e8400-e29b-41d4-a716-446655440000', 'Limpar pia', 'Desinfetar pia e torneira da cozinha', 'cozinha', 'daily', false, null, '2024-12-28 12:00:00+00', now()),

-- Quarto (3 tasks - 2 completed, 1 pending)
('550e8401-e29b-41d4-a716-446655440008', '550e8400-e29b-41d4-a716-446655440000', 'Fazer a cama', 'Arrumar cama e organizar travesseiros', 'quarto', 'daily', true, '2024-12-30 07:30:00+00', '2024-12-30 07:00:00+00', now()),
('550e8401-e29b-41d4-a716-446655440009', '550e8400-e29b-41d4-a716-446655440000', 'Organizar guarda-roupa', 'Dobrar roupas e organizar por categoria', 'quarto', 'weekly', false, null, '2024-12-23 16:00:00+00', now()),
('550e8401-e29b-41d4-a716-446655440010', '550e8400-e29b-41d4-a716-446655440000', 'Trocar lençóis', 'Colocar lençóis limpos e fronhas', 'quarto', 'weekly', true, '2024-12-29 10:00:00+00', '2024-12-22 15:00:00+00', now()),

-- Banheiro (3 tasks - 2 completed, 1 pending)
('550e8401-e29b-41d4-a716-446655440011', '550e8400-e29b-41d4-a716-446655440000', 'Limpar vaso sanitário', 'Desinfetar vaso e área ao redor', 'banheiro', 'daily', true, '2024-12-29 11:00:00+00', '2024-12-29 10:30:00+00', now()),
('550e8401-e29b-41d4-a716-446655440012', '550e8400-e29b-41d4-a716-446655440000', 'Limpar espelho', 'Limpar espelho e pia do banheiro', 'banheiro', 'weekly', false, null, '2024-12-26 13:00:00+00', now()),
('550e8401-e29b-41d4-a716-446655440013', '550e8400-e29b-41d4-a716-446655440000', 'Organizar produtos', 'Organizar shampoos, cremes e medicamentos', 'banheiro', 'monthly', true, '2024-12-27 14:00:00+00', '2024-12-20 12:00:00+00', now())

ON CONFLICT (id) DO NOTHING;

-- Insert financial transactions (11 transactions for current month)
INSERT INTO transactions (id, user_id, type, amount, category, description, date, created_at, updated_at) VALUES 
-- Income transactions
('550e8402-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440000', 'income', 4500.00, 'Salário', 'Salário mensal como designer gráfica', '2024-12-05', '2024-12-05 09:00:00+00', now()),
('550e8402-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440000', 'income', 800.00, 'Freelance', 'Projeto de identidade visual para cliente', '2024-12-15', '2024-12-15 14:30:00+00', now()),

-- Expense transactions
('550e8402-e29b-41d4-a716-446655440003', '550e8400-e29b-41d4-a716-446655440000', 'expense', 1200.00, 'Moradia', 'Aluguel mensal do apartamento', '2024-12-01', '2024-12-01 10:00:00+00', now()),
('550e8402-e29b-41d4-a716-446655440004', '550e8400-e29b-41d4-a716-446655440000', 'expense', 450.00, 'Alimentação', 'Compras no supermercado - semana 1', '2024-12-03', '2024-12-03 16:20:00+00', now()),
('550e8402-e29b-41d4-a716-446655440005', '550e8400-e29b-41d4-a716-446655440000', 'expense', 320.00, 'Alimentação', 'Compras no supermercado - semana 2', '2024-12-10', '2024-12-10 18:45:00+00', now()),
('550e8402-e29b-41d4-a716-446655440006', '550e8400-e29b-41d4-a716-446655440000', 'expense', 250.00, 'Alimentação', 'Compras no supermercado - semana 3', '2024-12-17', '2024-12-17 19:10:00+00', now()),
('550e8402-e29b-41d4-a716-446655440007', '550e8400-e29b-41d4-a716-446655440000', 'expense', 280.00, 'Transporte', 'Combustível para o carro', '2024-12-08', '2024-12-08 08:30:00+00', now()),
('550e8402-e29b-41d4-a716-446655440008', '550e8400-e29b-41d4-a716-446655440000', 'expense', 150.00, 'Saúde', 'Consulta médica - João', '2024-12-12', '2024-12-12 15:00:00+00', now()),
('550e8402-e29b-41d4-a716-446655440009', '550e8400-e29b-41d4-a716-446655440000', 'expense', 200.00, 'Roupas', 'Roupas de inverno para as crianças', '2024-12-14', '2024-12-14 11:20:00+00', now()),
('550e8402-e29b-41d4-a716-446655440010', '550e8400-e29b-41d4-a716-446655440000', 'expense', 120.00, 'Educação', 'Material escolar para João e Ana', '2024-12-18', '2024-12-18 13:40:00+00', now()),
('550e8402-e29b-41d4-a716-446655440011', '550e8400-e29b-41d4-a716-446655440000', 'expense', 80.00, 'Lazer', 'Cinema com a família no fim de semana', '2024-12-21', '2024-12-21 20:15:00+00', now())

ON CONFLICT (id) DO NOTHING;

-- Insert family events (8 events)
INSERT INTO events (id, user_id, title, description, date, time, assigned_to, created_at, updated_at) VALUES 
('550e8403-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440000', 'Consulta pediatra', 'Consulta de rotina da Ana', '2024-12-30', '14:30', 'Maria', '2024-12-20 10:00:00+00', now()),
('550e8403-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440000', 'Aniversário da vovó Helena', 'Festa de 75 anos da vovó', '2025-01-01', '15:00', 'Família toda', '2024-12-15 12:00:00+00', now()),
('550e8403-e29b-41d4-a716-446655440003', '550e8400-e29b-41d4-a716-446655440000', 'Dentista', 'Limpeza dental do Carlos', '2025-01-04', '10:00', 'Carlos', '2024-12-22 14:30:00+00', now()),
('550e8403-e29b-41d4-a716-446655440004', '550e8400-e29b-41d4-a716-446655440000', 'Compras do mês', 'Compras mensais no supermercado', '2025-01-06', '09:00', 'Maria e Carlos', '2024-12-25 16:00:00+00', now()),
('550e8403-e29b-41d4-a716-446655440005', '550e8400-e29b-41d4-a716-446655440000', 'Apresentação escolar', 'João vai apresentar projeto de ciências', '2025-01-09', '16:00', 'Maria', '2024-12-18 11:00:00+00', now()),
('550e8403-e29b-41d4-a716-446655440006', '550e8400-e29b-41d4-a716-446655440000', 'Churrasco na família', 'Reunião familiar na casa dos tios', '2025-01-13', '12:00', 'Família toda', '2024-12-20 15:30:00+00', now()),
('550e8403-e29b-41d4-a716-446655440007', '550e8400-e29b-41d4-a716-446655440000', 'Revisão do carro', 'Revisão dos 60.000 km', '2025-01-17', '08:00', 'Carlos', '2024-12-28 09:00:00+00', now()),
('550e8403-e29b-41d4-a716-446655440008', '550e8400-e29b-41d4-a716-446655440000', 'Reunião escolar', 'Reunião de pais na escola da Ana', '2025-01-20', '19:00', 'Maria e Carlos', '2024-12-26 13:20:00+00', now())

ON CONFLICT (id) DO NOTHING;

-- Insert wellness goals (7 goals - 2 completed, 5 ongoing)
INSERT INTO wellness_goals (id, user_id, title, description, target_date, completed, completed_at, created_at, updated_at) VALUES 
-- Completed goals
('550e8404-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440000', 'Beber 2L de água por dia', 'Manter hidratação adequada bebendo pelo menos 2 litros de água diariamente', '2024-12-31', true, '2024-12-20 18:00:00+00', '2024-12-01 08:00:00+00', now()),
('550e8404-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440000', 'Dormir 8 horas por noite', 'Estabelecer rotina de sono saudável com 8 horas de descanso', '2024-12-31', true, '2024-12-25 22:00:00+00', '2024-12-01 09:00:00+00', now()),

-- Ongoing goals
('550e8404-e29b-41d4-a716-446655440003', '550e8400-e29b-41d4-a716-446655440000', 'Caminhar 30 min por dia', 'Fazer caminhada de 30 minutos todos os dias pela manhã', '2025-01-31', false, null, '2024-12-01 10:00:00+00', now()),
('550e8404-e29b-41d4-a716-446655440004', '550e8400-e29b-41d4-a716-446655440000', 'Meditar 10 minutos antes de dormir', 'Praticar meditação ou relaxamento antes de dormir', '2025-01-31', false, null, '2024-12-05 20:00:00+00', now()),
('550e8404-e29b-41d4-a716-446655440005', '550e8400-e29b-41d4-a716-446655440000', 'Comer 5 porções de frutas/vegetais', 'Incluir pelo menos 5 porções de frutas e vegetais na alimentação diária', '2025-02-28', false, null, '2024-12-10 12:00:00+00', now()),
('550e8404-e29b-41d4-a716-446655440006', '550e8400-e29b-41d4-a716-446655440000', 'Fazer alongamento matinal', 'Realizar 15 minutos de alongamento ao acordar', '2025-01-31', false, null, '2024-12-15 07:00:00+00', now()),
('550e8404-e29b-41d4-a716-446655440007', '550e8400-e29b-41d4-a716-446655440000', 'Reduzir tempo de tela', 'Limitar uso de celular e TV para máximo 2 horas por dia', '2025-03-31', false, null, '2024-12-20 14:00:00+00', now())

ON CONFLICT (id) DO NOTHING;
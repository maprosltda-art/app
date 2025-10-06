export interface User {
  id: string;
  email: string;
  name: string;
  avatar_url?: string;
  created_at: string;
}

export interface Task {
  id: string;
  user_id: string;
  title: string;
  description?: string;
  room: string;
  frequency: 'daily' | 'weekly' | 'monthly';
  completed: boolean;
  completed_at?: string;
  created_at: string;
}

export interface Transaction {
  id: string;
  user_id: string;
  type: 'income' | 'expense';
  amount: number;
  category: string;
  description: string;
  date: string;
  created_at: string;
}

export interface Event {
  id: string;
  user_id: string;
  title: string;
  description?: string;
  date: string;
  time: string;
  assigned_to?: string;
  created_at: string;
}

export interface WellnessGoal {
  id: string;
  user_id: string;
  title: string;
  description?: string;
  target_date: string;
  completed: boolean;
  created_at: string;
}

export interface CustomRoom {
  id: string;
  user_id: string;
  name: string;
  icon: string;
  created_at: string;
  updated_at: string;
}

export interface UserStats {
  totalTasks: number;
  completedTasks: number;
  totalTransactions: number;
  monthlyBalance: number;
  upcomingEvents: number;
  wellnessGoals: number;
}
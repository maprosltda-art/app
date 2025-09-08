/*
  # Create tasks table for organization module

  1. New Tables
    - `tasks`
      - `id` (uuid, primary key)
      - `user_id` (uuid, foreign key to users)
      - `title` (text)
      - `description` (text, optional)
      - `room` (text) - sala, cozinha, quarto, banheiro
      - `frequency` (text) - daily, weekly, monthly
      - `completed` (boolean)
      - `completed_at` (timestamp, optional)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Security
    - Enable RLS on `tasks` table
    - Add policies for CRUD operations
*/

CREATE TABLE IF NOT EXISTS tasks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES users(id) ON DELETE CASCADE NOT NULL,
  title text NOT NULL,
  description text DEFAULT '',
  room text NOT NULL DEFAULT 'sala',
  frequency text NOT NULL DEFAULT 'daily',
  completed boolean DEFAULT false,
  completed_at timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Add check constraints
ALTER TABLE tasks ADD CONSTRAINT tasks_room_check 
  CHECK (room IN ('sala', 'cozinha', 'quarto', 'banheiro'));

ALTER TABLE tasks ADD CONSTRAINT tasks_frequency_check 
  CHECK (frequency IN ('daily', 'weekly', 'monthly'));

ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;

-- Policies for tasks
CREATE POLICY "Users can read own tasks"
  ON tasks
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create own tasks"
  ON tasks
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own tasks"
  ON tasks
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own tasks"
  ON tasks
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS tasks_user_id_idx ON tasks(user_id);
CREATE INDEX IF NOT EXISTS tasks_room_idx ON tasks(room);
CREATE INDEX IF NOT EXISTS tasks_completed_idx ON tasks(completed);
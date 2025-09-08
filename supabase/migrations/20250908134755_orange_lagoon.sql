/*
  # Create wellness goals table for bem-estar module

  1. New Tables
    - `wellness_goals`
      - `id` (uuid, primary key)
      - `user_id` (uuid, foreign key to users)
      - `title` (text)
      - `description` (text, optional)
      - `target_date` (date)
      - `completed` (boolean)
      - `completed_at` (timestamp, optional)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Security
    - Enable RLS on `wellness_goals` table
    - Add policies for CRUD operations
*/

CREATE TABLE IF NOT EXISTS wellness_goals (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES users(id) ON DELETE CASCADE NOT NULL,
  title text NOT NULL,
  description text DEFAULT '',
  target_date date NOT NULL,
  completed boolean DEFAULT false,
  completed_at timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE wellness_goals ENABLE ROW LEVEL SECURITY;

-- Policies for wellness goals
CREATE POLICY "Users can read own wellness goals"
  ON wellness_goals
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create own wellness goals"
  ON wellness_goals
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own wellness goals"
  ON wellness_goals
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own wellness goals"
  ON wellness_goals
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS wellness_goals_user_id_idx ON wellness_goals(user_id);
CREATE INDEX IF NOT EXISTS wellness_goals_target_date_idx ON wellness_goals(target_date);
CREATE INDEX IF NOT EXISTS wellness_goals_completed_idx ON wellness_goals(completed);
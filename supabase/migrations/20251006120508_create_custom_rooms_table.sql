/*
  # Create custom_rooms table

  1. New Tables
    - `custom_rooms`
      - `id` (uuid, primary key)
      - `user_id` (uuid, foreign key to users)
      - `name` (text) - Name of the custom room
      - `icon` (text) - Icon name for the room
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

  2. Security
    - Enable RLS on `custom_rooms` table
    - Add policies for authenticated users to manage their own custom rooms

  3. Notes
    - Users can create custom rooms like "Quintal", "Terraço", "Quarto 1", etc.
    - Each user can only see and manage their own custom rooms
*/

-- Create custom_rooms table
CREATE TABLE IF NOT EXISTS custom_rooms (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  name text NOT NULL,
  icon text NOT NULL DEFAULT 'Home',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE custom_rooms ENABLE ROW LEVEL SECURITY;

-- Policies for custom_rooms
CREATE POLICY "Users can view own custom rooms"
  ON custom_rooms FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own custom rooms"
  ON custom_rooms FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own custom rooms"
  ON custom_rooms FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own custom rooms"
  ON custom_rooms FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);
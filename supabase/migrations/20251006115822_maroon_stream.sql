/*
  # Add custom rooms functionality

  1. Changes
    - Remove room constraint to allow custom room names
    - Keep existing room values working
    - Allow users to create custom rooms like "Garagem", "Quintal", "Terraço", etc.

  2. Security
    - Maintain existing RLS policies
    - No changes to security model
*/

-- Remove the existing room constraint to allow custom room names
ALTER TABLE tasks DROP CONSTRAINT IF EXISTS tasks_room_check;

-- The room column will now accept any text value, allowing custom rooms
-- while still supporting the original rooms (sala, cozinha, quarto, banheiro)
-- Add Paddle billing fields to users table
ALTER TABLE users ADD COLUMN IF NOT EXISTS first_name TEXT;
ALTER TABLE users ADD COLUMN IF NOT EXISTS last_name TEXT;
ALTER TABLE users ADD COLUMN IF NOT EXISTS paddle_customer_id TEXT;
ALTER TABLE users ADD COLUMN IF NOT EXISTS paddle_transaction_id TEXT;
ALTER TABLE users ADD COLUMN IF NOT EXISTS has_lifetime_access BOOLEAN DEFAULT FALSE;

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS idx_users_paddle_customer_id ON users(paddle_customer_id);
CREATE INDEX IF NOT EXISTS idx_users_has_lifetime_access ON users(has_lifetime_access);

-- Add Lemon Squeezy fields to users table
ALTER TABLE public.users 
ADD COLUMN IF NOT EXISTS lemon_squeezy_customer_id TEXT,
ADD COLUMN IF NOT EXISTS lemon_squeezy_order_id TEXT;

-- Create indexes for Lemon Squeezy fields
CREATE INDEX IF NOT EXISTS idx_users_ls_customer_id ON public.users(lemon_squeezy_customer_id);
CREATE INDEX IF NOT EXISTS idx_users_ls_order_id ON public.users(lemon_squeezy_order_id);

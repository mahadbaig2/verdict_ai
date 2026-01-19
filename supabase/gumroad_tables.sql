-- Purchases table to log all Gumroad events
CREATE TABLE IF NOT EXISTS public.purchases (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  gumroad_sale_id TEXT UNIQUE,
  email TEXT NOT NULL,
  product_id TEXT,
  product_name TEXT,
  price NUMERIC,
  currency TEXT,
  refunded BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Entitlements table: The source of truth for user access
CREATE TABLE IF NOT EXISTS public.entitlements (
  email TEXT PRIMARY KEY,
  access BOOLEAN DEFAULT true,
  granted_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add RLS to new tables
ALTER TABLE public.purchases ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.entitlements ENABLE ROW LEVEL SECURITY;

-- Allow service role to manage these tables
CREATE POLICY "Service can manage purchases" ON public.purchases FOR ALL USING (true);
CREATE POLICY "Service can manage entitlements" ON public.entitlements FOR ALL USING (true);

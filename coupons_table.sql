-- Create coupons table
CREATE TABLE IF NOT EXISTS public.coupons (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  code TEXT UNIQUE NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('percentage', 'fixed')),
  value NUMERIC NOT NULL,
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert sample coupons
INSERT INTO public.coupons (code, type, value, active)
VALUES 
  ('WELCOME10', 'percentage', 10, true),
  ('SAVE20', 'fixed', 20, true)
ON CONFLICT (code) DO NOTHING;

-- Enable Row Level Security
ALTER TABLE public.coupons ENABLE ROW LEVEL SECURITY;

-- Allow anonymous read access for coupon validation
CREATE POLICY "Allow public read access to active coupons"
  ON public.coupons
  FOR SELECT
  USING (active = true);

-- Create sales table
CREATE TABLE IF NOT EXISTS public.sales (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  cliente TEXT NOT NULL,
  monto DECIMAL(10, 2) NOT NULL,
  metodo_pago TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE public.sales ENABLE ROW LEVEL SECURITY;

-- Policy: Users can view their own sales
CREATE POLICY "Users can view own sales"
  ON public.sales
  FOR SELECT
  USING (auth.uid() = user_id);

-- Policy: Users can create their own sales
CREATE POLICY "Users can create own sales"
  ON public.sales
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Create index for better query performance
CREATE INDEX idx_sales_user_id ON public.sales(user_id);
CREATE INDEX idx_sales_created_at ON public.sales(created_at DESC);
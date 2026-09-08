-- Ensure profiles table exists with proper columns
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID REFERENCES auth.users(id) PRIMARY KEY,
    name TEXT,
    role TEXT DEFAULT 'member',
    phone TEXT,
    birthDate DATE,
    address TEXT,
    occupation TEXT,
    saldo_ahorrado NUMERIC DEFAULT 0,
    deuda_total NUMERIC DEFAULT 0
);

-- Tarea 1: Asegurar tabla de metas
CREATE TABLE IF NOT EXISTS public.goals (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) NOT NULL,
    name TEXT NOT NULL,
    target_amount NUMERIC NOT NULL DEFAULT 0,
    current_amount NUMERIC NOT NULL DEFAULT 0,
    target_date DATE NOT NULL,
    category TEXT DEFAULT 'general',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- Enable RLS for goals
ALTER TABLE public.goals ENABLE ROW LEVEL SECURITY;

-- Drop and re-create policies for safety
DROP POLICY IF EXISTS "Users can view their own goals" ON public.goals;
DROP POLICY IF EXISTS "Users can insert their own goals" ON public.goals;
DROP POLICY IF EXISTS "Users can update their own goals" ON public.goals;
DROP POLICY IF EXISTS "Users can delete their own goals" ON public.goals;

CREATE POLICY "Users can view their own goals" ON public.goals FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own goals" ON public.goals FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own goals" ON public.goals FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own goals" ON public.goals FOR DELETE USING (auth.uid() = user_id);

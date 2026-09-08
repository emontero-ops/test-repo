-- Tarea 1: Creación de la tabla goals en Supabase
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

-- Habilitar RLS
ALTER TABLE public.goals ENABLE ROW LEVEL SECURITY;

-- Políticas de RLS
CREATE POLICY "Users can view their own goals" ON public.goals
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own goals" ON public.goals
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own goals" ON public.goals
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own goals" ON public.goals
    FOR DELETE USING (auth.uid() = user_id);

-- ==============================================================================
-- SpamChain AI: Database Schema & Row Level Security (RLS)
-- Target: PostgreSQL / Supabase
-- ==============================================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Profiles table linked to Supabase auth.users
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Scans table
CREATE TABLE IF NOT EXISTS public.scans (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
    raw_message TEXT NOT NULL,
    risk_level TEXT CHECK (risk_level IN ('Safe', 'Suspicious', 'Spam', 'Scam')) NOT NULL,
    risk_score INTEGER CHECK (risk_score >= 0 AND risk_score <= 100) NOT NULL,
    category TEXT NOT NULL,
    explanation TEXT NOT NULL,
    warning_signs TEXT[] NOT NULL,
    recommendations TEXT[] NOT NULL,
    spam_chain JSONB NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Indices for performance
CREATE INDEX IF NOT EXISTS idx_scans_user_id ON public.scans(user_id);
CREATE INDEX IF NOT EXISTS idx_scans_risk_level ON public.scans(risk_level);
CREATE INDEX IF NOT EXISTS idx_scans_created_at ON public.scans(created_at DESC);

-- Enable RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.scans ENABLE ROW LEVEL SECURITY;

-- Profiles Policies
DROP POLICY IF EXISTS "Users can view their own profile" ON public.profiles;
CREATE POLICY "Users can view their own profile" ON public.profiles
    FOR SELECT USING (auth.uid() = id);

DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;
CREATE POLICY "Users can update their own profile" ON public.profiles
    FOR UPDATE USING (auth.uid() = id);

DROP POLICY IF EXISTS "Users can insert their own profile" ON public.profiles;
CREATE POLICY "Users can insert their own profile" ON public.profiles
    FOR INSERT WITH CHECK (auth.uid() = id);

-- Scans Policies
DROP POLICY IF EXISTS "Users can view their own scans" ON public.scans;
CREATE POLICY "Users can view their own scans" ON public.scans
    FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert their own scans" ON public.scans;
CREATE POLICY "Users can insert their own scans" ON public.scans
    FOR INSERT WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete their own scans" ON public.scans;
CREATE POLICY "Users can delete their own scans" ON public.scans
    FOR DELETE USING (auth.uid() = user_id);

-- Public Feed Policy (allows reading community reports where risk is High/Scam or Spam)
DROP POLICY IF EXISTS "Public can view high-risk community scans" ON public.scans;
CREATE POLICY "Public can view high-risk community scans" ON public.scans
    FOR SELECT USING (risk_level IN ('Scam', 'Spam'));

-- Trigger to automatically create a profile in public.profiles when a new user signs up via Supabase Auth
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email)
  VALUES (new.id, new.email)
  ON CONFLICT (id) DO UPDATE SET email = EXCLUDED.email;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT OR UPDATE ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();



-- Create education table
CREATE TABLE public.education (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  degree TEXT NOT NULL,
  institution TEXT NOT NULL,
  location TEXT NOT NULL,
  period TEXT NOT NULL,
  description TEXT NOT NULL,
  achievements TEXT[] DEFAULT '{}',
  order_index INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create certifications table
CREATE TABLE public.certifications (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  name TEXT NOT NULL,
  year TEXT NOT NULL,
  order_index INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Add missing columns to profiles table
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS years_of_experience INTEGER DEFAULT 0;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS hero_title TEXT DEFAULT 'Full-Stack Developer';
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS hero_description TEXT DEFAULT 'Crafting digital experiences with modern technologies and clean, efficient code';
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS github_url TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS linkedin_url TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS twitter_url TEXT;

-- Enable RLS for education table
ALTER TABLE public.education ENABLE ROW LEVEL SECURITY;

-- Create policies for education table
CREATE POLICY "Education is viewable by everyone" 
  ON public.education 
  FOR SELECT 
  USING (true);

CREATE POLICY "Users can manage their own education" 
  ON public.education 
  FOR ALL 
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Enable RLS for certifications table
ALTER TABLE public.certifications ENABLE ROW LEVEL SECURITY;

-- Create policies for certifications table
CREATE POLICY "Certifications are viewable by everyone" 
  ON public.certifications 
  FOR SELECT 
  USING (true);

CREATE POLICY "Users can manage their own certifications" 
  ON public.certifications 
  FOR ALL 
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Add triggers for updated_at columns
CREATE TRIGGER handle_updated_at_education BEFORE UPDATE ON public.education 
  FOR EACH ROW EXECUTE PROCEDURE public.update_updated_at_column();

CREATE TRIGGER handle_updated_at_certifications BEFORE UPDATE ON public.certifications 
  FOR EACH ROW EXECUTE PROCEDURE public.update_updated_at_column();

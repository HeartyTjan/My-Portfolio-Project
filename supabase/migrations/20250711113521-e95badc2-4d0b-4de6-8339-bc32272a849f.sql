
-- Create skills table for dynamic skills management
CREATE TABLE public.skills (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  category TEXT NOT NULL CHECK (category IN ('frontend', 'backend', 'tools')),
  order_index INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS on skills table
ALTER TABLE public.skills ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for skills
CREATE POLICY "Skills are viewable by everyone" 
  ON public.skills 
  FOR SELECT 
  USING (true);

CREATE POLICY "Users can manage their own skills" 
  ON public.skills 
  FOR ALL 
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Add video_url column to projects table
ALTER TABLE public.projects 
ADD COLUMN video_url TEXT;

-- Create trigger to update updated_at on skills table
CREATE TRIGGER update_skills_updated_at
  BEFORE UPDATE ON public.skills
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

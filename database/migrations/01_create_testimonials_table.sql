-- Create testimonials table
CREATE TABLE IF NOT EXISTS public.testimonials (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  company TEXT NOT NULL,
  quote TEXT NOT NULL,
  image_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- Add RLS policies
ALTER TABLE public.testimonials ENABLE ROW LEVEL SECURITY;

-- Allow users to select their own testimonials
CREATE POLICY "Users can view their own testimonials" 
  ON public.testimonials 
  FOR SELECT 
  USING (auth.uid() = user_id);

-- Allow users to insert their own testimonials
CREATE POLICY "Users can insert their own testimonials" 
  ON public.testimonials 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

-- Allow users to update their own testimonials
CREATE POLICY "Users can update their own testimonials" 
  ON public.testimonials 
  FOR UPDATE 
  USING (auth.uid() = user_id);

-- Allow users to delete their own testimonials
CREATE POLICY "Users can delete their own testimonials" 
  ON public.testimonials 
  FOR DELETE 
  USING (auth.uid() = user_id);

-- Allow public access to testimonials for public profiles
CREATE POLICY "Public can view testimonials" 
  ON public.testimonials 
  FOR SELECT 
  TO anon 
  USING (true);

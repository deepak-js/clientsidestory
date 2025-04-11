-- Create link_categories table
CREATE TABLE IF NOT EXISTS public.link_categories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  icon TEXT,
  display_order INTEGER DEFAULT 0,
  is_visible BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- Create links table
CREATE TABLE IF NOT EXISTS public.links (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  category_id UUID REFERENCES public.link_categories(id) ON DELETE SET NULL,
  title TEXT NOT NULL,
  url TEXT NOT NULL,
  description TEXT,
  icon TEXT,
  display_order INTEGER DEFAULT 0,
  is_highlighted BOOLEAN DEFAULT false,
  is_visible BOOLEAN DEFAULT true,
  start_date TIMESTAMP WITH TIME ZONE,
  end_date TIMESTAMP WITH TIME ZONE,
  click_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- Create link_clicks table for analytics
CREATE TABLE IF NOT EXISTS public.link_clicks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  link_id UUID NOT NULL REFERENCES public.links(id) ON DELETE CASCADE,
  referrer TEXT,
  user_agent TEXT,
  ip_address TEXT,
  country TEXT,
  city TEXT,
  clicked_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- Add RLS policies for link_categories
ALTER TABLE public.link_categories ENABLE ROW LEVEL SECURITY;

-- Allow users to select their own link categories
CREATE POLICY "Users can view their own link categories" 
  ON public.link_categories 
  FOR SELECT 
  USING (auth.uid() = user_id);

-- Allow users to insert their own link categories
CREATE POLICY "Users can insert their own link categories" 
  ON public.link_categories 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

-- Allow users to update their own link categories
CREATE POLICY "Users can update their own link categories" 
  ON public.link_categories 
  FOR UPDATE 
  USING (auth.uid() = user_id);

-- Allow users to delete their own link categories
CREATE POLICY "Users can delete their own link categories" 
  ON public.link_categories 
  FOR DELETE 
  USING (auth.uid() = user_id);

-- Add RLS policies for links
ALTER TABLE public.links ENABLE ROW LEVEL SECURITY;

-- Allow users to select their own links
CREATE POLICY "Users can view their own links" 
  ON public.links 
  FOR SELECT 
  USING (auth.uid() = user_id);

-- Allow users to insert their own links
CREATE POLICY "Users can insert their own links" 
  ON public.links 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

-- Allow users to update their own links
CREATE POLICY "Users can update their own links" 
  ON public.links 
  FOR UPDATE 
  USING (auth.uid() = user_id);

-- Allow users to delete their own links
CREATE POLICY "Users can delete their own links" 
  ON public.links 
  FOR DELETE 
  USING (auth.uid() = user_id);

-- Allow public access to links for public profiles
CREATE POLICY "Public can view visible links" 
  ON public.links 
  FOR SELECT 
  TO anon 
  USING (
    is_visible = true AND
    (start_date IS NULL OR start_date <= now()) AND
    (end_date IS NULL OR end_date >= now())
  );

-- Add RLS policies for link_clicks
ALTER TABLE public.link_clicks ENABLE ROW LEVEL SECURITY;

-- Allow users to select clicks for their own links
CREATE POLICY "Users can view clicks for their own links" 
  ON public.link_clicks 
  FOR SELECT 
  USING (
    link_id IN (
      SELECT id FROM public.links WHERE user_id = auth.uid()
    )
  );

-- Allow anyone to insert link clicks
CREATE POLICY "Anyone can insert link clicks" 
  ON public.link_clicks 
  FOR INSERT 
  WITH CHECK (true);

-- Create a function to increment click count
CREATE OR REPLACE FUNCTION increment_link_click()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE public.links
  SET click_count = click_count + 1
  WHERE id = NEW.link_id;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create a trigger to call the function on new click
CREATE TRIGGER on_link_click
AFTER INSERT ON public.link_clicks
FOR EACH ROW
EXECUTE FUNCTION increment_link_click();

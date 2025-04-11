-- Add verification and customization fields to users table
ALTER TABLE public.users 
ADD COLUMN IF NOT EXISTS is_verified BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS verification_date TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS accent_color TEXT DEFAULT '#6366f1',
ADD COLUMN IF NOT EXISTS profile_views INTEGER DEFAULT 0;

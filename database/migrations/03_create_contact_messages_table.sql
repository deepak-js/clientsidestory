-- Create contact_messages table
CREATE TABLE IF NOT EXISTS public.contact_messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  recipient_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  sender_name TEXT NOT NULL,
  sender_email TEXT NOT NULL,
  subject TEXT,
  message TEXT NOT NULL,
  read BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- Add RLS policies
ALTER TABLE public.contact_messages ENABLE ROW LEVEL SECURITY;

-- Allow users to view their own contact messages
CREATE POLICY "Users can view their own contact messages" 
  ON public.contact_messages 
  FOR SELECT 
  USING (auth.uid() = recipient_id);

-- Allow users to update their own contact messages (e.g., mark as read)
CREATE POLICY "Users can update their own contact messages" 
  ON public.contact_messages 
  FOR UPDATE 
  USING (auth.uid() = recipient_id);

-- Allow users to delete their own contact messages
CREATE POLICY "Users can delete their own contact messages" 
  ON public.contact_messages 
  FOR DELETE 
  USING (auth.uid() = recipient_id);

-- Allow anyone to insert contact messages
CREATE POLICY "Anyone can insert contact messages" 
  ON public.contact_messages 
  FOR INSERT 
  WITH CHECK (true);

-- Create a function to notify users of new messages
CREATE OR REPLACE FUNCTION notify_new_message()
RETURNS TRIGGER AS $$
BEGIN
  -- Insert a notification record (if you have a notifications table)
  -- This is just a placeholder - you would need to create a notifications table
  -- INSERT INTO public.notifications (user_id, type, message, read)
  -- VALUES (NEW.recipient_id, 'new_message', 'You have a new message from ' || NEW.sender_name, false);
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create a trigger to call the function on new message
CREATE TRIGGER on_new_message
AFTER INSERT ON public.contact_messages
FOR EACH ROW
EXECUTE FUNCTION notify_new_message();

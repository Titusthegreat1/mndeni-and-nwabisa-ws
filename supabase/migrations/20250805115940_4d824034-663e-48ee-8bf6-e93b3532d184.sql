-- Create table to track RSVP submissions
CREATE TABLE public.rsvp_submissions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  full_name TEXT NOT NULL,
  surname TEXT NOT NULL,
  attendance TEXT NOT NULL CHECK (attendance IN ('yes', 'no')),
  guest_count TEXT,
  guest_names TEXT,
  song_request TEXT,
  email_sent BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.rsvp_submissions ENABLE ROW LEVEL SECURITY;

-- Create policy for viewing RSVPs (you can adjust this based on your needs)
CREATE POLICY "RSVPs are viewable by everyone" 
ON public.rsvp_submissions 
FOR SELECT 
USING (true);

-- Create policy for inserting RSVPs
CREATE POLICY "Anyone can submit RSVPs" 
ON public.rsvp_submissions 
FOR INSERT 
WITH CHECK (true);

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_rsvp_submissions_updated_at
BEFORE UPDATE ON public.rsvp_submissions
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();
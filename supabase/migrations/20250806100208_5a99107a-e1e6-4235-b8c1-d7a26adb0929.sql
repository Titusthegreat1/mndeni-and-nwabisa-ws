-- Create blessings table for the Wall of Blessings feature
CREATE TABLE public.blessings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT,
  message TEXT NOT NULL,
  likes INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.blessings ENABLE ROW LEVEL SECURITY;

-- Create policies for public access
CREATE POLICY "Blessings are viewable by everyone" 
ON public.blessings 
FOR SELECT 
USING (true);

CREATE POLICY "Anyone can create blessings" 
ON public.blessings 
FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Anyone can update blessings likes" 
ON public.blessings 
FOR UPDATE 
USING (true);

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_blessings_updated_at
BEFORE UPDATE ON public.blessings
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Create index for better performance on recent messages
CREATE INDEX idx_blessings_created_at ON public.blessings(created_at DESC);
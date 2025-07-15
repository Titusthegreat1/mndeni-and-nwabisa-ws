-- Create registry_items table to store all registry item data
CREATE TABLE public.registry_items (
  id INTEGER PRIMARY KEY,
  name TEXT NOT NULL,
  brand TEXT NOT NULL,
  price TEXT NOT NULL,
  size TEXT,
  color TEXT,
  image_url TEXT,
  website_url TEXT,
  total_quantity INTEGER NOT NULL DEFAULT 1,
  purchased_quantity INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create registry_purchases table to track purchase confirmations
CREATE TABLE public.registry_purchases (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  item_id INTEGER NOT NULL,
  item_name TEXT NOT NULL,
  item_brand TEXT NOT NULL,
  item_price TEXT NOT NULL,
  item_size TEXT,
  item_color TEXT,
  buyer_name TEXT NOT NULL,
  buyer_surname TEXT NOT NULL,
  buyer_email TEXT,
  purchase_confirmed BOOLEAN NOT NULL DEFAULT false,
  redirect_url TEXT,
  confirmation_token TEXT UNIQUE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.registry_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.registry_purchases ENABLE ROW LEVEL SECURITY;

-- Create policies for public read access to registry items
CREATE POLICY "Registry items are viewable by everyone" 
ON public.registry_items 
FOR SELECT 
USING (true);

-- Create policies for registry purchases (public insert, no read for privacy)
CREATE POLICY "Anyone can create purchase requests" 
ON public.registry_purchases 
FOR INSERT 
WITH CHECK (true);

-- Create indexes for better performance
CREATE INDEX idx_registry_purchases_confirmation_token ON public.registry_purchases(confirmation_token);
CREATE INDEX idx_registry_purchases_item_id ON public.registry_purchases(item_id);

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for automatic timestamp updates
CREATE TRIGGER update_registry_items_updated_at
  BEFORE UPDATE ON public.registry_items
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_registry_purchases_updated_at
  BEFORE UPDATE ON public.registry_purchases
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();
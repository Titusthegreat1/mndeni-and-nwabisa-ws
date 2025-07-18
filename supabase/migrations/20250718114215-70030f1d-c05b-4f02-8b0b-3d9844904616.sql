-- Update registry_items table to track purchased quantities in real-time
ALTER TABLE public.registry_items 
ADD COLUMN IF NOT EXISTS item_name_unique text UNIQUE;

-- Create an index for faster lookups
CREATE INDEX IF NOT EXISTS idx_registry_items_name_unique ON public.registry_items(item_name_unique);

-- Create function to update registry items purchased quantity
CREATE OR REPLACE FUNCTION public.update_registry_item_quantity(
  item_name text,
  item_brand text,
  increment_amount integer DEFAULT 1
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Update or insert the registry item with new purchased quantity
  INSERT INTO public.registry_items (
    item_name_unique,
    name,
    brand,
    purchased_quantity,
    total_quantity,
    price,
    created_at,
    updated_at
  ) VALUES (
    item_name || '_' || item_brand,
    item_name,
    item_brand,
    increment_amount,
    COALESCE((
      SELECT total_quantity 
      FROM public.registry_items 
      WHERE item_name_unique = item_name || '_' || item_brand
    ), 1),
    '',
    now(),
    now()
  )
  ON CONFLICT (item_name_unique)
  DO UPDATE SET
    purchased_quantity = registry_items.purchased_quantity + increment_amount,
    updated_at = now();
END;
$$;

-- Enable realtime for registry_items table
ALTER TABLE public.registry_items REPLICA IDENTITY FULL;

-- Add table to realtime publication
DO $$
BEGIN
  -- Add the table to the supabase_realtime publication if not already added
  IF NOT EXISTS (
    SELECT 1 FROM pg_publication_tables 
    WHERE pubname = 'supabase_realtime' 
    AND tablename = 'registry_items'
  ) THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.registry_items;
  END IF;
END $$;
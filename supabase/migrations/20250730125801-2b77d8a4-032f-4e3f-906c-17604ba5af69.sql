-- Enable real-time replication for registry_items table
ALTER TABLE public.registry_items REPLICA IDENTITY FULL;

-- Create function to automatically increment purchased_quantity when a purchase is created
CREATE OR REPLACE FUNCTION public.auto_increment_purchased_quantity()
RETURNS TRIGGER AS $$
BEGIN
  -- Increment the purchased quantity for the corresponding registry item
  UPDATE public.registry_items 
  SET purchased_quantity = purchased_quantity + 1,
      updated_at = now()
  WHERE item_name_unique = NEW.item_name || '_' || NEW.item_brand;
  
  -- If the item doesn't exist in registry_items, create it
  IF NOT FOUND THEN
    INSERT INTO public.registry_items (
      item_name_unique,
      name,
      brand,
      purchased_quantity,
      total_quantity,
      price,
      size,
      color,
      created_at,
      updated_at
    ) VALUES (
      NEW.item_name || '_' || NEW.item_brand,
      NEW.item_name,
      NEW.item_brand,
      1,
      1,
      NEW.item_price,
      NEW.item_size,
      NEW.item_color,
      now(),
      now()
    );
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger to automatically update purchased_quantity when a purchase is created
CREATE TRIGGER trigger_auto_increment_purchased_quantity
  AFTER INSERT ON public.registry_purchases
  FOR EACH ROW
  EXECUTE FUNCTION public.auto_increment_purchased_quantity();

-- Create function to clean up unconfirmed purchases older than 24 hours
CREATE OR REPLACE FUNCTION public.cleanup_unconfirmed_purchases()
RETURNS void AS $$
DECLARE
  cleanup_record RECORD;
BEGIN
  -- Find unconfirmed purchases older than 24 hours
  FOR cleanup_record IN
    SELECT item_name, item_brand
    FROM public.registry_purchases
    WHERE purchase_confirmed = false 
    AND created_at < NOW() - INTERVAL '24 hours'
  LOOP
    -- Decrement the purchased quantity
    UPDATE public.registry_items 
    SET purchased_quantity = GREATEST(purchased_quantity - 1, 0),
        updated_at = now()
    WHERE item_name_unique = cleanup_record.item_name || '_' || cleanup_record.item_brand;
  END LOOP;
  
  -- Delete the unconfirmed purchases
  DELETE FROM public.registry_purchases
  WHERE purchase_confirmed = false 
  AND created_at < NOW() - INTERVAL '24 hours';
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
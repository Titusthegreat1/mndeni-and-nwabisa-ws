-- Fix function search path security issues by setting search_path explicitly

-- Update auto_increment_purchased_quantity function with secure search_path
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
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Update cleanup_unconfirmed_purchases function with secure search_path
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
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Update existing update_registry_item_quantity function with secure search_path
CREATE OR REPLACE FUNCTION public.update_registry_item_quantity(item_name text, item_brand text, increment_amount integer DEFAULT 1)
RETURNS void AS $$
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
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;
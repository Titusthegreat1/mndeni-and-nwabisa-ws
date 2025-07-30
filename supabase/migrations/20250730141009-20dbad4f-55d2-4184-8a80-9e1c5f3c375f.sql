-- Reset all registry items to be available again
UPDATE registry_items 
SET purchased_quantity = 0, updated_at = now() 
WHERE purchased_quantity > 0;
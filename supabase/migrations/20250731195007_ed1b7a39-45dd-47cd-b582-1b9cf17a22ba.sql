-- Update Milano Stainless Steel Cutlery Set to fix brand mismatch with frontend definition
-- This ensures the quantity matching logic works correctly

UPDATE registry_items 
SET 
  brand = 'WOOLWORTHS',
  item_name_unique = 'Milano Stainless Steel Cutlery Set 16 Piece_WOOLWORTHS',
  updated_at = now()
WHERE 
  name = 'Milano Stainless Steel Cutlery Set 16 Piece' 
  AND brand = 'MILANO';
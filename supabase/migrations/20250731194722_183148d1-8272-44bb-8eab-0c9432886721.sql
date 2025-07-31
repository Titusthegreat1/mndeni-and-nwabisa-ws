-- Update Aurora items to fix brand mismatch with frontend definitions
-- This ensures the quantity matching logic works correctly

-- Update Aurora Round Porcelain Casserole With Lid 30cm
UPDATE registry_items 
SET 
  brand = '@home',
  item_name_unique = 'Aurora Round Porcelain Casserole With Lid 30cm_@home',
  updated_at = now()
WHERE 
  name = 'Aurora Round Porcelain Casserole With Lid 30cm' 
  AND brand = 'AURORA';

-- Update Aurora Rectangle Porcelain Casserole With Lid 32cm  
UPDATE registry_items
SET 
  brand = '@home',
  item_name_unique = 'Aurora Rectangle Porcelain Casserole With Lid 32cm_@home',
  updated_at = now()
WHERE 
  name = 'Aurora Rectangle Porcelain Casserole With Lid 32cm'
  AND brand = 'AURORA';
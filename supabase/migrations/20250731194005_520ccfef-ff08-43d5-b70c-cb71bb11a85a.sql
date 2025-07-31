-- Make specific items unavailable by setting purchased_quantity = total_quantity
UPDATE registry_items 
SET purchased_quantity = total_quantity, updated_at = now() 
WHERE name IN (
  'Cuisine::pro Sabre Knife Block 9Pc',
  'Milano Stainless Steel Cutlery Set 16 Piece', 
  'Aurora Rectangle Porcelain Casserole With Lid 32cm'
);

-- Remove 1 quantity from Aurora Round Porcelain Casserole (increment purchased_quantity by 1)
UPDATE registry_items 
SET purchased_quantity = purchased_quantity + 1, updated_at = now() 
WHERE name = 'Aurora Round Porcelain Casserole With Lid 30cm';
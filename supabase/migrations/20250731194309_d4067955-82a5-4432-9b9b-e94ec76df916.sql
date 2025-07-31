-- Insert the missing items into the database and mark them as unavailable
INSERT INTO registry_items (
  item_name_unique,
  name, 
  brand,
  price,
  size,
  color,
  purchased_quantity,
  total_quantity,
  created_at,
  updated_at
) VALUES 
(
  'Milano Stainless Steel Cutlery Set 16 Piece_MILANO',
  'Milano Stainless Steel Cutlery Set 16 Piece',
  'MILANO', 
  'R699.00',
  '16 Piece',
  null,
  1,
  1,
  now(),
  now()
),
(
  'Aurora Rectangle Porcelain Casserole With Lid 32cm_AURORA',
  'Aurora Rectangle Porcelain Casserole With Lid 32cm',
  'AURORA',
  'R549.00', 
  '32cm',
  null,
  1,
  1,
  now(),
  now()
),
(
  'Aurora Round Porcelain Casserole With Lid 30cm_AURORA',
  'Aurora Round Porcelain Casserole With Lid 30cm',
  'AURORA',
  'R479.00',
  '30cm', 
  null,
  1,
  2,
  now(),
  now()
);
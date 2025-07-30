-- Fix the registry_items table id column to be auto-incrementing
-- This will resolve the "null value in column id" error

-- First, create a sequence for the id column
CREATE SEQUENCE IF NOT EXISTS registry_items_id_seq;

-- Set the id column to use the sequence as default
ALTER TABLE public.registry_items 
ALTER COLUMN id SET DEFAULT nextval('registry_items_id_seq');

-- Set the sequence to be owned by the id column
ALTER SEQUENCE registry_items_id_seq OWNED BY public.registry_items.id;

-- Set the sequence to start from the next available value
-- In case there are existing records, we need to set the sequence correctly
SELECT setval('registry_items_id_seq', COALESCE((SELECT MAX(id) FROM public.registry_items), 0) + 1, false);
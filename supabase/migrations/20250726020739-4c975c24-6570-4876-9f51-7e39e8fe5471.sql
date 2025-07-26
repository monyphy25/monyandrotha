-- Replace category column with brand column
ALTER TABLE public.products DROP COLUMN category;
ALTER TABLE public.products ADD COLUMN brand TEXT NOT NULL DEFAULT 'The Ordinary';

-- Update sample data with brands
UPDATE public.products SET brand = 'The Ordinary' WHERE name = 'Vitamin C Serum';
UPDATE public.products SET brand = 'CeraVe' WHERE name = 'Hyaluronic Acid Moisturizer';
UPDATE public.products SET brand = 'La Roche-Posay' WHERE name = 'Retinol Night Cream';
UPDATE public.products SET brand = 'Neutrogena' WHERE name = 'Gentle Foaming Cleanser';
UPDATE public.products SET brand = 'The Ordinary' WHERE name = 'Niacinamide Toner';
UPDATE public.products SET brand = 'La Roche-Posay' WHERE name = 'SPF 50 Sunscreen';
UPDATE public.products SET brand = 'Paula\'s Choice' WHERE name = 'Eye Cream with Peptides';
UPDATE public.products SET brand = 'The Ordinary' WHERE name = 'AHA/BHA Exfoliant';
UPDATE public.products SET brand = 'Drunk Elephant' WHERE name = 'Ceramide Face Mask';
UPDATE public.products SET brand = 'Garnier' WHERE name = 'Micellar Water';
UPDATE public.products SET brand = 'Skinceuticals' WHERE name = 'Collagen Boosting Serum';
UPDATE public.products SET brand = 'Neutrogena' WHERE name = 'Oil-Free Moisturizer';
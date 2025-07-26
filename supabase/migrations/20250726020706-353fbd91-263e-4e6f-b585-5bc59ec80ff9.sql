-- Create products table for skincare products
CREATE TABLE public.products (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  description TEXT,
  price DECIMAL(10,2) NOT NULL CHECK (price >= 0),
  category TEXT NOT NULL DEFAULT 'Skincare',
  status TEXT NOT NULL DEFAULT 'Active' CHECK (status IN ('Active', 'Inactive')),
  stock INTEGER NOT NULL DEFAULT 0 CHECK (stock >= 0),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;

-- Create policies for public access (since this is a product catalog)
CREATE POLICY "Anyone can view products" 
ON public.products 
FOR SELECT 
USING (true);

CREATE POLICY "Anyone can insert products" 
ON public.products 
FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Anyone can update products" 
ON public.products 
FOR UPDATE 
USING (true);

CREATE POLICY "Anyone can delete products" 
ON public.products 
FOR DELETE 
USING (true);

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_products_updated_at
BEFORE UPDATE ON public.products
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Insert sample skincare products
INSERT INTO public.products (name, description, price, category, status, stock) VALUES
('Vitamin C Serum', 'Brightening vitamin C serum with antioxidants for glowing skin', 29.99, 'Skincare', 'Active', 45),
('Hyaluronic Acid Moisturizer', 'Intense hydration moisturizer with hyaluronic acid', 34.99, 'Skincare', 'Active', 32),
('Retinol Night Cream', 'Anti-aging night cream with retinol for smooth skin', 49.99, 'Skincare', 'Active', 28),
('Gentle Foaming Cleanser', 'Mild foaming cleanser for daily skincare routine', 19.99, 'Skincare', 'Active', 55),
('Niacinamide Toner', 'Pore-minimizing toner with niacinamide and zinc', 24.99, 'Skincare', 'Active', 41),
('SPF 50 Sunscreen', 'Broad spectrum sunscreen with SPF 50 protection', 27.99, 'Skincare', 'Active', 38),
('Eye Cream with Peptides', 'Anti-aging eye cream with peptides and caffeine', 39.99, 'Skincare', 'Active', 22),
('AHA/BHA Exfoliant', 'Chemical exfoliant with alpha and beta hydroxy acids', 31.99, 'Skincare', 'Active', 15),
('Ceramide Face Mask', 'Hydrating face mask with ceramides and peptides', 16.99, 'Skincare', 'Active', 67),
('Micellar Water', 'Gentle makeup remover and cleanser in one', 14.99, 'Skincare', 'Active', 73),
('Collagen Boosting Serum', 'Anti-aging serum to boost collagen production', 44.99, 'Skincare', 'Active', 19),
('Oil-Free Moisturizer', 'Lightweight moisturizer for oily and combination skin', 22.99, 'Skincare', 'Active', 36);

-- Enable realtime for the products table
ALTER TABLE public.products REPLICA IDENTITY FULL;
ALTER PUBLICATION supabase_realtime ADD TABLE public.products;
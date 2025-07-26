import { Product, ProductCategory } from '@/types/product';

export const PRODUCT_CATEGORIES: ProductCategory[] = ['Skincare'];

export const SAMPLE_PRODUCTS: Product[] = [
  {
    id: '1',
    name: 'Vitamin C Serum',
    description: 'Brightening vitamin C serum with antioxidants for glowing skin',
    price: 29.99,
    category: 'Skincare',
    status: 'Active',
    stock: 45,
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-01-15')
  },
  {
    id: '2',
    name: 'Hyaluronic Acid Moisturizer',
    description: 'Intense hydration moisturizer with hyaluronic acid',
    price: 34.99,
    category: 'Skincare',
    status: 'Active',
    stock: 32,
    createdAt: new Date('2024-01-10'),
    updatedAt: new Date('2024-01-10')
  },
  {
    id: '3',
    name: 'Retinol Night Cream',
    description: 'Anti-aging night cream with retinol for smooth skin',
    price: 49.99,
    category: 'Skincare',
    status: 'Active',
    stock: 28,
    createdAt: new Date('2024-01-08'),
    updatedAt: new Date('2024-01-08')
  },
  {
    id: '4',
    name: 'Gentle Foaming Cleanser',
    description: 'Mild foaming cleanser for daily skincare routine',
    price: 19.99,
    category: 'Skincare',
    status: 'Active',
    stock: 55,
    createdAt: new Date('2024-01-05'),
    updatedAt: new Date('2024-01-05')
  },
  {
    id: '5',
    name: 'Niacinamide Toner',
    description: 'Pore-minimizing toner with niacinamide and zinc',
    price: 24.99,
    category: 'Skincare',
    status: 'Active',
    stock: 41,
    createdAt: new Date('2024-01-03'),
    updatedAt: new Date('2024-01-03')
  }
];
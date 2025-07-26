export interface Product {
  id: string;
  name: string;
  description?: string;
  price: number;
  category: ProductCategory;
  status: ProductStatus;
  stock: number;
  createdAt: Date;
  updatedAt: Date;
}

export type ProductCategory = 'Skincare';

export type ProductStatus = 'Active' | 'Inactive';

export type SortField = 'name' | 'price' | 'stock' | 'createdAt';
export type SortOrder = 'asc' | 'desc';

export interface ProductFilters {
  search: string;
  categories: ProductCategory[];
  status: 'all' | ProductStatus;
  priceMin?: number;
  priceMax?: number;
  stockLevel: 'all' | 'low' | 'in-stock' | 'out-of-stock';
}

export interface ProductFormData {
  name: string;
  description: string;
  price: string;
  category: ProductCategory;
  status: ProductStatus;
  stock: string;
}

export type ViewMode = 'list' | 'grid';
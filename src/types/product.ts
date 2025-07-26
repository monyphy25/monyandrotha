export interface Product {
  id: string;
  name: string;
  description?: string;
  price: number;
  brand: string;
  status: ProductStatus;
  stock: number;
  createdAt: Date;
  updatedAt: Date;
}

export type ProductStatus = "Active" | "Inactive";

export type SortField = "name" | "price" | "stock" | "createdAt";
export type SortOrder = "asc" | "desc";

export interface ProductFilters {
  search: string;
  brands: string[];
  status: "all" | ProductStatus;
  priceMin?: number;
  priceMax?: number;
  stockLevel: "all" | "low" | "in-stock" | "out-of-stock";
}

export interface ProductFormData {
  name: string;
  description: string;
  price: string;
  brand: string;
  status: ProductStatus;
  stock: string;
}

export type ViewMode = "list" | "grid";

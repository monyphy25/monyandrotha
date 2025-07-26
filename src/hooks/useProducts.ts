import { useState, useEffect, useMemo } from 'react';
import { Product, ProductFilters, SortField, SortOrder } from '@/types/product';
import { SAMPLE_PRODUCTS } from '@/data/sampleProducts';

const STORAGE_KEY = 'product-management-products';

export const useProducts = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Load products from localStorage or use sample data
  useEffect(() => {
    const loadProducts = () => {
      try {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) {
          const parsedProducts = JSON.parse(stored).map((p: any) => ({
            ...p,
            createdAt: new Date(p.createdAt),
            updatedAt: new Date(p.updatedAt)
          }));
          setProducts(parsedProducts);
        } else {
          // Initialize with sample data
          setProducts(SAMPLE_PRODUCTS);
          localStorage.setItem(STORAGE_KEY, JSON.stringify(SAMPLE_PRODUCTS));
        }
      } catch (error) {
        console.error('Error loading products:', error);
        setProducts(SAMPLE_PRODUCTS);
      } finally {
        setIsLoading(false);
      }
    };

    loadProducts();
  }, []);

  // Save products to localStorage whenever products change
  useEffect(() => {
    if (products.length > 0) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(products));
    }
  }, [products]);

  const addProduct = (productData: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newProduct: Product = {
      ...productData,
      id: generateId(),
      createdAt: new Date(),
      updatedAt: new Date()
    };
    setProducts(prev => [newProduct, ...prev]);
    return newProduct;
  };

  const updateProduct = (id: string, updates: Partial<Omit<Product, 'id' | 'createdAt'>>) => {
    setProducts(prev => prev.map(product => 
      product.id === id 
        ? { ...product, ...updates, updatedAt: new Date() }
        : product
    ));
  };

  const deleteProduct = (id: string) => {
    setProducts(prev => prev.filter(product => product.id !== id));
  };

  const getProduct = (id: string) => {
    return products.find(product => product.id === id);
  };

  const isNameUnique = (name: string, excludeId?: string) => {
    return !products.some(product => 
      product.name.toLowerCase() === name.toLowerCase() && product.id !== excludeId
    );
  };

  return {
    products,
    isLoading,
    addProduct,
    updateProduct,
    deleteProduct,
    getProduct,
    isNameUnique
  };
};

export const useFilteredProducts = (
  products: Product[],
  filters: ProductFilters,
  sortField: SortField,
  sortOrder: SortOrder,
  searchDebounce: string
) => {
  return useMemo(() => {
    let filtered = [...products];

    // Search filter
    if (searchDebounce.trim()) {
      const searchTerm = searchDebounce.toLowerCase();
      filtered = filtered.filter(product =>
        product.name.toLowerCase().includes(searchTerm) ||
        product.description?.toLowerCase().includes(searchTerm) ||
        product.category.toLowerCase().includes(searchTerm)
      );
    }

    // Category filter
    if (filters.categories.length > 0) {
      filtered = filtered.filter(product =>
        filters.categories.includes(product.category)
      );
    }

    // Status filter
    if (filters.status !== 'all') {
      filtered = filtered.filter(product => product.status === filters.status);
    }

    // Price range filter
    if (filters.priceMin !== undefined) {
      filtered = filtered.filter(product => product.price >= filters.priceMin!);
    }
    if (filters.priceMax !== undefined) {
      filtered = filtered.filter(product => product.price <= filters.priceMax!);
    }

    // Stock level filter
    if (filters.stockLevel !== 'all') {
      switch (filters.stockLevel) {
        case 'low':
          filtered = filtered.filter(product => product.stock > 0 && product.stock < 10);
          break;
        case 'in-stock':
          filtered = filtered.filter(product => product.stock >= 10);
          break;
        case 'out-of-stock':
          filtered = filtered.filter(product => product.stock === 0);
          break;
      }
    }

    // Sorting
    filtered.sort((a, b) => {
      let aValue: any = a[sortField];
      let bValue: any = b[sortField];

      if (sortField === 'createdAt') {
        aValue = aValue.getTime();
        bValue = bValue.getTime();
      } else if (typeof aValue === 'string') {
        aValue = aValue.toLowerCase();
        bValue = bValue.toLowerCase();
      }

      if (sortOrder === 'asc') {
        return aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
      } else {
        return aValue > bValue ? -1 : aValue < bValue ? 1 : 0;
      }
    });

    return filtered;
  }, [products, filters, sortField, sortOrder, searchDebounce]);
};

const generateId = (): string => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
};
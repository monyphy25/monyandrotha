import { useState, useEffect, useMemo } from 'react';
import { Product, ProductFilters, SortField, SortOrder } from '@/types/product';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export const useProducts = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  // Load products from Supabase
  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        toast({
          title: "Error loading products",
          description: error.message,
          variant: "destructive",
        });
        return;
      }

      const formattedProducts = data.map((p: any) => ({
        id: p.id,
        name: p.name,
        description: p.description,
        price: p.price,
        category: p.category as 'Skincare',
        status: p.status as 'Active' | 'Inactive',
        stock: p.stock,
        createdAt: new Date(p.created_at),
        updatedAt: new Date(p.updated_at)
      }));

      setProducts(formattedProducts);
    } catch (error) {
      console.error('Error loading products:', error);
      toast({
        title: "Error loading products",
        description: "Failed to load products from database",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const addProduct = async (productData: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      const { data, error } = await supabase
        .from('products')
        .insert([
          {
            name: productData.name,
            description: productData.description,
            price: productData.price,
            category: productData.category,
            status: productData.status,
            stock: productData.stock
          }
        ])
        .select()
        .single();

      if (error) {
        toast({
          title: "Error adding product",
          description: error.message,
          variant: "destructive",
        });
        return null;
      }

      const newProduct: Product = {
        id: data.id,
        name: data.name,
        description: data.description,
        price: data.price,
        category: data.category as 'Skincare',
        status: data.status as 'Active' | 'Inactive',
        stock: data.stock,
        createdAt: new Date(data.created_at),
        updatedAt: new Date(data.updated_at)
      };

      setProducts(prev => [newProduct, ...prev]);
      toast({
        title: "Product added successfully",
        description: `${newProduct.name} has been added to your catalog`,
      });
      return newProduct;
    } catch (error) {
      console.error('Error adding product:', error);
      toast({
        title: "Error adding product",
        description: "Failed to add product to database",
        variant: "destructive",
      });
      return null;
    }
  };

  const updateProduct = async (id: string, updates: Partial<Omit<Product, 'id' | 'createdAt'>>) => {
    try {
      const { data, error } = await supabase
        .from('products')
        .update({
          name: updates.name,
          description: updates.description,
          price: updates.price,
          category: updates.category,
          status: updates.status,
          stock: updates.stock
        })
        .eq('id', id)
        .select()
        .single();

      if (error) {
        toast({
          title: "Error updating product",
          description: error.message,
          variant: "destructive",
        });
        return;
      }

      const updatedProduct: Product = {
        id: data.id,
        name: data.name,
        description: data.description,
        price: data.price,
        category: data.category as 'Skincare',
        status: data.status as 'Active' | 'Inactive',
        stock: data.stock,
        createdAt: new Date(data.created_at),
        updatedAt: new Date(data.updated_at)
      };

      setProducts(prev => prev.map(product => 
        product.id === id ? updatedProduct : product
      ));

      toast({
        title: "Product updated successfully",
        description: `${updatedProduct.name} has been updated`,
      });
    } catch (error) {
      console.error('Error updating product:', error);
      toast({
        title: "Error updating product",
        description: "Failed to update product in database",
        variant: "destructive",
      });
    }
  };

  const deleteProduct = async (id: string) => {
    try {
      const { error } = await supabase
        .from('products')
        .delete()
        .eq('id', id);

      if (error) {
        toast({
          title: "Error deleting product",
          description: error.message,
          variant: "destructive",
        });
        return;
      }

      setProducts(prev => prev.filter(product => product.id !== id));
      toast({
        title: "Product deleted successfully",
        description: "The product has been removed from your catalog",
      });
    } catch (error) {
      console.error('Error deleting product:', error);
      toast({
        title: "Error deleting product",
        description: "Failed to delete product from database",
        variant: "destructive",
      });
    }
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
    isNameUnique,
    loadProducts
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

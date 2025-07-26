import { useState, useMemo } from "react";
import {
  Product,
  ProductFilters,
  SortField,
  SortOrder,
  ViewMode,
} from "@/types/product";
import { useProducts, useFilteredProducts } from "@/hooks/useProducts";
import { useDebounce } from "@/hooks/useDebounce";
import { useToast } from "@/hooks/use-toast";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { ProductList } from "@/components/ProductList";
import { ProductCard } from "@/components/ProductCard";
import { FilterPanel } from "@/components/FilterPanel";
import { ProductForm } from "@/components/ProductForm";
import { ProductDetails } from "@/components/ProductDetails";
import { DeleteConfirmation } from "@/components/DeleteConfirmation";
import { Pagination } from "@/components/Pagination";

import {
  Plus,
  Search,
  Grid3X3,
  List,
  SortAsc,
  SortDesc,
  Package,
  Loader2,
} from "lucide-react";

const ITEMS_PER_PAGE_OPTIONS = [6, 12, 24, 48];

export const ProductManagement = () => {
  const { toast } = useToast();
  const {
    products,
    isLoading,
    addProduct,
    updateProduct,
    deleteProduct,
    getProduct,
    isNameUnique,
  } = useProducts();

  // State for filters and search
  const [filters, setFilters] = useState<ProductFilters>({
    search: "",
    brands: [],
    status: "all",
    priceMin: undefined,
    priceMax: undefined,
    stockLevel: "all",
  });

  const [searchInput, setSearchInput] = useState("");
  const debouncedSearch = useDebounce(searchInput, 300);

  // State for sorting
  const [sortField, setSortField] = useState<SortField>("createdAt");
  const [sortOrder, setSortOrder] = useState<SortOrder>("desc");

  // State for view mode
  const [viewMode, setViewMode] = useState<ViewMode>("grid");

  // State for pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(12);

  // State for modals
  const [productFormOpen, setProductFormOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [detailsProduct, setDetailsProduct] = useState<Product | null>(null);
  const [deletingProduct, setDeletingProduct] = useState<Product | null>(null);
  const [formLoading, setFormLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);

  // Update debounced search in filters
  const filtersWithSearch = { ...filters, search: debouncedSearch };

  // Get filtered and sorted products
  const filteredProducts = useFilteredProducts(
    products,
    filtersWithSearch,
    sortField,
    sortOrder,
    debouncedSearch
  );

  // Pagination calculations
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedProducts = filteredProducts.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  // Reset to first page when filters change
  const activeFiltersCount = useMemo(() => {
    let count = 0;
    if (filters.brands.length > 0) count++;
    if (filters.status !== "all") count++;
    if (filters.priceMin !== undefined || filters.priceMax !== undefined)
      count++;
    if (filters.stockLevel !== "all") count++;
    if (debouncedSearch.trim()) count++;
    return count;
  }, [filters, debouncedSearch]);

  // Handlers
  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortOrder("asc");
    }
  };

  const handleAddProduct = () => {
    setEditingProduct(null);
    setProductFormOpen(true);
  };

  const handleEditProduct = (product: Product) => {
    setEditingProduct(product);
    setProductFormOpen(true);
  };

  const handleViewProduct = (product: Product) => {
    setDetailsProduct(product);
  };

  const handleDeleteProduct = (product: Product) => {
    setDeletingProduct(product);
  };

  const handleFormSubmit = async (
    data: Omit<Product, "id" | "createdAt" | "updatedAt">
  ) => {
    setFormLoading(true);

    try {
      if (editingProduct) {
        await updateProduct(editingProduct.id, data);
      } else {
        await addProduct(data);
      }

      setProductFormOpen(false);
      setEditingProduct(null);
    } catch (error) {
      toast({
        title: "Error",
        description: "Something went wrong. Please try again.",
        variant: "destructive",
      });
    } finally {
      setFormLoading(false);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deletingProduct) return;

    setDeleteLoading(true);

    try {
      await deleteProduct(deletingProduct.id);
      setDeletingProduct(null);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete product. Please try again.",
        variant: "destructive",
      });
    } finally {
      setDeleteLoading(false);
    }
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleItemsPerPageChange = (newItemsPerPage: number) => {
    setItemsPerPage(newItemsPerPage);
    setCurrentPage(1);
  };

  // Reset current page when filters change
  useMemo(() => {
    setCurrentPage(1);
  }, [activeFiltersCount]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex items-center gap-2">
          <Loader2 className="h-6 w-6 animate-spin" />
          <span>Loading products...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto py-8 px-4 space-y-8 overflow-y-auto">
        {/* Header */}
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold tracking-tight flex items-center gap-3">
                <Package className="h-8 w-8 text-primary" />
                <span className="bg-gradient-to-r from-primary via-purple-600 to-pink-600 bg-clip-text text-transparent">
                  Skin Studio System
                </span>
              </h1>
              <p className="text-muted-foreground mt-1">
                Manage your product inventory with advanced filtering and search
                capabilities
              </p>
            </div>
            <Button onClick={handleAddProduct} size="lg" className="shrink-0">
              <Plus className="h-5 w-5" />
              Add Product
            </Button>
          </div>

          {/* Search and View Controls */}
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1 max-w-md">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search products..."
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Select
                value={`${sortField}-${sortOrder}`}
                onValueChange={(value) => {
                  const [field, order] = value.split("-") as [
                    SortField,
                    SortOrder
                  ];
                  setSortField(field);
                  setSortOrder(order);
                }}
              >
                <SelectTrigger className="w-[180px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="name-asc">Name (A-Z)</SelectItem>
                  <SelectItem value="name-desc">Name (Z-A)</SelectItem>
                  <SelectItem value="price-asc">Price (Low-High)</SelectItem>
                  <SelectItem value="price-desc">Price (High-Low)</SelectItem>
                  <SelectItem value="stock-asc">Stock (Low-High)</SelectItem>
                  <SelectItem value="stock-desc">Stock (High-Low)</SelectItem>
                  <SelectItem value="createdAt-desc">Newest First</SelectItem>
                  <SelectItem value="createdAt-asc">Oldest First</SelectItem>
                </SelectContent>
              </Select>

              <div className="flex items-center border rounded-md">
                <Button
                  variant={viewMode === "list" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setViewMode("list")}
                  className="rounded-r-none"
                >
                  <List className="h-4 w-4" />
                </Button>
                <Button
                  variant={viewMode === "grid" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setViewMode("grid")}
                  className="rounded-l-none"
                >
                  <Grid3X3 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-card p-4 rounded-lg border">
            <div className="text-2xl font-bold text-primary">
              {products.length}
            </div>
            <div className="text-sm text-muted-foreground">Total Products</div>
          </div>
          <div className="bg-card p-4 rounded-lg border">
            <div className="text-2xl font-bold text-success">
              {products.filter((p) => p.status === "Active").length}
            </div>
            <div className="text-sm text-muted-foreground">Active Products</div>
          </div>
          <div className="bg-card p-4 rounded-lg border">
            <div className="text-2xl font-bold text-warning">
              {products.filter((p) => p.stock > 0 && p.stock < 10).length}
            </div>
            <div className="text-sm text-muted-foreground">Low Stock</div>
          </div>
          <div className="bg-card p-4 rounded-lg border">
            <div className="text-2xl font-bold text-destructive">
              {products.filter((p) => p.stock === 0).length}
            </div>
            <div className="text-sm text-muted-foreground">Out of Stock</div>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Filters Sidebar */}
          <div className="lg:col-span-1">
            <FilterPanel
              filters={filters}
              onFiltersChange={setFilters}
              activeFiltersCount={activeFiltersCount}
              products={products}
            />
          </div>

          {/* Products List */}
          <div className="lg:col-span-3 space-y-6">
            {/* Results Header */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">
                  {filteredProducts.length} result
                  {filteredProducts.length !== 1 ? "s" : ""}
                </span>
                {activeFiltersCount > 0 && (
                  <Badge variant="secondary">
                    {activeFiltersCount} filter
                    {activeFiltersCount !== 1 ? "s" : ""}
                  </Badge>
                )}
              </div>
            </div>

            {/* Products */}
            <ProductList
              products={paginatedProducts}
              viewMode={viewMode}
              onEdit={handleEditProduct}
              onDelete={handleDeleteProduct}
              onView={handleViewProduct}
              onSort={handleSort}
              sortField={sortField}
              sortOrder={sortOrder}
            />

            {/* Pagination */}
            {filteredProducts.length > 0 && (
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                totalItems={filteredProducts.length}
                itemsPerPage={itemsPerPage}
                onPageChange={handlePageChange}
                onItemsPerPageChange={handleItemsPerPageChange}
              />
            )}
          </div>
        </div>
      </div>

      {/* Modals */}
      <ProductForm
        open={productFormOpen}
        onClose={() => {
          setProductFormOpen(false);
          setEditingProduct(null);
        }}
        onSubmit={handleFormSubmit}
        product={editingProduct}
        isLoading={formLoading}
        isNameUnique={isNameUnique}
        products={products}
      />

      <ProductDetails
        product={detailsProduct}
        open={!!detailsProduct}
        onClose={() => setDetailsProduct(null)}
        onEdit={handleEditProduct}
      />

      <DeleteConfirmation
        product={deletingProduct}
        open={!!deletingProduct}
        onClose={() => setDeletingProduct(null)}
        onConfirm={handleDeleteConfirm}
        isLoading={deleteLoading}
      />
    </div>
  );
};

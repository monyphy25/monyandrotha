import { Product } from "@/types/product";
import { ProductCard } from "./ProductCard";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Edit, Trash2, Eye, AlertTriangle, ArrowUpDown } from "lucide-react";
import { SortField, SortOrder, ViewMode } from "@/types/product";

interface ProductListProps {
  products: Product[];
  viewMode: ViewMode;
  onEdit: (product: Product) => void;
  onDelete: (product: Product) => void;
  onView: (product: Product) => void;
  onSort: (field: SortField) => void;
  sortField: SortField;
  sortOrder: SortOrder;
}

export const ProductList = ({
  products,
  viewMode,
  onEdit,
  onDelete,
  onView,
  onSort,
  sortField,
  sortOrder,
}: ProductListProps) => {
  if (products.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-4">
          📦
        </div>
        <h3 className="text-lg font-semibold mb-2">No products found</h3>
        <p className="text-muted-foreground mb-4">
          Try adjusting your filters or add a new product to get started.
        </p>
      </div>
    );
  }

  const getSortIcon = (field: SortField) => {
    if (sortField === field) {
      return (
        <ArrowUpDown
          className={`h-4 w-4 ml-1 ${sortOrder === "asc" ? "rotate-180" : ""}`}
        />
      );
    }
    return <ArrowUpDown className="h-4 w-4 ml-1 opacity-50" />;
  };

  const getStatusBadgeVariant = (status: string) => {
    return status === "Active" ? "default" : "secondary";
  };

  const getStockBadgeVariant = (stock: number) => {
    if (stock === 0) return "destructive";
    if (stock < 10) return "warning";
    return "success";
  };

  if (viewMode === "grid") {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
        {products.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
            onEdit={onEdit}
            onDelete={onDelete}
            onView={onView}
          />
        ))}
      </div>
    );
  }

  return (
    <div className="border rounded-lg overflow-hidden bg-card">
      <div className="overflow-x-auto scrollbar-thin">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[200px] sm:w-[250px]">
                <Button
                  variant="ghost"
                  onClick={() => onSort("name")}
                  className="h-auto p-0 hover:bg-transparent text-xs sm:text-sm"
                >
                  Name {getSortIcon("name")}
                </Button>
              </TableHead>
              <TableHead className="hidden sm:table-cell">
                Description
              </TableHead>
              <TableHead>
                <Button
                  variant="ghost"
                  onClick={() => onSort("price")}
                  className="h-auto p-0 hover:bg-transparent text-xs sm:text-sm"
                >
                  Price {getSortIcon("price")}
                </Button>
              </TableHead>
              <TableHead className="min-w-[80px] sm:min-w-[100px]">
                Brand
              </TableHead>
              <TableHead>Status</TableHead>
              <TableHead>
                <Button
                  variant="ghost"
                  onClick={() => onSort("stock")}
                  className="h-auto p-0 hover:bg-transparent text-xs sm:text-sm"
                >
                  Stock {getSortIcon("stock")}
                </Button>
              </TableHead>
              <TableHead className="hidden sm:table-cell">
                <Button
                  variant="ghost"
                  onClick={() => onSort("createdAt")}
                  className="h-auto p-0 hover:bg-transparent text-xs sm:text-sm"
                >
                  Created {getSortIcon("createdAt")}
                </Button>
              </TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {products.map((product) => {
              const isLowStock = product.stock > 0 && product.stock < 10;
              const isOutOfStock = product.stock === 0;

              return (
                <TableRow key={product.id} className="hover:bg-muted/50">
                  <TableCell className="font-medium">
                    <button
                      onClick={() => onView(product)}
                      className="text-left hover:text-primary transition-colors text-sm sm:text-base"
                    >
                      {product.name}
                    </button>
                  </TableCell>
                  <TableCell className="max-w-[150px] sm:max-w-[200px] hidden sm:table-cell">
                    <span className="line-clamp-2 text-xs sm:text-sm text-muted-foreground">
                      {product.description || "No description"}
                    </span>
                  </TableCell>
                  <TableCell className="font-semibold text-primary text-sm sm:text-base">
                    ${product.price.toFixed(2)}
                  </TableCell>
                  <TableCell className="min-w-[80px] sm:min-w-[100px]">
                    <Badge
                      variant="outline"
                      className="text-xs px-2 py-1 max-w-[70px] sm:max-w-[90px] truncate"
                      title={product.brand}
                    >
                      {product.brand}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={getStatusBadgeVariant(product.status)}
                      className="text-xs px-2 py-1"
                    >
                      {product.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1 sm:gap-2">
                      <Badge
                        variant={getStockBadgeVariant(product.stock)}
                        className="text-xs px-2 py-1"
                      >
                        {isOutOfStock ? "Out of Stock" : product.stock}
                      </Badge>
                      {isLowStock && (
                        <AlertTriangle className="h-3 w-3 sm:h-4 sm:w-4 text-warning" />
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="text-xs sm:text-sm text-muted-foreground hidden sm:table-cell">
                    {product.createdAt.toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1 justify-end">
                      <Button
                        size="xs"
                        variant="ghost"
                        onClick={() => onView(product)}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button
                        size="xs"
                        variant="ghost"
                        onClick={() => onEdit(product)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        size="xs"
                        variant="ghost"
                        onClick={() => onDelete(product)}
                        className="text-destructive hover:text-destructive hover:bg-destructive/10"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

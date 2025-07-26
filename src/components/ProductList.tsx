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
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[250px]">
              <Button
                variant="ghost"
                onClick={() => onSort("name")}
                className="h-auto p-0 hover:bg-transparent"
              >
                Name {getSortIcon("name")}
              </Button>
            </TableHead>
            <TableHead>Description</TableHead>
            <TableHead>
              <Button
                variant="ghost"
                onClick={() => onSort("price")}
                className="h-auto p-0 hover:bg-transparent"
              >
                Price {getSortIcon("price")}
              </Button>
            </TableHead>
            <TableHead>Brand</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>
              <Button
                variant="ghost"
                onClick={() => onSort("stock")}
                className="h-auto p-0 hover:bg-transparent"
              >
                Stock {getSortIcon("stock")}
              </Button>
            </TableHead>
            <TableHead>
              <Button
                variant="ghost"
                onClick={() => onSort("createdAt")}
                className="h-auto p-0 hover:bg-transparent"
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
                    className="text-left hover:text-primary transition-colors"
                  >
                    {product.name}
                  </button>
                </TableCell>
                <TableCell className="max-w-[200px]">
                  <span className="line-clamp-2 text-sm text-muted-foreground">
                    {product.description || "No description"}
                  </span>
                </TableCell>
                <TableCell className="font-semibold text-primary">
                  ${product.price.toFixed(2)}
                </TableCell>
                <TableCell>
                  <Badge variant="outline">{product.brand}</Badge>
                </TableCell>
                <TableCell>
                  <Badge variant={getStatusBadgeVariant(product.status)}>
                    {product.status}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Badge variant={getStockBadgeVariant(product.stock)}>
                      {isOutOfStock ? "Out of Stock" : product.stock}
                    </Badge>
                    {isLowStock && (
                      <AlertTriangle className="h-4 w-4 text-warning" />
                    )}
                  </div>
                </TableCell>
                <TableCell className="text-sm text-muted-foreground">
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
  );
};

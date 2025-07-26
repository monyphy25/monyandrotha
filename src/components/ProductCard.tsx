import { Product } from "@/types/product";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Edit, Trash2, Eye, AlertTriangle } from "lucide-react";

interface ProductCardProps {
  product: Product;
  onEdit: (product: Product) => void;
  onDelete: (product: Product) => void;
  onView: (product: Product) => void;
}

export const ProductCard = ({
  product,
  onEdit,
  onDelete,
  onView,
}: ProductCardProps) => {
  const isLowStock = product.stock > 0 && product.stock < 10;
  const isOutOfStock = product.stock === 0;

  const getStatusBadgeVariant = () => {
    if (product.status === "Active") return "default";
    return "secondary";
  };

  const getStockDisplay = () => {
    if (isOutOfStock)
      return { text: "Out of Stock", variant: "destructive" as const };
    if (isLowStock)
      return {
        text: `Low Stock (${product.stock})`,
        variant: "warning" as const,
      };
    return { text: `${product.stock} in stock`, variant: "success" as const };
  };

  const stockInfo = getStockDisplay();

  return (
    <Card className="h-full flex flex-col hover:shadow-lg transition-shadow duration-200">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1 min-w-0">
            <h3
              className="font-semibold text-lg truncate cursor-pointer hover:text-primary transition-colors"
              onClick={() => onView(product)}
              title={product.name}
            >
              {product.name}
            </h3>
            <p
              className="text-sm text-muted-foreground mt-1 line-clamp-2"
              title={product.description}
            >
              {product.description || "No description available"}
            </p>
          </div>
          <div className="flex flex-col gap-2 items-end">
            <Badge variant={getStatusBadgeVariant()}>{product.status}</Badge>
            <Badge variant="outline">{product.brand}</Badge>
          </div>
        </div>
      </CardHeader>

      <CardContent className="flex-1 flex flex-col justify-between pb-3">
        <div className="space-y-3">
          <div className="text-2xl font-bold text-primary">
            ${product.price.toFixed(2)}
          </div>

          <div className="flex items-center gap-2">
            <Badge variant={stockInfo.variant} className="text-xs">
              {stockInfo.text}
            </Badge>
            {isLowStock && <AlertTriangle className="h-4 w-4 text-warning" />}
          </div>
        </div>
      </CardContent>

      <CardFooter className="pt-3 border-t">
        <div className="flex gap-2 w-full">
          <Button
            size="sm"
            variant="outline"
            onClick={() => onView(product)}
            className="flex-1"
          >
            <Eye className="h-4 w-4" />
            View
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={() => onEdit(product)}
            className="flex-1"
          >
            <Edit className="h-4 w-4" />
            Edit
          </Button>
          <Button
            size="sm"
            variant="destructive"
            onClick={() => onDelete(product)}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
};

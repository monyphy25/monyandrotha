import { Product } from "@/types/product";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Edit,
  ArrowLeft,
  Calendar,
  DollarSign,
  Package,
  Tag,
  AlertTriangle,
  CheckCircle,
  XCircle,
} from "lucide-react";

interface ProductDetailsProps {
  product: Product | null;
  open: boolean;
  onClose: () => void;
  onEdit: (product: Product) => void;
}

export const ProductDetails = ({
  product,
  open,
  onClose,
  onEdit,
}: ProductDetailsProps) => {
  if (!product) return null;

  const isLowStock = product.stock > 0 && product.stock < 10;
  const isOutOfStock = product.stock === 0;

  const getStatusIcon = () => {
    if (product.status === "Active") {
      return <CheckCircle className="h-5 w-5 text-success" />;
    }
    return <XCircle className="h-5 w-5 text-muted-foreground" />;
  };

  const getStockStatus = () => {
    if (isOutOfStock) {
      return {
        icon: <XCircle className="h-5 w-5 text-destructive" />,
        text: "Out of Stock",
        variant: "destructive" as const,
      };
    }
    if (isLowStock) {
      return {
        icon: <AlertTriangle className="h-5 w-5 text-warning" />,
        text: `Low Stock (${product.stock} remaining)`,
        variant: "warning" as const,
      };
    }
    return {
      icon: <CheckCircle className="h-5 w-5 text-success" />,
      text: `${product.stock} in stock`,
      variant: "success" as const,
    };
  };

  const stockStatus = getStockStatus();

  return (
    <Dialog open={open} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto scrollbar-thin">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="flex items-center gap-3">
              Product Details
            </DialogTitle>
            <Button className="mr-10" onClick={() => onEdit(product)}>
              <Edit className="h-4 w-4" />
              Edit Product
            </Button>
          </div>
        </DialogHeader>

        <div className="space-y-6">
          {/* Header Section */}
          <div className="space-y-4">
            <div>
              <h1 className="text-3xl font-bold text-foreground">
                {product.name}
              </h1>
              <p className="text-lg text-muted-foreground mt-2">
                {product.description || "No description available"}
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              <Badge variant="outline" className="text-sm">
                <Tag className="h-4 w-4 mr-1" />
                {product.brand}
              </Badge>
              <Badge
                variant={product.status === "Active" ? "default" : "secondary"}
              >
                {product.status}
              </Badge>
              <Badge variant={stockStatus.variant}>{stockStatus.text}</Badge>
            </div>
          </div>

          <Separator />

          {/* Details Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Pricing Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <DollarSign className="h-5 w-5" />
                  Pricing Information
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div>
                    <p className="text-sm text-muted-foreground">Price</p>
                    <p className="text-3xl font-bold text-primary">
                      ${product.price.toFixed(2)}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Total Value</p>
                    <p className="text-lg font-semibold">
                      ${(product.price * product.stock).toFixed(2)}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Inventory Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Package className="h-5 w-5" />
                  Inventory Information
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div>
                    <p className="text-sm text-muted-foreground">
                      Stock Quantity
                    </p>
                    <p className="text-3xl font-bold">{product.stock}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Status</p>
                    <div className="flex items-center gap-2 mt-1">
                      {stockStatus.icon}
                      <span className="font-medium">{stockStatus.text}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Timestamps */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Calendar className="h-5 w-5" />
                Timeline
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <p className="text-sm text-muted-foreground">Created</p>
                  <p className="font-medium">
                    {product.createdAt.toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Last Updated</p>
                  <p className="font-medium">
                    {product.updatedAt.toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Low Stock Warning */}
          {isLowStock && (
            <Card className="border-warning">
              <CardContent className="pt-6">
                <div className="flex items-center gap-3">
                  <AlertTriangle className="h-6 w-6 text-warning flex-shrink-0" />
                  <div>
                    <p className="font-medium text-warning">Low Stock Alert</p>
                    <p className="text-sm text-muted-foreground">
                      This product has low stock. Consider restocking soon to
                      avoid going out of stock.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Out of Stock Warning */}
          {isOutOfStock && (
            <Card className="border-destructive">
              <CardContent className="pt-6">
                <div className="flex items-center gap-3">
                  <XCircle className="h-6 w-6 text-destructive flex-shrink-0" />
                  <div>
                    <p className="font-medium text-destructive">Out of Stock</p>
                    <p className="text-sm text-muted-foreground">
                      This product is currently out of stock and unavailable for
                      sale.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

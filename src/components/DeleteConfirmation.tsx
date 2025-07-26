import { Product } from '@/types/product';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { AlertTriangle, Loader2 } from 'lucide-react';

interface DeleteConfirmationProps {
  product: Product | null;
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  isLoading?: boolean;
}

export const DeleteConfirmation = ({ 
  product, 
  open, 
  onClose, 
  onConfirm, 
  isLoading = false 
}: DeleteConfirmationProps) => {
  if (!product) return null;

  return (
    <AlertDialog open={open} onOpenChange={(open) => !open && onClose()}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-destructive" />
            Delete Product
          </AlertDialogTitle>
          <AlertDialogDescription asChild>
            <div className="space-y-4">
              <p>
                Are you sure you want to delete this product? This action cannot be undone 
                and will permanently remove the product from your inventory.
              </p>
              
              {/* Product Details */}
              <div className="bg-muted p-4 rounded-lg space-y-2">
                <div>
                  <span className="font-medium">Product Name:</span>
                  <p className="text-sm">{product.name}</p>
                </div>
                <div className="flex gap-2 items-center">
                  <span className="font-medium">Category:</span>
                  <Badge variant="outline">{product.category}</Badge>
                </div>
                <div className="flex gap-2 items-center">
                  <span className="font-medium">Price:</span>
                  <span className="text-primary font-semibold">${product.price.toFixed(2)}</span>
                </div>
                <div className="flex gap-2 items-center">
                  <span className="font-medium">Stock:</span>
                  <span>{product.stock} units</span>
                </div>
                {product.description && (
                  <div>
                    <span className="font-medium">Description:</span>
                    <p className="text-sm text-muted-foreground">{product.description}</p>
                  </div>
                )}
              </div>
              
              <p className="text-sm text-destructive">
                <strong>Warning:</strong> This action is permanent and cannot be reversed.
              </p>
            </div>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isLoading}>
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={onConfirm}
            disabled={isLoading}
            className="bg-destructive text-destructive-foreground hover:bg-destructive-hover"
          >
            {isLoading && <Loader2 className="h-4 w-4 animate-spin" />}
            Delete Product
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
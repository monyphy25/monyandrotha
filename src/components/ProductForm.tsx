import { useState, useEffect } from 'react';
import { Product, ProductFormData, ProductCategory, ProductStatus } from '@/types/product';
import { PRODUCT_CATEGORIES } from '@/data/sampleProducts';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, AlertCircle } from 'lucide-react';

interface ProductFormProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>) => void;
  product?: Product | null;
  isLoading?: boolean;
  isNameUnique: (name: string, excludeId?: string) => boolean;
}

export const ProductForm = ({ 
  open, 
  onClose, 
  onSubmit, 
  product,
  isLoading = false,
  isNameUnique
}: ProductFormProps) => {
  const [formData, setFormData] = useState<ProductFormData>({
    name: '',
    description: '',
    price: '',
    category: 'Electronics',
    status: 'Active',
    stock: ''
  });

  const [errors, setErrors] = useState<Partial<ProductFormData>>({});

  useEffect(() => {
    if (product) {
      setFormData({
        name: product.name,
        description: product.description || '',
        price: product.price.toString(),
        category: product.category,
        status: product.status,
        stock: product.stock.toString()
      });
    } else {
      setFormData({
        name: '',
        description: '',
        price: '',
        category: 'Electronics',
        status: 'Active',
        stock: ''
      });
    }
    setErrors({});
  }, [product, open]);

  const validateForm = (): boolean => {
    const newErrors: Partial<ProductFormData> = {};

    // Name validation
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    } else if (!isNameUnique(formData.name.trim(), product?.id)) {
      newErrors.name = 'Product name must be unique';
    }

    // Price validation
    if (!formData.price.trim()) {
      newErrors.price = 'Price is required';
    } else {
      const price = parseFloat(formData.price);
      if (isNaN(price) || price < 0) {
        newErrors.price = 'Price must be a positive number';
      }
    }

    // Stock validation
    if (!formData.stock.trim()) {
      newErrors.stock = 'Stock is required';
    } else {
      const stock = parseInt(formData.stock);
      if (isNaN(stock) || stock < 0 || !Number.isInteger(parseFloat(formData.stock))) {
        newErrors.stock = 'Stock must be a non-negative integer';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    const submitData = {
      name: formData.name.trim(),
      description: formData.description.trim() || undefined,
      price: parseFloat(formData.price),
      category: formData.category,
      status: formData.status,
      stock: parseInt(formData.stock)
    };

    onSubmit(submitData);
  };

  const handleInputChange = (field: keyof ProductFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  return (
    <Dialog open={open} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {product ? 'Edit Product' : 'Add New Product'}
          </DialogTitle>
          <DialogDescription>
            {product 
              ? 'Make changes to the product information below.' 
              : 'Fill in the details below to create a new product.'
            }
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Name */}
          <div className="space-y-2">
            <Label htmlFor="name" className="required">Product Name</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
              placeholder="Enter product name"
              className={errors.name ? 'border-destructive' : ''}
            />
            {errors.name && (
              <p className="text-sm text-destructive flex items-center gap-1">
                <AlertCircle className="h-4 w-4" />
                {errors.name}
              </p>
            )}
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              placeholder="Enter product description (optional)"
              rows={3}
            />
          </div>

          {/* Price and Stock Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="price" className="required">Price ($)</Label>
              <Input
                id="price"
                type="number"
                step="0.01"
                min="0"
                value={formData.price}
                onChange={(e) => handleInputChange('price', e.target.value)}
                placeholder="0.00"
                className={errors.price ? 'border-destructive' : ''}
              />
              {errors.price && (
                <p className="text-sm text-destructive flex items-center gap-1">
                  <AlertCircle className="h-4 w-4" />
                  {errors.price}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="stock" className="required">Stock Quantity</Label>
              <Input
                id="stock"
                type="number"
                min="0"
                value={formData.stock}
                onChange={(e) => handleInputChange('stock', e.target.value)}
                placeholder="0"
                className={errors.stock ? 'border-destructive' : ''}
              />
              {errors.stock && (
                <p className="text-sm text-destructive flex items-center gap-1">
                  <AlertCircle className="h-4 w-4" />
                  {errors.stock}
                </p>
              )}
            </div>
          </div>

          {/* Category */}
          <div className="space-y-2">
            <Label className="required">Category</Label>
            <Select
              value={formData.category}
              onValueChange={(value) => handleInputChange('category', value)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {PRODUCT_CATEGORIES.map(category => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Status */}
          <div className="space-y-3">
            <Label className="required">Status</Label>
            <RadioGroup
              value={formData.status}
              onValueChange={(value) => handleInputChange('status', value)}
              className="flex gap-6"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="Active" id="active" />
                <Label htmlFor="active">Active</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="Inactive" id="inactive" />
                <Label htmlFor="inactive">Inactive</Label>
              </div>
            </RadioGroup>
          </div>

          {/* Low Stock Warning */}
          {formData.stock && parseInt(formData.stock) > 0 && parseInt(formData.stock) < 10 && (
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                This product will be marked as low stock (quantity less than 10).
              </AlertDescription>
            </Alert>
          )}

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading && <Loader2 className="h-4 w-4 animate-spin" />}
              {product ? 'Update Product' : 'Create Product'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

// CSS for required label indicator
const styles = `
  .required::after {
    content: "*";
    color: hsl(var(--destructive));
    margin-left: 4px;
  }
`;

// Inject styles
if (typeof document !== 'undefined') {
  const styleSheet = document.createElement('style');
  styleSheet.textContent = styles;
  document.head.appendChild(styleSheet);
}
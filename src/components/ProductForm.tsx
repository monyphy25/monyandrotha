import { useState, useEffect, useMemo } from "react";
import { Product, ProductFormData, ProductStatus } from "@/types/product";
import { getUniqueBrands } from "@/data/sampleProducts";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2, AlertCircle, Search } from "lucide-react";

interface ProductFormProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: Omit<Product, "id" | "createdAt" | "updatedAt">) => void;
  product?: Product | null;
  isLoading?: boolean;
  isNameUnique: (name: string, excludeId?: string) => boolean;
  products: any[]; // Add products prop to get existing brands
}

export const ProductForm = ({
  open,
  onClose,
  onSubmit,
  product,
  isLoading = false,
  isNameUnique,
  products,
}: ProductFormProps) => {
  const [formData, setFormData] = useState<ProductFormData>({
    name: "",
    description: "",
    price: "",
    brand: "",
    status: "Active",
    stock: "",
  });

  const [errors, setErrors] = useState<Partial<ProductFormData>>({});
  const [brandOption, setBrandOption] = useState<"existing" | "new">(
    "existing"
  );
  const [brandSearch, setBrandSearch] = useState("");

  // Get unique brands from existing products - memoized to prevent re-renders
  const existingBrands = useMemo(() => getUniqueBrands(products), [products]);
  const filteredBrands = useMemo(
    () =>
      existingBrands.filter((brand) =>
        brand.toLowerCase().includes(brandSearch.toLowerCase())
      ),
    [existingBrands, brandSearch]
  );

  useEffect(() => {
    if (product) {
      setFormData({
        name: product.name,
        description: product.description || "",
        price: product.price.toString(),
        brand: product.brand,
        status: product.status,
        stock: product.stock.toString(),
      });
      // Determine if this is an existing brand or new
      setBrandOption(
        existingBrands.includes(product.brand) ? "existing" : "new"
      );
    } else {
      setFormData({
        name: "",
        description: "",
        price: "",
        brand: "",
        status: "Active",
        stock: "",
      });
      setBrandOption("existing");
      setBrandSearch("");
    }
    setErrors({});
  }, [product, open, existingBrands]);

  const validateForm = (): boolean => {
    const newErrors: Partial<ProductFormData> = {};

    // Name validation
    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
    } else if (!isNameUnique(formData.name.trim(), product?.id)) {
      newErrors.name = "Product name must be unique";
    }

    // Brand validation
    if (!formData.brand.trim()) {
      newErrors.brand = "Brand is required";
    }

    // Price validation
    if (!formData.price.trim()) {
      newErrors.price = "Price is required";
    } else {
      const price = parseFloat(formData.price);
      if (isNaN(price) || price < 0) {
        newErrors.price = "Price must be a positive number";
      }
    }

    // Stock validation
    if (!formData.stock.trim()) {
      newErrors.stock = "Stock is required";
    } else {
      const stock = parseInt(formData.stock);
      if (
        isNaN(stock) ||
        stock < 0 ||
        !Number.isInteger(parseFloat(formData.stock))
      ) {
        newErrors.stock = "Stock must be a non-negative integer";
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
      brand: formData.brand.trim(),
      status: formData.status,
      stock: parseInt(formData.stock),
    };

    onSubmit(submitData);
  };

  const handleInputChange = (field: keyof ProductFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));

    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const handleBrandOptionChange = (option: "existing" | "new") => {
    setBrandOption(option);
    setFormData((prev) => ({ ...prev, brand: "" }));
    setBrandSearch("");
    if (errors.brand) {
      setErrors((prev) => ({ ...prev, brand: undefined }));
    }
  };

  return (
    <Dialog open={open} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {product ? "Edit Product" : "Add New Product"}
          </DialogTitle>
          <DialogDescription>
            {product
              ? "Make changes to the product information below."
              : "Fill in the details below to create a new product."}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Name */}
          <div className="space-y-2">
            <Label htmlFor="name" className="required">
              Product Name
            </Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => handleInputChange("name", e.target.value)}
              placeholder="Enter product name"
              className={errors.name ? "border-destructive" : ""}
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
              onChange={(e) => handleInputChange("description", e.target.value)}
              placeholder="Enter product description (optional)"
              rows={3}
            />
          </div>

          {/* Price and Stock Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="price" className="required">
                Price ($)
              </Label>
              <Input
                id="price"
                type="number"
                step="0.01"
                min="0"
                value={formData.price}
                onChange={(e) => handleInputChange("price", e.target.value)}
                placeholder="0.00"
                className={errors.price ? "border-destructive" : ""}
              />
              {errors.price && (
                <p className="text-sm text-destructive flex items-center gap-1">
                  <AlertCircle className="h-4 w-4" />
                  {errors.price}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="stock" className="required">
                Stock Quantity
              </Label>
              <Input
                id="stock"
                type="number"
                min="0"
                value={formData.stock}
                onChange={(e) => handleInputChange("stock", e.target.value)}
                placeholder="0"
                className={errors.stock ? "border-destructive" : ""}
              />
              {errors.stock && (
                <p className="text-sm text-destructive flex items-center gap-1">
                  <AlertCircle className="h-4 w-4" />
                  {errors.stock}
                </p>
              )}
            </div>
          </div>

          {/* Brand Selection */}
          <div className="space-y-4">
            <Label className="required">Brand</Label>

            {/* Brand Option Selection */}
            <RadioGroup
              value={brandOption}
              onValueChange={(value) =>
                handleBrandOptionChange(value as "existing" | "new")
              }
              className="flex gap-6"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="existing" id="existing-brand" />
                <Label htmlFor="existing-brand">Select Existing Brand</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="new" id="new-brand" />
                <Label htmlFor="new-brand">Add New Brand</Label>
              </div>
            </RadioGroup>

            {/* Existing Brand Dropdown with Search */}
            {brandOption === "existing" && (
              <div className="space-y-2">
                <Select
                  value={formData.brand}
                  onValueChange={(value) => handleInputChange("brand", value)}
                >
                  <SelectTrigger
                    className={errors.brand ? "border-destructive" : ""}
                  >
                    <SelectValue placeholder="Search and select a brand" />
                  </SelectTrigger>
                  <SelectContent className="max-h-60">
                    {/* Search Input */}
                    <div className="flex items-center px-3 pb-2">
                      <Search className="mr-2 h-4 w-4 shrink-0 opacity-50" />
                      <Input
                        placeholder="Search brands..."
                        value={brandSearch}
                        onChange={(e) => setBrandSearch(e.target.value)}
                        className="border-0 focus:ring-0 focus-visible:ring-0 focus-visible:ring-offset-0"
                      />
                    </div>
                    <div className="border-t" />
                    {/* Brand Options */}
                    {filteredBrands.length > 0 ? (
                      filteredBrands.map((brand) => (
                        <SelectItem key={brand} value={brand}>
                          {brand}
                        </SelectItem>
                      ))
                    ) : (
                      <SelectItem value="" disabled>
                        No brands found
                      </SelectItem>
                    )}
                  </SelectContent>
                </Select>
              </div>
            )}

            {/* New Brand Input */}
            {brandOption === "new" && (
              <div className="space-y-2">
                <Input
                  value={formData.brand}
                  onChange={(e) => handleInputChange("brand", e.target.value)}
                  placeholder="Enter new brand name"
                  className={errors.brand ? "border-destructive" : ""}
                />
              </div>
            )}

            {errors.brand && (
              <p className="text-sm text-destructive flex items-center gap-1">
                <AlertCircle className="h-4 w-4" />
                {errors.brand}
              </p>
            )}
          </div>

          {/* Status */}
          <div className="space-y-3">
            <Label className="required">Status</Label>
            <RadioGroup
              value={formData.status}
              onValueChange={(value) => handleInputChange("status", value)}
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
          {formData.stock &&
            parseInt(formData.stock) > 0 &&
            parseInt(formData.stock) < 10 && (
              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  This product will be marked as low stock (quantity less than
                  10).
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
              {product ? "Update Product" : "Create Product"}
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
if (typeof document !== "undefined") {
  const styleSheet = document.createElement("style");
  styleSheet.textContent = styles;
  document.head.appendChild(styleSheet);
}

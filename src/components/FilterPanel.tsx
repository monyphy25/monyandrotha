import { useState } from "react";
import { ProductFilters } from "@/types/product";
import { getUniqueBrands } from "@/data/sampleProducts";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Checkbox } from "@/components/ui/checkbox";
import { Filter, X, ChevronDown } from "lucide-react";

interface FilterPanelProps {
  filters: ProductFilters;
  onFiltersChange: (filters: ProductFilters) => void;
  activeFiltersCount: number;
  products: any[]; // Add products prop to generate brand options
}

export const FilterPanel = ({
  filters,
  onFiltersChange,
  activeFiltersCount,
  products,
}: FilterPanelProps) => {
  const [priceMin, setPriceMin] = useState(filters.priceMin?.toString() || "");
  const [priceMax, setPriceMax] = useState(filters.priceMax?.toString() || "");

  // Get unique brands from existing products
  const availableBrands = getUniqueBrands(products);

  const handleBrandChange = (brand: string, checked: boolean) => {
    const newBrands = checked
      ? [...filters.brands, brand]
      : filters.brands.filter((b) => b !== brand);

    onFiltersChange({ ...filters, brands: newBrands });
  };

  const handlePriceChange = () => {
    const min = priceMin ? parseFloat(priceMin) : undefined;
    const max = priceMax ? parseFloat(priceMax) : undefined;

    onFiltersChange({
      ...filters,
      priceMin: min && min >= 0 ? min : undefined,
      priceMax: max && max >= 0 ? max : undefined,
    });
  };

  const clearAllFilters = () => {
    setPriceMin("");
    setPriceMax("");
    onFiltersChange({
      search: "",
      brands: [],
      status: "all",
      priceMin: undefined,
      priceMax: undefined,
      stockLevel: "all",
    });
  };

  const removeBrandFilter = (brand: string) => {
    onFiltersChange({
      ...filters,
      brands: filters.brands.filter((b) => b !== brand),
    });
  };

  return (
    <Card>
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Filters
            {activeFiltersCount > 0 && (
              <Badge variant="secondary" className="ml-2">
                {activeFiltersCount}
              </Badge>
            )}
          </CardTitle>
          {activeFiltersCount > 0 && (
            <Button variant="outline" size="sm" onClick={clearAllFilters}>
              Clear All
            </Button>
          )}
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Active Filters Summary */}
        {activeFiltersCount > 0 && (
          <div className="space-y-2">
            <Label className="text-sm font-medium">Active Filters:</Label>
            <div className="flex flex-wrap gap-2">
              {filters.brands.map((brand) => (
                <Badge
                  key={brand}
                  variant="secondary"
                  className="cursor-pointer hover:bg-secondary/80"
                >
                  {brand}
                  <X
                    className="h-3 w-3 ml-1"
                    onClick={() => removeBrandFilter(brand)}
                  />
                </Badge>
              ))}
              {filters.status !== "all" && (
                <Badge variant="secondary">Status: {filters.status}</Badge>
              )}
              {filters.stockLevel !== "all" && (
                <Badge variant="secondary">
                  Stock: {filters.stockLevel.replace("-", " ")}
                </Badge>
              )}
              {(filters.priceMin || filters.priceMax) && (
                <Badge variant="secondary">
                  Price: ${filters.priceMin || 0} - ${filters.priceMax || "∞"}
                </Badge>
              )}
            </div>
            <Separator />
          </div>
        )}

        {/* Brand Filter */}
        <div className="space-y-3">
          <Label className="text-sm font-medium">Brands</Label>
          {availableBrands.length > 0 ? (
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className="w-full justify-between">
                  {filters.brands.length === 0
                    ? "Select brands"
                    : `${filters.brands.length} selected`}
                  <ChevronDown className="h-4 w-4 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-full p-4" align="start">
                <div className="space-y-3 max-h-60 overflow-y-auto">
                  {availableBrands.map((brand) => (
                    <div key={brand} className="flex items-center space-x-2">
                      <Checkbox
                        id={brand}
                        checked={filters.brands.includes(brand)}
                        onCheckedChange={(checked) =>
                          handleBrandChange(brand, checked as boolean)
                        }
                      />
                      <Label htmlFor={brand} className="text-sm cursor-pointer">
                        {brand}
                      </Label>
                    </div>
                  ))}
                </div>
              </PopoverContent>
            </Popover>
          ) : (
            <p className="text-sm text-muted-foreground">No brands available</p>
          )}
        </div>

        {/* Status Filter */}
        <div className="space-y-3">
          <Label className="text-sm font-medium">Status</Label>
          <Select
            value={filters.status}
            onValueChange={(value) =>
              onFiltersChange({ ...filters, status: value as any })
            }
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="Active">Active</SelectItem>
              <SelectItem value="Inactive">Inactive</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Price Range */}
        <div className="space-y-3">
          <Label className="text-sm font-medium">Price Range</Label>
          <div className="flex gap-2">
            <div className="flex-1">
              <Input
                type="number"
                placeholder="Min price"
                value={priceMin}
                onChange={(e) => setPriceMin(e.target.value)}
                onBlur={handlePriceChange}
                min="0"
                step="0.01"
              />
            </div>
            <div className="flex-1">
              <Input
                type="number"
                placeholder="Max price"
                value={priceMax}
                onChange={(e) => setPriceMax(e.target.value)}
                onBlur={handlePriceChange}
                min="0"
                step="0.01"
              />
            </div>
          </div>
        </div>

        {/* Stock Level */}
        <div className="space-y-3">
          <Label className="text-sm font-medium">Stock Level</Label>
          <Select
            value={filters.stockLevel}
            onValueChange={(value) =>
              onFiltersChange({ ...filters, stockLevel: value as any })
            }
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Stock Levels</SelectItem>
              <SelectItem value="in-stock">In Stock (≥10)</SelectItem>
              <SelectItem value="low">Low Stock (&lt;10)</SelectItem>
              <SelectItem value="out-of-stock">Out of Stock</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardContent>
    </Card>
  );
};

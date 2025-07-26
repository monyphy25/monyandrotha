import { useState } from 'react';
import { ProductFilters, ProductCategory } from '@/types/product';
import { PRODUCT_CATEGORIES } from '@/data/sampleProducts';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { 
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Checkbox } from '@/components/ui/checkbox';
import { Filter, X, ChevronDown } from 'lucide-react';

interface FilterPanelProps {
  filters: ProductFilters;
  onFiltersChange: (filters: ProductFilters) => void;
  activeFiltersCount: number;
}

export const FilterPanel = ({ filters, onFiltersChange, activeFiltersCount }: FilterPanelProps) => {
  const [priceMin, setPriceMin] = useState(filters.priceMin?.toString() || '');
  const [priceMax, setPriceMax] = useState(filters.priceMax?.toString() || '');

  const handleCategoryChange = (category: ProductCategory, checked: boolean) => {
    const newCategories = checked
      ? [...filters.categories, category]
      : filters.categories.filter(c => c !== category);
    
    onFiltersChange({ ...filters, categories: newCategories });
  };

  const handlePriceChange = () => {
    const min = priceMin ? parseFloat(priceMin) : undefined;
    const max = priceMax ? parseFloat(priceMax) : undefined;
    
    onFiltersChange({ 
      ...filters, 
      priceMin: min && min >= 0 ? min : undefined,
      priceMax: max && max >= 0 ? max : undefined
    });
  };

  const clearAllFilters = () => {
    setPriceMin('');
    setPriceMax('');
    onFiltersChange({
      search: '',
      categories: [],
      status: 'all',
      priceMin: undefined,
      priceMax: undefined,
      stockLevel: 'all'
    });
  };

  const removeCategoryFilter = (category: ProductCategory) => {
    onFiltersChange({
      ...filters,
      categories: filters.categories.filter(c => c !== category)
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
            <Button
              variant="outline"
              size="sm"
              onClick={clearAllFilters}
            >
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
              {filters.categories.map(category => (
                <Badge key={category} variant="secondary" className="cursor-pointer hover:bg-secondary/80">
                  {category}
                  <X 
                    className="h-3 w-3 ml-1" 
                    onClick={() => removeCategoryFilter(category)}
                  />
                </Badge>
              ))}
              {filters.status !== 'all' && (
                <Badge variant="secondary">Status: {filters.status}</Badge>
              )}
              {filters.stockLevel !== 'all' && (
                <Badge variant="secondary">
                  Stock: {filters.stockLevel.replace('-', ' ')}
                </Badge>
              )}
              {(filters.priceMin || filters.priceMax) && (
                <Badge variant="secondary">
                  Price: ${filters.priceMin || 0} - ${filters.priceMax || '∞'}
                </Badge>
              )}
            </div>
            <Separator />
          </div>
        )}

        {/* Category Filter */}
        <div className="space-y-3">
          <Label className="text-sm font-medium">Categories</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className="w-full justify-between">
                {filters.categories.length === 0 
                  ? 'Select categories' 
                  : `${filters.categories.length} selected`
                }
                <ChevronDown className="h-4 w-4 opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-full p-4" align="start">
              <div className="space-y-3">
                {PRODUCT_CATEGORIES.map(category => (
                  <div key={category} className="flex items-center space-x-2">
                    <Checkbox
                      id={category}
                      checked={filters.categories.includes(category)}
                      onCheckedChange={(checked) => 
                        handleCategoryChange(category, checked as boolean)
                      }
                    />
                    <Label 
                      htmlFor={category} 
                      className="text-sm cursor-pointer"
                    >
                      {category}
                    </Label>
                  </div>
                ))}
              </div>
            </PopoverContent>
          </Popover>
        </div>

        {/* Status Filter */}
        <div className="space-y-3">
          <Label className="text-sm font-medium">Status</Label>
          <Select 
            value={filters.status} 
            onValueChange={(value) => onFiltersChange({ ...filters, status: value as any })}
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
            onValueChange={(value) => onFiltersChange({ ...filters, stockLevel: value as any })}
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
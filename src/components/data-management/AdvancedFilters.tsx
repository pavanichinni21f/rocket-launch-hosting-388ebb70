import React from 'react';
import { TableFilters } from '../../types/data';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { DatePickerWithRange } from '../ui/date-range-picker';
import { Badge } from '../ui/badge';
import { X, Filter } from 'lucide-react';
import { DateRange } from 'react-day-picker';

interface AdvancedFiltersProps {
  filters: TableFilters;
  onFiltersChange: (filters: TableFilters) => void;
}

export const AdvancedFilters: React.FC<AdvancedFiltersProps> = ({
  filters,
  onFiltersChange,
}) => {
  const handleStatusChange = (status: string[]) => {
    onFiltersChange({
      ...filters,
      status,
    });
  };

  const handleCategoryChange = (category: string[]) => {
    onFiltersChange({
      ...filters,
      category,
    });
  };

  const handleDateRangeChange = (dateRange: DateRange | undefined) => {
    onFiltersChange({
      ...filters,
      dateRange: dateRange ? { from: dateRange.from!, to: dateRange.to! } : undefined,
    });
  };

  const handleSearchChange = (search: string) => {
    onFiltersChange({
      ...filters,
      search,
    });
  };

  const clearFilters = () => {
    onFiltersChange({});
  };

  const hasActiveFilters = Object.keys(filters).some(key => {
    const value = filters[key as keyof TableFilters];
    return value !== undefined && value !== '' && (Array.isArray(value) ? value.length > 0 : true);
  });

  const statusOptions = ['active', 'inactive', 'pending'];
  const categoryOptions = ['Development', 'Marketing', 'Infrastructure', 'Research', 'Security', 'HR'];

  return (
    <div className="space-y-4 p-4 border rounded-lg bg-muted/50">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Filter className="h-4 w-4" />
          <span className="font-medium">Filters</span>
          {hasActiveFilters && (
            <Badge variant="secondary">
              {Object.keys(filters).filter(key => {
                const value = filters[key as keyof TableFilters];
                return value !== undefined && value !== '' && (Array.isArray(value) ? value.length > 0 : true);
              }).length} active
            </Badge>
          )}
        </div>
        {hasActiveFilters && (
          <Button variant="ghost" size="sm" onClick={clearFilters}>
            <X className="h-4 w-4 mr-2" />
            Clear All
          </Button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Search */}
        <div className="space-y-2">
          <Label htmlFor="search">Search</Label>
          <Input
            id="search"
            placeholder="Search by name..."
            value={filters.search || ''}
            onChange={(e) => handleSearchChange(e.target.value)}
          />
        </div>

        {/* Status Filter */}
        <div className="space-y-2">
          <Label>Status</Label>
          <Select
            value={filters.status?.[0] || ''}
            onValueChange={(value) => handleStatusChange(value ? [value] : [])}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select status" />
            </SelectTrigger>
            <SelectContent>
              {statusOptions.map((status) => (
                <SelectItem key={status} value={status}>
                  {status.charAt(0).toUpperCase() + status.slice(1)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Category Filter */}
        <div className="space-y-2">
          <Label>Category</Label>
          <Select
            value={filters.category?.[0] || ''}
            onValueChange={(value) => handleCategoryChange(value ? [value] : [])}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select category" />
            </SelectTrigger>
            <SelectContent>
              {categoryOptions.map((category) => (
                <SelectItem key={category} value={category}>
                  {category}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Date Range Filter */}
        <div className="space-y-2">
          <Label>Date Range</Label>
          <DatePickerWithRange
            date={filters.dateRange ? {
              from: filters.dateRange.from,
              to: filters.dateRange.to
            } : undefined}
            onDateChange={handleDateRangeChange}
          />
        </div>
      </div>

      {/* Active Filters Display */}
      {hasActiveFilters && (
        <div className="flex flex-wrap gap-2">
          {filters.search && (
            <Badge variant="outline">
              Search: {filters.search}
              <Button
                variant="ghost"
                size="sm"
                className="h-4 w-4 p-0 ml-2"
                onClick={() => handleSearchChange('')}
              >
                <X className="h-3 w-3" />
              </Button>
            </Badge>
          )}
          {filters.status?.map((status) => (
            <Badge key={status} variant="outline">
              Status: {status}
              <Button
                variant="ghost"
                size="sm"
                className="h-4 w-4 p-0 ml-2"
                onClick={() => handleStatusChange(filters.status!.filter(s => s !== status))}
              >
                <X className="h-3 w-3" />
              </Button>
            </Badge>
          ))}
          {filters.category?.map((category) => (
            <Badge key={category} variant="outline">
              Category: {category}
              <Button
                variant="ghost"
                size="sm"
                className="h-4 w-4 p-0 ml-2"
                onClick={() => handleCategoryChange(filters.category!.filter(c => c !== category))}
              >
                <X className="h-3 w-3" />
              </Button>
            </Badge>
          ))}
          {filters.dateRange && (
            <Badge variant="outline">
              Date: {filters.dateRange.from.toLocaleDateString()} - {filters.dateRange.to.toLocaleDateString()}
              <Button
                variant="ghost"
                size="sm"
                className="h-4 w-4 p-0 ml-2"
                onClick={() => handleDateRangeChange(undefined)}
              >
                <X className="h-3 w-3" />
              </Button>
            </Badge>
          )}
        </div>
      )}
    </div>
  );
};
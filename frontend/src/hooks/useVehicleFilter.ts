import { useState, useMemo } from 'react';
import { Vehicle, FilterState } from '../types/vehicle';

const initialFilters: FilterState = {
  model: '',
  priceRange: '',
  color: '',
  status: 'Available',
  sortBy: 'newest',
  searchQuery: ''
};

export function useVehicleFilter(initialVehicles: Vehicle[]) {
  const [filters, setFilters] = useState<FilterState>(initialFilters);

  const handleFilterChange = (key: keyof FilterState, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const handleResetFilters = () => {
    setFilters(initialFilters);
  };

  const filteredVehicles = useMemo(() => {
    return initialVehicles.filter((v) => {
      // Model match
      if (filters.model && !v.model.toLowerCase().includes(filters.model.toLowerCase())) {
        return false;
      }
      // Color match
      if (filters.color && !v.color.toLowerCase().includes(filters.color.toLowerCase())) {
        return false;
      }
      // Status match
      if (filters.status && v.status.toLowerCase() !== filters.status.toLowerCase()) {
        return false;
      }
      // Search query match
      if (filters.searchQuery) {
        const query = filters.searchQuery.toLowerCase();
        const matchesModel = v.model.toLowerCase().includes(query);
        const matchesBrand = v.brand.toLowerCase().includes(query);
        const matchesVin = v.vin.toLowerCase().includes(query);
        if (!matchesModel && !matchesBrand && !matchesVin) return false;
      }
      // Price range match
      if (filters.priceRange === 'under1b' && v.price >= 1000000000) return false;
      if (filters.priceRange === '1b-2b' && (v.price < 1000000000 || v.price > 2000000000)) return false;
      if (filters.priceRange === 'above2b' && v.price <= 2000000000) return false;

      return true;
    });
  }, [initialVehicles, filters]);

  return {
    filters,
    filteredVehicles,
    handleFilterChange,
    handleResetFilters
  };
}

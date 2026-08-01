import { useState, useEffect, useMemo } from 'react';
import { Vehicle, FilterState } from '../types/vehicle';
import { fetchVehiclesFromApi } from '../services/api';
import { MOCK_VEHICLES } from '../data/vehicles';

const initialFilters: FilterState = {
  model: '',
  priceRange: '',
  color: '',
  status: 'Available',
  sortBy: 'newest',
  searchQuery: ''
};

export function useVehicleFilter() {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [filters, setFilters] = useState<FilterState>(initialFilters);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isDbConnected, setIsDbConnected] = useState<boolean>(false);

  // Dynamic Fetching from Database API
  useEffect(() => {
    let isMounted = true;
    setIsLoading(true);

    fetchVehiclesFromApi(filters.status)
      .then((data) => {
        if (isMounted) {
          setVehicles(data);
          setIsDbConnected(true);
          setIsLoading(false);
        }
      })
      .catch(() => {
        if (isMounted) {
          setVehicles(MOCK_VEHICLES);
          setIsDbConnected(false);
          setIsLoading(false);
        }
      });

    return () => { isMounted = false; };
  }, [filters.status]);

  const handleFilterChange = (key: keyof FilterState, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const handleResetFilters = () => {
    setFilters(initialFilters);
  };

  const filteredVehicles = useMemo(() => {
    return vehicles.filter((v) => {
      if (filters.model && !v.model.toLowerCase().includes(filters.model.toLowerCase())) {
        return false;
      }
      if (filters.color && !v.color.toLowerCase().includes(filters.color.toLowerCase())) {
        return false;
      }
      if (filters.searchQuery) {
        const query = filters.searchQuery.toLowerCase();
        const matchesModel = v.model.toLowerCase().includes(query);
        const matchesBrand = v.brand.toLowerCase().includes(query);
        const matchesVin = v.vin.toLowerCase().includes(query);
        if (!matchesModel && !matchesBrand && !matchesVin) return false;
      }
      if (filters.priceRange === 'under1b' && v.price >= 1000000000) return false;
      if (filters.priceRange === '1b-2b' && (v.price < 1000000000 || v.price > 2000000000)) return false;
      if (filters.priceRange === 'above2b' && v.price <= 2000000000) return false;

      return true;
    });
  }, [vehicles, filters]);

  return {
    filters,
    filteredVehicles,
    isLoading,
    isDbConnected,
    handleFilterChange,
    handleResetFilters
  };
}

import { useState, useEffect, useMemo } from 'react';
import { Vehicle, FilterState } from '../types/vehicle';
import { fetchVehiclesFromApi } from '../services/api';
import { MOCK_VEHICLES } from '../data/vehicles';

const PAGE_SIZE = 6;

const initialFilters: FilterState = {
  model: '',
  priceRange: '',
  color: '',
  status: '',
  sortBy: 'newest',
  searchQuery: ''
};

export function useVehicleFilter() {
  const [vehicles, setVehicles] = useState<Vehicle[]>(MOCK_VEHICLES);
  const [filters, setFilters] = useState<FilterState>(initialFilters);
  const [visibleCount, setVisibleCount] = useState<number>(PAGE_SIZE);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isDbConnected, setIsDbConnected] = useState<boolean>(true);

  // Reset pagination whenever filter changes
  useEffect(() => {
    setVisibleCount(PAGE_SIZE);
  }, [filters]);

  // Fetch dynamically from DB API
  useEffect(() => {
    let isMounted = true;
    setIsLoading(true);

    fetchVehiclesFromApi(filters.status)
      .then((data) => {
        if (isMounted && data && data.length > 0) {
          setVehicles(data);
          setIsDbConnected(true);
          setIsLoading(false);
        } else if (isMounted) {
          setVehicles(MOCK_VEHICLES);
          setIsDbConnected(false);
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

  const handleLoadMore = () => {
    setVisibleCount((prev) => prev + PAGE_SIZE);
  };

  const filteredVehicles = useMemo(() => {
    return vehicles.filter((v) => {
      if (filters.model && !v.model.toLowerCase().includes(filters.model.toLowerCase())) {
        return false;
      }
      if (filters.color && !v.color.toLowerCase().includes(filters.color.toLowerCase())) {
        return false;
      }
      if (filters.status && v.status.toLowerCase() !== filters.status.toLowerCase()) {
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

  const displayedVehicles = useMemo(() => {
    return filteredVehicles.slice(0, visibleCount);
  }, [filteredVehicles, visibleCount]);

  const hasMore = visibleCount < filteredVehicles.length;
  const remainingCount = Math.max(0, filteredVehicles.length - visibleCount);

  return {
    filters,
    totalCount: filteredVehicles.length,
    displayedVehicles,
    hasMore,
    remainingCount,
    isLoading,
    isDbConnected,
    handleFilterChange,
    handleResetFilters,
    handleLoadMore
  };
}

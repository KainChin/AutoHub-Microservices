import React, { useState } from 'react';
import { Header } from '../components/layout/Header';
import { HeroBanner } from '../components/hero/HeroBanner';
import { FilterBar } from '../components/filter/FilterBar';
import { VehicleGrid } from '../components/vehicle/VehicleGrid';
import { Footer } from '../components/layout/Footer';
import { CustomerProfileModal } from '../components/customer/CustomerProfileModal';
import { useVehicleFilter } from '../hooks/useVehicleFilter';

export const Home: React.FC = () => {
  const [isProfileModalOpen, setIsProfileModalOpen] = useState<boolean>(false);

  const {
    filters,
    totalCount,
    displayedVehicles,
    hasMore,
    remainingCount,
    isLoading,
    handleFilterChange,
    handleResetFilters,
    handleLoadMore
  } = useVehicleFilter();

  return (
    <div className="min-h-screen bg-[#0b0f19] text-slate-100 flex flex-col justify-between">
      <div>
        <Header
          searchQuery={filters.searchQuery}
          onSearchChange={(query) => handleFilterChange('searchQuery', query)}
          onOpenProfileModal={() => setIsProfileModalOpen(true)}
        />

        <main className="max-w-7xl mx-auto px-6">
          <HeroBanner />
          
          <FilterBar
            filters={filters}
            onFilterChange={handleFilterChange}
            onReset={handleResetFilters}
          />

          <VehicleGrid
            vehicles={displayedVehicles}
            totalCount={totalCount}
            hasMore={hasMore}
            remainingCount={remainingCount}
            isLoading={isLoading}
            onLoadMore={handleLoadMore}
          />
        </main>
      </div>

      <Footer />

      {/* Customer Registration Modal */}
      <CustomerProfileModal
        isOpen={isProfileModalOpen}
        onClose={() => setIsProfileModalOpen(false)}
      />
    </div>
  );
};

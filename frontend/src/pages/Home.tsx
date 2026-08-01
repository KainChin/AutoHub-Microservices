import React from 'react';
import { Header } from '../components/layout/Header';
import { HeroBanner } from '../components/hero/HeroBanner';
import { FilterBar } from '../components/filter/FilterBar';
import { VehicleGrid } from '../components/vehicle/VehicleGrid';
import { Footer } from '../components/layout/Footer';
import { useVehicleFilter } from '../hooks/useVehicleFilter';
import { Database, Loader2 } from 'lucide-react';

export const Home: React.FC = () => {
  const {
    filters,
    filteredVehicles,
    isLoading,
    isDbConnected,
    handleFilterChange,
    handleResetFilters
  } = useVehicleFilter();

  return (
    <div className="min-h-screen bg-[#0b0f19] text-slate-100 flex flex-col justify-between">
      <div>
        <Header
          searchQuery={filters.searchQuery}
          onSearchChange={(query) => handleFilterChange('searchQuery', query)}
        />

        <main className="max-w-7xl mx-auto px-6">
          {/* Live DB Status Indicator */}
          <div className="flex items-center justify-between mb-4 px-2">
            <div className="flex items-center gap-2 text-xs">
              <Database className={`w-3.5 h-3.5 ${isDbConnected ? 'text-emerald-400' : 'text-amber-400'}`} />
              <span className="text-slate-400">
                Nguồn dữ liệu: <strong className={isDbConnected ? 'text-emerald-400' : 'text-amber-400'}>
                  {isDbConnected ? 'SQL Server Database (Dynamic API)' : 'Mẫu CSDL (Fallback)'}
                </strong>
              </span>
            </div>
            {isLoading && (
              <div className="flex items-center gap-1.5 text-xs text-red-400">
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                <span>Đang tải CSDL...</span>
              </div>
            )}
          </div>

          <HeroBanner />
          
          <FilterBar
            filters={filters}
            onFilterChange={handleFilterChange}
            onReset={handleResetFilters}
          />

          <VehicleGrid vehicles={filteredVehicles} />
        </main>
      </div>

      <Footer />
    </div>
  );
};

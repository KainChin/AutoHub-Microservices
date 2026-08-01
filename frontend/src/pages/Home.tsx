import React, { useState } from 'react';
import { Header } from '../components/layout/Header';
import { HeroBanner } from '../components/hero/HeroBanner';
import { FilterBar } from '../components/filter/FilterBar';
import { VehicleGrid } from '../components/vehicle/VehicleGrid';
import { Footer } from '../components/layout/Footer';
import { AuthenticationModal } from '../components/authentication/AuthenticationModal';
import { CustomerProfileModal } from '../components/customer/CustomerProfileModal';
import { useVehicleFilter } from '../hooks/useVehicleFilter';
import { User } from '../types/user';

export const Home: React.FC = () => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState<boolean>(false);
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

  const handleAuthSuccess = (user: User) => {
    setCurrentUser(user);
    setIsAuthModalOpen(false);

    // Business Logic Check: Only open Profile Completion if incomplete
    if (!user.isProfileComplete) {
      setIsProfileModalOpen(true);
    }
  };

  const handleLogout = () => {
    setCurrentUser(null);
  };

  return (
    <div className="min-h-screen bg-[#0b0f19] text-slate-100 flex flex-col justify-between">
      <div>
        <Header
          user={currentUser}
          searchQuery={filters.searchQuery}
          onSearchChange={(query) => handleFilterChange('searchQuery', query)}
          onOpenAuthModal={() => setIsAuthModalOpen(true)}
          onOpenProfileModal={() => setIsProfileModalOpen(true)}
          onLogout={handleLogout}
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

      {/* Authentication System Modal (Login / Register) */}
      <AuthenticationModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onAuthSuccess={handleAuthSuccess}
      />

      {/* Customer Profile Completion Modal */}
      <CustomerProfileModal
        isOpen={isProfileModalOpen}
        onClose={() => setIsProfileModalOpen(false)}
      />
    </div>
  );
};

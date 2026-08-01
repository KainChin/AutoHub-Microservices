export type VehicleStatus = 'Available' | 'Sold' | 'InService';

export interface Vehicle {
  id: number;
  model: string;
  brand: string;
  vin: string;
  year: number;
  color: string;
  price: number;
  status: VehicleStatus;
  imageUrl: string;
  location?: string;
  isFavorite?: boolean;
}

export interface FilterState {
  model: string;
  priceRange: string;
  color: string;
  status: string;
  sortBy: string;
  searchQuery: string;
}

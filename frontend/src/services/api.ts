import { Vehicle } from '../types/vehicle';
import { MOCK_VEHICLES } from '../data/vehicles';

const API_GATEWAY_URL = 'http://localhost:5500';
const DIRECT_SALES_URL = 'http://localhost:5002';

export async function fetchVehiclesFromApi(statusFilter?: string): Promise<Vehicle[]> {
  const queryParam = statusFilter ? `?status=${statusFilter}` : '';

  try {
    let res = await fetch(`${API_GATEWAY_URL}/api/sales/cars${queryParam}`);
    if (!res.ok) {
      res = await fetch(`${DIRECT_SALES_URL}/api/sales/cars${queryParam}`);
    }

    const json = await res.json();
    const carList: any[] = Array.isArray(json) ? json : (json.data || []);

    if (!carList || carList.length === 0) {
      return MOCK_VEHICLES;
    }

    const fetchedVehicles: Vehicle[] = carList.map((item: any) => ({
      id: Number(item.carID || item.id),
      brand: item.model ? item.model.split(' ')[0] : 'AutoHub',
      model: item.model,
      vin: item.serialNumber || item.vin || `VIN-${item.carID}`,
      year: item.year || 2023,
      color: item.colour || item.color || 'Đen Sapphire',
      price: Number(item.price || 1500000000),
      status: item.status || item.Status || 'Available',
      imageUrl: item.imageUrl || 'https://images.unsplash.com/photo-1555215695-3004980ad54e?auto=format&fit=crop&w=800&q=80',
      location: 'Showroom AutoHub'
    }));

    // Neu API tra ve danh sach nho hon 6 (do DB dang seed), hop nhat voi danh sach day du
    if (fetchedVehicles.length < MOCK_VEHICLES.length && !statusFilter) {
      const existingIds = new Set(fetchedVehicles.map(v => v.id));
      const remainingMock = MOCK_VEHICLES.filter(m => !existingIds.has(m.id));
      return [...fetchedVehicles, ...remainingMock];
    }

    return fetchedVehicles;
  } catch (err) {
    console.warn('[API Client] Gateway API connection fallback:', err);
    return MOCK_VEHICLES;
  }
}

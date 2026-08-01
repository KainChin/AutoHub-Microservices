import { Vehicle } from '../types/vehicle';

const API_GATEWAY_URL = 'http://localhost:5500';
const DIRECT_SALES_URL = 'http://localhost:5002';

export async function fetchVehiclesFromApi(statusFilter?: string): Promise<Vehicle[]> {
  const queryParam = statusFilter ? `?status=${statusFilter}` : '';
  
  try {
    // 1. Thu nghiem qua API Gateway (:5500)
    let res = await fetch(`${API_GATEWAY_URL}/api/sales/cars${queryParam}`);
    
    // 2. Neu Gateway chua len, goi truc tiep sang Sales Service (:5002)
    if (!res.ok) {
      res = await fetch(`${DIRECT_SALES_URL}/api/sales/cars${queryParam}`);
    }
    
    const data = await res.json();
    const carList = Array.isArray(data) ? data : data.data || [];

    // Map DB fields sang Frontend Vehicle Interface
    return carList.map((item: any) => ({
      id: Number(item.carID || item.id),
      brand: item.model ? item.model.split(' ')[0] : 'AutoHub',
      model: item.model,
      vin: item.serialNumber || item.vin || `VIN-${item.carID}`,
      year: item.year || 2023,
      color: item.colour || item.color || 'Đen Sapphire',
      price: item.price || 1500000000,
      status: item.status || item.Status || 'Available',
      imageUrl: item.imageUrl || 'https://images.unsplash.com/photo-1555215695-3004980ad54e?auto=format&fit=crop&w=800&q=80',
      location: 'Showroom AutoHub'
    }));
  } catch (err) {
    console.warn('[API Client] Server offline, using fallback records:', err);
    throw err;
  }
}

import React from 'react';
import { Vehicle } from '../../types/vehicle';
import { VehicleCard } from './VehicleCard';

interface VehicleGridProps {
  vehicles: Vehicle[];
}

export const VehicleGrid: React.FC<VehicleGridProps> = ({ vehicles }) => {
  return (
    <div className="flex flex-col gap-6">
      {/* Section Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <span>Tất Cả Xe</span>
            <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-red-950/80 text-red-400 border border-red-800/40">
              {vehicles.length}
            </span>
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Chỉ hiển thị xe đang có sẵn (Available)
          </p>
        </div>

        {/* Sort Select */}
        <select className="bg-slate-950/80 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-slate-300 focus:outline-none focus:border-red-600 cursor-pointer">
          <option value="newest">Sắp xếp: Mới nhất</option>
          <option value="price-low">Giá: Thấp đến Cao</option>
          <option value="price-high">Giá: Cao đến Thấp</option>
        </select>
      </div>

      {/* Grid List */}
      {vehicles.length === 0 ? (
        <div className="glass-panel p-12 text-center text-slate-400 text-sm rounded-2xl">
          Không tìm thấy chiếc xe nào phù hợp với bộ lọc.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {vehicles.map((vehicle) => (
            <VehicleCard key={vehicle.id} vehicle={vehicle} />
          ))}
        </div>
      )}
    </div>
  );
};

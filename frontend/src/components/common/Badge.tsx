import React from 'react';
import { VehicleStatus } from '../../types/vehicle';

interface BadgeProps {
  status: VehicleStatus;
}

export const Badge: React.FC<BadgeProps> = ({ status }) => {
  const statusStyles: Record<VehicleStatus, string> = {
    Available: 'bg-emerald-950/80 text-emerald-400 border-emerald-500/30',
    Sold: 'bg-amber-950/80 text-amber-400 border-amber-500/30',
    InService: 'bg-blue-950/80 text-blue-400 border-blue-500/30'
  };

  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-medium border ${statusStyles[status]}`}>
      <span className="w-1.5 h-1.5 rounded-full bg-current"></span>
      {status}
    </span>
  );
};

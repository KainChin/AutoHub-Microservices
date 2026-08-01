import React from 'react';
import { Calendar, MapPin } from 'lucide-react';
import { formatPrice } from '../../utils/formatPrice';

interface VehicleInfoProps {
  model: string;
  vin: string;
  year: number;
  color: string;
  price: number;
}

export const VehicleInfo: React.FC<VehicleInfoProps> = ({
  model,
  vin,
  year,
  color,
  price
}) => {
  return (
    <div className="flex flex-col gap-2 p-5">
      <h3 className="font-bold text-base text-white group-hover:text-red-500 transition-colors">
        {model}
      </h3>

      <div className="text-[11px] text-slate-400 font-mono tracking-wide">
        VIN: {vin}
      </div>

      <div className="flex items-center gap-4 text-xs text-slate-400 my-1">
        <div className="flex items-center gap-1.5">
          <Calendar className="w-3.5 h-3.5 text-slate-500" />
          <span>{year}</span>
        </div>
        <div className="flex items-center gap-1.5">
          <MapPin className="w-3.5 h-3.5 text-slate-500" />
          <span>{color}</span>
        </div>
      </div>

      <div className="text-lg font-black text-red-500 pt-1">
        {formatPrice(price)}
      </div>
    </div>
  );
};

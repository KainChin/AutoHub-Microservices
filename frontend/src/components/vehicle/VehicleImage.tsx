import React from 'react';
import { Heart } from 'lucide-react';
import { Badge } from '../common/Badge';
import { VehicleStatus } from '../../types/vehicle';

interface VehicleImageProps {
  imageUrl: string;
  model: string;
  status: VehicleStatus;
  isFavorite?: boolean;
  onFavoriteToggle?: () => void;
}

export const VehicleImage: React.FC<VehicleImageProps> = ({
  imageUrl,
  model,
  status,
  isFavorite = false,
  onFavoriteToggle
}) => {
  return (
    <div className="relative aspect-[16/10] overflow-hidden bg-slate-900">
      <img
        src={imageUrl}
        alt={model}
        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
      />
      <div className="absolute top-3 right-3 flex items-center gap-2">
        <button
          onClick={onFavoriteToggle}
          className="p-2 rounded-full bg-slate-950/60 backdrop-blur-md text-slate-300 hover:text-red-500 transition-colors"
        >
          <Heart className={`w-4 h-4 ${isFavorite ? 'fill-red-500 text-red-500' : ''}`} />
        </button>
      </div>

      <div className="absolute bottom-3 left-3">
        <Badge status={status} />
      </div>
    </div>
  );
};

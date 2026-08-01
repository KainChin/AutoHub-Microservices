import React from 'react';
import { Vehicle } from '../../types/vehicle';
import { Card } from '../common/Card';
import { VehicleImage } from './VehicleImage';
import { VehicleInfo } from './VehicleInfo';
import { VehicleActions } from './VehicleActions';

interface VehicleCardProps {
  vehicle: Vehicle;
}

export const VehicleCard: React.FC<VehicleCardProps> = ({ vehicle }) => {
  return (
    <Card className="group flex flex-col justify-between">
      <div>
        <VehicleImage
          imageUrl={vehicle.imageUrl}
          model={vehicle.model}
          status={vehicle.status}
          isFavorite={vehicle.isFavorite}
        />
        <VehicleInfo
          model={vehicle.model}
          vin={vehicle.vin}
          year={vehicle.year}
          color={vehicle.color}
          price={vehicle.price}
        />
      </div>
      <VehicleActions />
    </Card>
  );
};

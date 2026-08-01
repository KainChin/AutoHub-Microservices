import React from 'react';
import { Button } from '../common/Button';

interface VehicleActionsProps {
  onDetailClick?: () => void;
  onContactClick?: () => void;
}

export const VehicleActions: React.FC<VehicleActionsProps> = ({
  onDetailClick,
  onContactClick
}) => {
  return (
    <div className="grid grid-cols-2 gap-2.5 px-5 pb-5 pt-1">
      <Button
        variant="outline"
        size="sm"
        onClick={onDetailClick}
        className="w-full text-xs rounded-xl bg-slate-900/40 hover:bg-slate-800"
      >
        Xem Chi Tiết
      </Button>

      <Button
        variant="primary"
        size="sm"
        onClick={onContactClick}
        className="w-full text-xs rounded-xl"
      >
        Liên Hệ Tư Vấn
      </Button>
    </div>
  );
};

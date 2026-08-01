import React from 'react';
import { ArrowRight, Calendar } from 'lucide-react';
import { Button } from '../common/Button';

export const HeroButtons: React.FC = () => {
  return (
    <div className="flex flex-wrap gap-4">
      <Button variant="primary" size="lg" className="rounded-full gap-2">
        <span>Khám Phá Showroom</span>
        <ArrowRight className="w-4 h-4" />
      </Button>

      <Button variant="outline" size="lg" className="rounded-full gap-2 border-slate-700 bg-slate-900/60 backdrop-blur-md hover:bg-slate-800">
        <span>Đặt Lịch Bảo Dưỡng</span>
        <Calendar className="w-4 h-4 text-slate-400" />
      </Button>
    </div>
  );
};

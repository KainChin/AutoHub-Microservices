import React from 'react';
import { Filter, RotateCcw } from 'lucide-react';
import { ModelSelect } from './ModelSelect';
import { PriceSelect } from './PriceSelect';
import { ColorSelect } from './ColorSelect';
import { StatusSelect } from './StatusSelect';
import { FilterState } from '../../types/vehicle';

interface FilterBarProps {
  filters: FilterState;
  onFilterChange: (key: keyof FilterState, value: string) => void;
  onReset: () => void;
}

export const FilterBar: React.FC<FilterBarProps> = ({
  filters,
  onFilterChange,
  onReset,
}) => {
  return (
    <div className="glass-panel rounded-2xl p-6 mb-8">
      {/* Title & Reset button */}
      <div className="flex items-center justify-between mb-5 border-b border-slate-800/60 pb-3">
        <div className="flex items-center gap-2 text-white font-bold text-base">
          <Filter className="w-4 h-4 text-red-500" />
          <span>Tìm Kiếm Xe Của Bạn</span>
        </div>
        <button
          onClick={onReset}
          className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-white transition-colors"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Xóa bộ lọc</span>
        </button>
      </div>

      {/* Select Controls */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <ModelSelect value={filters.model} onChange={(val) => onFilterChange('model', val)} />
        <PriceSelect value={filters.priceRange} onChange={(val) => onFilterChange('priceRange', val)} />
        <ColorSelect value={filters.color} onChange={(val) => onFilterChange('color', val)} />
        <StatusSelect value={filters.status} onChange={(val) => onFilterChange('status', val)} />
      </div>
    </div>
  );
};

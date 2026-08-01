import React from 'react';

interface PriceSelectProps {
  value: string;
  onChange: (value: string) => void;
}

export const PriceSelect: React.FC<PriceSelectProps> = ({ value, onChange }) => {
  return (
    <div className="flex flex-col gap-1.5 flex-1 min-w-[160px]">
      <label className="text-xs text-slate-400 font-medium">Mức giá</label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="bg-slate-950/80 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-slate-200 focus:outline-none focus:border-red-600 cursor-pointer"
      >
        <option value="">Tất cả mức giá</option>
        <option value="under1b">Dưới 1 tỷ</option>
        <option value="1b-2b">1 tỷ - 2 tỷ</option>
        <option value="above2b">Trên 2 tỷ</option>
      </select>
    </div>
  );
};

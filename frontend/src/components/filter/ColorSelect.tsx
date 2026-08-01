import React from 'react';

interface ColorSelectProps {
  value: string;
  onChange: (value: string) => void;
}

export const ColorSelect: React.FC<ColorSelectProps> = ({ value, onChange }) => {
  return (
    <div className="flex flex-col gap-1.5 flex-1 min-w-[160px]">
      <label className="text-xs text-slate-400 font-medium">Màu sắc</label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="bg-slate-950/80 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-slate-200 focus:outline-none focus:border-red-600 cursor-pointer"
      >
        <option value="">Tất cả màu sắc</option>
        <option value="Đen">Đen</option>
        <option value="Trắng">Trắng</option>
        <option value="Xám">Xám</option>
        <option value="Bạc">Bạc</option>
        <option value="Đỏ">Đỏ</option>
      </select>
    </div>
  );
};

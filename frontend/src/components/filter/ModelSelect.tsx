import React from 'react';

interface ModelSelectProps {
  value: string;
  onChange: (value: string) => void;
}

export const ModelSelect: React.FC<ModelSelectProps> = ({ value, onChange }) => {
  return (
    <div className="flex flex-col gap-1.5 flex-1 min-w-[160px]">
      <label className="text-xs text-slate-400 font-medium">Model / Thương Hiệu</label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="bg-slate-950/80 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-slate-200 focus:outline-none focus:border-red-600 cursor-pointer"
      >
        <option value="">Tất cả thương hiệu</option>
        <option value="VinFast">VinFast</option>
        <option value="BMW">BMW</option>
        <option value="Toyota">Toyota</option>
        <option value="Honda">Honda</option>
        <option value="Mercedes-Benz">Mercedes-Benz</option>
        <option value="Lexus">Lexus</option>
        <option value="Mazda">Mazda</option>
        <option value="Hyundai">Hyundai</option>
        <option value="Kia">Kia</option>
        <option value="Ford">Ford</option>
        <option value="Mitsubishi">Mitsubishi</option>
      </select>
    </div>
  );
};

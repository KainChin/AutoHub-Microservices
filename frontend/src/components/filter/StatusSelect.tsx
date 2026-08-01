import React from 'react';

interface StatusSelectProps {
  value: string;
  onChange: (value: string) => void;
}

export const StatusSelect: React.FC<StatusSelectProps> = ({ value, onChange }) => {
  return (
    <div className="flex flex-col gap-1.5 flex-1 min-w-[160px]">
      <label className="text-xs text-slate-400 font-medium">Trạng thái</label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="bg-slate-950/80 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-emerald-400 font-medium focus:outline-none focus:border-red-600 cursor-pointer"
      >
        <option value="Available">● Available</option>
        <option value="Sold">● Sold</option>
        <option value="InService">● InService</option>
        <option value="">Tất cả trạng thái</option>
      </select>
    </div>
  );
};

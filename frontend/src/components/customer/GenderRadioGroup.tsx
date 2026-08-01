import React from 'react';
import { Gender } from '../../types/customer';

interface GenderRadioGroupProps {
  value: Gender;
  onChange: (value: Gender) => void;
  error?: string;
}

export const GenderRadioGroup: React.FC<GenderRadioGroupProps> = ({
  value,
  onChange,
  error
}) => {
  const options: Gender[] = ['Nam', 'Nữ'];

  return (
    <div className="flex flex-col gap-1.5 w-full">
      <label className="text-xs font-semibold text-slate-200 flex items-center gap-1">
        <span>3. Giới Tính</span>
        <span className="text-red-500">*</span>
      </label>

      <div className="grid grid-cols-2 gap-4">
        {options.map((option) => {
          const isSelected = value === option;
          return (
            <button
              key={option}
              type="button"
              onClick={() => onChange(option)}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl border text-sm font-medium transition-all cursor-pointer ${
                isSelected
                  ? 'bg-[#111625]/90 border-cyan-400/80 text-white shadow-lg shadow-purple-950/40 ring-1 ring-cyan-400/50'
                  : 'bg-[#111625]/60 border-slate-800 text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
              }`}
            >
              <div
                className={`w-4 h-4 rounded-full border flex items-center justify-center transition-all ${
                  isSelected
                    ? 'border-cyan-400 bg-cyan-400/20'
                    : 'border-slate-600'
                }`}
              >
                {isSelected && (
                  <div className="w-2 h-2 rounded-full bg-cyan-400" />
                )}
              </div>
              <span>{option}</span>
            </button>
          );
        })}
      </div>

      {error && <span className="text-[11px] text-red-400 font-medium">{error}</span>}
    </div>
  );
};

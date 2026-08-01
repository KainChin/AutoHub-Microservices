import React from 'react';
import { CheckCircle2, X } from 'lucide-react';

interface SuccessToastProps {
  show: boolean;
  onClose: () => void;
}

export const SuccessToast: React.FC<SuccessToastProps> = ({ show, onClose }) => {
  if (!show) return null;

  return (
    <div className="fixed top-6 right-6 z-50 flex items-start gap-3 bg-[#11241a]/95 border border-emerald-500/50 text-white px-5 py-4 rounded-2xl shadow-2xl backdrop-blur-xl animate-in fade-in slide-in-from-top-4 duration-300 max-w-sm">
      <div className="p-1 rounded-full bg-emerald-500/20 text-emerald-400 shrink-0">
        <CheckCircle2 className="w-5 h-5 fill-emerald-500 text-[#11241a]" />
      </div>

      <div className="flex flex-col gap-0.5 flex-1 pr-2">
        <h4 className="text-sm font-bold text-emerald-400">Thành công!</h4>
        <p className="text-xs text-slate-200">Lưu hồ sơ khách hàng thành công.</p>
      </div>

      <button
        onClick={onClose}
        className="text-slate-400 hover:text-white p-1 rounded-lg transition-colors shrink-0"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
};

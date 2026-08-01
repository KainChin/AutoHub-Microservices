import React, { useEffect } from 'react';
import { CheckCircle2, X } from 'lucide-react';

interface SuccessToastProps {
  show: boolean;
  onClose: () => void;
}

export const SuccessToast: React.FC<SuccessToastProps> = ({ show, onClose }) => {
  // Auto-close after 3 seconds
  useEffect(() => {
    if (!show) return;
    const timer = setTimeout(() => {
      onClose();
    }, 3000);
    return () => clearTimeout(timer);
  }, [show, onClose]);

  if (!show) return null;

  return (
    <div className="fixed top-6 right-6 z-50 flex items-start gap-3 bg-[#0d2218]/95 border border-emerald-500/60 text-white px-5 py-4 rounded-2xl shadow-2xl shadow-emerald-950/60 backdrop-blur-xl animate-in fade-in slide-in-from-top-6 duration-300 max-w-sm overflow-hidden group">
      {/* Icon with Wave Pulse Ripple Animation */}
      <div className="relative flex items-center justify-center shrink-0">
        <span className="absolute w-8 h-8 rounded-full bg-emerald-400/30 animate-ping" />
        <div className="p-1.5 rounded-full bg-emerald-500/20 text-emerald-400 relative z-10">
          <CheckCircle2 className="w-5 h-5 fill-emerald-500 text-[#0d2218]" />
        </div>
      </div>

      {/* Content */}
      <div className="flex flex-col gap-0.5 flex-1 pr-2">
        <h4 className="text-sm font-bold text-emerald-400 tracking-wide">Thành công!</h4>
        <p className="text-xs text-slate-200">Lưu hồ sơ khách hàng thành công.</p>
      </div>

      <button
        onClick={onClose}
        className="text-slate-400 hover:text-white p-1 rounded-lg transition-colors shrink-0 cursor-pointer"
      >
        <X className="w-4 h-4" />
      </button>

      {/* Wave Progress Line (3 seconds animation) */}
      <div className="absolute bottom-0 left-0 h-1 bg-gradient-to-r from-emerald-500 via-teal-300 to-cyan-400 w-full animate-[waveProgress_3s_linear_forwards]" />
    </div>
  );
};

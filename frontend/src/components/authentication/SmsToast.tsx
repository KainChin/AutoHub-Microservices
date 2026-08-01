import React, { useEffect } from 'react';
import { MessageSquare, X } from 'lucide-react';

interface SmsToastProps {
  show: boolean;
  phone: string;
  otpCode: string;
  onClose: () => void;
}

export const SmsToast: React.FC<SmsToastProps> = ({ show, phone, otpCode, onClose }) => {
  useEffect(() => {
    if (!show) return;
    const timer = setTimeout(() => {
      onClose();
    }, 10000); // 10 seconds for user to easily read the OTP code
    return () => clearTimeout(timer);
  }, [show, onClose]);

  if (!show) return null;

  return (
    <div className="fixed top-6 left-1/2 -translate-x-1/2 z-50 flex items-start gap-3.5 bg-[#0f172a]/95 border-2 border-purple-500/80 text-white px-6 py-4 rounded-2xl shadow-2xl shadow-purple-950/80 backdrop-blur-xl animate-in fade-in slide-in-from-top-6 duration-300 max-w-md">
      <div className="p-2 rounded-xl bg-purple-500/20 text-purple-400 shrink-0 mt-0.5">
        <MessageSquare className="w-5 h-5" />
      </div>

      <div className="flex flex-col gap-1 flex-1">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-purple-400 uppercase tracking-wider">
            📩 SMS AutoHub OTP
          </span>
          <span className="text-[10px] text-slate-400">Vừa xong</span>
        </div>

        <p className="text-xs text-slate-200 leading-relaxed">
          Mã xác thực OTP gửi tới số <strong className="text-white">{phone}</strong> là:{' '}
          <span className="inline-block bg-purple-950 px-2 py-0.5 rounded text-sm font-black text-cyan-300 tracking-widest border border-purple-500/50">
            {otpCode}
          </span>
        </p>

        <span className="text-[10px] text-slate-400">
          Vui lòng nhập mã 6 chữ số này vào ô bên dưới để tiếp tục.
        </span>
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

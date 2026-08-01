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
    }, 12000); // 12 seconds for clear visibility
    return () => clearTimeout(timer);
  }, [show, onClose]);

  if (!show) return null;

  return (
    <div className="fixed top-8 left-1/2 -translate-x-1/2 z-[100] flex items-start gap-4 bg-[#090d16]/98 border-2 border-purple-500/80 text-white px-6 py-4 rounded-2xl shadow-2xl shadow-purple-950/90 backdrop-blur-2xl animate-in fade-in slide-in-from-top-6 duration-300 max-w-md border-l-4 border-l-cyan-400">
      <div className="p-2.5 rounded-xl bg-purple-500/20 text-purple-300 shrink-0 mt-0.5 animate-pulse">
        <MessageSquare className="w-5 h-5" />
      </div>

      <div className="flex flex-col gap-1 flex-1">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-cyan-400 uppercase tracking-wider">
            📩 SMS Tổng Đài AutoHub (OTP Sim)
          </span>
          <span className="text-[10px] text-slate-400 font-mono">Vừa xong</span>
        </div>

        <p className="text-xs text-slate-200 leading-relaxed">
          Mã xác thực OTP gửi tới số điện thoại <strong className="text-white">{phone}</strong> là:{' '}
          <span className="inline-block bg-purple-950/90 px-2.5 py-1 rounded-lg text-base font-black text-cyan-300 tracking-widest border border-purple-500/60 shadow-inner">
            {otpCode}
          </span>
        </p>

        <span className="text-[10px] text-slate-400">
          Vui lòng nhập mã 6 chữ số trên vào các ô vuông bên dưới để tiếp tục.
        </span>
      </div>

      <button
        onClick={onClose}
        className="text-slate-400 hover:text-white p-1.5 rounded-lg transition-colors shrink-0 cursor-pointer"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
};

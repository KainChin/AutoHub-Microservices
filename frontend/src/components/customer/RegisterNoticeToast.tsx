import React from 'react';
import { Info, X } from 'lucide-react';

interface RegisterNoticeToastProps {
  show: boolean;
  onClose: () => void;
}

export const RegisterNoticeToast: React.FC<RegisterNoticeToastProps> = ({ show, onClose }) => {
  if (!show) return null;

  return (
    <div className="fixed top-6 left-1/2 -translate-x-1/2 z-50 flex items-center gap-3 bg-[#111e2e]/95 border border-cyan-500/50 text-white px-5 py-3.5 rounded-2xl shadow-2xl backdrop-blur-xl animate-in fade-in slide-in-from-top-4 duration-300 max-w-lg">
      <div className="p-1 rounded-full bg-cyan-500/20 text-cyan-400 shrink-0">
        <Info className="w-5 h-5" />
      </div>

      <div className="flex flex-col gap-0.5 flex-1 pr-2">
        <h4 className="text-xs font-bold text-cyan-400">Đăng ký tài khoản thành công!</h4>
        <p className="text-[11px] text-slate-200">
          Vui lòng bổ sung thêm thông tin hồ sơ bên dưới để AutoHub hỗ trợ bạn tốt nhất.
        </p>
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

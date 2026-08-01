import React from 'react';
import { X } from 'lucide-react';

interface CustomerProfileHeaderProps {
  onClose: () => void;
}

export const CustomerProfileHeader: React.FC<CustomerProfileHeaderProps> = ({ onClose }) => {
  return (
    <div className="flex items-start justify-between mb-6">
      <div className="flex flex-col gap-1">
        <h2 className="text-xl font-bold text-white tracking-tight">
          Đăng Ký Hồ Sơ Khách Hàng
        </h2>
        <p className="text-xs text-slate-400 font-medium">
          Vui lòng nhập đầy đủ thông tin để AutoHub có thể hỗ trợ bạn tốt hơn.
        </p>
      </div>

      <button
        onClick={onClose}
        aria-label="Close Modal"
        className="p-2 rounded-full bg-slate-900/80 border border-slate-800 text-slate-400 hover:text-white hover:bg-red-600/80 hover:border-red-500/50 transition-all duration-300 transform hover:rotate-90"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
};

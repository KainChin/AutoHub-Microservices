import React from 'react';
import {
  User as UserIcon,
  Heart,
  Car,
  Wrench,
  Calendar,
  Bell,
  Settings,
  LogOut
} from 'lucide-react';
import { User } from '../../types/user';

interface UserDropdownProps {
  user: User;
  isOpen: boolean;
  onClose: () => void;
  onLogout: () => void;
  onOpenProfile: () => void;
}

export const UserDropdown: React.FC<UserDropdownProps> = ({
  user,
  isOpen,
  onClose,
  onLogout,
  onOpenProfile
}) => {
  if (!isOpen) return null;

  const items = [
    { label: 'Hồ sơ cá nhân', icon: UserIcon, action: onOpenProfile },
    { label: 'Xe yêu thích', icon: Heart, action: onClose },
    { label: 'Lịch sử mua xe', icon: Car, action: onClose },
    { label: 'Lịch bảo dưỡng', icon: Wrench, action: onClose },
    { label: 'Lịch hẹn', icon: Calendar, action: onClose },
    { label: 'Thông báo', icon: Bell, action: onClose },
    { label: 'Cài đặt', icon: Settings, action: onClose }
  ];

  return (
    <div className="absolute right-0 top-12 z-50 w-56 bg-[#111625]/95 border border-slate-800 rounded-2xl shadow-2xl p-2 text-slate-200 backdrop-blur-xl animate-in fade-in zoom-in-95">
      {/* Header Info */}
      <div className="px-3 py-2.5 border-b border-slate-800/80 mb-1">
        <div className="text-xs font-bold text-white truncate">{user.fullName}</div>
        <div className="text-[11px] text-slate-400 font-mono">{user.phone}</div>
      </div>

      {/* Menu Options */}
      <div className="flex flex-col gap-0.5">
        {items.map((item) => {
          const Icon = item.icon;
          return (
            <button
              key={item.label}
              onClick={item.action}
              className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium text-slate-300 hover:text-white hover:bg-slate-800/80 transition-colors w-full text-left cursor-pointer"
            >
              <Icon className="w-4 h-4 text-slate-400" />
              <span>{item.label}</span>
            </button>
          );
        })}
      </div>

      {/* Logout Option */}
      <div className="pt-1 mt-1 border-t border-slate-800/80">
        <button
          onClick={onLogout}
          className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium text-red-400 hover:text-red-300 hover:bg-red-950/30 transition-colors w-full text-left cursor-pointer"
        >
          <LogOut className="w-4 h-4 text-red-400" />
          <span>Đăng xuất</span>
        </button>
      </div>
    </div>
  );
};

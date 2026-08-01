import React from 'react';
import { Search, Heart, ShoppingBag, User } from 'lucide-react';

interface HeaderProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onOpenProfileModal?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  searchQuery,
  onSearchChange,
  onOpenProfileModal
}) => {
  return (
    <header className="sticky top-0 z-40 glass-panel border-b border-slate-800/80 px-6 py-4 mb-6">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        {/* Logo */}
        <div className="flex items-center gap-3">
          <div className="flex flex-col">
            <span className="text-xl font-black tracking-wider text-white flex items-center gap-1">
              <span className="text-red-600">Auto</span>Hub
            </span>
            <span className="text-[9px] tracking-widest text-slate-400 font-semibold uppercase">
              Customer Portal
            </span>
          </div>
        </div>

        {/* Search Input */}
        <div className="relative flex-1 max-w-md hidden md:block">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Tìm kiếm xe, model, thương hiệu..."
            className="w-full bg-slate-950/60 border border-slate-800 rounded-full pl-10 pr-4 py-2 text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-red-600/60 transition-colors"
          />
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-4">
          <button className="relative p-2 text-slate-300 hover:text-white hover:bg-slate-800/50 rounded-full transition-colors">
            <Heart className="w-5 h-5" />
            <span className="absolute top-1 right-1 w-4 h-4 bg-red-600 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
              3
            </span>
          </button>

          <button className="relative p-2 text-slate-300 hover:text-white hover:bg-slate-800/50 rounded-full transition-colors">
            <ShoppingBag className="w-5 h-5" />
            <span className="absolute top-1 right-1 w-4 h-4 bg-red-600 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
              2
            </span>
          </button>

          <button
            onClick={onOpenProfileModal}
            className="flex items-center gap-2 bg-slate-900 border border-slate-700/80 hover:bg-slate-800 text-slate-200 px-4 py-2 rounded-full text-sm font-medium transition-colors cursor-pointer"
          >
            <User className="w-4 h-4 text-slate-400" />
            <span>Đăng Nhập / Hồ Sơ</span>
          </button>
        </div>
      </div>
    </header>
  );
};

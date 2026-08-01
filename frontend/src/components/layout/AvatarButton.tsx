import React from 'react';
import { User as UserIcon, ChevronDown } from 'lucide-react';
import { User } from '../../types/user';

interface AvatarButtonProps {
  user: User;
  onClick: () => void;
}

export const AvatarButton: React.FC<AvatarButtonProps> = ({ user, onClick }) => {
  return (
    <button
      onClick={onClick}
      className="flex items-center gap-2.5 bg-slate-900/90 border border-slate-700/80 hover:border-slate-500 text-slate-100 px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer shadow-md"
    >
      {user.avatarUrl ? (
        <img
          src={user.avatarUrl}
          alt={user.fullName}
          className="w-6 h-6 rounded-full object-cover border border-purple-500/50"
        />
      ) : (
        <div className="w-6 h-6 rounded-full bg-purple-600/30 text-purple-400 flex items-center justify-center font-bold">
          <UserIcon className="w-3.5 h-3.5" />
        </div>
      )}

      <span className="max-w-[120px] truncate">{user.fullName}</span>
      <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
    </button>
  );
};

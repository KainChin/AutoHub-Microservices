import React from 'react';

interface GlassButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary';
  children: React.ReactNode;
}

export const GlassButton: React.FC<GlassButtonProps> = ({
  variant = 'primary',
  children,
  className = '',
  disabled,
  ...props
}) => {
  if (variant === 'secondary') {
    return (
      <button
        className={`px-8 py-3 rounded-xl text-sm font-semibold text-slate-200 bg-[#111625]/80 border border-slate-800 hover:bg-slate-800/80 hover:border-slate-700 transition-all cursor-pointer ${className}`}
        disabled={disabled}
        {...props}
      >
        {children}
      </button>
    );
  }

  return (
    <button
      className={`relative group px-8 py-3 rounded-xl text-sm font-bold text-white bg-gradient-to-r from-purple-600 to-cyan-500 hover:from-purple-500 hover:to-cyan-400 shadow-lg shadow-purple-950/50 hover:shadow-cyan-500/25 transition-all duration-300 transform active:scale-95 disabled:opacity-50 cursor-pointer overflow-hidden ${className}`}
      disabled={disabled}
      {...props}
    >
      <span className="relative z-10 flex items-center justify-center gap-2">
        {children}
      </span>

      {/* Glow pulse animation */}
      <span className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
    </button>
  );
};

import React from 'react';
import { LucideIcon } from 'lucide-react';

interface GlassTextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string;
  required?: boolean;
  icon?: LucideIcon;
  error?: string;
}

export const GlassTextarea: React.FC<GlassTextareaProps> = ({
  label,
  required = false,
  icon: Icon,
  error,
  className = '',
  ...props
}) => {
  return (
    <div className="flex flex-col gap-1.5 w-full">
      <label className="text-xs font-semibold text-slate-200 flex items-center gap-1">
        <span>{label}</span>
        {required && <span className="text-red-500">*</span>}
      </label>

      <div className="relative">
        {Icon && (
          <Icon className="absolute left-3.5 top-3.5 w-4 h-4 text-slate-400 pointer-events-none" />
        )}
        <textarea
          className={`w-full bg-[#111625]/90 border rounded-xl py-3 text-sm text-slate-100 placeholder-slate-500 transition-all focus:outline-none resize-none ${
            Icon ? 'pl-10 pr-4' : 'px-4'
          } ${
            error
              ? 'border-red-500/80 focus:border-red-500 focus:ring-1 focus:ring-red-500/30'
              : 'border-slate-800 focus:border-purple-500/70 focus:ring-1 focus:ring-purple-500/20'
          } ${className}`}
          style={{ height: '120px' }}
          {...props}
        />
      </div>

      {error && <span className="text-[11px] text-red-400 font-medium">{error}</span>}
    </div>
  );
};

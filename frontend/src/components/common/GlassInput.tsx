import React, { useState } from 'react';
import { LucideIcon, Eye, EyeOff } from 'lucide-react';

interface GlassInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  required?: boolean;
  icon?: LucideIcon;
  error?: string;
  helperText?: string;
}

export const GlassInput: React.FC<GlassInputProps> = ({
  label,
  required = false,
  icon: Icon,
  type = 'text',
  error,
  helperText,
  className = '',
  ...props
}) => {
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const isPasswordType = type === 'password';
  const inputType = isPasswordType ? (showPassword ? 'text' : 'password') : type;

  return (
    <div className="flex flex-col gap-1.5 w-full">
      <label className="text-xs font-semibold text-slate-200 flex items-center gap-1">
        <span>{label}</span>
        {required && <span className="text-red-500">*</span>}
      </label>

      <div className="relative flex items-center">
        {Icon && (
          <Icon className="absolute left-3.5 w-4 h-4 text-slate-400 pointer-events-none" />
        )}
        <input
          type={inputType}
          className={`w-full bg-[#111625]/90 border rounded-xl py-3 text-sm text-slate-100 placeholder-slate-500 transition-all focus:outline-none ${
            Icon ? 'pl-10' : 'px-4'
          } ${isPasswordType ? 'pr-10' : 'pr-4'} ${
            error
              ? 'border-red-500/80 focus:border-red-500 focus:ring-1 focus:ring-red-500/30'
              : 'border-slate-800 focus:border-purple-500/70 focus:ring-1 focus:ring-purple-500/20'
          } ${className}`}
          {...props}
        />

        {isPasswordType && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3.5 text-slate-400 hover:text-slate-200 p-1 cursor-pointer transition-colors"
            tabIndex={-1}
          >
            {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>
        )}
      </div>

      {error ? (
        <span className="text-[11px] text-red-400 font-medium">{error}</span>
      ) : helperText ? (
        <span className="text-[11px] text-slate-500">{helperText}</span>
      ) : null}
    </div>
  );
};

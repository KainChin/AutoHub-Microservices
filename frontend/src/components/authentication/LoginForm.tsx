import React from 'react';
import { Phone, Lock } from 'lucide-react';
import { GlassInput } from '../common/GlassInput';
import { GlassButton } from '../common/GlassButton';
import { useLogin } from '../../hooks/useLogin';
import { User } from '../../types/user';

interface LoginFormProps {
  onLoginSuccess: (user: User) => void;
  onSwitchToRegister: () => void;
  onOpenForgotPassword: () => void;
}

export const LoginForm: React.FC<LoginFormProps> = ({
  onLoginSuccess,
  onSwitchToRegister,
  onOpenForgotPassword
}) => {
  const {
    phone,
    setPhone,
    password,
    setPassword,
    rememberMe,
    setRememberMe,
    errors,
    isSubmitting,
    handleSubmit
  } = useLogin(onLoginSuccess);

  return (
    <div className="flex flex-col gap-6">
      {/* Title & Subtitle */}
      <div className="text-center flex flex-col gap-1">
        <h2 className="text-2xl font-bold text-white tracking-tight">Đăng nhập</h2>
        <p className="text-xs text-slate-400">Chào mừng bạn quay trở lại AutoHub</p>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-5">
        <GlassInput
          label="Số điện thoại"
          required
          icon={Phone}
          type="tel"
          placeholder="Nhập số điện thoại"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          error={errors.phone}
        />

        <GlassInput
          label="Mật khẩu"
          required
          icon={Lock}
          type="password"
          placeholder="Nhập mật khẩu"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          error={errors.password}
        />

        <div className="flex items-center justify-between text-xs text-slate-300">
          <label className="flex items-center gap-2 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
              className="w-4 h-4 rounded border-slate-700 bg-slate-900 text-purple-600 focus:ring-0 cursor-pointer"
            />
            <span>Ghi nhớ đăng nhập</span>
          </label>

          <button
            type="button"
            onClick={onOpenForgotPassword}
            className="text-purple-400 hover:text-purple-300 hover:underline font-medium transition-colors cursor-pointer"
          >
            Quên mật khẩu?
          </button>
        </div>

        <GlassButton type="submit" variant="primary" disabled={isSubmitting} className="w-full py-3.5 mt-2 bg-gradient-to-r from-purple-600 to-blue-500">
          {isSubmitting ? 'Đang đăng nhập...' : 'Đăng nhập'}
        </GlassButton>

        <div className="text-center text-xs text-slate-400 pt-3 border-t border-slate-800/80">
          <span>Chưa có tài khoản? </span>
          <button
            type="button"
            onClick={onSwitchToRegister}
            className="text-purple-400 hover:text-purple-300 font-bold hover:underline transition-colors cursor-pointer"
          >
            Đăng ký ngay
          </button>
        </div>
      </form>
    </div>
  );
};

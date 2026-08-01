import React from 'react';
import { User as UserIcon, Phone, Lock } from 'lucide-react';
import { GlassInput } from '../common/GlassInput';
import { GlassButton } from '../common/GlassButton';
import { useRegister } from '../../hooks/useRegister';
import { User } from '../../types/user';

interface RegisterFormProps {
  onRegisterSuccess: (user: User) => void;
  onSwitchToLogin: () => void;
}

export const RegisterForm: React.FC<RegisterFormProps> = ({
  onRegisterSuccess,
  onSwitchToLogin
}) => {
  const {
    fullName,
    setFullName,
    phone,
    setPhone,
    password,
    setPassword,
    confirmPassword,
    setConfirmPassword,
    termsAccepted,
    setTermsAccepted,
    errors,
    isSubmitting,
    handleSubmit
  } = useRegister(onRegisterSuccess);

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4 pt-2">
      <GlassInput
        label="Họ và Tên"
        required
        icon={UserIcon}
        placeholder="Nhập họ và tên..."
        value={fullName}
        onChange={(e) => setFullName(e.target.value)}
        error={errors.fullName}
      />

      <GlassInput
        label="Số Điện Thoại"
        required
        icon={Phone}
        type="tel"
        placeholder="0901234567"
        value={phone}
        onChange={(e) => setPhone(e.target.value)}
        error={errors.phone}
      />

      <GlassInput
        label="Mật Khẩu"
        required
        icon={Lock}
        type="password"
        placeholder="Từ 8 ký tự trở lên..."
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        error={errors.password}
      />

      <GlassInput
        label="Xác Nhận Mật Khẩu"
        required
        icon={Lock}
        type="password"
        placeholder="Nhập lại mật khẩu..."
        value={confirmPassword}
        onChange={(e) => setConfirmPassword(e.target.value)}
        error={errors.confirmPassword}
      />

      <div className="flex flex-col gap-1 my-1">
        <label className="flex items-center gap-2 text-xs text-slate-300 cursor-pointer select-none">
          <input
            type="checkbox"
            checked={termsAccepted}
            onChange={(e) => setTermsAccepted(e.target.checked)}
            className="w-4 h-4 rounded border-slate-700 bg-slate-900 text-red-600 focus:ring-0 cursor-pointer"
          />
          <span>Tôi đồng ý với <a href="#" className="text-cyan-400 hover:underline">Điều khoản sử dụng</a></span>
        </label>
        {errors.termsAccepted && (
          <span className="text-[11px] text-red-400 font-medium">{errors.termsAccepted}</span>
        )}
      </div>

      <GlassButton type="submit" variant="primary" disabled={isSubmitting} className="w-full py-3.5 mt-1">
        {isSubmitting ? 'Đang tạo tài khoản...' : 'Tạo Tài Khoản'}
      </GlassButton>

      <div className="text-center text-xs text-slate-400 mt-2 pt-3 border-t border-slate-800/80">
        <span>Đã có tài khoản? </span>
        <button
          type="button"
          onClick={onSwitchToLogin}
          className="text-cyan-400 hover:text-cyan-300 font-bold hover:underline transition-colors"
        >
          Đăng nhập ngay
        </button>
      </div>
    </form>
  );
};

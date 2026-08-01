import React from 'react';
import { Lock } from 'lucide-react';
import { GlassInput } from '../common/GlassInput';
import { GlassButton } from '../common/GlassButton';
import { FormErrors } from '../../types/customer';

interface ResetPasswordProps {
  newPassword: string;
  confirmPassword: string;
  errors: FormErrors;
  isSubmitting: boolean;
  onNewPasswordChange: (val: string) => void;
  onConfirmPasswordChange: (val: string) => void;
  onSubmit: (e: React.FormEvent) => void;
}

export const ResetPassword: React.FC<ResetPasswordProps> = ({
  newPassword,
  confirmPassword,
  errors,
  isSubmitting,
  onNewPasswordChange,
  onConfirmPasswordChange,
  onSubmit
}) => {
  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-5 pt-2">
      <GlassInput
        label="Mật Khẩu Mới"
        required
        icon={Lock}
        type="password"
        placeholder="Từ 8 ký tự trở lên..."
        value={newPassword}
        onChange={(e) => onNewPasswordChange(e.target.value)}
        error={errors.password}
      />

      <GlassInput
        label="Xác Nhận Mật Khẩu Mới"
        required
        icon={Lock}
        type="password"
        placeholder="Nhập lại mật khẩu mới..."
        value={confirmPassword}
        onChange={(e) => onConfirmPasswordChange(e.target.value)}
        error={errors.confirmPassword}
      />

      <GlassButton type="submit" variant="primary" disabled={isSubmitting} className="w-full py-3.5 mt-2">
        {isSubmitting ? 'Đang cập nhật...' : 'Đặt Lại Mật Khẩu'}
      </GlassButton>
    </form>
  );
};

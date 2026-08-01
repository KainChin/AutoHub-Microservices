import React, { useState } from 'react';
import { Lock } from 'lucide-react';
import { GlassInput } from '../common/GlassInput';
import { GlassButton } from '../common/GlassButton';

interface ResetPasswordProps {
  onSuccess: () => void;
}

export const ResetPassword: React.FC<ResetPasswordProps> = ({ onSuccess }) => {
  const [newPassword, setNewPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPassword || newPassword.length < 8) {
      setError('Mật khẩu mới phải từ 8 ký tự.');
      return;
    }
    if (newPassword !== confirmPassword) {
      setError('Mật khẩu xác nhận không khớp.');
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      onSuccess();
    }, 600);
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="text-center flex flex-col gap-1">
        <h2 className="text-xl font-bold text-white">Đặt lại mật khẩu</h2>
        <p className="text-xs text-slate-400">Nhập mật khẩu mới của bạn</p>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-5">
        <GlassInput
          label="Mật khẩu mới"
          required
          icon={Lock}
          type="password"
          placeholder="Nhập mật khẩu mới"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
        />

        <GlassInput
          label="Xác nhận mật khẩu"
          required
          icon={Lock}
          type="password"
          placeholder="Nhập lại mật khẩu mới"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          error={error}
        />

        <GlassButton type="submit" variant="primary" disabled={isSubmitting} className="w-full py-3.5 bg-gradient-to-r from-purple-600 to-blue-500">
          {isSubmitting ? 'Đang đặt lại...' : 'Đặt lại mật khẩu'}
        </GlassButton>
      </form>
    </div>
  );
};

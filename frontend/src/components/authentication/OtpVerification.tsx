import React from 'react';
import { GlassInput } from '../common/GlassInput';
import { GlassButton } from '../common/GlassButton';
import { ShieldCheck } from 'lucide-react';

interface OtpVerificationProps {
  phone: string;
  otp: string;
  error?: string;
  isSubmitting: boolean;
  onOtpChange: (val: string) => void;
  onSubmit: (e: React.FormEvent) => void;
}

export const OtpVerification: React.FC<OtpVerificationProps> = ({
  phone,
  otp,
  error,
  isSubmitting,
  onOtpChange,
  onSubmit
}) => {
  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-5 pt-2">
      <div className="text-center text-xs text-slate-300 bg-slate-900/60 border border-slate-800 p-3.5 rounded-xl">
        Mã xác minh OTP (6 chữ số) đã được gửi đến số điện thoại <strong className="text-cyan-400">{phone}</strong>.
      </div>

      <GlassInput
        label="Mã Xác Minh OTP (6 Chữ Số)"
        required
        icon={ShieldCheck}
        type="text"
        maxLength={6}
        placeholder="123456"
        value={otp}
        onChange={(e) => onOtpChange(e.target.value)}
        error={error}
      />

      <GlassButton type="submit" variant="primary" disabled={isSubmitting} className="w-full py-3.5 mt-2">
        {isSubmitting ? 'Đang xác minh...' : 'Xác Nhận Mã OTP'}
      </GlassButton>
    </form>
  );
};

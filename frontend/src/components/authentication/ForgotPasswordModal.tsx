import React from 'react';
import { X, Phone, CheckCircle2 } from 'lucide-react';
import { GlassInput } from '../common/GlassInput';
import { GlassButton } from '../common/GlassButton';
import { OtpVerification } from './OtpVerification';
import { ResetPassword } from './ResetPassword';
import { useForgotPassword } from '../../hooks/useForgotPassword';

interface ForgotPasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ForgotPasswordModal: React.FC<ForgotPasswordModalProps> = ({
  isOpen,
  onClose
}) => {
  const {
    step,
    phone,
    setPhone,
    otp,
    setOtp,
    newPassword,
    setNewPassword,
    confirmPassword,
    setConfirmPassword,
    errors,
    isSubmitting,
    handleSendOtp,
    handleVerifyOtp,
    handleResetPassword
  } = useForgotPassword(onClose);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/65 backdrop-blur-[10px] flex items-center justify-center p-4">
      <div className="relative w-full max-w-[480px] bg-white/[0.08] backdrop-blur-[20px] border border-white/[0.12] rounded-[16px] p-8 shadow-2xl text-slate-100 animate-in fade-in zoom-in-95">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-bold text-white">Khôi Phục Mật Khẩu</h3>
          <button
            onClick={onClose}
            className="p-2 rounded-full bg-slate-900/80 border border-slate-800 text-slate-400 hover:text-white hover:bg-red-600/80 transition-all"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Step 1: Input Phone */}
        {step === 'PHONE' && (
          <form onSubmit={handleSendOtp} className="flex flex-col gap-5 pt-2">
            <GlassInput
              label="Số Điện Thoại Đã Đăng Ký"
              required
              icon={Phone}
              type="tel"
              placeholder="0901234567"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              error={errors.phone}
            />

            <GlassButton type="submit" variant="primary" disabled={isSubmitting} className="w-full py-3.5 mt-2">
              {isSubmitting ? 'Đang gửi...' : 'Gửi Mã OTP'}
            </GlassButton>
          </form>
        )}

        {/* Step 2: Input OTP */}
        {step === 'OTP' && (
          <OtpVerification
            phone={phone}
            otp={otp}
            error={errors.otp}
            isSubmitting={isSubmitting}
            onOtpChange={setOtp}
            onSubmit={handleVerifyOtp}
          />
        )}

        {/* Step 3: Reset Password */}
        {step === 'RESET' && (
          <ResetPassword
            newPassword={newPassword}
            confirmPassword={confirmPassword}
            errors={errors}
            isSubmitting={isSubmitting}
            onNewPasswordChange={setNewPassword}
            onConfirmPasswordChange={setConfirmPassword}
            onSubmit={handleResetPassword}
          />
        )}

        {/* Step 4: Success Message */}
        {step === 'SUCCESS' && (
          <div className="flex flex-col items-center justify-center py-6 text-center gap-3">
            <CheckCircle2 className="w-12 h-12 text-emerald-400 animate-bounce" />
            <h4 className="text-base font-bold text-white">Mật Khẩu Đã Độc Đặt Lại!</h4>
            <p className="text-xs text-slate-400">Bạn có thể dùng mật khẩu mới để đăng nhập ngay.</p>
          </div>
        )}
      </div>
    </div>
  );
};

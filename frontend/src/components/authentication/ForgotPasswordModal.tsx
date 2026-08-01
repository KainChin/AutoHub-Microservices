import React, { useState } from 'react';
import { X, Phone } from 'lucide-react';
import { GlassInput } from '../common/GlassInput';
import { GlassButton } from '../common/GlassButton';
import { OtpVerification } from './OtpVerification';
import { ResetPassword } from './ResetPassword';

interface ForgotPasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
  onBackToLogin: () => void;
}

export const ForgotPasswordModal: React.FC<ForgotPasswordModalProps> = ({
  isOpen,
  onClose,
  onBackToLogin
}) => {
  const [step, setStep] = useState<'PHONE' | 'OTP' | 'RESET'>('PHONE');
  const [phone, setPhone] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  if (!isOpen) return null;

  const handleSendOtp = (e: React.FormEvent) => {
    e.preventDefault();
    if (!phone || phone.length < 10) {
      setError('Vui lòng nhập số điện thoại Việt Nam.');
      return;
    }
    setError('');
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setStep('OTP');
    }, 500);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/65 backdrop-blur-[10px] flex items-center justify-center p-4">
      <div className="relative w-full max-w-[480px] bg-[#0c101d]/90 backdrop-blur-[20px] border border-white/[0.12] rounded-[16px] p-8 shadow-2xl text-slate-100 animate-in fade-in zoom-in-95">
        <button
          onClick={onClose}
          className="absolute top-6 right-6 p-2 rounded-full bg-slate-900/80 border border-slate-800 text-slate-400 hover:text-white hover:bg-red-600/80 transition-all cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Screen 3: Quên Mật Khẩu */}
        {step === 'PHONE' && (
          <div className="flex flex-col gap-6">
            <div className="text-center flex flex-col gap-1">
              <h2 className="text-2xl font-bold text-white">Quên mật khẩu</h2>
              <p className="text-xs text-slate-400">
                Nhập số điện thoại của bạn để nhận mã xác thực
              </p>
            </div>

            <form onSubmit={handleSendOtp} className="flex flex-col gap-5">
              <GlassInput
                label="Số điện thoại"
                required
                icon={Phone}
                type="tel"
                placeholder="Nhập số điện thoại"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                error={error}
              />

              <GlassButton type="submit" variant="primary" disabled={isSubmitting} className="w-full py-3.5 bg-gradient-to-r from-purple-600 to-blue-500">
                {isSubmitting ? 'Đang gửi mã...' : 'Gửi mã OTP'}
              </GlassButton>

              <div className="text-center pt-2">
                <button
                  type="button"
                  onClick={onBackToLogin}
                  className="text-xs text-slate-400 hover:text-white transition-colors cursor-pointer"
                >
                  ← Quay lại đăng nhập
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Screen 4 Part A: Xác Thực OTP */}
        {step === 'OTP' && (
          <OtpVerification
            phone={phone}
            isSubmitting={isSubmitting}
            onVerifySuccess={() => setStep('RESET')}
            onBack={() => setStep('PHONE')}
          />
        )}

        {/* Screen 4 Part B: Đặt Lại Mật Khẩu */}
        {step === 'RESET' && (
          <ResetPassword
            onSuccess={() => {
              onClose();
              onBackToLogin();
            }}
          />
        )}
      </div>
    </div>
  );
};

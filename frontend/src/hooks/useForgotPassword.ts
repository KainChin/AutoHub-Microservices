import { useState } from 'react';
import { FormErrors } from '../types/customer';
import { verifyOtp } from '../services/authService';

export type ForgotStep = 'PHONE' | 'OTP' | 'RESET' | 'SUCCESS';

export function useForgotPassword(onClose: () => void) {
  const [step, setStep] = useState<ForgotStep>('PHONE');
  const [phone, setPhone] = useState<string>('');
  const [otp, setOtp] = useState<string>('');
  const [newPassword, setNewPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!phone || phone.length < 10) {
      setErrors({ phone: 'Vui lòng nhập đúng số điện thoại Việt Nam.' });
      return;
    }
    setErrors({});
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setStep('OTP');
    }, 600);
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!otp || otp.length < 6) {
      setErrors({ otp: 'Vui lòng nhập đủ 6 chữ số mã OTP.' });
      return;
    }
    setIsSubmitting(true);
    const ok = await verifyOtp(otp);
    setIsSubmitting(false);

    if (ok) {
      setErrors({});
      setStep('RESET');
    } else {
      setErrors({ otp: 'Mã OTP không hợp lệ.' });
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPassword || newPassword.length < 8) {
      setErrors({ password: 'Mật khẩu mới phải từ 8 ký tự.' });
      return;
    }
    if (newPassword !== confirmPassword) {
      setErrors({ confirmPassword: 'Mật khẩu xác nhận không khớp.' });
      return;
    }
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setStep('SUCCESS');
      setTimeout(onClose, 2000);
    }, 600);
  };

  return {
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
  };
}

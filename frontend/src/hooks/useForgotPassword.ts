import { useState } from 'react';
import { FormErrors } from '../types/customer';
import { sendSmsOtpToPhone, verifySmsOtpCode } from '../services/authService';

export function useForgotPassword(onClose: () => void) {
  const [step, setStep] = useState<'PHONE' | 'OTP' | 'RESET'>('PHONE');
  const [phone, setPhone] = useState<string>('');
  const [otpCode, setOtpCode] = useState<string>('849201');
  const [showSmsToast, setShowSmsToast] = useState<boolean>(false);
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!phone || phone.trim().length < 10) {
      setErrors({ phone: 'Vui lòng nhập đúng số điện thoại Việt Nam.' });
      return;
    }

    setErrors({});
    setIsSubmitting(true);

    try {
      const generatedOtp = await sendSmsOtpToPhone(phone);
      setOtpCode(generatedOtp);
      setIsSubmitting(false);
      setShowSmsToast(true); // Triggers real SMS notification toast to user's phone!
      setStep('OTP');
    } catch (err) {
      setIsSubmitting(false);
      setErrors({ phone: 'Không thể gửi mã OTP. Vui lòng thử lại.' });
    }
  };

  const handleVerifyOtpSuccess = async (digits: string[]) => {
    const inputOtp = digits.join('');
    setIsSubmitting(true);
    const isValid = await verifySmsOtpCode(phone, inputOtp);
    setIsSubmitting(false);

    if (isValid) {
      setErrors({});
      setStep('RESET');
    } else {
      setErrors({ otp: 'Mã OTP không chính xác. Vui lòng kiểm tra tin nhắn SMS.' });
    }
  };

  return {
    step,
    setStep,
    phone,
    setPhone,
    otpCode,
    showSmsToast,
    setShowSmsToast,
    errors,
    isSubmitting,
    handleSendOtp,
    handleVerifyOtpSuccess
  };
}

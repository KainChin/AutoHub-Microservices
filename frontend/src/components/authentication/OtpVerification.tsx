import React, { useState, useEffect, useRef } from 'react';
import { GlassButton } from '../common/GlassButton';
import { MessageSquare } from 'lucide-react';

interface OtpVerificationProps {
  phone: string;
  defaultOtp?: string;
  error?: string;
  isSubmitting: boolean;
  onVerifySuccess: (digits: string[]) => void;
  onResendOtp?: () => void;
  onBack: () => void;
}

export const OtpVerification: React.FC<OtpVerificationProps> = ({
  phone,
  defaultOtp = '849201',
  error,
  isSubmitting,
  onVerifySuccess,
  onResendOtp,
  onBack
}) => {
  const [digits, setDigits] = useState<string[]>(['', '', '', '', '', '']);
  const [countdown, setCountdown] = useState<number>(45);
  const inputsRef = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    if (countdown <= 0) return;
    const timer = setInterval(() => setCountdown((c) => c - 1), 1000);
    return () => clearInterval(timer);
  }, [countdown]);

  const handleChange = (index: number, val: string) => {
    if (!/^\d*$/.test(val)) return;
    const nextDigits = [...digits];
    nextDigits[index] = val.slice(-1);
    setDigits(nextDigits);

    if (val && index < 5) {
      inputsRef.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !digits[index] && index > 0) {
      inputsRef.current[index - 1]?.focus();
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (digits.join('').length === 6) {
      onVerifySuccess(digits);
    }
  };

  const handleResendClick = () => {
    setCountdown(45);
    setDigits(['', '', '', '', '', '']);
    if (onResendOtp) onResendOtp();
  };

  return (
    <div className="flex flex-col gap-5">
      <div className="text-center flex flex-col gap-1">
        <h2 className="text-xl font-bold text-white">Xác thực OTP</h2>
        <p className="text-xs text-slate-400">
          Mã xác thực đã được gửi đến tin nhắn SMS <strong className="text-purple-400">{phone || '0901 234 567'}</strong>
        </p>
      </div>

      {/* Direct SMS Notice Badge inside Modal */}
      <div className="flex items-center gap-3 bg-purple-950/60 border border-purple-500/50 p-3 rounded-xl text-xs text-purple-200">
        <MessageSquare className="w-5 h-5 text-cyan-300 shrink-0 animate-pulse" />
        <div className="flex-1">
          <span className="font-semibold text-white">Tin nhắn SMS gửi tới {phone}:</span>
          <div className="mt-0.5 text-slate-300">
            Mã OTP xác thực của bạn là:{' '}
            <strong className="text-cyan-300 bg-purple-900/90 px-2 py-0.5 rounded font-mono text-sm tracking-widest border border-purple-400/40">
              {defaultOtp}
            </strong>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-5 items-center">
        {/* 6 Input Boxes */}
        <div className="flex gap-2.5 justify-center">
          {digits.map((digit, idx) => (
            <input
              key={idx}
              ref={(el) => (inputsRef.current[idx] = el)}
              type="text"
              inputMode="numeric"
              maxLength={1}
              value={digit}
              onChange={(e) => handleChange(idx, e.target.value)}
              onKeyDown={(e) => handleKeyDown(idx, e)}
              placeholder="•"
              className="w-11 h-12 text-center text-lg font-bold bg-[#111625]/90 border border-slate-700 focus:border-purple-500 rounded-xl text-white focus:outline-none focus:ring-1 focus:ring-purple-500/30 transition-all placeholder:text-slate-600"
            />
          ))}
        </div>

        {error && <span className="text-xs text-red-400 font-medium text-center">{error}</span>}

        <div className="text-xs text-slate-400">
          {countdown > 0 ? (
            <span>Gửi lại mã sau <strong className="text-slate-200">00:{countdown < 10 ? '0' : ''}{countdown}</strong></span>
          ) : (
            <button
              type="button"
              onClick={handleResendClick}
              className="text-purple-400 hover:text-purple-300 font-bold hover:underline cursor-pointer"
            >
              Gửi lại mã OTP ngay
            </button>
          )}
        </div>

        <GlassButton type="submit" variant="primary" disabled={isSubmitting} className="w-full py-3.5 bg-gradient-to-r from-purple-600 to-blue-500">
          {isSubmitting ? 'Đang xác nhận...' : 'Xác nhận'}
        </GlassButton>

        <button
          type="button"
          onClick={onBack}
          className="text-xs text-slate-400 hover:text-white transition-colors cursor-pointer"
        >
          ← Quay lại
        </button>
      </form>
    </div>
  );
};

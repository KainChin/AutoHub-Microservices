import React, { useState, useEffect, useRef } from 'react';
import { GlassButton } from '../common/GlassButton';

interface OtpVerificationProps {
  phone: string;
  error?: string;
  isSubmitting: boolean;
  onVerifySuccess: () => void;
  onBack: () => void;
}

export const OtpVerification: React.FC<OtpVerificationProps> = ({
  phone,
  error,
  isSubmitting,
  onVerifySuccess,
  onBack
}) => {
  const [digits, setDigits] = useState<string[]>(['1', '2', '3', '4', '5', '6']);
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
      onVerifySuccess();
    }
  };

  const formatTimer = (seconds: number) => {
    const s = seconds % 60;
    return `00:${s < 10 ? '0' : ''}${s}`;
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="text-center flex flex-col gap-1">
        <h2 className="text-xl font-bold text-white">Xác thực OTP</h2>
        <p className="text-xs text-slate-400">
          Mã xác thực đã được gửi đến <strong className="text-purple-400">{phone || '0901 234 567'}</strong>
        </p>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-6 items-center">
        {/* 6 Boxes */}
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
              className="w-11 h-12 text-center text-lg font-bold bg-[#111625]/90 border border-slate-700 focus:border-purple-500 rounded-xl text-white focus:outline-none focus:ring-1 focus:ring-purple-500/30 transition-all"
            />
          ))}
        </div>

        {error && <span className="text-xs text-red-400 font-medium">{error}</span>}

        <div className="text-xs text-slate-400">
          {countdown > 0 ? (
            <span>Gửi lại mã sau <strong className="text-slate-200">{formatTimer(countdown)}</strong></span>
          ) : (
            <button
              type="button"
              onClick={() => setCountdown(45)}
              className="text-purple-400 hover:underline cursor-pointer"
            >
              Gửi lại mã OTP
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

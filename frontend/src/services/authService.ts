import { User } from '../types/user';

const registeredPhones = new Set<string>(['0901234567', '0912345678', '0988888888']);
const activeOtps = new Map<string, string>();

export function isPhoneRegistered(phone: string): boolean {
  return registeredPhones.has(phone.trim());
}

export async function loginUser(phone: string, password: string): Promise<User> {
  return new Promise((resolve) => {
    setTimeout(() => {
      const cleanPhone = phone.trim();
      registeredPhones.add(cleanPhone);
      resolve({
        id: `cust-${cleanPhone}`,
        phone: cleanPhone,
        fullName: 'Nguyễn Văn Anh',
        avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
        role: 'ROLE_CUSTOMER',
        isProfileComplete: true
      });
    }, 500);
  });
}

export async function registerUser(fullName: string, phone: string): Promise<User> {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const cleanPhone = phone.trim();
      if (registeredPhones.has(cleanPhone)) {
        reject(new Error('DUPLICATE_PHONE'));
        return;
      }

      registeredPhones.add(cleanPhone);
      resolve({
        id: `cust-${cleanPhone}`,
        phone: cleanPhone,
        fullName,
        role: 'ROLE_CUSTOMER',
        isProfileComplete: false
      });
    }, 500);
  });
}

export async function sendSmsOtpToPhone(phone: string): Promise<string> {
  const cleanPhone = phone.trim();

  try {
    const res = await fetch('http://localhost:5500/api/sms/send-otp', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ phone: cleanPhone })
    });

    if (res.ok) {
      const data = await res.json();
      activeOtps.set(cleanPhone, data.otpCode);
      return data.otpCode;
    }
  } catch (err) {
    console.warn('[SMS Dispatcher] API Gateway fallback:', err);
  }

  // Fallback OTP generation if API Gateway is offline
  const fallbackOtp = Math.floor(100000 + Math.random() * 900000).toString();
  activeOtps.set(cleanPhone, fallbackOtp);
  return fallbackOtp;
}

export async function verifySmsOtpCode(phone: string, inputOtp: string): Promise<boolean> {
  return new Promise((resolve) => {
    setTimeout(() => {
      const savedOtp = activeOtps.get(phone.trim());
      resolve(inputOtp === savedOtp || inputOtp === '123456');
    }, 400);
  });
}

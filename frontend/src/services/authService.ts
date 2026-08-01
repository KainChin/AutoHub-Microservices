import { User } from '../types/user';

// Mock DB of registered phone numbers to enforce UNIQUE phone rule
const registeredPhones = new Set<string>(['0901234567', '0912345678', '0988888888']);
const activeOtps = new Map<string, string>();

export function isPhoneRegistered(phone: string): boolean {
  return registeredPhones.has(phone.trim());
}

export async function loginUser(phone: string, password: string): Promise<User> {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const cleanPhone = phone.trim();
      if (!registeredPhones.has(cleanPhone)) {
        registeredPhones.add(cleanPhone);
      }

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

      // Add to DB to enforce unique phone number rule
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
  return new Promise((resolve) => {
    setTimeout(() => {
      // Generate dynamic 6-digit OTP code for this phone number
      const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
      activeOtps.set(phone.trim(), otpCode);
      resolve(otpCode);
    }, 400);
  });
}

export async function verifySmsOtpCode(phone: string, inputOtp: string): Promise<boolean> {
  return new Promise((resolve) => {
    setTimeout(() => {
      const savedOtp = activeOtps.get(phone.trim());
      // Allow exact generated OTP or test default 123456
      const isValid = inputOtp === savedOtp || inputOtp === '123456';
      resolve(isValid);
    }, 400);
  });
}

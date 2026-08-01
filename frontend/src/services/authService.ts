import { User } from '../types/user';

export async function loginUser(phone: string, password: string): Promise<User> {
  // Simulate enterprise backend JWT auth API call
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        id: 'cust-101',
        phone,
        fullName: 'Nguyễn Văn Anh',
        avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
        role: 'ROLE_CUSTOMER',
        isProfileComplete: true
      });
    }, 600);
  });
}

export async function registerUser(fullName: string, phone: string): Promise<User> {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        id: `cust-${Date.now()}`,
        phone,
        fullName,
        role: 'ROLE_CUSTOMER',
        isProfileComplete: false
      });
    }, 600);
  });
}

export async function verifyOtp(otp: string): Promise<boolean> {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(otp === '123456' || otp.length === 6);
    }, 500);
  });
}

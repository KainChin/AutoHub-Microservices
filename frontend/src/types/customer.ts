export type Gender = 'Nam' | 'Nữ';

export interface CustomerProfile {
  custID?: number;
  fullName: string;
  phone: string;
  gender: Gender;
  address?: string;
  birthday?: string;
  avatarUrl?: string;
}

export interface FormErrors {
  fullName?: string;
  phone?: string;
  password?: string;
  confirmPassword?: string;
  gender?: string;
  address?: string;
  termsAccepted?: string;
  otp?: string;
}

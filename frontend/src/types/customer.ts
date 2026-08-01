export type Gender = 'Nam' | 'Nữ';

export interface CustomerProfile {
  fullName: string;
  phone: string;
  gender: Gender;
  address?: string;
}

export interface FormErrors {
  fullName?: string;
  phone?: string;
  gender?: string;
  address?: string;
}

import { FormErrors } from '../types/customer';

const VIETNAMESE_PHONE_REGEX = /(84|0[3|5|7|8|9])+([0-9]{8})\b/;

export function validateRegisterForm(
  fullName: string,
  phone: string,
  password: string,
  confirmPassword: string,
  termsAccepted: boolean
): FormErrors {
  const errors: FormErrors = {};

  if (!fullName || fullName.trim() === '') {
    errors.fullName = 'Họ và tên là bắt buộc.';
  }

  if (!phone || phone.trim() === '') {
    errors.phone = 'Số điện thoại là bắt buộc.';
  } else if (!VIETNAMESE_PHONE_REGEX.test(phone.trim())) {
    errors.phone = 'SĐT không đúng định dạng Việt Nam.';
  }

  if (!password || password.length < 8) {
    errors.password = 'Mật khẩu phải chứa ít nhất 8 ký tự.';
  }

  if (password !== confirmPassword) {
    errors.confirmPassword = 'Mật khẩu xác nhận không khớp.';
  }

  if (!termsAccepted) {
    errors.termsAccepted = 'Bạn phải đồng ý với Điều khoản sử dụng.';
  }

  return errors;
}

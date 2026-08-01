import { FormErrors } from '../types/customer';

const VIETNAMESE_PHONE_REGEX = /(84|0[3|5|7|8|9])+([0-9]{8})\b/;

export function validateLoginForm(phone: string, password: string): FormErrors {
  const errors: FormErrors = {};

  if (!phone || phone.trim() === '') {
    errors.phone = 'Vui lòng nhập số điện thoại.';
  } else if (!VIETNAMESE_PHONE_REGEX.test(phone.trim())) {
    errors.phone = 'Vui lòng nhập đúng số điện thoại Việt Nam (09xxxxxxx, 03xxxxxxx, 07xxxxxxx, 08xxxxxxx).';
  }

  if (!password || password.trim() === '') {
    errors.password = 'Vui lòng nhập mật khẩu.';
  }

  return errors;
}

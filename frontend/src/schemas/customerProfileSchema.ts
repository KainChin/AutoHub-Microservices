import { CustomerProfile, FormErrors } from '../types/customer';

const VIETNAMESE_PHONE_REGEX = /(84|0[3|5|7|8|9])+([0-9]{8})\b/;

export function validateCustomerProfile(profile: Partial<CustomerProfile>): FormErrors {
  const errors: FormErrors = {};

  if (!profile.fullName || profile.fullName.trim() === '') {
    errors.fullName = 'Họ và tên khách hàng là bắt buộc.';
  } else if (profile.fullName.trim().length < 2) {
    errors.fullName = 'Họ và tên phải có ít nhất 2 ký tự.';
  }

  if (!profile.phone || profile.phone.trim() === '') {
    errors.phone = 'Số điện thoại là bắt buộc.';
  } else if (!VIETNAMESE_PHONE_REGEX.test(profile.phone.trim())) {
    errors.phone = 'Vui lòng nhập đúng số điện thoại Việt Nam (09xxxxxxx, 03xxxxxxx, 07xxxxxxx, 08xxxxxxx).';
  }

  if (!profile.gender) {
    errors.gender = 'Vui lòng chọn giới tính.';
  }

  return errors;
}

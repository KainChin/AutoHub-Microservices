import { useState } from 'react';
import { FormErrors } from '../types/customer';
import { User } from '../types/user';
import { validateRegisterForm } from '../schemas/registerSchema';
import { registerUser } from '../services/authService';

export function useRegister(onRegisterSuccess: (user: User) => void) {
  const [fullName, setFullName] = useState<string>('');
  const [phone, setPhone] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');
  const [termsAccepted, setTermsAccepted] = useState<boolean>(true);
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const valErrors = validateRegisterForm(fullName, phone, password, confirmPassword, termsAccepted);

    if (Object.keys(valErrors).length > 0) {
      setErrors(valErrors);
      return;
    }

    setIsSubmitting(true);
    try {
      const newUser = await registerUser(fullName, phone);
      setIsSubmitting(false);
      onRegisterSuccess(newUser);
    } catch (err) {
      setIsSubmitting(false);
      setErrors({ phone: 'Đăng ký thất bại. Vui lòng thử lại.' });
    }
  };

  return {
    fullName,
    setFullName,
    phone,
    setPhone,
    password,
    setPassword,
    confirmPassword,
    setConfirmPassword,
    termsAccepted,
    setTermsAccepted,
    errors,
    isSubmitting,
    handleSubmit
  };
}

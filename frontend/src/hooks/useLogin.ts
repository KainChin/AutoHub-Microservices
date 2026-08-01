import { useState } from 'react';
import { FormErrors } from '../types/customer';
import { User } from '../types/user';
import { validateLoginForm } from '../schemas/loginSchema';
import { loginUser } from '../services/authService';

export function useLogin(onLoginSuccess: (user: User) => void) {
  const [phone, setPhone] = useState<string>('0901234567');
  const [password, setPassword] = useState<string>('12345678');
  const [rememberMe, setRememberMe] = useState<boolean>(true);
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const valErrors = validateLoginForm(phone, password);

    if (Object.keys(valErrors).length > 0) {
      setErrors(valErrors);
      return;
    }

    setIsSubmitting(true);
    try {
      const user = await loginUser(phone, password);
      setIsSubmitting(false);
      onLoginSuccess(user);
    } catch (err) {
      setIsSubmitting(false);
      setErrors({ password: 'Tài khoản hoặc mật khẩu không chính xác.' });
    }
  };

  return {
    phone,
    setPhone,
    password,
    setPassword,
    rememberMe,
    setRememberMe,
    errors,
    isSubmitting,
    handleSubmit
  };
}

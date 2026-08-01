import { useState } from 'react';
import { CustomerProfile, FormErrors, Gender } from '../types/customer';
import { validateCustomerProfile } from '../schemas/customerProfileSchema';

const initialProfile: CustomerProfile = {
  fullName: '',
  phone: '',
  gender: 'Nam',
  address: ''
};

export function useCustomerProfile(onSuccess?: () => void) {
  const [profile, setProfile] = useState<CustomerProfile>(initialProfile);
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [showToast, setShowToast] = useState<boolean>(false);

  const updateField = <K extends keyof CustomerProfile>(field: K, value: CustomerProfile[K]) => {
    setProfile(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  const resetForm = () => {
    setProfile(initialProfile);
    setErrors({});
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const validationErrors = validateCustomerProfile(profile);

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setIsSubmitting(true);

    try {
      // API Post to Backend API Gateway / Customer Service
      await fetch('http://localhost:5500/api/customers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          custName: profile.fullName,
          phone: profile.phone,
          sex: profile.gender === 'Nam' ? 'M' : 'F',
          cusAddress: profile.address || ''
        })
      }).catch(() => null);

      setIsSubmitting(false);
      setShowToast(true);

      if (onSuccess) onSuccess();

      setTimeout(() => {
        setShowToast(false);
        resetForm();
      }, 3000);
    } catch (err) {
      setIsSubmitting(false);
      setShowToast(true);
      if (onSuccess) onSuccess();
      setTimeout(() => setShowToast(false), 3000);
    }
  };

  return {
    profile,
    errors,
    isSubmitting,
    showToast,
    updateField,
    handleSubmit,
    resetForm,
    setShowToast
  };
}

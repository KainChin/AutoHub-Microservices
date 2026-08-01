import { useState, useEffect } from 'react';
import { CustomerProfile, FormErrors } from '../types/customer';
import { validateCustomerProfile } from '../schemas/customerProfileSchema';

export function useCustomerProfile(
  initialData?: { fullName?: string; phone?: string },
  onSuccess?: () => void,
  onCloseModal?: () => void
) {
  const [profile, setProfile] = useState<CustomerProfile>({
    fullName: initialData?.fullName || '',
    phone: initialData?.phone || '',
    gender: 'Nam',
    address: ''
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [showToast, setShowToast] = useState<boolean>(false);

  // Synchronize when initialData changes (e.g. user just registered)
  useEffect(() => {
    if (initialData?.fullName || initialData?.phone) {
      setProfile(prev => ({
        ...prev,
        fullName: initialData.fullName || prev.fullName,
        phone: initialData.phone || prev.phone
      }));
    }
  }, [initialData?.fullName, initialData?.phone]);

  const updateField = <K extends keyof CustomerProfile>(field: K, value: CustomerProfile[K]) => {
    setProfile(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  const resetForm = () => {
    setProfile({
      fullName: initialData?.fullName || '',
      phone: initialData?.phone || '',
      gender: 'Nam',
      address: ''
    });
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
      // POST to API Gateway / Customer Service
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
      if (onCloseModal) onCloseModal(); // Tự động đóng Modal ngay lập tức!
    } catch (err) {
      setIsSubmitting(false);
      setShowToast(true);
      if (onSuccess) onSuccess();
      if (onCloseModal) onCloseModal();
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

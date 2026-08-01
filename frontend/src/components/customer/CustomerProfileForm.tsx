import React from 'react';
import { User, MapPin } from 'lucide-react';
import { GlassInput } from '../common/GlassInput';
import { GlassTextarea } from '../common/GlassTextarea';
import { PhoneInput } from './PhoneInput';
import { GenderRadioGroup } from './GenderRadioGroup';
import { CustomerProfileFooter } from './CustomerProfileFooter';
import { CustomerProfile, FormErrors } from '../../types/customer';

interface CustomerProfileFormProps {
  profile: CustomerProfile;
  errors: FormErrors;
  isSubmitting: boolean;
  onUpdateField: <K extends keyof CustomerProfile>(field: K, value: CustomerProfile[K]) => void;
  onSubmit: (e: React.FormEvent) => void;
  onCancel: () => void;
}

export const CustomerProfileForm: React.FC<CustomerProfileFormProps> = ({
  profile,
  errors,
  isSubmitting,
  onUpdateField,
  onSubmit,
  onCancel
}) => {
  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-6">
      {/* Field 1: Full Name */}
      <GlassInput
        label="1. Họ và Tên Khách Hàng"
        required
        icon={User}
        placeholder="Nhập họ và tên..."
        value={profile.fullName}
        onChange={(e) => onUpdateField('fullName', e.target.value)}
        error={errors.fullName}
      />

      {/* Field 2: Phone */}
      <PhoneInput
        value={profile.phone}
        onChange={(val) => onUpdateField('phone', val)}
        error={errors.phone}
      />

      {/* Field 3: Gender */}
      <GenderRadioGroup
        value={profile.gender}
        onChange={(val) => onUpdateField('gender', val)}
        error={errors.gender}
      />

      {/* Field 4: Address */}
      <GlassTextarea
        label="4. Địa Chỉ Thường Trú"
        icon={MapPin}
        placeholder="Nhập địa chỉ thường trú..."
        value={profile.address}
        onChange={(e) => onUpdateField('address', e.target.value)}
        error={errors.address}
      />

      {/* Footer Action Buttons */}
      <CustomerProfileFooter isSubmitting={isSubmitting} onCancel={onCancel} />
    </form>
  );
};

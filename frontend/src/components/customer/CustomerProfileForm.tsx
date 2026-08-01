import React from 'react';
import { User as UserIcon } from 'lucide-react';
import { GlassInput } from '../common/GlassInput';
import { GlassTextarea } from '../common/GlassTextarea';
import { GenderRadioGroup } from './GenderRadioGroup';
import { AvatarUploader } from './AvatarUploader';
import { GlassButton } from '../common/GlassButton';
import { CustomerProfile, FormErrors } from '../../types/customer';

interface CustomerProfileFormProps {
  profile: CustomerProfile;
  errors: FormErrors;
  isSubmitting: boolean;
  onUpdateField: <K extends keyof CustomerProfile>(field: K, value: CustomerProfile[K]) => void;
  onSubmit: (e: React.FormEvent) => void;
}

export const CustomerProfileForm: React.FC<CustomerProfileFormProps> = ({
  profile,
  errors,
  isSubmitting,
  onUpdateField,
  onSubmit
}) => {
  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-6">
      {/* 2-Column Grid: Left Avatar Uploader, Right Fields */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
        {/* Left Column: Avatar */}
        <div className="md:col-span-1 flex items-center justify-center pt-2">
          <AvatarUploader
            initialUrl={profile.avatarUrl}
            onAvatarChange={(url) => onUpdateField('avatarUrl', url)}
          />
        </div>

        {/* Right Column: Fields */}
        <div className="md:col-span-2 flex flex-col gap-4">
          <GlassInput
            label="Họ và tên"
            required
            icon={UserIcon}
            placeholder="Nhập họ và tên"
            value={profile.fullName}
            onChange={(e) => onUpdateField('fullName', e.target.value)}
            error={errors.fullName}
          />

          <GenderRadioGroup
            value={profile.gender}
            onChange={(val) => onUpdateField('gender', val)}
            error={errors.gender}
          />

          <GlassTextarea
            label="Địa chỉ thường trú"
            required
            placeholder="Nhập địa chỉ thường trú"
            value={profile.address}
            onChange={(e) => onUpdateField('address', e.target.value)}
            error={errors.address}
          />
        </div>
      </div>

      {/* Primary Submit Button */}
      <div className="pt-2">
        <GlassButton
          type="submit"
          variant="primary"
          disabled={isSubmitting}
          className="w-full py-3.5 bg-gradient-to-r from-purple-600 to-blue-500"
        >
          {isSubmitting ? 'Đang lưu...' : 'Lưu hồ sơ'}
        </GlassButton>
      </div>
    </form>
  );
};

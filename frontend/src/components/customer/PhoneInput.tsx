import React from 'react';
import { Phone } from 'lucide-react';
import { GlassInput } from '../common/GlassInput';

interface PhoneInputProps {
  value: string;
  onChange: (value: string) => void;
  error?: string;
}

export const PhoneInput: React.FC<PhoneInputProps> = ({
  value,
  onChange,
  error
}) => {
  return (
    <GlassInput
      label="2. Số Điện Thoại"
      required
      icon={Phone}
      type="tel"
      placeholder="0901234567"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      error={error}
      helperText="Vui lòng nhập đúng số điện thoại Việt Nam (09xxxxxxx, 03xxxxxxx, 07xxxxxxx, 08xxxxxxx)."
    />
  );
};

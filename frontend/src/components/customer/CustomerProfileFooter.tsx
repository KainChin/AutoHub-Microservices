import React from 'react';
import { GlassButton } from '../common/GlassButton';

interface CustomerProfileFooterProps {
  isSubmitting?: boolean;
  onCancel: () => void;
}

export const CustomerProfileFooter: React.FC<CustomerProfileFooterProps> = ({
  isSubmitting = false,
  onCancel
}) => {
  return (
    <div className="flex items-center justify-end gap-3 pt-6 border-t border-slate-800/80">
      <GlassButton type="button" variant="secondary" onClick={onCancel}>
        Hủy
      </GlassButton>

      <GlassButton type="submit" variant="primary" disabled={isSubmitting}>
        {isSubmitting ? 'Đang lưu...' : 'Lưu Hồ Sơ Khách Hàng'}
      </GlassButton>
    </div>
  );
};

import React, { useEffect } from 'react';
import { CustomerProfileHeader } from './CustomerProfileHeader';
import { CustomerProfileForm } from './CustomerProfileForm';
import { SuccessToast } from './SuccessToast';
import { useCustomerProfile } from '../../hooks/useCustomerProfile';
import { User } from '../../types/user';

interface CustomerProfileModalProps {
  isOpen: boolean;
  user?: User | null;
  onClose: () => void;
  onSaveSuccess?: () => void;
}

export const CustomerProfileModal: React.FC<CustomerProfileModalProps> = ({
  isOpen,
  user,
  onClose,
  onSaveSuccess
}) => {
  const {
    profile,
    errors,
    isSubmitting,
    showToast,
    updateField,
    handleSubmit,
    resetForm,
    setShowToast
  } = useCustomerProfile(
    { fullName: user?.fullName, phone: user?.phone },
    onSaveSuccess,
    onClose // Tự động đóng Modal ngay khi lưu thành công!
  );

  useEffect(() => {
    if (!isOpen) return;

    document.body.style.overflow = 'hidden';
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      document.body.style.overflow = 'unset';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  return (
    <>
      {/* Toast Notification */}
      <SuccessToast show={showToast} onClose={() => setShowToast(false)} />

      {isOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/65 backdrop-blur-[10px] flex items-center justify-center p-4 overflow-y-auto animate-in fade-in duration-300"
          onClick={(e) => {
            if (e.target === e.currentTarget) onClose();
          }}
        >
          <div
            role="dialog"
            aria-modal="true"
            className="relative w-full max-w-[620px] bg-white/[0.08] backdrop-blur-[20px] border border-white/[0.12] rounded-[16px] shadow-2xl p-8 text-slate-100 my-8 animate-in fade-in zoom-in-95 duration-300"
          >
            <CustomerProfileHeader onClose={onClose} />

            <CustomerProfileForm
              profile={profile}
              errors={errors}
              isSubmitting={isSubmitting}
              onUpdateField={updateField}
              onSubmit={handleSubmit}
              onCancel={() => {
                resetForm();
                onClose();
              }}
            />
          </div>
        </div>
      )}
    </>
  );
};

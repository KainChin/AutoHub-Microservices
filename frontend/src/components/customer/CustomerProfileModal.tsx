import React, { useEffect } from 'react';
import { X } from 'lucide-react';
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
    setShowToast
  } = useCustomerProfile(
    { fullName: user?.fullName, phone: user?.phone },
    onSaveSuccess,
    onClose // Tự động đóng Modal ngay khi nhấn Lưu hồ sơ!
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
      {/* Green Success Toast */}
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
            className="relative w-full max-w-[650px] bg-[#0c101d]/90 backdrop-blur-[20px] border border-white/[0.12] rounded-[16px] shadow-2xl p-8 text-slate-100 my-8 animate-in fade-in zoom-in-95 duration-300"
          >
            {/* Header */}
            <div className="flex items-start justify-between mb-6">
              <div className="flex flex-col gap-1">
                <h2 className="text-2xl font-bold text-white tracking-tight">
                  Hoàn thiện hồ sơ của bạn
                </h2>
                <p className="text-xs text-slate-400">
                  Vui lòng cập nhật thông tin để chúng tôi hỗ trợ bạn tốt hơn
                </p>
              </div>

              <button
                onClick={onClose}
                aria-label="Close Modal"
                className="p-2 rounded-full bg-slate-900/80 border border-slate-800 text-slate-400 hover:text-white hover:bg-red-600/80 transition-all duration-300 transform hover:rotate-90 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Profile Form */}
            <CustomerProfileForm
              profile={profile}
              errors={errors}
              isSubmitting={isSubmitting}
              onUpdateField={updateField}
              onSubmit={handleSubmit}
            />
          </div>
        </div>
      )}
    </>
  );
};

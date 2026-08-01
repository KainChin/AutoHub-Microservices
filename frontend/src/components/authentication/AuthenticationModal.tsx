import React, { useState } from 'react';
import { X } from 'lucide-react';
import { LoginForm } from './LoginForm';
import { RegisterForm } from './RegisterForm';
import { ForgotPasswordModal } from './ForgotPasswordModal';
import { User } from '../../types/user';

interface AuthenticationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAuthSuccess: (user: User) => void;
}

export const AuthenticationModal: React.FC<AuthenticationModalProps> = ({
  isOpen,
  onClose,
  onAuthSuccess
}) => {
  const [view, setView] = useState<'LOGIN' | 'REGISTER' | 'FORGOT'>('LOGIN');

  if (!isOpen) return null;

  return (
    <>
      <ForgotPasswordModal
        isOpen={view === 'FORGOT'}
        onClose={onClose}
        onBackToLogin={() => setView('LOGIN')}
      />

      {view !== 'FORGOT' && (
        <div className="fixed inset-0 z-50 bg-black/65 backdrop-blur-[10px] flex items-center justify-center p-4">
          <div className="relative w-full max-w-[480px] bg-[#0c101d]/90 backdrop-blur-[20px] border border-white/[0.12] rounded-[16px] p-8 shadow-2xl text-slate-100 animate-in fade-in zoom-in-95 my-6">
            {/* Close Button */}
            <button
              onClick={onClose}
              className="absolute top-6 right-6 p-2 rounded-full bg-slate-900/80 border border-slate-800 text-slate-400 hover:text-white hover:bg-red-600/80 transition-all duration-300 transform hover:rotate-90 cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Screen 1: Login */}
            {view === 'LOGIN' && (
              <LoginForm
                onLoginSuccess={onAuthSuccess}
                onSwitchToRegister={() => setView('REGISTER')}
                onOpenForgotPassword={() => setView('FORGOT')}
              />
            )}

            {/* Screen 2: Register */}
            {view === 'REGISTER' && (
              <RegisterForm
                onRegisterSuccess={onAuthSuccess}
                onSwitchToLogin={() => setView('LOGIN')}
              />
            )}
          </div>
        </div>
      )}
    </>
  );
};

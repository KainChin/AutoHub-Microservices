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
  const [activeTab, setActiveTab] = useState<'LOGIN' | 'REGISTER'>('LOGIN');
  const [isForgotOpen, setIsForgotOpen] = useState<boolean>(false);

  if (!isOpen) return null;

  return (
    <>
      <ForgotPasswordModal
        isOpen={isForgotOpen}
        onClose={() => setIsForgotOpen(false)}
      />

      <div className="fixed inset-0 z-50 bg-black/65 backdrop-blur-[10px] flex items-center justify-center p-4">
        <div className="relative w-full max-w-[500px] bg-white/[0.08] backdrop-blur-[20px] border border-white/[0.12] rounded-[16px] p-8 shadow-2xl text-slate-100 animate-in fade-in zoom-in-95 my-6">
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-6 right-6 p-2 rounded-full bg-slate-900/80 border border-slate-800 text-slate-400 hover:text-white hover:bg-red-600/80 transition-all duration-300 transform hover:rotate-90 cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>

          {/* Header Title & Subtitle */}
          <div className="flex flex-col gap-1 mb-6">
            <h2 className="text-xl font-bold text-white">
              {activeTab === 'LOGIN' ? 'Chào Mừng Đến AutoHub' : 'Tạo Tài Khoản AutoHub'}
            </h2>
            <p className="text-xs text-slate-400">
              {activeTab === 'LOGIN' ? 'Nhập thông tin đăng nhập để tiếp tục' : 'Đăng ký tài khoản để trải nghiệm đầy đủ dịch vụ xe'}
            </p>
          </div>

          {/* Tab Switcher */}
          <div className="flex rounded-xl bg-slate-950/70 p-1 border border-slate-800/80 mb-6">
            <button
              onClick={() => setActiveTab('LOGIN')}
              className={`flex-1 py-2.5 text-xs font-bold rounded-lg transition-all ${
                activeTab === 'LOGIN'
                  ? 'bg-gradient-to-r from-purple-600 to-cyan-500 text-white shadow-md'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Đăng Nhập
            </button>
            <button
              onClick={() => setActiveTab('REGISTER')}
              className={`flex-1 py-2.5 text-xs font-bold rounded-lg transition-all ${
                activeTab === 'REGISTER'
                  ? 'bg-gradient-to-r from-purple-600 to-cyan-500 text-white shadow-md'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Đăng Ký
            </button>
          </div>

          {/* Tab Forms */}
          {activeTab === 'LOGIN' ? (
            <LoginForm
              onLoginSuccess={onAuthSuccess}
              onSwitchToRegister={() => setActiveTab('REGISTER')}
              onOpenForgotPassword={() => setIsForgotOpen(true)}
            />
          ) : (
            <RegisterForm
              onRegisterSuccess={onAuthSuccess}
              onSwitchToLogin={() => setActiveTab('LOGIN')}
            />
          )}
        </div>
      </div>
    </>
  );
};

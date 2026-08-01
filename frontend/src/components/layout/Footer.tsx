import React from 'react';
import { MapPin, Mail, Clock, Phone, MessageSquare, ChevronUp } from 'lucide-react';

export const Footer: React.FC = () => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="glass-panel border-t border-slate-800/80 mt-16 pt-12 pb-8 px-6">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8 mb-10 text-sm text-slate-400">
        {/* Brand Info */}
        <div className="flex flex-col gap-3">
          <div className="text-xl font-black text-white flex items-center gap-1">
            <span className="text-red-600">Auto</span>Hub
          </div>
          <p className="text-xs text-slate-400 leading-relaxed">
            AutoHub - Đại lý xe uy tín hàng đầu. Mang đến cho khách hàng những mẫu xe chất lượng cùng dịch vụ chuyên nghiệp nhất.
          </p>
        </div>

        {/* Location Info */}
        <div className="flex flex-col gap-3">
          <h4 className="text-white font-semibold text-base mb-1">Thông Tin Đại Lý</h4>
          <div className="flex items-start gap-2.5 text-xs">
            <MapPin className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
            <span>123 Đường Lê Văn Lương, Thanh Xuân, Hà Nội</span>
          </div>
          <div className="flex items-center gap-2.5 text-xs">
            <Mail className="w-4 h-4 text-red-500 shrink-0" />
            <span>info@autohub.vn</span>
          </div>
          <div className="flex items-center gap-2.5 text-xs">
            <Clock className="w-4 h-4 text-red-500 shrink-0" />
            <span>08:00 - 20:00 (Thứ 2 - Chủ nhật)</span>
          </div>
        </div>

        {/* Support Hotline */}
        <div className="flex flex-col gap-3">
          <h4 className="text-white font-semibold text-base mb-1">Hỗ Trợ 24/7</h4>
          <div className="text-2xl font-black text-red-500 flex items-center gap-2">
            <Phone className="w-5 h-5 fill-red-500" />
            <span>1900 8888</span>
          </div>
          <p className="text-xs text-slate-400">Hotline tư vấn & hỗ trợ khách hàng mọi lúc, mọi nơi.</p>
          <button className="flex items-center justify-center gap-2 bg-slate-900 border border-slate-700 hover:border-slate-500 text-slate-200 py-2 px-4 rounded-xl text-xs font-medium transition-colors">
            <MessageSquare className="w-3.5 h-3.5" />
            <span>Chat Trực Tuyến</span>
          </button>
        </div>

        {/* Social Links & Back to Top */}
        <div className="flex flex-col gap-3">
          <h4 className="text-white font-semibold text-base mb-1">Kết Nối Với Chúng Tôi</h4>
          <div className="flex items-center gap-3">
            <span className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white text-xs font-bold">f</span>
            <span className="w-8 h-8 rounded-full bg-red-600 flex items-center justify-center text-white text-xs font-bold">▶</span>
            <span className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white text-xs font-bold">Z</span>
            <span className="w-8 h-8 rounded-full bg-purple-600 flex items-center justify-center text-white text-xs font-bold">♪</span>
          </div>
          <button onClick={scrollToTop} className="mt-4 self-end p-2.5 bg-slate-900 border border-slate-700 rounded-full hover:bg-slate-800 text-slate-300">
            <ChevronUp className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto pt-6 border-t border-slate-800/60 flex flex-col md:flex-row items-center justify-between text-xs text-slate-500 gap-4">
        <div>© 2024 AutoHub. All rights reserved.</div>
        <div className="flex gap-6">
          <a href="#" className="hover:text-slate-300">Chính Sách Bảo Mật</a>
          <a href="#" className="hover:text-slate-300">Điều Khoản Sử Dụng</a>
        </div>
      </div>
    </footer>
  );
};

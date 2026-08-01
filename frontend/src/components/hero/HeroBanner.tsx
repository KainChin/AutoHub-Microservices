import React from 'react';
import { HeroButtons } from './HeroButtons';

export const HeroBanner: React.FC = () => {
  return (
    <div className="relative rounded-3xl overflow-hidden glass-panel p-8 md:p-14 mb-10 min-h-[380px] flex items-center">
      {/* Background Car Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center opacity-40 mix-blend-luminosity scale-105 transition-transform duration-1000"
        style={{ backgroundImage: `url('https://images.unsplash.com/photo-1617814076367-b759c7d7e738?auto=format&fit=crop&w=1600&q=80')` }}
      />
      
      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-[#0b0f19] via-[#0b0f19]/80 to-transparent" />

      {/* Hero Content */}
      <div className="relative z-10 max-w-xl flex flex-col gap-4">
        <h1 className="text-3xl md:text-5xl font-black tracking-tight text-white leading-tight">
          <span className="text-red-600">AutoHub</span> - Đẳng Cấp Xe Sang & Dịch Vụ Hoàn Hảo
        </h1>

        <p className="text-slate-300 text-sm md:text-base font-medium leading-relaxed">
          Trải nghiệm đẳng cấp khác biệt cùng AutoHub.
        </p>

        <div className="pt-4">
          <HeroButtons />
        </div>
      </div>

      {/* Carousel Dots Indicator */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-1.5 z-10">
        <span className="w-6 h-1.5 rounded-full bg-red-600"></span>
        <span className="w-1.5 h-1.5 rounded-full bg-slate-600"></span>
        <span className="w-1.5 h-1.5 rounded-full bg-slate-600"></span>
      </div>
    </div>
  );
};

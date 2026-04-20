import React from 'react';
import { LucideIcon } from 'lucide-react';

interface CustomerKpiCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  color: string;
  bgColor: string;
}

const CustomerKpiCard: React.FC<CustomerKpiCardProps> = ({ title, value, icon: Icon, color, bgColor }) => {
  return (
    <div className="bg-white p-5 rounded-3xl border border-slate-100 shadow-sm flex flex-col justify-between relative overflow-hidden h-[130px] group">
      <div className="z-10 flex justify-between items-start">
        <p className="font-semibold text-[10px] uppercase tracking-widest" style={{ color }}>{title}</p>
        <div className="w-10 h-10 rounded-xl flex items-center justify-center border" style={{ backgroundColor: bgColor, color, borderColor: `${color}20` }}>
          <Icon size={20} />
        </div>
      </div>
      <div className="z-10 mt-auto">
        <h3 className="text-[32px] font-black tracking-tight leading-none" style={{ color: '#111f42' }}>{value}</h3>
      </div>
      <div className="absolute -bottom-10 -right-6 opacity-10 group-hover:scale-110 -rotate-[15deg] transition-transform duration-500 z-0" style={{ color }}>
        <Icon size={140} />
      </div>
    </div>
  );
};

export default CustomerKpiCard;

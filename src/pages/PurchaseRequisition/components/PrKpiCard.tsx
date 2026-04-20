import React from 'react';
import { LucideIcon } from 'lucide-react';

interface PrKpiCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  color: string;
  bgColor: string;
  iconBg?: string;
}

const PrKpiCard: React.FC<PrKpiCardProps> = ({ 
  title, 
  value, 
  icon: Icon, 
  color, 
  bgColor,
  iconBg 
}) => {
  return (
    <div 
      className="p-6 rounded-[24px] border border-slate-100 shadow-sm flex flex-col justify-between relative overflow-hidden group transition-all hover:shadow-md"
      style={{ backgroundColor: bgColor }}
    >
      <div className="relative z-10">
        <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">{title}</p>
        <p className="text-3xl font-black" style={{ color }}>{value}</p>
      </div>
      <div 
        className="absolute right-4 bottom-4 p-3 rounded-2xl transition-transform group-hover:scale-110"
        style={{ backgroundColor: iconBg || 'rgba(255,255,255,0.5)' }}
      >
        <Icon size={24} style={{ color }} />
      </div>
    </div>
  );
};

export default PrKpiCard;

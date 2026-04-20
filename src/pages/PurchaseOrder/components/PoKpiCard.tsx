import React from 'react';
import { LucideIcon } from 'lucide-react';

interface PoKpiCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  color: string;
  bgColor: string;
  iconBg?: string;
}

const PoKpiCard: React.FC<PoKpiCardProps> = ({ 
  title, 
  value, 
  icon: Icon, 
  color, 
  bgColor,
  iconBg 
}) => {
  return (
    <div className="bg-white p-5 rounded-3xl border border-slate-100 shadow-sm flex flex-col justify-between relative overflow-hidden h-[130px] group transition-all hover:shadow-md" style={{ backgroundColor: bgColor }}>
      <div className="z-10 flex justify-between items-start">
        <p className="font-semibold text-[10px] uppercase tracking-widest text-slate-500" style={{ color: color + 'CC' }}>{title}</p>
        <div className="w-10 h-10 rounded-xl flex items-center justify-center border" style={{ backgroundColor: iconBg || color + '1A', borderColor: color + '33', color: color }}>
          <Icon size={20} />
        </div>
      </div>
      <div className="z-10 mt-auto">
        <h3 className="text-[28px] font-bold leading-none" style={{ color: color }}>{value}</h3>
      </div>
      <div className="absolute -bottom-10 -right-6 opacity-5 group-hover:scale-110 -rotate-[15deg] transition-transform duration-500 z-0" style={{ color: color }}>
        <Icon size={140} />
      </div>
    </div>
  );
};

export default PoKpiCard;

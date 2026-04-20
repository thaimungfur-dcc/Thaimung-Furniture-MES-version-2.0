import React from 'react';
import { LucideIcon } from 'lucide-react';

interface VatKpiCardProps {
  title: string;
  value: string;
  subtitle?: string;
  icon: LucideIcon;
  color: string;
  bgColor: string;
  trend?: {
    value: string;
    isUp: boolean;
  };
  iconBg?: string;
}

const VatKpiCard: React.FC<VatKpiCardProps> = ({ 
  title, 
  value, 
  subtitle, 
  icon: Icon, 
  color, 
  bgColor, 
  trend,
  iconBg
}) => {
  return (
    <div className="bg-white p-5 rounded-3xl border border-slate-100 shadow-sm flex flex-col justify-between relative overflow-hidden h-[150px] group hover:shadow-md transition-all">
      <div className="z-10 flex justify-between">
        <p className="font-semibold text-[10px] uppercase tracking-widest text-slate-500">{title}</p>
        <div 
          className="w-12 h-12 rounded-xl flex items-center justify-center border"
          style={{ 
            backgroundColor: iconBg || `${color}10`, 
            color: color,
            borderColor: `${color}20`
          }}
        >
          <Icon size={24} />
        </div>
      </div>
      <div className="z-10 mt-auto">
        <h3 className="text-[32px] font-bold leading-none tracking-tight mb-2" style={{ color: color }}>
          {value}
        </h3>
        {trend ? (
          <div className={`flex items-center gap-2 text-[10px] font-medium ${trend.isUp ? 'text-emerald-600' : 'text-red-600'}`}>
            <span>{trend.value}</span>
          </div>
        ) : subtitle ? (
          <p className="text-[10px] text-slate-400 font-medium">{subtitle}</p>
        ) : null}
      </div>
      <div 
        className="absolute -bottom-10 -right-6 opacity-30 group-hover:scale-110 -rotate-[15deg] transition-transform duration-500 z-0"
        style={{ color: iconBg || `${color}10` }}
      >
        <Icon size={160} strokeWidth={1.5} />
      </div>
    </div>
  );
};

export default VatKpiCard;

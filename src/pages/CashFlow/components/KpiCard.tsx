import React from 'react';
import { Landmark, Activity, TrendingUp, DollarSign } from 'lucide-react';

interface KpiCardProps {
  title: string;
  amount: number;
  type: 'balance' | 'cfo' | 'cfi' | 'cff';
}

export default function KpiCard({ title, amount, type }: KpiCardProps) {
  const config = {
    balance: {
      icon: Landmark,
      bgColor: 'bg-blue-50',
      textColor: 'text-[#111f42]',
      borderColor: 'border-blue-100',
      iconColor: 'text-slate-200'
    },
    cfo: {
      icon: Activity,
      bgColor: 'bg-[#f0f4f8]',
      textColor: 'text-[#6b7556]',
      borderColor: 'border-[#f0f4f8]',
      iconColor: 'text-[#f0f4f8]'
    },
    cfi: {
      icon: TrendingUp,
      bgColor: 'bg-orange-50',
      textColor: 'text-[#d97706]',
      borderColor: 'border-orange-100',
      iconColor: 'text-orange-50'
    },
    cff: {
      icon: DollarSign,
      bgColor: 'bg-purple-50',
      textColor: 'text-[#5b21b6]',
      borderColor: 'border-purple-100',
      iconColor: 'text-purple-50'
    }
  };

  const { icon: Icon, bgColor, textColor, borderColor, iconColor } = config[type];
  const isNegative = amount < 0;

  return (
    <div className="bg-white p-5 rounded-3xl border border-slate-100 shadow-sm flex flex-col justify-between relative overflow-hidden h-[120px] group">
      <div className="z-10 flex justify-between">
        <p className="font-semibold text-[10px] uppercase tracking-widest text-slate-500">{title}</p>
        <div className={`w-10 h-10 rounded-xl ${bgColor} ${textColor} flex items-center justify-center border ${borderColor}`}>
          <Icon size={20} />
        </div>
      </div>
      <div className="z-10 mt-auto">
        <h3 className={`text-[28px] font-bold leading-none tracking-tight ${isNegative ? 'text-[#E3624A]' : textColor}`}>
          {isNegative ? '-' : ''}฿{Math.abs(amount).toLocaleString()}
        </h3>
      </div>
      <div className={`absolute -bottom-6 -right-4 ${iconColor} opacity-40 group-hover:scale-110 -rotate-[15deg] transition-transform duration-500 z-0`}>
        <Icon size={120} strokeWidth={1.5} />
      </div>
    </div>
  );
}

import React from 'react';
import { LucideIcon } from 'lucide-react';
import { motion } from 'motion/react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

interface KpiCardProps {
  label?: string;
  title?: string;
  value: string | number;
  subValue?: string;
  trend?: string | {
    value: string;
    isPositive: boolean;
  };
  icon: LucideIcon;
  color: string;
  bgOpacity?: string;
  variant?: string;
}

export function KpiCard({
  label,
  title,
  value,
  subValue,
  trend,
  icon: Icon,
  color,
  bgOpacity = "bg-opacity-[0.08]"
}: KpiCardProps) {
  const displayLabel = label || title || "Metric";
  const isTrendObject = typeof trend === 'object' && trend !== null;

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4, transition: { duration: 0.2 } }}
      className="bg-white p-7 rounded-[32px] shadow-sm border border-slate-100 flex flex-col justify-between min-h-[160px] relative overflow-hidden group hover:shadow-xl hover:shadow-slate-200/50 transition-all"
    >
      {/* Background Icon Accent */}
      <div 
        className="absolute -right-6 -bottom-6 opacity-[0.05] pointer-events-none transform -rotate-[15deg] group-hover:rotate-0 group-hover:scale-110 group-hover:opacity-[0.1] transition-all duration-700"
        style={{ color }}
      >
        <Icon size={140} strokeWidth={1} />
      </div>

      <div className="flex justify-between items-start relative z-10">
        <div className="space-y-1">
          <h3 className="text-[10px] font-black text-[#111f42] uppercase tracking-[0.2em] leading-tight opacity-40">{displayLabel}</h3>
          <div className="flex items-baseline gap-2">
            <div className="text-3xl font-black text-[#111f42] font-mono tracking-tighter leading-none group-hover:text-[#ab8a3b] transition-colors">{value}</div>
            {isTrendObject && (
              <span className={clsx(
                "text-[9px] font-black font-mono px-1.5 py-0.5 rounded-md",
                (trend as any).isPositive ? "bg-emerald-50 text-emerald-600" : "bg-red-50 text-red-600"
              )}>
                {(trend as any).isPositive ? '↑' : '↓'} {(trend as any).value}
              </span>
            )}
          </div>
        </div>
        <div 
          className={twMerge(
            "p-3 rounded-[20px] shadow-sm transition-transform group-hover:scale-110 duration-500",
            bgOpacity
          )} 
          style={{ backgroundColor: color, color }}
        >
          <Icon size={20} strokeWidth={2.5} />
        </div>
      </div>

      <div className="relative z-10 mt-6 flex items-center justify-between">
        <div className="flex flex-col">
          {subValue && (
            <p className="text-[9px] font-black text-slate-300 uppercase tracking-[0.25em]">{subValue}</p>
          )}
          {!isTrendObject && trend && (
             <p className="text-[10px] font-black text-[#ab8a3b] uppercase tracking-widest leading-none mt-1">{trend as string}</p>
          )}
        </div>
        <div className="w-12 h-1 bg-slate-50 rounded-full overflow-hidden">
          <motion.div 
            initial={{ width: 0 }}
            animate={{ width: '60%' }}
            className="h-full rounded-full"
            style={{ backgroundColor: color }}
          />
        </div>
      </div>
    </motion.div>
  );
}

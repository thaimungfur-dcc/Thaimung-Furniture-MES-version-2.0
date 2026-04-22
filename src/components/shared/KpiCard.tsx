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

export const KpiCard: React.FC<KpiCardProps> = ({
  label,
  title,
  value,
  subValue,
  trend,
  icon: Icon,
  color,
  bgOpacity = "bg-opacity-20"
}) => {
  const displayLabel = label || title || "Metric";
  const isTrendObject = typeof trend === 'object' && trend !== null;

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4, transition: { duration: 0.2 } }}
      className="bg-white p-6 rounded-2xl shadow-soft border border-slate-100 flex flex-col justify-between h-full relative overflow-hidden group hover:shadow-xl hover:shadow-slate-200/50 transition-all"
    >
      {/* Background Icon Accent (Watermark 100px) */}
      <div 
        className="absolute -right-4 -bottom-4 opacity-[0.05] pointer-events-none transform rotate-12 group-hover:scale-110 transition-all duration-700 text-[#111f42]"
      >
        <Icon size={100} strokeWidth={1} />
      </div>

      <div className="flex justify-between items-start relative z-10">
        <div className="space-y-1">
          <h3 className="text-[12px] font-black text-[#111f42] uppercase tracking-[0.15em] opacity-70">
            {displayLabel}
          </h3>
          <div className="flex items-baseline gap-2">
            <div className="text-3xl font-black text-[#111f42] font-mono tracking-tighter leading-none group-hover:text-[#111f42]/80 transition-colors">
              {value}
            </div>
            {isTrendObject && (
              <span className={clsx(
                "text-[9px] font-black font-mono px-1.5 py-0.5 rounded-md",
                (trend as any).isPositive ? "bg-emerald-50 text-emerald-600 border border-emerald-100" : "bg-red-50 text-red-600 border border-red-100"
              )}>
                {(trend as any).isPositive ? '↑' : '↓'} {(trend as any).value}
              </span>
            )}
          </div>
        </div>
        <div 
          className={twMerge(
            "w-12 h-12 rounded-xl shadow-sm transition-transform group-hover:scale-110 duration-500 flex items-center justify-center border border-white",
            bgOpacity
          )} 
          style={{ 
            backgroundColor: color.startsWith('#') ? `${color}33` : color, // 33 = 20% alpha
            color 
          }} 
        >
          <Icon size={22} strokeWidth={2.5} />
        </div>
      </div>

      <div className="relative z-10 mt-4">
        {subValue && (
          <p className="text-[11px] font-medium text-slate-400 uppercase tracking-widest">{subValue}</p>
        )}
        {!isTrendObject && trend && (
           <p className="text-[11px] font-black text-[#111f42] uppercase tracking-widest leading-none mt-1">{trend as string}</p>
        )}
      </div>
    </motion.div>
  );
}

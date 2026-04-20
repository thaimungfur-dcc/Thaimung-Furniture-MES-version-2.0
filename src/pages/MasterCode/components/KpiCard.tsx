import React from 'react';

interface KpiCardProps {
  title: string;
  val: number | string;
  color: string;
  IconComponent: any;
  desc?: string;
}

export default function KpiCard({ title, val, color, IconComponent, desc }: KpiCardProps) {
  return (
    <div className="bg-white/80 backdrop-blur-xl rounded-2xl p-6 shadow-sm hover:shadow-md transition-all duration-300 border border-white/60 relative overflow-hidden group h-full cursor-pointer">
      <div className="absolute -right-6 -bottom-6 opacity-[0.06] transform rotate-12 group-hover:scale-110 transition-transform duration-700 pointer-events-none z-0" style={{color: color}}>
        <IconComponent size={120} strokeWidth={1.5} />
      </div>
      <div className="relative z-10 flex justify-between items-start">
        <div className="flex-1 min-w-0 flex flex-col gap-1">
          <p className="text-[11px] font-bold text-slate-500 uppercase tracking-widest opacity-90 truncate">{title}</p>
          <div className="flex items-baseline gap-2 mt-1">
            <h4 className="text-3xl font-black tracking-tight leading-tight truncate" style={{color: color}}>{val}</h4>
          </div>
          {desc && (
            <p className="text-[10px] text-slate-400 font-bold mt-2 flex items-center gap-1.5 truncate">
              <span className="w-1.5 h-1.5 rounded-full" style={{backgroundColor: color}}></span>
              {desc}
            </p>
          )}
        </div>
        <div className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0 shadow-sm backdrop-blur-md border border-white/60" style={{backgroundColor: color + '15'}}>
          <IconComponent size={24} color={color} />
        </div>
      </div>
    </div>
  );
}

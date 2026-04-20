import React from 'react';
import { LucideIcon } from 'lucide-react';

interface KpiCardProps {
    title: string;
    val: number | string;
    color: string;
    Icon: LucideIcon;
    desc?: string;
}

export default function KpiCard({ title, val, color, Icon, desc }: KpiCardProps) {
    return (
        <div className="bg-white/80 backdrop-blur-xl rounded-2xl p-6 shadow-sm border border-white/60 relative overflow-hidden group h-full cursor-pointer transition-all hover:shadow-md">
            <div className="absolute -right-6 -bottom-6 opacity-[0.08] transform rotate-12 group-hover:scale-110 transition-transform duration-700 pointer-events-none z-0" style={{color}}>
                <Icon size={120} strokeWidth={1.5} />
            </div>
            <div className="relative z-10 flex justify-between items-start">
                <div className="flex-1 min-w-0 flex flex-col gap-1">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest truncate">{String(title)}</p>
                    <div className="flex items-baseline gap-2 mt-1">
                        <h4 className="text-3xl font-black tracking-tight font-mono leading-none" style={{color}}>{String(val)}</h4>
                    </div>
                    {desc && (
                        <p className="text-[9px] text-slate-400 font-bold mt-2 flex items-center gap-1.5 truncate">
                            <span className="w-1.5 h-1.5 rounded-full" style={{backgroundColor: color}}></span>
                            {String(desc)}
                        </p>
                    )}
                </div>
                <div className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0 shadow-sm border border-white/60" style={{backgroundColor: color + '15'}}>
                    <Icon size={24} color={color} />
                </div>
            </div>
        </div>
    );
}

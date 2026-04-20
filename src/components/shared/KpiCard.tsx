import React from 'react';
import { LucideIcon } from 'lucide-react';

interface KpiCardProps {
    title: string;
    value: string | number;
    icon: LucideIcon;
    colorClass: string;
    trend?: string;
    trendUp?: boolean;
}

export const KpiCard: React.FC<KpiCardProps> = ({ title, value, icon: Icon, colorClass, trend, trendUp }) => {
    return (
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 flex items-center space-x-4">
            <div className={`p-3 rounded-lg ${colorClass}`}>
                <Icon className="w-6 h-6" />
            </div>
            <div>
                <p className="text-sm font-medium text-slate-500">{title}</p>
                <div className="flex items-baseline space-x-2">
                    <h3 className="text-2xl font-bold text-slate-800">{value}</h3>
                    {trend && (
                        <span className={`text-xs font-medium ${trendUp ? 'text-emerald-600' : 'text-rose-600'}`}>
                            {trendUp ? '↑' : '↓'} {trend}
                        </span>
                    )}
                </div>
            </div>
        </div>
    );
};

import React from 'react';
import { LucideIcon } from 'lucide-react';

interface PageHeaderProps {
    title: string;
    subtitle?: string;
    icon?: LucideIcon;
    iconColor?: string;
    actionButton?: React.ReactNode;
    rightContent?: React.ReactNode;
}

export const PageHeader: React.FC<PageHeaderProps> = ({ 
    title, 
    subtitle, 
    icon: Icon, 
    iconColor = 'text-[#111f42]',
    actionButton,
    rightContent
}) => {
    return (
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 flex-shrink-0 z-10 no-print">
            <div className="flex items-center gap-4 w-full md:w-auto">
                {Icon && (
                    <div className={`w-12 h-12 flex items-center justify-center rounded-xl bg-white shadow-sm flex-shrink-0 border border-slate-200 relative ${iconColor}`}>
                        <Icon size={24} strokeWidth={2.5} />
                        <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-emerald-500 rounded-full border-2 border-[#F9F7F6]"></div>
                    </div>
                )}
                <div className="flex flex-col min-w-0">
                    <h1 className="text-2xl font-black text-[#111f42] tracking-tight uppercase truncate">{title}</h1>
                    {subtitle && <p className="text-sm font-bold text-[#72A09E] tracking-widest uppercase mt-0.5 truncate">{subtitle}</p>}
                </div>
            </div>
            {(actionButton || rightContent) && (
                <div className="flex items-center gap-3 w-full md:w-auto overflow-x-auto pb-2 md:pb-0 hide-scrollbar">
                    {rightContent}
                    {actionButton}
                </div>
            )}
        </div>
    );
};

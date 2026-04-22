import React from 'react';
import { LucideIcon } from 'lucide-react';

interface PageHeaderProps {
    title: string;
    subtitle?: string;
    icon?: LucideIcon;
    Icon?: LucideIcon; // Alternative prop name
    iconColor?: string;
    actionButton?: React.ReactNode;
    rightContent?: React.ReactNode;
    extra?: React.ReactNode; // Alternative prop name
}

export const PageHeader: React.FC<PageHeaderProps> = ({ 
    title, 
    subtitle, 
    icon, 
    Icon: IconAlt,
    iconColor = 'text-[#111f42]',
    actionButton,
    rightContent,
    extra
}) => {
    const ActiveIcon = icon || IconAlt;
    const currentRightContent = rightContent || actionButton || extra;

    return (
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 flex-shrink-0 z-10 no-print pt-2 pb-2 bg-transparent border-none w-full">
            <div className="flex items-center gap-4 w-full md:w-auto">
                {ActiveIcon && (
                    <div className={`w-10 h-10 flex items-center justify-center rounded-2xl bg-white flex-shrink-0 border border-slate-200 relative ${iconColor} shadow-sm overflow-hidden`}>
                        <ActiveIcon size={20} strokeWidth={2.5} className="z-10" />
                        <div className="absolute inset-0 bg-current opacity-5 z-0"></div>
                    </div>
                )}
                <div className="flex flex-col min-w-0">
                    <h1 className="text-[24px] font-black text-[#111f42] tracking-tight uppercase leading-none">{title}</h1>
                    {subtitle && <p className="text-[11px] font-medium text-slate-500 tracking-normal mt-0.5 truncate uppercase">{subtitle}</p>}
                </div>
            </div>
            {currentRightContent && (
                <div className="flex items-center gap-3 w-full md:w-auto overflow-x-auto lg:overflow-visible pb-2 md:pb-0 hide-scrollbar mt-2 md:mt-0">
                    {currentRightContent}
                </div>
            )}
        </div>
    );
};

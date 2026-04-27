import React from 'react';
import { Loader2, LucideIcon } from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger' | 'success';
  size?: 'sm' | 'md' | 'lg' | 'icon' | 'action';
  isLoading?: boolean;
  leftIcon?: LucideIcon;
  rightIcon?: LucideIcon;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', isLoading, leftIcon: LeftIcon, rightIcon: RightIcon, children, disabled, ...props }, ref) => {
    
    const variants = {
      primary: 'bg-[#111f42] text-white hover:brightness-110 shadow-lg shadow-blue-900/10 border-transparent',
      secondary: 'bg-[#ab8a3b] text-[#111f42] hover:bg-[#c0a158] shadow-lg shadow-amber-900/10 border-transparent',
      outline: 'bg-white text-[#111f42] border-slate-200 hover:bg-slate-50 hover:border-slate-300 shadow-sm',
      ghost: 'bg-transparent text-slate-600 hover:bg-slate-100 border-transparent shadow-none',
      danger: 'bg-rose-500 text-white hover:bg-rose-600 shadow-lg shadow-rose-900/10 border-transparent',
      success: 'bg-emerald-500 text-white hover:bg-emerald-600 shadow-lg shadow-emerald-900/10 border-transparent',
    };

    const sizes = {
      sm: 'px-4 py-2 text-[10px]',
      md: 'px-6 py-3 text-[11px]',
      lg: 'px-8 py-4 text-[12px]',
      icon: 'p-2.5',
      action: 'w-8 h-8 p-0',
    };

    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        className={cn(
          'inline-flex items-center justify-center gap-2.5 font-black uppercase tracking-[0.2em] transition-all active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed border-2 rounded-[20px]',
          variants[variant],
          sizes[size],
          size === 'action' && 'rounded-md border',
          className
        )}
        {...props}
      >
        {isLoading ? (
          <Loader2 className="animate-spin" size={size === 'action' ? 15 : size === 'sm' ? 14 : 18} />
        ) : (
          <>
            {LeftIcon && <LeftIcon size={size === 'action' ? 15 : size === 'sm' ? 14 : 18} />}
            {children}
            {RightIcon && <RightIcon size={size === 'action' ? 15 : size === 'sm' ? 14 : 18} />}
          </>
        )}
      </button>
    );
  }
);

Button.displayName = 'Button';

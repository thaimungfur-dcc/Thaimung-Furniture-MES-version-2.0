import React from 'react';
import { NavLink } from 'react-router-dom';
import { motion } from 'motion/react';
import { 
  LayoutDashboard, 
  Activity, 
  Package, 
  DollarSign, 
  Calculator, 
  FileText, 
  CreditCard, 
  Users,
  ChevronLeft,
  ChevronRight,
  Lock
} from 'lucide-react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { useAuth } from '../context/AuthContext';

interface SidebarProps {
  isCollapsed: boolean;
  setIsCollapsed: (value: boolean) => void;
}

const MENU_ITEMS = [
  { path: '/', name: 'Dashboard', icon: LayoutDashboard, isConfidential: false },
  { path: '/production', name: 'Production Tracking', icon: Activity, isConfidential: false },
  { path: '/warehouse', name: 'Warehouse', icon: Package, isConfidential: false },
  { path: '/financial', name: 'Financial', icon: DollarSign, isConfidential: true },
  { path: '/cost-control', name: 'Cost Control', icon: Calculator, isConfidential: true },
  { path: '/quotation', name: 'Quotation', icon: FileText, isConfidential: true },
  { path: '/credit-analysis', name: 'Credit Analysis', icon: CreditCard, isConfidential: true },
  { path: '/permissions', name: 'User Permissions', icon: Users, isConfidential: true },
];

export default function Sidebar({ isCollapsed, setIsCollapsed }: SidebarProps) {
  const { user } = useAuth();

  return (
    <motion.aside
      initial={false}
      animate={{ width: isCollapsed ? 80 : 280 }}
      className="relative flex h-screen flex-col border-r border-gray-200 bg-white shadow-sm"
    >
      {/* Toggle Button */}
      <button
        onClick={() => setIsCollapsed(!isCollapsed)}
        className="absolute -right-4 top-8 z-10 flex h-8 w-8 items-center justify-center rounded-full border border-gray-200 bg-amber-400 text-white shadow-md hover:bg-amber-500 focus:outline-none"
      >
        {isCollapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
      </button>

      {/* Logo Area */}
      <div className="flex h-20 items-center justify-center border-b border-gray-100">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-600 text-white font-bold text-xl">
            C
          </div>
          {!isCollapsed && (
            <motion.span 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-xl font-bold text-gray-800"
            >
              ClientPortal
            </motion.span>
          )}
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-6 px-3 space-y-1">
        {MENU_ITEMS.map((item) => {
          const Icon = item.icon;
          
          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) => twMerge(clsx(
                "group flex items-center rounded-lg px-3 py-3 text-sm font-medium transition-colors relative",
                isActive 
                  ? "bg-blue-50 text-blue-700" 
                  : "text-gray-700 hover:bg-gray-100 hover:text-gray-900",
                isCollapsed && "justify-center"
              ))}
              title={isCollapsed ? item.name : undefined}
            >
              <Icon size={20} className={clsx("shrink-0", isCollapsed ? "mr-0" : "mr-3")} />
              
              {!isCollapsed && (
                <span className="flex-1 truncate">{item.name}</span>
              )}

              {item.isConfidential && (
                <Lock 
                  size={14} 
                  className={clsx(
                    "text-red-500", 
                    isCollapsed ? "absolute top-2 right-2" : "ml-auto"
                  )} 
                />
              )}
            </NavLink>
          );
        })}
      </nav>

      {/* User Profile Area */}
      {user && (
        <div className="border-t border-gray-200 p-4">
          <div className={clsx("flex items-center", isCollapsed ? "justify-center" : "gap-3")}>
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gray-200 text-gray-600 font-bold">
              {user.name.charAt(0)}
            </div>
            {!isCollapsed && (
              <div className="flex flex-col overflow-hidden">
                <span className="truncate text-sm font-medium text-gray-900">{user.name}</span>
                <span className="truncate text-xs text-gray-500">{user.role}</span>
              </div>
            )}
          </div>
        </div>
      )}
    </motion.aside>
  );
}

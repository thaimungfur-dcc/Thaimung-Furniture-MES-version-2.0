import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { 
  LayoutDashboard, 
  Activity, 
  Package, 
  DollarSign, 
  Calculator, 
  Users,
  ChevronLeft,
  ChevronRight,
  Lock,
  Calendar,
  ShoppingCart,
  Truck,
  ClipboardList,
  ShieldCheck,
  Settings,
  Database,
  ChevronDown,
  Warehouse,
  ShoppingBag,
  Factory,
  BarChart3
} from 'lucide-react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { useAuth } from '../context/AuthContext';

interface SidebarProps {
  isCollapsed: boolean;
  setIsCollapsed: (value: boolean) => void;
}

interface MenuItem {
  path: string;
  name: string;
  icon: any;
  isConfidential?: boolean;
}

interface MenuSection {
  title: string;
  items: MenuItem[];
}

const MENU_SECTIONS: MenuSection[] = [
  {
    title: 'CORE HUB',
    items: [
      { path: '/', name: 'Dashboard', icon: LayoutDashboard },
      { path: '/calendar', name: 'MES Calendar', icon: Calendar },
    ]
  },
  {
    title: 'OPERATIONS',
    items: [
      { path: '/production', name: 'Production Tracking', icon: Activity },
      { path: '/warehouse-in', name: 'Warehouse In', icon: Warehouse },
      { path: '/warehouse-out', name: 'Warehouse Out', icon: Truck },
      { path: '/stock-card', name: 'Stock Card', icon: Package },
      { path: '/inventory-planning', name: 'Inventory Planning', icon: ClipboardList },
    ]
  },
  {
    title: 'WORKFLOW',
    items: [
      { path: '/sale', name: 'Sale Order', icon: ShoppingCart },
      { path: '/purchase-requisition', name: 'Requisition (PR)', icon: FileText },
      { path: '/purchase-order', name: 'Purchase (PO)', icon: ShoppingBag },
      { path: '/purchase-nc', name: 'Purchase NC', icon: AlertTriangle },
    ]
  },
  {
    title: 'QUALITY & STANDARDS',
    items: [
      { path: '/inspection-standards', name: 'Standards', icon: ShieldCheck },
      { path: '/nc-control', name: 'NC Control', icon: AlertCircle },
      { path: '/qc-report', name: 'QC Reports', icon: BarChart3 },
    ]
  },
  {
    title: 'FINANCIAL & COSTING',
    items: [
      { path: '/cashflow', name: 'Cash Flow', icon: DollarSign, isConfidential: true },
      { path: '/product-cost', name: 'Product Cost', icon: Calculator, isConfidential: true },
      { path: '/accounts-receivable', name: 'AR Tracking', icon: CreditCard, isConfidential: true },
      { path: '/account-payable', name: 'AP Tracking', icon: Landmark, isConfidential: true },
      { path: '/vat-management', name: 'VAT Management', icon: Percent, isConfidential: true },
    ]
  },
  {
    title: 'SYSTEM CONTROL',
    items: [
      { path: '/code-master', name: 'Master Codes', icon: Database },
      { path: '/item-master', name: 'Item Master', icon: Box },
      { path: '/recipe-bom', name: 'Recipe (BOM)', icon: ClipboardList },
      { path: '/customer', name: 'Customer Master', icon: Users },
      { path: '/supplier', name: 'Supplier Master', icon: Factory },
      { path: '/permissions', name: 'User Permissions', icon: ShieldCheck, isConfidential: true },
      { path: '/system-config', name: 'System Config', icon: Settings, isConfidential: true },
    ]
  }
];

// Helper icons missing from earlier import (handled by lucide-react standard imports if available)
import { 
  FileText, 
  AlertTriangle, 
  AlertCircle, 
  Landmark, 
  Percent, 
  Box, 
  CreditCard 
} from 'lucide-react';

export default function Sidebar({ isCollapsed, setIsCollapsed }: SidebarProps) {
  const { user } = useAuth();
  const [expandedSections, setExpandedSections] = useState<string[]>(MENU_SECTIONS.map(s => s.title));

  const toggleSection = (title: string) => {
    setExpandedSections(prev => 
      prev.includes(title) ? prev.filter(t => t !== title) : [...prev, title]
    );
  };

  return (
    <motion.aside
      initial={false}
      animate={{ width: isCollapsed ? 80 : 280 }}
      className="relative flex h-screen flex-col border-r border-[#111f42]/10 bg-white shadow-xl z-50 overflow-hidden"
    >
      {/* Toggle Button */}
      <button
        onClick={() => setIsCollapsed(!isCollapsed)}
        className="absolute -right-4 top-8 z-[60] flex h-8 w-8 items-center justify-center rounded-full border border-[#111f42]/10 bg-white text-[#111f42] shadow-xl hover:bg-slate-50 transition-all focus:outline-none"
      >
        {isCollapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
      </button>

      {/* Logo Area */}
      <div className="flex h-24 items-center px-6 border-b border-[#111f42]/5 bg-slate-50/30">
        <div className="flex items-center gap-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#111f42] text-[#ab8a3b] font-black text-2xl shadow-lg border border-white/10">
            T
          </div>
          {!isCollapsed && (
            <motion.div 
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex flex-col"
            >
              <span className="text-xl font-black text-[#111f42] tracking-tighter leading-none">THAIMUNG</span>
              <span className="text-[10px] font-black text-[#E3624A] tracking-[0.3em] uppercase mt-1">FURNITURE MES</span>
            </motion.div>
          )}
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-8 px-4 space-y-8 sidebar-scrollbar">
        {MENU_SECTIONS.map((section) => (
          <div key={section.title} className="space-y-3">
            {!isCollapsed && (
              <button 
                onClick={() => toggleSection(section.title)}
                className="flex items-center justify-between w-full px-2 mb-2 group"
              >
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">{section.title}</span>
                <ChevronDown 
                  size={12} 
                  className={clsx(
                    "text-slate-300 transition-transform duration-300 group-hover:text-slate-500",
                    !expandedSections.includes(section.title) && "-rotate-90"
                  )} 
                />
              </button>
            )}

            <AnimatePresence initial={false}>
              {(isCollapsed || expandedSections.includes(section.title)) && (
                <motion.div 
                  initial={isCollapsed ? false : { height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="space-y-1.5 overflow-hidden"
                >
                  {section.items.map((item) => {
                    const Icon = item.icon;
                    return (
                      <NavLink
                        key={item.path}
                        to={item.path}
                        className={({ isActive }) => twMerge(clsx(
                          "group flex items-center rounded-2xl px-3.5 py-3 text-[13px] font-bold transition-all relative",
                          isActive 
                            ? "bg-[#111f42] text-white shadow-lg shadow-blue-900/10" 
                            : "text-slate-600 hover:bg-slate-50 hover:text-[#111f42]",
                          isCollapsed && "justify-center px-0"
                        ))}
                        title={isCollapsed ? item.name : undefined}
                      >
                        <Icon 
                          size={18} 
                          strokeWidth={2.5}
                          className={clsx(
                            "shrink-0 transition-colors", 
                            isCollapsed ? "mr-0" : "mr-4",
                            "group-hover:text-[#ab8a3b]"
                          )} 
                        />
                        
                        {!isCollapsed && (
                          <span className="flex-1 truncate tracking-tight">{item.name}</span>
                        )}

                        {item.isConfidential && (
                          <div className={clsx(
                            "flex items-center justify-center",
                            isCollapsed ? "absolute top-1 right-1" : "ml-auto"
                          )}>
                            <Lock size={12} className="text-[#E3624A]" />
                          </div>
                        )}
                      </NavLink>
                    );
                  })}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ))}
      </nav>

      {/* User Profile Area */}
      {user && (
        <div className="border-t border-[#111f42]/5 p-5 bg-slate-50/30">
          <div className={clsx("flex items-center", isCollapsed ? "justify-center" : "gap-4")}>
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-white text-[#111f42] font-black text-lg shadow-sm border border-slate-200">
              {user.name.charAt(0)}
            </div>
            {!isCollapsed && (
              <div className="flex flex-col min-w-0">
                <span className="truncate text-sm font-black text-[#111f42] uppercase tracking-tight">{user.name}</span>
                <span className="truncate text-[10px] font-black text-[#ab8a3b] uppercase tracking-widest mt-0.5">{user.role}</span>
              </div>
            )}
          </div>
        </div>
      )}
    </motion.aside>
  );
}

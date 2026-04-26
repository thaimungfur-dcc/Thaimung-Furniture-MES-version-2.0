import React, { useState, useEffect } from 'react';
import { Outlet, NavLink, useLocation, useNavigate } from 'react-router-dom';
import { useGoogleAuth } from '../context/GoogleAuthContext';
import SecurityGuard from './SecurityGuard';
import Watermark from './Watermark';
import { 
  Settings, Box, Activity, Cpu, ClipboardList, Users, ShieldCheck, Database, 
  Wrench, AlertTriangle, CheckCircle2, Clock, TrendingUp, ChevronRight, 
  ChevronLeft, LayoutGrid, LogOut, Bell, Search, Zap, Gauge, BarChart3, 
  Layers, Factory, Timer, FileText, AlertCircle, Mail, Phone, Package, 
  Calendar, ArrowUpRight, Circle, Wallet, ShoppingCart, HeartHandshake, 
  ArrowDownLeft, Briefcase, Truck, Calculator, Armchair, AlertOctagon,
  Clock4, CheckSquare, XCircle, Info, ArrowRight
} from 'lucide-react';

export const menuModules = [
  { name: 'SALE', label: 'Sale', icon: ShoppingCart, path: '/sale', subItems: [
    { label: 'Catalogue', path: '/catalogue' },
    { label: 'Orders', path: '/sale' },
    { label: 'Sale Analysis', path: '/sale-analysis' },
    { label: 'Customer', path: '/customer' },
    { label: 'Accounts Receivable', path: '/accounts-receivable' },
    { label: 'Sale Calendar', path: '/sale-calendar' }
  ]},
  { name: 'WAREHOUSE', label: 'Warehouse', icon: Package, path: '/warehouse', subItems: [
    { label: 'Warehouse In', path: '/warehouse-in' },
    { label: 'Warehouse Out', path: '/warehouse-out' },
    { label: 'Warehouse Booking', path: '/warehouse-booking' },
    { label: 'Inventory & Planning', path: '/inventory-planning' },
    { label: 'Stock Card', path: '/stock-card' },
    { label: 'Logistics', path: '/logistics' },
    { label: 'Return Goods', path: '/return-goods' },
    { label: 'WH Calendar', path: '/wh-calendar' }
  ]},
  { name: 'PROCUREMENT', label: 'Procurement', icon: Truck, path: '/procurement', subItems: [
    { label: 'Purchase Requisition (PR)', path: '/purchase-requisition' },
    { label: 'Purchase Order (PO)', path: '/purchase-order' },
    { label: 'PR Analysis', path: '/pr-analysis' },
    { label: 'PO Analysis', path: '/po-analysis' },
    { label: 'Purchase History', path: '/purchase-history' },
    { label: 'Supplier', path: '/supplier' },
    { label: 'Purchase NC (SCAR)', path: '/purchase-nc' }
  ]},
  { name: 'PLANNING', label: 'Planning', icon: ClipboardList, path: '/planning', subItems: [
    { label: 'Production Planning', path: '/production-planning' },
    { label: 'Master Schedule (MPS)', path: '/mps' },
    { label: 'Mat. Require Plan', path: '/mrp' },
    { label: 'Job Tracking', path: '/job-tracking' }
  ]},
  { name: 'PRODUCTION', label: 'Production', icon: Factory, path: '/production', subItems: [
    { label: 'Production Tracking', path: '/production-tracking' },
    { label: 'Production Report', path: '/production-report' }
  ]},
  { name: 'QUALITY_CONTROL', label: 'Quality Control', icon: ShieldCheck, path: '/qc', subItems: [
    { label: 'Inspection Standards', path: '/inspection-standards' },
    { label: 'QC Report', path: '/qc-report' },
    { label: 'NC Control', path: '/nc-control' }
  ]},
  { name: 'FINANCIAL', label: 'Financial', icon: Wallet, path: '/financial', subItems: [
    { label: 'Data Entry', path: '/data-entry' },
    { label: 'Account Receivable (AR)', path: '/accounts-receivable' },
    { label: 'Account Payable (AP)', path: '/account-payable' },
    { label: 'Bank Reconciliation', path: '/bank-reconciliation' },
    { label: 'Petty Cash', path: '/petty-cash' },
    { label: 'General Ledger (GL)', path: '/general-ledger' },
    { label: 'Fixed Asset', path: '/fixed-asset' },
    { label: 'Cash Flow', path: '/cashflow' },
    { label: 'VAT Management (Tax)', path: '/vat-management' }
  ]},
  { name: 'COST_CONTROL', label: 'Cost Control', icon: Calculator, path: '/cost-control', subItems: [
    { label: 'Product Cost', path: '/product-cost' },
    { label: 'Cost Analysis', path: '/cost-analysis' },
    { label: 'Recipe BOM', path: '/recipe-bom' }
  ]},
  { name: 'CODE_MASTER', label: 'Code Master', icon: Database, path: '/code-master', subItems: [
    { label: 'Code Master', path: '/code-master' },
    { label: 'Item Master', path: '/item-master' },
    { label: 'Production Standards', path: '/production-standards' },
    { label: 'Fabric Design', path: '/fabric-design' }
  ]},
  { name: 'SETTING', label: 'Setting', icon: Settings, path: '/permissions', subItems: [
    { label: 'User Permissions', path: '/permissions' },
    { label: 'System Config', path: '/system-config' }
  ]}
];

import { DateTimeBadge } from './shared/DateTimeBadge';

// ... (existing imports)

export default function Layout() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [expandedModule, setExpandedModule] = useState<string | null>(null);
  const { user, logout, isAuthenticated } = useGoogleAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const userProfile = {
    name: user?.displayName || 'T-DCC Developer',
    email: user?.email || 'tallintelligence.dcc@gmail.com',
    position: 'System Administrator',
    avatar: user?.photoURL || 'https://drive.google.com/thumbnail?id=1Z_fRbN9S4aA7OkHb3mlim_t60wIT4huY&sz=w400'
  };

  const palette = {
    primary: '#111f42',     // Navy
    accent: '#E3624A',      // Terracotta
    deepRed: '#952425',     // Dark Red
    gold: '#111f42',        // Changed from gold to navy
    success: '#10b981',     // Green
    warning: '#f59e0b',     // Amber
    danger: '#ef4444',      // Red
    muted: '#72A09E',       // Muted Teal
    slate: '#4e546a',       // Slate
    lightBg: '#F9F7F6'      // Neutral Bg
  };

  const isDemoMode = !import.meta.env.VITE_APPS_SCRIPT_URL;

  return (
    <SecurityGuard>
      {isAuthenticated && <Watermark />}
      
      {/* Demo Mode Banner */}
      {isDemoMode && (
        <div className="bg-[#111f42] text-white py-2 px-6 flex items-center justify-between z-[100] relative shadow-lg no-print">
          <div className="flex items-center gap-3">
            <AlertTriangle size={18} className="animate-pulse" />
            <span className="text-[10px] md:text-[11px] font-black uppercase tracking-[0.1em]">
              Running in Demo Mode (Mock Data). Connect your Google Sheet via <code className="bg-white/20 px-2 py-0.5 rounded-lg">DEPLOYMENT.md</code> to enable real storage.
            </span>
          </div>
          <button 
            onClick={() => navigate('/system-config')}
            className="px-4 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all bg-white/20 hover:bg-white/30 text-white border border-white/40"
          >
            Configure Now
          </button>
        </div>
      )}

      <div className="flex h-screen overflow-hidden bg-[#F9F7F6] text-[#1c213f]">
        {/* SIDEBAR */}
        <div className={`relative h-full flex shrink-0 z-50 transition-all duration-300 ${isSidebarOpen ? 'w-[280px]' : 'w-[88px]'} no-print`}>
          {/* ... (sidebar content remained largely the same, I already updated menu items) ... */}
          <aside className="bg-gradient-to-b from-[#0a2438] to-[#202024] text-white/70 flex flex-col w-full h-full overflow-hidden shadow-2xl relative">
            
            <div className={`p-6 flex items-center ${isSidebarOpen ? 'gap-4' : 'justify-center'} shrink-0 h-24`}>
              <div className="w-12 h-12 bg-gradient-to-br from-[#952425] to-[#E3624A] rounded-xl flex items-center justify-center text-white shrink-0 shadow-lg shadow-[#952425]/20 border border-white/20">
                <Armchair size={26} />
              </div>
              {isSidebarOpen && (
                <div className="flex flex-col whitespace-nowrap overflow-hidden">
                  <div className="text-white font-black tracking-widest text-[20px] leading-none uppercase drop-shadow-md font-mono">
                    FURNITURE <span className="text-[#E3624A]">MES</span>
                  </div>
                  <div className="text-white/40 text-[8px] font-black tracking-[0.3em] uppercase mt-1.5 font-mono">Industrial Gateway</div>
                </div>
              )}
            </div>

            <nav className="flex-1 overflow-y-auto sidebar-scrollbar px-3 py-2 space-y-1 mt-2">
              <button 
                onClick={() => navigate('/')}
                className={`w-full flex items-center h-12 rounded-xl transition-all font-black tracking-[0.2em] text-[10px] uppercase mb-6 ${isSidebarOpen ? 'px-4 justify-start' : 'justify-center'} ${location.pathname === '/' ? 'bg-gradient-to-r from-[#952425] to-[#E3624A] text-white shadow-lg' : 'hover:bg-white/5'}`}
              >
                <LayoutGrid size={18} className="shrink-0" />
                {isSidebarOpen && <span className="ml-4 truncate">CONTROL CENTER</span>}
              </button>

              <div className="mb-6">
                <button 
                  onClick={() => navigate('/calendar')}
                  className={`w-full flex items-center h-[44px] rounded-lg transition-all text-sm uppercase tracking-wide group relative overflow-hidden ${isSidebarOpen ? 'px-4 justify-start' : 'justify-center'} ${location.pathname === '/calendar' ? 'bg-gradient-to-r from-[#952425] to-[#E3624A] text-white font-bold shadow-lg shadow-[#952425]/20' : 'text-white/70 hover:bg-white/5 font-medium hover:font-semibold'}`}
                >
                  <Calendar size={20} className={`shrink-0 transition-colors ${location.pathname === '/calendar' ? 'text-white' : 'text-[#E3624A]/80 group-hover:text-white'}`} />
                  {isSidebarOpen && <span className="ml-3.5 truncate">MES Calendar</span>}
                </button>
              </div>

              <div className="pb-4">
                <p className={`text-[9px] font-black tracking-[0.4em] text-[#E3624A]/60 mb-4 px-4 uppercase ${!isSidebarOpen && 'hidden'}`}>
                  OPERATIONAL MODULES
                </p>
                
                {menuModules?.map((module, index) => {
                  const isExpanded = expandedModule === module.name;
                  const isActive = location.pathname === module.path || module.subItems?.some(sub => location.pathname === sub.path);
                  return (
                    <div key={index} className="flex flex-col mb-1 relative">
                      <button 
                        onClick={() => {
                          if (!isSidebarOpen) setIsSidebarOpen(true);
                          setExpandedModule(isExpanded ? null : module.name);
                          // User wants to stay on current page if only root is selected and no content exists
                          // navigate(module.path); 
                        }}
                        className={`w-full flex items-center h-[44px] rounded-lg transition-all text-sm uppercase tracking-wide group relative overflow-hidden ${isSidebarOpen ? 'px-4 justify-between' : 'justify-center'} ${isActive ? 'bg-gradient-to-r from-[#952425] to-[#E3624A] text-white font-bold shadow-lg shadow-[#952425]/20' : 'text-white/70 hover:bg-white/5 font-medium hover:font-semibold'}`}
                      >
                        {/* Shimmer Effect for Active */}
                        {isActive && (
                          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full animate-[shimmer_2.5s_infinite] pointer-events-none" />
                        )}
                        
                        <div className="flex items-center min-w-0 z-10">
                          <module.icon 
                            size={20} 
                            className={`shrink-0 transition-colors ${isActive ? 'text-white' : 'text-[#E3624A]/80 group-hover:text-white'}`} 
                          />
                          {isSidebarOpen && <span className="ml-3.5 truncate">{module.label}</span>}
                        </div>
                        {isSidebarOpen && (
                          <ChevronRight size={12} className={`transition-transform duration-200 shrink-0 z-10 ${isExpanded ? 'rotate-90' : 'opacity-40'}`} />
                        )}
                      </button>
                      
                      <div className={`overflow-hidden transition-all duration-300 ${isExpanded && isSidebarOpen ? 'max-h-[800px] mt-1 mb-2 opacity-100' : 'max-h-0 opacity-0'}`}>
                        <div className="ml-5.5 space-y-0.5 border-l-2 border-white/10 pl-3">
                          {module.subItems?.map((sub, i) => {
                            const isSubActive = location.pathname === sub.path;
                            
                            return (
                            <button 
                              key={i} 
                              onClick={(e) => {
                                e.stopPropagation();
                                navigate(sub.path);
                              }}
                              className={`w-full flex items-center text-left py-2 px-3 rounded-md text-[11px] uppercase tracking-widest group transition-all ${isSubActive ? 'text-white font-bold bg-white/10' : 'text-white/40 font-medium hover:text-white hover:bg-white/5'}`}
                            >
                              <span className={`w-1.5 h-1.5 rounded-full mr-2.5 transition-colors shrink-0 ${isSubActive ? 'bg-white' : 'bg-white/20 group-hover:bg-white'}`}></span>
                              <span className="truncate leading-tight">{sub.label}</span>
                            </button>
                          )})}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </nav>

             <div className="px-4 py-3 shrink-0 border-t border-white/5">
              <div className={`flex items-center ${isSidebarOpen ? 'px-1' : 'justify-center'}`}>
                 <div className="relative shrink-0">
                    <img src={userProfile.avatar} alt="User Profile" className="w-11 h-11 rounded-xl border-2 border-white/10 object-cover shadow-2xl" referrerPolicy="no-referrer" />
                    <div className="absolute -bottom-1 -right-1 w-3.5 h-3.5 bg-emerald-500 border-2 border-[#202024] rounded-full shadow-sm"></div>
                 </div>
                {isSidebarOpen && (
                  <div className="overflow-hidden flex flex-col ml-4 min-w-0 flex-1">
                    <div className="text-white font-black text-[12px] tracking-normal truncate leading-tight uppercase font-mono">{userProfile.name}</div>
                    <div className="flex items-center justify-between mt-1">
                      <div className="text-[#E3624A] font-bold text-[8px] tracking-[0.2em] uppercase opacity-90">{userProfile.position}</div>
                      <button onClick={logout} className="text-[#72A09E] hover:text-white transition-all flex items-center gap-1.5 group" title="Secure Logout">
                        <LogOut size={10} strokeWidth={2.5} className="group-hover:translate-x-0.5 transition-transform" />
                        <span className="text-[7.5px] font-black tracking-[0.1em] uppercase">Sign Out</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
              {!isSidebarOpen && (
                <button onClick={logout} className="w-full flex items-center justify-center text-[#72A09E] h-8 hover:text-white transition-all mt-2" title="Sign Out">
                  <LogOut size={15} className="shrink-0" /> 
                </button>
              )}
            </div>
          </aside>

          <button 
            onClick={() => setIsSidebarOpen(!isSidebarOpen)} 
            className="absolute top-10 -right-3.5 w-8 h-8 bg-[#952425] rounded-full text-white flex items-center justify-center shadow-2xl transition-all hover:scale-110 z-50 border-2 border-white transform hover:-rotate-12"
          >
            {isSidebarOpen ? <ChevronLeft size={18} strokeWidth={3} /> : <ChevronRight size={18} strokeWidth={3} />}
          </button>
        </div>

        {/* MAIN CONTENT AREA */}
        <main className="flex-1 flex flex-col min-h-screen relative w-full overflow-x-hidden overflow-y-auto master-custom-scrollbar">
          <header className="flex flex-wrap items-center justify-between px-4 sm:px-6 md:px-8 py-4 bg-white/90 backdrop-blur-md sticky top-0 z-40 border-b border-black/5 gap-4 no-print min-h-[72px] shadow-sm">
            <div className="min-w-0">
              <h2 className="text-[#1c213f] font-black tracking-widest text-[14px] uppercase flex items-center gap-2.5 truncate">
                <Briefcase size={20} style={{ color: palette.deepRed }} strokeWidth={2.5} className="shrink-0" />
                <span className="truncate">
                  <span style={{ WebkitTextStroke: '0.4px currentColor' }}>FURNITURE</span> <span style={{ color: palette.accent }}>MES</span> WORKSPACE
                </span>
              </h2>
            </div>
            
            <DateTimeBadge />
          </header>

          <div className="w-full flex-1 flex flex-col sys-page-layout space-y-4">
            <Outlet />
          </div>

          <footer className="py-3.5 px-4 sm:px-6 md:px-8 border-t border-black/5 mt-8 bg-transparent text-center shrink-0 no-print">
            <div className="w-full mx-auto flex flex-col gap-1.5">
              <div className="flex items-center justify-center gap-2 text-xs font-black tracking-[0.2em] text-[#4e546a] uppercase">
                <Settings size={13} className="text-master-blue shrink-0" />
                <span>FURNITURE MES CORE • SMART FACTORY ARCHITECTURE • VER 2024.1</span>
              </div>
              <div className="flex items-center justify-center flex-wrap gap-x-4 gap-y-1 text-[11px] font-medium text-slate-500">
                <span>System by <span className="font-black text-master-blue">T All Intelligence</span></span>
                <span className="text-slate-300/60 leading-none">|</span>
                <span className="flex items-center gap-1.5"><Phone size={12} className="text-master-blue" /> 082-5695654</span>
                <span className="text-slate-300/60 leading-none">|</span>
                <span className="flex items-center gap-1.5"><Mail size={12} className="text-master-blue" /> tallintelligence.ho@gmail.com</span>
              </div>
            </div>
          </footer>
        </main>
      </div>
    </SecurityGuard>
  );
}

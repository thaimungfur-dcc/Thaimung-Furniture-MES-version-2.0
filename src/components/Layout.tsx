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
  { name: 'MES_CALENDAR', label: 'MES Calendar', icon: Calendar, path: '/calendar', subItems: [
    { label: 'Factory Schedule', path: '/factory-schedule' },
    { label: 'Maintenance Calendar', path: '/maintenance-calendar' },
    { label: 'Shift Planning', path: '/shift-planning' }
  ]},
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

export default function Layout() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [expandedModule, setExpandedModule] = useState<string | null>(null);
  const [currentTime, setCurrentTime] = useState(new Date());
  const { user, logout, isAuthenticated } = useGoogleAuth();
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const dayName = currentTime.toLocaleDateString('en-US', { weekday: 'long' }).toUpperCase();
  const dateString = currentTime.toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' });
  const formattedTimeShort = currentTime.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false });

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
    gold: '#ab8a3b',        // Gold
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
        <div className="bg-[#ab8a3b] text-white py-2 px-6 flex items-center justify-between z-[100] relative shadow-lg">
          <div className="flex items-center gap-3">
            <AlertTriangle size={18} className="animate-pulse" />
            <span className="text-[10px] md:text-[11px] font-black uppercase tracking-[0.1em]">
              Running in Demo Mode (Mock Data). Connect your Google Sheet via <code className="bg-white/20 px-2 py-0.5 rounded">DEPLOYMENT.md</code> to enable real storage.
            </span>
          </div>
          <button 
            onClick={() => navigate('/system-config')}
            className="bg-white/20 hover:bg-white/30 text-white px-4 py-1 rounded-full text-[9px] font-black uppercase tracking-widest transition-all"
          >
            Configure Now
          </button>
        </div>
      )}

      <div className="flex h-screen overflow-hidden bg-[#F9F7F6] text-[#1c213f]">
        <style>{`
          @import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;700;800&family=Noto+Sans+Thai:wght@300;400;500;600;700&display=swap');
          
          * { font-family: 'JetBrains Mono', 'Noto Sans Thai', sans-serif !important; }
          .custom-scrollbar::-webkit-scrollbar { width: 6px; }
          .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
          .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(0,0,0,0.1); border-radius: 10px; }
          .sidebar-scrollbar::-webkit-scrollbar { width: 4px; }
          .sidebar-scrollbar::-webkit-scrollbar-track { background: transparent; }
          .sidebar-scrollbar::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); border-radius: 10px; }
          .active-gradient {
            background: linear-gradient(to right, #952425, #E3624A);
            color: white !important;
            box-shadow: 0 10px 15px -3px rgba(149, 36, 37, 0.3);
          }
        `}</style>

        {/* SIDEBAR */}
        <div className={`relative h-full flex shrink-0 z-50 transition-all duration-300 ${isSidebarOpen ? 'w-[280px]' : 'w-[88px]'}`}>
          <aside className="bg-gradient-to-b from-[#0a2438] to-[#202024] text-white/70 flex flex-col w-full h-full overflow-hidden shadow-2xl relative">
            
            <div className={`p-6 flex items-center ${isSidebarOpen ? 'gap-4' : 'justify-center'} shrink-0 h-24`}>
              <div className="w-12 h-12 bg-gradient-to-br from-[#952425] to-[#E3624A] rounded-2xl flex items-center justify-center text-white shrink-0 shadow-lg shadow-[#952425]/20">
                <Armchair size={26} />
              </div>
              {isSidebarOpen && (
                <div className="flex flex-col whitespace-nowrap overflow-hidden">
                  <div className="text-white font-black tracking-tight text-[22px] leading-none uppercase drop-shadow-md">
                    <span style={{ WebkitTextStroke: '0.5px currentColor' }}>FURNITURE</span> <span className="text-[#E3624A]">MES</span>
                  </div>
                  <div className="text-white/40 text-[9px] font-bold tracking-[0.2em] uppercase mt-1.5">Manufacturing System</div>
                </div>
              )}
            </div>

            <nav className="flex-1 overflow-y-auto sidebar-scrollbar px-4 py-2 space-y-1 mt-2">
              <button 
                onClick={() => navigate('/')}
                className={`w-full flex items-center h-11 rounded-2xl transition-all font-black tracking-widest text-[11px] uppercase mb-4 ${isSidebarOpen ? 'px-4 justify-start' : 'justify-center'} ${location.pathname === '/' ? 'active-gradient' : 'hover:bg-white/5'}`}
              >
                <LayoutGrid size={19} className="shrink-0" />
                {isSidebarOpen && <span className="ml-4 truncate">OVERVIEW</span>}
              </button>

              <div className="pb-2">
                <p className={`text-[10px] font-black tracking-[0.3em] text-[#72A09E] mb-3 px-4 uppercase ${!isSidebarOpen && 'hidden'}`}>
                  Core Modules
                </p>
                
                {menuModules.map((module, index) => {
                  const isExpanded = expandedModule === module.name;
                  const isActive = location.pathname === module.path || module.subItems.some(sub => location.pathname === sub.path);
                  return (
                    <div key={index} className="flex flex-col mb-1">
                      <button 
                        onClick={() => {
                          if (!isSidebarOpen) setIsSidebarOpen(true);
                          setExpandedModule(isExpanded ? null : module.name);
                          navigate(module.path);
                        }}
                        className={`w-full flex items-center min-h-[44px] rounded-xl transition-all font-bold tracking-widest text-[10px] uppercase group relative ${isSidebarOpen ? 'px-4 justify-between' : 'justify-center'} ${isActive ? 'text-[#E3624A] bg-white/5' : 'hover:bg-white/5'}`}
                      >
                        <div className="flex items-center min-w-0">
                          <module.icon size={18} className="shrink-0" />
                          {isSidebarOpen && <span className="ml-4 truncate">{module.label}</span>}
                        </div>
                        {isSidebarOpen && (
                          <ChevronRight size={14} className={`transition-transform duration-200 shrink-0 ${isExpanded ? 'rotate-90' : 'opacity-40'}`} />
                        )}
                      </button>
                      
                      <div className={`overflow-hidden transition-all duration-300 ${isExpanded && isSidebarOpen ? 'max-h-[500px] mt-1 mb-2 opacity-100' : 'max-h-0 opacity-0'}`}>
                        <div className="ml-5 space-y-0.5 border-l border-white/10 pl-2">
                          {module.subItems.map((sub, i) => {
                            const isSubActive = location.pathname === sub.path;
                            
                            return (
                            <button 
                              key={i} 
                              onClick={(e) => {
                                e.stopPropagation();
                                navigate(sub.path);
                              }}
                              className={`w-full flex items-center text-left py-2 px-3 rounded-lg text-[9px] font-bold transition-all uppercase tracking-wider group ${isSubActive ? 'text-white bg-white/10' : 'text-white/50 hover:text-white hover:bg-white/5'}`}
                            >
                              <span className={`w-1.5 h-1.5 rounded-full mr-2.5 transition-colors shrink-0 ${isSubActive ? 'bg-[#E3624A]' : 'bg-white/20 group-hover:bg-[#E3624A]'}`}></span>
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
                    <img src={userProfile.avatar} alt="User Profile" className="w-10 h-10 rounded-xl border border-white/10 object-cover shadow-lg shadow-black/20" />
                    <div className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-emerald-500 border-2 border-[#202024] rounded-full"></div>
                 </div>
                {isSidebarOpen && (
                  <div className="overflow-hidden flex flex-col ml-3.5 min-w-0 flex-1">
                    <div className="text-white font-black text-[11px] tracking-tight truncate leading-tight uppercase">{userProfile.name}</div>
                    <div className="flex items-center justify-between mt-0.5 pr-1">
                      <div className="text-[#E3624A] font-black text-[8px] tracking-[0.15em] uppercase opacity-90">{userProfile.position}</div>
                      <button onClick={logout} className="text-[#72A09E] hover:text-white transition-all flex items-center gap-1.5 group" title="Sign Out">
                        <LogOut size={10} strokeWidth={2.5} className="group-hover:translate-x-0.5 transition-transform" />
                        <span className="text-[8px] font-black tracking-[0.1em] uppercase">Sign Out</span>
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
            className="absolute top-10 -right-3.5 w-7 h-7 bg-[#952425] rounded-full text-white flex items-center justify-center shadow-lg transition-transform hover:scale-110 z-50 border-2 border-[#F9F7F6]"
          >
            {isSidebarOpen ? <ChevronLeft size={16} /> : <ChevronRight size={16} />}
          </button>
        </div>

        {/* MAIN CONTENT AREA */}
        <main className="flex-1 flex flex-col h-screen overflow-y-auto custom-scrollbar relative">
          <header className="flex flex-wrap items-center justify-between px-6 md:px-8 py-4 bg-white/80 backdrop-blur-md sticky top-0 z-40 border-b border-black/5 gap-4">
            <div className="min-w-0 flex-1">
              <h2 className="text-[#1c213f] font-black tracking-widest text-sm md:text-base uppercase flex items-center gap-2.5 truncate">
                <Briefcase size={20} style={{ color: palette.deepRed }} strokeWidth={2.5} className="shrink-0" />
                <span className="truncate">
                  <span style={{ WebkitTextStroke: '0.5px currentColor' }}>FURNITURE</span> <span style={{ color: palette.accent }}>MES</span> WORKSPACE
                </span>
              </h2>
            </div>
            
            <div className="flex items-center bg-white rounded-full shadow-sm border border-slate-200 shrink-0 p-1 group hover:shadow-md transition-all duration-300">
              <div className="px-5 py-1 flex flex-col items-center leading-none">
                <div className="text-[9px] font-black text-[#72A09E] uppercase tracking-[0.2em] mb-1 opacity-80">{dayName}</div>
                <div className="text-[13px] font-black text-[#111f42] font-mono tracking-tighter uppercase">{dateString}</div>
              </div>
              <div className="bg-[#1c213f] flex items-center gap-4 px-6 py-2.5 rounded-full shadow-lg border border-white/5">
                <Clock size={18} className="text-[#ab8a3b]" strokeWidth={3} />
                <span className="text-xl font-black font-mono text-white tracking-widest leading-none">{formattedTimeShort}</span>
              </div>
            </div>
          </header>

          <div className={`mx-auto w-full flex-1 flex flex-col ${location.pathname === '/' || location.pathname === '/permissions' || location.pathname === '/system-config' || location.pathname === '/vat-management' || location.pathname === '/accounts-receivable' || location.pathname === '/customer' || location.pathname === '/supplier' || location.pathname === '/catalogue' || location.pathname === '/fabric-design' || location.pathname === '/inspection-standards' || location.pathname === '/nc-control' || location.pathname === '/qc-report' || location.pathname === '/warehouse-in' || location.pathname === '/warehouse-out' || location.pathname === '/warehouse-booking' || location.pathname === '/purchase-nc' || location.pathname === '/purchase-requisition' || location.pathname === '/purchase-order' || location.pathname === '/pr-analysis' || location.pathname === '/po-analysis' || location.pathname === '/item-master' || location.pathname === '/recipe-bom' || location.pathname === '/code-master' || location.pathname === '/sale' || location.pathname === '/calendar' || location.pathname === '/inventory-planning' || location.pathname === '/stock-card' || location.pathname === '/product-cost' || location.pathname === '/bank-reconciliation' || location.pathname === '/petty-cash' || location.pathname === '/general-ledger' || location.pathname === '/fixed-asset' ? 'px-0 max-w-full' : 'pt-6 space-y-6 p-8 max-w-[1600px]'}`}>
            <Outlet />
          </div>

          <footer className="py-4 px-8 border-t border-black/5 mt-auto bg-transparent text-center shrink-0">
            <div className="max-w-[1400px] mx-auto flex flex-col gap-1.5">
              <div className="flex items-center justify-center gap-2 text-[10px] font-black tracking-[0.2em] text-[#4e546a]">
                <Settings size={13} className="text-[#952425] shrink-0" />
                <span className="uppercase whitespace-nowrap">FURNITURE MES CORE • SMART FACTORY ARCHITECTURE • VER 2024.1</span>
              </div>
              <div className="flex items-center justify-center flex-wrap gap-x-4 gap-y-1 text-[10px] font-bold text-[#72A09E]">
                <span>System by T All Intelligence</span>
                <span className="text-slate-300/60 text-xs">|</span>
                <span className="flex items-center gap-1.5"><Phone size={12} className="text-[#952425]" /> 082-5695654</span>
                <span className="text-slate-300/60 text-xs">|</span>
                <span className="flex items-center gap-1.5"><Mail size={12} className="text-[#952425]" /> tallintelligence.ho@gmail.com</span>
              </div>
            </div>
          </footer>
        </main>
      </div>
    </SecurityGuard>
  );
}

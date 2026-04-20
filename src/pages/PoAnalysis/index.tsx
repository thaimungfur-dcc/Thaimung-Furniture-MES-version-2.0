import React, { useState, useEffect } from 'react';
import { PieChart, HelpCircle } from 'lucide-react';
import KpiSection from './components/KpiSection';
import ChartsSection from './components/ChartsSection';
import GuideDrawer from './components/GuideDrawer';

export default function PoAnalysis() {
  const [period, setPeriod] = useState('This Month');
  const [isGuideOpen, setIsGuideOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  const periods = ['This Week', 'This Month', 'This Quarter', 'This Year'];

  // Mock PO Analysis Data
  const stats = {
    total: 86,
    pendingDelivery: 14,
    onTimeRate: 94.5,
    totalSpend: 2450000,
  };

  useEffect(() => {
    setLoading(true);
    const timer = setTimeout(() => {
      setLoading(false);
    }, 600);

    return () => clearTimeout(timer);
  }, [period]);

  return (
    <div className="min-h-screen transition-colors duration-500 text-[12px] bg-[#F7F5F2] flex flex-col">
      <style>{`
        * { font-family: 'JetBrains Mono', 'Noto Sans Thai', sans-serif !important; }
        .custom-scrollbar::-webkit-scrollbar { width: 6px; height: 6px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #CBD5E1; border-radius: 3px; }
        @keyframes fadeInUp { from { opacity: 0; transform: translateY(15px); } to { opacity: 1; transform: translateY(0); } }
        .animate-fade-in-up { animation: fadeInUp 0.5s ease-out forwards; }
      `}</style>
      
      <div className="w-full space-y-6 relative flex-1 flex flex-col pt-8 px-8 pb-10">
        
        {/* Header Section */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-6 no-print">
          <div className="flex items-center gap-5">
            {/* Logo: White background, Orange icon */}
            <div className="w-14 h-14 bg-white text-[#E3624A] flex items-center justify-center shadow-md flex-shrink-0 rounded-2xl border border-slate-200">
              <PieChart size={28} />
            </div>
            <div className="flex flex-col justify-center">
              <h1 className="text-3xl tracking-tight uppercase leading-none">
                <span className="text-[#b84530] font-black">PO</span> <span className="text-[#111f42] font-semibold">ANALYSIS</span>
              </h1>
              <p className="font-medium text-[14px] uppercase tracking-widest mt-1.5 text-slate-500 leading-none">
                วิเคราะห์ข้อมูลการสั่งซื้อและคู่ค้า
              </p>
            </div>
          </div>
          
          <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto">
            {/* Main Tabs: Same as PR/PO style */}
            <div className="flex bg-white p-1 border border-slate-200 shadow-sm rounded-lg">
              {periods.map(p => (
                <button 
                  key={p}
                  onClick={() => setPeriod(p)} 
                  className="px-6 py-2.5 font-semibold transition-all flex items-center gap-2 uppercase tracking-widest rounded-md text-[11px]"
                  style={period === p 
                    ? { backgroundColor: '#111f42', color: 'white', boxShadow: '0 4px 6px -1px rgba(17,31,66,0.3)' } 
                    : { color: '#64748b', backgroundColor: 'transparent' }
                  }
                >
                  {p}
                </button>
              ))}
            </div>

            {/* User Guide Button */}
            <button 
              onClick={() => setIsGuideOpen(true)}
              className="p-2.5 transition-all rounded-lg bg-slate-100 text-slate-600 hover:bg-[#111f42] hover:text-white border border-slate-200 shadow-sm"
              title="คู่มือการใช้งาน"
            >
              <HelpCircle size={18} />
            </button>
          </div>
        </div>

        {/* KPI Section */}
        <KpiSection stats={stats} />

        {/* Charts Section */}
        <ChartsSection period={period} loading={loading} />

        {/* User Guide Drawer */}
        {isGuideOpen && <GuideDrawer onClose={() => setIsGuideOpen(false)} />}

      </div>
    </div>
  );
}

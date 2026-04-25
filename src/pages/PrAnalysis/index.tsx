import React, { useState, useEffect } from 'react';
import { PieChart, HelpCircle } from 'lucide-react';
import { PageHeader } from '../../components/shared/PageHeader';
import KpiSection from './components/KpiSection';
import ChartsSection from './components/ChartsSection';
import GuideDrawer from './components/GuideDrawer';

export default function PrAnalysis() {
  const [period, setPeriod] = useState('This Month');
  const [isGuideOpen, setIsGuideOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  const periods = ['This Week', 'This Month', 'This Quarter', 'This Year'];

  // Mock Analysis Data
  const stats = {
    total: 142,
    pendingApprove: 12,
    approvalRate: 88,
    totalBudget: 1254800,
    prevMonthBudget: 1100000
  };

  useEffect(() => {
    setLoading(true);
    // Simulate data fetch
    const timer = setTimeout(() => {
      setLoading(false);
    }, 600);

    return () => clearTimeout(timer);
  }, [period]);

  return (
    <div className="flex flex-col space-y-4 w-full relative flex-1 animate-fade-in-up">
      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 6px; height: 6px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #CBD5E1; border-radius: 3px; }

        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(15px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in-up { animation: fadeInUp 0.5s ease-out forwards; }
      `}</style>
      
      {/* Header Section */}
      <PageHeader
        title="PR ANALYSIS"
        subtitle="วิเคราะห์ข้อมูลการขอซื้อเชิงลึก"
        icon={PieChart}
        rightContent={
          <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto">
            {/* Period Filter Tabs */}
            <div className="flex bg-[#e2e8f0] p-1 border border-slate-200 shadow-inner rounded-xl">
              {periods.map(p => (
                <button 
                  key={p}
                  onClick={() => setPeriod(p)} 
                  className={`px-4 py-2 text-[10px] font-black transition-all flex items-center gap-2 uppercase tracking-widest rounded-lg ${period === p ? 'bg-[#111f42] text-white shadow-md' : 'text-slate-500 hover:bg-slate-50'}`}
                >
                  {p}
                </button>
              ))}
            </div>

            {/* User Guide Button */}
            <button 
              onClick={() => setIsGuideOpen(true)}
              className="p-2.5 transition-all rounded-xl bg-white text-slate-400 hover:bg-[#111f42] hover:text-white border border-slate-200 shadow-sm"
              title="คู่มือการใช้งาน"
            >
              <HelpCircle size={20} />
            </button>
          </div>
        }
      />

      {/* Main Container - Full Width layout */}
      <div className="flex flex-col w-full gap-4 relative z-10 px-0">
        {/* KPI Section */}
        <KpiSection stats={stats} />

        {/* Charts Section */}
        <ChartsSection period={period} loading={loading} />
      </div>

      {/* User Guide Drawer */}
      {isGuideOpen && <GuideDrawer onClose={() => setIsGuideOpen(false)} />}
    </div>
  );
}

import React, { useEffect, useRef, useMemo } from 'react';
import { useGoogleAuth } from '../context/GoogleAuthContext';
import { useGoogleSheets } from '../hooks/useGoogleSheets';
import { 
  Box, Loader2, LayoutGrid
} from 'lucide-react';
import Chart from 'chart.js/auto';
import { PageHeader } from '../components/shared/PageHeader';
import { HomeKpiSection } from './Home/components/HomeKpiSection';
import { StockAlertsBoard } from './Home/components/StockAlertsBoard';
import { ProductionStatus } from './Home/components/ProductionStatus';

export default function Home() {
  const { user } = useGoogleAuth();
  const { data: historyLogs, loading: historyLoading } = useGoogleSheets<any>('HistoryLogs');
  const { data: outLogs, loading: outLoading } = useGoogleSheets<any>('WarehouseOutLogs');
  const { data: jobOrders } = useGoogleSheets<any>('JobOrders');
  const { data: deliveryOrders } = useGoogleSheets<any>('DeliveryOrders');
  const chartRefs = {
    movement: useRef<HTMLCanvasElement>(null),
    storage: useRef<HTMLCanvasElement>(null)
  };
  const chartInstances = useRef<{ [key: string]: Chart | null }>({
    movement: null,
    storage: null
  });

  const palette = {
    primary: '#111f42',
    accent: '#E3624A',
    deepRed: '#952425',
    gold: '#ab8a3b',
    muted: '#72A09E',
  };

  // Process data for charts
  const chartData = useMemo(() => {
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const today = new Date();
    const last7Days = Array.from({ length: 7 }, (_, i) => {
      const d = new Date();
      d.setDate(today.getDate() - (6 - i));
      return d;
    });

    const labels = last7Days?.map(d => days[d.getDay()]);
    
    const producedData = last7Days?.map(d => {
      const dateStr = d.toISOString().split('T')[0];
      return historyLogs?.filter(log => log.date?.startsWith(dateStr))
        .reduce((sum, log) => sum + (Number(log.qty) || 0), 0) || 0;
    });

    const shippedData = last7Days?.map(d => {
      const dateStr = d.toISOString().split('T')[0];
      return outLogs?.filter(log => log.date?.startsWith(dateStr))
        .reduce((sum, log) => sum + (Number(log.qty) || 0), 0) || 0;
    });

    return { labels, producedData, shippedData };
  }, [historyLogs, outLogs]);

  useEffect(() => {
    if (historyLoading || outLoading) return;

    const initCharts = () => {
      Object.keys(chartInstances.current).forEach(key => {
        if (chartInstances.current[key]) chartInstances.current[key]?.destroy();
      });

      Chart.defaults.font.family = "'JetBrains Mono', 'Noto Sans Thai', sans-serif";
      Chart.defaults.color = '#94a3b8';

      if (chartRefs.movement.current) {
        const ctx = chartRefs.movement.current.getContext('2d');
        if (ctx) {
          const gradIn = ctx.createLinearGradient(0, 0, 0, 300);
          gradIn.addColorStop(0, 'rgba(114, 160, 158, 0.4)');
          gradIn.addColorStop(1, 'rgba(114, 160, 158, 0)');

          const gradOut = ctx.createLinearGradient(0, 0, 0, 300);
          gradOut.addColorStop(0, 'rgba(149, 36, 37, 0.4)');
          gradOut.addColorStop(1, 'rgba(149, 36, 37, 0)');

          chartInstances.current.movement = new Chart(chartRefs.movement.current, {
            type: 'line',
            data: {
              labels: chartData.labels,
              datasets: [
                {
                  label: 'PRODUCED (FG)',
                  data: chartData.producedData,
                  borderColor: palette.muted,
                  backgroundColor: gradIn,
                  fill: true,
                  tension: 0.4,
                  borderWidth: 3,
                  pointRadius: 0,
                  pointHoverRadius: 6
                },
                {
                  label: 'SHIPPED (OUT)',
                  data: chartData.shippedData,
                  borderColor: palette.deepRed,
                  backgroundColor: gradOut,
                  fill: true,
                  tension: 0.4,
                  borderWidth: 3,
                  pointRadius: 0,
                  pointHoverRadius: 6
                }
              ]
            },
            options: {
              responsive: true,
              maintainAspectRatio: false,
              plugins: { 
                legend: { 
                  display: true, 
                  position: 'top', 
                  align: 'end',
                  labels: { usePointStyle: true, boxWidth: 8, font: { size: 10, weight: 'bold' } }
                } 
              },
              scales: {
                y: { beginAtZero: true, grid: { color: '#f1f5f9' }, border: {display: false, dash: [4, 4]} },
                x: { grid: { display: false }, border: { display: false } }
              }
            }
          });
        }
      }

      if (chartRefs.storage.current) {
        chartInstances.current.storage = new Chart(chartRefs.storage.current, {
          type: 'doughnut',
          data: {
            labels: ['Raw Lumber', 'Fabrics', 'Hardware', 'Finished Sofas'],
            datasets: [{
              data: [35, 20, 15, 30],
              backgroundColor: ['#4e546a', '#E3624A', '#ab8a3b', '#72A09E'],
              borderWidth: 4,
              borderColor: '#ffffff',
              borderRadius: 4
            }]
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            cutout: '75%',
            plugins: { legend: { display: false }, tooltip: { enabled: true } }
          }
        });
      }
    };

    const timer = setTimeout(initCharts, 200);
    return () => clearTimeout(timer);
  }, [chartData, historyLoading, outLoading]);

  return (
    <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-500 pb-10">
      
      <PageHeader
        Icon={LayoutGrid}
        title={`WELCOME BACK, ${user?.displayName || 'OPERATOR'}`}
        subtitle="Furniture Manufacturing Hub • System Overview"
      />

      {/* Hero Banner Section */}
      <div className="relative w-full h-44 rounded-xl overflow-hidden shadow-sm group border border-slate-200">
        <img 
          src="https://m.media-amazon.com/images/I/61HdK9ACA1L._AC_UF894,1000_QL80_.jpg" 
          alt="Production Hero" 
          className="absolute inset-0 w-full h-full object-cover object-[center_10%] transition-transform duration-1000 group-hover:scale-105" 
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#111f42] from-20% via-[#111f42]/60 via-55% to-transparent"></div>
        <div className="absolute inset-0 p-8 flex flex-col justify-center">
          <div className="flex items-center gap-4 mb-2">
             <div className="text-[#E3624A]">
               <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M19 9V6a2 2 0 0 0-2-2H7a2 2 0 0 0-2 2v3"/><path d="M3 11v5a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-5a2 2 0 0 0-4 0v2H7v-2a2 2 0 0 0-4 0Z"/><path d="M5 18v2"/><path d="M19 18v2"/></svg>
             </div>
             <h2 className="text-2xl md:text-[32px] font-black text-white tracking-widest leading-none uppercase drop-shadow-md">
               PRODUCTION CONTROL
             </h2>
          </div>
          <p className="text-[#F0EEED] font-medium italic text-[11px] md:text-xs w-full max-w-2xl font-mono leading-relaxed opacity-95 pl-12 drop-shadow-sm">
            "Crafting premium home goods — where exceptional design meets uncompromising quality."
          </p>
        </div>
      </div>

      {/* 1. KPIs Section */}
      <HomeKpiSection 
        deliveryOrders={deliveryOrders}
        jobOrders={jobOrders}
        outLogs={outLogs}
      />

      {/* 2. Stock Alerts Section */}
      <StockAlertsBoard />

      {/* 3. Charts Area */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white rounded-xl p-6 shadow-sm border border-slate-100 flex flex-col min-h-[300px]">
          <h3 className="text-[12px] font-black text-[#111f42] uppercase tracking-[0.15em] mb-6 opacity-70">WEEKLY PRODUCTION MOVEMENT</h3>
          <div className="flex-1 relative">
            {(historyLoading || outLoading) ? (
              <div className="absolute inset-0 flex items-center justify-center">
                <Loader2 className="animate-spin text-slate-200" size={32} />
              </div>
            ) : (
              <canvas ref={chartRefs.movement}></canvas>
            )}
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-100 flex flex-col items-center relative min-h-[300px]">
          <div className="w-full flex justify-start mb-2">
            <h3 className="text-[12px] font-black text-[#111f42] uppercase tracking-[0.15em] opacity-70 uppercase tracking-widest">WH CAPACITY</h3>
          </div>
          <div className="flex-1 w-full relative flex items-center justify-center pt-4">
             <div className="w-full h-48 relative">
               <canvas ref={chartRefs.storage}></canvas>
             </div>
             <div className="absolute inset-0 flex flex-col items-center justify-center mt-4 pointer-events-none">
                <span className="text-4xl font-black text-[#111f42] font-mono leading-none tracking-tighter">78%</span>
                <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest mt-1">OCCUPIED</span>
             </div>
          </div>
        </div>
      </div>

      {/* 4. Pending Tasks & Status Board */}
      <ProductionStatus />

      {/* 5. Recent Activity Feed - Simplified */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-6">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-teal-50 text-teal-600 rounded-xl border border-teal-100">
              <Box size={18} />
            </div>
            <div>
              <h3 className="text-sm font-black text-[#111f42] uppercase tracking-widest">LIVE MATERIAL FEED</h3>
              <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mt-0.5">INBOUND & OUTBOUND REAL-TIME TRACKER</p>
            </div>
          </div>
          <div className="flex items-center gap-1.5 text-[9px] font-black text-emerald-500 animate-pulse uppercase tracking-widest font-mono">
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500"></div>
            LIVE 
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { img: 'https://images.unsplash.com/photo-1574358866164-9646b95b8d5a?auto=format&fit=crop&q=80&w=400', id: 'RM-OAK-045', status: 'RECEIVED', type: 'INBOUND GR', time: '10:30 AM', color: 'text-teal-600' },
            { img: 'https://images.unsplash.com/photo-1620799139834-6b8f844fbe61?auto=format&fit=crop&q=80&w=400', id: 'FB-VLVT-012', status: 'STAGING', type: 'PUTAWAY WAIT', time: '11:15 AM', color: 'text-amber-600' },
            { img: 'https://images.unsplash.com/photo-1586864387967-d02ef85d93e8?auto=format&fit=crop&q=80&w=400', id: 'HD-HNG-005', status: 'PICKED', type: 'OUTBOUND PRD', time: '11:45 AM', color: 'text-[#E3624A]' }
          ]?.map((item, i) => (
            <div key={i} className="rounded-xl border border-slate-100 p-4 flex flex-col group hover:shadow-md transition-all bg-slate-50/5">
              <div className="w-full h-28 rounded-xl overflow-hidden relative mb-4 border border-slate-100">
                <img src={item.img} alt={item.id} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" referrerPolicy="no-referrer" />
                <div className="absolute top-2 right-2 w-7 h-7 bg-white/90 backdrop-blur rounded-xl border border-white/20 flex items-center justify-center shadow-sm">
                  <Box size={12} className={item.color} />
                </div>
              </div>
              <div className="text-center pb-2 mb-3">
                <h4 className="text-[13px] font-black text-[#111f42] uppercase tracking-wider mb-1 font-mono">{item.id}</h4>
                <p className={`text-[10px] font-black uppercase tracking-widest mb-1 ${item.color}`}>{item.status}</p>
                <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">{item.type}</p>
              </div>
              <div className="flex justify-between items-center px-1 border-t border-slate-100 pt-2">
                <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest font-mono">LOGGED</span>
                <span className="text-[10px] font-black text-[#111f42] font-mono">{item.time}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}

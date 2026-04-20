import React, { useEffect, useRef, useMemo } from 'react';
import { useGoogleAuth } from '../context/GoogleAuthContext';
import { useGoogleSheets } from '../hooks/useGoogleSheets';
import { 
  ShoppingCart, Truck, CheckSquare, Circle, AlertTriangle, XCircle, Clock4, 
  FileText, Box, AlertOctagon, Package, ArrowUpRight, Loader2 
} from 'lucide-react';
import Chart from 'chart.js/auto';

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

  const devProfile = {
    name: user?.displayName || 'T-DCC Developer',
    position: 'System Administrator',
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

  // Process data for charts
  const chartData = useMemo(() => {
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const today = new Date();
    const last7Days = Array.from({ length: 7 }, (_, i) => {
      const d = new Date();
      d.setDate(today.getDate() - (6 - i));
      return d;
    });

    const labels = last7Days.map(d => days[d.getDay()]);
    
    const producedData = last7Days.map(d => {
      const dateStr = d.toISOString().split('T')[0];
      return historyLogs?.filter(log => log.date?.startsWith(dateStr))
        .reduce((sum, log) => sum + (Number(log.qty) || 0), 0) || 0;
    });

    const shippedData = last7Days.map(d => {
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

      Chart.defaults.font.family = "'JetBrains Mono', sans-serif";
      Chart.defaults.color = '#94a3b8';

      // Weekly Movement Chart (Line)
      if (chartRefs.movement.current) {
        const ctx = chartRefs.movement.current.getContext('2d');
        if (ctx) {
          const gradIn = ctx.createLinearGradient(0, 0, 0, 300);
          gradIn.addColorStop(0, 'rgba(114, 160, 158, 0.4)'); // Muted Teal
          gradIn.addColorStop(1, 'rgba(114, 160, 158, 0)');

          const gradOut = ctx.createLinearGradient(0, 0, 0, 300);
          gradOut.addColorStop(0, 'rgba(149, 36, 37, 0.4)'); // Deep Red
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

      // Storage Usage Chart (Doughnut)
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
    <div className="pt-8 px-8 pb-10 space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
      
      {/* Banner Area */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-[#111f42] tracking-tight uppercase leading-none">
            Welcome back, <span className="text-[#952425]">{devProfile.name}</span>
          </h2>
          <p className="text-slate-400 text-[10px] font-black tracking-[0.2em] uppercase mt-1.5">Furniture Manufacturing Hub</p>
        </div>
      </div>

      <div className="relative w-full h-60 rounded-[24px] overflow-hidden shadow-sm group">
        <img 
          src="https://m.media-amazon.com/images/I/61HdK9ACA1L._AC_UF894,1000_QL80_.jpg" 
          alt="Furniture Manufacturing" 
          className="absolute inset-0 w-full h-full object-cover object-[center_10%] transition-transform duration-1000 group-hover:scale-105" 
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#111f42] from-20% via-[#111f42]/60 via-55% to-transparent"></div>
        <div className="absolute inset-0 p-8 md:p-10 flex flex-col justify-center">
          <div className="flex items-center gap-4 mb-3">
             <div className="text-[#E3624A]">
               <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 9V6a2 2 0 0 0-2-2H7a2 2 0 0 0-2 2v3"/><path d="M3 11v5a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-5a2 2 0 0 0-4 0v2H7v-2a2 2 0 0 0-4 0Z"/><path d="M5 18v2"/><path d="M19 18v2"/></svg>
             </div>
             <h2 className="text-3xl md:text-[40px] font-black text-white tracking-widest leading-none uppercase drop-shadow-md">
               PRODUCTION CONTROL
             </h2>
          </div>
          <p className="text-[#F0EEED] font-medium italic text-[11px] md:text-sm max-w-2xl font-mono leading-relaxed opacity-95 pl-12 drop-shadow-md">
            "Crafting premium home goods and furniture — where exceptional design meets uncompromising quality for everyday living."
          </p>
        </div>
      </div>

      {/* 1. KPIs Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {[
          { label: 'ACTIVE ORDERS', val: deliveryOrders?.filter((d: any) => d.status !== 'Completed').length || 0, sub: 'ALL POs ISSUED', icon: ShoppingCart, bg: 'bg-slate-50', color: '#111f42' },
          { label: 'PENDING JO', val: jobOrders?.filter((j: any) => j.status !== 'Completed').length || 0, sub: 'WAITING FOR PRODUCTION', icon: Clock4, bg: 'bg-amber-50', color: '#b45309' },
          { label: 'OUTBOUND TODAY', val: outLogs?.filter((l: any) => l.date?.startsWith(new Date().toISOString().split('T')[0])).length || 0, sub: 'OVERALL OEE', icon: Truck, bg: 'bg-emerald-50', color: '#047857', trend: '↗ + 1.2%' },
          { label: 'LUMBER SPEND', val: '฿2.45M', sub: 'NET VALUE', icon: Circle, bg: 'bg-red-50', color: '#be123c' }
        ].map((kpi, i) => (
          <div key={i} className="bg-white p-6 rounded-[24px] shadow-sm border border-slate-100 flex flex-col justify-between min-h-[140px] hover:shadow-md transition-shadow relative overflow-hidden">
            <div 
              className="absolute -right-4 -bottom-4 opacity-[0.08] pointer-events-none transform -rotate-[15deg]"
              style={{ color: kpi.color }}
            >
              <kpi.icon size={110} strokeWidth={1.5} />
            </div>
            <div className="flex justify-between items-start relative z-10">
              <h3 className="text-[10px] font-black text-[#111f42] uppercase tracking-widest leading-tight w-20">{kpi.label}</h3>
              <div className={`p-2.5 rounded-[14px] ${kpi.bg}`} style={{ color: kpi.color }}>
                <kpi.icon size={18} strokeWidth={2.5} />
              </div>
            </div>
            <div className="relative z-10 mt-4">
              <div className="flex items-baseline gap-2">
                <div className="text-4xl font-black text-[#111f42] font-mono tracking-tighter leading-none">{kpi.val}</div>
                {kpi.trend && <span className="text-[10px] font-bold text-emerald-500 font-mono">{kpi.trend}</span>}
              </div>
              <p className="text-[9px] font-black text-slate-300 uppercase tracking-widest mt-2">{kpi.sub}</p>
            </div>
          </div>
        ))}
      </div>

      {/* 2. Stock Alerts Board */}
      <div className="bg-white rounded-[24px] shadow-sm border border-slate-100 overflow-hidden">
        <div className="p-6 border-b border-slate-50 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <div className="p-2.5 bg-red-50 text-red-500 rounded-xl">
              <AlertTriangle size={20} strokeWidth={2.5} />
            </div>
            <div>
              <h3 className="text-sm font-black text-[#111f42] uppercase tracking-widest">STOCK ALERTS BOARD</h3>
              <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mt-0.5">CRITICAL INVENTORY ISSUES & MATERIAL AGING</p>
            </div>
          </div>
          <div className="px-4 py-1.5 bg-[#E3624A] text-white text-[9px] font-black rounded-full uppercase tracking-widest shadow-sm shadow-[#E3624A]/30">
            6 ISSUES ACTIVE
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6 bg-slate-50/50">
          {/* Out of Stock Column */}
          <div className="bg-white rounded-[20px] p-5 border border-red-100/50 shadow-sm">
            <div className="flex justify-between items-center mb-4 px-1">
              <div className="flex items-center gap-2 text-red-500">
                <XCircle size={14} />
                <span className="text-[10px] font-black uppercase tracking-widest">LOW/OUT OF STOCK</span>
              </div>
              <span className="text-[9px] font-black text-red-400 bg-red-50 px-2 py-0.5 rounded-full">3 ITEMS</span>
            </div>
            <div className="space-y-3">
              {[
                { id: 'RM-OAK-002', desc: 'Oak Timber at 0. Reorder pending approval.', action: 'RESTOCK' },
                { id: 'FB-VLVT-001', desc: 'Blue Velvet fabric depleted. Halt line 2.', action: 'RESTOCK' },
                { id: 'HD-HINGE-005', desc: 'Soft-close hinges below safety level.', action: 'RESTOCK' }
              ].map((item, i) => (
                <div key={i} className="flex justify-between items-center p-4 rounded-2xl border border-slate-100 bg-white hover:border-red-200 transition-colors">
                  <div className="flex gap-3 items-start">
                    <div className="w-1.5 h-1.5 rounded-full bg-red-500 mt-1.5 shrink-0"></div>
                    <div>
                      <h4 className="text-[11px] font-black text-[#111f42] uppercase tracking-wider">{item.id}</h4>
                      <p className="text-[10px] font-bold text-slate-400 mt-0.5 truncate w-32 sm:w-48">{item.desc}</p>
                    </div>
                  </div>
                  <button className="text-[9px] font-black text-red-500 border border-red-100 px-3 py-1.5 rounded-full uppercase hover:bg-red-50 transition-colors shrink-0">
                    {item.action}
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Near Expiry / QC Needed Column */}
          <div className="bg-white rounded-[20px] p-5 border border-amber-100/50 shadow-sm">
            <div className="flex justify-between items-center mb-4 px-1">
              <div className="flex items-center gap-2 text-amber-500">
                <Clock4 size={14} />
                <span className="text-[10px] font-black uppercase tracking-widest">MATERIAL QC PENDING</span>
              </div>
              <span className="text-[9px] font-black text-amber-500 bg-amber-50 px-2 py-0.5 rounded-full">3 ITEMS</span>
            </div>
            <div className="space-y-3">
              {[
                { id: 'CH-GLUE-012', desc: 'Adhesive batch expiring in 3 days. Check.', action: 'INSPECT' },
                { id: 'RM-PINE-003', desc: 'Moisture level warning on arriving batch.', action: 'INSPECT' },
                { id: 'PN-WHT-002', desc: 'White paint lot requires viscosity test.', action: 'INSPECT' }
              ].map((item, i) => (
                <div key={i} className="flex justify-between items-center p-4 rounded-2xl border border-slate-100 bg-white hover:border-amber-200 transition-colors">
                  <div className="flex gap-3 items-start">
                    <div className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-1.5 shrink-0"></div>
                    <div>
                      <h4 className="text-[11px] font-black text-[#111f42] uppercase tracking-wider">{item.id}</h4>
                      <p className="text-[10px] font-bold text-slate-400 mt-0.5 truncate w-32 sm:w-48">{item.desc}</p>
                    </div>
                  </div>
                  <button className="text-[9px] font-black text-amber-600 border border-amber-100 px-3 py-1.5 rounded-full uppercase hover:bg-amber-50 transition-colors shrink-0">
                    {item.action}
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* 3. Charts Area */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white rounded-[24px] p-6 shadow-sm border border-slate-100 flex flex-col min-h-[300px]">
          <h3 className="text-sm font-black text-[#111f42] uppercase tracking-widest mb-6">WEEKLY PRODUCTION MOVEMENT</h3>
          <div className="flex-1 relative">
            <canvas ref={chartRefs.movement}></canvas>
          </div>
        </div>

        <div className="bg-white rounded-[24px] p-6 shadow-sm border border-slate-100 flex flex-col items-center relative min-h-[300px]">
          <div className="w-full flex justify-start mb-2">
            <h3 className="text-sm font-black text-[#111f42] uppercase tracking-widest">WAREHOUSE CAPACITY</h3>
          </div>
          <div className="flex-1 w-full relative flex items-center justify-center pt-4">
             <div className="w-full h-48 relative">
               <canvas ref={chartRefs.storage}></canvas>
             </div>
             {/* Center Text Overlay */}
             <div className="absolute inset-0 flex flex-col items-center justify-center mt-4 pointer-events-none">
                <span className="text-4xl font-black text-[#111f42] font-mono leading-none tracking-tighter">78%</span>
                <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest mt-1">OCCUPIED</span>
             </div>
          </div>
        </div>
      </div>

      {/* 4. Pending Tasks & System Alerts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Pending Tasks */}
        <div className="lg:col-span-2 bg-white rounded-[24px] shadow-sm border border-slate-100 p-6">
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-orange-50 text-orange-500 rounded-lg">
                <CheckSquare size={18} />
              </div>
              <div>
                <h3 className="text-sm font-black text-[#111f42] uppercase tracking-widest">PENDING TASKS</h3>
                <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mt-0.5">OPERATIONAL FLOW MONITOR</p>
              </div>
            </div>
            <div className="px-3 py-1 bg-orange-500 text-white text-[9px] font-black rounded-full uppercase tracking-wider">
              3 ACTIVE TASKS
            </div>
          </div>

          <div className="space-y-4">
            {[
              { dept: 'CUTTING STATION 2', id: 'WO-2024-089', issue: 'MATERIAL WAIT', sub: 'OAK BOARD 20MM', status: 'PENDING' },
              { dept: 'UPHOLSTERY DEPT', id: 'WO-2024-085', issue: 'QC INSPECTION', sub: 'LEATHER SOFA SET A', status: 'IN REVIEW' },
              { dept: 'LOGISTICS TEAM', id: 'DO-2024-042', issue: 'ROUTE ASSIGN', sub: 'DELIVERY BKK ZONE', status: 'PROCESSING' }
            ].map((task, i) => (
              <div key={i} className="flex justify-between items-center p-4 rounded-[20px] border border-slate-100 hover:border-slate-200 hover:bg-slate-50/50 transition-all cursor-pointer group">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-[14px] bg-slate-50 flex items-center justify-center text-slate-400 border border-slate-100">
                    {i === 0 ? <AlertTriangle size={18}/> : i === 1 ? <FileText size={18}/> : <Truck size={18}/>}
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="text-[11px] font-black text-[#111f42] uppercase tracking-wider">{task.dept}</h4>
                      <span className="text-[9px] font-bold text-orange-600 bg-orange-50 px-1.5 py-0.5 rounded uppercase">{task.id}</span>
                    </div>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{task.issue} <span className="mx-1">•</span> {task.sub}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-[10px] font-black text-slate-500 border border-slate-200 px-3 py-1.5 rounded-full uppercase">{task.status}</span>
                  <ArrowUpRight size={16} className="text-slate-300 group-hover:text-[#111f42] transition-colors" />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* System Alert */}
        <div className="bg-white rounded-[24px] shadow-sm border border-slate-100 p-6 flex flex-col">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-pink-50 text-pink-500 rounded-lg">
              <AlertOctagon size={18} />
            </div>
            <div>
              <h3 className="text-sm font-black text-[#111f42] uppercase tracking-widest">SYSTEM ALERT</h3>
              <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mt-0.5">CRITICAL FEED</p>
            </div>
          </div>

          <div className="flex-1 space-y-4">
            <div className="p-5 rounded-[20px] bg-red-50/50 border border-red-100">
              <div className="flex items-center gap-2 text-red-500 mb-3">
                <AlertTriangle size={14} />
                <span className="text-[10px] font-black uppercase tracking-widest">SERVER MAINTENANCE</span>
              </div>
              <p className="text-[11px] font-mono font-medium text-slate-600 leading-relaxed">
                Database optimization starts Sunday 2:00 AM. Ensure all offline syncs are completed.
              </p>
            </div>

            <div className="p-5 rounded-[20px] bg-orange-50/50 border border-orange-100">
              <div className="flex items-center gap-2 text-orange-600 mb-3">
                <Package size={14} />
                <span className="text-[10px] font-black uppercase tracking-widest">NEW FEATURE UPDATE</span>
              </div>
              <p className="text-[11px] font-mono font-medium text-slate-600 leading-relaxed">
                Barcode scanning via mobile app for WIP Tracking is now available. Please review the manual.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* 5. Recent Receiving */}
      <div className="bg-white rounded-[24px] shadow-sm border border-slate-100 p-6 pb-8">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-teal-50 text-teal-600 rounded-lg">
              <Box size={18} />
            </div>
            <div>
              <h3 className="text-sm font-black text-[#111f42] uppercase tracking-widest">RECENT MATERIAL MOVEMENT</h3>
              <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mt-0.5">INBOUND & OUTBOUND TRACKER</p>
            </div>
          </div>
          <button className="px-4 py-2 bg-[#72A09E] text-white text-[9px] font-black rounded-full uppercase tracking-wider hover:bg-[#5b8583] transition-colors">
            LIVE UPDATES
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { img: 'https://images.unsplash.com/photo-1574358866164-9646b95b8d5a?auto=format&fit=crop&q=80&w=400', id: 'RM-OAK-045', status: 'RECEIVED', type: 'INBOUND GR', time: '10:30 AM', color: 'text-teal-600' },
            { img: 'https://images.unsplash.com/photo-1620799139834-6b8f844fbe61?auto=format&fit=crop&q=80&w=400', id: 'FB-VLVT-012', status: 'STAGING', type: 'PUTAWAY WAIT', time: '11:15 AM', color: 'text-amber-600' },
            { img: 'https://images.unsplash.com/photo-1586864387967-d02ef85d93e8?auto=format&fit=crop&q=80&w=400', id: 'HD-HNG-005', status: 'PICKED', type: 'OUTBOUND PRD', time: '11:45 AM', color: 'text-[#E3624A]' }
          ].map((item, i) => (
            <div key={i} className="rounded-[24px] border border-slate-100 p-4 flex flex-col group hover:shadow-md transition-all bg-slate-50/30">
              <div className="w-full h-36 rounded-[16px] overflow-hidden relative mb-4">
                <img src={item.img} alt={item.id} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                <div className="absolute top-3 right-3 w-8 h-8 bg-white/90 backdrop-blur rounded-lg flex items-center justify-center shadow-sm">
                  <Box size={14} className={item.color} />
                </div>
              </div>
              <div className="text-center pb-2 border-b border-slate-200/50 mb-3">
                <h4 className="text-[13px] font-black text-[#111f42] uppercase tracking-wider mb-2">{item.id}</h4>
                <p className={`text-[10px] font-black uppercase tracking-widest mb-1 ${item.color}`}>{item.status}</p>
                <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">{item.type}</p>
              </div>
              <div className="flex justify-between items-center px-1">
                <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">TIME LOG</span>
                <span className="text-[10px] font-black text-[#111f42]">{item.time}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}

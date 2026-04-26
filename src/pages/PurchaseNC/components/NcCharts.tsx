import React, { useEffect, useRef } from 'react';
import Chart from 'chart.js/auto';
import { Activity, PieChart } from 'lucide-react';

interface NcChartsProps {
  stats: {
    total: number;
    pending: number;
    followup: number;
    closed: number;
    critical: number;
    major: number;
    minor: number;
  };
  scarData: any[];
  theme: any;
}

const NcCharts: React.FC<NcChartsProps> = ({ stats, scarData, theme }) => {
  const chartMainLineRef = useRef<HTMLCanvasElement>(null);
  const chartStatusDoughnutRef = useRef<HTMLCanvasElement>(null);
  const chartInstances = useRef<any>({});

  useEffect(() => {
    const timer = setTimeout(() => {
      Object.values(chartInstances.current).forEach((c: any) => c && c.destroy());
      Chart.defaults.font.family = "'JetBrains Mono', 'Noto Sans Thai', sans-serif";

      const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      const trendData = months?.map((m, i) => {
         const dateStr = `2026-${String(i+1).padStart(2, '0')}`;
         return scarData?.filter(d => d.date.startsWith(dateStr)).length;
      });

      if (chartMainLineRef.current) {
        chartInstances.current.mainLine = new Chart(chartMainLineRef.current, {
          type: 'line',
          data: {
            labels: months,
            datasets: [{ 
              label: 'Total NCs', 
              data: trendData, 
              borderColor: theme.accent, 
              backgroundColor: theme.accent + '20', 
              fill: true, 
              tension: 0.4, 
              borderWidth: 3, 
              pointRadius: 4, 
              pointHoverRadius: 6 
            }]
          },
          options: { 
            responsive: true, 
            maintainAspectRatio: false, 
            interaction: { mode: 'index', intersect: false },
            plugins: { legend: { display: false }, tooltip: { enabled: true } }, 
            scales: { x: { grid: { display: false } }, y: { beginAtZero: true, grid: { color: '#e2e8f0', tickBorderDash: [5, 5] } } } 
          }
        });
      }

      if (chartStatusDoughnutRef.current) {
        chartInstances.current.statusDoughnut = new Chart(chartStatusDoughnutRef.current, {
          type: 'doughnut',
          data: {
            labels: ['Closed', 'Follow Up', 'Vendor Responded', 'Submitted'],
            datasets: [{
              data: [stats.closed, stats.followup, 0, stats.pending],
              backgroundColor: [theme.green, '#3b82f6', theme.warning, theme.danger],
              borderWidth: 0, 
              hoverOffset: 8
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
    }, 200);
    return () => clearTimeout(timer);
  }, [stats, scarData, theme]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 w-full no-print">
      <div className="lg:col-span-3 flex flex-col gap-6">
        <div className="bg-white p-6 rounded-[24px] border border-slate-100 shadow-sm flex flex-col h-[260px]">
           <div className="flex justify-between items-center mb-4">
             <h3 className="font-bold text-[#111f42] text-xs uppercase tracking-wider">Severity Breakdown</h3>
             <Activity size={14} className="text-slate-400" />
           </div>
           <div className="flex-1 flex flex-col justify-center space-y-5">
              {[ 
                {l:'Critical',c:stats.critical,clr:'text-red-500',bg:'bg-red-500'}, 
                {l:'Major',c:stats.major,clr:'text-orange-500',bg:'bg-orange-500'}, 
                {l:'Minor',c:stats.minor,clr:'text-blue-500',bg:'bg-blue-500'} 
              ]?.map(s=>(
                <div key={s.l} className="space-y-1.5">
                   <div className="flex justify-between text-[10px] font-bold mb-1">
                     <span className={`uppercase tracking-widest ${s.clr}`}>{s.l}</span>
                     <span className="text-[#111f42]">{s.c} <span className="text-slate-400 font-normal">({Math.round(s.c/(stats.total||1)*100)}%)</span></span>
                   </div>
                   <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                     <div className={`${s.bg} h-full transition-all duration-1000`} style={{ width: `${(s.c/(stats.total||1))*100}%` }}></div>
                   </div>
                </div>
              ))}
           </div>
        </div>
        <div className="bg-white p-6 rounded-[24px] border border-slate-100 shadow-sm flex flex-col h-[360px]">
           <div className="flex justify-between items-center mb-2 shrink-0">
             <h3 className="font-bold text-[#111f42] text-xs uppercase tracking-wider">Status Analysis</h3>
             <PieChart size={16} className="text-slate-400" />
           </div>
           <div className="flex-1 relative w-full h-full flex items-center justify-center">
              <canvas ref={chartStatusDoughnutRef}></canvas>
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none pb-2">
                <span className="text-4xl font-black text-[#111f42] leading-none">{stats.total}</span>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-2">Total NCs</span>
              </div>
           </div>
        </div>
      </div>
      <div className="lg:col-span-9 flex flex-col gap-6">
        <div className="flex-1 bg-white p-6 rounded-[24px] border border-slate-100 shadow-sm flex flex-col h-full min-h-[400px]">
           <div className="flex justify-between items-center mb-4 shrink-0">
             <h3 className="font-bold text-[#111f42] text-sm uppercase tracking-wider">Monthly SCAR Trend</h3>
           </div>
           <div className="flex-1 relative w-full">
             <canvas ref={chartMainLineRef}></canvas>
           </div>
        </div>
      </div>
    </div>
  );
};

export default NcCharts;

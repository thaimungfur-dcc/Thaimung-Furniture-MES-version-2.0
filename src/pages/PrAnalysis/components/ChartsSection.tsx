import React, { useEffect, useRef } from 'react';
import { Activity, BarChart2, TrendingUp } from 'lucide-react';
import Chart from 'chart.js/auto';

interface ChartsSectionProps {
  period: string;
  loading: boolean;
}

export default function ChartsSection({ period, loading }: ChartsSectionProps) {
  const chartStatusRef = useRef<HTMLCanvasElement>(null);
  const chartDeptRef = useRef<HTMLCanvasElement>(null);
  const chartTrendRef = useRef<HTMLCanvasElement>(null);
  
  const chartInstances = useRef<Record<string, Chart | null>>({});

  useEffect(() => {
    if (loading) return;

    // Destroy existing instances if they exist
    Object.values(chartInstances.current).forEach((chart: any) => chart && chart.destroy());

    // Chart Options Configuration
    const commonOptions: any = {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: 'bottom',
          labels: {
            font: { family: "'Noto Sans Thai', sans-serif", size: 11 },
            usePointStyle: true,
            padding: 20
          }
        }
      }
    };

    // 1. Status Distribution (Doughnut)
    if (chartStatusRef.current) {
      chartInstances.current.status = new Chart(chartStatusRef.current, {
        type: 'doughnut',
        data: {
          labels: ['Approved', 'Pending', 'Revise', 'Rejected'],
          datasets: [{
            data: [65, 15, 12, 8],
            backgroundColor: ['#3F6212', '#D4AF37', '#EA580C', '#B43B42'],
            hoverOffset: 10,
            borderWidth: 0,
            cutout: '70%'
          } as any]
        },
        options: {
          ...commonOptions,
          plugins: {
            ...commonOptions.plugins,
            legend: { position: 'right', labels: { usePointStyle: true, boxWidth: 6 } }
          }
        }
      });
    }

    // 2. Spend by Department (Bar)
    if (chartDeptRef.current) {
      chartInstances.current.dept = new Chart(chartDeptRef.current, {
        type: 'bar',
        data: {
          labels: ['Production', 'Warehouse', 'Office', 'IT', 'Admin'],
          datasets: [{
            label: 'Spending (THB)',
            data: [450000, 280000, 150000, 320000, 95000],
            backgroundColor: '#111f42',
            borderRadius: 8,
            barThickness: 25
          }]
        },
        options: {
          ...commonOptions,
          plugins: { ...commonOptions.plugins, legend: { display: false } },
          scales: {
            y: { beginAtZero: true, grid: { borderDash: [5, 5], color: '#e2e8f0' } },
            x: { grid: { display: false } }
          }
        }
      });
    }

    // 3. Trend Chart (Line)
    if (chartTrendRef.current) {
      const ctx = chartTrendRef.current.getContext('2d');
      let gradient;
      if (ctx) {
        gradient = ctx.createLinearGradient(0, 0, 0, 300);
        gradient.addColorStop(0, 'rgba(212, 175, 55, 0.2)');
        gradient.addColorStop(1, 'rgba(212, 175, 55, 0)');
      }

      chartInstances.current.trend = new Chart(chartTrendRef.current, {
        type: 'line',
        data: {
          labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
          datasets: [{
            label: 'Requisition Volume',
            data: [850000, 720000, 980000, 1254800, 1100000, 1300000],
            borderColor: '#D4AF37',
            backgroundColor: gradient,
            borderWidth: 3,
            fill: true,
            tension: 0.4,
            pointRadius: 5,
            pointBackgroundColor: '#fff',
            pointBorderColor: '#D4AF37',
            pointHoverRadius: 7
          }]
        },
        options: {
          ...commonOptions,
          plugins: { ...commonOptions.plugins, legend: { display: false } },
          scales: {
            y: { grid: { borderDash: [5, 5], color: '#e2e8f0' } },
            x: { grid: { display: false } }
          }
        }
      });
    }

    return () => {
      Object.values(chartInstances.current).forEach((chart: any) => chart && chart.destroy());
    };
  }, [period, loading]);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 no-print">
        <div className="lg:col-span-4 bg-white p-6 rounded-[32px] border border-slate-100 shadow-sm flex flex-col h-[380px]">
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-bold text-[#111f42] flex items-center gap-2 text-sm uppercase tracking-wider">
              <Activity size={16} className="text-[#b84530]"/> Status Distribution
            </h3>
          </div>
          <div className="flex-1 relative">
            <canvas ref={chartStatusRef}></canvas>
          </div>
        </div>

        <div className="lg:col-span-8 bg-white p-6 rounded-[32px] border border-slate-100 shadow-sm flex flex-col h-[380px]">
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-bold text-[#111f42] flex items-center gap-2 text-sm uppercase tracking-wider">
              <BarChart2 size={16} className="text-[#b84530]"/> Spend by Department
            </h3>
            <div className="flex items-center gap-2 text-[10px] text-slate-400 font-bold uppercase tracking-widest">
              <div className="w-2.5 h-2.5 bg-[#111f42] rounded-sm"></div> Current Period
            </div>
          </div>
          <div className="flex-1 relative">
            <canvas ref={chartDeptRef}></canvas>
          </div>
        </div>
      </div>

      <div className="w-full bg-white p-6 rounded-[32px] border border-slate-100 shadow-sm flex flex-col h-[320px] no-print">
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-bold text-[#111f42] flex items-center gap-2 text-sm uppercase tracking-wider">
            <TrendingUp size={16} className="text-[#D4AF37]"/> Monthly Spending Trend
          </h3>
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Year 2026</p>
        </div>
        <div className="flex-1 relative">
          <canvas ref={chartTrendRef}></canvas>
        </div>
      </div>
    </div>
  );
}

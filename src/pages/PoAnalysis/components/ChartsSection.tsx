import React, { useEffect, useRef } from 'react';
import { Activity, Building2, TrendingUp } from 'lucide-react';
import Chart from 'chart.js/auto';

interface ChartsSectionProps {
  period: string;
  loading: boolean;
}

export default function ChartsSection({ period, loading }: ChartsSectionProps) {
  const chartStatusRef = useRef<HTMLCanvasElement>(null);
  const chartVendorRef = useRef<HTMLCanvasElement>(null);
  const chartTrendRef = useRef<HTMLCanvasElement>(null);
  
  const chartInstances = useRef<Record<string, Chart | null>>({});

  useEffect(() => {
    if (loading) return;

    Object.values(chartInstances.current).forEach((chart: any) => chart && chart.destroy());

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

    // 1. PO Status Distribution (Doughnut)
    if (chartStatusRef.current) {
      chartInstances.current.status = new Chart(chartStatusRef.current, {
        type: 'doughnut',
        data: {
          labels: ['Completed', 'Sent', 'Pending Approve', 'Partial'],
          datasets: [{
            data: [52, 18, 10, 6],
            backgroundColor: ['#3F6212', '#8EB1D1', '#D1A915', '#B5728A'],
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

    // 2. Top Vendors by Spend (Horizontal Bar)
    if (chartVendorRef.current) {
      chartInstances.current.vendor = new Chart(chartVendorRef.current, {
        type: 'bar',
        data: {
          labels: ['Thai Steel Co.', 'Nut & Bolt Shop', 'Global RM', 'Office Depot', 'Logistics Pro'],
          datasets: [{
            label: 'Spend Amount (THB)',
            data: [850000, 420000, 310000, 150000, 95000],
            backgroundColor: '#111f42',
            borderRadius: 6,
            barThickness: 15
          }]
        },
        options: {
          ...commonOptions,
          indexAxis: 'y',
          plugins: { ...commonOptions.plugins, legend: { display: false } },
          scales: {
            x: { beginAtZero: true, grid: { borderDash: [5, 5] } },
            y: { grid: { display: false } }
          }
        }
      });
    }

    // 3. Trend Chart (Line/Area)
    if (chartTrendRef.current) {
      const ctx = chartTrendRef.current.getContext('2d');
      let gradient;
      if (ctx) {
        gradient = ctx.createLinearGradient(0, 0, 0, 300);
        gradient.addColorStop(0, 'rgba(227, 98, 74, 0.2)');
        gradient.addColorStop(1, 'rgba(227, 98, 74, 0)');
      }

      chartInstances.current.trend = new Chart(chartTrendRef.current, {
        type: 'line',
        data: {
          labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
          datasets: [{
            label: 'Purchase Volume',
            data: [1200000, 1500000, 1850000, 2450000, 2100000, 2800000],
            borderColor: '#E3624A',
            backgroundColor: gradient,
            borderWidth: 3,
            fill: true,
            tension: 0.4,
            pointRadius: 4,
            pointBackgroundColor: '#fff',
            pointBorderColor: '#E3624A'
          }]
        },
        options: {
          ...commonOptions,
          plugins: { ...commonOptions.plugins, legend: { display: false } },
          scales: {
            y: { grid: { borderDash: [5, 5] } },
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
              <Activity size={16} className="text-[#b84530]"/> PO Status Distribution
            </h3>
          </div>
          <div className="flex-1 relative">
            <canvas ref={chartStatusRef}></canvas>
          </div>
        </div>

        <div className="lg:col-span-8 bg-white p-6 rounded-[32px] border border-slate-100 shadow-sm flex flex-col h-[380px]">
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-bold text-[#111f42] flex items-center gap-2 text-sm uppercase tracking-wider">
              <Building2 size={16} className="text-[#b84530]"/> Top Vendors by Spend
            </h3>
            <div className="flex items-center gap-2 text-[10px] text-slate-400 font-bold uppercase tracking-widest">
               TOP 5 คู่ค้า
            </div>
          </div>
          <div className="flex-1 relative">
            <canvas ref={chartVendorRef}></canvas>
          </div>
        </div>
      </div>

      <div className="w-full bg-white p-6 rounded-[32px] border border-slate-100 shadow-sm flex flex-col h-[320px] no-print">
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-bold text-[#111f42] flex items-center gap-2 text-sm uppercase tracking-wider">
            <TrendingUp size={16} className="text-[#E3624A]"/> Monthly Purchase Trend
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

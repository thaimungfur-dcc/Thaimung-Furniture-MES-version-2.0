import React, { useEffect, useRef } from 'react';
import Chart from 'chart.js/auto';

interface FabricDashboardProps {
  patterns: any[];
}

const FabricDashboard: React.FC<FabricDashboardProps> = ({ patterns }) => {
  const categoryChartRef = useRef<HTMLCanvasElement>(null);
  const compositionChartRef = useRef<HTMLCanvasElement>(null);
  const statusChartRef = useRef<HTMLCanvasElement>(null);
  const charts = useRef<{ category: any; composition: any; status: any }>({ category: null, composition: null, status: null });

  useEffect(() => {
    // Cleanup existing charts
    Object.values(charts.current).forEach((c: any) => c && c.destroy());

    Chart.defaults.font.family = "'JetBrains Mono', 'Noto Sans Thai', sans-serif";

    // 1. Category Chart
    const catData: Record<string, number> = {};
    patterns.forEach(p => {
      if (p.category) catData[p.category] = (catData[p.category] || 0) + 1;
    });

    if (categoryChartRef.current) {
      charts.current.category = new Chart(categoryChartRef.current, {
        type: 'doughnut',
        data: {
          labels: Object.keys(catData),
          datasets: [{
            data: Object.values(catData),
            backgroundColor: ['#111f42', '#ab8a3b', '#72A09E', '#E3624A', '#10b981'],
            borderWidth: 0
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          cutout: '65%',
          plugins: {
            legend: {
              position: 'right'
            }
          }
        }
      });
    }

    // 2. Composition Distribution Chart
    const compData: Record<string, number> = {};
    patterns.forEach(p => {
      const comp = p.composition || 'Other';
      compData[comp] = (compData[comp] || 0) + 1;
    });

    if (compositionChartRef.current) {
      charts.current.composition = new Chart(compositionChartRef.current, {
        type: 'bar',
        data: {
          labels: Object.keys(compData),
          datasets: [{
            label: 'Number of Designs',
            data: Object.values(compData),
            backgroundColor: '#111f42',
            borderRadius: 4
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              display: false
            }
          },
          scales: {
            y: {
              beginAtZero: true,
              ticks: {
                stepSize: 1
              }
            }
          }
        }
      });
    }

    // 3. Status Chart
    const statusData: Record<string, number> = {};
    patterns.forEach(p => {
      statusData[p.status] = (statusData[p.status] || 0) + 1;
    });

    if (statusChartRef.current) {
      charts.current.status = new Chart(statusChartRef.current, {
        type: 'bar',
        data: {
          labels: Object.keys(statusData),
          datasets: [{
            label: 'Number of Designs',
            data: Object.values(statusData),
            backgroundColor: '#ab8a3b',
            borderRadius: 4
          }]
        },
        options: {
          indexAxis: 'y',
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              display: false
            }
          },
          scales: {
            x: {
              beginAtZero: true,
              ticks: {
                stepSize: 1
              }
            }
          }
        }
      });
    }

    return () => {
      Object.values(charts.current).forEach((c: any) => c && c.destroy());
    };
  }, [patterns]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-full pb-6">
      <div className="bg-white/70 backdrop-blur-xl p-6 rounded-2xl border border-slate-100 shadow-sm h-80 flex flex-col lg:col-span-1">
        <h3 className="text-xs font-black text-[#111f42] uppercase mb-4 tracking-widest flex items-center gap-2">Designs by Category</h3>
        <div className="flex-1 relative min-h-0">
          <canvas ref={categoryChartRef}></canvas>
        </div>
      </div>
      <div className="bg-white/70 backdrop-blur-xl p-6 rounded-2xl border border-slate-100 shadow-sm h-80 flex flex-col lg:col-span-2">
        <h3 className="text-xs font-black text-[#111f42] uppercase mb-4 tracking-widest flex items-center gap-2">Composition Distribution</h3>
        <div className="flex-1 relative min-h-0">
          <canvas ref={compositionChartRef}></canvas>
        </div>
      </div>
      <div className="bg-white/70 backdrop-blur-xl p-6 rounded-2xl border border-slate-100 shadow-sm h-80 flex flex-col lg:col-span-3">
        <h3 className="text-xs font-black text-[#111f42] uppercase mb-4 tracking-widest flex items-center gap-2">Status Overview</h3>
        <div className="flex-1 relative min-h-0">
          <canvas ref={statusChartRef}></canvas>
        </div>
      </div>
    </div>
  );
};

export default FabricDashboard;

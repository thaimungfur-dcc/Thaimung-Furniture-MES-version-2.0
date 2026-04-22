import React, { useEffect, useRef } from 'react';
import Chart from 'chart.js/auto';
import { ArrowDownLeft, ArrowUpRight, RefreshCw, TrendingUp, BarChart3 } from 'lucide-react';

export default function DashboardCharts() {
    const movementTrendChartRef = useRef<HTMLCanvasElement>(null);
    const itemPopularityChartRef = useRef<HTMLCanvasElement>(null);
    const chartInstances = useRef<{ [key: string]: Chart | null }>({});

    useEffect(() => {
        const initCharts = () => {
            Object.values(chartInstances.current).forEach((c: any) => c && c.destroy());
            Chart.defaults.font.family = "'JetBrains Mono', 'Noto Sans Thai', sans-serif";

            if (movementTrendChartRef.current) {
                chartInstances.current.trend = new Chart(movementTrendChartRef.current, {
                    type: 'line',
                    data: {
                        labels: ['Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec', 'Jan'],
                        datasets: [
                            { label: 'Inbound', data: [300, 450, 400, 500, 480, 600, 750], borderColor: '#10b981', backgroundColor: 'rgba(16, 185, 129, 0.1)', fill: true, tension: 0.4 },
                            { label: 'Outbound', data: [250, 380, 410, 350, 420, 550, 610], borderColor: '#E3624A', backgroundColor: 'rgba(227, 98, 74, 0.1)', fill: true, tension: 0.4 }
                        ]
                    },
                    options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { position: 'top', align: 'end', labels: { usePointStyle: true, boxWidth: 6, font: { size: 10, weight: 'bold' } } } }, scales: { y: { beginAtZero: true, border: { dash: [4, 4] } }, x: { grid: { display: false } } } }
                });
            }

            if (itemPopularityChartRef.current) {
                chartInstances.current.popularity = new Chart(itemPopularityChartRef.current, {
                    type: 'bar',
                    data: {
                        labels: ['LD-001', 'RM-ST-01', 'OF-001', 'PK-BOX-01', 'GN-001'],
                        datasets: [{
                            label: 'Activity Count',
                            data: [124, 98, 86, 75, 42],
                            backgroundColor: '#111f42',
                            borderRadius: 4
                        }]
                    },
                    options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } }, scales: { x: { grid: { display: false } }, y: { beginAtZero: true } } }
                });
            }
        };
        const timer = setTimeout(initCharts, 100);
        return () => clearTimeout(timer);
    }, []);

    return (
        <div className="space-y-6 animate-fade-in-up pb-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 shrink-0">
                <div className="bg-white p-6 rounded-none border-2 border-slate-100 shadow-sm flex items-center gap-5">
                    <div className="w-14 h-14 bg-white border-2 border-emerald-100 rounded-none flex items-center justify-center text-emerald-600 shadow-sm"><ArrowDownLeft size={32}/></div>
                    <div>
                        <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-2 font-mono">Inbound (MTD)</p>
                        <h3 className="text-2xl font-black text-[#111f42] font-mono leading-none tracking-tighter uppercase">1,250 <span className="text-[10px] text-slate-400 font-sans ml-1 uppercase">Units</span></h3>
                    </div>
                </div>
                <div className="bg-white p-6 rounded-none border-2 border-slate-100 shadow-sm flex items-center gap-5">
                    <div className="w-14 h-14 bg-white border-2 border-rose-100 rounded-none flex items-center justify-center text-[#E3624A] shadow-sm"><ArrowUpRight size={32}/></div>
                    <div>
                        <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-2 font-mono">Outbound (MTD)</p>
                        <h3 className="text-2xl font-black text-[#111f42] font-mono leading-none tracking-tighter uppercase">840 <span className="text-[10px] text-slate-400 font-sans ml-1 uppercase">Units</span></h3>
                    </div>
                </div>
                <div className="bg-white p-6 rounded-none border-2 border-slate-100 shadow-sm flex items-center gap-5">
                    <div className="w-14 h-14 bg-white border-2 border-amber-100 rounded-none flex items-center justify-center text-[#ab8a3b] shadow-sm"><RefreshCw size={32}/></div>
                    <div>
                        <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-2 font-mono">Inventory Turn</p>
                        <h3 className="text-2xl font-black text-[#111f42] font-mono leading-none tracking-tighter uppercase">4.2x <span className="text-[10px] text-slate-400 font-sans ml-1 uppercase">Annual</span></h3>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white p-10 rounded-none border-2 border-slate-200 shadow-sm h-[400px] flex flex-col">
                    <div className="flex items-center gap-4 mb-8">
                        <div className="w-1.5 h-6 bg-[#ab8a3b] rounded-none"></div>
                        <h3 className="text-[12px] font-black text-[#111f42] uppercase tracking-[0.3em] font-mono">Monthly Stock Movement</h3>
                    </div>
                    <div className="flex-1 min-h-0 relative">
                        <canvas ref={movementTrendChartRef}></canvas>
                    </div>
                </div>
                <div className="bg-white p-10 rounded-none border-2 border-slate-200 shadow-sm h-[400px] flex flex-col">
                    <div className="flex items-center gap-4 mb-8">
                        <div className="w-1.5 h-6 bg-[#111f42] rounded-none"></div>
                        <h3 className="text-[12px] font-black text-[#111f42] uppercase tracking-[0.3em] font-mono">Stock Activity Index</h3>
                    </div>
                    <div className="flex-1 min-h-0 relative">
                        <canvas ref={itemPopularityChartRef}></canvas>
                    </div>
                </div>
            </div>
        </div>
    );
}

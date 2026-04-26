import React, { useEffect, useRef } from 'react';
import Chart from 'chart.js/auto';
import { TrendingUp, LayoutDashboard } from 'lucide-react';

export default function AnalysisCharts({ inventoryItems }: { inventoryItems: any[] }) {
    const statusChartRef = useRef<HTMLCanvasElement>(null);
    const lowStockChartRef = useRef<HTMLCanvasElement>(null);
    const chartInstances = useRef<{ [key: string]: Chart | null }>({});

    useEffect(() => {
        if (inventoryItems.length > 0) {
            const initCharts = () => {
                Object.values(chartInstances.current).forEach((c: any) => c && c.destroy());
                Chart.defaults.font.family = "'JetBrains Mono', 'Noto Sans Thai', sans-serif";

                if (statusChartRef.current) {
                    const counts: any = {};
                    (inventoryItems || []).forEach(i => counts[i.status] = (counts[i.status] || 0) + 1);
                    chartInstances.current.status = new Chart(statusChartRef.current, {
                        type: 'doughnut',
                        data: {
                            labels: Object.keys(counts),
                            datasets: [{
                                data: Object.values(counts),
                                backgroundColor: ['#10b981', '#ab8a3b', '#E3624A', '#111f42'],
                                borderWidth: 0
                            }]
                        },
                        options: { responsive: true, maintainAspectRatio: false, cutout: '70%', plugins: { legend: { position: 'right', labels: { usePointStyle: true, font: { size: 10, weight: 'bold' } } } } }
                    });
                }

                if (lowStockChartRef.current) {
                    const lowItems = inventoryItems?.filter(i => ['Low Stock', 'Critical', 'Out of Stock'].includes(i.status)).slice(0, 5);
                    chartInstances.current.lowStock = new Chart(lowStockChartRef.current, {
                        type: 'bar',
                        data: {
                            labels: lowItems?.map(i => i.id),
                            datasets: [
                                { label: 'Onhand', data: lowItems?.map(i => i.onhand), backgroundColor: '#E3624A', borderRadius: 4 },
                                { label: 'Min Point', data: lowItems?.map(i => i.minPoint), backgroundColor: '#f1f5f9', type: 'line', borderColor: '#ab8a3b', borderWidth: 2, pointRadius: 0 }
                            ]
                        },
                        options: { responsive: true, maintainAspectRatio: false, scales: { x: { grid: { display: false } }, y: { beginAtZero: true } } }
                    });
                }
            };
            const timer = setTimeout(initCharts, 100);
            return () => clearTimeout(timer);
        }
    }, [inventoryItems]);

    return (
        <div className="p-8 flex flex-col h-full bg-[#F9F7F6]/30 animate-fade-in-up flex-1">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 h-full pb-6">
                <div className="bg-white p-8 rounded-[32px] border border-slate-200 shadow-sm flex flex-col h-[450px]">
                    <div className="flex items-center gap-3 mb-8 px-2">
                        <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-[#ab8a3b] shadow-inner"><TrendingUp size={20}/></div>
                        <h3 className="text-sm font-black text-[#111f42] uppercase tracking-widest font-mono">Stock Status Distribution</h3>
                    </div>
                    <div className="flex-1 min-h-0 relative">
                        <canvas ref={statusChartRef}></canvas>
                    </div>
                </div>
                <div className="bg-white p-8 rounded-[32px] border border-slate-200 shadow-sm h-[450px] flex flex-col">
                    <div className="flex items-center gap-3 mb-8 px-2">
                        <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-[#E3624A] shadow-inner"><LayoutDashboard size={20}/></div>
                        <h3 className="text-sm font-black text-[#111f42] uppercase tracking-widest font-mono">Critical Low Stock Index</h3>
                    </div>
                    <div className="flex-1 min-h-0 relative">
                        <canvas ref={lowStockChartRef}></canvas>
                    </div>
                </div>
            </div>
        </div>
    );
}

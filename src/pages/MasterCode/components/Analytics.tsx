import React, { useEffect, useRef } from 'react';
import Chart from 'chart.js/auto';
import { MasterItem } from '../types';

interface AnalyticsProps {
  items: MasterItem[];
  activeTab: string;
}

export default function Analytics({ items, activeTab }: AnalyticsProps) {
  const typeChartRef = useRef<HTMLCanvasElement>(null);
  const valueChartRef = useRef<HTMLCanvasElement>(null);
  const charts = useRef<{ [key: string]: Chart | null }>({});

  useEffect(() => {
    if (activeTab === 'analytics' && items.length > 0) {
      if (charts.current.type) charts.current.type.destroy();
      if (charts.current.value) charts.current.value.destroy();

      Chart.defaults.font.family = "'JetBrains Mono', 'Noto Sans Thai', sans-serif";

      if (typeChartRef.current) {
        const counts: Record<string, number> = {};
        items.forEach(i => {
          const g = i.groups[0] || 'Uncategorized';
          counts[g] = (counts[g] || 0) + 1;
        });
        
        charts.current.type = new Chart(typeChartRef.current, {
          type: 'doughnut',
          data: {
            labels: Object.keys(counts),
            datasets: [{
              data: Object.values(counts),
              backgroundColor: ['#111f42', '#ab8a3b', '#E3624A', '#72A09E', '#4e546a', '#10b981'],
              borderWidth: 0
            }]
          },
          options: { 
            responsive: true, 
            maintainAspectRatio: false, 
            cutout: '70%', 
            plugins: { legend: { position: 'right' } } 
          }
        });
      }

      if (valueChartRef.current) {
        const mockData = items.slice(0, 6).map(i => ({code: i.mastCode, value: Math.floor(Math.random() * 1000)}));
        charts.current.value = new Chart(valueChartRef.current, {
          type: 'bar',
          data: {
            labels: mockData.map(i => i.code),
            datasets: [{
              label: 'Est. Material Value (kTHB)',
              data: mockData.map(i => i.value),
              backgroundColor: '#111f42',
              borderRadius: 4
            }]
          },
          options: { 
            responsive: true, 
            maintainAspectRatio: false, 
            scales: { x: { grid: { display: false } } } 
          }
        });
      }
    }
  }, [activeTab, items]);

  return (
    <div className="flex-1 overflow-y-auto master-custom-scrollbar p-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 h-full">
        <div className="bg-white/70 backdrop-blur-xl p-6 rounded-2xl border border-slate-100 shadow-sm h-96 flex flex-col">
          <h3 className="text-[12px] font-black text-[#111f42] mb-4 uppercase tracking-widest">Item Distribution by Group</h3>
          <div className="flex-grow relative flex items-center justify-center">
            <canvas ref={typeChartRef}></canvas>
          </div>
        </div>
        <div className="bg-white/70 backdrop-blur-xl p-6 rounded-2xl border border-slate-100 shadow-sm h-96 flex flex-col">
          <h3 className="text-[12px] font-black text-[#111f42] mb-4 uppercase tracking-widest">Top Materials Est. Value</h3>
          <div className="flex-grow relative flex items-center justify-center">
            <canvas ref={valueChartRef}></canvas>
          </div>
        </div>
      </div>
    </div>
  );
}

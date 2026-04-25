import React, { useState } from 'react';
import { TrendingUp } from 'lucide-react';

interface TrendData {
  month: string;
  balance: number;
}

interface TrendChartProps {
  data: TrendData[];
}

export default function TrendChart({ data }: TrendChartProps) {
  const [hoveredTrend, setHoveredTrend] = useState<number | null>(null);
  const maxTrend = Math.max(...data.map(d => d.balance)) * 1.1 || 500000;

  const generateLinePath = (data: TrendData[], key: keyof TrendData, height: number, width: number, maxValue: number) => {
    if (!data.length) return '';
    const xStep = width / (data.length - 1 || 1);
    return data.map((point, index) => {
      const x = index * xStep;
      const val = point[key] as number;
      const y = height - ((val / maxValue) * height);
      return `${index === 0 ? 'M' : 'L'} ${x} ${y}`;
    }).join(' ');
  };

  return (
    <div className="w-full bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex flex-col min-h-[360px]">
      <div className="flex justify-between items-center mb-6">
        <h3 className="font-bold text-[#111f42] flex items-center gap-2 text-lg"><TrendingUp size={20}/> Cash Balance Trend</h3>
        <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-widest">Year 2026 (12 Months)</p>
      </div>
      
      <div className="flex-1 relative w-full mt-2">
        <svg viewBox="0 0 1000 200" preserveAspectRatio="none" className="w-full h-full min-h-[220px] overflow-visible">
          <defs>
            <linearGradient id="areaGradientCF" x1="0" x2="0" y1="0" y2="1">
              <stop offset="0%" stopColor="#111f42" stopOpacity="0.2" />
              <stop offset="100%" stopColor="#111f42" stopOpacity="0" />
            </linearGradient>
          </defs>
          <line x1="0" y1="0" x2="1000" y2="0" stroke="#f1f5f9" strokeWidth="1" />
          <line x1="0" y1="100" x2="1000" y2="100" stroke="#f1f5f9" strokeWidth="1" />
          <line x1="0" y1="200" x2="1000" y2="200" stroke="#f1f5f9" strokeWidth="1" />
          
          <path 
            d={`${generateLinePath(data, 'balance', 200, 1000, maxTrend)} L 1000 200 L 0 200 Z`} 
            fill="url(#areaGradientCF)" 
            className="transition-all duration-300"
          />
          <path 
            d={generateLinePath(data, 'balance', 200, 1000, maxTrend)} 
            fill="none" 
            stroke="#111f42" 
            strokeWidth="4" 
            strokeLinejoin="round"
          />
          
          {data.map((point, index) => {
            const cx = index * (1000 / (data.length - 1));
            const cy = 200 - ((point.balance / maxTrend) * 200);
            return (
              <g key={index} 
                 onMouseEnter={() => setHoveredTrend(index)} 
                 onMouseLeave={() => setHoveredTrend(null)}
                 className="cursor-crosshair"
              >
                <line x1={cx} y1="0" x2={cx} y2="200" stroke="transparent" strokeWidth="60" />
                {hoveredTrend === index && (
                  <line x1={cx} y1={cy} x2={cx} y2="200" stroke="#cbd5e1" strokeWidth="2" strokeDasharray="4 4" />
                )}
                <circle cx={cx} cy={cy} r={hoveredTrend === index ? "8" : "6"} fill="white" 
                  stroke={hoveredTrend === index ? "#111f42" : "#E3624A"} 
                  strokeWidth={hoveredTrend === index ? "4" : "3"}
                  className="transition-all duration-200" 
                />
              </g>
            );
          })}
        </svg>

        {hoveredTrend !== null && (
          <div 
            className="absolute bg-[#111f42] text-white p-3 rounded-lg shadow-xl text-[11px] pointer-events-none z-20 animate-fade-up min-w-[120px]"
            style={{ 
              left: `${(hoveredTrend / (data.length - 1)) * 100}%`, 
              top: `${(1 - (data[hoveredTrend].balance / maxTrend)) * 100}%`,
              transform: 'translate(-50%, -120%)'
            }}
          >
            <p className="font-bold text-slate-300 mb-1">{data[hoveredTrend].month} 2026</p>
            <p className="flex justify-between gap-4"><span>Balance:</span> <span className="font-bold text-[#D4AF37]">฿{data[hoveredTrend].balance?.toLocaleString()}</span></p>
            <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 border-l-8 border-r-8 border-t-8 border-transparent border-t-[#111f42]"></div>
          </div>
        )}

        <div className="flex justify-between w-full mt-4 px-1">
          {data.map((d, i) => (
            <span key={i} className={`text-[11px] font-bold uppercase transition-colors ${hoveredTrend === i ? 'text-[#111f42]' : 'text-slate-400'}`}>
              {d.month}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

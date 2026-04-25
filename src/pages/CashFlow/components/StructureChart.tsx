import React from 'react';
import { PieChart } from 'lucide-react';

interface StructureChartProps {
  stats: {
    netCFO: number;
    netCFI: number;
    netCFF: number;
  };
}

export default function StructureChart({ stats }: StructureChartProps) {
  const absCFO = Math.abs(stats.netCFO);
  const absCFI = Math.abs(stats.netCFI);
  const absCFF = Math.abs(stats.netCFF);
  const totalAbs = absCFO + absCFI + absCFF || 1;
  
  const pctCFO = (absCFO / totalAbs) * 100;
  const pctCFI = (absCFI / totalAbs) * 100;
  const pctCFF = (absCFF / totalAbs) * 100;

  return (
    <div className="flex-1 bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex flex-col h-auto min-h-[320px]">
      <div className="flex justify-between items-center mb-6">
        <h3 className="font-bold text-[#111f42] flex items-center gap-2 text-lg"><PieChart size={20}/> Flow Structure</h3>
      </div>
      
      <div className="flex-1 flex flex-col md:flex-row items-center justify-center gap-10 lg:gap-20 relative px-4 py-6">
        <div 
          className="w-48 h-48 sm:w-56 sm:h-56 lg:w-64 lg:h-64 rounded-full relative flex items-center justify-center shadow-sm flex-shrink-0" 
          style={{ background: `conic-gradient(#6b7556 0% ${pctCFO}%, #d97706 ${pctCFO}% ${pctCFO+pctCFI}%, #5b21b6 ${pctCFO+pctCFI}% 100%)` }}
        >
          <div className="w-36 h-36 sm:w-44 sm:h-44 lg:w-52 lg:h-52 bg-white rounded-full flex flex-col items-center justify-center shadow-inner z-10">
            <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-widest mb-1">Total Flow</p>
            <p className="text-xl sm:text-2xl font-bold text-[#111f42]">฿{totalAbs?.toLocaleString()}</p>
          </div>
        </div>

        <div className="flex flex-col gap-4 w-full max-w-[200px]">
          <div className="w-full text-left bg-[#f0f4f8] p-4 rounded-2xl border border-[#f0f4f8]">
            <p className="flex items-center gap-2 text-[11px] font-bold text-[#6b7556] uppercase tracking-wider mb-2">
              <span className="w-2.5 h-2.5 bg-[#6b7556] rounded-full"></span> CFO
            </p>
            <p className="font-bold text-xl text-[#111f42] leading-none">{pctCFO.toFixed(1)}%</p>
          </div>
          <div className="w-full text-left bg-orange-50 p-4 rounded-2xl border border-orange-50">
            <p className="flex items-center gap-2 text-[11px] font-bold text-[#d97706] uppercase tracking-wider mb-2">
              <span className="w-2.5 h-2.5 bg-[#d97706] rounded-full"></span> CFI
            </p>
            <p className="font-bold text-xl text-[#111f42] leading-none">{pctCFI.toFixed(1)}%</p>
          </div>
          <div className="w-full text-left bg-purple-50 p-4 rounded-2xl border border-purple-50">
            <p className="flex items-center gap-2 text-[11px] font-bold text-[#5b21b6] uppercase tracking-wider mb-2">
              <span className="w-2.5 h-2.5 bg-[#5b21b6] rounded-full"></span> CFF
            </p>
            <p className="font-bold text-xl text-[#111f42] leading-none">{pctCFF.toFixed(1)}%</p>
          </div>
        </div>
      </div>
    </div>
  );
}

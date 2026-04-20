import React from 'react';
import { PieChart } from 'lucide-react';

interface VatCompositionChartProps {
  totalSalesVat: number;
  totalPurchaseVat: number;
}

const VatCompositionChart: React.FC<VatCompositionChartProps> = ({ totalSalesVat, totalPurchaseVat }) => {
  const totalVatVolume = totalSalesVat + totalPurchaseVat;
  const salesPct = totalVatVolume ? (totalSalesVat / totalVatVolume) * 100 : 50;

  return (
    <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex flex-col h-[320px]">
      <div className="flex justify-between items-center mb-6">
        <h3 className="font-bold text-[#111f42] flex items-center gap-2">
          <PieChart size={18}/> VAT Composition
        </h3>
      </div>
      
      <div className="flex-1 flex flex-row items-center justify-center gap-10 relative px-2">
        <div 
          className="w-48 h-48 rounded-full relative flex items-center justify-center shadow-sm flex-shrink-0" 
          style={{ background: `conic-gradient(#E3624A ${salesPct}%, #6b7556 ${salesPct}% 100%)` }}
        >
          <div className="w-36 h-36 bg-white rounded-full flex flex-col items-center justify-center shadow-inner z-10">
            <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-widest mb-1">Total Volume</p>
            <p className="text-xl font-bold text-[#111f42]">฿{totalVatVolume.toLocaleString()}</p>
          </div>
        </div>

        <div className="flex flex-col gap-4 w-full max-w-[120px]">
          <div className="w-full text-center bg-[#fdebe9] p-3 rounded-xl border border-[#fdebe9]">
            <p className="flex items-center justify-center gap-1.5 text-[10px] font-bold text-[#E3624A] uppercase tracking-wider mb-1">
              <span className="w-2 h-2 bg-[#E3624A] rounded-full"></span> Sales
            </p>
            <p className="font-bold text-lg text-[#111f42] leading-none">{salesPct.toFixed(1)}%</p>
          </div>
          <div className="w-full text-center bg-[#f0f4f8] p-3 rounded-xl border border-[#f0f4f8]">
            <p className="flex items-center justify-center gap-1.5 text-[10px] font-bold text-[#6b7556] uppercase tracking-wider mb-1">
              <span className="w-2 h-2 bg-[#6b7556] rounded-full"></span> Purchase
            </p>
            <p className="font-bold text-lg text-[#111f42] leading-none">{(100 - salesPct).toFixed(1)}%</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VatCompositionChart;

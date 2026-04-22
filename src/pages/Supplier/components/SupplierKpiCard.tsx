import React from 'react';
import { Truck, ShieldCheck, Package, Star } from 'lucide-react';

interface SupplierKpiCardProps {
  stats: {
    total: number;
    active: number;
    supplierCat: number;
    avgRating: string;
  };
}

const SupplierKpiCard: React.FC<SupplierKpiCardProps> = ({ stats }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-5 no-print animate-in fade-in duration-500">
      <div className="bg-white p-5 rounded-none border-2 border-slate-100 shadow-sm flex flex-col justify-between relative overflow-hidden h-[130px] group transition-all hover:border-[#ab8a3b]/30">
        <div className="z-10 flex justify-between items-start">
          <p className="font-black text-[10px] uppercase tracking-[0.2em] text-[#111f42]">Total Vendors</p>
          <div className="w-10 h-10 rounded-none bg-slate-50 text-slate-400 flex items-center justify-center border-2 border-slate-100 shadow-inner"><Truck size={20} /></div>
        </div>
        <div className="z-10 mt-auto"><h3 className="text-[32px] font-black text-[#111f42] tracking-tighter leading-none">{stats.total}</h3></div>
        <div className="absolute -bottom-10 -right-6 text-slate-100 opacity-50 group-hover:scale-110 -rotate-[15deg] transition-transform duration-500 z-0"><Truck size={140} /></div>
      </div>
      
      <div className="bg-white p-5 rounded-none border-2 border-slate-100 shadow-sm flex flex-col justify-between relative overflow-hidden h-[130px] group transition-all hover:border-[#10b981]/30">
        <div className="z-10 flex justify-between items-start">
          <p className="font-black text-[10px] uppercase tracking-[0.2em] text-[#10b981]">Active Suppliers</p>
          <div className="w-10 h-10 rounded-none bg-[#10b981]/10 text-[#10b981] flex items-center justify-center border-2 border-[#10b981]/20 shadow-inner"><ShieldCheck size={20} /></div>
        </div>
        <div className="z-10 mt-auto"><h3 className="text-[32px] font-black text-[#10b981] tracking-tighter leading-none">{stats.active}</h3></div>
        <div className="absolute -bottom-10 -right-6 text-[#10b981] opacity-10 group-hover:scale-110 -rotate-[15deg] transition-transform duration-500 z-0"><ShieldCheck size={140} /></div>
      </div>
      
      <div className="bg-white p-5 rounded-none border-2 border-slate-100 shadow-sm flex flex-col justify-between relative overflow-hidden h-[130px] group transition-all hover:border-[#72A09E]/30">
        <div className="z-10 flex justify-between items-start">
          <p className="font-black text-[10px] uppercase tracking-[0.2em] text-[#72A09E]">Raw Material</p>
          <div className="w-10 h-10 rounded-none bg-[#72A09E]/10 text-[#72A09E] flex items-center justify-center border-2 border-[#72A09E]/20 shadow-inner"><Package size={20} /></div>
        </div>
        <div className="z-10 mt-auto"><h3 className="text-[32px] font-black text-[#72A09E] tracking-tighter leading-none">{stats.supplierCat}</h3></div>
        <div className="absolute -bottom-10 -right-6 text-[#72A09E] opacity-10 group-hover:scale-110 -rotate-[15deg] transition-transform duration-500 z-0"><Package size={140} /></div>
      </div>
      
      <div className="bg-white p-5 rounded-none border-2 border-slate-100 shadow-sm flex flex-col justify-between relative overflow-hidden h-[130px] group transition-all hover:border-[#ab8a3b]/30">
        <div className="z-10 flex justify-between items-start">
          <p className="font-black text-[10px] uppercase tracking-[0.2em] text-[#ab8a3b]">Avg. Rating</p>
          <div className="w-10 h-10 rounded-none bg-[#ab8a3b]/10 text-[#ab8a3b] flex items-center justify-center border-2 border-[#ab8a3b]/20 shadow-inner"><Star size={20} /></div>
        </div>
        <div className="z-10 mt-auto"><h3 className="text-[32px] font-black text-[#ab8a3b] tracking-tighter leading-none">{stats.avgRating}</h3></div>
        <div className="absolute -bottom-10 -right-6 text-[#ab8a3b] opacity-10 group-hover:scale-110 -rotate-[15deg] transition-transform duration-500 z-0"><Star size={140} /></div>
      </div>
    </div>
  );
};

export default SupplierKpiCard;

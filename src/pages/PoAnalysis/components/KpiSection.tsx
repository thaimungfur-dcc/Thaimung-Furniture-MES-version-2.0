import React from 'react';
import { ShoppingBag, Truck, PackageCheck, Coins, ArrowUpRight } from 'lucide-react';

interface Stats {
  total: number;
  pendingDelivery: number;
  onTimeRate: number;
  totalSpend: number;
}

export default function KpiSection({ stats }: { stats: Stats }) {
  const formatCurrency = (val: number) => '฿' + (val || 0).toLocaleString();

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-5 animate-in fade-in duration-500">
      <div className="bg-white p-5 rounded-3xl border border-slate-100 shadow-sm flex flex-col justify-between relative overflow-hidden h-[140px] group">
        <div className="z-10 flex justify-between items-start">
          <p className="font-semibold text-[10px] uppercase tracking-widest text-slate-500">Total Orders</p>
          <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-500 flex items-center justify-center border border-blue-100">
            <ShoppingBag size={20} />
          </div>
        </div>
        <div className="z-10 mt-auto">
          <h3 className="text-[32px] font-bold text-[#111f42] leading-none mb-1">{stats.total}</h3>
          <p className="text-[10px] text-slate-400 font-medium">All POs Issued</p>
        </div>
        <div className="absolute -bottom-8 -right-4 text-slate-100 opacity-40 group-hover:scale-110 transition-transform duration-500 z-0">
          <ShoppingBag size={130} />
        </div>
      </div>

      <div className="bg-white p-5 rounded-3xl border border-slate-100 shadow-sm flex flex-col justify-between relative overflow-hidden h-[140px] group">
        <div className="z-10 flex justify-between items-start">
          <p className="font-semibold text-[10px] uppercase tracking-widest text-amber-600">Pending Delivery</p>
          <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-500 flex items-center justify-center border border-amber-100">
            <Truck size={20} />
          </div>
        </div>
        <div className="z-10 mt-auto">
          <h3 className="text-[32px] font-bold text-amber-600 leading-none mb-1">{stats.pendingDelivery}</h3>
          <p className="text-[10px] text-slate-400 font-medium">Waiting for Goods</p>
        </div>
        <div className="absolute -bottom-8 -right-4 text-amber-50 opacity-40 group-hover:scale-110 transition-transform duration-500 z-0">
          <Truck size={130} />
        </div>
      </div>

      <div className="bg-white p-5 rounded-3xl border border-slate-100 shadow-sm flex flex-col justify-between relative overflow-hidden h-[140px] group">
        <div className="z-10 flex justify-between items-start">
          <p className="font-semibold text-[10px] uppercase tracking-widest text-emerald-600">On-Time Rate</p>
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center border border-emerald-100">
            <PackageCheck size={20} />
          </div>
        </div>
        <div className="z-10 mt-auto">
          <div className="flex items-baseline gap-2">
            <h3 className="text-[32px] font-bold text-emerald-600 leading-none mb-1">{stats.onTimeRate}%</h3>
            <span className="text-emerald-500 flex items-center text-[10px] font-bold"><ArrowUpRight size={12}/> 1.2%</span>
          </div>
          <p className="text-[10px] text-slate-400 font-medium">Vendor Performance</p>
        </div>
        <div className="absolute -bottom-8 -right-4 text-emerald-50 opacity-40 group-hover:scale-110 transition-transform duration-500 z-0">
          <PackageCheck size={130} />
        </div>
      </div>

      <div className="bg-white p-5 rounded-3xl border border-slate-100 shadow-sm flex flex-col justify-between relative overflow-hidden h-[140px] group">
        <div className="z-10 flex justify-between items-start">
          <p className="font-semibold text-[10px] uppercase tracking-widest text-[#111f42]">Total Spend</p>
          <div className="w-10 h-10 rounded-xl bg-[#111f42]/5 text-[#111f42] flex items-center justify-center border border-[#111f42]/10">
            <Coins size={20} />
          </div>
        </div>
        <div className="z-10 mt-auto">
          <h3 className="text-[22px] font-bold text-[#111f42] leading-none mb-1 truncate">{formatCurrency(stats.totalSpend)}</h3>
          <p className="text-[10px] text-slate-400 font-medium">Net Value</p>
        </div>
        <div className="absolute -bottom-8 -right-4 text-slate-200 opacity-30 group-hover:scale-110 transition-transform duration-500 z-0">
          <Coins size={130} />
        </div>
      </div>
    </div>
  );
}

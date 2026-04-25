import React from 'react';
import { Lock } from 'lucide-react';
import { formatAmount } from '../utils';

export default function KanbanBoard({ assets }: any) {
  const columns = [
    { id: 'Active', title: 'ใช้งานปกติ (Active)', color: 'bg-emerald-500' },
    { id: 'Maintenance', title: 'ส่งซ่อม (Maintenance)', color: 'bg-amber-500' },
    { id: 'Disposed', title: 'ตัดจำหน่าย (Disposed)', color: 'bg-rose-500' },
  ];

  return (
    <div className="flex-1 overflow-x-auto overflow-y-hidden kanban-scroll pb-4 flex h-full mt-2">
      <div className="flex gap-6 h-full min-w-max items-start">
        {columns?.map(col => {
          const colItems = assets.filter((i: any) => i.status === col.id);
          return (
            <div key={col.id} className="w-[320px] flex-shrink-0 flex flex-col h-full bg-white/60 backdrop-blur-md rounded-2xl p-4 border border-white shadow-sm">
              <div className="flex justify-between items-center mb-4">
                <h4 className="font-black text-[#223149] text-xs uppercase tracking-widest flex items-center gap-2">
                  <div className={`w-2.5 h-2.5 rounded-full ${col.color}`}></div> {col.title}
                </h4>
                <span className="bg-white/80 text-[#223149] text-[10px] px-2 py-0.5 rounded-full font-bold border border-white shadow-sm">{colItems.length}</span>
              </div>
              <div className="flex-1 overflow-y-auto kanban-scroll space-y-3 pr-2">
                {colItems?.map((v: any) => (
                  <div key={v.id} className="bg-white/90 backdrop-blur p-4 rounded-xl shadow-sm border border-white hover:shadow-md transition-all group relative">
                    <div className="flex justify-between items-start mb-2 mt-1">
                      <span className="font-mono text-[10px] font-bold px-2 py-0.5 rounded bg-slate-50 border border-slate-200 text-[#223149]">{v.assetCode}</span>
                      <span className="text-[9px] font-bold text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded">{v.category}</span>
                    </div>
                    <h5 className="font-bold text-sm text-[#223149] mb-1 leading-snug">{v.name}</h5>
                    <p className="text-[10px] font-semibold text-[#7693a6] truncate mb-2">Location: {v.location}</p>
                    <div className="bg-slate-50 p-2 rounded-lg mb-3 border border-slate-100">
                       <div className="flex justify-between text-[9px] font-bold text-slate-400 mb-1 uppercase"><span>Cost</span> <span>NBV</span></div>
                       <div className="flex justify-between text-[11px] font-mono font-black text-[#223149]">
                          <span>฿{formatAmount(v.cost)}</span>
                          <span className="text-[#0f766e]">฿{formatAmount(v.nbv)}</span>
                       </div>
                    </div>
                    <div className="border-t border-black/5 pt-3 flex justify-between items-center">
                      <span className="text-[8px] font-black text-slate-300 uppercase tracking-widest flex items-center gap-1"><Lock size={8}/> Locked</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

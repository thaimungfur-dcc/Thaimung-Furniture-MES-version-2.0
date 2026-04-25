import React from 'react';
import { Lock } from 'lucide-react';
import { getCategoryIcon, getSourceBadge } from '../utils';

export default function KanbanBoard({ vouchers }: any) {
  const columns = [
    { id: 'Draft', title: 'รวบรวมบิล (Draft)', color: 'bg-[#7693a6]' },
    { id: 'Pending Approval', title: 'รออนุมัติ (Review)', color: 'bg-[#d9b343]' },
    { id: 'Approved', title: 'อนุมัติแล้ว (Approved)', color: 'bg-[#496ca8]' },
    { id: 'Reimbursed', title: 'จ่ายเงินแล้ว (Paid)', color: 'bg-[#7fa85a]' },
    { id: 'Rejected', title: 'ไม่อนุมัติ (Rejected)', color: 'bg-[#ce5a43]' },
  ];

  return (
    <div className="flex-1 overflow-x-auto overflow-y-hidden kanban-scroll pb-4 flex h-full mt-2">
      <div className="flex gap-6 h-full min-w-max items-start">
        {columns.map(col => {
          const colItems = vouchers.filter((i: any) => i.status === col.id);
          return (
            <div key={col.id} className="w-[320px] flex-shrink-0 flex flex-col h-full bg-white/60 backdrop-blur-md rounded-2xl p-4 border border-white shadow-sm">
              <div className="flex justify-between items-center mb-4">
                <h4 className="font-black text-[#223149] text-xs uppercase tracking-widest flex items-center gap-2">
                  <div className={`w-2.5 h-2.5 rounded-full ${col.color}`}></div> {col.title}
                </h4>
                <span className="bg-white/80 text-[#223149] text-[10px] px-2 py-0.5 rounded-full font-bold border border-white shadow-sm">{colItems.length}</span>
              </div>
              <div className="flex-1 overflow-y-auto kanban-scroll space-y-3 pr-2">
                {colItems.map((v: any) => (
                  <div key={v.id} className="bg-white/90 backdrop-blur p-4 rounded-xl shadow-sm border border-white hover:shadow-md transition-all group relative">
                    <div className="flex justify-between items-start mb-2 mt-1">
                      <span className="font-mono text-[10px] font-bold px-2 py-0.5 rounded bg-slate-50 border border-slate-200 text-[#223149]">{v.pcvNo}</span>
                      {getSourceBadge(v.source)}
                    </div>
                    <h5 className="font-bold text-sm text-[#223149] mb-1 leading-snug">{v.description}</h5>
                    <p className="text-[10px] font-semibold text-[#7693a6] truncate mb-2">{getCategoryIcon(v.category)} {v.category}</p>
                    <div className="border-t border-black/5 pt-3 flex justify-between items-center mt-3">
                      <div className="flex flex-col">
                        <span className="text-xs font-black text-[#223149]">฿{v.amount?.toLocaleString()}</span>
                        <span className="text-[9px] text-slate-400">By {v.employee}</span>
                      </div>
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

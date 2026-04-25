import React from 'react';
import { AlertTriangle, Lock } from 'lucide-react';
import { getFormatAmount, getSourceBadge } from '../utils';

export default function KanbanBoard({ records }: any) {
  const columns = [
    { id: 'Unmatched', title: 'รอตรวจสอบ (Unmatched)', color: 'bg-[#ce5a43]' },
    { id: 'Investigating', title: 'กำลังตรวจสอบ (Investigating)', color: 'bg-[#d9b343]' },
    { id: 'Adjusting', title: 'รอปรับปรุงบัญชี (Adjusting)', color: 'bg-[#496ca8]' },
    { id: 'Reconciled', title: 'กระทบยอดแล้ว (Reconciled)', color: 'bg-[#0ea5e9]' },
  ];

  return (
    <div className="flex-1 overflow-x-auto overflow-y-hidden kanban-scroll pb-4 flex h-full mt-2">
      <div className="flex gap-6 h-full min-w-max items-start">
        {columns?.map(col => {
          const colItems = records.filter((i: any) => i.status === col.id);
          return (
            <div key={col.id} className="w-[320px] flex-shrink-0 flex flex-col h-full bg-white/60 backdrop-blur-md rounded-2xl p-4 border border-white shadow-sm">
              <div className="flex justify-between items-center mb-4">
                <h4 className="font-black text-[#223149] text-xs uppercase tracking-widest flex items-center gap-2">
                  <div className={`w-2.5 h-2.5 rounded-full ${col.color}`}></div> {col.title}
                </h4>
                <span className="bg-white/80 text-[#223149] text-[10px] px-2 py-0.5 rounded-full font-bold border border-white shadow-sm">{colItems.length}</span>
              </div>
              <div className="flex-1 overflow-y-auto kanban-scroll space-y-3 pr-2">
                {colItems?.map((rec: any) => (
                  <div key={rec.id} className="bg-white/90 backdrop-blur p-4 rounded-xl shadow-sm border border-white hover:shadow-md transition-all group relative">
                    <div className="flex justify-between items-start mb-2 mt-1">
                      <span className="font-mono text-[10px] font-bold px-2 py-0.5 rounded bg-white border border-slate-200 text-[#223149]">{rec.refNo}</span>
                      {getSourceBadge(rec.source)}
                    </div>
                    <h5 className="font-bold text-sm text-[#223149] mb-1 leading-snug">{rec.description}</h5>
                    <div className="bg-slate-50 border border-slate-100 p-2 rounded-lg text-[9px] font-mono grid grid-cols-2 gap-1 mb-3">
                      <div className="text-slate-500">Bank: {getFormatAmount(rec.bankAmount)}</div>
                      <div className="text-slate-500 text-right">Book: {getFormatAmount(rec.bookAmount)}</div>
                    </div>
                    <div className="border-t border-black/5 pt-3 flex justify-between items-center">
                      {rec.diff > 0 ? (
                        <span className="text-xs font-black text-[#ce5a43] flex items-center gap-1"><AlertTriangle size={12}/> Diff: ฿{rec.diff?.toLocaleString()}</span>
                      ) : (
                        <span className="text-xs font-black text-[#0ea5e9]">Matched</span>
                      )}
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

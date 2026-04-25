import React from 'react';
import { Lock, FileText } from 'lucide-react';
import { formatDate } from '../utils';

export default function KanbanBoard({ taxRecords }: any) {
  const columns = [
    { id: 'Recorded', title: 'บันทึกแล้ว (Recorded)', color: 'bg-slate-400' },
    { id: 'Verified', title: 'ตรวจสอบแล้ว (Verified)', color: 'bg-[#496ca8]' },
    { id: 'Filed', title: 'ยื่นภาษีแล้ว (Filed)', color: 'bg-[#7fa85a]' },
  ];

  return (
    <div className="flex-1 overflow-x-auto overflow-y-hidden kanban-scroll pb-4 flex h-full mt-2">
      <div className="flex gap-6 h-full min-w-max items-start">
        {columns.map(col => {
          const colItems = taxRecords.filter((i: any) => i.status === col.id);
          return (
            <div key={col.id} className="w-[320px] flex-shrink-0 flex flex-col h-full bg-white/60 backdrop-blur-md rounded-2xl p-4 border border-white shadow-sm">
              <div className="flex justify-between items-center mb-4">
                <h4 className="font-black text-[#1e293b] text-xs uppercase tracking-widest flex items-center gap-2">
                  <div className={`w-2.5 h-2.5 rounded-full ${col.color}`}></div> 
                  {col.title}
                </h4>
                <span className="bg-white text-slate-500 text-[10px] px-2 py-0.5 rounded-full font-bold border border-slate-100">{colItems.length}</span>
              </div>
              
              <div className="flex-1 overflow-y-auto kanban-scroll space-y-3 pr-2">
                {colItems.map((rec: any) => (
                  <div key={rec.id} className="bg-white/90 backdrop-blur p-4 rounded-xl shadow-sm border border-white group relative">
                    <div className="flex justify-between items-start mb-2">
                      <span className="font-mono text-[10px] font-bold px-2 py-0.5 rounded bg-slate-100 text-[#1e293b] border border-slate-200">{rec.docNo}</span>
                      <span className={`px-2 py-0.5 rounded text-[8px] font-black uppercase tracking-widest text-white ${rec.type === 'Sales' ? 'bg-[#ce5a43]' : 'bg-[#496ca8]'}`}>{rec.type}</span>
                    </div>
                    <h5 className="font-bold text-sm text-[#1e293b] mb-1 truncate">{rec.entityName}</h5>
                    <div className="flex items-center gap-2 text-[10px] text-slate-500 font-medium mb-3">
                       <FileText size={12}/> {rec.taxMethod}
                    </div>
                    <div className="bg-slate-50 p-2 rounded-lg mb-3">
                       <div className="flex justify-between text-[9px] font-bold text-slate-400 mb-1 uppercase"><span>Base</span> <span>VAT (7%)</span></div>
                       <div className="flex justify-between text-[12px] font-mono font-black text-[#1e293b]">
                          <span>฿{rec.baseAmount?.toLocaleString()}</span>
                          <span className={rec.type === 'Sales' ? 'text-[#ce5a43]' : 'text-[#496ca8]'}>฿{rec.vatAmount?.toLocaleString()}</span>
                       </div>
                    </div>
                    <div className="border-t border-slate-100 pt-3 flex justify-between items-center">
                       <span className="text-[10px] font-bold text-slate-400">{formatDate(rec.date)}</span>
                       <span className="text-[8px] font-black text-slate-300 uppercase tracking-widest flex items-center gap-1"><Lock size={8}/> Synced</span>
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

import React from 'react';
import { FileWarning, CreditCard, CheckCircle, UserX } from 'lucide-react';
import { formatDate } from '../utils';

export default function KanbanBoard({ invoices, updateStatus, setPaymentModal }: any) {
  const columns = [
    { id: 'Pending Billing', title: 'รอวางบิล', color: 'bg-[#7693a6]', border: 'border-[#7693a6]', txt: 'text-[#7693a6]' },
    { id: 'Billed', title: 'วางบิลแล้ว', color: 'bg-[#496ca8]', border: 'border-[#496ca8]', txt: 'text-[#496ca8]' },
    { id: 'Waiting Payment', title: 'รอชำระ', color: 'bg-[#d9b343]', border: 'border-[#d9b343]', txt: 'text-[#d9b343]' },
    { id: 'Overdue', title: 'เกินกำหนด', color: 'bg-[#ce5a43]', border: 'border-[#ce5a43]', txt: 'text-[#ce5a43]' },
    { id: 'Bad Debt', title: 'หนี้สูญ', color: 'bg-[#933b5b]', border: 'border-[#933b5b]', txt: 'text-[#933b5b]' },
    { id: 'Paid', title: 'ชำระแล้ว', color: 'bg-[#7fa85a]', border: 'border-[#7fa85a]', txt: 'text-[#7fa85a]' },
  ];

  return (
    <div className="flex-1 overflow-x-auto overflow-y-hidden kanban-scroll pb-4 no-print flex h-full mt-2">
      <div className="flex gap-6 h-full min-w-max items-start">
        {columns.map(col => {
          const colItems = invoices.filter((i: any) => i.status === col.id);
          return (
            <div key={col.id} className="w-[320px] flex-shrink-0 flex flex-col h-full bg-white/60 backdrop-blur-md rounded-2xl p-4 border border-white shadow-sm">
              <div className="flex justify-between items-center mb-4">
                <h4 className="font-black text-[#223149] text-xs uppercase tracking-widest flex items-center gap-2">
                  <div className={`w-2.5 h-2.5 rounded-full ${col.color}`}></div> 
                  {col.title}
                </h4>
                <span className="bg-white/80 text-[#223149] text-[10px] px-2 py-0.5 rounded-full font-bold border border-white shadow-sm">{colItems.length}</span>
              </div>
              
              <div className="flex-1 overflow-y-auto kanban-scroll space-y-3 pr-2">
                {colItems.map((inv: any) => (
                  <div key={inv.id} className="bg-white/90 backdrop-blur p-4 rounded-xl shadow-sm border border-white hover:shadow-md transition-all cursor-pointer group relative" onClick={() => (col.id !== 'Paid' && col.id !== 'Bad Debt') && setPaymentModal(inv)}>
                    
                    <div className={`absolute top-0 right-0 px-2 py-0.5 rounded-bl-lg rounded-tr-xl text-[8px] font-bold uppercase tracking-widest text-white
                      ${inv.risk === 'High' ? 'bg-[#ce5a43]' : inv.risk === 'Medium' ? 'bg-[#d9b343]' : 'bg-[#7fa85a]'}
                    `}>
                      {inv.risk} Risk
                    </div>

                    <div className="flex justify-between items-start mb-2 mt-1">
                      <span className={`font-mono text-[10px] font-bold px-2 py-0.5 rounded bg-white border ${col.border} ${col.txt}`}>{inv.invNo}</span>
                    </div>
                    <h5 className="font-bold text-sm text-[#223149] mb-1 truncate pr-16" title={inv.customer}>{inv.customer}</h5>
                    <p className="text-[9px] font-mono text-[#7693a6]">Due: {formatDate(inv.dueDate)}</p>

                    {inv.exceptionReason && (
                      <div className="mt-2 bg-red-50 text-red-600 px-2 py-1 rounded text-[9px] font-semibold flex items-center gap-1">
                        <FileWarning size={10} /> {inv.exceptionReason}
                      </div>
                    )}

                    <div className="border-t border-black/5 pt-3 flex justify-between items-center mt-3">
                      <span className="text-xs font-black text-[#223149]">฿{inv.balance.toLocaleString()}</span>
                      
                      {col.id === 'Pending Billing' && (
                        <button onClick={(e) => { e.stopPropagation(); updateStatus(inv.id, 'Billed'); }} className="bg-white/80 hover:bg-white text-[#496ca8] text-[9px] px-3 py-1.5 rounded-lg font-bold uppercase tracking-widest transition-colors border border-[#496ca8]/20">Place Bill</button>
                      )}
                      {(col.id === 'Billed' || col.id === 'Waiting Payment' || col.id === 'Overdue') && (
                        <button onClick={(e) => { e.stopPropagation(); setPaymentModal(inv); }} className={`text-white text-[9px] px-3 py-1.5 rounded-lg font-bold uppercase tracking-widest transition-colors flex items-center gap-1 ${col.id === 'Overdue' ? 'bg-[#ce5a43] hover:bg-[#c4343b]' : 'bg-[#223149] hover:bg-[#223149]/90'}`}>
                          <CreditCard size={10}/> Pay
                        </button>
                      )}
                      {col.id === 'Paid' && (
                        <span className="text-[#7fa85a] flex items-center gap-1 text-[10px] font-bold uppercase tracking-widest"><CheckCircle size={12}/> Paid</span>
                      )}
                      {col.id === 'Bad Debt' && (
                        <span className="text-[#933b5b] flex items-center gap-1 text-[10px] font-bold uppercase tracking-widest"><UserX size={12}/> Written Off</span>
                      )}
                    </div>
                  </div>
                ))}
                {colItems.length === 0 && (
                  <div className="text-center p-6 border-2 border-dashed border-white/50 rounded-xl text-[#7693a6] font-bold text-[10px] uppercase tracking-widest bg-white/20">No Invoices</div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

import React from 'react';
import { Kanban, Clock, FileEdit, AlertCircle, CheckCircle, X, Eye, Pencil, Printer, ChevronUp, ChevronDown } from 'lucide-react';

interface PrItem {
  id: string;
  date: string;
  requester: string;
  department: string;
  objective: string;
  status: string;
  totalAmount: number;
  items: any[];
}

interface PrKanbanBoardProps {
  prs: PrItem[];
  selectedMonth: string;
  listTimeFilter: string;
  kanbanLimits: Record<string, number>;
  setKanbanLimits: (limits: any) => void;
  openModal: (mode: string, data?: any) => void;
  setSelectedPR: (pr: any) => void;
  setPreviewModal: (open: boolean) => void;
  formatDate: (date: string) => string;
  formatCurrency: (amount: number) => string;
}

const KANBAN_COLS = [
  { id: 'Pending Verify', label: 'Pending Verify', color: 'bg-[#f59e0b]/50', textColor: 'text-[#111f42]', iconColor: 'text-[#d97706]', border: 'border-amber-200', icon: Clock },
  { id: 'Revise', label: 'Revise', color: 'bg-[#f43f5e]/50', textColor: 'text-[#111f42]', iconColor: 'text-[#e11d48]', border: 'border-rose-200', icon: FileEdit },
  { id: 'Pending Approve', label: 'Pending Approve', color: 'bg-[#3d97bd]/50', textColor: 'text-[#111f42]', iconColor: 'text-[#3d97bd]', border: 'border-blue-200', icon: AlertCircle },
  { id: 'Approved', label: 'Approved', color: 'bg-[#849a28]/50', textColor: 'text-[#111f42]', iconColor: 'text-[#849a28]', border: 'border-emerald-200', icon: CheckCircle },
  { id: 'Rejected', label: 'Rejected', color: 'bg-slate-200/80', textColor: 'text-[#111f42]', iconColor: 'text-slate-500', border: 'border-slate-300', icon: X }
];

const PrKanbanBoard: React.FC<PrKanbanBoardProps> = ({
  prs,
  selectedMonth,
  listTimeFilter,
  kanbanLimits,
  setKanbanLimits,
  openModal,
  setSelectedPR,
  setPreviewModal,
  formatDate,
  formatCurrency
}) => {
  return (
    <div className="animate-in fade-in duration-500 w-full overflow-x-auto pb-4 kanban-scroll no-print">
      <div className="flex gap-6 min-w-max h-[650px] px-1">
        {KANBAN_COLS?.map(col => {
          const allColItems = prs?.filter(d => {
            const matchStatus = d.status === col.id;
            const matchMonth = listTimeFilter === 'all' || d.date.startsWith(selectedMonth);
            return matchStatus && matchMonth;
          });
          const Icon = col.icon;
          const currentLimit = kanbanLimits[col.id] || 5;
          const displayedItems = allColItems.slice(0, currentLimit);
          const hasMore = allColItems.length > currentLimit;

          return (
            <div key={col.id} className={`w-[320px] flex flex-col h-full rounded-2xl border shadow-sm overflow-hidden bg-slate-50 ${col.border}`}>
              <div className={`flex justify-between items-center px-4 py-3 border-b border-slate-200 shadow-sm z-10 ${col.color} ${col.textColor}`}>
                <div className="flex items-center gap-2">
                  <Icon size={16} className={col.iconColor}/>
                  <h4 className="font-bold text-sm tracking-wide uppercase">{col.label}</h4>
                </div>
                <span className="bg-white text-[#111f42] text-[11px] px-2.5 py-0.5 rounded font-bold shadow-sm">{allColItems.length}</span>
              </div>
              
              <div className="flex-1 overflow-y-auto kanban-scroll p-3 space-y-3 relative bg-slate-50/50">
                {displayedItems?.map(item => (
                  <div key={item.id} className="bg-white p-3 rounded-xl shadow-sm border border-slate-200 hover:shadow-md hover:border-slate-300 transition-all cursor-pointer group flex flex-col gap-2" onClick={()=>openModal('view', item)}>
                    <div className="flex justify-between items-center">
                      <span className={`font-bold text-[10px] px-2 py-0.5 rounded ${col.id==='Revise'?'text-rose-600 bg-rose-50':col.id==='Pending Approve'?'text-[#3d97bd] bg-[#3d97bd]/10':col.id==='Approved'?'text-[#849a28] bg-[#849a28]/10':col.id==='Rejected'?'text-slate-600 bg-slate-200':'text-amber-700 bg-amber-50'}`}>{item.id}</span>
                      <span className="text-[9px] text-slate-400 font-mono">{formatDate(item.date)}</span>
                    </div>
                    <div className="flex justify-between items-start gap-2">
                      <div className="text-[11px] font-bold text-[#111f42] uppercase truncate">{item.requester}</div>
                      <div className="flex justify-end gap-0.5 opacity-60 group-hover:opacity-100 transition-opacity shrink-0">
                        <button onClick={(e)=>{e.stopPropagation(); openModal('view', item);}} className="p-1 text-blue-600 bg-blue-50 hover:bg-blue-100 rounded transition-colors" title="View"><Eye size={12}/></button>
                        <button onClick={(e)=>{e.stopPropagation(); openModal('edit', item);}} className="p-1 text-amber-600 bg-amber-50 hover:bg-amber-100 rounded transition-colors" title="Edit"><Pencil size={12}/></button>
                        <button onClick={(e)=>{e.stopPropagation(); setSelectedPR(item); setPreviewModal(true);}} className="p-1 text-purple-600 bg-purple-50 hover:bg-purple-100 rounded transition-colors" title="Print"><Printer size={12}/></button>
                      </div>
                    </div>
                    <div className="text-[9px] text-slate-500 truncate mb-1">{item.department}</div>
                    <div className="text-[9px] text-slate-400 italic line-clamp-1 mb-1">"{item.objective}"</div>
                    <div className="border-t border-slate-100 pt-2 flex justify-between items-center">
                      <span className="bg-slate-100 text-slate-500 text-[8px] px-1.5 py-0.5 rounded font-bold uppercase tracking-wider">{item.items.length} Items</span>
                      <span className="text-[11px] font-bold text-[#E3624A]">{formatCurrency(item.totalAmount)}</span>
                    </div>
                  </div>
                ))}

                {(hasMore || currentLimit > 5) && (
                  <div className="pt-2 pb-1 flex justify-center w-full gap-2">
                    {currentLimit > 5 && (
                      <button 
                        onClick={() => setKanbanLimits({...kanbanLimits, [col.id]: 5})}
                        className="flex-1 bg-slate-100 border border-slate-200 text-slate-600 text-[10px] font-bold px-2 py-2 rounded-full shadow-sm hover:bg-slate-200 transition-colors flex items-center justify-center gap-1"
                      >
                        <ChevronUp size={12} /> ย่อลง
                      </button>
                    )}
                    {hasMore && (
                      <button 
                        onClick={() => setKanbanLimits({...kanbanLimits, [col.id]: currentLimit + 5})}
                        className="flex-1 bg-white border border-slate-200 text-[#111f42] text-[10px] font-bold px-2 py-2 rounded-full shadow-sm hover:bg-slate-50 transition-colors flex items-center justify-center gap-1"
                      >
                        <ChevronDown size={12} /> โหลดเพิ่ม
                      </button>
                    )}
                  </div>
                )}

                {allColItems.length === 0 && (
                  <div className="h-full flex flex-col items-center justify-center text-slate-400 opacity-50">
                    <Kanban size={32} className="mb-2"/>
                    <span className="text-[11px] uppercase tracking-widest font-bold">No Items</span>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default PrKanbanBoard;

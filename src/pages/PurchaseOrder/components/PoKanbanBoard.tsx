import React from 'react';
import { Kanban, FileClock, Stamp, CheckCircle, Truck, Eye, Printer, Send, ChevronUp, ChevronDown } from 'lucide-react';

interface PoItem {
  id: string | number;
  poNumber: string;
  date: string;
  vendor: string;
  prRef: string;
  grandTotal: number;
  status: string;
}

interface PrItem {
  id: string;
  date: string;
  requester: string;
  department: string;
  totalAmount: number;
  items: any[];
}

interface PoKanbanBoardProps {
  filteredPendingPRs: PrItem[];
  poList: PoItem[];
  selectedMonth: string;
  dateFilter: string;
  kanbanLimits: Record<string, number>;
  setKanbanLimits: (limits: any) => void;
  openModal: (mode: string, data?: any) => void;
  setSelectedItem: (item: any) => void;
  setPreviewModal: (mode: string | null) => void;
  updatePOStatus: (status: string, poId?: any) => void;
  formatDate: (date: string) => string;
  formatCurrency: (amount: number) => string;
}

const PoKanbanBoard: React.FC<PoKanbanBoardProps> = ({
  filteredPendingPRs,
  poList,
  selectedMonth,
  dateFilter,
  kanbanLimits,
  setKanbanLimits,
  openModal,
  setSelectedItem,
  setPreviewModal,
  updatePOStatus,
  formatDate,
  formatCurrency
}) => {
  const getBoardItems = (status: string) => poList.filter(p => {
    if (dateFilter === 'all') return p.status === status;
    return p.status === status && p.date.startsWith(selectedMonth);
  });

  return (
    <div className="animate-in fade-in duration-500 w-full overflow-x-auto pb-4 kanban-scroll no-print">
      <div className="flex gap-6 min-w-max h-[620px] px-1">
        
        {/* Col: Ready to PO (PRs) */}
        <div className="w-[300px] flex flex-col h-full bg-slate-50 rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="flex justify-between items-center px-4 py-3 bg-[#f59e0b]/50 text-[#111f42] shadow-sm z-10">
            <h4 className="font-bold flex items-center gap-2 text-sm tracking-wide uppercase"><FileClock size={16} className="text-[#d97706]"/> รอสร้าง PO</h4>
            <span className="bg-white text-[#111f42] text-[11px] px-2.5 py-0.5 rounded font-bold shadow-sm">{filteredPendingPRs.length}</span>
          </div>
          <div className="flex-1 overflow-y-auto kanban-scroll p-3 space-y-3 relative bg-slate-50/50">
            {filteredPendingPRs.slice(0, kanbanLimits.pendingPR || 5).map(pr => (
              <div key={pr.id} className="bg-white p-3 rounded-xl shadow-sm border border-slate-200 hover:shadow-md hover:border-slate-300 transition-all cursor-pointer flex flex-col gap-2" onClick={() => openModal('generate', pr)}>
                 <div className="flex justify-between items-center">
                    <span className="font-bold text-[10px] text-slate-600 bg-slate-100 px-2 py-0.5 rounded">{pr.id}</span>
                    <span className="text-[9px] text-slate-400 font-mono">{formatDate(pr.date)}</span>
                 </div>
                 <div className="flex justify-between items-start gap-2">
                   <div className="text-[11px] font-bold text-[#111f42] leading-tight truncate">{pr.department}</div>
                   <div className="flex items-center gap-1 shrink-0">
                      <button onClick={(e)=>{e.stopPropagation(); openModal('generate', pr);}} className="p-1 rounded bg-amber-50 text-amber-600 hover:bg-amber-100 transition-colors" title="Create PO"><Kanban size={12}/></button>
                   </div>
                 </div>
                 <div className="text-[9px] text-slate-500 italic">Req: {pr.requester}</div>
                 <div className="border-t border-slate-100 pt-2 flex justify-between items-center">
                    <span className="bg-slate-100 text-slate-500 text-[8px] px-1.5 py-0.5 rounded font-bold uppercase tracking-wider">{pr.items.length} Items</span>
                    <span className="text-[11px] font-bold text-[#b84530]">{formatCurrency(pr.totalAmount)}</span>
                 </div>
              </div>
            ))}
            {(filteredPendingPRs.length > (kanbanLimits.pendingPR || 5) || (kanbanLimits.pendingPR > 5)) && (
              <div className="pt-2 pb-1 flex justify-center w-full gap-2">
                {(kanbanLimits.pendingPR || 5) > 5 && (
                  <button onClick={() => setKanbanLimits({...kanbanLimits, pendingPR: 5})} className="flex-1 bg-slate-100 border border-slate-200 text-slate-600 text-[10px] font-bold px-2 py-2 rounded-full shadow-sm hover:bg-slate-200 transition-colors flex items-center justify-center gap-1"><ChevronUp size={12} /> ย่อลง</button>
                )}
                {filteredPendingPRs.length > (kanbanLimits.pendingPR || 5) && (
                  <button onClick={() => setKanbanLimits({...kanbanLimits, pendingPR: (kanbanLimits.pendingPR || 5) + 5})} className="flex-1 bg-white border border-slate-200 text-[#111f42] text-[10px] font-bold px-2 py-2 rounded-full shadow-sm hover:bg-slate-50 transition-colors flex items-center justify-center gap-1"><ChevronDown size={12} /> โหลดเพิ่ม</button>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Col: Pending Approve */}
        <div className="w-[300px] flex flex-col h-full bg-slate-50 rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="flex justify-between items-center px-4 py-3 bg-[#3d97bd]/50 text-[#111f42] shadow-sm z-10">
            <h4 className="font-bold flex items-center gap-2 text-sm tracking-wide uppercase"><Stamp size={16} className="text-[#3d97bd]"/> รออนุมัติ</h4>
            <span className="bg-white text-[#111f42] text-[11px] px-2.5 py-0.5 rounded font-bold shadow-sm">{getBoardItems('Pending Approve').length}</span>
          </div>
          <div className="flex-1 overflow-y-auto kanban-scroll p-3 space-y-3 relative bg-slate-50/50">
            {getBoardItems('Pending Approve').slice(0, kanbanLimits['Pending Approve'] || 5).map(po => (
              <div key={po.id} className="bg-white p-3 rounded-xl shadow-sm border border-slate-200 hover:shadow-md hover:border-slate-300 transition-all cursor-pointer flex flex-col gap-2" onClick={() => openModal('approve', po)}>
                <div className="flex justify-between items-center">
                    <span className="font-bold text-[10px] text-slate-600 bg-slate-100 px-2 py-0.5 rounded">{po.poNumber}</span>
                    <span className="text-[9px] text-slate-400 font-mono">{formatDate(po.date)}</span>
                </div>
                <div className="flex justify-between items-start gap-2">
                  <div className="text-[11px] font-bold text-[#111f42] truncate">{po.vendor}</div>
                  <div className="flex items-center gap-1 shrink-0">
                    <button onClick={(e)=>{e.stopPropagation(); openModal('view', po);}} className="p-1 rounded bg-blue-50 text-blue-600 hover:bg-blue-100 transition-colors" title="View"><Eye size={12}/></button>
                    <button onClick={(e)=>{e.stopPropagation(); setSelectedItem(po); setPreviewModal('print');}} className="p-1 rounded bg-purple-50 text-purple-600 hover:bg-purple-100 transition-colors" title="Print"><Printer size={12}/></button>
                  </div>
                </div>
                <div className="text-[9px] text-slate-500">Ref: {po.prRef}</div>
                <div className="border-t border-slate-100 pt-2 flex justify-between items-center">
                    <span className="bg-[#3d97bd]/10 text-[#3d97bd] text-[8px] px-1.5 py-0.5 rounded font-bold uppercase tracking-wider">Approve</span>
                    <span className="text-[11px] font-bold text-[#b84530]">{formatCurrency(po.grandTotal)}</span>
                </div>
              </div>
            ))}
            {(getBoardItems('Pending Approve').length > (kanbanLimits['Pending Approve'] || 5) || (kanbanLimits['Pending Approve'] > 5)) && (
              <div className="pt-2 pb-1 flex justify-center w-full gap-2">
                {(kanbanLimits['Pending Approve'] || 5) > 5 && (
                  <button onClick={() => setKanbanLimits({...kanbanLimits, 'Pending Approve': 5})} className="flex-1 bg-slate-100 border border-slate-200 text-slate-600 text-[10px] font-bold px-2 py-2 rounded-full shadow-sm hover:bg-slate-200 transition-colors flex items-center justify-center gap-1"><ChevronUp size={12} /> ย่อลง</button>
                )}
                {getBoardItems('Pending Approve').length > (kanbanLimits['Pending Approve'] || 5) && (
                  <button onClick={() => setKanbanLimits({...kanbanLimits, 'Pending Approve': (kanbanLimits['Pending Approve'] || 5) + 5})} className="flex-1 bg-white border border-slate-200 text-[#111f42] text-[10px] font-bold px-2 py-2 rounded-full shadow-sm hover:bg-slate-50 transition-colors flex items-center justify-center gap-1"><ChevronDown size={12} /> โหลดเพิ่ม</button>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Col: Approved */}
        <div className="w-[300px] flex flex-col h-full bg-slate-50 rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="flex justify-between items-center px-4 py-3 bg-[#849a28]/50 text-[#111f42] shadow-sm z-10">
            <h4 className="font-bold flex items-center gap-2 text-sm tracking-wide uppercase"><CheckCircle size={16} className="text-[#849a28]"/> อนุมัติแล้ว</h4>
            <span className="bg-white text-[#111f42] text-[11px] px-2.5 py-0.5 rounded font-bold shadow-sm">{getBoardItems('Approved').length}</span>
          </div>
          <div className="flex-1 overflow-y-auto kanban-scroll p-3 space-y-3 relative bg-slate-50/50">
            {getBoardItems('Approved').slice(0, kanbanLimits['Approved'] || 5).map(po => (
              <div key={po.id} className="bg-white p-3 rounded-xl shadow-sm border border-slate-200 hover:shadow-md hover:border-slate-300 transition-all cursor-pointer flex flex-col gap-2" onClick={() => openModal('view', po)}>
                 <div className="flex justify-between items-center">
                    <span className="font-bold text-[10px] text-slate-600 bg-slate-100 px-2 py-0.5 rounded">{po.poNumber}</span>
                    <span className="text-[9px] text-slate-400 font-mono">{formatDate(po.date)}</span>
                </div>
                <div className="flex justify-between items-start gap-2">
                  <div className="text-[11px] font-bold text-[#111f42] truncate">{po.vendor}</div>
                  <div className="flex items-center gap-1 shrink-0">
                    <button onClick={(e)=>{e.stopPropagation(); openModal('view', po);}} className="p-1 rounded bg-blue-50 text-blue-600 hover:bg-blue-100 transition-colors" title="View"><Eye size={12}/></button>
                    <button onClick={(e)=>{e.stopPropagation(); setSelectedItem(po); setPreviewModal('print');}} className="p-1 rounded bg-purple-50 text-purple-600 hover:bg-purple-100 transition-colors" title="Print"><Printer size={12}/></button>
                  </div>
                </div>
                <div className="text-[9px] text-slate-500 mb-1">Ref: {po.prRef}</div>
                <div className="flex gap-2">
                    <button onClick={(e) => {e.stopPropagation(); updatePOStatus('Sent', po.id);}} className="flex-1 bg-[#849a28] text-white text-[9px] font-bold py-1.5 rounded uppercase tracking-widest flex items-center justify-center gap-1 hover:opacity-90"><Send size={10}/> Send to Vendor</button>
                </div>
              </div>
            ))}
            {(getBoardItems('Approved').length > (kanbanLimits['Approved'] || 5) || (kanbanLimits['Approved'] > 5)) && (
              <div className="pt-2 pb-1 flex justify-center w-full gap-2">
                {(kanbanLimits['Approved'] || 5) > 5 && (
                  <button onClick={() => setKanbanLimits({...kanbanLimits, 'Approved': 5})} className="flex-1 bg-slate-100 border border-slate-200 text-slate-600 text-[10px] font-bold px-2 py-2 rounded-full shadow-sm hover:bg-slate-200 transition-colors flex items-center justify-center gap-1"><ChevronUp size={12} /> ย่อลง</button>
                )}
                {getBoardItems('Approved').length > (kanbanLimits['Approved'] || 5) && (
                  <button onClick={() => setKanbanLimits({...kanbanLimits, 'Approved': (kanbanLimits['Approved'] || 5) + 5})} className="flex-1 bg-white border border-slate-200 text-[#111f42] text-[10px] font-bold px-2 py-2 rounded-full shadow-sm hover:bg-slate-50 transition-colors flex items-center justify-center gap-1"><ChevronDown size={12} /> โหลดเพิ่ม</button>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Col: Sent */}
        <div className="w-[300px] flex flex-col h-full bg-slate-50 rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="flex justify-between items-center px-4 py-3 bg-[#be73bf]/50 text-[#111f42] shadow-sm z-10">
            <h4 className="font-bold flex items-center gap-2 text-sm tracking-wide uppercase"><Truck size={16} className="text-[#be73bf]"/> รอรับสินค้า</h4>
            <span className="bg-white text-[#111f42] text-[11px] px-2.5 py-0.5 rounded font-bold shadow-sm">{getBoardItems('Sent').length}</span>
          </div>
          <div className="flex-1 overflow-y-auto kanban-scroll p-3 space-y-3 relative bg-slate-50/50">
            {getBoardItems('Sent').slice(0, kanbanLimits['Sent'] || 5).map(po => (
              <div key={po.id} className="bg-white p-3 rounded-xl shadow-sm border border-slate-200 hover:shadow-md hover:border-slate-300 transition-all cursor-pointer flex flex-col gap-2" onClick={() => openModal('view', po)}>
                <div className="flex justify-between items-center">
                    <span className="font-bold text-[10px] text-slate-600 bg-slate-100 px-2 py-0.5 rounded">{po.poNumber}</span>
                    <span className="text-[9px] text-slate-400 font-mono">{formatDate(po.date)}</span>
                </div>
                <div className="flex justify-between items-start gap-2">
                  <div className="text-[11px] font-bold text-[#111f42] truncate">{po.vendor}</div>
                  <div className="flex items-center gap-1 shrink-0">
                    <button onClick={(e)=>{e.stopPropagation(); openModal('view', po);}} className="p-1 rounded bg-blue-50 text-blue-600 hover:bg-blue-100 transition-colors" title="View"><Eye size={12}/></button>
                    <button onClick={(e)=>{e.stopPropagation(); setSelectedItem(po); setPreviewModal('print');}} className="p-1 rounded bg-purple-50 text-purple-600 hover:bg-purple-100 transition-colors" title="Print"><Printer size={12}/></button>
                  </div>
                </div>
                <div className="text-[9px] text-slate-500 mb-1">Ref: {po.prRef}</div>
                <button onClick={(e) => {e.stopPropagation(); updatePOStatus('Completed', po.id);}} className="w-full bg-[#be73bf] text-white text-[9px] font-bold py-1.5 rounded uppercase tracking-widest hover:opacity-90">Confirm Receipt</button>
              </div>
            ))}
            {(getBoardItems('Sent').length > (kanbanLimits['Sent'] || 5) || (kanbanLimits['Sent'] > 5)) && (
              <div className="pt-2 pb-1 flex justify-center w-full gap-2">
                {(kanbanLimits['Sent'] || 5) > 5 && (
                  <button onClick={() => setKanbanLimits({...kanbanLimits, 'Sent': 5})} className="flex-1 bg-slate-100 border border-slate-200 text-slate-600 text-[10px] font-bold px-2 py-2 rounded-full shadow-sm hover:bg-slate-200 transition-colors flex items-center justify-center gap-1"><ChevronUp size={12} /> ย่อลง</button>
                )}
                {getBoardItems('Sent').length > (kanbanLimits['Sent'] || 5) && (
                  <button onClick={() => setKanbanLimits({...kanbanLimits, 'Sent': (kanbanLimits['Sent'] || 5) + 5})} className="flex-1 bg-white border border-slate-200 text-[#111f42] text-[10px] font-bold px-2 py-2 rounded-full shadow-sm hover:bg-slate-50 transition-colors flex items-center justify-center gap-1"><ChevronDown size={12} /> โหลดเพิ่ม</button>
                )}
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};

export default PoKanbanBoard;

import React from 'react';
import { Eye, Printer, Truck, ChevronDown, ChevronUp } from 'lucide-react';
import { STATUS_LIST } from '../constants';
import { getStatusStyle, formatDate } from '../utils';
import { Order } from '../types';

interface KanbanBoardProps {
  filteredOrders: Order[];
  expandedCols: Record<string, boolean>;
  toggleColumnExpand: (status: string) => void;
  openModal: (mode: string, data: Order) => void;
  setPreviewModal: (modal: any) => void;
}

export default function KanbanBoard({
  filteredOrders,
  expandedCols,
  toggleColumnExpand,
  openModal,
  setPreviewModal
}: KanbanBoardProps) {
  return (
    <div className="flex-1 min-h-0 overflow-x-auto overflow-y-hidden kanban-scroll pb-2 no-print block">
      <div className="flex gap-4 h-full min-w-max items-stretch px-1">
        {STATUS_LIST?.map(status => {
          const style = getStatusStyle(status);
          const colItems = filteredOrders.filter(o => o.status === status);
          const isExpanded = expandedCols[status];
          const displayItems = isExpanded ? colItems : colItems.slice(0, 5);
          const hiddenCount = colItems.length - 5;

          return (
            <div key={status} className={`w-[320px] flex-shrink-0 flex flex-col h-full bg-[#fafafa] rounded-2xl border-2 ${style.wrapperBorder} shadow-sm overflow-hidden`}>
              <div className={`${style.headerBg} px-4 py-3 flex justify-between items-center border-b-2 ${style.wrapperBorder} shrink-0`}>
                <div>
                  <h4 className={`font-black text-[12px] uppercase tracking-wide ${style.text}`}>
                    {status}
                  </h4>
                  <p className={`text-[8px] font-bold uppercase tracking-widest mt-0.5 opacity-60 ${style.text}`}>
                    {status === 'Booking' ? 'PLAN: INVENTORY CHECK' : 
                     status === 'JO Created' ? 'PLAN: PRODUCTION REQ' : 
                     status === 'Production' ? 'PLAN: IN PROGRESS' : 
                     status === 'Ready to Ship' ? 'PLAN: LOGISTICS' : 
                     status === 'Delivered' ? 'PLAN: COMPLETED' : 'PLAN: REVERSE LOGISTICS'}
                  </p>
                </div>
                <span className={`bg-white px-2 py-0.5 rounded text-[10px] font-black shadow-sm border border-white/50 ${style.text}`}>
                  {colItems.length}
                </span>
              </div>
              
              <div className="flex-1 overflow-y-auto kanban-scroll p-3 space-y-2.5">
                {displayItems?.map(so => {
                   const totalItems = so.items.length;
                   const isMultiDelivery = so.items.some(i => i.deliveries.length > 1);
                   return (
                    <div key={so.id} className="bg-white p-3 rounded-xl border border-slate-200 shadow-sm hover:shadow-md cursor-pointer transition-all hover:-translate-y-0.5 flex flex-col gap-2 relative overflow-hidden" onClick={() => openModal('view', so)}>
                       <div className={`absolute top-0 left-0 w-1 h-full ${style.headerBg.split('/')[0]} border-l ${style.border}`}></div>
                       
                       <div className="flex justify-between items-center ml-1">
                        <span className="font-mono text-[10px] font-medium px-1.5 py-0.5 rounded bg-slate-50 border border-slate-200 text-[#111f42]">{so.soNumber}</span>
                        <span className="text-[9px] text-slate-400 font-normal">{formatDate(so.date)}</span>
                      </div>
                      
                      <div className="flex justify-between items-center gap-2 ml-1">
                        <h5 className="font-semibold text-[12px] text-[#111f42] truncate uppercase tracking-tight flex-1" title={so.customer}>{so.customer}</h5>
                        <div className="flex items-center gap-1 flex-shrink-0">
                          <button onClick={(e) => { e.stopPropagation(); openModal('view', so); }} className="p-1 bg-blue-50 text-blue-500 hover:bg-blue-100 rounded transition-colors"><Eye size={12} strokeWidth={1.5}/></button>
                          <button onClick={(e) => { e.stopPropagation(); setPreviewModal({ type: 'single', data: so }); }} className="p-1 bg-purple-50 text-purple-500 hover:bg-purple-100 rounded transition-colors"><Printer size={12} strokeWidth={1.5}/></button>
                        </div>
                      </div>

                      <div className="text-[9px] font-medium text-slate-400 flex items-center gap-2 ml-1">
                        Items: {totalItems}
                        {isMultiDelivery && <span className="text-[8px] bg-orange-50 text-[#E3624A] px-1.5 py-0.5 rounded font-medium flex items-center gap-1"><Truck size={9}/> Split</span>}
                      </div>

                      <div className="border-t border-slate-100 pt-2 flex justify-between items-center mt-1 ml-1">
                        <span className="px-2 py-0.5 bg-slate-100 text-slate-500 font-bold text-[8px] rounded shadow-sm border border-slate-200 uppercase tracking-widest">
                          SALES ORDER
                        </span>
                        <span className="text-[10px] font-bold text-[#111f42]">
                          Total: <span className="text-[#6b7556]">฿{(so.total || 0)?.toLocaleString()}</span>
                        </span>
                      </div>
                    </div>
                   )
                })}

                {hiddenCount > 0 && !isExpanded && (
                  <button 
                    onClick={(e) => { e.stopPropagation(); toggleColumnExpand(status); }}
                    className="w-full py-2.5 mt-1 rounded-lg text-[10px] font-medium text-slate-500 bg-white border border-slate-200 hover:bg-slate-50 hover:text-[#111f42] transition-colors flex items-center justify-center gap-1 shadow-sm uppercase tracking-widest"
                  >
                    <ChevronDown size={14} /> Load More ({hiddenCount} left)
                  </button>
                )}

                {isExpanded && colItems.length > 5 && (
                  <button 
                    onClick={(e) => { e.stopPropagation(); toggleColumnExpand(status); }}
                    className="w-full py-2.5 mt-1 rounded-lg text-[10px] font-medium text-slate-500 bg-white border border-slate-200 hover:bg-slate-50 hover:text-[#111f42] transition-colors flex items-center justify-center gap-1 shadow-sm uppercase tracking-widest"
                  >
                    <ChevronUp size={14} /> Show Less
                  </button>
                )}

                {colItems.length === 0 && (
                  <div className="text-center p-6 border-2 border-dashed border-slate-200 rounded-xl text-slate-400 font-medium text-[10px] uppercase tracking-widest mt-2">No Invoices</div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

import React from 'react';
import { Search, Settings, Plus, Printer, ChevronLeft, ChevronRight, Eye, Pencil } from 'lucide-react';
import { getStatusStyle, formatDate } from '../utils';
import { Order } from '../types';

interface OrdersTableProps {
  subTab: string;
  setSubTab: (tab: string) => void;
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  setCurrentPage: React.Dispatch<React.SetStateAction<number>>;
  setConfigModal: (open: boolean) => void;
  setPreviewModal: (modal: any) => void;
  openModal: (mode: string, data?: Order) => void;
  currentItems: Order[];
  itemsPerPage: number;
  setItemsPerPage: (num: number) => void;
  currentPage: number;
  totalPages: number;
}

export default function OrdersTable({
  subTab,
  setSubTab,
  searchTerm,
  setSearchTerm,
  setCurrentPage,
  setConfigModal,
  setPreviewModal,
  openModal,
  currentItems,
  itemsPerPage,
  setItemsPerPage,
  currentPage,
  totalPages
}: OrdersTableProps) {
  return (
    <div className="bg-white border border-slate-200 shadow-sm overflow-hidden rounded-none flex-1 flex flex-col min-h-0 no-print">
      <div className="p-4 flex items-center justify-between gap-4 bg-white border-b border-slate-100 overflow-x-auto flex-shrink-0">
        <div className="flex items-center gap-4">
          <div className="flex bg-slate-50 p-1 border border-slate-200 rounded-xl">
            <button onClick={() => {setSubTab('all'); setCurrentPage(1);}} className={`px-5 py-2 whitespace-nowrap font-normal text-[10px] uppercase rounded-lg transition-all ${subTab === 'all' ? 'bg-[#111f42] text-white shadow-md' : 'text-slate-500 hover:bg-slate-200'}`}>All</button>
            {['Booking', 'Production', 'Ready to Ship', 'Delivered'].map(s => (
              <button key={s} onClick={() => {setSubTab(s); setCurrentPage(1);}} className={`px-5 py-2 whitespace-nowrap font-normal text-[10px] uppercase rounded-lg transition-all ${subTab === s ? 'bg-[#111f42] text-white shadow-md' : 'text-slate-500 hover:bg-slate-200'}`}>{s}</button>
            ))}
          </div>
          <div className="relative w-64 flex items-center bg-white border border-slate-200 rounded-lg px-3 py-1.5 shadow-sm">
            <Search className="text-slate-400" size={16} />
            <input type="text" placeholder="Search SO or customer..." className="w-full bg-transparent border-none outline-none ml-2 text-slate-700 font-normal" value={searchTerm} onChange={e => {setSearchTerm(e.target.value); setCurrentPage(1);}} />
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={() => setConfigModal(true)} className="p-2.5 rounded-xl border border-slate-200 text-slate-500 hover:bg-slate-50 transition-all shadow-sm" title="Settings"><Settings size={18} /></button>
          <button onClick={() => setPreviewModal({ type: 'list' })} className="px-5 py-2.5 rounded-xl border border-[#ab8a3b] text-[#ab8a3b] hover:bg-[#ab8a3b] hover:text-white font-normal text-[10px] uppercase tracking-widest shadow-sm">PRINT PDF</button>
          <button onClick={() => openModal('create')} className="flex items-center gap-2 px-6 py-2.5 font-normal uppercase bg-[#111f42] text-white rounded-xl shadow-lg hover:opacity-90 tracking-widest text-[10px]"><Plus size={16} /> NEW ORDER</button>
        </div>
      </div>
      <div className="overflow-x-auto flex-1 kanban-scroll">
        <table className="w-full text-left border-collapse">
          <thead className="bg-[#2C3F70] text-white sticky top-0 z-10">
            <tr className="border-b-4 border-[#E3624A]">
              <th className="px-6 py-5 text-[10px] font-normal uppercase tracking-widest">DATE</th>
              <th className="px-6 py-5 text-[10px] font-normal uppercase tracking-widest">SO NUMBER</th>
              <th className="px-6 py-5 text-[10px] font-normal uppercase tracking-widest">CUSTOMER</th>
              <th className="px-6 py-5 text-[10px] font-normal uppercase tracking-widest text-center">ITEMS</th>
              <th className="px-6 py-5 text-[10px] font-normal uppercase tracking-widest text-right">TOTAL AMOUNT</th>
              <th className="px-6 py-5 text-[10px] font-normal uppercase tracking-widest text-center">STATUS</th>
              <th className="px-6 py-5 text-[10px] font-normal uppercase tracking-widest text-center">ACTION</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {currentItems.map(so => {
              const style = getStatusStyle(so.status);
              const isMulti = so.items.some(i => i.deliveries.length > 1);
              return (
                <tr key={so.id} className="transition-colors hover:bg-slate-50 cursor-pointer" onClick={() => openModal('view', so)}>
                  <td className="px-6 py-4 font-normal text-slate-500">{formatDate(so.date)}</td>
                  <td className="px-6 py-4 font-bold text-[#111f42] font-mono">{so.soNumber}</td>
                  <td className="px-6 py-4 font-medium text-slate-700 uppercase tracking-tight">{so.customer}</td>
                  <td className="px-6 py-4 text-center">
                    <div className="flex flex-col items-center gap-1">
                      <span className="font-bold text-slate-600">{so.items.length}</span>
                      {isMulti && <span className="text-[8px] bg-orange-50 text-[#E3624A] px-1.5 py-0.5 rounded font-normal">Split Delv.</span>}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right font-bold text-[#E3624A]">฿{(so.total || 0)?.toLocaleString()}</td>
                  <td className="px-6 py-4 text-center"><span className={`px-3 py-1 font-normal uppercase text-[8px] border rounded-full ${style.bg} ${style.text} ${style.border}`}>{so.status}</span></td>
                  <td className="px-6 py-4 text-center">
                    <div className="flex items-center justify-center gap-4">
                      <button className="text-[#3b82f6] hover:scale-125 transition-transform" onClick={(e) => { e.stopPropagation(); openModal('view', so); }} title="View">
                        <Eye size={16} strokeWidth={1.25} />
                      </button>
                      <button className="text-[#f59e0b] hover:scale-125 transition-transform" onClick={(e) => { e.stopPropagation(); openModal('edit', so); }} title="Edit">
                        <Pencil size={16} strokeWidth={1.25} />
                      </button>
                      <button className="text-[#a855f7] hover:scale-125 transition-transform" onClick={(e) => { e.stopPropagation(); setPreviewModal({ type: 'single', data: so }); }} title="Print SO">
                        <Printer size={16} strokeWidth={1.25} />
                      </button>
                    </div>
                  </td>
                </tr>
              )
            })}
            {currentItems.length === 0 && (
              <tr><td colSpan={7} className="text-center py-10 text-slate-400 font-normal">No records found.</td></tr>
            )}
          </tbody>
        </table>
      </div>
      <div className="flex items-center justify-between px-6 py-4 bg-slate-50 border-t border-slate-100 flex-shrink-0">
        <div className="flex items-center gap-2 text-[10px] text-slate-500 font-normal uppercase">
          <span>Show</span>
          <select value={itemsPerPage} onChange={e => setItemsPerPage(Number(e.target.value))} className="border border-slate-200 rounded outline-none p-1 bg-white">
            <option value={10}>10</option><option value={20}>20</option><option value={50}>50</option>
          </select>
        </div>
        <div className="flex gap-2 items-center">
          <button onClick={() => setCurrentPage(p => Math.max(p-1, 1))} disabled={currentPage === 1} className="p-2 border border-slate-200 rounded-lg bg-white disabled:opacity-50"><ChevronLeft size={16}/></button>
          <span className="px-4 text-[11px] font-normal text-[#111f42]">Page {currentPage} of {totalPages || 1}</span>
          <button onClick={() => setCurrentPage(p => Math.min(p+1, totalPages))} disabled={currentPage === totalPages || totalPages === 0} className="p-2 border border-slate-200 rounded-lg bg-white disabled:opacity-50"><ChevronRight size={16}/></button>
        </div>
      </div>
    </div>
  );
}

import React from 'react';
import { FileText, ChevronLeft, ChevronRight } from 'lucide-react';

interface PrItem {
  id: string;
  date: string;
  requester: string;
  department: string;
  totalAmount: number;
  items: any[];
}

interface PoPrWaitingTableProps {
  paginatedPendingPRs: PrItem[];
  filteredPendingPRs: PrItem[];
  pendingCurrentPage: number;
  setPendingCurrentPage: (page: number) => void;
  pendingItemsPerPage: number;
  setPendingItemsPerPage: (count: number) => void;
  pendingTotalPages: number;
  openModal: (mode: string, data?: any) => void;
  formatDate: (date: string) => string;
  formatCurrency: (amount: number) => string;
}

const PoPrWaitingTable: React.FC<PoPrWaitingTableProps> = ({
  paginatedPendingPRs,
  filteredPendingPRs,
  pendingCurrentPage,
  setPendingCurrentPage,
  pendingItemsPerPage,
  setPendingItemsPerPage,
  pendingTotalPages,
  openModal,
  formatDate,
  formatCurrency
}) => {
  return (
    <div className="bg-white border border-slate-100 shadow-sm overflow-hidden rounded-none animate-in fade-in duration-500 no-print">
      <div className="overflow-x-auto">
         <table className="w-full text-left border-collapse whitespace-nowrap data-table">
            <thead className="bg-slate-50 text-slate-600 border-b border-slate-200">
              <tr>
                <th className="px-6 py-4 text-[10px] font-semibold uppercase tracking-widest">PR NUMBER</th>
                <th className="px-6 py-4 text-[10px] font-semibold uppercase tracking-widest">DATE</th>
                <th className="px-6 py-4 text-[10px] font-semibold uppercase tracking-widest">REQUESTER / DEPT</th>
                <th className="px-6 py-4 text-[10px] font-semibold uppercase tracking-widest text-center">ITEMS</th>
                <th className="px-6 py-4 text-[10px] font-semibold text-[#111f42] uppercase tracking-widest text-right">EST. AMOUNT</th>
                <th className="px-6 py-4 text-[10px] font-semibold uppercase tracking-widest text-center">ACTION</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {paginatedPendingPRs?.map(pr => (
                <tr key={pr.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4 font-bold text-[#111f42]">{pr.id}</td>
                  <td className="px-6 py-4 text-slate-500">{formatDate(pr.date)}</td>
                  <td className="px-6 py-4">
                     <div className="font-semibold text-[#111f42]">{pr.requester}</div>
                     <div className="text-[10px] text-slate-500">{pr.department}</div>
                  </td>
                  <td className="px-6 py-4 text-center font-bold text-slate-600">{pr.items.length}</td>
                  <td className="px-6 py-4 text-right font-bold text-[#b22026]">{formatCurrency(pr.totalAmount)}</td>
                  <td className="px-6 py-4 text-center">
                      <button onClick={() => openModal('generate', pr)} className="bg-amber-500 text-white px-4 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-widest hover:bg-amber-600 transition-colors shadow-sm flex items-center gap-1 mx-auto">
                         <FileText size={12}/> Create PO
                      </button>
                  </td>
                </tr>
              ))}
              {paginatedPendingPRs.length === 0 && (
                <tr><td colSpan={6} className="px-6 py-12 text-center text-slate-400 italic">No Pending PRs found.</td></tr>
              )}
            </tbody>
         </table>
      </div>

      {/* Pagination */}
      <div className="px-6 py-4 border-t border-slate-100 flex flex-col md:flex-row justify-between items-center gap-4 bg-slate-50/50">
        <div className="flex items-center gap-3 text-[12px] text-slate-500 font-medium">
          <p>Showing <span className="font-bold text-[#111f42]">{filteredPendingPRs.length > 0 ? (pendingCurrentPage - 1) * pendingItemsPerPage + 1 : 0}</span> to <span className="font-bold text-[#111f42]">{Math.min(pendingCurrentPage * pendingItemsPerPage, filteredPendingPRs.length)}</span> of <span className="font-bold text-[#111f42]">{filteredPendingPRs.length}</span> entries</p>
          <select value={pendingItemsPerPage} onChange={e => {setPendingItemsPerPage(Number(e.target.value)); setPendingCurrentPage(1);}} className="bg-white border border-slate-200 rounded px-2 py-1 outline-none text-[12px] font-bold">
            <option value={10}>10 per page</option><option value={20}>20 per page</option><option value={50}>50 per page</option>
          </select>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={() => setPendingCurrentPage(Math.max(1, pendingCurrentPage - 1))} disabled={pendingCurrentPage === 1} className="p-2 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 disabled:opacity-50 transition-all"><ChevronLeft size={16} /></button>
          <div className="flex gap-1">
            {[...Array(pendingTotalPages)]?.map((_, i) => (
              <button key={i + 1} onClick={() => setPendingCurrentPage(i + 1)} className={`w-8 h-8 rounded-lg text-[12px] font-bold transition-all border ${pendingCurrentPage === i + 1 ? 'bg-[#111f42] text-white border-[#111f42] shadow-sm' : 'bg-white text-slate-500 border-slate-200 hover:bg-slate-50'}`}>{i + 1}</button>
            ))}
          </div>
          <button onClick={() => setPendingCurrentPage(Math.min(pendingTotalPages, pendingCurrentPage + 1))} disabled={pendingCurrentPage === pendingTotalPages} className="p-2 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 disabled:opacity-50 transition-all"><ChevronRight size={16} /></button>
        </div>
      </div>
    </div>
  );
};

export default PoPrWaitingTable;

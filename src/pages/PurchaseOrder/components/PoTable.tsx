import React from 'react';
import { Eye, Pencil, Printer, ChevronLeft, ChevronRight } from 'lucide-react';

interface PoItem {
  id: string | number;
  poNumber: string;
  date: string;
  vendor: string;
  prRef: string;
  grandTotal: number;
  status: string;
}

interface PoTableProps {
  paginatedPOList: PoItem[];
  filteredPOList: PoItem[];
  currentPage: number;
  setCurrentPage: (page: number) => void;
  poItemsPerPage: number;
  setPoItemsPerPage: (count: number) => void;
  totalPages: number;
  openModal: (mode: string, data?: any) => void;
  setSelectedItem: (item: any) => void;
  setPreviewModal: (mode: string | null) => void;
  formatDate: (date: string) => string;
  formatCurrency: (amount: number) => string;
  getStatusBadgeClass: (status: string) => string;
}

const PoTable: React.FC<PoTableProps> = ({
  paginatedPOList,
  filteredPOList,
  currentPage,
  setCurrentPage,
  poItemsPerPage,
  setPoItemsPerPage,
  totalPages,
  openModal,
  setSelectedItem,
  setPreviewModal,
  formatDate,
  formatCurrency,
  getStatusBadgeClass
}) => {
  return (
    <div className="bg-white border border-slate-100 shadow-sm overflow-hidden rounded-none animate-in fade-in duration-500 no-print">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse whitespace-nowrap">
          <thead className="bg-[#2C3F70] text-white">
            <tr className="border-b-4 border-[#E3624A]">
              <th className="px-6 py-4 text-[10px] font-semibold uppercase tracking-widest">PO NUMBER</th>
              <th className="px-6 py-4 text-[10px] font-semibold uppercase tracking-widest">DATE</th>
              <th className="px-6 py-4 text-[10px] font-semibold uppercase tracking-widest">VENDOR</th>
              <th className="px-6 py-4 text-[10px] font-semibold text-[#FACC15] uppercase tracking-widest text-right">TOTAL AMOUNT</th>
              <th className="px-6 py-4 text-[10px] font-semibold uppercase tracking-widest text-center">STATUS</th>
              <th className="px-6 py-4 text-[10px] font-semibold uppercase tracking-widest text-center">ACTION</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {paginatedPOList?.map(po => (
              <tr key={po.id} className="hover:bg-slate-50 transition-colors">
                <td className="px-6 py-4 font-bold text-[#111f42]">{po.poNumber}</td>
                <td className="px-6 py-4 text-slate-500">{formatDate(po.date)}</td>
                <td className="px-6 py-4 font-semibold text-[#111f42]">{po.vendor}</td>
                <td className="px-6 py-4 text-right font-bold text-[#b22026]">{formatCurrency(po.grandTotal)}</td>
                <td className="px-6 py-4 text-center">
                    <span className={`px-2 py-1 rounded text-[9px] font-bold uppercase border ${getStatusBadgeClass(po.status)}`}>{po.status}</span>
                </td>
                <td className="px-6 py-4 text-center">
                    <div className="flex justify-center gap-1">
                        <button onClick={() => openModal('view', po)} className="p-1.5 text-[#3d97bd] hover:bg-[#3d97bd]/10 rounded transition-colors" title="View"><Eye size={14}/></button>
                        <button onClick={() => openModal('edit', po)} className="p-1.5 text-amber-600 hover:bg-amber-50 rounded transition-colors" title="Edit"><Pencil size={14}/></button>
                        <button onClick={() => {setSelectedItem(po); setPreviewModal('print');}} className="p-1.5 text-[#be73bf] hover:bg-[#be73bf]/10 rounded transition-colors" title="Print"><Printer size={14}/></button>
                    </div>
                </td>
              </tr>
            ))}
            {paginatedPOList.length === 0 && (
              <tr><td colSpan={6} className="px-6 py-12 text-center text-slate-400 italic">No Purchase Orders found.</td></tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="px-6 py-4 border-t border-slate-100 flex flex-col md:flex-row justify-between items-center gap-4 bg-slate-50/50">
        <div className="flex items-center gap-3 text-[12px] text-slate-500 font-medium">
          <p>Showing <span className="font-bold text-[#111f42]">{filteredPOList.length > 0 ? (currentPage - 1) * poItemsPerPage + 1 : 0}</span> to <span className="font-bold text-[#111f42]">{Math.min(currentPage * poItemsPerPage, filteredPOList.length)}</span> of <span className="font-bold text-[#111f42]">{filteredPOList.length}</span> entries</p>
          <select value={poItemsPerPage} onChange={e => {setPoItemsPerPage(Number(e.target.value)); setCurrentPage(1);}} className="bg-white border border-slate-200 rounded px-2 py-1 outline-none text-[12px] font-bold">
            <option value={10}>10 per page</option><option value={20}>20 per page</option><option value={50}>50 per page</option>
          </select>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))} disabled={currentPage === 1} className="p-2 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 disabled:opacity-50 transition-all"><ChevronLeft size={16} /></button>
          <div className="flex gap-1">
            {[...Array(totalPages)]?.map((_, i) => (
              <button key={i + 1} onClick={() => setCurrentPage(i + 1)} className={`w-8 h-8 rounded-lg text-[12px] font-bold transition-all border ${currentPage === i + 1 ? 'bg-[#111f42] text-white border-[#111f42] shadow-sm' : 'bg-white text-slate-500 border-slate-200 hover:bg-slate-50'}`}>{i + 1}</button>
            ))}
          </div>
          <button onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))} disabled={currentPage === totalPages} className="p-2 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 disabled:opacity-50 transition-all"><ChevronRight size={16} /></button>
        </div>
      </div>
    </div>
  );
};

export default PoTable;

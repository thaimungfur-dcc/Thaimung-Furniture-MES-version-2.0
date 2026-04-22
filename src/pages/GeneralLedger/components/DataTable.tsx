import React from 'react';
import { Search, Download, Lock, ChevronLeft, ChevronRight } from 'lucide-react';
import { formatDate, formatAmount } from '../utils';

export default function DataTable({
  filteredData,
  totalDebit,
  totalCredit,
  searchTerm,
  setSearchTerm,
  currentItems,
  totalPages,
  currentPage,
  setCurrentPage,
  itemsPerPage,
  setItemsPerPage
}: any) {
  return (
    <div className="bg-white border border-slate-200 flex flex-col rounded-2xl shadow-sm flex-1 min-h-[550px] relative overflow-hidden animate-fade-in-up mt-4">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-0 border-b border-slate-100 bg-slate-50/30">
        <div className="p-4 border-r border-slate-100 flex flex-col justify-center hover:bg-slate-50 transition-colors">
          <p className="text-[10px] font-bold text-[#7693a6] uppercase tracking-widest mb-1">Total Transactions</p>
          <p className="text-xl font-black text-[#223149] font-mono">{filteredData.length} Lines</p>
        </div>
        <div className="p-4 border-r border-slate-100 flex flex-col justify-center bg-blue-50/20 hover:bg-blue-50/40 transition-colors">
          <p className="text-[10px] font-bold text-blue-600 uppercase tracking-widest mb-1">Total Debit (Dr)</p>
          <p className="text-xl font-black text-blue-700 font-mono">฿{formatAmount(totalDebit)}</p>
        </div>
        <div className="p-4 flex flex-col justify-center bg-emerald-50/20 hover:bg-emerald-50/40 transition-colors">
          <p className="text-[10px] font-bold text-emerald-600 uppercase tracking-widest mb-1">Total Credit (Cr)</p>
          <p className="text-xl font-black text-emerald-700 font-mono">฿{formatAmount(totalCredit)}</p>
        </div>
      </div>

      <div className="px-6 py-4 border-b border-slate-100 flex flex-col lg:flex-row items-center justify-between gap-4 bg-slate-50/50 sticky top-0 z-20">
        <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto">
          <div className="relative w-72 shrink-0">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input 
              type="text" 
              placeholder="Search Account, JV No, or Desc..." 
              className="w-full h-10 bg-white border border-slate-200 rounded-xl pl-9 pr-4 text-[12px] outline-none font-bold focus:border-[#1e3a8a] transition-all"
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
        <div className="flex items-center gap-2 justify-end flex-shrink-0 ml-auto mr-1">
          <button className="px-4 py-2 bg-white border border-slate-200 text-slate-600 rounded-xl font-bold text-[10px] shadow-sm flex items-center gap-2 uppercase tracking-widest hover:bg-slate-50 transition-all shrink-0">
            <Download size={16} /> EXPORT
          </button>
          <div className="h-6 w-px mx-2 bg-slate-200" />
          <div className="flex items-center gap-2 px-5 py-2 rounded-xl border border-slate-100 bg-slate-100 text-slate-400 font-bold uppercase tracking-widest text-[10px] cursor-not-allowed">
            <Lock size={14} /> Locked (Auto-Sync)
          </div>
        </div>
      </div>

      <div className="overflow-x-auto flex-1 master-custom-scrollbar bg-white">
        <table className="w-full text-left whitespace-nowrap border-collapse min-w-[1000px]">
          <thead className="bg-[#111f42] text-white sticky top-0 z-10 shadow-sm">
            <tr className="border-b-[3px] border-[#d9b343]">
              <th className="px-5 py-4 text-[10px] font-black uppercase tracking-[0.1em] border-r border-white/10">Date</th>
              <th className="px-5 py-4 text-[10px] font-black uppercase tracking-[0.1em] border-r border-white/10">JV No.</th>
              <th className="px-5 py-4 text-[10px] font-black uppercase tracking-[0.1em] border-r border-white/10">Account Info</th>
              <th className="px-5 py-4 text-[10px] font-black uppercase tracking-[0.1em] border-r border-white/10">Description</th>
              <th className="px-5 py-4 text-[10px] font-black uppercase tracking-[0.1em] text-right border-r border-white/10">Debit (Dr)</th>
              <th className="px-5 py-4 text-[10px] font-black uppercase tracking-[0.1em] text-right border-r border-white/10">Credit (Cr)</th>
              <th className="px-5 py-4 text-[10px] font-black uppercase tracking-[0.1em] text-center">Source</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 bg-white">
            {currentItems.map((v: any) => (
              <tr key={v.id} className="hover:bg-slate-50 transition-colors">
                <td className="px-5 py-3 font-mono text-slate-400 text-[11px]">{formatDate(v.date)}</td>
                <td className="px-5 py-3 font-mono font-black text-[#1e3a8a]">{v.jvNo}</td>
                <td className="px-5 py-3">
                  <div className="flex flex-col">
                    <span className="font-mono font-black text-[#223149] text-[11px] leading-none mb-1">{v.accountCode}</span>
                    <span className="text-slate-500 font-bold text-[10px] uppercase leading-none">{v.accountName}</span>
                  </div>
                </td>
                <td className="px-5 py-3 min-w-[200px] text-slate-600 font-medium truncate max-w-[300px]">{v.description}</td>
                <td className="px-5 py-3 font-mono font-black text-right text-blue-600 text-[13px]">{formatAmount(v.debit)}</td>
                <td className="px-5 py-3 font-mono font-black text-right text-emerald-600 text-[13px]">{formatAmount(v.credit)}</td>
                <td className="px-5 py-3 text-center">
                  <span className="px-2 py-0.5 rounded text-[9px] font-black uppercase tracking-widest bg-slate-50 text-slate-400 border border-slate-100">{v.source}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 0 && (
        <div className="flex items-center justify-between px-6 py-4 bg-slate-50 border-t border-slate-100 shrink-0">
          <div className="flex items-center gap-2 text-xs text-slate-400 font-bold uppercase tracking-widest">
            <span>Show</span>
            <select value={itemsPerPage} onChange={(e) => setItemsPerPage(Number(e.target.value))} className="bg-white border border-slate-200 rounded-lg px-2 py-1 outline-none text-[#1e293b] font-bold">
              <option value={10}>10</option>
              <option value={20}>20</option>
              <option value={50}>50</option>
            </select>
          </div>
          <nav className="isolate inline-flex -space-x-px rounded-xl shadow-sm">
            <button onClick={() => setCurrentPage((prev: number) => Math.max(prev - 1, 1))} disabled={currentPage === 1} className="relative inline-flex items-center rounded-l-xl px-3 py-2 text-slate-400 bg-white ring-1 ring-inset ring-slate-200 hover:bg-slate-50 disabled:opacity-50"><ChevronLeft size={16}/></button>
            <button onClick={() => setCurrentPage((prev: number) => Math.min(prev + 1, totalPages))} disabled={currentPage === totalPages} className="relative inline-flex items-center rounded-r-xl px-3 py-2 text-slate-400 bg-white ring-1 ring-inset ring-slate-200 hover:bg-slate-50 disabled:opacity-50"><ChevronRight size={16}/></button>
          </nav>
        </div>
      )}
    </div>
  );
}

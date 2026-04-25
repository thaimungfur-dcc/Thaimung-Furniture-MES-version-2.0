import React from 'react';
import { Filter, ChevronDown, Search, Download, Lock, ChevronLeft, ChevronRight } from 'lucide-react';
import { formatDate } from '../utils';

export default function DataTable({
  filteredData,
  totalBase,
  totalVat,
  subTab,
  setSubTab,
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
    <div className="bg-white border border-slate-200 shadow-sm overflow-hidden rounded-xl flex-1 flex flex-col transition-all">
      
      {/* Table Toolbar */}
      <div className="p-4 flex items-center justify-between gap-4 border-b border-slate-100 bg-white">
        <div className="flex items-center gap-4">
          <div className="relative flex items-center bg-slate-50 border border-slate-100 rounded-xl px-2">
            <Filter size={14} className="text-slate-400 ml-2" />
            <select 
              value={subTab} onChange={(e) => setSubTab(e.target.value)}
              className="bg-transparent pl-2 pr-8 py-2.5 text-[10px] font-bold text-[#1e293b] uppercase tracking-widest outline-none appearance-none cursor-pointer"
            >
              <option value="all">All Records</option>
              <option value="Sales">Sales (Output)</option>
              <option value="Purchase">Purchase (Input)</option>
            </select>
            <ChevronDown size={14} className="absolute right-3 pointer-events-none text-slate-400" />
          </div>

          <div className="relative w-64 flex items-center bg-slate-50 border border-slate-100 shadow-sm rounded-xl px-3 py-2">
            <Search className="text-slate-400" size={16} />
            <input 
              type="text" placeholder="Search Document or Entity..." 
              className="w-full bg-transparent border-none outline-none ml-2 text-[#1e293b] font-medium placeholder-slate-400 text-[12px]"
              value={searchTerm} onChange={e => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <div className="flex items-center gap-2 ml-auto">
          <button className="p-2.5 rounded-xl border border-slate-200 text-[#1e293b] hover:bg-slate-50 transition-all flex items-center gap-2 font-bold text-[10px] uppercase tracking-widest">
            <Download size={16} /> Export CSV
          </button>
          <div className="h-6 w-px mx-2 bg-slate-300" />
          <div className="flex items-center gap-2 px-5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-400 font-bold uppercase tracking-widest text-[10px] cursor-not-allowed shadow-inner" title="Please record tax entries via Master Data Center">
            <Lock size={14} /> Locked (Auto-Sync)
          </div>
        </div>
      </div>

      <div className="overflow-x-auto flex-1 kanban-scroll bg-white">
        <table className="w-full text-left border-collapse min-w-[1200px]">
          <thead className="bg-gradient-to-r from-[#1e293b] to-[#334155] text-white sticky top-0 z-10 border-b-4 border-[#df8a5d]">
            <tr>
              <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest">Date</th>
              <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest">Document / Type</th>
              <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest">Entity Name</th>
              <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest">Tax Method</th>
              <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-right">Base Amount</th>
              <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-right text-[#eee5ca]">VAT (7%)</th>
              <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-right">Net Total</th>
              <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-center">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {currentItems?.map((rec: any) => (
              <tr key={rec.id} className="hover:bg-slate-50 transition-colors group">
                <td className="px-6 py-4 font-mono text-[11px] text-slate-500">{formatDate(rec.date)}</td>
                <td className="px-6 py-4">
                   <span className="font-bold text-[#1e293b] block">{rec.docNo}</span>
                   <span className={`text-[9px] font-black uppercase ${rec.type === 'Sales' ? 'text-rose-500' : 'text-blue-500'}`}>{rec.type}</span>
                </td>
                <td className="px-6 py-4 font-bold text-slate-700">{rec.entityName}</td>
                <td className="px-6 py-4">
                   <span className="px-2 py-1 bg-slate-100 text-slate-600 rounded-md text-[9px] font-black uppercase">{rec.taxMethod}</span>
                </td>
                <td className="px-6 py-4 font-mono font-bold text-right text-slate-600">฿{rec.baseAmount?.toLocaleString(undefined, {minimumFractionDigits: 2})}</td>
                <td className={`px-6 py-4 font-mono font-black text-right ${rec.type === 'Sales' ? 'text-rose-500' : 'text-blue-500'}`}>
                   {rec.vatAmount > 0 ? `฿${rec.vatAmount?.toLocaleString(undefined, {minimumFractionDigits: 2})}` : '-'}
                </td>
                <td className="px-6 py-4 font-mono font-black text-right text-[#1e293b]">฿{rec.totalAmount?.toLocaleString(undefined, {minimumFractionDigits: 2})}</td>
                <td className="px-6 py-4 text-center">
                  <span className={`px-2.5 py-1 rounded-md text-[9px] font-bold uppercase tracking-wider border
                    ${rec.status === 'Filed' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 
                      rec.status === 'Verified' ? 'bg-blue-50 text-blue-600 border-blue-100' : 
                      'bg-slate-100 text-slate-500 border-slate-200'}`}>
                    {rec.status}
                  </span>
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
            <select value={itemsPerPage} onChange={(e) => setItemsPerPage(Number(e.target.value))} className="bg-white border border-slate-200 rounded-lg px-2 py-1 outline-none text-[#1e293b]">
              <option value={10}>10</option>
              <option value={20}>20</option>
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

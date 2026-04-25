import React from 'react';
import { Search, Download, Lock, ChevronLeft, ChevronRight, ChevronDown } from 'lucide-react';
import { formatDate, formatAmount, getStatusColor } from '../utils';

export default function DataTable({
  filteredData,
  totalCost,
  totalNBV,
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
    <div className="bg-white/90 backdrop-blur-md border border-white shadow-sm overflow-hidden rounded-none flex-1 flex flex-col mt-2">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-0 border-b border-slate-200">
        <div className="p-4 border-r border-slate-200 flex flex-col justify-center bg-slate-50/50"><p className="text-[10px] font-bold text-[#7693a6] uppercase tracking-widest mb-1">Total Assets</p><p className="text-xl font-black text-[#223149] font-mono">{filteredData.length} Items</p></div>
        <div className="p-4 border-r border-slate-200 flex flex-col justify-center bg-blue-50/30"><p className="text-[10px] font-bold text-blue-600 uppercase tracking-widest mb-1">Total Cost Value</p><p className="text-xl font-black text-blue-700 font-mono">฿{formatAmount(totalCost)}</p></div>
        <div className="p-4 flex flex-col justify-center bg-emerald-50/30"><p className="text-[10px] font-bold text-[#0f766e] uppercase tracking-widest mb-1">Total Net Book Value (NBV)</p><p className="text-xl font-black text-[#0f766e] font-mono">฿{formatAmount(totalNBV)}</p></div>
      </div>
      <div className="p-3 flex items-center justify-between gap-4 bg-white/80 border-b border-slate-200">
        <div className="flex items-center gap-4 flex-shrink-0">
          <div className="relative flex items-center">
            <select value={subTab} onChange={(e) => setSubTab(e.target.value)} className="appearance-none bg-white border border-slate-200 shadow-sm rounded-lg pl-4 pr-10 py-2 text-[10px] font-bold text-[#223149] uppercase tracking-widest outline-none focus:border-[#0f766e] cursor-pointer">
              <option value="all">All Assets</option>
              <option value="Active">Active</option>
              <option value="Maintenance">Maintenance</option>
              <option value="Disposed">Disposed</option>
            </select>
            <ChevronDown size={14} className="absolute right-3 pointer-events-none text-[#7693a6]" />
          </div>
          <div className="relative w-64 flex items-center bg-white border border-slate-200 shadow-sm rounded-lg px-3 py-1.5">
            <Search className="text-[#7693a6]" size={16} />
            <input type="text" placeholder="Search Asset Code or Name..." className="w-full bg-transparent border-none outline-none ml-2 text-[#223149] font-medium placeholder-[#7693a6] text-[12px]" value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />
          </div>
        </div>
        <div className="flex items-center gap-2 justify-end flex-shrink-0 ml-auto font-black text-[#223149]">
          <button className="p-2.5 rounded-lg border border-slate-200 hover:bg-slate-50 transition-all flex items-center gap-2 font-bold text-[10px] uppercase tracking-widest text-[#0f766e]"><Download size={16} /> Export</button>
          <div className="h-6 w-px mx-2 bg-slate-300" />
          <div className="flex items-center gap-2 px-5 py-2.5 rounded-lg border border-slate-200 bg-slate-50 text-slate-400 font-bold uppercase tracking-widest text-[10px] cursor-not-allowed shadow-inner"><Lock size={14} /> Locked (Auto-Sync)</div>
        </div>
      </div>
      <div className="overflow-x-auto flex-1 custom-scrollbar bg-white">
        <table className="w-full text-left border-collapse min-w-[1100px]">
          <thead className="bg-gradient-to-r from-[#115e59] to-[#0f766e] text-white sticky top-0 z-10">
            <tr className="border-b-4 border-[#ccfbf1]">
              <th className="px-4 py-4 text-[10px] font-bold uppercase tracking-widest whitespace-nowrap">Asset Code</th>
              <th className="px-4 py-4 text-[10px] font-bold uppercase tracking-widest">Asset Name / Category</th>
              <th className="px-4 py-4 text-[10px] font-bold uppercase tracking-widest whitespace-nowrap">Purchase Date</th>
              <th className="px-4 py-4 text-[10px] font-bold uppercase tracking-widest text-right whitespace-nowrap">Cost (฿)</th>
              <th className="px-4 py-4 text-[10px] font-bold uppercase tracking-widest text-right whitespace-nowrap">Accum. Dep (฿)</th>
              <th className="px-4 py-4 text-[10px] font-bold uppercase tracking-widest text-right whitespace-nowrap">NBV (฿)</th>
              <th className="px-4 py-4 text-[10px] font-bold uppercase tracking-widest text-center whitespace-nowrap">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {currentItems?.map((v: any) => (
              <tr key={v.id} className="hover:bg-slate-50 transition-colors">
                <td className="px-4 py-3 font-mono font-bold text-[#0f766e]">{v.assetCode}</td>
                <td className="px-4 py-3"><span className="font-bold text-[#223149] block">{v.name}</span><span className="text-[9px] text-[#7693a6]">{v.category} • {v.location}</span></td>
                <td className="px-4 py-3 font-mono text-slate-500 text-[11px]">{formatDate(v.purchaseDate)}</td>
                <td className="px-4 py-3 font-mono font-black text-right text-[#223149]">{formatAmount(v.cost)}</td>
                <td className="px-4 py-3 font-mono font-black text-right text-rose-600">{formatAmount(v.accumDep)}</td>
                <td className="px-4 py-3 font-mono font-black text-right text-[#0f766e]">{formatAmount(v.nbv)}</td>
                <td className="px-4 py-3 text-center whitespace-nowrap">
                  <span className={`px-2 py-1 rounded text-[9px] font-bold uppercase tracking-wider border ${getStatusColor(v.status)}`}>{v.status}</span>
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

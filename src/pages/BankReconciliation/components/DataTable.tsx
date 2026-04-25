import React from 'react';
import { FileSearch, Scale, CheckCircle, ChevronDown, Search, Download, Lock } from 'lucide-react';
import { formatDate, getFormatAmount, getSourceBadge } from '../utils';

export default function DataTable({
  records,
  subTab,
  setSubTab,
  searchTerm,
  setSearchTerm,
  totalUnmatchedCount,
  totalDiffAmount,
  currentItems
}: any) {
  return (
    <div className="bg-white/90 backdrop-blur-md border border-white shadow-sm overflow-hidden rounded-none flex-1 flex flex-col mt-2">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-0 border-b border-slate-200">
        <div className="p-4 border-r border-slate-200 flex flex-col justify-center bg-slate-50/50">
          <p className="text-[10px] font-bold text-[#7693a6] uppercase tracking-widest mb-1 flex items-center gap-1"><FileSearch size={12}/> Total Unmatched</p>
          <p className="text-xl font-black text-[#223149] font-mono">{totalUnmatchedCount} Items</p>
        </div>
        <div className="p-4 border-r border-slate-200 flex flex-col justify-center bg-[#ce5a43]/5">
          <p className="text-[10px] font-bold text-[#ce5a43] uppercase tracking-widest mb-1 flex items-center gap-1"><Scale size={12}/> Total Difference</p>
          <p className="text-xl font-black text-[#ce5a43] font-mono">฿{totalDiffAmount?.toLocaleString()}</p>
        </div>
        <div className="p-4 border-r border-slate-200 flex flex-col justify-center bg-[#496ca8]/5">
          <p className="text-[10px] font-bold text-[#496ca8] uppercase tracking-widest mb-1 flex items-center gap-1">Adjustment Needed</p>
          <p className="text-xl font-black text-[#496ca8] font-mono">{records.filter((r: any) => r.status === 'Adjusting').length} Items</p>
        </div>
        <div className="p-4 flex flex-col justify-center bg-[#0ea5e9]/10">
          <p className="text-[10px] font-bold text-[#0ea5e9] uppercase tracking-widest mb-1 flex items-center gap-1"><CheckCircle size={12}/> Reconciled OK</p>
          <p className="text-xl font-black text-[#0ea5e9] font-mono">{records.filter((r: any) => r.status === 'Reconciled').length} Items</p>
        </div>
      </div>
      <div className="p-3 flex items-center justify-between gap-4 bg-white/80 border-b border-slate-200">
        <div className="flex items-center gap-4 flex-shrink-0">
          <div className="relative flex items-center">
            <select value={subTab} onChange={(e) => setSubTab(e.target.value)} className="appearance-none bg-white border border-slate-200 shadow-sm rounded-lg pl-4 pr-10 py-2 text-[10px] font-bold text-[#223149] uppercase tracking-widest outline-none focus:border-[#0ea5e9] cursor-pointer">
              <option value="all">All Records</option>
              <option value="Unmatched">Unmatched</option>
              <option value="Reconciled">Reconciled</option>
            </select>
            <ChevronDown size={14} className="absolute right-3 pointer-events-none text-[#7693a6]" />
          </div>
          <div className="relative w-64 flex items-center bg-white border border-slate-200 shadow-sm rounded-lg px-3 py-1.5">
            <Search className="text-[#7693a6]" size={16} />
            <input type="text" placeholder="Search Ref or Desc..." className="w-full bg-transparent border-none outline-none ml-2 text-[#223149] font-medium placeholder-[#7693a6] text-[12px]" value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />
          </div>
        </div>
        <div className="flex items-center gap-2 justify-end flex-shrink-0 ml-auto font-black text-[#223149]">
          <button className="p-2.5 rounded-lg border border-slate-200 hover:bg-slate-50 transition-all flex items-center gap-2 font-bold text-[10px] uppercase tracking-widest text-[#496ca8]"><Download size={16} /> Export</button>
          <div className="h-6 w-px mx-2 bg-slate-300" />
          <div className="flex items-center gap-2 px-5 py-2.5 rounded-lg border border-slate-200 bg-slate-50 text-slate-400 font-bold uppercase tracking-widest text-[10px] cursor-not-allowed shadow-inner"><Lock size={14} /> Locked (Auto-Sync)</div>
        </div>
      </div>
      <div className="overflow-x-auto flex-1 custom-scrollbar bg-white">
        <table className="w-full text-left border-collapse min-w-[1100px]">
          <thead className="bg-gradient-to-r from-[#223f59] to-[#0ea5e9] text-white sticky top-0 z-10">
            <tr className="border-b-4 border-[#0ea5e9]">
              <th className="px-4 py-4 text-[10px] font-bold uppercase tracking-widest whitespace-nowrap border-r border-white/20">Date</th>
              <th className="px-4 py-4 text-[10px] font-bold uppercase tracking-widest whitespace-nowrap text-center border-r border-white/20">Source</th>
              <th className="px-4 py-4 text-[10px] font-bold uppercase tracking-widest whitespace-nowrap border-r border-white/20">Ref No.</th>
              <th className="px-4 py-4 text-[10px] font-bold uppercase tracking-widest border-r border-white/20">Description / Type</th>
              <th className="px-4 py-4 text-[10px] font-bold uppercase tracking-widest text-center border-r border-white/20">Bank Account</th>
              <th className="px-4 py-4 text-[10px] font-bold uppercase tracking-widest text-right whitespace-nowrap border-r border-white/20">Bank Amount</th>
              <th className="px-4 py-4 text-[10px] font-bold uppercase tracking-widest text-right whitespace-nowrap border-r border-white/20">Book Amount</th>
              <th className="px-4 py-4 text-[10px] font-bold uppercase tracking-widest text-center whitespace-nowrap">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {currentItems?.map((rec: any) => (
              <tr key={rec.id} className="hover:bg-slate-50 transition-colors">
                <td className="px-4 py-3 font-mono">{formatDate(rec.date)}</td>
                <td className="px-4 py-3 text-center">{getSourceBadge(rec.source)}</td>
                <td className="px-4 py-3 font-mono font-bold text-[#0ea5e9]">{rec.refNo}</td>
                <td className="px-4 py-3"><span className="font-medium text-[#223149] block">{rec.description}</span><span className="text-[9px] text-[#7693a6]">{rec.type}</span></td>
                <td className="px-4 py-3 text-center font-bold text-slate-500">{rec.bankAccount}</td>
                <td className="px-4 py-3 font-mono font-semibold text-right">{getFormatAmount(rec.bankAmount)}</td>
                <td className="px-4 py-3 font-mono font-semibold text-right">{getFormatAmount(rec.bookAmount)}</td>
                <td className="px-4 py-3 text-center">
                  <span className={`px-2 py-1 rounded text-[9px] font-bold uppercase tracking-wider border
                    ${rec.status === 'Reconciled' ? 'bg-[#0ea5e9]/10 text-[#0ea5e9] border-[#0ea5e9]/20' : 'bg-slate-100 text-slate-500 border-slate-200'}`}>
                    {rec.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

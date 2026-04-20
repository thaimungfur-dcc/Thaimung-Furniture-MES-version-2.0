import React from 'react';
import { ChevronDown, Search, Download, Lock } from 'lucide-react';
import { formatDate, getCategoryIcon, getSourceBadge } from '../utils';

export default function DataTable({
  filteredData,
  totalAmount,
  subTab,
  setSubTab,
  searchTerm,
  setSearchTerm,
  currentItems
}: any) {
  return (
    <div className="bg-white/90 backdrop-blur-md border border-white shadow-sm overflow-hidden rounded-none flex-1 flex flex-col mt-2">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-0 border-b border-slate-200">
        <div className="p-4 border-r border-slate-200 flex flex-col justify-center bg-slate-50/50"><p className="text-[10px] font-bold text-[#7693a6] uppercase tracking-widest mb-1">Total Amount</p><p className="text-xl font-black text-[#223149] font-mono">฿{totalAmount.toLocaleString()}</p></div>
        <div className="p-4 border-r border-slate-200 flex flex-col justify-center bg-[#d9b343]/5"><p className="text-[10px] font-bold text-[#d9b343] uppercase tracking-widest mb-1">Pending Approval</p><p className="text-xl font-black text-[#d9b343] font-mono">฿{filteredData.filter((i: any)=>i.status==='Pending Approval').reduce((s: number,i: any)=>s+i.amount,0).toLocaleString()}</p></div>
        <div className="p-4 border-r border-slate-200 flex flex-col justify-center bg-[#496ca8]/5"><p className="text-[10px] font-bold text-[#496ca8] uppercase tracking-widest mb-1">Approved (To Pay)</p><p className="text-xl font-black text-[#496ca8] font-mono">฿{filteredData.filter((i: any)=>i.status==='Approved').reduce((s: number,i: any)=>s+i.amount,0).toLocaleString()}</p></div>
        <div className="p-4 flex flex-col justify-center bg-emerald-50/30"><p className="text-[10px] font-bold text-[#7fa85a] uppercase tracking-widest mb-1">Reimbursed (Paid)</p><p className="text-xl font-black text-[#7fa85a] font-mono">฿{filteredData.filter((i: any)=>i.status==='Reimbursed').reduce((s: number,i: any)=>s+i.amount,0).toLocaleString()}</p></div>
      </div>
      <div className="p-3 flex items-center justify-between gap-4 bg-white/80 border-b border-slate-200">
        <div className="flex items-center gap-4 flex-shrink-0">
          <div className="relative flex items-center">
            <select value={subTab} onChange={(e) => setSubTab(e.target.value)} className="appearance-none bg-white border border-slate-200 shadow-sm rounded-lg pl-4 pr-10 py-2 text-[10px] font-bold text-[#223149] uppercase tracking-widest outline-none focus:border-[#7fa85a] cursor-pointer">
              <option value="all">All Vouchers</option>
              <option value="Pending Approval">Pending</option>
              <option value="Reimbursed">Reimbursed</option>
            </select>
            <ChevronDown size={14} className="absolute right-3 pointer-events-none text-[#7693a6]" />
          </div>
          <div className="relative w-64 flex items-center bg-white border border-slate-200 shadow-sm rounded-lg px-3 py-1.5">
            <Search className="text-[#7693a6]" size={16} />
            <input type="text" placeholder="Search PCV or Employee..." className="w-full bg-transparent border-none outline-none ml-2 text-[#223149] font-medium placeholder-[#7693a6] text-[12px]" value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />
          </div>
        </div>
        <div className="flex items-center gap-2 justify-end flex-shrink-0 ml-auto font-black text-[#223149]">
          <button className="p-2.5 rounded-lg border border-slate-200 hover:bg-slate-50 transition-all flex items-center gap-2 font-bold text-[10px] uppercase tracking-widest text-[#496ca8]"><Download size={16} /> Export</button>
          <div className="h-6 w-px mx-2 bg-slate-300" />
          <div className="flex items-center gap-2 px-5 py-2.5 rounded-lg border border-slate-200 bg-slate-50 text-slate-400 font-bold uppercase tracking-widest text-[10px] cursor-not-allowed shadow-inner"><Lock size={14} /> Locked (Auto-Sync)</div>
        </div>
      </div>
      <div className="overflow-x-auto flex-1 custom-scrollbar bg-white">
        <table className="w-full text-left border-collapse min-w-[1000px]">
          <thead className="bg-gradient-to-r from-[#223149] to-[#3c5d7d] text-white sticky top-0 z-10">
            <tr className="border-b-4 border-[#7fa85a]">
              <th className="px-4 py-4 text-[10px] font-bold uppercase tracking-widest whitespace-nowrap">PCV No.</th>
              <th className="px-4 py-4 text-[10px] font-bold uppercase tracking-widest whitespace-nowrap text-center">Source</th>
              <th className="px-4 py-4 text-[10px] font-bold uppercase tracking-widest whitespace-nowrap text-center">Date</th>
              <th className="px-4 py-4 text-[10px] font-bold uppercase tracking-widest">Employee / Dept</th>
              <th className="px-4 py-4 text-[10px] font-bold uppercase tracking-widest">Category / Desc</th>
              <th className="px-4 py-4 text-[10px] font-bold uppercase tracking-widest text-right whitespace-nowrap">Amount (฿)</th>
              <th className="px-4 py-4 text-[10px] font-bold uppercase tracking-widest text-center whitespace-nowrap">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {currentItems.map((v: any) => (
              <tr key={v.id} className="hover:bg-slate-50 transition-colors">
                <td className="px-4 py-3 font-mono font-bold text-[#7fa85a]">{v.pcvNo}</td>
                <td className="px-4 py-3 text-center">{getSourceBadge(v.source)}</td>
                <td className="px-4 py-3 font-mono text-center">{formatDate(v.date)}</td>
                <td className="px-4 py-3"><span className="font-bold text-[#223149] block">{v.employee}</span><span className="text-[9px] text-[#7693a6]">{v.department}</span></td>
                <td className="px-4 py-3 min-w-[200px]"><span className="font-medium text-[#3c5d7d] block">{v.description}</span><span className="text-[9px] text-slate-500">{getCategoryIcon(v.category)} {v.category}</span></td>
                <td className="px-4 py-3 font-mono font-black text-right text-[#223149]">฿{v.amount.toLocaleString()}</td>
                <td className="px-4 py-3 text-center whitespace-nowrap">
                  <span className={`px-2 py-1 rounded text-[9px] font-bold uppercase tracking-wider
                    ${v.status === 'Reimbursed' ? 'bg-[#7fa85a]/10 text-[#7fa85a]' : 
                      v.status === 'Approved' ? 'bg-[#496ca8]/10 text-[#496ca8]' : 
                      'bg-slate-100 text-slate-500'}`}>{v.status}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

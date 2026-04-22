import React from 'react';
import { Filter, ChevronDown, Search, UploadCloud, ChevronLeft, ChevronRight } from 'lucide-react';

export default function InventoryTable({ 
    activeFilter, 
    setActiveFilter, 
    filters, 
    getFilterCount, 
    searchQuery, 
    setSearchQuery, 
    paginatedItems, 
    getStatusClass, 
    currentPage, 
    setCurrentPage, 
    totalPages 
}: any) {
    return (
        <>
            {/* Toolbar */}
            <div className="px-6 py-4 border-b border-slate-100 flex flex-col lg:flex-row items-center justify-between gap-4 bg-slate-50/50 relative z-20">
                <div className="flex flex-1 items-center gap-3 w-full lg:w-auto overflow-x-auto no-scrollbar">
                    <div className="relative shrink-0">
                        <Filter className="absolute left-3 top-1/2 -translate-y-1/2 text-[#111f42]" size={14} />
                        <select 
                            value={activeFilter} 
                            onChange={(e) => {setActiveFilter(e.target.value); setCurrentPage(1);}} 
                            className="appearance-none min-w-[220px] bg-white border border-slate-200 rounded-lg pl-9 pr-10 py-2.5 outline-none focus:border-[#111f42] text-[#111f42] font-bold text-[11px] uppercase tracking-wider shadow-sm transition-all cursor-pointer font-mono"
                        >
                            {filters.map((f: string) => (
                                <option key={f} value={f}>
                                    {f === 'All' ? 'ALL STATUS' : f.toUpperCase()} ({getFilterCount(f)})
                                </option>
                            ))}
                        </select>
                        <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                            <ChevronDown size={14} />
                        </div>
                    </div>
                    
                    <div className="h-6 w-px bg-slate-200 mx-1 hidden lg:block shrink-0"></div>

                    <div className="relative w-full lg:w-72 shrink-0">
                        <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                        <input type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="Search ID or Name..." className="input-primary pl-9 pr-4 py-2 text-[11px] outline-none focus:border-[#111f42] font-bold h-[40px] w-full" />
                    </div>
                </div>
                <button className="h-9 px-5 rounded-xl text-[10px] font-black bg-[#111f42] text-white shadow-md hover:bg-[#1e346b] transition-all uppercase tracking-widest flex items-center gap-2 font-mono">
                    <UploadCloud size={14} className="text-white opacity-60" /> IMPORT
                </button>
            </div>

            {/* Table Integrated - NO STICKY HEADER */}
            <div className="w-full relative overflow-visible flex-1">
                <table className="w-full text-left whitespace-nowrap border-collapse">
                    <thead>
                        <tr>
                            <th className="minimal-th">Product Information</th>
                            <th className="minimal-th text-right">Onhand</th>
                            <th className="minimal-th text-right text-orange-100">Booking (-)</th>
                            <th className="minimal-th text-right text-emerald-100">Available</th>
                            <th className="minimal-th text-right text-blue-100">Plan In (+)</th>
                            <th className="minimal-th text-right text-orange-100">Plan Out (-)</th>
                            <th className="minimal-th text-right text-amber-200 font-black">Est. Balance</th>
                            <th className="minimal-th text-center">Avg/Day</th>
                            <th className="minimal-th text-center">Min Point</th>
                            <th className="minimal-th text-center">Status</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 bg-white text-[12px]">
                        {paginatedItems.map((item: any) => (
                            <tr key={item.id} className="hover:bg-slate-50 transition-colors">
                                <td className="minimal-td py-3">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded border border-slate-100 bg-slate-50 flex items-center justify-center overflow-hidden shrink-0 shadow-sm">
                                            <img src={item.image} className="w-full h-full object-cover" alt="Product" />
                                        </div>
                                        <div className="flex flex-col">
                                            <span className="font-black text-[#ab8a3b] font-mono text-[11px] leading-none mb-1">{item.id}</span>
                                            <span className="font-bold text-[#111f42] text-[12px] truncate max-w-[200px]">{item.name}</span>
                                        </div>
                                    </div>
                                </td>
                                <td className="minimal-td text-right font-mono font-black text-slate-500">{item.onhand.toLocaleString()}</td>
                                <td className="minimal-td text-right font-mono font-bold text-[#E3624A]">{item.booking.toLocaleString()}</td>
                                
                                <td className="minimal-td text-right font-mono font-semibold text-[#2e4756] cell-available">
                                    {item.available.toLocaleString()}
                                </td>
                                
                                <td className="minimal-td text-right font-mono font-black text-[#10b981] cell-plan-in">
                                    {item.planIn > 0 ? `+${item.planIn.toLocaleString()}` : '-'}
                                </td>
                                
                                <td className="minimal-td text-right font-mono font-black text-[#E3624A] cell-plan-out">
                                    {item.planOut > 0 ? `-${item.planOut.toLocaleString()}` : '-'}
                                </td>
                                
                                <td className="minimal-td text-right font-mono font-black text-[#ab8a3b] bg-amber-50/10 text-[14px]">{item.estQty.toLocaleString()}</td>
                                <td className="minimal-td text-center font-mono font-bold text-slate-400">{item.avgUsage}</td>
                                <td className="minimal-td text-center font-mono font-black text-[#111f42]">
                                    {item.minPoint.toLocaleString()}
                                </td>
                                <td className="minimal-td text-center">
                                    <span className={`badge ${getStatusClass(item.status)}`}>{item.status}</span>
                                </td>
                            </tr>
                        ))}
                        {paginatedItems.length === 0 && (
                            <tr><td colSpan={10} className="text-center py-24 text-slate-300 italic font-mono uppercase tracking-widest text-[11px]">No matching records found</td></tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* Pagination Footer - Forced to Bottom */}
            <div className="px-6 py-4 border-t border-slate-100 flex flex-col md:flex-row justify-between items-center gap-4 bg-slate-50/50 shrink-0 mt-auto">
                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest font-mono font-black">Page {currentPage} of {totalPages}</span>
                <div className="flex items-center gap-2 font-mono">
                    <button onClick={() => setCurrentPage((p: number) => Math.max(1, p - 1))} disabled={currentPage === 1} className="p-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 disabled:opacity-30 transition-all shadow-sm"><ChevronLeft size={14}/></button>
                    <div className="flex items-center gap-1">
                        {[...Array(totalPages)].map((_, i) => (
                            <button 
                                key={i} 
                                onClick={() => setCurrentPage(i + 1)}
                                className={`w-7 h-7 rounded text-[10px] font-bold transition-all ${currentPage === i + 1 ? 'bg-[#111f42] text-white shadow-md' : 'bg-white text-slate-400 hover:bg-slate-100 border border-slate-100'}`}
                            >
                                {i + 1}
                            </button>
                        ))}
                    </div>
                    <button onClick={() => setCurrentPage((p: number) => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages} className="p-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 disabled:opacity-30 transition-all shadow-sm"><ChevronRight size={14}/></button>
                </div>
            </div>
        </>
    );
}

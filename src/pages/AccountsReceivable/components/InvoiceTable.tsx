import React from 'react';
import { Search, Download, FileText, AlertCircle, UserX, CheckCircle, Lock, CreditCard, ShieldAlert, ChevronLeft, ChevronRight, Printer } from 'lucide-react';
import { formatDate, isOverdue } from '../utils';

export default function InvoiceTable({ 
  invoices, 
  loading, 
  subTab, 
  setSubTab, 
  searchTerm, 
  setSearchTerm, 
  executeExportCSV, 
  totalOutstanding, 
  totalOverdueAmount, 
  totalBadDebtAmount,
  currentItems,
  totalPages,
  currentPage,
  setCurrentPage,
  itemsPerPage,
  setItemsPerPage,
  filteredInvoices,
  indexOfFirstItem,
  indexOfLastItem,
  setPaymentModal,
  toggleBadDebt,
  setPreviewModal
}: any) {
  return (
    <div className="bg-white/90 backdrop-blur-md border border-white shadow-sm overflow-hidden rounded-none flex-1 flex flex-col no-print mt-2">
      
      {/* Data Insights Summary Bar */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-0 border-b border-slate-200">
        <div className="p-4 border-r border-slate-200 flex flex-col justify-center bg-slate-50/50 hover:bg-slate-50 transition-colors">
          <p className="text-[10px] font-bold text-[#7693a6] uppercase tracking-widest mb-1 flex items-center gap-1"><FileText size={12}/> Total Outstanding</p>
          <p className="text-xl font-black text-[#223149] font-mono">฿{totalOutstanding.toLocaleString()}</p>
        </div>
        <div className="p-4 border-r border-slate-200 flex flex-col justify-center bg-rose-50/30 hover:bg-rose-50/50 transition-colors">
          <p className="text-[10px] font-bold text-[#ce5a43] uppercase tracking-widest mb-1 flex items-center gap-1"><AlertCircle size={12}/> Total Overdue</p>
          <p className="text-xl font-black text-[#ce5a43] font-mono">฿{totalOverdueAmount.toLocaleString()}</p>
        </div>
        <div className="p-4 border-r border-slate-200 flex flex-col justify-center bg-[#933b5b]/5 hover:bg-[#933b5b]/10 transition-colors">
          <p className="text-[10px] font-bold text-[#933b5b] uppercase tracking-widest mb-1 flex items-center gap-1"><UserX size={12}/> Total Bad Debt</p>
          <p className="text-xl font-black text-[#933b5b] font-mono">฿{totalBadDebtAmount.toLocaleString()}</p>
        </div>
        <div className="p-4 flex flex-col justify-center bg-emerald-50/30 hover:bg-emerald-50/50 transition-colors">
          <p className="text-[10px] font-bold text-[#7fa85a] uppercase tracking-widest mb-1 flex items-center gap-1"><CheckCircle size={12}/> Collection Progress</p>
          <div className="flex items-center gap-3">
            <div className="flex-1 h-2 bg-slate-200 rounded-full overflow-hidden">
              <div className="h-full bg-[#7fa85a]" style={{ width: `${(invoices.reduce((s:any,i:any)=>s+i.paid,0) / invoices.reduce((s:any,i:any)=>s+i.amount,0)) * 100}%` }}></div>
            </div>
            <span className="text-sm font-black text-[#223149]">{((invoices.reduce((s:any,i:any)=>s+i.paid,0) / invoices.reduce((s:any,i:any)=>s+i.amount,0)) * 100).toFixed(1)}%</span>
          </div>
        </div>
      </div>

      {/* Table Toolbar */}
      <div className="p-3 flex items-center justify-between gap-4 bg-white/80 border-b border-slate-200 overflow-x-auto flex-shrink-0">
        {/* Left Side: Tabs + Search Group */}
        <div className="flex items-center gap-4 flex-shrink-0">
          <div className="flex bg-slate-100 p-1 border border-slate-200 shadow-sm rounded-lg">
            <button onClick={() => setSubTab('all')} className={`px-4 py-1.5 whitespace-nowrap font-bold text-[10px] uppercase tracking-widest rounded transition-all ${subTab === 'all' ? 'bg-[#223149] text-white shadow-sm' : 'text-[#7693a6] hover:bg-white/80'}`}>All</button>
            <button onClick={() => setSubTab('Unpaid')} className={`px-4 py-1.5 whitespace-nowrap font-bold text-[10px] uppercase tracking-widest rounded transition-all ${subTab === 'Unpaid' ? 'bg-[#df8a5d] text-white shadow-sm' : 'text-[#7693a6] hover:bg-white/80'}`}>Unpaid</button>
            <button onClick={() => setSubTab('Overdue')} className={`px-4 py-1.5 whitespace-nowrap font-bold text-[10px] uppercase tracking-widest rounded transition-all ${subTab === 'Overdue' ? 'bg-[#ce5a43] text-white shadow-sm' : 'text-[#7693a6] hover:bg-white/80'}`}>Overdue</button>
            <button onClick={() => setSubTab('BadDebt')} className={`px-4 py-1.5 whitespace-nowrap font-bold text-[10px] uppercase tracking-widest rounded transition-all ${subTab === 'BadDebt' ? 'bg-[#933b5b] text-white shadow-sm' : 'text-[#7693a6] hover:bg-white/80'}`}>Bad Debt</button>
            <button onClick={() => setSubTab('Exception')} className={`px-4 py-1.5 whitespace-nowrap font-bold text-[10px] uppercase tracking-widest rounded transition-all ${subTab === 'Exception' ? 'bg-[#d9b343] text-white shadow-sm' : 'text-[#7693a6] hover:bg-white/80'}`}>Exception</button>
          </div>

          <div className="relative w-64 flex items-center bg-white border border-slate-200 shadow-sm rounded-lg px-3 py-1.5">
            <Search className="text-[#7693a6]" size={16} />
            <input 
              type="text" 
              placeholder="Search invoice or customer..." 
              className="w-full bg-transparent border-none outline-none ml-2 text-[#223149] font-medium placeholder-[#7693a6] text-[12px]"
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {/* Right Side: Action Buttons */}
        <div className="flex items-center gap-2 justify-end flex-shrink-0 ml-auto">
          <button 
            onClick={() => setPreviewModal('print')}
            className="p-2.5 rounded-lg border transition-all hover:shadow-sm flex items-center gap-2 font-bold text-[10px] uppercase tracking-widest bg-white text-[#223149] border-slate-200 hover:bg-slate-50"
            title="Print AR Report"
          >
            <Printer size={16} /> PRINT AR REPORT
          </button>
          <button 
            onClick={executeExportCSV}
            className="p-2.5 rounded-lg border transition-all hover:shadow-sm flex items-center gap-2 font-bold text-[10px] uppercase tracking-widest"
            style={{ borderColor: '#496ca8', color: '#496ca8', backgroundColor: 'rgba(255,255,255,0.8)' }}
            onMouseOver={(e) => { e.currentTarget.style.backgroundColor = '#496ca8'; e.currentTarget.style.color = 'white'; }}
            onMouseOut={(e) => { e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.8)'; e.currentTarget.style.color = '#496ca8'; }}
            title="Export to CSV Database"
          >
            <Download size={16} /> EXPORT CSV
          </button>
          <div className="h-6 w-px mx-2 bg-slate-300" />
          <div className="flex items-center gap-2 px-5 py-2.5 rounded-lg border border-slate-200 bg-slate-50 text-slate-400 font-bold uppercase tracking-widest text-[10px] cursor-not-allowed" title="Data must be entered via Master Data Center">
            <Lock size={14} /> Locked (Auto-Sync)
          </div>
        </div>
      </div>

      <div className="overflow-x-auto flex-1 kanban-scroll bg-white">
        {loading ? (
          <div className="p-8 text-center font-bold text-[#7693a6]">Loading data...</div>
        ) : (
          <table className="w-full text-left border-collapse min-w-[1200px]">
            <thead className="bg-gradient-to-r from-[#223149] to-[#3c5d7d] text-white sticky top-0 z-10">
              <tr className="border-b-4 border-[#df8a5d]">
                <th className="px-4 py-4 text-[10px] font-bold uppercase tracking-widest whitespace-nowrap border-r border-white/20">DATES</th>
                <th className="px-4 py-4 text-[10px] font-bold uppercase tracking-widest whitespace-nowrap border-r border-white/20">DOCUMENT INFO</th>
                <th className="px-4 py-4 text-[10px] font-bold uppercase tracking-widest whitespace-nowrap border-r border-white/20">CUSTOMER DETAILS</th>
                <th className="px-4 py-4 text-[10px] font-bold uppercase tracking-widest text-right whitespace-nowrap border-r border-white/20">AMOUNT (฿)</th>
                <th className="px-4 py-4 text-[10px] font-bold text-[#eee5ca] uppercase tracking-widest text-center whitespace-nowrap border-r border-white/20">STATUS & RISK</th>
                <th className="px-4 py-4 text-[10px] font-bold uppercase tracking-widest text-center whitespace-nowrap">ACTION</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {currentItems.length > 0 ? currentItems.map((inv: any) => (
                <tr key={inv.id} className={`transition-colors hover:bg-slate-50 ${inv.isBadDebt ? 'bg-red-50/30' : ''}`}>
                  {/* DATES */}
                  <td className="px-4 py-3 align-top border-r border-slate-100">
                    <div className="space-y-1">
                      <p className="flex items-center gap-1.5 text-[11px]">
                        <span className="text-slate-400 font-semibold w-12">Issue:</span> 
                        <span className="font-mono text-[#223149] font-bold">{formatDate(inv.issueDate)}</span>
                      </p>
                      <p className="flex items-center gap-1.5 text-[11px]">
                        <span className="text-slate-400 font-semibold w-12">Due:</span> 
                        <span className={`font-mono font-bold ${isOverdue(inv) ? 'text-[#ce5a43]' : 'text-[#223149]'}`}>{formatDate(inv.dueDate)}</span>
                      </p>
                      {inv.payDate && (
                        <p className="flex items-center gap-1.5 text-[11px]">
                          <span className="text-slate-400 font-semibold w-12">Paid:</span> 
                          <span className="font-mono text-[#7fa85a] font-bold">{formatDate(inv.payDate)}</span>
                        </p>
                      )}
                    </div>
                  </td>

                  {/* DOCUMENT INFO */}
                  <td className="px-4 py-3 align-top border-r border-slate-100">
                    <div className="space-y-1">
                      <p className="flex items-center gap-1.5 text-[11px]">
                        <span className="text-slate-400 font-semibold w-8">INV:</span> 
                        <span className="font-mono text-[#496ca8] font-black">{inv.invNo}</span>
                      </p>
                      <p className="flex items-center gap-1.5 text-[11px]">
                        <span className="text-slate-400 font-semibold w-8">SO:</span> 
                        <span className="font-mono text-[#7693a6] font-semibold">{inv.soRef}</span>
                      </p>
                    </div>
                  </td>

                  {/* CUSTOMER DETAILS */}
                  <td className="px-4 py-3 align-top border-r border-slate-100">
                    <div className="space-y-1.5">
                      <p className="font-black text-[13px] text-[#223149] truncate max-w-[200px]">{inv.customer}</p>
                      <div className="flex items-center gap-2">
                        <span className={`px-1.5 py-0.5 rounded text-[8px] font-bold uppercase tracking-wider ${inv.customerType === 'New' ? 'bg-purple-100 text-purple-700' : 'bg-blue-100 text-blue-700'}`}>
                          {inv.customerType} Cust.
                        </span>
                        <span className="text-[10px] font-semibold text-slate-500">Term: {inv.creditTerm} Days</span>
                      </div>
                    </div>
                  </td>

                  {/* AMOUNTS */}
                  <td className="px-4 py-3 align-top text-right border-r border-slate-100">
                    <div className="space-y-1">
                      <p className="flex items-center justify-between text-[11px]">
                        <span className="text-slate-400 font-semibold">Total:</span> 
                        <span className="font-mono text-[#7693a6] font-bold">{inv.amount.toLocaleString()}</span>
                      </p>
                      <p className="flex items-center justify-between text-[11px]">
                        <span className="text-slate-400 font-semibold">Paid:</span> 
                        <span className="font-mono text-[#7fa85a] font-bold">{inv.paid > 0 ? inv.paid.toLocaleString() : '-'}</span>
                      </p>
                      <p className="flex items-center justify-between text-[12px] pt-1 border-t border-slate-100 mt-1">
                        <span className="text-[#223149] font-black">Bal:</span> 
                        <span className={`font-mono font-black ${inv.isBadDebt ? 'text-[#933b5b]' : inv.balance > 0 ? 'text-[#ce5a43]' : 'text-slate-300'}`}>
                          {inv.balance.toLocaleString()}
                        </span>
                      </p>
                    </div>
                  </td>

                  {/* STATUS & RISK */}
                  <td className="px-4 py-3 align-middle text-center border-r border-slate-100">
                    <div className="flex flex-col items-center gap-2">
                      <span className={`px-3 py-1 font-black uppercase tracking-widest border rounded-md text-[9px] whitespace-nowrap shadow-sm
                        ${inv.status === 'Paid' ? 'bg-[#7fa85a]/10 text-[#7fa85a] border-[#7fa85a]/30' : 
                          inv.status === 'Bad Debt' ? 'bg-[#933b5b]/10 text-[#933b5b] border-[#933b5b]/50' :
                          inv.status === 'Overdue' ? 'bg-[#ce5a43]/10 text-[#ce5a43] border-[#ce5a43]/30' : 
                          inv.status === 'Billed' ? 'bg-[#496ca8]/10 text-[#496ca8] border-[#496ca8]/30' : 
                          inv.status === 'Waiting Payment' ? 'bg-[#d9b343]/10 text-[#d9b343] border-[#d9b343]/30' : 
                          'bg-slate-100 text-[#7693a6] border-slate-200'}`}>
                        {inv.status}
                      </span>
                      
                      <div className="flex items-center gap-1 text-[9px] font-bold text-slate-500">
                        Risk: 
                        <span className={`uppercase ${inv.risk === 'High' ? 'text-[#ce5a43]' : inv.risk === 'Medium' ? 'text-[#d9b343]' : 'text-[#7fa85a]'}`}>
                          {inv.risk}
                        </span>
                      </div>
                    </div>
                  </td>

                  {/* ACTION */}
                  <td className="px-4 py-3 align-middle text-center">
                    <div className="flex flex-col items-center justify-center gap-2">
                      {inv.balance > 0 && !inv.isBadDebt && (
                        <button 
                          onClick={() => setPaymentModal(inv)}
                          className="w-full max-w-[100px] px-3 py-1.5 bg-[#223149] hover:bg-[#3c5d7d] text-white rounded-md text-[9px] font-bold uppercase tracking-widest transition-all flex items-center justify-center gap-1 shadow-sm"
                        >
                          <CreditCard size={12} /> Pay
                        </button>
                      )}
                      {inv.balance > 0 && (
                        <button 
                          onClick={() => toggleBadDebt(inv.id)}
                          className={`w-full max-w-[100px] px-3 py-1.5 rounded-md text-[8px] font-bold uppercase tracking-widest transition-all flex items-center justify-center gap-1 border
                            ${inv.isBadDebt ? 'bg-slate-100 text-slate-500 border-slate-200 hover:bg-slate-200' : 'bg-white text-[#933b5b] border-[#933b5b]/30 hover:bg-rose-50'}`}
                          title={inv.isBadDebt ? "Restore from Bad Debt" : "Mark as Bad Debt (Written Off)"}
                        >
                          {inv.isBadDebt ? 'Undo Write-off' : <><ShieldAlert size={10} /> Mark Bad Debt</>}
                        </button>
                      )}
                      {inv.balance === 0 && (
                        <span className="text-[#7fa85a] flex items-center justify-center gap-1 text-[10px] font-black uppercase tracking-widest"><CheckCircle size={14}/> Settled</span>
                      )}
                    </div>
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan={6} className="px-6 py-16 text-center font-bold text-slate-400 text-sm">
                    <div className="flex flex-col items-center justify-center gap-2">
                      <Search size={32} className="opacity-20 mb-2"/>
                      No detailed invoices found for the selected criteria.
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>

      {/* Pagination Controls */}
      {totalPages > 0 && !loading && (
        <div className="flex items-center justify-between px-4 py-3 bg-slate-50 border-t border-slate-200 sm:px-6 flex-shrink-0">
          <div className="flex items-center gap-2 text-xs text-[#7693a6] font-bold uppercase tracking-widest">
            <span>Show</span>
            <select 
              value={itemsPerPage} 
              onChange={(e) => setItemsPerPage(Number(e.target.value))}
              className="bg-white border border-slate-300 rounded-md px-2 py-1 outline-none focus:border-[#496ca8] text-[#223149]"
            >
              <option value={10}>10</option>
              <option value={20}>20</option>
              <option value={50}>50</option>
            </select>
            <span>entries</span>
          </div>
          <div className="flex justify-between flex-1 sm:hidden ml-4">
            <button onClick={() => setCurrentPage((prev: number) => Math.max(prev - 1, 1))} disabled={currentPage === 1} className="relative inline-flex items-center px-4 py-2 text-xs font-bold text-[#223149] bg-white border border-[#cbd5e1] rounded-md hover:bg-slate-50 disabled:opacity-50 uppercase tracking-widest">Previous</button>
            <button onClick={() => setCurrentPage((prev: number) => Math.min(prev + 1, totalPages))} disabled={currentPage === totalPages} className="relative ml-3 inline-flex items-center px-4 py-2 text-xs font-bold text-[#223149] bg-white border border-[#cbd5e1] rounded-md hover:bg-slate-50 disabled:opacity-50 uppercase tracking-widest">Next</button>
          </div>
          <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-end gap-4">
            <div>
              <p className="text-xs text-[#7693a6] font-semibold">
                Showing <span className="font-bold text-[#223149]">{filteredInvoices.length === 0 ? 0 : indexOfFirstItem + 1}</span> to <span className="font-bold text-[#223149]">{Math.min(indexOfLastItem, filteredInvoices.length)}</span> of <span className="font-bold text-[#223149]">{filteredInvoices.length}</span> results
              </p>
            </div>
            <div>
              <nav className="isolate inline-flex -space-x-px rounded-md shadow-sm" aria-label="Pagination">
                <button onClick={() => setCurrentPage((prev: number) => Math.max(prev - 1, 1))} disabled={currentPage === 1} className="relative inline-flex items-center rounded-l-md px-2 py-2 text-[#7693a6] bg-white ring-1 ring-inset ring-[#cbd5e1] hover:bg-slate-50 focus:z-20 focus:outline-offset-0 disabled:opacity-50"><span className="sr-only">Previous</span><ChevronLeft size={16} /></button>
                {[...Array(totalPages)].map((_, i) => (
                  <button key={i + 1} onClick={() => setCurrentPage(i + 1)} className={`relative inline-flex items-center px-4 py-2 text-xs font-bold focus:z-20 ${currentPage === i + 1 ? 'z-10 bg-[#223149] text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#223149]' : 'text-[#223149] bg-white ring-1 ring-inset ring-[#cbd5e1] hover:bg-slate-50 focus:outline-offset-0'}`}>
                    {i + 1}
                  </button>
                ))}
                <button onClick={() => setCurrentPage((prev: number) => Math.min(prev + 1, totalPages))} disabled={currentPage === totalPages} className="relative inline-flex items-center rounded-r-md px-2 py-2 text-[#7693a6] bg-white ring-1 ring-inset ring-[#cbd5e1] hover:bg-slate-50 focus:z-20 focus:outline-offset-0 disabled:opacity-50"><span className="sr-only">Next</span><ChevronRight size={16} /></button>
              </nav>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

import React from 'react';
import { Search, Download, FileText, AlertCircle, AlertTriangle, CheckCircle, Lock, ChevronDown, ChevronLeft, ChevronRight, Receipt, CreditCard, Printer } from 'lucide-react';
import { formatDate, isOverdue } from '../utils';

export default function BillTable({ 
  bills, 
  loading, 
  subTab, 
  setSubTab, 
  searchTerm, 
  setSearchTerm, 
  executeExportCSV, 
  totalPayable, 
  totalOverdueAmount, 
  totalDisputedAmount,
  currentItems,
  totalPages,
  currentPage,
  setCurrentPage,
  itemsPerPage,
  setItemsPerPage,
  filteredBills,
  indexOfFirstItem,
  indexOfLastItem,
  setPaymentModal,
  toggleDisputed,
  setPreviewModal
}: any) {
  return (
    <div className="bg-white border border-slate-200 shadow-sm overflow-hidden rounded-xl flex-1 flex flex-col no-print transition-all">
      
      {/* Table Toolbar */}
      <div className="p-3 flex items-center justify-between gap-4 bg-white/80 border-b border-slate-200 overflow-x-auto flex-shrink-0">
        {/* Left Side: Tabs + Search Group */}
        <div className="flex items-center gap-4 flex-shrink-0">
          <div className="relative flex items-center">
            <select 
              value={subTab} 
              onChange={(e) => setSubTab(e.target.value)}
              className="appearance-none bg-white border border-slate-200 shadow-sm rounded-lg pl-4 pr-10 py-2 text-[10px] font-bold text-[#223149] uppercase tracking-widest outline-none focus:border-[#496ca8] cursor-pointer hover:bg-slate-50 transition-colors"
            >
              <option value="all">All Bills</option>
              <option value="Unpaid">Unpaid</option>
              <option value="Overdue">Overdue</option>
              <option value="Disputed">Disputed</option>
              <option value="Exception">Exception</option>
            </select>
            <ChevronDown size={14} className="absolute right-3 pointer-events-none text-[#7693a6]" />
          </div>

          <div className="relative w-64 flex items-center bg-white border border-slate-200 shadow-sm rounded-lg px-3 py-1.5">
            <Search className="text-[#7693a6]" size={16} />
            <input 
              type="text" 
              placeholder="Search bill or vendor..." 
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
            title="Print AP Report"
          >
            <Printer size={16} /> PRINT AP REPORT
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
          <table className="w-full text-left border-collapse min-w-max">
            <thead className="bg-gradient-to-r from-[#223149] to-[#3c5d7d] text-white sticky top-0 z-10">
              <tr className="border-b-4 border-[#df8a5d]">
                <th className="px-4 py-4 text-[10px] font-bold uppercase tracking-widest whitespace-nowrap border-r border-white/20 w-[1%]">DATES</th>
                <th className="px-4 py-4 text-[10px] font-bold uppercase tracking-widest whitespace-nowrap border-r border-white/20 w-[1%]">DOCUMENT INFO</th>
                <th className="px-4 py-4 text-[10px] font-bold uppercase tracking-widest whitespace-nowrap border-r border-white/20 w-[1%]">VENDOR DETAILS</th>
                <th className="px-4 py-4 text-[10px] font-bold uppercase tracking-widest text-right whitespace-nowrap border-r border-white/20 w-[1%]">AMOUNT (฿)</th>
                <th className="px-4 py-4 text-[10px] font-bold text-[#eee5ca] uppercase tracking-widest text-center whitespace-nowrap border-r border-white/20 w-[1%]">STATUS & RISK</th>
                <th className="px-4 py-4 text-[10px] font-bold uppercase tracking-widest text-center whitespace-nowrap w-[1%] border-r border-white/20">ACTION</th>
                <th className="w-full"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {currentItems.length > 0 ? currentItems?.map((bill: any) => (
                <tr key={bill.id} className={`transition-colors hover:bg-slate-50 ${bill.isDisputed || bill.exceptionReason ? 'bg-red-50/30' : ''}`}>
                  {/* DATES */}
                  <td className="px-4 py-3 align-top border-r border-slate-100 whitespace-nowrap w-[1%]">
                    <div className="space-y-1">
                      <p className="flex items-center gap-1.5 text-[11px]" title="Received Date">
                        <span className="text-slate-400 font-semibold w-12">Rcvd:</span> 
                        <span className="font-mono text-[#223149] font-bold">{formatDate(bill.receivedDate)}</span>
                      </p>
                      <p className="flex items-center gap-1.5 text-[11px]" title="Due Date">
                        <span className="text-slate-400 font-semibold w-12">Due:</span> 
                        <span className={`font-mono font-bold ${isOverdue(bill) ? 'text-[#ce5a43]' : 'text-[#223149]'}`}>{formatDate(bill.dueDate)}</span>
                      </p>
                      {bill.approvedDate && (
                        <p className="flex items-center gap-1.5 text-[11px]" title="Approved Date">
                          <span className="text-slate-400 font-semibold w-12">Apprv:</span> 
                          <span className="font-mono text-[#d9b343] font-bold">{formatDate(bill.approvedDate)}</span>
                        </p>
                      )}
                      {bill.payDate && (
                        <p className="flex items-center gap-1.5 text-[11px]" title="Paid Date">
                          <span className="text-slate-400 font-semibold w-12">Paid:</span> 
                          <span className="font-mono text-[#7fa85a] font-bold">{formatDate(bill.payDate)}</span>
                        </p>
                      )}
                    </div>
                  </td>

                  {/* DOCUMENT INFO */}
                  <td className="px-4 py-3 align-top border-r border-slate-100 w-[1%]">
                    <div className="space-y-1">
                      <p className="flex items-center gap-2">
                        <FileText size={14} className="text-[#496ca8]"/>
                        <span className="font-mono font-bold text-[#223149] text-sm">{bill.billNo}</span>
                      </p>
                      {bill.poRef && (
                        <p className="flex items-center gap-2 text-[10px]">
                          <Receipt size={12} className="text-slate-400"/>
                          <span className="font-mono text-[#7693a6]">{bill.poRef}</span>
                        </p>
                      )}
                    </div>
                  </td>

                  {/* VENDOR DETAILS */}
                  <td className="px-4 py-3 align-top border-r border-slate-100 w-[1%]">
                    <p className="font-bold text-[#223149] text-sm">{bill.vendor}</p>
                    <span className="px-1.5 py-0.5 bg-slate-100 text-slate-500 rounded text-[9px] font-bold tracking-widest uppercase mt-1 inline-block">{bill.vendorType}</span>
                  </td>

                  {/* AMOUNT */}
                  <td className="px-4 py-3 align-top border-r border-slate-100 text-right w-[1%]">
                     <p className="font-mono font-bold text-[#7693a6] text-[10px]">Total: ฿{bill.amount?.toLocaleString()}</p>
                     <p className="font-mono font-bold text-[#7fa85a] text-[10px]">Paid: -฿{bill.paid?.toLocaleString()}</p>
                     <p className="font-mono font-black text-[#223149] text-sm mt-1">Bal: ฿{bill.balance?.toLocaleString()}</p>
                  </td>

                  {/* STATUS & RISK */}
                  <td className="px-4 py-3 align-top border-r border-slate-100 text-center w-[1%]">
                    <div className="flex flex-col items-center gap-1.5">
                      <span className={`px-2 py-1 rounded text-[9px] font-bold uppercase tracking-wider whitespace-nowrap
                        ${bill.status === 'Paid' ? 'bg-[#7fa85a]/10 text-[#7fa85a]' : 
                          bill.status === 'Overdue' ? 'bg-[#ce5a43]/10 text-[#ce5a43]' :
                          bill.status === 'Disputed' ? 'bg-[#933b5b]/10 text-[#933b5b]' :
                          'bg-slate-100 text-slate-500'}`}>
                        {bill.status}
                      </span>
                      {bill.exceptionReason && (
                        <span className="text-[9px] text-[#ce5a43] font-bold flex items-center gap-0.5 bg-rose-50 px-1.5 py-0.5 rounded" title={bill.exceptionReason}>
                          <AlertTriangle size={10}/> Exception
                        </span>
                      )}
                    </div>
                  </td>

                  {/* ACTION */}
                  <td className="px-4 py-3 align-top border-r border-slate-100 text-center w-[1%]">
                    <div className="flex flex-col gap-1.5">
                      {(bill.status === 'Approved' || bill.status === 'Waiting Payment' || bill.status === 'Overdue') && (
                        <button onClick={() => setPaymentModal(bill)} className={`text-white text-[9px] px-3 py-1.5 rounded-lg font-bold uppercase tracking-widest transition-colors flex items-center justify-center gap-1 ${bill.status === 'Overdue' ? 'bg-[#ce5a43] hover:bg-[#c4343b]' : 'bg-[#223149] hover:bg-[#223149]/90'}`}>
                          <CreditCard size={10}/> Pay
                        </button>
                      )}
                      <button onClick={() => toggleDisputed(bill.id)} className={`text-[9px] px-2 py-1.5 rounded-lg font-bold uppercase tracking-widest transition-colors flex items-center justify-center gap-1 border ${bill.isDisputed ? 'bg-[#933b5b] text-white border-[#933b5b]' : 'bg-white text-[#7693a6] border-slate-200 hover:bg-slate-50'}`}>
                        {bill.isDisputed ? 'Release' : 'Dispute'}
                      </button>
                    </div>
                  </td>
                  <td className="w-full"></td>
                </tr>
              )) : (
                <tr><td colSpan={7} className="text-center py-8 text-[#7693a6] font-bold">No records found.</td></tr>
              )}
            </tbody>
          </table>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 0 && (
        <div className="flex items-center justify-between px-4 py-3 bg-slate-50 border-t border-slate-200 sm:px-6 shrink-0">
          <div className="flex items-center gap-2 text-xs text-[#7693a6] font-bold uppercase tracking-widest">
            <span>Show</span>
            <select value={itemsPerPage} onChange={(e) => setItemsPerPage(Number(e.target.value))} className="bg-white border border-slate-300 rounded-md px-2 py-1 outline-none text-[#223149]">
              <option value={10}>10</option>
              <option value={20}>20</option>
              <option value={50}>50</option>
            </select>
          </div>
          <div className="flex gap-4 items-center">
            <p className="text-xs text-[#7693a6] font-semibold hidden sm:block">Showing <span className="font-bold text-[#223149]">{indexOfFirstItem + 1}</span> to <span className="font-bold text-[#223149]">{Math.min(indexOfLastItem, filteredBills.length)}</span> of <span className="font-bold text-[#223149]">{filteredBills.length}</span></p>
            <nav className="isolate inline-flex -space-x-px rounded-md shadow-sm">
              <button onClick={() => setCurrentPage((prev: number) => Math.max(prev - 1, 1))} disabled={currentPage === 1} className="relative inline-flex items-center rounded-l-md px-2 py-1.5 text-[#7693a6] bg-white ring-1 ring-inset ring-[#cbd5e1] hover:bg-slate-50 disabled:opacity-50"><ChevronLeft size={16}/></button>
              <button onClick={() => setCurrentPage((prev: number) => Math.min(prev + 1, totalPages))} disabled={currentPage === totalPages} className="relative inline-flex items-center rounded-r-md px-2 py-1.5 text-[#7693a6] bg-white ring-1 ring-inset ring-[#cbd5e1] hover:bg-slate-50 disabled:opacity-50"><ChevronRight size={16}/></button>
            </nav>
          </div>
        </div>
      )}
    </div>
  );
}

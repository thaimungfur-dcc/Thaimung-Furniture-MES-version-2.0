import React from 'react';
import { Printer, X } from 'lucide-react';
import { formatDate, isOverdue } from '../utils';
import { DraggableWrapper } from "../../../components/shared/DraggableWrapper";

export default function PrintPreviewModal({ 
  previewModal, 
  setPreviewModal, 
  executePrint, 
  filteredBills, 
  totalPayable, 
  totalOverdueAmount, 
  totalDisputedAmount,
  subTab
}: any) {
  if (previewModal !== 'print') return null;

  return (
    <div className="fixed inset-0 bg-[#223149]/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 print:p-0 no-print">
      
          <DraggableWrapper>
                <div className="bg-white rounded-2xl w-full max-w-[1100px] shadow-2xl overflow-hidden flex flex-col animate-in fade-in zoom-in duration-200 max-h-[90vh] print:max-h-none print:shadow-none print:rounded-none">
                  <div className={`px-6 py-2.5 flex justify-between items-center text-white no-print bg-[#df8a5d]`}>
                    <h2 className="text-lg font-semibold uppercase tracking-widest flex items-center gap-2">
                      <Printer size={20} /> Print AP Database Report
                    </h2>
                    <button onClick={() => setPreviewModal(null)} className="hover:bg-black/20 p-1.5 rounded-lg transition-colors">
                      <X size={20} />
                    </button>
                  </div>
                  
                  <div className="p-4 md:p-4 sm:p-5 overflow-y-auto flex-1 bg-[#eee5ca] flex justify-center print:bg-white print:overflow-visible print:p-0">
                    <div className="bg-white p-4 sm:p-5 md:p-5 shadow-md w-full max-w-[1123px] min-h-[794px] h-max flex flex-col print:shadow-none print:max-w-none print:w-auto print:min-h-0 print:p-0 mx-auto print:mx-0 text-slate-800">
                      
                      <div className="flex flex-col md:flex-row justify-between items-start border-b-2 border-[#223149] pb-4 mb-4 text-[#223149] gap-4">
                        <div className="space-y-0.5">
                          <h2 className="text-lg md:text-xl font-black tracking-tight">บริษัท ไทยมั่งเฟอร์นิเจอร์ จํากัด</h2>
                          <p className="text-sm font-bold text-[#496ca8]">Thaimung Furniture Co., Ltd.</p>
                          <p className="text-[10px] font-bold mt-1 pt-1 text-[#7693a6]">เลขประจำตัวผู้เสียภาษี/TAX ID : 0105546077645</p>
                        </div>
                        <div className="md:text-right text-[10px] space-y-1 md:max-w-[400px] font-semibold text-[#3c5d7d] leading-relaxed">
                          <p>สำนักงานใหญ่ : เลขที่ 22/88 หมู่ที่ 3 ตําบลท่าเสา อําเภอกระทุ่มแบน จังหวัดสมุทรสาคร 74110</p>
                          <p>Head Office : 22/88 Moo 3, Tha Sao, Krathum Baen, Samut Sakhon 74110</p>
                          <div className="flex flex-col md:flex-row md:justify-end gap-1 md:gap-4 mt-1 font-bold">
                            <p className="text-[#ce5a43]">TEL. 082-569-5654, 091-516-5999</p>
                            <p className="text-[#496ca8]">E-mail : thaimungfurniture.dcc@gmail.com</p>
                          </div>
                        </div>
                      </div>

                      <div className="text-center mb-6">
                        <h3 className="text-lg font-black text-[#223149] uppercase tracking-widest">Accounts Payable Detailed Report</h3>
                        <p className="text-[#7693a6] font-bold mt-1 text-[10px]">Filter: {subTab.toUpperCase()} | Print Date: {new Date().toLocaleDateString('en-GB')}</p>
                      </div>

                      {/* Summary Row */}
                      <div className="grid grid-cols-3 gap-4 mb-6">
                        <div className="border border-slate-200 p-3 bg-slate-50 rounded text-center" style={{ WebkitPrintColorAdjust: 'exact' }}>
                          <p className="text-[10px] font-bold text-[#7693a6] uppercase tracking-widest mb-1">Total Payable</p>
                          <p className="text-lg font-black text-[#223149] font-mono">฿{totalPayable?.toLocaleString()}</p>
                        </div>
                        <div className="border border-[#ce5a43]/20 p-3 bg-[#ce5a43]/5 rounded text-center" style={{ WebkitPrintColorAdjust: 'exact' }}>
                          <p className="text-[10px] font-bold text-[#ce5a43] uppercase tracking-widest mb-1">Total Overdue</p>
                          <p className="text-lg font-black text-[#ce5a43] font-mono">฿{totalOverdueAmount?.toLocaleString()}</p>
                        </div>
                        <div className="border border-[#933b5b]/20 p-3 bg-[#933b5b]/5 rounded text-center" style={{ WebkitPrintColorAdjust: 'exact' }}>
                          <p className="text-[10px] font-bold text-[#933b5b] uppercase tracking-widest mb-1">Total Disputed</p>
                          <p className="text-lg font-black text-[#933b5b] font-mono">฿{totalDisputedAmount?.toLocaleString()}</p>
                        </div>
                      </div>
                      
                      <div className="flex-1 text-[9px]">
                        <table className="w-full text-left border-b border-slate-200">
                          <thead className="bg-[#f5f0e9] border-y border-slate-200" style={{ WebkitPrintColorAdjust: 'exact' }}>
                            <tr>
                              <th className="px-2 py-1.5 font-bold text-[#223149] uppercase">Issue Date</th>
                              <th className="px-2 py-1.5 font-bold text-[#223149] uppercase">Due Date</th>
                              <th className="px-2 py-1.5 font-bold text-[#223149] uppercase">Bill No.</th>
                              <th className="px-2 py-1.5 font-bold text-[#223149] uppercase">Vendor</th>
                              <th className="px-2 py-1.5 font-bold text-[#223149] uppercase text-right">Term (Days)</th>
                              <th className="px-2 py-1.5 font-bold text-[#223149] uppercase text-center">Risk</th>
                              <th className="px-2 py-1.5 font-bold text-[#223149] uppercase text-right">Total Amt.</th>
                              <th className="px-2 py-1.5 font-bold text-[#223149] uppercase text-right">Paid</th>
                              <th className="px-2 py-1.5 font-bold text-[#223149] uppercase text-right">Balance</th>
                              <th className="px-2 py-1.5 font-bold text-[#223149] uppercase text-center">Status</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-100">
                            {filteredBills.length > 0 ? (
                              filteredBills?.map((bill: any, i: number) => (
                                <tr key={i} className={bill.isDisputed ? 'bg-red-50/50' : ''} style={{ WebkitPrintColorAdjust: 'exact' }}>
                                  <td className="px-2 py-1.5 font-mono">{formatDate(bill.issueDate)}</td>
                                  <td className={`px-2 py-1.5 font-mono ${isOverdue(bill) ? 'text-[#ce5a43] font-bold' : ''}`}>{formatDate(bill.dueDate)}</td>
                                  <td className="px-2 py-1.5 font-bold font-mono">{bill.billNo}</td>
                                  <td className="px-2 py-1.5 font-medium">{bill.vendor}</td>
                                  <td className="px-2 py-1.5 font-mono text-right">{bill.creditTerm}</td>
                                  <td className="px-2 py-1.5 font-bold text-center">{bill.risk}</td>
                                  <td className="px-2 py-1.5 font-mono text-right text-[#7693a6]">{(bill.amount)?.toLocaleString()}</td>
                                  <td className="px-2 py-1.5 font-mono text-right text-[#7fa85a]">{(bill.paid)?.toLocaleString()}</td>
                                  <td className={`px-2 py-1.5 font-mono font-bold text-right ${bill.isDisputed ? 'text-[#933b5b]' : 'text-[#223149]'}`}>{(bill.balance)?.toLocaleString()}</td>
                                  <td className={`px-2 py-1.5 font-bold text-center uppercase tracking-wider text-[8px]
                          ${bill.status === 'Paid' ? 'text-[#7fa85a]' : 
                                      bill.status === 'Disputed' ? 'text-[#933b5b]' :
                                      bill.status === 'Overdue' ? 'text-[#ce5a43]' : 'text-[#7693a6]'}
                        `}>{bill.status}</td>
                                </tr>
                              ))
                            ) : (
                              <tr><td colSpan={10} className="text-center py-3 text-[#7693a6] italic">No records found.</td></tr>
                            )}
                          </tbody>
                          <tfoot className="bg-[#f5f0e9] font-bold border-t border-slate-200" style={{ WebkitPrintColorAdjust: 'exact' }}>
                            <tr>
                              <td colSpan={6} className="px-2 py-2 text-right uppercase text-[#223149]">TOTAL FILTERED:</td>
                              <td className="px-2 py-2 text-right font-mono">{filteredBills?.reduce((a:any,b:any)=>a+b.amount,0)?.toLocaleString()}</td>
                              <td className="px-2 py-2 text-right text-[#7fa85a] font-mono">{filteredBills?.reduce((a:any,b:any)=>a+b.paid,0)?.toLocaleString()}</td>
                              <td className="px-2 py-2 text-right text-[#223149] font-mono">{filteredBills?.reduce((a:any,b:any)=>a+b.balance,0)?.toLocaleString()}</td>
                              <td></td>
                            </tr>
                          </tfoot>
                        </table>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 bg-white border-t border-slate-100 flex justify-end gap-3 rounded-b-2xl no-print">
                    <button onClick={() => setPreviewModal(null)} className="px-6 py-2.5 rounded-lg font-bold border border-slate-200 text-[#7693a6] hover:bg-slate-50 transition-colors uppercase tracking-wider">Cancel</button>
                    <button 
                      onClick={executePrint} 
                      className="px-6 py-2.5 rounded-lg font-bold text-white shadow-md hover:opacity-90 transition-all uppercase tracking-wider flex items-center gap-2 bg-[#df8a5d]"
                    >
                      <Printer size={16}/> Confirm Print
                    </button>
                  </div>
                </div>
              </DraggableWrapper>

    </div>
  );
}

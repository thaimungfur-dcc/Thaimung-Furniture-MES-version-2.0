import React from 'react';
import { X, Printer, FileCheck } from 'lucide-react';
import { calculateTotals, formatDate } from '../utils';
import { Order } from '../types';
import { DraggableWrapper } from "../../../components/shared/DraggableWrapper";

interface PreviewModalProps {
  previewModal: { type: string; data?: Order } | null;
  setPreviewModal: (modal: any) => void;
  filteredOrders: Order[];
}

export default function PreviewModal({
  previewModal,
  setPreviewModal,
  filteredOrders
}: PreviewModalProps) {
  if (!previewModal) return null;

  const executePrint = () => {
    setTimeout(() => window.print(), 100);
  };

  return (
    <div className="fixed inset-0 bg-[#111f42]/70 backdrop-blur-md z-[120] flex items-center justify-center p-4 print:p-0 no-print">
      
          <DraggableWrapper>
                <div className="bg-white rounded-[2.5rem] w-full max-w-4xl h-[90vh] flex flex-col print:h-auto overflow-hidden shadow-2xl">
                  <div className="p-4 sm:p-5 border-b flex justify-between items-center no-print bg-[#ab8a3b] text-white shrink-0">
                    <h2 className="font-normal uppercase tracking-widest text-sm flex items-center gap-2"><Printer size={18}/> Preview Sales Order</h2>
                    <button onClick={()=>setPreviewModal(null)} className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors"><X size={20}/></button>
                  </div>
                  
                  <div className="flex-1 overflow-y-auto p-4 md:p-5 bg-slate-100 print:bg-white flex justify-center print:p-0">
                    <div className="bg-white p-5 w-full max-w-[794px] min-h-[1123px] h-max flex flex-col text-[11px] print:shadow-none shadow-xl border relative">
                      
                      <div className="border-b-2 border-[#111f42] pb-4 mb-4 flex justify-between items-start shrink-0">
                        <div>
                          <h2 className="text-base font-black text-[#111f42] tracking-tight">บริษัท ไทยมั่งเฟอร์นิเจอร์ จํากัด</h2>
                          <p className="text-[11px] font-bold text-slate-500 mt-0.5">Thaimung Furniture Co., Ltd.</p>
                          <div className="mt-2 text-[10px] font-medium space-y-0.5 text-slate-600">
                            <p>TAX ID : 0105546077645</p>
                          </div>
                        </div>
                        <div className="text-right text-[10px] text-slate-600 font-medium space-y-1">
                          <p>สำนักงานใหญ่ : เลขที่ 22/88 หมู่ที่ 3 ตําบลท่าเสา อําเภอกระทุ่มแบน จังหวัดสมุทรสาคร 74110</p>
                          <p>Head Office : 22/88 Moo 3, Tha Sao, Krathum Baen, Samut Sakhon 74110</p>
                          <p className="mt-2">TEL. 082-569-5654, 091-516-5999</p>
                          <p>E-mail : thaimungfurniture.dcc@gmail.com</p>
                        </div>
                      </div>

                      <div className="flex items-center justify-between mb-4 shrink-0">
                        <div className="w-1/3">
                          <p className="text-[11px] font-normal text-slate-400 uppercase tracking-widest">SALES DEPARTMENT</p>
                        </div>
                        <div className="w-1/3 text-center">
                          <h2 className="text-xl font-bold text-[#E3624A] uppercase tracking-[0.2em]">SALES ORDER</h2>
                          <p className="text-[9px] font-medium text-slate-500 mt-0.5">ใบสั่งขาย</p>
                        </div>
                        <div className="w-1/3 text-right">
                          <div className="inline-block text-left">
                            <p className="text-[10px] font-normal text-slate-500 uppercase tracking-widest mb-1 flex justify-between gap-4">
                              <span>SO NO:</span> <span className="text-[#111f42] font-mono font-bold">{previewModal.type === 'single' && previewModal.data ? previewModal.data.soNumber : 'LIST-REPORT'}</span>
                            </p>
                            <p className="text-[10px] font-normal text-slate-500 uppercase tracking-widest flex justify-between gap-4">
                              <span>DATE:</span> <span className="text-[#111f42] font-mono font-bold">{previewModal.type === 'single' && previewModal.data ? formatDate(previewModal.data.date) : formatDate(new Date().toISOString())}</span>
                            </p>
                          </div>
                        </div>
                      </div>

                      {previewModal.type === 'single' && previewModal.data ? (
                        <>
                          <div className="grid grid-cols-2 gap-4 mb-4 shrink-0">
                            <div className="border border-slate-200 rounded-md p-3 bg-white">
                              <p className="text-[9px] font-normal text-slate-400 uppercase tracking-widest mb-1.5">CUSTOMER / ลูกค้า</p>
                              <h3 className="text-sm font-bold text-[#111f42] mb-0.5">{previewModal.data.customer}</h3>
                              <p className="text-[10px] text-slate-500 font-medium">Head Office / สำนักงานใหญ่</p>
                            </div>
                            <div className="border border-slate-200 rounded-md p-3 bg-white">
                              <p className="text-[9px] font-normal text-slate-400 uppercase tracking-widest mb-1.5">SHIP TO / สถานที่จัดส่ง</p>
                              <h3 className="text-sm font-bold text-[#111f42] mb-0.5">{previewModal.data.customer}</h3>
                              <p className="text-[10px] text-slate-500 font-medium">Delivery Address / ที่อยู่จัดส่ง</p>
                            </div>
                          </div>

                          <div className="grid grid-cols-4 gap-4 py-2.5 mb-4 text-center bg-slate-50 rounded-md shrink-0 border border-slate-100">
                            <div>
                              <p className="text-[8px] font-normal text-slate-400 uppercase tracking-widest mb-1">PAYMENT TERM</p>
                              <p className="text-[11px] font-bold text-[#111f42]">Credit 30 Days</p>
                            </div>
                            <div>
                              <p className="text-[8px] font-normal text-slate-400 uppercase tracking-widest mb-1">STATUS</p>
                              <p className="text-[11px] font-bold text-[#E3624A]">{previewModal.data.status}</p>
                            </div>
                            <div>
                              <p className="text-[8px] font-normal text-slate-400 uppercase tracking-widest mb-1">SALES REP</p>
                              <p className="text-[11px] font-bold text-[#111f42]">{previewModal.data.salesPerson}</p>
                            </div>
                            <div>
                              <p className="text-[8px] font-normal text-slate-400 uppercase tracking-widest mb-1">SHIPPING METHOD</p>
                              <p className="text-[11px] font-bold text-[#111f42]">By Truck</p>
                            </div>
                          </div>

                          <div className="flex-1">
                            <table className="w-full text-left">
                              <thead className="bg-[#111f42] text-white">
                                <tr>
                                  <th className="py-2 px-3 font-normal text-[9px] uppercase text-center w-10 rounded-tl-sm">#</th>
                                  <th className="py-2 px-3 font-normal text-[9px] uppercase">Items & Delivery Schedule</th>
                                  <th className="py-2 px-3 font-normal text-[9px] uppercase text-center w-20">Qty</th>
                                  <th className="py-2 px-3 font-normal text-[9px] uppercase text-right w-24">Unit Price</th>
                                  <th className="py-2 px-3 font-normal text-[9px] uppercase text-right w-24 rounded-tr-sm">Amount</th>
                                </tr>
                              </thead>
                              <tbody className="divide-y divide-slate-100 border-b-2 border-[#111f42]">
                                {previewModal.data.items.map((item, idx) => (
                                  <React.Fragment key={idx}>
                                    <tr className="bg-white">
                                      <td className="py-2 px-3 text-center text-slate-500 font-medium align-top">{idx + 1}</td>
                                      <td className="py-2 px-3 font-bold text-[#111f42] align-top">
                                        {item.sku} - {item.name}
                                        {item.deliveries && item.deliveries.length > 0 && (
                                          <div className="mt-1 pl-2 border-l-2 border-slate-200 space-y-0.5">
                                            <p className="text-[8px] font-normal text-slate-400 uppercase tracking-widest">Delivery Schedule:</p>
                                            {item.deliveries.map((del, dIdx) => (
                                              <div key={dIdx} className="text-[9px] text-slate-600 flex gap-4 font-normal">
                                                <span>Round {del.round}:</span>
                                                <span className="font-mono text-[#ab8a3b]">{formatDate(del.date)}</span>
                                                <span className="font-medium">({del.qty} Units)</span>
                                              </div>
                                            ))}
                                          </div>
                                        )}
                                      </td>
                                      <td className="py-2 px-3 text-center font-bold text-slate-600 align-top">{item.qty}</td>
                                      <td className="py-2 px-3 text-right font-mono text-slate-600 align-top">฿{item.price?.toLocaleString()}</td>
                                      <td className="py-2 px-3 text-right font-mono font-bold text-[#111f42] align-top">฿{((item.qty * item.price) - (item.discount || 0))?.toLocaleString()}</td>
                                    </tr>
                                  </React.Fragment>
                                ))}
                              </tbody>
                            </table>
                          </div>

                          <div className="flex justify-end mt-4 shrink-0">
                            <div className="w-64 space-y-2 bg-slate-50 p-4 rounded-md border border-slate-100">
                              {(() => {
                                const totals = calculateTotals(previewModal.data!);
                                return (
                                  <>
                                    <div className="flex justify-between text-[10px] text-slate-500 font-medium">
                                      <span className="uppercase tracking-widest font-normal">Subtotal</span><span className="font-mono text-[#111f42] font-bold">฿{totals.subtotal?.toLocaleString()}</span>
                                    </div>
                                    <div className="flex justify-between text-[10px] text-[#E3624A] font-medium">
                                      <span className="uppercase tracking-widest font-normal">Discount</span><span className="font-mono font-bold">-฿{totals.totalDiscount?.toLocaleString()}</span>
                                    </div>
                                    <div className="flex justify-between text-[10px] text-slate-500 font-medium">
                                      <span className="uppercase tracking-widest font-normal">VAT ({previewModal.data.vatRate}%)</span><span className="font-mono text-[#111f42] font-bold">฿{totals.vatAmount?.toLocaleString()}</span>
                                    </div>
                                    <div className="flex justify-between text-xs font-bold text-[#111f42] border-t border-slate-300 pt-2 mt-2">
                                      <span className="uppercase tracking-widest font-normal">Grand Total</span><span className="font-mono text-[#E3624A] text-sm font-bold">฿{totals.grandTotal?.toLocaleString()}</span>
                                    </div>
                                  </>
                                );
                              })()}
                            </div>
                          </div>

                          <div className="mt-auto grid grid-cols-3 gap-6 pt-10 pb-4 shrink-0">
                            <div className="border border-slate-200 rounded flex flex-col text-center bg-white">
                              <div className="py-2 border-b border-slate-200 text-[#111f42] font-bold text-[8px] uppercase tracking-widest">Requested By</div>
                              <div className="py-6 flex-1 flex items-center justify-center text-slate-300 italic text-[9px]">Signature</div>
                              <div className="py-2 border-t border-slate-200 text-[#111f42] font-bold text-[9px]">(คุณสมชาย ใจดี)</div>
                            </div>
                            <div className="border border-slate-200 rounded flex flex-col text-center bg-white">
                              <div className="py-2 border-b border-slate-200 text-[#111f42] font-bold text-[8px] uppercase tracking-widest">Checked By</div>
                              <div className="py-6 flex-1 flex items-center justify-center text-slate-300 italic text-[9px]">Signature</div>
                              <div className="py-2 border-t border-slate-200 text-[#111f42] font-bold text-[9px]">(Dept. Manager)</div>
                            </div>
                            <div className="border-2 border-[#111f42] rounded flex flex-col text-center bg-white overflow-hidden">
                              <div className="py-2 bg-[#111f42] text-white font-bold text-[8px] uppercase tracking-widest">Approved By</div>
                              <div className="py-6 flex-1 flex items-center justify-center text-slate-300 italic text-[9px] relative">
                                <div className="absolute inset-0 flex items-center justify-center opacity-20 pointer-events-none">
                                  <FileCheck size={28} className="text-[#6b7556]" />
                                </div>
                                <span className="relative z-10">Authorized Signature</span>
                              </div>
                              <div className="py-2 border-t border-slate-200 text-[#111f42] font-bold text-[9px]">(Management)</div>
                            </div>
                          </div>

                        </>
                      ) : (
                        <>
                          <table className="w-full text-left">
                            <thead className="bg-[#111f42] text-white">
                              <tr>
                                <th className="py-2 px-3 font-normal text-[9px] uppercase tracking-widest rounded-tl-sm">Date</th>
                                <th className="py-2 px-3 font-normal text-[9px] uppercase tracking-widest">SO Number</th>
                                <th className="py-2 px-3 font-normal text-[9px] uppercase tracking-widest">Customer Name</th>
                                <th className="py-2 px-3 font-normal text-[9px] uppercase tracking-widest text-right rounded-tr-sm">Amount (THB)</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 border-b-2 border-[#111f42]">
                              {filteredOrders.map((o, i)=>(
                                <tr key={i}>
                                  <td className="py-2 px-3 font-medium text-slate-500">{formatDate(o.date)}</td>
                                  <td className="py-2 px-3 font-bold text-[#111f42] font-mono">{o.soNumber}</td>
                                  <td className="py-2 px-3 font-medium text-slate-700">{o.customer}</td>
                                  <td className="py-2 px-3 text-right font-mono font-bold text-[#E3624A]">฿{(o.total || 0)?.toLocaleString()}</td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                          <div className="mt-auto pt-6 flex justify-end items-baseline gap-4">
                            <span className="text-slate-400 font-normal uppercase text-xs">TOTAL VALUE:</span>
                            <span className="text-2xl font-bold text-[#111f42]">฿{filteredOrders.reduce((a,b)=>a+(b.total||0),0)?.toLocaleString()}</span>
                          </div>
                        </>
                      )}

                    </div>
                  </div>
                  
                  <div className="p-4 bg-white border-t flex justify-end gap-3 no-print shrink-0 rounded-b-[2.5rem]">
                    <button onClick={() => setPreviewModal(null)} className="px-6 py-2.5 border border-slate-200 text-slate-500 rounded-xl font-normal text-[10px] uppercase tracking-widest hover:bg-slate-50 transition-all">Cancel</button>
                    <button onClick={executePrint} className="px-6 py-2.5 bg-[#ab8a3b] hover:bg-[#9c7d34] text-white rounded-xl font-normal text-[10px] uppercase tracking-widest shadow-md flex items-center gap-2 transition-all"><Printer size={14}/> Print {previewModal.type === 'single' ? 'SO' : 'Report'}</button>
                  </div>
                </div>
              </DraggableWrapper>

    </div>
  );
}

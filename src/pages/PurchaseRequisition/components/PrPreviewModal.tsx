import React from 'react';
import { X, Printer, FileSignature } from 'lucide-react';
import { DraggableWrapper } from "../../../components/shared/DraggableWrapper";

interface PrPreviewModalProps {
  previewModal: boolean;
  setPreviewModal: (open: boolean) => void;
  selectedPR: any;
  formatDate: (date: string) => string;
  formatCurrency: (amount: number) => string;
  executePrint: () => void;
}

const PrPreviewModal: React.FC<PrPreviewModalProps> = ({
  previewModal,
  setPreviewModal,
  selectedPR,
  formatDate,
  formatCurrency,
  executePrint
}) => {
  if (!previewModal || !selectedPR) return null;

  return (
    <div className="fixed inset-0 bg-[#111f42]/60 backdrop-blur-sm z-[110] flex items-center justify-center p-4 no-print">
      
          <DraggableWrapper>
                <div className="bg-white rounded-2xl w-full max-w-4xl shadow-2xl overflow-hidden flex flex-col animate-in zoom-in duration-200 max-h-[95vh]">
                  <div className="px-6 py-2.5 flex justify-between items-center bg-[#ab8a3b] text-white shrink-0">
                    <h2 className="text-lg font-semibold uppercase tracking-widest flex items-center gap-2"><Printer size={20} /> Preview PR Document</h2>
                    <button onClick={() => setPreviewModal(false)}><X size={24} /></button>
                  </div>
                  
                  <div className="flex-1 overflow-y-auto p-4 bg-slate-200 flex justify-center print:p-0 print:bg-white custom-scrollbar">
                    <div className="bg-white p-4 sm:p-5 shadow-md w-full max-w-[794px] min-h-[1123px] h-max flex flex-col print:shadow-none print:p-0 relative">
                      <div className="flex flex-col md:flex-row justify-between items-start pb-4 mb-4 gap-4">
                        <div className="space-y-0.5">
                          <h2 className="text-[14px] font-black tracking-tight text-[#111f42]">บริษัท ไทยมั่งเฟอร์นิเจอร์ จํากัด</h2>
                          <p className="text-[10px] font-semibold font-mono text-[#111f42]">Thaimung Furniture Co., Ltd.</p>
                          <p className="text-[9px] font-bold mt-1 text-[#111f42]">TAX ID : 0105546077645</p>
                        </div>
                        <div className="text-right text-[9px] font-medium leading-relaxed text-[#111f42] w-[55%] ml-auto">
                          <p>สำนักงานใหญ่ : เลขที่ 22/88 หมู่ที่ 3 ตําบลท่าเสา อําเภอกระทุ่มแบน จังหวัดสมุทรสาคร 74110</p>
                          <p>Head Office : 22/88 Moo 3, Tha Sao, Krathum Baen, Samut Sakhon 74110</p>
                          <div className="flex justify-end gap-3 mt-1">
                            <span>TEL. 082-569-5654, 091-516-5999</span>
                            <span>E-mail : thaimungfurniture.dcc@gmail.com</span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="border-t-[3px] border-[#111f42] pt-5 mb-6 relative flex items-start justify-between">
                        <div className="w-1/4">
                          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Procurement Department</p>
                        </div>
                        
                        <div className="flex-1 text-center flex flex-col items-center justify-center">
                          <h3 className="text-xl font-black text-[#E3624A] uppercase tracking-[0.15em] whitespace-nowrap">PURCHASE REQUISITION</h3>
                          <p className="text-[11px] font-bold mt-0.5 text-[#111f42]">ใบขออนุมัติสั่งซื้อ</p>
                        </div>

                        <div className="w-1/4 flex justify-end">
                          <div className="text-[10px] font-mono flex flex-col items-end gap-1">
                            <div className="flex gap-3"><span className="font-bold text-slate-500 w-16 text-right">PR NO:</span> <span className="font-black text-[#111f42] w-24 text-left">{selectedPR.id}</span></div>
                            <div className="flex gap-3"><span className="font-bold text-slate-500 w-16 text-right">DATE:</span> <span className="font-bold text-[#111f42] w-24 text-left">{formatDate(selectedPR.date)}</span></div>
                          </div>
                        </div>
                      </div>

                      <div className="mb-6 border border-slate-200 rounded-xl p-5 bg-slate-50/50">
                        <div className="grid grid-cols-2 gap-y-4 gap-x-6 text-[12px]">
                          <div className="space-y-1">
                            <span className="text-slate-400 font-bold uppercase text-[9px] tracking-widest">Requester Name (ผู้ขอซื้อ)</span>
                            <p className="font-black text-[#111f42] text-[13px]">{selectedPR.requester}</p>
                          </div>
                          <div className="space-y-1">
                            <span className="text-slate-400 font-bold uppercase text-[9px] tracking-widest">Department (แผนก)</span>
                            <p className="font-black text-[#111f42] text-[13px]">{selectedPR.department}</p>
                          </div>
                          <div className="col-span-2 space-y-1">
                            <span className="text-slate-400 font-bold uppercase text-[9px] tracking-widest">Objective / Remarks (วัตถุประสงค์ในการขอซื้อ)</span>
                            <p className="text-[#111f42] font-semibold italic">"{selectedPR.objective}"</p>
                          </div>
                        </div>
                      </div>

                      <div className="flex-1 mb-8">
                        <table className="w-full text-left text-[11px] border border-slate-200">
                          <thead className="bg-[#111f42] text-white">
                            <tr>
                              <th className="px-3 py-2.5 border-r border-slate-600 w-10 text-center font-bold">#</th>
                              <th className="px-3 py-2.5 border-r border-slate-600 font-bold">Description (รายการสินค้า)</th>
                              <th className="px-3 py-2.5 border-r border-slate-600 w-16 text-center font-bold">Qty</th>
                              <th className="px-3 py-2.5 border-r border-slate-600 w-16 text-center font-bold">Unit</th>
                              <th className="px-3 py-2.5 border-r border-slate-600 w-24 text-right font-bold">Est. Price</th>
                              <th className="px-3 py-2.5 border-r border-slate-600 w-28 text-right font-bold">Total Amount</th>
                              <th className="px-3 py-2.5 w-32 font-bold">Note</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-200">
                            {selectedPR.items.map((item: any, idx: number) => (
                              <tr key={idx} className="even:bg-slate-50/50">
                                <td className="px-3 py-1.5 border-r text-center text-slate-500">{idx + 1}</td>
                                <td className="px-3 py-1.5 border-r font-bold text-[#111f42]">{item.description}</td>
                                <td className="px-3 py-1.5 border-r text-center font-mono">{item.qty}</td>
                                <td className="px-3 py-1.5 border-r text-center">{item.unit}</td>
                                <td className="px-3 py-1.5 border-r text-right font-mono">{formatCurrency(item.unitPrice).replace('฿', '')}</td>
                                <td className="px-3 py-1.5 border-r text-right font-mono font-bold text-[#111f42]">{formatCurrency(item.total).replace('฿', '')}</td>
                                <td className="px-3 py-1.5 text-slate-500 text-[9px] italic">{item.note || '-'}</td>
                              </tr>
                            ))}
                            {[...Array(Math.max(0, 5 - selectedPR.items.length))].map((_, i) => (
                              <tr key={`empty-${i}`}>
                                <td className="px-3 py-2.5 border-r"></td><td className="px-3 py-2.5 border-r"></td>
                                <td className="px-3 py-2.5 border-r"></td><td className="px-3 py-2.5 border-r"></td>
                                <td className="px-3 py-2.5 border-r"></td><td className="px-3 py-2.5 border-r"></td>
                                <td className="px-3 py-2.5"></td>
                              </tr>
                            ))}
                          </tbody>
                          <tfoot className="border-t-2 border-[#111f42] bg-slate-50">
                            <tr>
                              <td colSpan={5} className="px-4 py-3 text-right font-black uppercase text-[#111f42] tracking-widest">Est. Grand Total</td>
                              <td className="px-3 py-3 border-r border-[#111f42] text-right font-black text-[13px] font-mono text-[#E3624A]">{formatCurrency(selectedPR.totalAmount)}</td>
                              <td className="px-3 py-3 text-center text-[9px] font-bold text-slate-400">Estimate Only</td>
                            </tr>
                          </tfoot>
                        </table>
                      </div>

                      <div className="grid grid-cols-3 gap-6 mt-auto break-inside-avoid text-[10px] text-center pt-8">
                        <div className="flex flex-col h-28 border border-slate-200 rounded-lg overflow-hidden">
                          <div className="bg-slate-50 px-2 py-1.5 font-bold uppercase border-b border-slate-200 text-[#111f42] tracking-widest">REQUESTED BY</div>
                          <div className="flex-1 flex items-center justify-center text-slate-300 italic">Signature</div>
                          <div className="px-2 py-1.5 border-t border-slate-100 font-bold">({selectedPR.requester})</div>
                        </div>
                        <div className="flex flex-col h-28 border border-slate-200 rounded-lg overflow-hidden">
                          <div className="bg-slate-50 px-2 py-1.5 font-bold uppercase border-b border-slate-200 text-[#111f42] tracking-widest">CHECKED BY</div>
                          <div className="flex-1 flex items-center justify-center text-slate-300 italic">Signature</div>
                          <div className="px-2 py-1.5 border-t border-slate-100 font-bold text-slate-400">(Dept. Manager)</div>
                        </div>
                        <div className="flex flex-col h-28 border-2 border-[#111f42] rounded-lg overflow-hidden shadow-sm">
                          <div className="bg-[#111f42] text-white px-2 py-1.5 font-bold uppercase border-b border-[#111f42] tracking-widest">APPROVED BY</div>
                          <div className="flex-1 flex items-center justify-center text-slate-300 italic relative">
                            {selectedPR.status === 'Approved' && <FileSignature size={36} className="text-emerald-500/10 absolute" />}
                            <span className="relative z-10 font-bold">Authorized Signature</span>
                          </div>
                          <div className="px-2 py-1.5 border-t border-slate-100 font-bold text-[#111f42]">(Management)</div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 bg-white border-t flex justify-end gap-3 shrink-0 no-print">
                    <button onClick={()=>setPreviewModal(false)} className="px-6 py-2 border rounded-lg font-bold text-[12px] uppercase text-slate-500 hover:bg-slate-50">Cancel</button>
                    <button onClick={executePrint} className="px-5 py-2 bg-[#ab8a3b] text-white rounded-lg font-bold text-[12px] shadow-md uppercase flex items-center gap-2 hover:bg-[#8f712c] transition-colors"><Printer size={16}/> Print PR</button>
                  </div>
                </div>
              </DraggableWrapper>

    </div>
  );
};

export default PrPreviewModal;

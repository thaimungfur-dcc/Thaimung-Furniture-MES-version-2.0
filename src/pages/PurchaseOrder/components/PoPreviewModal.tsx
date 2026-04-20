import React from 'react';
import { X, Printer, FileCheck } from 'lucide-react';

interface PoPreviewModalProps {
  previewModal: string | null;
  setPreviewModal: (mode: string | null) => void;
  selectedItem: any;
  formatDate: (date: string) => string;
  formatCurrency: (amount: number) => string;
  executePrint: () => void;
}

const PoPreviewModal: React.FC<PoPreviewModalProps> = ({
  previewModal,
  setPreviewModal,
  selectedItem,
  formatDate,
  formatCurrency,
  executePrint
}) => {
  if (previewModal !== 'print' || !selectedItem) return null;

  return (
    <div className="fixed inset-0 bg-[#111f42]/60 backdrop-blur-sm z-[80] flex items-center justify-center p-4 no-print">
      <div className="bg-white rounded-2xl w-full max-w-4xl shadow-2xl overflow-hidden flex flex-col animate-in zoom-in duration-200 max-h-[90vh]">
        <div className="px-6 py-4 flex justify-between items-center bg-[#ab8a3b] text-white shrink-0">
          <h2 className="text-lg font-semibold uppercase tracking-widest flex items-center gap-2"><Printer size={20} /> Preview Purchase Order</h2>
          <button onClick={() => setPreviewModal(null)}><X size={24} /></button>
        </div>
        <div className="flex-1 overflow-y-auto p-4 bg-slate-200 flex justify-center print:p-0 print:bg-white custom-scrollbar">
          <div className="bg-white p-10 shadow-md w-full max-w-[794px] min-h-[1123px] h-max flex flex-col print:shadow-none">
            <div className="flex justify-between items-start pb-4 gap-4">
              <div className="space-y-1 w-1/2">
                <h2 className="text-base font-black tracking-tight text-[#111f42]">บริษัท ไทยมั่งเฟอร์นิเจอร์ จํากัด</h2>
                <p className="text-[10px] font-semibold font-mono text-[#111f42]">Thaimung Furniture Co., Ltd.</p>
                <p className="text-[9px] font-bold mt-1 text-[#111f42]">TAX ID : 0105546077645</p>
              </div>
              <div className="text-right text-[9px] font-medium leading-relaxed text-[#111f42] w-1/2">
                <p>สำนักงานใหญ่ : เลขที่ 22/88 หมู่ที่ 3 ตําบลท่าเสา อําเภอกระทุ่มแบน จังหวัดสมุทรสาคร 74110</p>
                <p>Head Office : 22/88 Moo 3, Tha Sao, Krathum Baen, Samut Sakhon 74110</p>
                <div className="flex justify-end gap-3 mt-1">
                  <span>TEL. 082-569-5654, 091-516-5999</span>
                  <span>E-mail : thaimungfurniture.dcc@gmail.com</span>
                </div>
              </div>
            </div>
            
            <div className="border-t-[3px] border-[#111f42] pt-5 mb-6 grid grid-cols-[1fr_auto_1fr] items-start">
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Procurement Department</p>
              </div>
              
              <div className="text-center flex flex-col items-center justify-center px-4">
                <h3 className="text-2xl font-black text-[#E3624A] uppercase tracking-widest whitespace-nowrap">PURCHASE ORDER</h3>
                <p className="text-[11px] font-bold mt-0.5 text-[#111f42]">ใบสั่งซื้อสินค้า</p>
              </div>

              <div className="flex justify-end">
                <div className="text-[10px] font-mono flex flex-col items-end gap-1">
                  <div className="flex gap-3"><span className="font-bold text-slate-500 w-16 text-right">PO NO:</span> <span className="font-black text-[#111f42] w-24 text-left">{selectedItem.poNumber}</span></div>
                  <div className="flex gap-3"><span className="font-bold text-slate-500 w-16 text-right">DATE:</span> <span className="font-bold text-[#111f42] w-24 text-left">{formatDate(selectedItem.date)}</span></div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-4 text-[10px]">
              <div className="border border-slate-200 p-4 rounded-xl bg-slate-50/50 flex flex-col justify-center">
                <p className="font-bold text-slate-400 uppercase tracking-widest mb-1.5 text-[9px]">Vendor / ผู้จำหน่าย</p>
                <p className="font-black text-[#111f42] text-sm mb-1">{selectedItem.vendor}</p>
                <p className="text-slate-600 leading-tight font-medium">{selectedItem.vendorAddress || '-'}</p>
              </div>
              <div className="border border-slate-200 p-4 rounded-xl bg-slate-50/50 flex flex-col justify-center">
                <p className="font-bold text-slate-400 uppercase tracking-widest mb-1.5 text-[9px]">Ship To / ส่งสินค้าที่</p>
                <p className="font-black text-[#111f42] text-sm mb-1">T All Intelligence Warehouse</p>
                <p className="text-slate-600 leading-tight font-medium">123 Industrial Estate, Moo 5, Klong 4, Pathum Thani, 12120</p>
              </div>
            </div>

            <div className="grid grid-cols-4 gap-3 mb-6 text-[10px] border border-slate-200 p-3 rounded-lg bg-white">
              <div><p className="text-slate-400 font-bold uppercase tracking-widest text-[8px] mb-0.5">Payment Term</p><p className="font-bold text-[#111f42]">{selectedItem.paymentTerm}</p></div>
              <div><p className="text-slate-400 font-bold uppercase tracking-widest text-[8px] mb-0.5">Delivery Date</p><p className="font-bold text-red-600">{formatDate(selectedItem.deliveryDate)}</p></div>
              <div><p className="text-slate-400 font-bold uppercase tracking-widest text-[8px] mb-0.5">PR Reference</p><p className="font-bold text-[#111f42]">{selectedItem.prRef}</p></div>
              <div><p className="text-slate-400 font-bold uppercase tracking-widest text-[8px] mb-0.5">Shipping Method</p><p className="font-bold text-[#111f42]">By Truck</p></div>
            </div>

            <div className="flex-1 mb-8">
              <table className="w-full text-left text-[11px] border border-slate-200">
                <thead className="bg-[#111f42] text-white">
                  <tr>
                    <th className="px-3 py-2 border-r border-slate-600 w-10 text-center font-bold">#</th>
                    <th className="px-3 py-2 border-r border-slate-600 font-bold">Items / Description</th>
                    <th className="px-3 py-2 border-r border-slate-600 w-16 text-center font-bold">Qty</th>
                    <th className="px-3 py-2 border-r border-slate-600 w-24 text-right font-bold">Unit Price</th>
                    <th className="px-3 py-2.5 text-right w-28 font-bold">Amount</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {selectedItem.items.map((item: any, idx: number) => (
                    <tr key={idx} className="even:bg-slate-50/50">
                      <td className="px-3 py-3 border-r text-center text-slate-500">{idx + 1}</td>
                      <td className="px-3 py-3 border-r">
                        <span className="font-bold text-[#111f42]">{item.code}</span>
                        {item.name && <span className="text-slate-600 ml-2">- {item.name}</span>}
                      </td>
                      <td className="px-3 py-3 border-r text-center font-mono font-medium">{item.qty}</td>
                      <td className="px-3 py-3 border-r text-right font-mono">{formatCurrency(item.price)}</td>
                      <td className="px-3 py-3 text-right font-mono font-bold text-[#111f42]">{formatCurrency((item.qty*item.price)||0)}</td>
                    </tr>
                  ))}
                  {[...Array(Math.max(0, 6 - selectedItem.items.length))].map((_, i) => (
                    <tr key={`empty-${i}`}>
                      <td className="px-3 py-4 border-r"></td><td className="px-3 py-4 border-r"></td>
                      <td className="px-3 py-4 border-r"></td><td className="px-3 py-4 border-r"></td>
                      <td className="px-3 py-4"></td>
                    </tr>
                  ))}
                </tbody>
              </table>

              <div className="flex justify-end border border-t-0 border-slate-200 bg-slate-50/50 break-inside-avoid">
                <div className="w-[280px]">
                  <table className="w-full text-[11px]">
                    <tbody>
                      <tr>
                        <td className="py-1.5 px-3 text-right text-slate-500 font-bold tracking-widest uppercase border-r border-slate-200">Subtotal:</td>
                        <td className="py-1.5 px-4 text-right font-mono font-bold text-[#111f42]">{formatCurrency(selectedItem.subTotal)}</td>
                      </tr>
                      <tr>
                        <td className="py-1.5 px-3 text-right text-slate-500 font-bold tracking-widest uppercase border-r border-slate-200">VAT (7%):</td>
                        <td className="py-1.5 px-4 text-right font-mono font-bold text-[#111f42]">{formatCurrency(selectedItem.vat)}</td>
                      </tr>
                      <tr className="border-t-[3px] border-[#111f42] bg-white">
                        <td className="py-2.5 px-3 text-right text-[#111f42] font-black tracking-widest uppercase border-r border-slate-200">Grand Total:</td>
                        <td className="py-2.5 px-4 text-right font-black text-[#E3624A] text-[14px] font-mono">{formatCurrency(selectedItem.grandTotal)}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
              
              <div className="mt-4 text-[9px] text-slate-500 bg-slate-50 p-3 rounded-lg border border-slate-100">
                <p className="font-bold text-[#111f42] uppercase mb-1">Remarks & Conditions:</p>
                <ul className="list-disc pl-4 space-y-0.5">
                  <li>กรุณาอ้างอิงเลขที่ใบสั่งซื้อ (PO No.) นี้ในใบกำกับภาษี/ใบส่งสินค้าทุกครั้ง</li>
                  <li>การส่งมอบสินค้าต้องตรงตามกำหนดการ หากล่าช้าบริษัทสงวนสิทธิ์ในการยกเลิก</li>
                  <li>เงื่อนไขเพิ่มเติม: {selectedItem.remarks || '-'}</li>
                </ul>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-6 mt-auto break-inside-avoid text-[10px] text-center pt-4">
              <div className="flex flex-col h-28 border border-slate-200 rounded-lg overflow-hidden">
                <div className="bg-slate-50 px-2 py-1.5 font-bold uppercase border-b border-slate-200 text-[#111f42] tracking-widest">VENDOR ACCEPTED</div>
                <div className="flex-1 flex flex-col items-center justify-center text-slate-300 italic leading-tight px-2">
                  <span>Stamp & Signature</span>
                </div>
                <div className="px-2 py-1.5 border-t border-slate-100 font-bold text-slate-400">Confirmed Receipt</div>
              </div>
              <div className="flex flex-col h-28 border border-slate-200 rounded-lg overflow-hidden">
                <div className="bg-slate-50 px-2 py-1.5 font-bold uppercase border-b border-slate-200 text-[#111f42] tracking-widest">PREPARED BY</div>
                <div className="flex-1 flex items-center justify-center text-slate-300 italic">Signature</div>
                <div className="px-2 py-1.5 border-t border-slate-100 font-bold text-slate-400">(Purchasing Dept.)</div>
              </div>
              <div className="flex flex-col h-28 border-2 border-[#111f42] rounded-lg overflow-hidden shadow-sm">
                <div className="bg-[#111f42] text-white px-2 py-1.5 font-bold uppercase border-b border-[#111f42] tracking-widest">APPROVED BY</div>
                <div className="flex-1 flex items-center justify-center text-slate-300 italic relative bg-slate-50/30">
                  {selectedItem.status === 'Approved' || selectedItem.status === 'Sent' || selectedItem.status === 'Completed' ? (
                    <FileCheck size={36} className="text-[#849a28]/20 absolute" />
                  ) : null}
                  <span className="relative z-10 font-bold">Authorized Signature</span>
                </div>
                <div className="px-2 py-1.5 border-t border-slate-100 font-bold text-[#111f42]">(Management)</div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="p-4 bg-white border-t flex justify-end gap-3 shrink-0 no-print">
          <button onClick={()=>setPreviewModal(null)} className="px-6 py-2 border rounded-lg font-bold text-[12px] uppercase text-slate-500 hover:bg-slate-50">Cancel</button>
          <button onClick={executePrint} className="px-8 py-2 bg-[#ab8a3b] text-white rounded-lg font-bold text-[12px] shadow-md uppercase flex items-center gap-2 hover:bg-[#8f712c] transition-colors"><Printer size={16}/> Print PO</button>
        </div>
      </div>
    </div>
  );
};

export default PoPreviewModal;

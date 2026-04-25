import React from 'react';
import { X, Printer, FileCheck } from 'lucide-react';
import { DraggableWrapper } from "../../../components/shared/DraggableWrapper";

export const PrintDocModal = ({ showPrintDocModal, activeTransaction, setShowPrintDocModal, executePrintDoc, formatDateSafe }: any) => {
    if (!showPrintDocModal || !activeTransaction) return null;

    return (
        <div className="modal-overlay z-[80000]" onClick={() => setShowPrintDocModal(false)}>
            
            <DraggableWrapper>
                  <div className="bg-white rounded-2xl w-full max-w-4xl shadow-2xl overflow-hidden flex flex-col animate-in zoom-in duration-200 max-h-[90vh]" onClick={e => e.stopPropagation()}>
                            <div className="px-6 py-2.5 flex justify-between items-center bg-[#111f42] text-white shrink-0 border-b-4 border-[#ab8a3b]">
                                <h2 className="text-lg font-semibold uppercase tracking-widest flex items-center gap-2"><Printer size={20} className="text-[#ab8a3b]"/> PREVIEW DOCUMENT</h2>
                                <button onClick={() => setShowPrintDocModal(false)} className="hover:bg-white/20 p-1.5 rounded-lg transition-colors"><X size={24} /></button>
                            </div>
                            <div className="flex-1 overflow-y-auto p-4 bg-slate-200 flex justify-center print:p-0 print:bg-white master-custom-scrollbar">
                                <div id="doc-print-area" className="bg-white p-4 sm:p-5 shadow-md w-full max-w-[794px] min-h-[1123px] h-max flex flex-col print:shadow-none relative overflow-hidden font-sans">
                                    
                                    <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 -rotate-12 opacity-[0.03] pointer-events-none z-0 text-8xl font-black uppercase tracking-widest text-[#111f42]">
                                        {String(activeTransaction.status)}
                                    </div>

                                    {/* PDF Header */}
                                    <div className="flex justify-between items-start pb-4 gap-4 border-b-[3px] border-[#111f42] mb-6 relative z-10">
                                        <div className="space-y-1 shrink-0">
                                            <h2 className="text-xl font-black tracking-tight text-[#111f42] font-sans">บริษัท ไทยมั่งเฟอร์นิเจอร์ จํากัด</h2>
                                            <p className="text-[11px] font-semibold font-mono text-[#111f42]">Thaimung Furniture Co., Ltd.</p>
                                            <p className="text-[10px] font-bold mt-1 text-[#111f42]">TAX ID : 0105546077645</p>
                                        </div>
                                        <div className="text-right text-[10px] font-medium leading-relaxed text-[#111f42] font-sans shrink-0 whitespace-nowrap">
                                            <p>สำนักงานใหญ่ : เลขที่ 22/88 หมู่ที่ 3 ตําบลท่าเสา อําเภอกระทุ่มแบน จังหวัดสมุทรสาคร 74110</p>
                                            <p className="font-mono text-[9px]">Head Office : 22/88 Moo 3, Tha Sao, Krathum Baen, Samut Sakhon 74110</p>
                                            <div className="flex justify-end gap-3 mt-1 font-mono text-[9px]">
                                                <span>TEL. 082-569-5654, 091-516-5999</span>
                                                <span>E-mail: thaimungfurniture.dcc@gmail.com</span>
                                            </div>
                                        </div>
                                    </div>
                                    
                                    {/* Document Title & Ref */}
                                    <div className="grid grid-cols-[1fr_auto_1fr] items-start mb-6 relative z-10">
                                        <div>
                                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1 font-mono">Warehouse Department</p>
                                        </div>
                                        
                                        <div className="text-center flex flex-col items-center justify-center px-4">
                                            <h3 className="text-2xl font-black text-[#E3624A] uppercase tracking-widest whitespace-nowrap font-mono">GOODS RECEIPT NOTE</h3>
                                            <p className="text-[12px] font-bold mt-0.5 text-[#111f42] font-sans">ใบรับสินค้าเข้าคลัง</p>
                                        </div>

                                        <div className="flex justify-end">
                                            <div className="text-[11px] font-mono flex flex-col items-end gap-1 bg-slate-50 p-2 rounded border border-slate-100">
                                                <div className="flex gap-3"><span className="font-bold text-slate-500 w-16 text-right">DOC NO:</span> <span className="font-black text-[#111f42] w-24 text-left">{String(activeTransaction.transId)}</span></div>
                                                <div className="flex gap-3"><span className="font-bold text-slate-500 w-16 text-right">DATE:</span> <span className="font-bold text-[#111f42] w-24 text-left">{formatDateSafe(activeTransaction.date.split(' ')[0])}</span></div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Info Box */}
                                    <div className="grid grid-cols-2 gap-4 mb-4 text-[11px] font-sans relative z-10">
                                        <div className="border border-slate-200 p-4 rounded-xl bg-slate-50/50 flex flex-col justify-center">
                                            <p className="font-bold text-slate-400 uppercase tracking-widest mb-1.5 text-[9px] font-mono">Source Info / แหล่งที่มา</p>
                                            <div className="flex justify-between mt-1"><span className="font-bold text-slate-500">From:</span><span className="font-black text-[#111f42]">{String(activeTransaction.receiveFrom || activeTransaction.outType || '-')}</span></div>
                                            <div className="flex justify-between mt-1"><span className="font-bold text-slate-500">Ref Doc:</span><span className="font-bold text-[#111f42] font-mono">{String(activeTransaction.refNo || '-')}</span></div>
                                        </div>
                                        <div className="border border-slate-200 p-4 rounded-xl bg-slate-50/50 flex flex-col justify-center">
                                            <p className="font-bold text-slate-400 uppercase tracking-widest mb-1.5 text-[9px] font-mono">Storage Info / สถานที่เก็บ</p>
                                            <div className="flex justify-between mt-1"><span className="font-bold text-slate-500">Warehouse:</span><span className="font-black text-[#111f42]">{String(activeTransaction.warehouseName)}</span></div>
                                            <div className="flex justify-between mt-1"><span className="font-bold text-slate-500">Location:</span><span className="font-bold text-[#E3624A] font-mono">{String(activeTransaction.location || '-')}</span></div>
                                        </div>
                                    </div>

                                    {/* Items Table */}
                                    <div className="flex-1 mb-8 relative z-10 mt-4">
                                        <table className="w-full text-left text-[11px] border border-slate-200 font-sans">
                                            <thead className="bg-[#111f42] text-white">
                                                <tr>
                                                    <th className="px-3 py-2.5 border-r border-slate-600 w-10 text-center font-bold">#</th>
                                                    <th className="px-3 py-2.5 border-r border-slate-600 font-bold">Items / Description</th>
                                                    <th className="px-3 py-2.5 border-r border-slate-600 w-24 text-center font-bold">Lot No.</th>
                                                    <th className="px-3 py-2.5 border-r border-slate-600 w-16 text-center font-bold">Qty</th>
                                                    <th className="px-3 py-2.5 text-center w-24 font-bold text-[#ab8a3b]">Status</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-slate-200">
                                                <tr className="even:bg-slate-50/50">
                                                    <td className="px-3 py-3 border-r text-center text-slate-500 font-mono">1</td>
                                                    <td className="px-3 py-3 border-r">
                                                        <span className="font-bold text-[#111f42] font-mono">{String(activeTransaction.sku)}</span>
                                                        <span className="text-slate-600 ml-2">- {String(activeTransaction.itemName)}</span>
                                                    </td>
                                                    <td className="px-3 py-3 border-r text-center font-mono font-bold text-[#111f42]">{String(activeTransaction.lotNo || '-')}</td>
                                                    <td className="px-3 py-3 border-r text-center font-mono font-black text-[#10b981]">+{String(activeTransaction.qty)}</td>
                                                    <td className="px-3 py-3 text-center font-sans font-bold text-[#111f42]">{String(activeTransaction.status)}</td>
                                                </tr>
                                                {/* Pad empty rows to fill space */}
                                                {[...Array(6)]?.map((_, i) => (
                                                    <tr key={`empty-${i}`}>
                                                        <td className="px-3 py-2.5 border-r"></td><td className="px-3 py-2.5 border-r"></td>
                                                        <td className="px-3 py-2.5 border-r"></td><td className="px-3 py-2.5 border-r"></td>
                                                        <td className="px-3 py-2.5"></td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>

                                        {/* Totals Calculation */}
                                        <div className="flex justify-end border border-t-0 border-slate-200 bg-slate-50/50 break-inside-avoid">
                                            <div className="w-[280px]">
                                                <table className="w-full text-[11px] font-mono">
                                                    <tbody>
                                                        <tr className="border-t-[3px] border-[#111f42] bg-white">
                                                            <td className="py-2.5 px-3 text-right text-[#111f42] font-black tracking-widest uppercase border-r border-slate-200">Total Qty:</td>
                                                            <td className="py-2.5 px-4 text-right font-black text-[#10b981] text-[16px]">{String(activeTransaction.qty)} UNITS</td>
                                                        </tr>
                                                    </tbody>
                                                </table>
                                            </div>
                                        </div>
                                        
                                        {/* Conditions Note */}
                                        <div className="mt-4 text-[10px] text-slate-600 bg-slate-50 p-3 rounded-lg border border-slate-100 font-sans">
                                            <p className="font-bold text-[#111f42] uppercase mb-1 font-mono tracking-wide">Remarks:</p>
                                            <p>{String(activeTransaction.remark || '-')}</p>
                                        </div>
                                    </div>

                                    {/* Signatures */}
                                    <div className="grid grid-cols-3 gap-6 mt-auto break-inside-avoid text-[10px] text-center pt-4 font-sans relative z-10">
                                        <div className="flex flex-col h-28 border border-slate-200 rounded-lg overflow-hidden">
                                            <div className="bg-slate-50 px-2 py-1.5 font-bold uppercase border-b border-slate-200 text-[#111f42] tracking-widest font-mono">DELIVERED BY</div>
                                            <div className="flex-1 flex flex-col items-center justify-center text-slate-300 italic leading-tight px-2">
                                                <span>Signature</span>
                                            </div>
                                            <div className="px-2 py-1.5 border-t border-slate-100 font-bold text-slate-400">({String(activeTransaction.receiveFrom || 'Supplier/Production')})</div>
                                        </div>
                                        <div className="flex flex-col h-28 border border-slate-200 rounded-lg overflow-hidden">
                                            <div className="bg-slate-50 px-2 py-1.5 font-bold uppercase border-b border-slate-200 text-[#111f42] tracking-widest font-mono">RECEIVED BY</div>
                                            <div className="flex-1 flex items-center justify-center text-slate-300 italic">Signature</div>
                                            <div className="px-2 py-1.5 border-t border-slate-100 font-bold text-slate-400">(Warehouse Staff)</div>
                                        </div>
                                        <div className="flex flex-col h-28 border-[3px] border-[#111f42] rounded-lg overflow-hidden shadow-sm">
                                            <div className="bg-[#111f42] text-white px-2 py-1.5 font-bold uppercase border-b border-[#111f42] tracking-widest font-mono">CHECKED BY</div>
                                            <div className="flex-1 flex items-center justify-center text-slate-300 italic relative bg-slate-50/30">
                                                {activeTransaction.status === 'Confirmed' && <FileCheck size={40} className="text-[#10b981]/20 absolute" />}
                                                <span className="relative z-10 font-bold text-slate-400">Authorized Signature</span>
                                            </div>
                                            <div className="px-2 py-1.5 border-t border-slate-200 font-bold text-[#111f42] bg-slate-50">({String(activeTransaction.by || 'Manager')})</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="p-4 bg-white border-t flex justify-end gap-3 shrink-0 no-print rounded-b-2xl">
                                <button onClick={() => setShowPrintDocModal(false)} className="px-6 py-2.5 border border-slate-200 rounded-xl font-bold text-[11px] uppercase text-slate-500 hover:bg-slate-50 transition-colors tracking-widest font-mono">Cancel</button>
                                <button onClick={executePrintDoc} className="px-5 py-2.5 bg-[#ab8a3b] text-white rounded-xl font-bold text-[11px] shadow-md uppercase flex items-center gap-2 hover:bg-[#8f712c] transition-colors tracking-widest font-mono"><Printer size={16}/> Print Note</button>
                            </div>
                        </div>
                </DraggableWrapper>

        </div>
    );
};

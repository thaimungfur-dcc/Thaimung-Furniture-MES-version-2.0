import React from 'react';
import { Printer, X } from 'lucide-react';
import { DraggableWrapper } from "../../../components/shared/DraggableWrapper";

interface ReportPreviewModalProps {
    isOpen: boolean;
    reportData: any[];
    reportDateRange: { start: string, end: string };
    closeModal: () => void;
}

export default function ReportPreviewModal({ isOpen, reportData, reportDateRange, closeModal }: ReportPreviewModalProps) {
    if (!isOpen) return null;

    const formatNum = (v: any) => (Number(v) || 0)?.toLocaleString();

    return (
        <div className="modal-overlay z-[80000]" onClick={closeModal}>
            
            <DraggableWrapper>
                  <div className="bg-white rounded-2xl w-full max-w-4xl shadow-2xl overflow-hidden flex flex-col animate-in zoom-in duration-200 max-h-[90vh]" onClick={e => e.stopPropagation()}>
                            <div className="px-6 py-2.5 flex justify-between items-center bg-[#111f42] text-white shrink-0 border-b-4 border-[#ab8a3b]">
                                <h2 className="text-lg font-semibold uppercase tracking-widest flex items-center gap-2"><Printer size={20} className="text-[#ab8a3b]"/> PREVIEW BOOKING REPORT</h2>
                                <button onClick={closeModal} className="hover:bg-white/20 p-1.5 rounded-lg transition-colors"><X size={24} /></button>
                            </div>
                            <div className="flex-1 overflow-y-auto p-4 bg-slate-200 flex justify-center print:p-0 print:bg-white master-custom-scrollbar font-sans">
                                <div className="bg-white p-4 sm:p-5 shadow-md w-full max-w-[794px] min-h-[1123px] h-max flex flex-col print:shadow-none relative overflow-hidden font-sans">
                                    <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 -rotate-12 opacity-[0.03] pointer-events-none z-0 text-8xl font-black uppercase tracking-widest text-[#111f42]">REPORT</div>
                                    
                                    {/* PDF Header */}
                                    <div className="flex justify-between items-start pb-4 gap-4 border-b-[3px] border-[#111f42] mb-6 relative z-10 font-sans">
                                        <div className="space-y-1 shrink-0 font-sans">
                                            <h2 className="text-xl font-black tracking-tight text-[#111f42] leading-none">บริษัท ไทยมั่งเฟอร์นิเจอร์ จํากัด</h2>
                                            <p className="text-[11px] font-semibold font-mono text-[#111f42] leading-none">Thaimung Furniture Co., Ltd.</p>
                                            <p className="text-[10px] font-bold mt-1 text-[#111f42] leading-none">TAX ID : 0105546077645</p>
                                        </div>
                                        <div className="text-right text-[10px] font-medium leading-relaxed text-[#111f42] shrink-0 whitespace-nowrap font-sans">
                                            <p>สำนักงานใหญ่ : เลขที่ 22/88 หมู่ที่ 3 ตําบลท่าเสา อําเภอกระทุ่มแบน จังหวัดสมุทรสาคร 74110</p>
                                            <p>Head Office : 22/88 Moo 3, Tha Sao, Krathum Baen, Samut Sakhon 74110</p>
                                            <div className="flex justify-end gap-3 mt-1 font-mono text-[9px]">
                                                <span>TEL. 082-569-5654, 091-516-5999</span>
                                                <span>E-mail: thaimungfurniture.dcc@gmail.com</span>
                                            </div>
                                        </div>
                                    </div>
                                    
                                    <div className="grid grid-cols-[1fr_auto_1fr] items-start mb-6 relative z-10 font-sans">
                                        <div><p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1 font-mono leading-none">Warehouse Department</p></div>
                                        <div className="text-center flex flex-col items-center justify-center px-4 font-sans">
                                            <h3 className="text-2xl font-black text-[#E3624A] uppercase tracking-widest whitespace-nowrap font-mono leading-none">BOOKING REPORT</h3>
                                            <p className="text-[12px] font-bold mt-0.5 text-[#111f42]">รายงานสรุปรายการจองสินค้า</p>
                                        </div>
                                        <div className="flex justify-end font-sans">
                                            <div className="text-[11px] font-mono flex flex-col items-end gap-1 bg-slate-50 p-2 rounded border border-slate-100">
                                                <div className="flex gap-3 font-sans"><span className="font-bold text-slate-500 w-20 text-right">RANGE:</span> <span className="font-black text-[#111f42] w-32 text-left leading-none">{String(reportDateRange.start)} to {String(reportDateRange.end)}</span></div>
                                                <div className="flex gap-3 font-sans"><span className="font-bold text-slate-500 w-20 text-right">DATE:</span> <span className="font-bold text-[#111f42] w-32 text-left leading-none">{new Date().toLocaleDateString('en-GB')}</span></div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex-1 mb-8 relative z-10 mt-4 font-sans">
                                        <table className="w-full text-left text-[11px] border border-slate-200 font-sans">
                                            <thead className="bg-[#111f42] text-white">
                                                <tr>
                                                    <th className="px-3 py-2.5 border-r border-slate-600 w-10 text-center font-bold">#</th>
                                                    <th className="px-3 py-2.5 border-r border-slate-600 font-bold">Booking ID / Ref</th>
                                                    <th className="px-3 py-2.5 border-r border-slate-600 font-bold">Customer / Description</th>
                                                    <th className="px-3 py-2.5 border-r border-slate-600 font-bold text-center">Location</th>
                                                    <th className="px-3 py-2.5 text-right w-20 font-bold text-[#ab8a3b]">Reserved</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-slate-200">
                                                {reportData?.map((item, idx) => (
                                                    <tr key={idx} className="even:bg-slate-50/50">
                                                        <td className="px-3 py-3 border-r text-center text-slate-500 font-mono">{idx + 1}</td>
                                                        <td className="px-3 py-3 border-r font-mono font-bold text-[#111f42]">{item.bookingId}<br/><span className="text-[9px] text-slate-400 font-sans leading-none">Ref: {item.soRef}</span></td>
                                                        <td className="px-3 py-3 border-r font-bold text-[#111f42]">{item.customer}<br/><span className="text-[9px] font-normal text-slate-500 truncate max-w-[200px] leading-none">{item.productName}</span></td>
                                                        <td className="px-3 py-3 border-r text-center font-mono font-bold text-[#111f42]">{item.location}</td>
                                                        <td className="px-3 py-3 text-right font-mono font-bold text-[#10b981] bg-emerald-50/20">{formatNum(item.qty)}</td>
                                                    </tr>
                                                ))}
                                                {[...Array(Math.max(0, 10 - reportData.length))]?.map((_, i) => (
                                                    <tr key={`empty-${i}`}><td className="px-3 py-2.5 border-r"></td><td className="px-3 py-2.5 border-r"></td><td className="px-3 py-2.5 border-r"></td><td className="px-3 py-2.5 border-r"></td><td className="px-3 py-2.5"></td></tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                    
                                    <div className="grid grid-cols-3 gap-6 mt-auto break-inside-avoid text-[10px] text-center pt-4 relative z-10 font-sans">
                                        <div className="flex flex-col h-28 border border-slate-200 rounded-lg overflow-hidden">
                                            <div className="bg-slate-50 px-2 py-1.5 font-bold uppercase border-b border-slate-200 text-[#111f42] tracking-widest font-mono leading-none">PREPARED BY</div>
                                            <div className="flex-1 flex items-center justify-center text-slate-300 italic">Signature</div>
                                        </div>
                                        <div className="flex flex-col h-28 border border-slate-200 rounded-lg overflow-hidden">
                                            <div className="bg-slate-50 px-2 py-1.5 font-bold uppercase border-b border-slate-200 text-[#111f42] tracking-widest font-mono leading-none">CHECKED BY</div>
                                            <div className="flex-1 flex items-center justify-center text-slate-300 italic">Signature</div>
                                        </div>
                                        <div className="flex flex-col h-28 border-[3px] border-[#111f42] rounded-lg overflow-hidden shadow-sm">
                                            <div className="bg-[#111f42] text-white px-2 py-1.5 font-bold uppercase border-b border-[#111f42] tracking-widest font-mono leading-none">AUTHORIZED BY</div>
                                            <div className="flex-1 flex items-center justify-center text-slate-300 italic relative bg-slate-50/30 font-sans"><span className="relative z-10 font-bold text-slate-400">Authorized Signature</span></div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="p-4 bg-white border-t flex justify-end gap-3 shrink-0 no-print rounded-b-2xl font-mono">
                                <button onClick={closeModal} className="px-6 py-2.5 border border-slate-200 rounded-xl font-bold text-[11px] uppercase text-slate-500 hover:bg-slate-50 transition-colors tracking-widest font-mono leading-none">Cancel</button>
                                <button onClick={() => window.print()} className="bg-[#ab8a3b] text-[#111f42] px-5 py-2.5 rounded-xl font-black text-[11px] shadow-md uppercase flex items-center gap-2 hover:brightness-110 transition-all font-mono leading-none"><Printer size={16}/> Print Report</button>
                            </div>
                        </div>
                </DraggableWrapper>

        </div>
    );
}

import React from 'react';
import { Printer, X, QrCode as QrIcon } from 'lucide-react';
import { DraggableWrapper } from "../../../components/shared/DraggableWrapper";

interface TagPrintModalProps {
    isOpen: boolean;
    selectedItem: any;
    printFormat: string;
    setPrintFormat: (format: string) => void;
    qrCodeUrl: string;
    barcodeUrl: string;
    closeModal: () => void;
    executePrintTag: () => void;
}

export default function TagPrintModal({ isOpen, selectedItem, printFormat, setPrintFormat, qrCodeUrl, barcodeUrl, closeModal, executePrintTag }: TagPrintModalProps) {
    if (!isOpen || !selectedItem) return null;

    const renderTagLayout = (isCopy = false) => (
        <div className={`w-full flex gap-6 ${printFormat === 'A4' ? 'h-[130mm]' : 'h-full'} ${!isCopy && printFormat === 'A4' ? 'border-b-2 border-dashed border-slate-300 pb-6 mb-6' : ''}`}>
            {/* Left Side: Tag Info */}
            <div className="flex-[1.2] flex flex-col border-r-2 border-dashed border-slate-300 pr-6 relative">
                <div className="text-center border-b-2 border-slate-200 pb-3 mb-4 shrink-0">
                    <h2 className="text-2xl font-black text-[#111f42] tracking-widest uppercase m-0 font-mono leading-none">FurnitureMES</h2>
                    <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest m-0 mt-1">Inventory Reservation ID Card</p>
                </div>
                <div className="flex justify-between items-start mb-4 shrink-0">
                    <div className="w-28 h-28 bg-slate-50 border border-slate-200 flex items-center justify-center p-2 rounded shrink-0">
                        {qrCodeUrl ? <img src={qrCodeUrl} className="w-full h-full object-contain" alt="QR" /> : <QrIcon size={80} className="text-slate-200" />}
                    </div>
                    <div className="text-right flex flex-col items-end justify-start min-w-0 flex-1 pl-4">
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Reserved Qty</span>
                        <span className="text-6xl font-black text-[#111f42] leading-none font-mono tracking-tighter truncate max-w-full">{selectedItem?.qty}</span>
                        <span className="text-sm font-bold text-[#ab8a3b] uppercase mt-1">{selectedItem?.unit || 'PCS'}</span>
                    </div>
                </div>
                <div className="text-center mb-4 flex-1 flex items-center justify-center">
                    <h3 className="text-xl font-black text-[#111f42] leading-tight line-clamp-2 uppercase">{selectedItem?.productName}</h3>
                </div>
                <div className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-2 text-[11px] font-mono mt-auto shrink-0">
                    <div className="font-bold text-slate-400 uppercase">SKU:</div><div className="font-black text-[#111f42] text-[13px]">{selectedItem?.sku}</div>
                    <div className="font-bold text-slate-400 uppercase">LOT:</div><div className="font-black text-[#111f42]">{selectedItem?.lot || '-'}</div>
                    <div className="font-bold text-slate-400 uppercase">LOC:</div><div className="font-black text-[#E3624A] text-[14px]">{selectedItem?.location || '-'}</div>
                    <div className="font-bold text-slate-400 uppercase">DATE:</div><div className="font-black text-[#111f42]">{selectedItem?.date} <span className="text-slate-400 ml-4">SO:</span> {selectedItem?.soRef}</div>
                </div>
                <div className="mt-4 flex flex-col items-center justify-center pt-3 border-t border-slate-200 shrink-0 h-16">
                    {barcodeUrl ? <img src={barcodeUrl} alt="barcode" className="h-full object-contain" /> : <div className="h-full flex items-center justify-center text-slate-300 font-mono text-[8px]">BARCODE LOADING...</div>}
                </div>
            </div>

            {/* Right Side: Withdrawal Log */}
            <div className="flex-[0.8] flex flex-col border-2 border-[#111f42] rounded-lg overflow-hidden h-full font-sans">
                <div className="bg-[#111f42] text-white text-center py-2 font-black text-[10px] uppercase tracking-widest font-mono shrink-0">
                    PICKING LOG บันทึกการเบิก
                </div>
                <table className="w-full text-center text-[10px] font-mono h-full flex-1 table-fixed border-collapse">
                    <thead className="bg-slate-50 border-b border-[#111f42]">
                        <tr>
                            <th className="py-2 border-r border-[#111f42] w-[30%] font-bold">DATE</th>
                            <th className="py-2 border-r border-[#111f42] w-[20%] font-bold">QTY</th>
                            <th className="py-2 border-r border-[#111f42] w-[30%] font-bold">WHO</th>
                            <th className="py-2 w-[20%] font-bold">BAL.</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-[#111f42]/30">
                        {[...Array(10)].map((_, i) => (
                            <tr key={i}>
                                <td className="py-2 border-r border-[#111f42]/30"></td>
                                <td className="py-2 border-r border-[#111f42]/30"></td>
                                <td className="py-2 border-r border-[#111f42]/30"></td>
                                <td></td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                <div className="bg-slate-50 text-center py-1.5 text-[8px] text-slate-500 font-bold border-t border-[#111f42] shrink-0 italic leading-none">
                    * Update balance after each picking
                </div>
            </div>
        </div>
    );

    return (
        <div className="modal-overlay z-[80000]" onClick={closeModal}>
            
            <DraggableWrapper>
                  <div className="bg-white rounded-2xl w-full max-w-4xl shadow-2xl overflow-hidden flex flex-col animate-in zoom-in duration-200 max-h-[90vh]" onClick={e => e.stopPropagation()}>
                            <div className="px-6 py-2.5 flex justify-between items-center bg-[#111f42] text-white shrink-0 border-b-4 border-[#ab8a3b]">
                                <h2 className="text-sm font-black uppercase tracking-widest flex items-center gap-2 font-mono"><Printer size={16} className="text-[#ab8a3b]"/> TAG PRINT PREVIEW</h2>
                                <div className="flex bg-white/10 p-0.5 rounded-lg overflow-hidden shrink-0">
                                    <button onClick={() => setPrintFormat('A5')} className={`px-3 py-1.5 text-[9px] font-black uppercase transition-all ${printFormat === 'A5' ? 'bg-[#111f42] text-white shadow-sm' : 'text-slate-400 hover:text-white'}`}>A5 (Split)</button>
                                    <button onClick={() => setPrintFormat('A4')} className={`px-3 py-1.5 text-[9px] font-black uppercase transition-all ${printFormat === 'A4' ? 'bg-[#111f42] text-white shadow-sm' : 'text-slate-400 hover:text-white'}`}>A4 (2-Up)</button>
                                </div>
                                <button onClick={closeModal} className="hover:bg-white/20 p-1.5 rounded-lg transition-colors ml-4"><X size={20} /></button>
                            </div>
                            <div className="flex-1 overflow-y-auto p-5 bg-slate-200 flex justify-center print:p-0 print:bg-white master-custom-scrollbar">
                                <div id="tag-print-area" className="bg-white shadow-md font-sans relative" style={{ width: '210mm', minHeight: printFormat === 'A5' ? '148.5mm' : '297mm', padding: printFormat === 'A5' ? '10mm' : '15mm', border: '1px dashed #ccc', margin: '0 auto' }}>
                                    {renderTagLayout()}
                                    {printFormat === 'A4' && renderTagLayout(true)}
                                </div>
                            </div>
                            <div className="p-4 bg-white border-t flex justify-end gap-3 shrink-0 no-print rounded-b-2xl font-mono">
                                <button onClick={closeModal} className="px-6 py-2.5 text-[11px] font-black uppercase text-slate-500 hover:bg-slate-50 transition-colors tracking-widest border border-transparent leading-none">Cancel</button>
                                <button onClick={executePrintTag} className="px-5 py-2.5 bg-[#ab8a3b] text-[#111f42] rounded-xl font-black text-[11px] shadow-md uppercase flex items-center gap-2 hover:brightness-110 transition-all tracking-widest leading-none"><Printer size={16}/> PRINT TAG</button>
                            </div>
                        </div>
                </DraggableWrapper>

        </div>
    );
}

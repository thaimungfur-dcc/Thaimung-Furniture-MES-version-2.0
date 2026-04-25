import React from 'react';
import { X, Printer, QrCode } from 'lucide-react';
import { DraggableWrapper } from "../../../components/shared/DraggableWrapper";

export const PrintTagModal = ({ showTagModal, activeTransaction, setShowTagModal, printFormat, setPrintFormat, qrCodeUrl, barcodeUrl, executePrintTag, formatDateSafe }: any) => {
    if (!showTagModal || !activeTransaction) return null;

    return (
        <div className="modal-overlay no-print" onClick={() => setShowTagModal(false)}>
            
            <DraggableWrapper>
                  <div className="bg-white rounded-2xl w-full max-w-4xl shadow-2xl flex flex-col animate-in zoom-in-95 duration-200 overflow-hidden" onClick={e => e.stopPropagation()}>
                            <div className="px-6 py-2.5 flex justify-between items-center bg-[#111f42] text-white shrink-0 border-b-4 border-[#ab8a3b]">
                                <h2 className="text-sm font-black uppercase tracking-widest flex items-center gap-2 font-mono"><Printer size={16} className="text-[#ab8a3b]"/> PRINT PREVIEW</h2>
                                <div className="flex bg-white/10 p-0.5 rounded-lg overflow-hidden">
                                    <button onClick={() => setPrintFormat('A5')} className={`px-3 py-1.5 text-[9px] font-black uppercase ${printFormat === 'A5' ? 'bg-[#111f42] text-white shadow-sm' : 'text-slate-400 hover:text-white'}`}>A5 (Split)</button>
                                    <button onClick={() => setPrintFormat('A4')} className={`px-3 py-1.5 text-[9px] font-black uppercase ${printFormat === 'A4' ? 'bg-[#111f42] text-white shadow-sm' : 'text-slate-400 hover:text-white'}`}>A4 (2-Up)</button>
                                </div>
                                <button onClick={() => setShowTagModal(false)} className="hover:bg-white/20 p-1.5 rounded-lg transition-colors"><X size={20} /></button>
                            </div>
                            <div className="flex-1 overflow-y-auto p-5 bg-slate-200 flex justify-center print:p-0 print:bg-white master-custom-scrollbar">
                                {/* Visual Preview Container */}
                                <div id="tag-print-area" className="bg-white shadow-md font-sans relative" style={{ width: printFormat === 'A5' ? '210mm' : '210mm', minHeight: printFormat === 'A5' ? '148.5mm' : '297mm', padding: printFormat === 'A5' ? '10mm' : '15mm', border: '1px dashed #ccc', margin: '0 auto' }}>
                                    {/* Tag 1 */}
                                    <div className={`w-full flex gap-6 ${printFormat === 'A4' ? 'h-[125mm]' : 'h-full'} ${printFormat === 'A4' ? 'border-b-2 border-dashed border-slate-300 pb-6 mb-6' : ''}`}>
                                        <div className="flex-[1.2] flex flex-col border-r-2 border-dashed border-slate-300 pr-6 relative">
                                            <div className="text-center border-b-2 border-slate-200 pb-3 mb-4 shrink-0">
                                                <h2 className="text-2xl font-black text-[#111f42] tracking-widest uppercase m-0 font-mono leading-none">Thai Mungmee</h2>
                                                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest m-0 mt-1">Goods Receipt Identification</p>
                                            </div>
                                            <div className="flex justify-between items-start mb-4 shrink-0">
                                                <div className="w-28 h-28 bg-slate-50 border border-slate-200 flex items-center justify-center p-2 rounded shrink-0">
                                                    {qrCodeUrl ? <img src={qrCodeUrl} className="w-full h-full object-contain" alt="QR" /> : <QrCode size={90} className="text-slate-300" strokeWidth={1.5} />}
                                                </div>
                                                <div className="text-right flex flex-col items-end justify-start min-w-0 flex-1 pl-4">
                                                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Quantity</span>
                                                    <span className="text-6xl font-black text-[#111f42] leading-none font-mono tracking-tighter truncate max-w-full">{String(activeTransaction.qty)}</span>
                                                    <span className="text-sm font-bold text-[#ab8a3b] uppercase mt-1">{String(activeTransaction.unit || 'PCS')}</span>
                                                </div>
                                            </div>
                                            <div className="text-center mb-4 flex-1 flex items-center justify-center">
                                                <h3 className="text-xl font-black text-[#111f42] leading-tight line-clamp-2">{String(activeTransaction.itemName)}</h3>
                                            </div>
                                            <div className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-2 text-[11px] font-mono mt-auto shrink-0">
                                                <div className="font-bold text-slate-400 uppercase">SKU:</div><div className="font-black text-[#111f42] text-[13px]">{String(activeTransaction.sku)}</div>
                                                <div className="font-bold text-slate-400 uppercase">LOT:</div><div className="font-black text-[#111f42]">{String(activeTransaction.lotNo || '-')}</div>
                                                <div className="font-bold text-slate-400 uppercase">LOC:</div><div className="font-black text-[#E3624A] text-[14px]">{String(activeTransaction.warehouseName)} / {String(activeTransaction.location || '-')}</div>
                                                <div className="font-bold text-slate-400 uppercase">MFG:</div><div className="font-black text-[#111f42]">{formatDateSafe(activeTransaction.mfgDate)} <span className="text-slate-400 ml-4">EXP:</span> {activeTransaction.expDate ? formatDateSafe(activeTransaction.expDate) : '-'}</div>
                                            </div>
                                            <div className="mt-4 flex flex-col items-center justify-center pt-3 border-t border-slate-200 shrink-0 h-16">
                                                {barcodeUrl ? <img src={barcodeUrl} alt="barcode" className="h-full object-contain" /> : <div className="h-full flex items-center justify-center text-slate-300 font-mono text-[8px]">BARCODE</div>}
                                            </div>
                                            <div className="text-center mt-1 shrink-0">
                                                <span className="text-[8px] text-slate-400 font-medium">Ref: {String(activeTransaction.refNo)} | By: {String(activeTransaction.by)}</span>
                                            </div>
                                        </div>
                                        <div className="flex-[0.8] flex flex-col border-2 border-[#111f42] rounded-lg overflow-hidden h-full">
                                            <div className="bg-[#111f42] text-white text-center py-2 font-black text-[10px] uppercase tracking-widest font-mono shrink-0">
                                                PARTIAL WITHDRAWAL LOG บันทึกการเบิก
                                            </div>
                                            <table className="w-full text-center text-[10px] font-mono h-full flex-1 table-fixed">
                                                <thead className="bg-slate-50 border-b border-[#111f42]">
                                                    <tr>
                                                        <th className="py-2 border-r border-[#111f42] w-[30%]">DATE</th>
                                                        <th className="py-2 border-r border-[#111f42] w-[20%]">QTY</th>
                                                        <th className="py-2 border-r border-[#111f42] w-[30%]">WHO</th>
                                                        <th className="py-2 w-[20%]">BAL.</th>
                                                    </tr>
                                                </thead>
                                                <tbody className="divide-y divide-[#111f42]/30">
                                                    {[...Array(10)]?.map((_, i) => (
                                                        <tr key={i}>
                                                            <td className="py-2.5 border-r border-[#111f42]/30"></td>
                                                            <td className="py-2.5 border-r border-[#111f42]/30"></td>
                                                            <td className="py-2.5 border-r border-[#111f42]/30"></td>
                                                            <td></td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                            <div className="bg-slate-50 text-center py-1.5 text-[8px] text-slate-500 font-bold border-t border-[#111f42] shrink-0">
                                                * กรุณาลงยอดคงเหลือทุกครั้ง / Update balance after picking
                                            </div>
                                        </div>
                                    </div>
                                    {/* Tag 2 (For A4 2-Up) */}
                                    {printFormat === 'A4' && (
                                        <div className="w-full flex gap-6 h-[125mm]">
                                            <div className="flex-[1.2] flex flex-col border-r-2 border-dashed border-slate-300 pr-6 relative">
                                                <div className="text-center border-b-2 border-slate-200 pb-3 mb-4 shrink-0">
                                                    <h2 className="text-2xl font-black text-[#111f42] tracking-widest uppercase m-0 font-mono leading-none">Thai Mungmee</h2>
                                                    <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest m-0 mt-1">Goods Receipt Identification</p>
                                                </div>
                                                <div className="flex justify-between items-start mb-4 shrink-0">
                                                    <div className="w-28 h-28 bg-slate-50 border border-slate-200 flex items-center justify-center p-2 rounded shrink-0">
                                                        {qrCodeUrl ? <img src={qrCodeUrl} className="w-full h-full object-contain" alt="QR" /> : <QrCode size={90} className="text-slate-300" strokeWidth={1.5} />}
                                                    </div>
                                                    <div className="text-right flex flex-col items-end justify-start min-w-0 flex-1 pl-4">
                                                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Quantity</span>
                                                        <span className="text-6xl font-black text-[#111f42] leading-none font-mono tracking-tighter truncate max-w-full">{String(activeTransaction.qty)}</span>
                                                        <span className="text-sm font-bold text-[#ab8a3b] uppercase mt-1">{String(activeTransaction.unit || 'PCS')}</span>
                                                    </div>
                                                </div>
                                                <div className="text-center mb-4 flex-1 flex items-center justify-center">
                                                    <h3 className="text-xl font-black text-[#111f42] leading-tight line-clamp-2">{String(activeTransaction.itemName)}</h3>
                                                </div>
                                                <div className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-2 text-[11px] font-mono mt-auto shrink-0">
                                                    <div className="font-bold text-slate-400 uppercase">SKU:</div><div className="font-black text-[#111f42] text-[13px]">{String(activeTransaction.sku)}</div>
                                                    <div className="font-bold text-slate-400 uppercase">LOT:</div><div className="font-black text-[#111f42]">{String(activeTransaction.lotNo || '-')}</div>
                                                    <div className="font-bold text-slate-400 uppercase">LOC:</div><div className="font-black text-[#E3624A] text-[14px]">{String(activeTransaction.warehouseName)} / {String(activeTransaction.location || '-')}</div>
                                                    <div className="font-bold text-slate-400 uppercase">MFG:</div><div className="font-black text-[#111f42]">{formatDateSafe(activeTransaction.mfgDate)} <span className="text-slate-400 ml-4">EXP:</span> {activeTransaction.expDate ? formatDateSafe(activeTransaction.expDate) : '-'}</div>
                                                </div>
                                                <div className="mt-4 flex flex-col items-center justify-center pt-3 border-t border-slate-200 shrink-0 h-16">
                                                    {barcodeUrl ? <img src={barcodeUrl} alt="barcode" className="h-full object-contain" /> : <div className="h-full flex items-center justify-center text-slate-300 font-mono text-[8px]">BARCODE</div>}
                                                </div>
                                                <div className="text-center mt-1 shrink-0">
                                                    <span className="text-[8px] text-slate-400 font-medium">Ref: {String(activeTransaction.refNo)} | By: {String(activeTransaction.by)}</span>
                                                </div>
                                            </div>
                                            <div className="flex-[0.8] flex flex-col border-2 border-[#111f42] rounded-lg overflow-hidden h-full">
                                                <div className="bg-[#111f42] text-white text-center py-2 font-black text-[10px] uppercase tracking-widest font-mono shrink-0">
                                                    PARTIAL WITHDRAWAL LOG บันทึกการเบิก
                                                </div>
                                                <table className="w-full text-center text-[10px] font-mono h-full flex-1 table-fixed">
                                                    <thead className="bg-slate-50 border-b border-[#111f42]">
                                                        <tr>
                                                            <th className="py-2 border-r border-[#111f42] w-[30%]">DATE</th>
                                                            <th className="py-2 border-r border-[#111f42] w-[20%]">QTY</th>
                                                            <th className="py-2 border-r border-[#111f42] w-[30%]">WHO</th>
                                                            <th className="py-2 w-[20%]">BAL.</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody className="divide-y divide-[#111f42]/30">
                                                        {[...Array(10)]?.map((_, i) => (
                                                            <tr key={i}>
                                                                <td className="py-2.5 border-r border-[#111f42]/30"></td>
                                                                <td className="py-2.5 border-r border-[#111f42]/30"></td>
                                                                <td className="py-2.5 border-r border-[#111f42]/30"></td>
                                                                <td></td>
                                                            </tr>
                                                        ))}
                                                    </tbody>
                                                </table>
                                                <div className="bg-slate-50 text-center py-1.5 text-[8px] text-slate-500 font-bold border-t border-[#111f42] shrink-0">
                                                    * กรุณาลงยอดคงเหลือทุกครั้ง / Update balance after picking
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                            <div className="p-4 bg-white border-t flex justify-end gap-3 shrink-0 no-print rounded-b-2xl">
                                <button onClick={() => setShowTagModal(false)} className="px-6 py-2.5 text-[11px] font-black uppercase text-slate-500 hover:bg-slate-50 transition-colors tracking-widest font-mono">Cancel</button>
                                <button onClick={executePrintTag} className="px-5 py-2.5 bg-[#ab8a3b] text-white rounded-xl font-black text-[11px] shadow-md uppercase flex items-center gap-2 hover:bg-[#8f712c] transition-colors tracking-widest font-mono"><Printer size={14}/> Print Now</button>
                            </div>
                        </div>
                </DraggableWrapper>

        </div>
    );
};

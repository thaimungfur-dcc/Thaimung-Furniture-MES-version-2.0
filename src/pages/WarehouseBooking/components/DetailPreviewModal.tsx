import React from 'react';
import { PackageCheck, X } from 'lucide-react';
import { DraggableWrapper } from "../../../components/shared/DraggableWrapper";

interface DetailPreviewModalProps {
    isOpen: boolean;
    selectedItem: any;
    closeModal: () => void;
}

export default function DetailPreviewModal({ isOpen, selectedItem, closeModal }: DetailPreviewModalProps) {
    if (!isOpen || !selectedItem) return null;

    return (
        <div className="modal-overlay z-[60000]" onClick={closeModal}>
            
            <DraggableWrapper>
                  <div className="bg-white rounded-2xl w-full max-w-xl border-t-[6px] border-[#ab8a3b] overflow-hidden animate-in zoom-in-95 duration-200" onClick={e => e.stopPropagation()}>
                            <div className="p-4 sm:p-5 bg-[#111f42] flex justify-between items-center text-white shrink-0">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center text-[#ab8a3b] shadow-inner"><PackageCheck size={24} /></div>
                                    <div>
                                        <h3 className="text-xl font-black uppercase tracking-widest leading-none">Booking Summary</h3>
                                        <p className="text-[10px] text-slate-400 font-mono mt-1.5 font-bold tracking-widest uppercase leading-none">ID: {selectedItem.bookingId}</p>
                                    </div>
                                </div>
                                <button onClick={closeModal} className="p-1.5 text-slate-400 hover:text-white transition-colors leading-none"><X size={24} /></button>
                            </div>
                            <div className="p-5 bg-[#F9F7F6] space-y-4 text-[12px] font-sans">
                                <div className="bg-white p-4 sm:p-5 rounded-3xl border border-slate-200 shadow-sm grid grid-cols-2 gap-6">
                                    <div className="col-span-2 border-b border-slate-100 pb-3 mb-1 text-right font-sans">
                                        <div className="text-[10px] font-black text-slate-400 uppercase mb-1.5 tracking-widest leading-none">Product Information</div>
                                        <div className="text-xl font-black text-[#111f42] leading-tight uppercase font-sans">{selectedItem.productName}</div>
                                        <div className="text-sm font-mono font-bold text-[#ab8a3b] mt-1 leading-none">{selectedItem.sku}</div>
                                    </div>
                                    <div className="space-y-1 font-sans">
                                        <label className="block text-[10px] font-black text-slate-400 uppercase leading-none">Customer</label>
                                        <div className="text-[13px] font-bold text-[#111f42] truncate leading-none">{selectedItem.customer}</div>
                                    </div>
                                    <div className="space-y-1 text-right font-sans">
                                        <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none">Reserved Units</label>
                                        <div className="text-2xl font-black text-[#E3624A] font-mono leading-none">{selectedItem.qty} <span className="text-[10px] font-sans text-slate-400 tracking-widest uppercase font-bold">PCS</span></div>
                                    </div>
                                    <div className="space-y-1 font-sans">
                                        <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none">SO Reference</label>
                                        <div className="text-[13px] font-mono font-black text-[#111f42] leading-none">{selectedItem.soRef}</div>
                                    </div>
                                    <div className="space-y-1 text-right font-sans">
                                        <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none">Warehouse Lot</label>
                                        <div className="text-[13px] font-mono font-black text-[#72A09E] leading-none">{selectedItem.lot || '-'}</div>
                                    </div>
                                </div>
                            </div>
                            <div className="p-4 sm:p-5 border-t bg-slate-50 flex justify-end gap-3 rounded-b-2xl">
                                <button onClick={closeModal} className="px-6 py-2.5 text-slate-400 font-black text-[11px] uppercase tracking-widest hover:text-[#111f42] font-mono transition-all leading-none">Close</button>
                            </div>
                        </div>
                </DraggableWrapper>

        </div>
    );
}

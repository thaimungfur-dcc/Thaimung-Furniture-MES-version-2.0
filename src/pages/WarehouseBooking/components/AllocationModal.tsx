import React from 'react';
import { PackageCheck, X, CheckCircle } from 'lucide-react';

interface AllocationModalProps {
    isOpen: boolean;
    selectedItem: any;
    form: any;
    setForm: (form: any) => void;
    closeModal: () => void;
    submitBooking: (isFinal?: boolean) => void;
}

export default function AllocationModal({ isOpen, selectedItem, form, setForm, closeModal, submitBooking }: AllocationModalProps) {
    if (!isOpen || !selectedItem) return null;

    const formatNum = (v: any) => (Number(v) || 0).toLocaleString();

    return (
        <div className="modal-overlay z-[50000]" onClick={closeModal}>
            <div className="bg-white rounded-[2rem] border-t-[6px] border-[#ab8a3b] w-full max-w-2xl shadow-2xl flex flex-col animate-in zoom-in-95 duration-300 max-h-[85vh]" onClick={e => e.stopPropagation()}>
                <div className="p-5 bg-[#111f42] text-white flex justify-between items-center shrink-0">
                    <div className="flex items-center gap-4">
                        <div className="w-11 h-11 bg-white/10 flex items-center justify-center rounded-xl shadow-inner text-[#ab8a3b]"><PackageCheck size={24} /></div>
                        <div>
                            <h3 className="text-lg font-black uppercase tracking-tight leading-none">Allocate Stock</h3>
                            <p className="text-[10px] text-slate-400 font-mono mt-1 font-bold tracking-widest uppercase leading-none">ID: {selectedItem.bookingId} • SO: {selectedItem.soRef}</p>
                        </div>
                    </div>
                    <button onClick={closeModal} className="w-8 h-8 rounded-lg hover:bg-white/20 flex items-center justify-center text-slate-400 hover:text-white transition-all"><X size={20}/></button>
                </div>
                <div className="flex-1 overflow-y-auto master-custom-scrollbar p-6 bg-[#F9F7F6] space-y-6">
                    <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-6">
                        <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 flex justify-between items-center">
                            <div>
                                <div className="text-[9px] text-slate-400 font-bold uppercase mb-1">Target Item</div>
                                <div className="font-black text-[#111f42] text-[13px] uppercase">{selectedItem.sku}</div>
                                <div className="text-[12px] text-slate-500 font-medium leading-none mt-1">{selectedItem.productName}</div>
                            </div>
                            <div className="text-right">
                                <div className="text-[9px] text-slate-400 font-bold uppercase mb-1 tracking-widest">Remaining</div>
                                <div className="text-3xl font-mono font-black text-[#E3624A] leading-none">{formatNum(selectedItem.qty - selectedItem.booked)}</div>
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-1.5">
                                <label className="block text-[9px] font-black text-[#ab8a3b] uppercase tracking-widest font-mono leading-none">Allocation Qty</label>
                                <input type="number" value={form.qty} onChange={e => setForm({...form, qty: e.target.value})} className="input-primary text-right font-black text-2xl h-[50px] font-mono border-[#ab8a3b]/40 focus:border-[#ab8a3b]" />
                            </div>
                            <div className="space-y-1.5">
                                <label className="block text-[9px] font-black text-slate-400 uppercase tracking-widest font-mono leading-none">Bin Location</label>
                                <input type="text" value={form.location} onChange={e => setForm({...form, location: e.target.value})} className="input-primary h-[50px] font-mono uppercase font-bold" placeholder="WH-X-00" />
                            </div>
                        </div>
                    </div>
                </div>
                <div className="p-6 bg-white border-t flex justify-end gap-3 rounded-b-2xl shrink-0 px-8">
                    <button onClick={closeModal} className="text-[11px] font-black uppercase tracking-widest text-slate-400 hover:text-[#111f42] transition-colors font-mono px-4 leading-none">Cancel</button>
                    <button onClick={() => submitBooking(true)} className="bg-[#E3624A] text-white px-8 py-2.5 rounded-xl font-black text-[11px] uppercase tracking-widest shadow-lg shadow-[#E3624A]/20 hover:brightness-110 transition-all flex items-center gap-2 font-mono h-11"><CheckCircle size={16} /> FINALIZE BOOKING</button>
                </div>
            </div>
        </div>
    );
}

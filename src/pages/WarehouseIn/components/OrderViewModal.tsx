import React from 'react';
import { X, FileText } from 'lucide-react';

export const OrderViewModal = ({ showOrderModal, viewOrderData, setShowOrderModal, getStatusClass }: any) => {
    if (!showOrderModal || !viewOrderData) return null;

    return (
        <div className="modal-overlay z-[60000]" onClick={() => setShowOrderModal(false)}>
            <div className="bg-white rounded-2xl w-full max-w-2xl border-t-[6px] border-[#111f42] shadow-2xl flex flex-col animate-in zoom-in-95 duration-200 max-h-[85vh]" onClick={e => e.stopPropagation()}>
                <div className="p-5 bg-[#111f42] text-white border-b border-slate-100 flex justify-between items-center shrink-0">
                    <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-white/10 flex items-center justify-center rounded-xl shadow-inner text-white"><FileText size={20} /></div>
                        <div>
                            <h3 className="text-lg font-black uppercase tracking-tight leading-none">Document Detail</h3>
                            <p className="text-[10px] text-slate-400 font-mono mt-1 font-bold tracking-widest uppercase">{String(viewOrderData.joNo || viewOrderData.poNo)}</p>
                        </div>
                    </div>
                    <button onClick={() => setShowOrderModal(false)} className="w-8 h-8 rounded-lg hover:bg-white/20 flex items-center justify-center text-slate-400 hover:text-white transition-all"><X size={20}/></button>
                </div>
                <div className="flex-1 overflow-y-auto master-custom-scrollbar p-6 bg-[#F9F7F6]">
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 space-y-5">
                        <div className="flex justify-between items-start border-b border-slate-100 pb-4">
                            <div>
                                <label className="block text-[9px] font-black text-slate-400 uppercase tracking-widest font-mono mb-1">SKU</label>
                                <div className="font-black text-[#111f42] text-lg font-mono">{String(viewOrderData.sku)}</div>
                            </div>
                            <div className="text-right">
                                <label className="block text-[9px] font-black text-slate-400 uppercase tracking-widest font-mono mb-1">Product Name</label>
                                <div className="font-bold text-slate-600 text-sm">{String(viewOrderData.productName || viewOrderData.itemName)}</div>
                            </div>
                        </div>
                        <div className="grid grid-cols-3 gap-5">
                            <div className="space-y-1.5">
                                <label className="block text-[9px] font-black text-slate-400 uppercase tracking-widest font-mono">Total Target</label>
                                <div className="font-black font-mono text-[#111f42] text-xl">{Number(viewOrderData.qty).toLocaleString()}</div>
                            </div>
                            <div className="space-y-1.5">
                                <label className="block text-[9px] font-black text-slate-400 uppercase tracking-widest font-mono">Received</label>
                                <div className="font-black font-mono text-[#10b981] text-xl">{Number(viewOrderData.received).toLocaleString()}</div>
                            </div>
                            <div className="space-y-1.5">
                                <label className="block text-[9px] font-black text-slate-400 uppercase tracking-widest font-mono">Balance</label>
                                <div className="font-black font-mono text-[#E3624A] text-xl">{Math.max(0, viewOrderData.qty - viewOrderData.received).toLocaleString()}</div>
                            </div>
                            <div className="space-y-1.5 col-span-3 pt-3 border-t border-slate-50">
                                <label className="block text-[9px] font-black text-slate-400 uppercase tracking-widest font-mono mb-1">Status</label>
                                <span className={`badge ${getStatusClass(viewOrderData.status)}`}>{String(viewOrderData.status)}</span>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="p-5 bg-slate-50 border-t flex justify-end items-center rounded-b-2xl shrink-0 px-6">
                    <button onClick={() => setShowOrderModal(false)} className="text-[11px] font-black uppercase tracking-widest text-slate-400 hover:text-[#111f42] transition-colors font-mono">Close</button>
                </div>
            </div>
        </div>
    );
};

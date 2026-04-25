import React from 'react';
import { X, Save, FileText } from 'lucide-react';
import { DraggableWrapper } from "../../../components/shared/DraggableWrapper";

export const TransactionDetailModal = ({ showTransactionModal, activeTransaction, setShowTransactionModal, setActiveTransaction, updateTransaction, warehouses }: any) => {
    if (!showTransactionModal || !activeTransaction) return null;

    return (
        <div className="modal-overlay no-print" onClick={() => setShowTransactionModal(false)}>
            
            <DraggableWrapper>
                  <div className="bg-white rounded-2xl w-full max-w-3xl border-t-[6px] border-[#111f42] shadow-2xl flex flex-col animate-in zoom-in-95 duration-200 max-h-[85vh]" onClick={e => e.stopPropagation()}>
                            <div className="p-5 bg-[#111f42] text-white border-b border-slate-100 flex justify-between items-center shrink-0">
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 bg-white/10 flex items-center justify-center rounded-xl shadow-inner text-white"><FileText size={20} /></div>
                                    <div>
                                        <h3 className="text-lg font-black uppercase tracking-tight leading-none">Transaction Detail</h3>
                                        <p className="text-[10px] text-slate-400 font-mono mt-1 font-bold tracking-widest uppercase">{String(activeTransaction.transId)} • Editable Mode</p>
                                    </div>
                                </div>
                                <button onClick={() => setShowTransactionModal(false)} className="w-8 h-8 rounded-lg hover:bg-white/20 flex items-center justify-center text-slate-400 hover:text-white transition-all"><X size={20}/></button>
                            </div>
                            <div className="flex-1 overflow-y-auto master-custom-scrollbar p-4 sm:p-5 bg-[#F9F7F6]">
                                <div className="bg-white p-4 sm:p-5 rounded-2xl shadow-sm border border-slate-200 space-y-5">
                                    <div className="flex justify-between items-start border-b border-slate-100 pb-4">
                                        <div>
                                            <label className="block text-[9px] font-black text-slate-400 uppercase tracking-widest font-mono mb-1">SKU</label>
                                            <div className="font-black text-[#111f42] text-lg font-mono">{String(activeTransaction.sku)}</div>
                                        </div>
                                        <div className="text-right">
                                            <label className="block text-[9px] font-black text-slate-400 uppercase tracking-widest font-mono mb-1">Product Name</label>
                                            <div className="font-bold text-slate-600 text-sm">{String(activeTransaction.itemName)}</div>
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-3 gap-5">
                                        <div className="space-y-1.5">
                                            <label className="block text-[9px] font-black text-slate-400 uppercase tracking-widest font-mono">QTY</label>
                                            <input type="number" value={activeTransaction.qty} onChange={e=>setActiveTransaction({...activeTransaction, qty: e.target.value})} className="input-primary font-black font-mono text-[#111f42] h-10" />
                                        </div>
                                        <div className="space-y-1.5">
                                            <label className="block text-[9px] font-black text-slate-400 uppercase tracking-widest font-mono">Warehouse</label>
                                            <select value={activeTransaction.warehouseName} onChange={e=>setActiveTransaction({...activeTransaction, warehouseName: e.target.value})} className="input-primary font-bold h-10">
                                                {warehouses.slice(1).map((w: string) => <option key={w} value={w}>{w}</option>)}
                                            </select>
                                        </div>
                                        <div className="space-y-1.5">
                                            <label className="block text-[9px] font-black text-slate-400 uppercase tracking-widest font-mono">Location</label>
                                            <input type="text" value={activeTransaction.location} onChange={e=>setActiveTransaction({...activeTransaction, location: e.target.value})} className="input-primary font-mono h-10" />
                                        </div>
                                        <div className="space-y-1.5">
                                            <label className="block text-[9px] font-black text-slate-400 uppercase tracking-widest font-mono">Lot No.</label>
                                            <input type="text" value={activeTransaction.lotNo} onChange={e=>setActiveTransaction({...activeTransaction, lotNo: e.target.value})} className="input-primary font-mono h-10" />
                                        </div>
                                        <div className="space-y-1.5">
                                            <label className="block text-[9px] font-black text-slate-400 uppercase tracking-widest font-mono">MFG</label>
                                            <input type="date" value={activeTransaction.mfgDate} onChange={e=>setActiveTransaction({...activeTransaction, mfgDate: e.target.value})} className="input-primary font-mono h-10" />
                                        </div>
                                        <div className="space-y-1.5">
                                            <label className="block text-[9px] font-black text-slate-400 uppercase tracking-widest font-mono">EXP</label>
                                            <input type="date" value={activeTransaction.expDate || ''} onChange={e=>setActiveTransaction({...activeTransaction, expDate: e.target.value})} className="input-primary font-mono h-10" />
                                        </div>
                                        <div className="col-span-3 space-y-1.5 border-t border-slate-100 pt-4 mt-1">
                                            <label className="block text-[9px] font-black text-slate-400 uppercase tracking-widest font-mono">Remark</label>
                                            <input type="text" value={activeTransaction.remark || ''} onChange={e=>setActiveTransaction({...activeTransaction, remark: e.target.value})} className="input-primary font-medium" />
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="p-5 bg-slate-50 border-t flex justify-between items-center rounded-b-2xl shrink-0 px-6">
                                <button onClick={() => setShowTransactionModal(false)} className="text-[11px] font-black uppercase tracking-widest text-slate-400 hover:text-[#111f42] transition-colors font-mono">Close</button>
                                <button onClick={updateTransaction} className="px-5 py-2.5 bg-[#111f42] text-white rounded-lg font-black text-[11px] uppercase tracking-widest shadow-md hover:brightness-110 transition-all flex items-center gap-2 font-mono">
                                    <Save size={14}/> UPDATE TRANSACTION
                                </button>
                            </div>
                        </div>
                </DraggableWrapper>

        </div>
    );
};

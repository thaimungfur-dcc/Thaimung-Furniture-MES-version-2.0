import React from 'react';
import { X, Save, CheckCircle2, Boxes, Trash2 } from 'lucide-react';
import { DraggableWrapper } from "../../../components/shared/DraggableWrapper";

export const ReceiveFormModal = ({ showModal, closeModal, modalType, selectedItem, form, setForm, receiveTypes, warehouses, productMaster, handleManualItemChange, submitReceive }: any) => {
    if (!showModal) return null;

    return (
        <div className="modal-overlay no-print" onClick={closeModal}>
            
            <DraggableWrapper>
                  <div className={`bg-white rounded-none w-full border-b-8 border-[#ab8a3b] shadow-2xl flex flex-col animate-in zoom-in-95 duration-300 max-h-[90vh] ${modalType === 'MANUAL' ? 'max-w-4xl' : 'max-w-3xl'}`} onClick={e => e.stopPropagation()}>
                            <div className="p-4 sm:p-5 bg-[#111f42] text-white flex justify-between items-center shrink-0">
                                <div className="flex items-center gap-6">
                                    <div className="w-12 h-12 bg-white/5 border border-white/10 flex items-center justify-center rounded-none shadow-inner text-[#ab8a3b]"><Boxes size={28} /></div>
                                    <div>
                                        <h3 className="text-xl font-black uppercase tracking-[0.1em] font-mono leading-none">{modalType === 'MANUAL' ? 'Direct Stock In' : 'Receive from Document'}</h3>
                                        <p className="text-[10px] text-[#ab8a3b] font-mono mt-2 font-black tracking-[0.2em] uppercase opacity-80">{selectedItem ? `Reference: ${selectedItem.joNo || selectedItem.poNo}` : 'MANUAL INVENTORY ENTRY - DIRECT LEDGER'}</p>
                                    </div>
                                </div>
                                <button onClick={closeModal} className="w-10 h-10 rounded-none border border-white/10 hover:bg-white/20 flex items-center justify-center text-slate-400 hover:text-white transition-all"><X size={20}/></button>
                            </div>
                            
                            <div className="flex-1 overflow-y-auto master-custom-scrollbar p-4 sm:p-5 bg-[#f8fafc] font-sans">
                                <div className="bg-white p-5 border-2 border-slate-100 shadow-sm space-y-5 rounded-none">
                                    <div className="grid grid-cols-2 gap-5">
                                        <div className="space-y-2">
                                            <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] font-mono">Transaction Timestamp</label>
                                            <input type="datetime-local" value={form.date} onChange={e => setForm({...form, date: e.target.value})} className="input-primary w-full text-[12px] font-mono font-black border-2 focus:border-[#ab8a3b] rounded-none" />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] font-mono">Transaction Type</label>
                                            <select value={form.receiveType} onChange={e => setForm({...form, receiveType: e.target.value})} className="input-primary w-full cursor-pointer font-black border-2 border-slate-200 bg-slate-50 uppercase tracking-widest text-[11px] rounded-none focus:border-[#ab8a3b]" disabled={modalType !== 'MANUAL'}>
                                                {receiveTypes.map((t: string) => <option key={t} value={t}>{t}</option>)}
                                            </select>
                                        </div>
                                    </div>
                                    
                                    {modalType !== 'MANUAL' ? (
                                        <div className="space-y-5">
                                            <div className="p-5 bg-white border-2 border-slate-100 flex justify-between items-center rounded-none shadow-sm">
                                                <div>
                                                    <div className="text-[10px] text-slate-400 font-black uppercase tracking-[0.2em] mb-2 font-mono">Target Logistics Item</div>
                                                    <div className="font-black text-[#111f42] text-lg font-mono tracking-tighter uppercase">{String(selectedItem?.sku)}</div>
                                                    <div className="text-[12px] text-[#ab8a3b] font-black mt-1 uppercase tracking-wider">{String(selectedItem?.productName || selectedItem?.itemName)}</div>
                                                </div>
                                                <div className="text-right">
                                                    <div className="text-[10px] text-slate-400 font-black uppercase tracking-[0.2em] mb-2 font-mono">Pending Balance</div>
                                                    <div className="text-4xl font-mono font-black text-[#E3624A] tracking-tighter">{Number(selectedItem?.qty - selectedItem?.received)?.toLocaleString()}</div>
                                                </div>
                                            </div>
                                            <div className="grid grid-cols-2 gap-5">
                                                <div className="space-y-2">
                                                    <label className="block text-[10px] font-black text-[#ab8a3b] uppercase tracking-[0.2em] font-mono">Actual Quantity Received</label>
                                                    <input type="number" value={form.qty} onChange={e => setForm({...form, qty: e.target.value})} className="input-primary text-right font-black text-3xl border-2 border-[#ab8a3b]/50 h-12 font-mono rounded-none focus:border-[#ab8a3b] text-[#111f42]" />
                                                </div>
                                                <div className="space-y-2">
                                                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] font-mono">Logistics Lot Indicator</label>
                                                    <input type="text" value={form.lotNo} onChange={e => setForm({...form, lotNo: e.target.value})} className="input-primary h-12 font-mono font-black border-2 border-slate-200 rounded-none focus:border-[#ab8a3b] uppercase tracking-widest text-lg" placeholder="LOT-ID" />
                                                </div>
                                            </div>
                                            <div className="grid grid-cols-3 gap-5">
                                                <div className="space-y-2">
                                                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] font-mono">Storage Unit</label>
                                                    <select value={form.warehouseName} onChange={e => setForm({...form, warehouseName: e.target.value})} className="input-primary font-black border-2 border-slate-200 rounded-none focus:border-[#ab8a3b] h-10 uppercase tracking-widest">
                                                        {warehouses.slice(1).map((w: string) => <option key={w} value={w}>{w}</option>)}
                                                    </select>
                                                </div>
                                                <div className="space-y-2">
                                                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] font-mono">Internal Location</label>
                                                    <input type="text" value={form.location} onChange={e => setForm({...form, location: e.target.value})} className="input-primary font-mono font-black border-2 border-slate-200 rounded-none focus:border-[#ab8a3b] h-10 uppercase tracking-widest text-center" placeholder="LOC" />
                                                </div>
                                                <div className="space-y-2">
                                                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] font-mono">Manufacture Date</label>
                                                    <input type="date" value={form.mfgDate} onChange={e => setForm({...form, mfgDate: e.target.value})} className="input-primary font-mono font-black border-2 border-slate-200 rounded-none focus:border-[#ab8a3b] h-10" />
                                                </div>
                                            </div>
                                            <div className="space-y-2">
                                                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] font-mono">Supplementary Remarks</label>
                                                <input type="text" value={form.remark} onChange={e => setForm({...form, remark: e.target.value})} className="input-primary font-black border-2 border-slate-200 rounded-none focus:border-[#ab8a3b] h-10 placeholder:opacity-30" placeholder="Optional logistics notes..." />
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="space-y-4">
                                            <div className="flex justify-between items-center border-b-2 border-slate-100 pb-4">
                                                <h4 className="text-[12px] font-black text-[#111f42] uppercase tracking-[0.3em] font-mono">Inventory Receipt Payload</h4>
                                                <button onClick={() => setForm({...form, manualItems: [...form.manualItems, { sku: '', itemName: '', qty: 0, warehouseName: 'FG', location: '', lotNo: '', mfgDate: new Date().toISOString().slice(0, 10), remark: '', expDate: '' }]})} className="text-[10px] bg-[#111f42] text-[#ab8a3b] px-6 py-2.5 rounded-none font-black uppercase tracking-[0.2em] shadow-xl hover:bg-[#0a1229] transition-all flex items-center gap-2 border-b-2 border-[#ab8a3b]">Add New Line Item</button>
                                            </div>
                                            {form.manualItems.map((item: any, idx: number) => (
                                                <div key={idx} className="p-4 sm:p-5 bg-slate-50 border-2 border-slate-100 grid grid-cols-12 gap-4 relative rounded-none shadow-sm">
                                                    <div className="col-span-5">
                                                        <label className="text-[8px] font-black text-slate-400 uppercase block mb-1.5 tracking-widest">Target Logistic Item</label>
                                                        <select value={item.sku} onChange={(e) => {
                                                            const prod = productMaster.find((p: any) => p.sku === e.target.value);
                                                            handleManualItemChange(idx, 'sku', e.target.value);
                                                            handleManualItemChange(idx, 'itemName', prod?.name || '');
                                                        }} className="input-primary text-[10px] font-black border-2 border-slate-200 rounded-none h-10 px-3 uppercase tracking-wider">
                                                            <option value="">-- Select SKU --</option>
                                                            {productMaster.map((p: any) => <option key={p.sku} value={p.sku}>{p.sku} : {p.name}</option>)}
                                                        </select>
                                                    </div>
                                                    <div className="col-span-2">
                                                        <label className="text-[8px] font-black text-slate-400 uppercase block mb-1.5 text-right tracking-widest">Qty</label>
                                                        <input type="number" value={item.qty} onChange={e => handleManualItemChange(idx, 'qty', e.target.value)} className="input-primary text-right font-black border-2 border-[#ab8a3b]/30 rounded-none h-10 px-3 font-mono text-[13px]" />
                                                    </div>
                                                    <div className="col-span-2">
                                                        <label className="text-[8px] font-black text-slate-400 uppercase block mb-1.5 tracking-widest">WH</label>
                                                        <select value={item.warehouseName} onChange={e => handleManualItemChange(idx, 'warehouseName', e.target.value)} className="input-primary text-[10px] font-black border-2 border-slate-200 rounded-none h-10 px-3 uppercase tracking-wider">
                                                            {warehouses.slice(1).map((w: string) => <option key={w} value={w}>{w}</option>)}
                                                        </select>
                                                    </div>
                                                    <div className="col-span-2">
                                                        <label className="text-[8px] font-black text-slate-400 uppercase block mb-1.5 tracking-widest">Lot ID</label>
                                                        <input value={item.lotNo} onChange={e => handleManualItemChange(idx, 'lotNo', e.target.value)} className="input-primary h-10 px-3 font-mono text-[10px] font-black border-2 border-slate-200 rounded-none uppercase tracking-widest" placeholder="LOT" />
                                                    </div>
                                                    <div className="col-span-1 flex items-end justify-center pb-1">
                                                        <button onClick={() => {const n = [...form.manualItems]; n.splice(idx,1); setForm({...form, manualItems:n})}} className="p-2 text-slate-300 hover:text-white hover:bg-rose-500 rounded-none transition-all shadow-sm border border-transparent hover:border-rose-600"><Trash2 size={16}/></button>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="p-5 border-t bg-slate-50 flex justify-between gap-6 shrink-0 z-10 rounded-none items-center">
                                <button onClick={closeModal} className="px-5 py-2.5 text-slate-500 hover:text-[#111f42] text-[12px] font-black hover:bg-slate-200 rounded-none transition-all uppercase tracking-[0.2em] font-mono border border-transparent hover:border-slate-300">Close Form</button>
                                <div className="flex gap-4">
                                    <button onClick={() => submitReceive(false)} className="px-6 py-2.5 bg-white border-2 border-[#111f42] text-[#111f42] hover:bg-slate-50 text-[12px] font-black rounded-none shadow-sm transition-all flex items-center gap-3 uppercase tracking-[0.2em] font-mono">
                                        <Save size={18} /> {modalType === 'MANUAL' ? 'Process Batch' : 'Commit Partial'}
                                    </button>
                                    {modalType !== 'MANUAL' && (
                                        <button onClick={() => submitReceive(true)} className="px-6 py-2.5 bg-[#E3624A] text-white text-[12px] font-black rounded-none shadow-2xl shadow-[#E3624A]/20 transition-all flex items-center gap-3 uppercase tracking-[0.2em] font-mono border-b-4 border-[#c24b33]">
                                            <CheckCircle2 size={18} /> Finalize Receipt
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>
                </DraggableWrapper>

        </div>
    );
};

import React from 'react';
import { X, Save, CheckCircle2, Boxes, Trash2 } from 'lucide-react';

export const ReceiveFormModal = ({ showModal, closeModal, modalType, selectedItem, form, setForm, receiveTypes, warehouses, productMaster, handleManualItemChange, submitReceive }: any) => {
    if (!showModal) return null;

    return (
        <div className="modal-overlay no-print" onClick={closeModal}>
            <div className={`bg-white rounded-2xl w-full border-t-[6px] border-[#ab8a3b] shadow-2xl flex flex-col animate-in zoom-in-95 duration-300 max-h-[90vh] ${modalType === 'MANUAL' ? 'max-w-4xl' : 'max-w-3xl'}`} onClick={e => e.stopPropagation()}>
                <div className="p-5 bg-[#111f42] text-white border-b border-slate-100 flex justify-between items-center shrink-0">
                    <div className="flex items-center gap-4">
                        <div className="w-11 h-11 bg-white/10 flex items-center justify-center rounded-xl shadow-inner text-[#ab8a3b]"><Boxes size={24} /></div>
                        <div>
                            <h3 className="text-lg font-black uppercase tracking-tight leading-none">{modalType === 'MANUAL' ? 'Direct Stock In' : 'Receive from Document'}</h3>
                            <p className="text-[10px] text-slate-400 font-mono mt-1 font-bold tracking-widest uppercase">{selectedItem ? `REF: ${selectedItem.joNo || selectedItem.poNo}` : 'Manual Inventory Entry'}</p>
                        </div>
                    </div>
                    <button onClick={closeModal} className="w-8 h-8 rounded-lg hover:bg-white/20 flex items-center justify-center text-slate-400 hover:text-white transition-all"><X size={20}/></button>
                </div>
                
                <div className="flex-1 overflow-y-auto master-custom-scrollbar p-6 bg-[#F9F7F6] font-sans">
                    <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-200 space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-1.5">
                                <label className="block text-[9px] font-black text-slate-400 uppercase tracking-widest font-mono">Receive Date/Time</label>
                                <input type="datetime-local" value={form.date} onChange={e => setForm({...form, date: e.target.value})} className="input-primary w-full text-[12px] font-mono font-bold" />
                            </div>
                            <div className="space-y-1.5">
                                <label className="block text-[9px] font-black text-slate-400 uppercase tracking-widest font-mono">Receive Type</label>
                                <select value={form.receiveType} onChange={e => setForm({...form, receiveType: e.target.value})} className="input-primary w-full cursor-pointer font-bold bg-slate-50 border-slate-200" disabled={modalType !== 'MANUAL'}>
                                    {receiveTypes.map((t: string) => <option key={t} value={t}>{t}</option>)}
                                </select>
                            </div>
                        </div>
                        
                        {modalType !== 'MANUAL' ? (
                            <div className="space-y-4">
                                <div className="p-4 bg-slate-50 rounded-xl border border-slate-100 flex justify-between items-center">
                                    <div>
                                        <div className="text-[9px] text-slate-400 font-bold uppercase mb-1">Target Product</div>
                                        <div className="font-black text-[#111f42] text-[13px]">{String(selectedItem?.sku)}</div>
                                        <div className="text-[11px] text-slate-500">{String(selectedItem?.productName || selectedItem?.itemName)}</div>
                                    </div>
                                    <div className="text-right">
                                        <div className="text-[9px] text-slate-400 font-bold uppercase mb-1">Remaining</div>
                                        <div className="text-2xl font-mono font-black text-[#E3624A]">{Number(selectedItem?.qty - selectedItem?.received).toLocaleString()}</div>
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-1.5">
                                        <label className="block text-[9px] font-black text-[#ab8a3b] uppercase tracking-widest font-mono">Actual Qty Received</label>
                                        <input type="number" value={form.qty} onChange={e => setForm({...form, qty: e.target.value})} className="input-primary text-right font-black text-2xl border-[#ab8a3b]/50 h-[45px] font-mono" />
                                    </div>
                                    <div className="space-y-1.5">
                                        <label className="block text-[9px] font-black text-slate-400 uppercase tracking-widest font-mono">Lot Number</label>
                                        <input type="text" value={form.lotNo} onChange={e => setForm({...form, lotNo: e.target.value})} className="input-primary h-[45px] font-mono font-bold" placeholder="LOT-XXXX" />
                                    </div>
                                </div>
                                <div className="grid grid-cols-3 gap-4">
                                    <div className="space-y-1.5">
                                        <label className="block text-[9px] font-black text-slate-400 uppercase tracking-widest font-mono">Warehouse</label>
                                        <select value={form.warehouseName} onChange={e => setForm({...form, warehouseName: e.target.value})} className="input-primary font-bold">
                                            {warehouses.slice(1).map((w: string) => <option key={w} value={w}>{w}</option>)}
                                        </select>
                                    </div>
                                    <div className="space-y-1.5">
                                        <label className="block text-[9px] font-black text-slate-400 uppercase tracking-widest font-mono">Location</label>
                                        <input type="text" value={form.location} onChange={e => setForm({...form, location: e.target.value})} className="input-primary font-mono font-bold" placeholder="Loc" />
                                    </div>
                                    <div className="space-y-1.5">
                                        <label className="block text-[9px] font-black text-slate-400 uppercase tracking-widest font-mono">MFG Date</label>
                                        <input type="date" value={form.mfgDate} onChange={e => setForm({...form, mfgDate: e.target.value})} className="input-primary font-mono font-bold" />
                                    </div>
                                </div>
                                <div className="space-y-1.5">
                                    <label className="block text-[9px] font-black text-slate-400 uppercase tracking-widest font-mono">Remark</label>
                                    <input type="text" value={form.remark} onChange={e => setForm({...form, remark: e.target.value})} className="input-primary font-medium" placeholder="Optional notes..." />
                                </div>
                            </div>
                        ) : (
                            <div className="space-y-3">
                                <div className="flex justify-between items-center border-b pb-2">
                                    <h4 className="text-[10px] font-black text-[#111f42] uppercase tracking-widest font-mono">Receive Items List</h4>
                                    <button onClick={() => setForm({...form, manualItems: [...form.manualItems, { sku: '', itemName: '', qty: 0, warehouseName: 'FG', location: '', lotNo: '', mfgDate: new Date().toISOString().slice(0, 10), remark: '', expDate: '' }]})} className="text-[9px] bg-[#111f42] text-[#ab8a3b] px-3 py-1.5 rounded-lg font-black uppercase tracking-widest shadow-sm hover:brightness-110">Add Item</button>
                                </div>
                                {form.manualItems.map((item: any, idx: number) => (
                                    <div key={idx} className="p-3 bg-slate-50 rounded-xl border border-slate-200 grid grid-cols-12 gap-2 relative">
                                        <div className="col-span-4">
                                            <label className="text-[8px] font-black text-slate-400 uppercase block mb-1">Product SKU / Name</label>
                                            <select value={item.sku} onChange={(e) => {
                                                const prod = productMaster.find((p: any) => p.sku === e.target.value);
                                                handleManualItemChange(idx, 'sku', e.target.value);
                                                handleManualItemChange(idx, 'itemName', prod?.name || '');
                                            }} className="input-primary text-[10px] font-bold h-8 py-1 px-2">
                                                <option value="">-- Choose --</option>
                                                {productMaster.map((p: any) => <option key={p.sku} value={p.sku}>{p.sku} : {p.name}</option>)}
                                            </select>
                                        </div>
                                        <div className="col-span-2">
                                            <label className="text-[8px] font-black text-slate-400 uppercase block mb-1 text-right">Qty</label>
                                            <input type="number" value={item.qty} onChange={e => handleManualItemChange(idx, 'qty', e.target.value)} className="input-primary text-right font-black h-8 py-1 px-2 border-[#ab8a3b]/30" />
                                        </div>
                                        <div className="col-span-2">
                                            <label className="text-[8px] font-black text-slate-400 uppercase block mb-1">WH</label>
                                            <select value={item.warehouseName} onChange={e => handleManualItemChange(idx, 'warehouseName', e.target.value)} className="input-primary text-[10px] font-bold h-8 py-1 px-2">
                                                {warehouses.slice(1).map((w: string) => <option key={w} value={w}>{w}</option>)}
                                            </select>
                                        </div>
                                        <div className="col-span-3">
                                            <label className="text-[8px] font-black text-slate-400 uppercase block mb-1">Lot No.</label>
                                            <input value={item.lotNo} onChange={e => handleManualItemChange(idx, 'lotNo', e.target.value)} className="input-primary h-8 py-1 px-2 font-mono text-[10px]" placeholder="Lot" />
                                        </div>
                                        <div className="col-span-1 flex items-end justify-center pb-0.5">
                                            <button onClick={() => {const n = [...form.manualItems]; n.splice(idx,1); setForm({...form, manualItems:n})}} className="p-1 text-rose-400 hover:bg-rose-50 rounded-md"><Trash2 size={14}/></button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                <div className="p-5 bg-white border-t flex justify-end gap-3 shrink-0 rounded-b-[10px]">
                    <button onClick={closeModal} className="text-[11px] font-black uppercase tracking-widest text-slate-400 hover:text-[#111f42] transition-colors font-mono px-4">Cancel</button>
                    <div className="flex gap-3">
                        <button onClick={() => submitReceive(false)} className="px-6 py-2 bg-white border border-[#111f42] text-[#111f42] hover:bg-slate-50 text-[11px] font-black rounded-lg shadow-sm transition-all flex items-center gap-2 uppercase tracking-widest font-mono">
                            <Save size={14} /> {modalType === 'MANUAL' ? 'Save All' : 'Save (Partial)'}
                        </button>
                        {modalType !== 'MANUAL' && (
                            <button onClick={() => submitReceive(true)} className="bg-[#E3624A] text-white px-6 py-2 rounded-lg font-black text-[11px] uppercase tracking-widest shadow-md shadow-[#E3624A]/20 hover:brightness-110 transition-all flex items-center gap-2 font-mono">
                                <CheckCircle2 size={14} /> Save & Complete
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

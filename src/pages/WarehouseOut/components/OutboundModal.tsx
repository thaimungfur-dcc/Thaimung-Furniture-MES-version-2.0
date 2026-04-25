import React from 'react';
import { X, Save, CheckCircle, PlusCircle, Truck, Plus, Trash2 } from 'lucide-react';
import { ModalType } from '../types';
import { WAREHOUSES, OUTBOUND_TYPES } from '../constants';
import { DraggableWrapper } from "../../../components/shared/DraggableWrapper";

interface OutboundModalProps {
    show: boolean;
    type: ModalType;
    editingId: number | null;
    selectedItem: any;
    form: any;
    onClose: () => void;
    onFormChange: (field: string, value: any) => void;
    onManualItemChange: (index: number, field: string, value: any) => void;
    onAddManualItem: () => void;
    onRemoveManualItem: (index: number) => void;
    onSubmit: (complete?: boolean) => void;
    onOpenDropdown: (e: any, index: number) => void;
}

export default function OutboundModal({
    show, type, editingId, selectedItem, form, onClose, onFormChange, 
    onManualItemChange, onAddManualItem, onRemoveManualItem, onSubmit, onOpenDropdown
}: OutboundModalProps) {
    if (!show) return null;

    return (
        <div className="modal-overlay open" style={{zIndex: 10001}} onClick={onClose}>
            
            <DraggableWrapper>
                  <div className={`modal-box border-b-8 border-[#ab8a3b] shadow-2xl transition-all w-full overflow-hidden rounded-none ${type === 'MANUAL' ? 'max-w-5xl' : 'max-w-2xl'}`} onClick={e => e.stopPropagation()}>
                            <div className="p-5 bg-[#111f42] text-white flex justify-between items-center shrink-0">
                                <div className="flex items-center gap-6">
                                    <div className="w-12 h-12 bg-white/5 border border-white/10 flex items-center justify-center rounded-none shadow-inner text-[#ab8a3b]">
                                        {type === 'MANUAL' ? <PlusCircle size={28} /> : <Truck size={28} />}
                                    </div>
                                    <div>
                                        <h3 className="text-2xl font-black uppercase tracking-[0.1em] font-mono leading-tight">
                                            {editingId ? 'Edit Outbound' : (type === 'SO' ? 'Ship Delivery' : (type === 'MRP' ? 'Issue to Production' : 'Manual Outbound'))}
                                        </h3>
                                        <div className="text-[10px] text-[#ab8a3b] font-mono mt-1 font-black tracking-[0.2em] uppercase opacity-80">
                                            {selectedItem ? `Reference: ${selectedItem.soNo || selectedItem.moNo}` : 'DIRECT LEDGER ENTRY (MULTIPLE)'}
                                        </div>
                                    </div>
                                </div>
                                <button onClick={onClose} className="w-10 h-10 rounded-none border border-white/10 hover:bg-white/20 flex items-center justify-center text-slate-400 hover:text-white transition-all"><X size={20}></X></button>
                            </div>
                            
                            <div className="flex-1 overflow-y-auto master-custom-scrollbar p-4 sm:p-5 bg-[#f8fafc]">
                                 {type !== 'MANUAL' && !editingId && (
                                     <div className="bg-white p-5 border-2 border-slate-100 shadow-sm mb-8 flex justify-between items-center animate-fade-in-up rounded-none">
                                         <div>
                                             <div className="text-[10px] text-slate-400 font-black uppercase tracking-[0.2em] mb-2 font-mono">Product Identification</div>
                                             <div className="font-black text-[#111f42] text-lg font-mono tracking-tighter uppercase">{selectedItem?.sku || selectedItem?.rmSku}</div>
                                             <div className="text-[12px] text-[#ab8a3b] font-black mt-1 uppercase tracking-wider">{selectedItem?.productName || selectedItem?.rmName}</div>
                                         </div>
                                         <div className="text-right">
                                             <div className="text-[10px] text-slate-400 font-black uppercase tracking-[0.2em] mb-2 font-mono">Transaction Progress</div>
                                             <div className="text-4xl font-mono font-black text-[#111f42]">
                                                 {(selectedItem?.shipped || selectedItem?.issued || 0)?.toLocaleString()} <span className="text-slate-300 text-lg uppercase font-mono">/ {(selectedItem?.qty || 0)?.toLocaleString()}</span>
                                             </div>
                                             {((selectedItem?.qty || 0) - (selectedItem?.shipped || selectedItem?.issued || 0)) > 0 && (
                                                <div className="text-[11px] text-[#E3624A] font-black mt-2 uppercase tracking-widest bg-rose-50 px-3 py-1 border border-rose-100 inline-block">REMAINING: {((selectedItem?.qty || 0) - (selectedItem?.shipped || selectedItem?.issued || 0))?.toLocaleString()}</div>
                                             )}
                                         </div>
                                     </div>
                                 )}

                                 <div className="bg-white p-5 border-2 border-slate-100 shadow-sm space-y-5 animate-fade-in-up rounded-none">
                                     <div className="grid grid-cols-1 md:grid-cols-3 gap-5 border-b border-slate-100 pb-8">
                                         <div>
                                             <label className="block text-[10px] font-black text-slate-400 uppercase mb-2 font-mono tracking-[0.2em]">Transaction Date</label>
                                             <input type="datetime-local" value={form.date} onChange={e => onFormChange('date', e.target.value)} className="input-primary w-full text-[12px] font-mono font-black rounded-none border-2 focus:border-[#ab8a3b]" />
                                         </div>
                                         <div>
                                             <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1.5 font-mono tracking-widest">Outbound Type</label>
                                             <select value={form.outType} onChange={e => onFormChange('outType', e.target.value)} className="input-primary w-full cursor-pointer bg-slate-50 font-bold text-[12px]" disabled={type !== 'MANUAL'}>
                                                 {OUTBOUND_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                                             </select>
                                         </div>
                                         {type === 'MANUAL' && (
                                             <div>
                                                 <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1.5 font-mono tracking-widest">Ref Document</label>
                                                 <input type="text" value={form.refNo} onChange={e => onFormChange('refNo', e.target.value)} className="input-primary w-full text-[12px]" placeholder="e.g. Req-001" />
                                             </div>
                                         )}
                                     </div>

                                     {/* Manual Table */}
                                     {type === 'MANUAL' && !editingId ? (
                                         <div>
                                             <div className="flex justify-between items-end mb-4">
                                                 <label className="block text-[11px] font-black text-[#111f42] uppercase font-mono tracking-[0.2em]">Outbound Items Payload</label>
                                                 <span className="text-[10px] text-[#ab8a3b] font-mono font-black bg-[#ab8a3b]/5 px-3 py-1.5 border border-[#ab8a3b]/20 uppercase tracking-widest">Batch Size: {form.manualItems.length}</span>
                                             </div>
                                             <div className="overflow-x-auto border-2 border-slate-100 bg-white shadow-sm overflow-visible rounded-none">
                                                 <table className="w-full text-left whitespace-nowrap min-w-[1000px] border-collapse">
                                                     <thead className="bg-slate-50 border-b-2 border-slate-200">
                                                         <tr>
                                                             <th className="p-4 w-10 text-center text-[10px] font-black text-slate-400 uppercase tracking-widest border-r">#</th>
                                                             <th className="p-4 w-64 text-[10px] font-black text-[#111f42] uppercase tracking-widest">Target Product <span className="text-[#E3624A]">*</span></th>
                                                             <th className="p-4 w-24 text-right text-[10px] font-black text-[#111f42] uppercase tracking-widest">Qty <span className="text-[#E3624A]">*</span></th>
                                                             <th className="p-4 w-32 text-[10px] font-black text-slate-400 uppercase tracking-widest">Origin WH</th>
                                                             <th className="p-4 w-24 text-[10px] font-black text-slate-400 uppercase tracking-widest">Location</th>
                                                             <th className="p-4 w-32 text-[10px] font-black text-slate-400 uppercase tracking-widest">Lot Info</th>
                                                             <th className="p-4 w-40 text-[10px] font-black text-slate-400 uppercase tracking-widest">Remarks</th>
                                                             <th className="p-4 w-10 text-center"></th>
                                                         </tr>
                                                     </thead>
                                                     <tbody className="divide-y divide-slate-100">
                                                         {form.manualItems.map((item: any, index: number) => (
                                                             <tr key={index} className="hover:bg-slate-50/80 transition-colors group">
                                                                 <td className="p-3 text-center text-[10px] font-mono text-slate-400 font-black border-r bg-slate-50/30">{index + 1}</td>
                                                                 <td className="p-3">
                                                                     <input 
                                                                         type="text" 
                                                                         value={item.productSearch}
                                                                         onChange={e => onManualItemChange(index, 'productSearch', e.target.value)}
                                                                         onFocus={(e) => onOpenDropdown(e, index)}
                                                                         className="input-primary w-full text-[10px] font-black uppercase tracking-widest border-2 border-slate-100 bg-slate-50 focus:bg-white focus:border-[#ab8a3b] shadow-none rounded-none placeholder:opacity-40" 
                                                                         placeholder="Search Product..."
                                                                     />
                                                                 </td>
                                                                 <td className="p-3">
                                                                     <input type="number" min="0" value={item.qty} onChange={e => onManualItemChange(index, 'qty', e.target.value)} className="input-primary w-full text-right font-black text-[#111f42] border-2 border-slate-100 bg-slate-50 focus:bg-white focus:border-[#ab8a3b] font-mono shadow-none rounded-none text-[12px]" />
                                                                 </td>
                                                                 <td className="p-3">
                                                                     <select value={item.warehouseName} onChange={e => onManualItemChange(index, 'warehouseName', e.target.value)} className="input-primary w-full text-[10px] font-black uppercase tracking-widest cursor-pointer border-2 border-slate-100 bg-slate-50 focus:bg-white focus:border-[#ab8a3b] shadow-none rounded-none">
                                                                         <option value="" disabled>Select</option>
                                                                         {WAREHOUSES.slice(1).map(w => <option key={w} value={w}>{w}</option>)}
                                                                     </select>
                                                                 </td>
                                                                 <td className="p-3">
                                                                     <input type="text" value={item.location} onChange={e => onManualItemChange(index, 'location', e.target.value)} className="input-primary w-full text-[10px] font-black font-mono text-center border-2 border-slate-100 bg-slate-50 focus:bg-white focus:border-[#ab8a3b] shadow-none rounded-none uppercase tracking-widest" placeholder="LOC" />
                                                                 </td>
                                                                 <td className="p-3">
                                                                     <input type="text" value={item.lotNo} onChange={e => onManualItemChange(index, 'lotNo', e.target.value)} className="input-primary w-full text-[10px] font-black font-mono border-2 border-slate-100 bg-slate-50 focus:bg-white focus:border-[#ab8a3b] shadow-none rounded-none tracking-widest uppercase" placeholder="LOT-ID" />
                                                                 </td>
                                                                 <td className="p-3">
                                                                     <input type="text" value={item.remark} onChange={e => onManualItemChange(index, 'remark', e.target.value)} className="input-primary w-full text-[10px] font-black border-2 border-slate-100 bg-slate-50 focus:bg-white focus:border-[#ab8a3b] shadow-none rounded-none uppercase tracking-widest" placeholder="NOTE..." />
                                                                 </td>
                                                                 <td className="p-3 text-center">
                                                                     {form.manualItems.length > 1 && (
                                                                         <button onClick={() => onRemoveManualItem(index)} className="p-2 text-slate-300 hover:text-white hover:bg-rose-500 rounded-none transition-all opacity-0 group-hover:opacity-100 shadow-sm border border-transparent hover:border-rose-600">
                                                                             <Trash2 size={16} />
                                                                         </button>
                                                                     )}
                                                                 </td>
                                                             </tr>
                                                         ))}
                                                     </tbody>
                                                 </table>
                                             </div>
                                             <button onClick={onAddManualItem} className="mt-6 w-full py-5 border-2 border-dashed border-slate-200 rounded-none text-slate-400 hover:border-[#ab8a3b] hover:text-[#111f42] hover:bg-[#ab8a3b]/5 transition-all text-[11px] font-black flex items-center justify-center gap-3 uppercase tracking-[0.3em] font-mono">
                                                 <Plus size={18} /> Register Additional Line Item
                                             </button>
                                         </div>
                                     ) : (
                                         /* Single Form for SO/MRP/Edit */
                                         <div>
                                             <div className="grid grid-cols-2 gap-5">
                                                 <div>
                                                     <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1.5 font-mono tracking-widest">Warehouse / Location</label>
                                                     <div className="flex gap-2">
                                                         <select value={form.warehouseName} onChange={e => onFormChange('warehouseName', e.target.value)} className="input-primary w-1/2 cursor-pointer font-bold text-[12px]">
                                                             {WAREHOUSES.slice(1).map(w => <option key={w} value={w}>{w}</option>)}
                                                         </select>
                                                         <input type="text" value={form.location} onChange={e => onFormChange('location', e.target.value)} className="input-primary w-1/2 text-[12px]" placeholder="Loc (e.g. A-01)" />
                                                     </div>
                                                 </div>
                                                 <div>
                                                     <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1.5 font-mono tracking-widest">Lot No.</label>
                                                     <input type="text" value={form.lotNo} onChange={e => onFormChange('lotNo', e.target.value)} className="input-primary w-full text-[12px] font-mono" placeholder="LOT-XXX" />
                                                 </div>
                                             </div>
                                             <div className="grid grid-cols-2 gap-5 mt-5">
                                                 <div>
                                                     <label className="block text-[10px] font-bold text-[#E3624A] uppercase mb-1.5 font-mono tracking-widest">Issue Qty</label>
                                                     <input type="number" min="0" value={form.qty} onChange={e => onFormChange('qty', e.target.value)} className="input-primary w-full text-right font-black text-xl text-[#111f42] border-[#ab8a3b]/50 focus:border-[#ab8a3b] font-mono" />
                                                 </div>
                                                 <div>
                                                     <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1.5 font-mono tracking-widest">Remark</label>
                                                     <input type="text" value={form.remark} onChange={e => onFormChange('remark', e.target.value)} className="input-primary w-full text-[13px] h-[46px]" placeholder="Optional note..." />
                                                 </div>
                                             </div>
                                         </div>
                                     )}
                                 </div>
                            </div>

                            <div className="p-5 border-t bg-slate-50 flex justify-between gap-6 shrink-0 z-10 rounded-none items-center">
                                 <button onClick={onClose} className="px-5 py-2.5 text-slate-500 hover:text-[#111f42] text-[12px] font-black hover:bg-slate-200 rounded-none transition-all uppercase tracking-[0.2em] font-mono border border-transparent hover:border-slate-300">Close Form</button>
                                 <div className="flex gap-4">
                                     <button onClick={() => onSubmit(false)} className="px-6 py-2.5 bg-white border-2 border-[#111f42] text-[#111f42] hover:bg-slate-50 text-[12px] font-black rounded-none shadow-sm transition-all flex items-center gap-3 uppercase tracking-[0.2em] font-mono">
                                         <Save size={18} /> {editingId ? 'Update Log' : (type === 'MANUAL' ? 'Process Batch' : 'Commit Partial')}
                                     </button>
                                     {type !== 'MANUAL' && !editingId && (
                                         <button onClick={() => onSubmit(true)} className="px-6 py-2.5 bg-[#ab8a3b] hover:bg-[#8f712c] text-white text-[12px] font-black rounded-none shadow-2xl shadow-[#ab8a3b]/20 transition-all flex items-center gap-3 uppercase tracking-[0.2em] font-mono border-b-4 border-[#8f712c]">
                                             <CheckCircle size={18} /> Finalize Settlement
                                         </button>
                                     )}
                                 </div>
                            </div>
                        </div>
                </DraggableWrapper>

        </div>
    );
}

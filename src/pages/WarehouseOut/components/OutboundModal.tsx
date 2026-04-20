import React from 'react';
import { X, Save, CheckCircle, PlusCircle, Truck, Plus, Trash2 } from 'lucide-react';
import { ModalType } from '../types';
import { WAREHOUSES, OUTBOUND_TYPES } from '../constants';

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
            <div className={`modal-box border-t-[6px] border-[#ab8a3b] transition-all w-full ${type === 'MANUAL' ? 'max-w-5xl' : 'max-w-2xl'}`} onClick={e => e.stopPropagation()}>
                <div className="p-6 bg-[#111f42] text-white border-b border-slate-100 flex justify-between items-center shrink-0">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-white/10 flex items-center justify-center rounded-xl shadow-inner text-[#ab8a3b]">
                            {type === 'MANUAL' ? <PlusCircle size={24} /> : <Truck size={24} />}
                        </div>
                        <div>
                            <h3 className="text-xl font-black uppercase tracking-tight">
                                {editingId ? 'Edit Outbound' : (type === 'SO' ? 'Ship Delivery' : (type === 'MRP' ? 'Issue to Production' : 'Manual Outbound'))}
                            </h3>
                            <div className="text-[10px] text-slate-400 font-mono mt-1 font-bold tracking-widest uppercase">
                                {selectedItem ? `Ref: ${selectedItem.soNo || selectedItem.moNo}` : 'Direct Entry (Multiple)'}
                            </div>
                        </div>
                    </div>
                    <button onClick={onClose} className="w-8 h-8 rounded-lg hover:bg-white/20 flex items-center justify-center text-slate-400 hover:text-white transition-all"><X size={20}></X></button>
                </div>
                
                <div className="flex-1 overflow-y-auto master-custom-scrollbar p-8 bg-[#F9F7F6]">
                     {type !== 'MANUAL' && !editingId && (
                         <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm mb-6 flex justify-between items-center animate-fade-in-up">
                             <div>
                                 <div className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mb-1.5 font-mono">Item Detail</div>
                                 <div className="font-black text-[#111f42] text-[13px]">{selectedItem?.sku || selectedItem?.rmSku}</div>
                                 <div className="text-[11px] text-slate-500 font-medium mt-0.5">{selectedItem?.productName || selectedItem?.rmName}</div>
                             </div>
                             <div className="text-right">
                                 <div className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mb-1.5 font-mono">Progress</div>
                                 <div className="text-3xl font-mono font-black text-[#ab8a3b]">
                                     {(selectedItem?.shipped || selectedItem?.issued || 0).toLocaleString()} <span className="text-slate-300 text-base font-sans font-medium">/ {(selectedItem?.qty || 0).toLocaleString()}</span>
                                 </div>
                                 {((selectedItem?.qty || 0) - (selectedItem?.shipped || selectedItem?.issued || 0)) > 0 && (
                                    <div className="text-[11px] text-[#E3624A] font-bold mt-1">Remaining: {((selectedItem?.qty || 0) - (selectedItem?.shipped || selectedItem?.issued || 0)).toLocaleString()}</div>
                                 )}
                             </div>
                         </div>
                     )}

                     <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 space-y-5 animate-fade-in-up">
                         <div className="grid grid-cols-1 md:grid-cols-3 gap-5 border-b border-slate-100 pb-5 mb-2">
                             <div>
                                 <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1.5 font-mono tracking-widest">Date / Time</label>
                                 <input type="datetime-local" value={form.date} onChange={e => onFormChange('date', e.target.value)} className="input-primary w-full text-[12px] font-mono font-bold" />
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
                                 <div className="flex justify-between items-end mb-3">
                                     <label className="block text-[11px] font-black text-[#111f42] uppercase font-mono tracking-widest">Items List</label>
                                     <span className="text-[10px] text-slate-400 font-mono font-bold bg-slate-100 px-2 py-1 rounded">Total Items: {form.manualItems.length}</span>
                                 </div>
                                 <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white shadow-sm overflow-visible">
                                     <table className="w-full text-left whitespace-nowrap min-w-[1000px]">
                                         <thead className="bg-slate-50 border-b border-slate-200">
                                             <tr>
                                                 <th className="p-3 w-10 text-center text-[10px] font-bold text-slate-400 uppercase tracking-widest">#</th>
                                                 <th className="p-3 w-64 text-[10px] font-bold text-[#111f42] uppercase tracking-widest">Product (SKU / Name) <span className="text-[#E3624A]">*</span></th>
                                                 <th className="p-3 w-24 text-right text-[10px] font-bold text-[#111f42] uppercase tracking-widest">Qty <span className="text-[#E3624A]">*</span></th>
                                                 <th className="p-3 w-32 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Warehouse</th>
                                                 <th className="p-3 w-24 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Location</th>
                                                 <th className="p-3 w-32 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Lot No.</th>
                                                 <th className="p-3 w-40 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Remark</th>
                                                 <th className="p-3 w-10 text-center"></th>
                                             </tr>
                                         </thead>
                                         <tbody className="divide-y divide-slate-100">
                                             {form.manualItems.map((item: any, index: number) => (
                                                 <tr key={index} className="hover:bg-slate-50/80 transition-colors group">
                                                     <td className="p-2 text-center text-[10px] font-mono text-slate-400 font-bold">{index + 1}</td>
                                                     <td className="p-2">
                                                         <input 
                                                             type="text" 
                                                             value={item.productSearch}
                                                             onChange={e => onManualItemChange(index, 'productSearch', e.target.value)}
                                                             onFocus={(e) => onOpenDropdown(e, index)}
                                                             className="input-primary w-full text-[12px] font-bold border-transparent bg-slate-50 focus:bg-white focus:border-[#ab8a3b] shadow-none" 
                                                             placeholder="Search Product..."
                                                         />
                                                     </td>
                                                     <td className="p-2">
                                                         <input type="number" min="0" value={item.qty} onChange={e => onManualItemChange(index, 'qty', e.target.value)} className="input-primary w-full text-right font-bold text-[#111f42] border-transparent bg-slate-50 focus:bg-white focus:border-[#ab8a3b] font-mono shadow-none" />
                                                     </td>
                                                     <td className="p-2">
                                                         <select value={item.warehouseName} onChange={e => onManualItemChange(index, 'warehouseName', e.target.value)} className="input-primary w-full text-[12px] cursor-pointer border-transparent bg-slate-50 focus:bg-white focus:border-[#ab8a3b] shadow-none font-bold">
                                                             <option value="" disabled>Select</option>
                                                             {WAREHOUSES.slice(1).map(w => <option key={w} value={w}>{w}</option>)}
                                                         </select>
                                                     </td>
                                                     <td className="p-2">
                                                         <input type="text" value={item.location} onChange={e => onManualItemChange(index, 'location', e.target.value)} className="input-primary w-full text-[12px] font-mono text-center border-transparent bg-slate-50 focus:bg-white focus:border-[#ab8a3b] shadow-none" placeholder="Loc" />
                                                     </td>
                                                     <td className="p-2">
                                                         <input type="text" value={item.lotNo} onChange={e => onManualItemChange(index, 'lotNo', e.target.value)} className="input-primary w-full text-[12px] font-mono border-transparent bg-slate-50 focus:bg-white focus:border-[#ab8a3b] shadow-none" placeholder="LOT-XXX" />
                                                     </td>
                                                     <td className="p-2">
                                                         <input type="text" value={item.remark} onChange={e => onManualItemChange(index, 'remark', e.target.value)} className="input-primary w-full text-[12px] border-transparent bg-slate-50 focus:bg-white focus:border-[#ab8a3b] shadow-none" placeholder="Note..." />
                                                     </td>
                                                     <td className="p-2 text-center">
                                                         {form.manualItems.length > 1 && (
                                                             <button onClick={() => onRemoveManualItem(index)} className="p-1.5 text-slate-300 hover:text-rose-500 hover:bg-rose-50 rounded-lg transition-colors opacity-0 group-hover:opacity-100">
                                                                 <Trash2 size={14} />
                                                             </button>
                                                         )}
                                                     </td>
                                                 </tr>
                                             ))}
                                         </tbody>
                                     </table>
                                 </div>
                                 <button onClick={onAddManualItem} className="mt-4 w-full py-3 border-2 border-dashed border-slate-200 rounded-xl text-slate-500 hover:border-[#ab8a3b] hover:text-[#111f42] hover:bg-[#ab8a3b]/5 transition-all text-[11px] font-bold flex items-center justify-center gap-2 uppercase tracking-widest">
                                     <Plus size={16} /> Add Another Item
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

                <div className="p-6 border-t bg-slate-50 flex justify-between gap-3 shrink-0 z-10 rounded-b-[16px] items-center">
                     <button onClick={onClose} className="px-6 py-3 text-slate-500 hover:text-[#111f42] text-[11px] font-black hover:bg-slate-200 rounded-xl transition duration-300 uppercase tracking-widest font-mono">Cancel</button>
                     <div className="flex gap-3">
                         <button onClick={() => onSubmit(false)} className="px-8 py-3 bg-white border border-[#111f42] text-[#111f42] hover:bg-slate-50 text-[11px] font-black rounded-xl shadow-sm transition-all flex items-center gap-2 uppercase tracking-widest font-mono">
                             <Save size={16} /> {editingId ? 'Update Record' : (type === 'MANUAL' ? 'Save All' : 'Save (Partial)')}
                         </button>
                         {type !== 'MANUAL' && !editingId && (
                             <button onClick={() => onSubmit(true)} className="px-8 py-3 bg-[#ab8a3b] hover:bg-[#8f712c] text-white text-[11px] font-black rounded-xl shadow-lg shadow-[#ab8a3b]/30 transition-all flex items-center gap-2 uppercase tracking-widest font-mono">
                                 <CheckCircle size={16} /> Save & Complete
                             </button>
                         )}
                     </div>
                </div>
            </div>
        </div>
    );
}

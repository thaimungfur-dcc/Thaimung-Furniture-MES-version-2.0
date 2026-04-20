import React from 'react';
import { PlusCircle, Settings2, X, Info, DollarSign, Clock, Layers, CheckCircle } from 'lucide-react';

interface ItemModalProps {
    showModal: boolean;
    closeModal: () => void;
    form: any;
    setForm: (form: any) => void;
    groups: string[];
    setShowNameRuleModal: (show: boolean) => void;
    saveItem: () => void;
}

export default function ItemModal({ showModal, closeModal, form, setForm, groups, setShowNameRuleModal, saveItem }: ItemModalProps) {
    if (!showModal) return null;

    return (
        <div className="modal-overlay" onClick={closeModal}>
            <div className="modal-box max-w-[850px] border-t-[6px] border-[#ab8a3b] rounded-2xl animate-fade-in-up" onClick={e => e.stopPropagation()}>
                <div className="bg-[#111f42] px-8 py-5 flex justify-between items-center text-white shrink-0">
                    <div>
                        <h3 className="text-xl font-black uppercase tracking-widest flex items-center gap-3">
                            <PlusCircle size={24} className="text-[#ab8a3b]" />
                            {form.id ? 'EDIT MASTER RECORD' : 'CREATE NEW RECORD'}
                        </h3>
                        <p className="text-[10px] font-bold text-slate-400 mt-1 uppercase tracking-widest">Item registration workflow</p>
                    </div>
                    <div className="flex items-center gap-3">
                        <button onClick={() => setShowNameRuleModal(true)} className="text-[10px] border border-[#ab8a3b] text-[#ab8a3b] px-3 py-1.5 rounded-lg hover:bg-[#ab8a3b] hover:text-[#111f42] transition-all font-bold uppercase">
                            <Settings2 size={12} className="inline mr-1" /> Config Rules
                        </button>
                        <button onClick={closeModal} className="p-1.5 bg-white/10 rounded-lg hover:bg-white/20"><X size={24} /></button>
                    </div>
                </div>
                
                <div className="p-8 overflow-y-auto master-custom-scrollbar flex-1 space-y-8 bg-[#F9F7F6]">
                    {/* 1. General Information Section */}
                    <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-200">
                        <h4 className="text-[11px] font-black text-[#111f42] uppercase tracking-widest mb-5 border-b pb-2 flex items-center gap-2">
                            <Info size={14} className="text-[#ab8a3b]"/> General Information
                        </h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
                            <div className="space-y-1.5 md:col-span-2">
                                <label className="text-[10px] font-bold text-slate-400 uppercase">Item Name *</label>
                                <input value={form.itemName} onChange={e => setForm({...form, itemName: e.target.value})} className="input-primary font-bold" placeholder="Full Item Description" />
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-[10px] font-bold text-slate-400 uppercase">Item Type *</label>
                                <select value={form.itemType} onChange={e => setForm({...form, itemType: e.target.value})} className="input-primary bg-white cursor-pointer font-bold">
                                    {groups.filter(x => x !== 'All').map(g => <option key={g} value={g}>{g}</option>)}
                                </select>
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-[10px] font-bold text-slate-400 uppercase">Category</label>
                                <input value={form.category} onChange={e => setForm({...form, category: e.target.value})} className="input-primary" placeholder="e.g. Laundry / Bedroom" />
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-[10px] font-bold text-slate-400 uppercase">Sub Category</label>
                                <input value={form.subCategory} onChange={e => setForm({...form, subCategory: e.target.value})} className="input-primary" placeholder="e.g. Steel / Wood" />
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-[10px] font-bold text-slate-400 uppercase">Item Code (Manual/Auto)</label>
                                <input value={form.itemCode} onChange={e => setForm({...form, itemCode: e.target.value.toUpperCase()})} className="input-primary font-mono" placeholder="Leave empty for AUTO" />
                            </div>
                        </div>
                    </div>

                    {/* 2. Inventory & Cost Section */}
                    <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-200">
                        <h4 className="text-[11px] font-black text-[#111f42] uppercase tracking-widest mb-5 border-b pb-2 flex items-center gap-2">
                            <DollarSign size={14} className="text-[#ab8a3b]"/> Inventory & Costing
                        </h4>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-x-4 gap-y-4">
                            <div className="space-y-1.5">
                                <label className="text-[10px] font-bold text-slate-400 uppercase">Base Unit</label>
                                <input value={form.baseUnit} onChange={e => setForm({...form, baseUnit: e.target.value})} className="input-primary text-center font-bold" placeholder="PCS" />
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-[10px] font-bold text-slate-400 uppercase">Std. Cost (฿)</label>
                                <input type="number" value={form.stdCost} onChange={e => setForm({...form, stdCost: Number(e.target.value)})} className="input-primary text-right font-bold" />
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-[10px] font-bold text-slate-400 uppercase">Std. Price (฿)</label>
                                <input type="number" value={form.stdPrice} onChange={e => setForm({...form, stdPrice: Number(e.target.value)})} className="input-primary text-right font-bold" />
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-[10px] font-bold text-slate-400 uppercase">Status</label>
                                <select value={form.status} onChange={e => setForm({...form, status: e.target.value})} className="input-primary cursor-pointer font-bold">
                                    <option value="Active">Active</option>
                                    <option value="Inactive">Inactive</option>
                                    <option value="Discontinued">Discontinued</option>
                                </select>
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-[10px] font-bold text-slate-400 uppercase flex items-center gap-1.5"><Clock size={10}/> Lead Time (Day)</label>
                                <input type="number" value={form.leadTime} onChange={e => setForm({...form, leadTime: Number(e.target.value)})} className="input-primary text-center" />
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-[10px] font-bold text-slate-400 uppercase flex items-center gap-1.5"><Layers size={10}/> MOQ</label>
                                <input type="number" value={form.moq} onChange={e => setForm({...form, moq: Number(e.target.value)})} className="input-primary text-center" />
                            </div>
                        </div>
                    </div>
                </div>

                <div className="p-6 border-t bg-white flex justify-end gap-3 shrink-0">
                    <button onClick={closeModal} className="px-6 py-2.5 text-[11px] font-bold uppercase text-slate-500 hover:bg-slate-50 rounded-xl transition-all">Cancel</button>
                    <button onClick={saveItem} className="px-10 py-2.5 bg-[#111f42] text-[#ab8a3b] rounded-xl font-black uppercase text-[11px] shadow-lg shadow-[#111f42]/20 hover:brightness-110 transition-all flex items-center gap-2">
                        <CheckCircle size={16}/> Save Master Record
                    </button>
                </div>
            </div>
        </div>
    );
}

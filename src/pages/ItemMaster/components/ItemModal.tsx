import React from 'react';
import { PlusCircle, Settings2, X, Info, DollarSign, Clock, Layers, CheckCircle } from 'lucide-react';
import { DraggableWrapper } from "../../../components/shared/DraggableWrapper";

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
            
            <DraggableWrapper>
                  <div className="modal-box max-w-[850px] border-t-[8px] border-[#ab8a3b] rounded-none animate-fade-in-up shadow-[0_0_50px_rgba(0,0,0,0.3)]" onClick={e => e.stopPropagation()}>
                            <div className="bg-[#111f42] px-5 py-6 flex justify-between items-center text-white shrink-0 border-b border-[#ab8a3b]/30">
                                <div>
                                    <h3 className="text-xl font-black uppercase tracking-[0.2em] flex items-center gap-3">
                                        <PlusCircle size={24} className="text-[#ab8a3b]" />
                                        {form.id ? 'EDIT MASTER RECORD' : 'CREATE NEW RECORD'}
                                    </h3>
                                    <p className="text-[10px] font-black text-[#ab8a3b] mt-1.5 uppercase tracking-[0.25em] opacity-80">Item registration workflow</p>
                                </div>
                                <div className="flex items-center gap-3">
                                    <button onClick={() => setShowNameRuleModal(true)} className="text-[10px] border-2 border-[#ab8a3b] text-[#ab8a3b] px-4 py-2 rounded-none hover:bg-[#ab8a3b] hover:text-[#111f42] transition-all font-black uppercase tracking-widest flex items-center gap-2">
                                        <Settings2 size={12} /> Config Rules
                                    </button>
                                    <button onClick={closeModal} className="p-2 bg-white/5 border border-white/10 rounded-none hover:bg-white/20 transition-colors"><X size={24} /></button>
                                </div>
                            </div>
                            
                            <div className="p-5 overflow-y-auto master-custom-scrollbar flex-1 space-y-5 bg-[#f5f0e9]">
                                {/* 1. General Information Section */}
                                <div className="bg-white p-5 rounded-none shadow-[4px_4px_0px_#e2e8f0] border-2 border-[#111f42]/10 border-l-[6px] border-l-[#111f42]">
                                    <h4 className="text-[12px] font-black text-[#111f42] uppercase tracking-[0.2em] mb-6 flex items-center gap-3">
                                        <div className="w-2 h-2 bg-[#ab8a3b] rounded-none"></div>
                                        General Information
                                    </h4>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                                        <div className="space-y-2 md:col-span-2">
                                            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Item Name *</label>
                                            <input value={form.itemName} onChange={e => setForm({...form, itemName: e.target.value})} className="w-full bg-[#f8fafc] border-2 border-slate-200 rounded-none px-4 py-3 text-[13px] font-black uppercase tracking-widest text-[#111f42] focus:border-[#ab8a3b] focus:bg-white transition-all outline-none" placeholder="Full Item Description" />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Item Type *</label>
                                            <select value={form.itemType} onChange={e => setForm({...form, itemType: e.target.value})} className="w-full bg-[#f8fafc] border-2 border-slate-200 rounded-none px-4 py-3 text-[13px] font-black uppercase tracking-widest text-[#111f42] focus:border-[#ab8a3b] focus:bg-white transition-all outline-none cursor-pointer">
                                                {groups?.filter(x => x !== 'All')?.map(g => <option key={g} value={g}>{g}</option>)}
                                            </select>
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Category</label>
                                            <input value={form.category} onChange={e => setForm({...form, category: e.target.value})} className="w-full bg-[#f8fafc] border-2 border-slate-200 rounded-none px-4 py-3 text-[13px] font-black uppercase tracking-widest text-[#111f42] focus:border-[#ab8a3b] focus:bg-white transition-all outline-none" placeholder="e.g. Laundry / Bedroom" />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Sub Category</label>
                                            <input value={form.subCategory} onChange={e => setForm({...form, subCategory: e.target.value})} className="w-full bg-[#f8fafc] border-2 border-slate-200 rounded-none px-4 py-3 text-[13px] font-black uppercase tracking-widest text-[#111f42] focus:border-[#ab8a3b] focus:bg-white transition-all outline-none" placeholder="e.g. Steel / Wood" />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Item Code (Manual/Auto)</label>
                                            <input value={form.itemCode} onChange={e => setForm({...form, itemCode: e.target.value.toUpperCase()})} className="w-full bg-[#f8fafc] border-2 border-slate-200 rounded-none px-4 py-3 text-[13px] font-mono font-black uppercase tracking-widest text-[#ab8a3b] focus:border-[#ab8a3b] focus:bg-white transition-all outline-none" placeholder="Leave empty for AUTO" />
                                        </div>
                                    </div>
                                </div>

                                {/* 2. Inventory & Cost Section */}
                                <div className="bg-white p-5 rounded-none shadow-[4px_4px_0px_#e2e8f0] border-2 border-[#111f42]/10 border-l-[6px] border-l-[#ab8a3b]">
                                    <h4 className="text-[12px] font-black text-[#111f42] uppercase tracking-[0.2em] mb-6 flex items-center gap-3">
                                        <div className="w-2 h-2 bg-[#111f42] rounded-none"></div>
                                        Inventory & Costing
                                    </h4>
                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-x-6 gap-y-6">
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Base Unit</label>
                                            <input value={form.baseUnit} onChange={e => setForm({...form, baseUnit: e.target.value})} className="w-full bg-[#f8fafc] border-2 border-slate-200 rounded-none px-4 py-3 text-[13px] font-black uppercase tracking-widest text-[#111f42] text-center focus:border-[#ab8a3b] focus:bg-white transition-all outline-none" placeholder="PCS" />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Std. Cost (฿)</label>
                                            <input type="number" value={form.stdCost} onChange={e => setForm({...form, stdCost: Number(e.target.value)})} className="w-full bg-[#f8fafc] border-2 border-slate-200 rounded-none px-4 py-3 text-[13px] font-black uppercase tracking-widest text-emerald-600 text-right focus:border-[#ab8a3b] focus:bg-white transition-all outline-none" />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Std. Price (฿)</label>
                                            <input type="number" value={form.stdPrice} onChange={e => setForm({...form, stdPrice: Number(e.target.value)})} className="w-full bg-[#f8fafc] border-2 border-slate-200 rounded-none px-4 py-3 text-[13px] font-black uppercase tracking-widest text-[#111f42] text-right focus:border-[#ab8a3b] focus:bg-white transition-all outline-none" />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Status</label>
                                            <select value={form.status} onChange={e => setForm({...form, status: e.target.value})} className="w-full bg-[#f8fafc] border-2 border-slate-200 rounded-none px-4 py-3 text-[13px] font-black uppercase tracking-widest text-[#111f42] focus:border-[#ab8a3b] focus:bg-white transition-all outline-none cursor-pointer">
                                                <option value="Active">Active</option>
                                                <option value="Inactive">Inactive</option>
                                                <option value="Discontinued">Discontinued</option>
                                            </select>
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-1.5"><Clock size={10}/> Lead Time (Day)</label>
                                            <input type="number" value={form.leadTime} onChange={e => setForm({...form, leadTime: Number(e.target.value)})} className="w-full bg-[#f8fafc] border-2 border-slate-200 rounded-none px-4 py-3 text-[13px] font-black text-center focus:border-[#ab8a3b] focus:bg-white transition-all outline-none" />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-1.5"><Layers size={10}/> MOQ</label>
                                            <input type="number" value={form.moq} onChange={e => setForm({...form, moq: Number(e.target.value)})} className="w-full bg-[#f8fafc] border-2 border-slate-200 rounded-none px-4 py-3 text-[13px] font-black text-center focus:border-[#ab8a3b] focus:bg-white transition-all outline-none" />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="p-5 border-t-2 border-[#111f42]/10 bg-white flex justify-end gap-4 shrink-0 shadow-[0_-10px_30px_rgba(0,0,0,0.02)]">
                                <button onClick={closeModal} className="px-5 py-3 text-[11px] font-black uppercase tracking-[0.2em] text-slate-400 hover:text-slate-600 hover:bg-slate-50 rounded-none transition-all border-2 border-transparent">Cancel</button>
                                <button onClick={saveItem} className="px-12 py-3 bg-[#111f42] text-[#ab8a3b] rounded-none font-black uppercase text-[11px] tracking-[0.2em] shadow-xl hover:bg-[#1e346b] hover:translate-y-[-1px] transition-all flex items-center gap-3">
                                    <CheckCircle size={18}/> Save Master Record
                                </button>
                            </div>
                        </div>
                </DraggableWrapper>

        </div>
    );
}

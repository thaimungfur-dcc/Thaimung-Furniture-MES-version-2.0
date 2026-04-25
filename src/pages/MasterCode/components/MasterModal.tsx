import React from 'react';
import { Database, Settings2, X, CheckCircle, Circle, Tag, AlertOctagon, RotateCcw, CheckCircle2 } from 'lucide-react';
import { DraggableWrapper } from "../../../components/shared/DraggableWrapper";

interface MasterModalProps {
  showModal: boolean;
  closeModal: () => void;
  form: any;
  setForm: (form: any) => void;
  groups: string[];
  openGroupManager: () => void;
  toggleGroupInForm: (g: string) => void;
  isDuplicate: boolean;
  generatedMastCode: string;
  saveItem: () => void;
  isValid: boolean;
}

export default function MasterModal({
  showModal, closeModal, form, setForm, groups, openGroupManager, toggleGroupInForm,
  isDuplicate, generatedMastCode, saveItem, isValid
}: MasterModalProps) {
  if (!showModal) return null;

  return (
    <div className="modal-overlay open" onClick={closeModal}>
      
          <DraggableWrapper>
                <div className="modal-box p-0 max-w-[1000px] border-t-[6px] border-[#ab8a3b] rounded-[16px]" onClick={e => e.stopPropagation()}>
                  <div className="bg-[#111f42] px-5 py-5 flex justify-between items-center">
                    <div>
                      <h3 className="font-black text-xl flex items-center gap-3 text-white tracking-widest uppercase">
                        <Database size={24} className="text-[#ab8a3b]" />
                        {form.id ? 'EDIT MASTER CODE' : 'CREATE NEW CODE'}
                      </h3>
                      <p className="text-slate-400 text-[10px] font-bold tracking-[0.2em] uppercase pl-9 mt-1">Specify material or product details</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <button onClick={openGroupManager} className="text-[10px] bg-transparent border border-[#ab8a3b] text-[#ab8a3b] px-3 py-1.5 rounded-lg hover:bg-[#ab8a3b] hover:text-[#111f42] transition flex items-center gap-1.5 shadow-sm font-bold uppercase tracking-wider font-mono">
                        <Settings2 size={14} /> Config Groups
                      </button>
                      <button onClick={closeModal} className="text-slate-400 hover:text-white hover:bg-white/10 p-1.5 rounded-lg transition-colors"><X size={24} /></button>
                    </div>
                  </div>
                  
                  <div className="p-5 overflow-y-auto master-custom-scrollbar bg-[#F9F7F6] flex-1 space-y-4 font-sans">
                    {/* Groups */}
                    <div>
                      <label className="block text-[11px] font-black text-[#111f42] mb-2 uppercase tracking-widest font-mono">Group Type <span className="text-[#E3624A]">*</span></label>
                      <div className="flex flex-wrap gap-2">
                        {groups.filter(g => g !== 'All')?.map(g => (
                          <button key={g} onClick={() => toggleGroupInForm(g)} 
                            className={`px-4 py-2.5 rounded-xl text-[11px] font-bold transition-all flex items-center gap-2 border font-mono tracking-wider ${(form.groups || []).includes(g) ? 'bg-[#111f42] text-[#ab8a3b] border-[#111f42] shadow-md' : 'bg-white text-slate-500 border-slate-200 hover:border-[#ab8a3b]'}`}>
                            {(form.groups || []).includes(g) ? <CheckCircle size={14} /> : <Circle size={14} />} {g}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="h-px bg-slate-200 w-full"></div>

                    {/* Category */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-5 items-start">
                      <div className="md:col-span-3">
                        <label className="block text-[11px] font-black text-[#111f42] uppercase mb-1.5 tracking-widest font-mono">Category Name <span className="text-[#E3624A]">*</span></label>
                        <div className="relative">
                          <div className="absolute left-3 top-3 text-slate-400"><Tag size={16} /></div>
                          <input type="text" value={form.category} onChange={e => setForm({...form, category: e.target.value})} placeholder="e.g. Sofa, Wood, Hardware..." 
                            className="w-full pl-10 pr-4 py-2.5 text-[13px] font-bold bg-white border border-slate-200 rounded-xl focus:outline-none focus:border-[#ab8a3b] focus:ring-2 focus:ring-[#ab8a3b]/20 shadow-sm" />
                        </div>
                      </div>
                      <div>
                        <label className="block text-[11px] font-black text-[#ab8a3b] uppercase mb-1.5 tracking-widest font-mono">Code <span className="text-[#E3624A]">*</span></label>
                        <input type="text" maxLength={2} value={form.catCode} onChange={e => setForm({...form, catCode: e.target.value.toUpperCase()})}
                          className="w-full text-center py-2.5 text-lg font-mono font-black rounded-xl uppercase focus:outline-none border bg-white text-[#111f42] border-slate-200 focus:border-[#ab8a3b] focus:ring-2 focus:ring-[#ab8a3b]/20 shadow-sm" placeholder="XX" />
                      </div>
                    </div>

                    {/* Sub Category */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-5 items-start">
                      <div className="md:col-span-3">
                        <label className="block text-[11px] font-black text-[#111f42] uppercase mb-1.5 tracking-widest font-mono">Sub Category <span className="text-[#E3624A]">*</span></label>
                        <input type="text" value={form.subCategory} onChange={e => setForm({...form, subCategory: e.target.value})} placeholder="e.g. Leather, Teak, Hinge..." 
                          className="w-full px-4 py-2.5 text-[13px] font-bold bg-white border border-slate-200 rounded-xl focus:outline-none focus:border-[#ab8a3b] focus:ring-2 focus:ring-[#ab8a3b]/20 shadow-sm" />
                      </div>
                      <div>
                        <label className="block text-[11px] font-black text-[#111f42] uppercase mb-1.5 tracking-widest font-mono">Sub Code <span className="text-[#E3624A]">*</span></label>
                        <input type="text" maxLength={2} value={form.subCatCode} onChange={e => setForm({...form, subCatCode: e.target.value.toUpperCase()})} placeholder="XX"
                          className="w-full text-center py-2.5 text-lg font-mono font-black rounded-xl uppercase focus:outline-none border bg-slate-50 text-[#111f42] border-slate-200 focus:border-[#ab8a3b] focus:bg-white focus:ring-2 focus:ring-[#ab8a3b]/20 shadow-sm" />
                      </div>
                    </div>

                    {isDuplicate && (
                      <div className="bg-red-50 border border-red-200 text-red-600 px-5 py-2.5 rounded-xl flex items-center gap-4 text-xs font-medium animate-pulse shadow-sm">
                        <AlertOctagon size={24} />
                        <div>
                          <span className="block opacity-80 uppercase font-black tracking-widest text-[10px] font-mono mb-0.5">Duplicate Found</span>
                          This combination code already exists: <b className="font-mono text-[14px] bg-white px-2 py-0.5 rounded shadow-sm ml-1">{generatedMastCode}</b>
                        </div>
                      </div>
                    )}

                    {/* Preview & Note */}
                    <div className="flex flex-col md:flex-row gap-6">
                      <div className="flex-1">
                        <label className="block text-[11px] font-black text-[#111f42] uppercase mb-1.5 tracking-widest font-mono">Note / Description</label>
                        <textarea rows={2} value={form.note} onChange={e => setForm({...form, note: e.target.value})} placeholder="Additional details..." className="w-full px-4 py-3 text-[13px] font-medium bg-white border border-slate-200 rounded-xl focus:outline-none focus:border-[#ab8a3b] focus:ring-2 focus:ring-[#ab8a3b]/20 shadow-sm"></textarea>
                      </div>
                      <div className="w-full md:w-48 bg-[#111f42] rounded-2xl shadow-lg p-1.5 shrink-0">
                        <div className="h-full border border-white/10 rounded-xl flex flex-col items-center justify-center p-4 relative overflow-hidden">
                          <div className="absolute top-0 right-0 w-20 h-20 bg-[#ab8a3b] opacity-20 rounded-full -mr-8 -mt-8 blur-xl"></div>
                          <span className="text-[10px] text-[#ab8a3b] uppercase tracking-[0.2em] font-black mb-2 opacity-80 font-mono">GENERATED CODE</span>
                          <div className="text-3xl font-mono font-black text-white flex gap-0.5 z-10 drop-shadow-md">
                            <span>{form.catCode || '__'}</span><span className="text-[#ab8a3b]">{form.subCatCode || '__'}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 sm:p-5 border-t border-slate-200 bg-white flex justify-between items-center shrink-0">
                    <button onClick={() => setForm({ id: null, groups: [], category: '', catCode: '', subCategory: '', subCatCode: '', note: '' })} className="text-slate-400 hover:text-[#E3624A] text-[11px] font-bold flex items-center gap-2 px-4 py-2.5 rounded-xl hover:bg-red-50 transition uppercase tracking-widest font-mono">
                      <RotateCcw size={14} /> Reset
                    </button>
                    <div className="flex gap-3">
                      <button onClick={closeModal} className="px-6 py-3 text-slate-500 hover:text-[#111f42] text-[11px] font-black uppercase tracking-widest hover:bg-slate-100 rounded-xl transition font-mono border border-transparent hover:border-slate-200">Cancel</button>
                      <button onClick={saveItem} disabled={!isValid || isDuplicate} 
                        className={`px-5 py-3 text-[11px] font-black rounded-xl flex items-center gap-2 tracking-widest uppercase transition-all font-mono ${(!isValid || isDuplicate) ? 'bg-slate-100 text-slate-400 cursor-not-allowed' : 'bg-[#ab8a3b] text-white hover:bg-[#917532] shadow-md shadow-[#ab8a3b]/30'}`}>
                        <CheckCircle2 size={16} /> Save Data
                      </button>
                    </div>
                  </div>
                </div>
              </DraggableWrapper>

    </div>
  );
}

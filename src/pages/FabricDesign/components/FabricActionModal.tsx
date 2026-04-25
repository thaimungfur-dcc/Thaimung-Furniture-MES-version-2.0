import React, { useRef } from 'react';
import { X, Palette, ImagePlus, ArrowLeft, Settings, Clock, User, History, Trash2, Save, Plus } from 'lucide-react';
import { DraggableWrapper } from "../../../components/shared/DraggableWrapper";

interface FabricActionModalProps {
  show: boolean;
  onClose: () => void;
  isEditing: boolean;
  form: any;
  setForm: (form: any) => void;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  isConfigMode: boolean;
  setIsConfigMode: (mode: boolean) => void;
  fabricCategories: string[];
  newCategoryInput: string;
  setNewCategoryInput: (val: string) => void;
  addCategory: () => void;
  removeCategory: (cat: string) => void;
  onSave: () => void;
  onDelete: (id: any) => void;
}

const FabricActionModal: React.FC<FabricActionModalProps> = ({
  show, onClose, isEditing, form, setForm, activeTab, setActiveTab,
  isConfigMode, setIsConfigMode, fabricCategories, newCategoryInput,
  setNewCategoryInput, addCategory, removeCategory, onSave, onDelete
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!show) return null;

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setForm({ ...form, image: reader.result });
      reader.readAsDataURL(file);
    }
  };

  const updateColor = (val: string, idx: number) => {
    const newColors = [...form.colors];
    newColors[idx] = val;
    setForm({ ...form, colors: newColors });
  };

  const addColor = () => setForm({ ...form, colors: [...form.colors, '#000000'] });
  const removeColor = (idx: number) => setForm({ ...form, colors: form.colors.filter((_: any, i: number) => i !== idx) });

  return (
    <div className="modal-overlay open" onClick={onClose}>
      
          <DraggableWrapper>
                <div className="modal-box border-t-[6px] border-[#ab8a3b] max-w-3xl" onClick={e => e.stopPropagation()}>
                  <div className="px-5 py-5 bg-[#111f42] border-b border-slate-100 flex justify-between items-center shrink-0">
                    <div className="flex items-center gap-4 text-white">
                      <div className="w-12 h-12 bg-white/10 flex items-center justify-center rounded-xl shadow-inner text-[#ab8a3b]">
                        <Palette size={24} />
                      </div>
                      <div>
                        <h3 className="text-xl font-black uppercase tracking-widest">
                          {isConfigMode ? 'Manage Categories' : (isEditing ? 'Edit Design' : 'New Design')}
                        </h3>
                        {!isConfigMode && (
                          <p className="text-slate-400 font-bold uppercase tracking-widest text-[10px] mt-1 font-mono">
                            CODE: <span className="text-white">{form.code || 'AUTO-GEN'}</span>
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="flex gap-3">
                      <button 
                        onClick={() => setIsConfigMode(!isConfigMode)} 
                        className={`text-[10px] px-3 py-1.5 rounded-lg flex items-center gap-1.5 font-bold uppercase tracking-widest border transition-all ${isConfigMode ? 'bg-[#ab8a3b] text-white border-[#ab8a3b]' : 'bg-transparent text-[#ab8a3b] border-[#ab8a3b] hover:bg-[#ab8a3b] hover:text-[#111f42]'}`}
                      >
                        {isConfigMode ? <><ArrowLeft size={14} /> Back</> : <><Settings size={14} /> Config</>}
                      </button>
                      <button onClick={onClose} className="text-slate-400 hover:text-white hover:bg-white/10 p-1.5 rounded-lg transition-all">
                        <X size={24} />
                      </button>
                    </div>
                  </div>
                  
                  <div className="flex-1 overflow-y-auto master-custom-scrollbar p-5 bg-[#F9F7F6]">
                    {isConfigMode ? (
                      <div className="bg-white p-5 rounded-2xl border border-slate-200 max-w-lg mx-auto shadow-sm">
                        <h4 className="text-xs font-black text-[#111f42] mb-6 uppercase tracking-widest">Fabric Categories</h4>
                        <div className="flex gap-2 mb-6">
                          <input 
                            value={newCategoryInput} 
                            onChange={e => setNewCategoryInput(e.target.value)} 
                            className="input-primary w-full" 
                            placeholder="New category name..." 
                          />
                          <button onClick={addCategory} className="bg-[#111f42] hover:bg-[#1e346b] text-white px-6 py-2.5 rounded-xl text-[11px] font-black uppercase tracking-widest shadow-md transition-all">ADD</button>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {fabricCategories.map(cat => (
                            <div key={cat} className="flex items-center gap-2 bg-slate-50 px-3 py-1.5 rounded-lg text-[11px] font-bold text-[#111f42] border border-slate-200">
                              <span>{cat}</span>
                              <button onClick={() => removeCategory(cat)} className="text-slate-400 hover:text-rose-500 transition-colors"><X size={12} /></button>
                            </div>
                          ))}
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-4 animate-fade-in-up">
                        <div className="flex bg-slate-50 p-1 rounded-xl border border-slate-200 w-fit mb-2">
                          {['info', 'detail', 'specs', 'history'].map(tab => (
                            <button 
                              key={tab} 
                              onClick={() => setActiveTab(tab)} 
                              className={`px-5 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === tab ? 'bg-white text-[#111f42] shadow-sm' : 'text-slate-400 hover:text-[#111f42]'}`}
                            >
                              {tab}
                            </button>
                          ))}
                        </div>

                        {activeTab === 'info' && (
                          <div className="grid grid-cols-1 md:grid-cols-12 gap-5">
                            <div className="md:col-span-4 space-y-4">
                              <div 
                                className="aspect-square bg-white rounded-2xl border-2 border-dashed border-slate-300 flex items-center justify-center relative overflow-hidden group hover:border-[#ab8a3b] transition-colors cursor-pointer" 
                                onClick={() => fileInputRef.current?.click()}
                              >
                                {form.image ? (
                                  <img src={form.image} className="w-full h-full object-cover" alt="Preview" />
                                ) : (
                                  <div className="text-center text-slate-400">
                                    <ImagePlus size={32} className="mx-auto mb-2 opacity-50" strokeWidth={1.5} />
                                    <span className="text-[10px] font-bold uppercase tracking-widest block">Upload Photo</span>
                                  </div>
                                )}
                              </div>
                              <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleImageUpload} />
                              
                              <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
                                <label className="block text-[10px] font-black text-slate-400 uppercase mb-3 font-mono tracking-widest">Color Palette</label>
                                <div className="flex flex-wrap gap-2 items-center">
                                  {form.colors.map((c: string, i: number) => (
                                    <div key={i} className="flex items-center bg-slate-50 p-1 rounded-full border border-slate-200 shadow-sm">
                                      <input 
                                        type="color" 
                                        value={c} 
                                        onChange={(e) => updateColor(e.target.value, i)} 
                                        className="w-6 h-6 rounded-full border-none cursor-pointer p-0 overflow-hidden bg-transparent" 
                                      />
                                      <button onClick={() => removeColor(i)} className="text-slate-400 hover:text-rose-500 pr-1 pl-0.5"><X size={12} /></button>
                                    </div>
                                  ))}
                                  <button onClick={addColor} className="w-8 h-8 rounded-full border-2 border-dashed border-slate-300 flex items-center justify-center text-slate-400 hover:border-[#ab8a3b] hover:text-[#111f42] hover:bg-[#ab8a3b]/5 transition-all">
                                    <Plus size={14} />
                                  </button>
                                </div>
                              </div>
                            </div>

                            <div className="md:col-span-8 grid grid-cols-2 gap-x-5 gap-y-5 bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-sm h-fit">
                              <div className="col-span-2">
                                <label className="block text-[10px] font-black text-[#111f42] uppercase mb-1.5 tracking-widest font-mono">Pattern Name <span className="text-[#E3624A]">*</span></label>
                                <input value={form.name} onChange={e => setForm({...form, name: e.target.value})} className="input-primary w-full font-bold text-[13px]" placeholder="Enter pattern name..." />
                              </div>
                              <div>
                                <label className="block text-[10px] font-black text-[#111f42] uppercase mb-1.5 tracking-widest font-mono">Category</label>
                                <select value={form.category} onChange={e => setForm({...form, category: e.target.value})} className="input-primary w-full cursor-pointer font-bold text-[12px] bg-white">
                                  {fabricCategories.map(c => <option key={c} value={c}>{c}</option>)}
                                </select>
                              </div>
                              <div>
                                <label className="block text-[10px] font-black text-[#111f42] uppercase mb-1.5 tracking-widest font-mono">Composition</label>
                                <input value={form.composition} onChange={e => setForm({...form, composition: e.target.value})} className="input-primary w-full text-[12px]" placeholder="e.g. 100% Cotton" />
                              </div>
                              <div className="col-span-2">
                                <label className="block text-[10px] font-black text-[#111f42] uppercase mb-1.5 tracking-widest font-mono">Usage / Application</label>
                                <input value={form.application} onChange={e => setForm({...form, application: e.target.value})} className="input-primary w-full text-[12px] font-bold text-[#ab8a3b]" placeholder="e.g. Ironing Board Cover, Sofa..." />
                              </div>
                              <div className="col-span-2 border-t border-slate-100 pt-3 mt-1">
                                <label className="block text-[10px] font-black text-[#111f42] uppercase mb-1.5 tracking-widest font-mono">Status</label>
                                <select value={form.status} onChange={e => setForm({...form, status: e.target.value})} className="input-primary w-full cursor-pointer text-[12px] font-bold bg-white">
                                  <option value="Active">Active</option>
                                  <option value="In Development">In Development</option>
                                  <option value="Archived">Archived</option>
                                </select>
                              </div>
                            </div>
                          </div>
                        )}

                        {activeTab === 'detail' && (
                          <div className="max-w-2xl mx-auto space-y-5">
                            <div>
                              <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5 font-mono">Product Description</label>
                              <textarea className="input-primary h-32 resize-none" value={form.description || ''} onChange={e => setForm({...form, description: e.target.value})} placeholder="Detailed product description..."></textarea>
                            </div>
                            <div>
                              <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5 font-mono">Care Instructions</label>
                              <textarea className="input-primary h-24 resize-none" value={form.care_instructions || ''} onChange={e => setForm({...form, care_instructions: e.target.value})} placeholder="How to clean and maintain..."></textarea>
                            </div>
                          </div>
                        )}

                        {activeTab === 'specs' && (
                          <div className="max-w-2xl mx-auto grid grid-cols-2 gap-5">
                            <div>
                              <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5 font-mono">Width (Inch)</label>
                              <input value={form.width} onChange={e => setForm({...form, width: e.target.value})} className="input-primary font-mono text-[12px]" placeholder="e.g. 58&quot;" />
                            </div>
                            <div>
                              <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5 font-mono">Weight (GSM)</label>
                              <input value={form.weight} onChange={e => setForm({...form, weight: e.target.value})} className="input-primary font-mono text-[12px]" placeholder="e.g. 250 gsm" />
                            </div>
                            <div className="col-span-2">
                              <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5 font-mono">Tags</label>
                              <input value={form.tags} onChange={e => setForm({...form, tags: e.target.value})} className="input-primary text-[12px]" placeholder="Spring, Floral, 2026..." />
                            </div>
                          </div>
                        )}

                        {activeTab === 'history' && (
                          <div className="max-w-2xl mx-auto space-y-4">
                            <div className="border-b border-slate-100 pb-2 mb-6">
                              <h4 className="text-[12px] font-black text-[#111f42] uppercase tracking-widest">DOCUMENT HISTORY</h4>
                            </div>
                            
                            <div className="space-y-5">
                              {form.history && form.history.length > 0 ? (
                                form.history.map((h: any, i: number) => (
                                  <div key={i} className="flex gap-4">
                                    <div className="flex flex-col items-center">
                                      <div className="w-8 h-8 rounded-full bg-[#111f42] flex items-center justify-center text-[#ab8a3b] shadow-sm z-10">
                                        <Clock size={14} />
                                      </div>
                                      {i !== form.history.length - 1 && <div className="w-px h-full bg-slate-200 my-1"></div>}
                                    </div>
                                    <div className="pb-4 pt-1">
                                      <p className="text-[10px] text-slate-400 font-mono tracking-wider font-bold">{h.date}</p>
                                      <p className="text-[12px] font-black text-[#111f42] mt-0.5 uppercase tracking-wide">{h.action}</p>
                                      <p className="text-[11px] text-slate-500 mt-0.5 flex items-center gap-1 font-medium"><User size={10}/> By {h.user}</p>
                                    </div>
                                  </div>
                                ))
                              ) : (
                                <div className="text-center py-10 text-slate-400">
                                  <History size={40} className="mx-auto mb-4 opacity-20"/>
                                  <p className="text-[11px] font-black uppercase tracking-widest">No history recorded yet.</p>
                                </div>
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                  
                  {!isConfigMode && (
                    <div className="p-4 sm:p-5 border-t border-slate-200 bg-slate-50 flex justify-between items-center shrink-0 rounded-b-2xl">
                      <div className="flex items-center gap-3">
                        <button onClick={onClose} className="px-6 py-3 text-slate-500 text-[11px] font-black uppercase tracking-widest font-mono hover:text-[#111f42] transition-colors">Cancel</button>
                        {isEditing && (
                          <button onClick={() => onDelete(form.id)} className="text-[11px] font-black uppercase tracking-widest text-rose-500 hover:text-rose-700 transition-colors font-mono flex items-center gap-1">
                            <Trash2 size={14} /> Delete
                          </button>
                        )}
                      </div>
                      <button onClick={onSave} className="px-6 py-3 bg-[#111f42] text-[#ab8a3b] text-[11px] font-black rounded-xl shadow-lg shadow-[#111f42]/20 hover:brightness-110 transition-all flex items-center gap-2 uppercase tracking-widest font-mono">
                        <Save size={16} /> Save Design
                      </button>
                    </div>
                  )}
                </div>
              </DraggableWrapper>

    </div>
  );
};

export default FabricActionModal;

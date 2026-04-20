import React, { useRef } from 'react';
import { X, Armchair, ImagePlus, Clock, User, History, Trash2, Save } from 'lucide-react';

interface CatalogueActionModalProps {
  show: boolean;
  onClose: () => void;
  isEditing: boolean;
  form: any;
  setForm: (form: any) => void;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  productCategories: string[];
  itemMasterFG: any[];
  onSave: () => void;
  onDelete: (id: any) => void;
}

const CatalogueActionModal: React.FC<CatalogueActionModalProps> = ({
  show, onClose, isEditing, form, setForm, activeTab, setActiveTab, productCategories, itemMasterFG, onSave, onDelete
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!show) return null;

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setForm({ ...form, image: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleItemMasterSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedSku = e.target.value;
    const item = itemMasterFG.find(i => i.itemCode === selectedSku);
    if (item) {
      setForm({
        ...form,
        sku: item.itemCode,
        name: item.itemName,
        category: item.category || 'Living Room',
        price: item.price.toString()
      });
    } else {
      setForm({ ...form, sku: '', name: '' });
    }
  };

  return (
    <div className="modal-overlay open" onClick={onClose}>
      <div className="modal-box p-0 max-w-[1000px] border-t-[6px] border-[#ab8a3b] rounded-[16px]" onClick={e => e.stopPropagation()}>
        <div className="bg-[#111f42] px-8 py-5 flex justify-between items-center text-white shrink-0">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center text-[#ab8a3b] shadow-inner">
              <Armchair size={24} />
            </div>
            <div>
              <h3 className="text-xl font-black uppercase tracking-widest flex items-center gap-3">
                {isEditing ? 'Edit Furniture' : 'New Furniture'}
              </h3>
              <p className="text-[10px] font-bold text-slate-400 mt-1 uppercase tracking-widest font-mono">
                SKU: {form.sku || 'PENDING'}
              </p>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white hover:bg-white/10 p-1.5 rounded-lg transition-colors">
            <X size={24} />
          </button>
        </div>

        <div className="flex-1 flex overflow-hidden">
          <div className="w-48 bg-slate-50 border-r border-slate-100 p-4 space-y-1 shrink-0">
            {['info', 'detail', 'specs', 'history'].map(tab => (
              <button 
                key={tab} 
                onClick={() => setActiveTab(tab)} 
                className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-xl transition-all text-left text-[11px] font-bold tracking-widest uppercase ${activeTab === tab ? 'bg-[#111f42] text-[#ab8a3b] shadow-md' : 'text-slate-500 hover:bg-slate-100 hover:text-[#111f42]'}`}
              >
                {tab}
              </button>
            ))}
          </div>
          <div className="flex-1 overflow-y-auto wh-custom-scrollbar p-8 bg-[#F9F7F6]">
            {activeTab === 'info' && (
              <div className="max-w-3xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 animate-fade-in-up">
                <div className="md:col-span-1 space-y-4">
                  <div 
                    className="aspect-square bg-white rounded-2xl border-2 border-dashed border-slate-200 flex items-center justify-center relative overflow-hidden cursor-pointer hover:border-[#ab8a3b] transition-colors" 
                    onClick={() => fileInputRef.current?.click()}
                  >
                    {form.image ? (
                      <img src={form.image} className="w-full h-full object-cover" alt="Preview" />
                    ) : (
                      <div className="text-center flex flex-col items-center">
                        <ImagePlus size={32} className="text-slate-300 mb-2" />
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Upload Image</span>
                      </div>
                    )}
                  </div>
                  <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleImageUpload} />
                </div>
                <div className="md:col-span-2 grid grid-cols-2 gap-5">
                  <div className="col-span-2">
                    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">Product (จาก Item Master)</label>
                    {!isEditing ? (
                      <select value={form.sku} onChange={handleItemMasterSelect} className="input-primary bg-white cursor-pointer font-bold text-[13px]">
                        <option value="">-- เลือกสินค้าจาก Item Master --</option>
                        {itemMasterFG.map(i => <option key={i.itemCode} value={i.itemCode}>{i.itemCode} - {i.itemName}</option>)}
                      </select>
                    ) : (
                      <input value={`${form.sku} - ${form.name}`} disabled className="input-primary bg-slate-50 text-slate-500 font-bold text-[13px]" />
                    )}
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">SKU</label>
                    <input value={form.sku} disabled className="input-primary font-mono font-bold bg-slate-50 text-slate-500" placeholder="E.g. SF-001" />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">Price (฿)</label>
                    <input type="number" value={String(form.price).replace(/,/g, '')} onChange={e => setForm({ ...form, price: e.target.value })} className="input-primary text-right font-mono font-bold text-[#E3624A]" placeholder="0" />
                  </div>
                  <div className="col-span-2">
                    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">Category</label>
                    <select value={form.category} onChange={e => setForm({ ...form, category: e.target.value })} className="input-primary bg-white cursor-pointer font-bold">
                      {productCategories.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                  </div>
                </div>
              </div>
            )}
            {activeTab === 'detail' && (
              <div className="max-w-2xl mx-auto space-y-5 animate-fade-in-up">
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">Product Description</label>
                  <textarea className="input-area h-32 resize-none" value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} placeholder="Detailed product description..."></textarea>
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">Care Instructions</label>
                  <textarea className="input-area h-24 resize-none" value={form.care_instructions} onChange={e => setForm({ ...form, care_instructions: e.target.value })} placeholder="How to clean and maintain..."></textarea>
                </div>
              </div>
            )}
            {activeTab === 'specs' && (
              <div className="max-w-2xl mx-auto grid grid-cols-2 gap-5 animate-fade-in-up">
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">Dimensions</label>
                  <input value={form.dimensions} onChange={e => setForm({ ...form, dimensions: e.target.value })} className="input-primary font-mono text-[12px]" placeholder="W x D x H cm" />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">Weight</label>
                  <input value={form.spec_weight} onChange={e => setForm({ ...form, spec_weight: e.target.value })} className="input-primary font-mono text-[12px]" placeholder="e.g. 45 kg" />
                </div>
                <div className="col-span-2">
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">Material Details</label>
                  <input value={form.materialDetail} onChange={e => setForm({ ...form, materialDetail: e.target.value })} className="input-primary" placeholder="Specific materials used..." />
                </div>
              </div>
            )}
            {activeTab === 'history' && (
              <div className="max-w-2xl mx-auto space-y-6 animate-fade-in-up">
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
        </div>
        
        <div className="p-6 bg-slate-50 border-t border-slate-200 flex justify-between items-center px-8 rounded-b-2xl">
          <div className="flex items-center gap-3">
            <button onClick={onClose} className="text-[11px] font-black uppercase tracking-widest text-slate-400 hover:text-[#111f42] transition-colors font-mono">Cancel</button>
            {isEditing && (
              <button onClick={() => onDelete(form.id)} className="text-[11px] font-black uppercase tracking-widest text-rose-500 hover:text-rose-700 transition-colors font-mono flex items-center gap-1">
                <Trash2 size={14} /> Delete
              </button>
            )}
          </div>
          <button onClick={onSave} className="bg-[#111f42] text-[#ab8a3b] px-10 py-3 rounded-xl font-black uppercase text-[11px] shadow-lg shadow-[#111f42]/20 hover:brightness-110 transition-all flex items-center gap-2 font-mono">
            <Save size={16}/> Save Product
          </button>
        </div>
      </div>
    </div>
  );
};

export default CatalogueActionModal;

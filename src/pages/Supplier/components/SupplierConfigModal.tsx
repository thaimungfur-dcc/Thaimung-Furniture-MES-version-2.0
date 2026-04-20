import React from 'react';
import { X, Settings, PlusCircle } from 'lucide-react';

interface SupplierConfigModalProps {
  configModalOpen: boolean;
  setConfigModalOpen: (open: boolean) => void;
  masterConfig: any;
}

const SupplierConfigModal: React.FC<SupplierConfigModalProps> = ({
  configModalOpen,
  setConfigModalOpen,
  masterConfig
}) => {
  if (!configModalOpen) return null;

  return (
    <div className="fixed inset-0 bg-[#111f42]/60 backdrop-blur-md z-[100] flex items-center justify-center p-4 animate-in zoom-in duration-200">
      <div className="bg-white rounded-2xl w-full max-w-2xl shadow-2xl overflow-hidden flex flex-col max-h-[80vh] border-t-[6px] border-[#ab8a3b]">
        <div className="px-6 py-5 bg-[#111f42] text-white flex justify-between items-center border-b border-slate-100">
          <h3 className="text-sm font-black uppercase tracking-widest flex items-center gap-2"><Settings size={18} className="text-[#ab8a3b]"/> Category Configuration</h3>
          <button onClick={()=>setConfigModalOpen(false)} className="hover:bg-white/20 p-1.5 rounded-lg transition-colors text-slate-400 hover:text-white"><X size={20}/></button>
        </div>
        <div className="flex-1 overflow-y-auto p-8 custom-scrollbar space-y-8 bg-[#F9F7F6]">
          <section className="space-y-4">
            <div className="flex justify-between items-center border-b border-slate-200 pb-2">
              <h4 className="font-black text-[#111f42] uppercase text-[11px] tracking-widest">Master Categories</h4>
              <button className="text-[10px] font-bold text-[#ab8a3b] flex items-center gap-1 hover:underline"><PlusCircle size={12}/> Add Category</button>
            </div>
            <div className="flex flex-wrap gap-2">
              {masterConfig.categories.map((c: string) => (
                <div key={c} className="bg-white px-4 py-2 rounded-xl flex items-center gap-3 border border-slate-200 shadow-sm">
                  <span className="font-bold text-[11px] text-[#111f42]">{c}</span>
                  <button className="text-slate-300 hover:text-rose-500 transition-colors"><X size={12}/></button>
                </div>
              ))}
            </div>
          </section>
          <section className="space-y-4">
            <div className="flex justify-between items-center border-b border-slate-200 pb-2">
              <h4 className="font-black text-[#111f42] uppercase text-[11px] tracking-widest">Sub Categories Mappings</h4>
            </div>
            <div className="grid grid-cols-1 gap-4">
              {Object.entries(masterConfig.subCategories).map(([cat, subs]: [string, any]) => (
                <div key={cat} className="p-5 bg-white border border-slate-200 rounded-2xl shadow-sm">
                  <div className="font-black text-[11px] text-[#E3624A] uppercase tracking-widest mb-4 flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-[#E3624A]"></div> {cat}
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {subs.map((s: string) => (
                      <span key={s} className="bg-slate-50 border border-slate-100 px-3 py-1.5 rounded-lg text-[10px] font-bold text-slate-600 flex items-center gap-2 group">
                        {s} <X size={10} className="cursor-pointer text-slate-300 group-hover:text-rose-500 transition-colors" />
                      </span>
                    ))}
                    <button className="text-[#ab8a3b] p-1.5 hover:bg-slate-50 rounded-lg transition-all border border-dashed border-[#ab8a3b]"><PlusCircle size={14}/></button>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>
        <div className="p-6 bg-slate-50 border-t border-slate-200 flex justify-end">
          <button onClick={()=>setConfigModalOpen(false)} className="bg-[#111f42] text-[#ab8a3b] px-10 py-3 rounded-xl font-black text-[11px] uppercase tracking-widest shadow-md hover:bg-[#1a2d5c] transition-all font-mono">Done / Save Master</button>
        </div>
      </div>
    </div>
  );
};

export default SupplierConfigModal;

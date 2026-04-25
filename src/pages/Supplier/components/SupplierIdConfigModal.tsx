import React from 'react';
import { X, Settings2 } from 'lucide-react';
import { DraggableWrapper } from "../../../components/shared/DraggableWrapper";

interface SupplierIdConfigModalProps {
  idConfigModalOpen: boolean;
  setIdConfigModalOpen: (open: boolean) => void;
  idConfig: any;
  setIdConfig: (config: any) => void;
  generateSupplierID: (category: string) => string;
  currentCategory: string;
  setForm: (form: any) => void;
  form: any;
}

const SupplierIdConfigModal: React.FC<SupplierIdConfigModalProps> = ({
  idConfigModalOpen,
  setIdConfigModalOpen,
  idConfig,
  setIdConfig,
  generateSupplierID,
  currentCategory,
  setForm,
  form
}) => {
  if (!idConfigModalOpen) return null;

  return (
    <div className="fixed inset-0 bg-[#111f42]/80 backdrop-blur-sm z-[11000] flex items-center justify-center p-4 animate-in fade-in" onClick={() => setIdConfigModalOpen(false)}>
      
          <DraggableWrapper>
                <div className="bg-white rounded-2xl w-full max-w-[400px] shadow-2xl overflow-hidden border-t-[6px] border-[#ab8a3b]" onClick={e => e.stopPropagation()}>
                  <div className="px-6 py-2.5 border-b border-slate-100 flex justify-between items-center">
                    <h3 className="font-black text-[#111f42] text-[12px] uppercase tracking-widest flex items-center gap-2"><Settings2 size={16} className="text-[#ab8a3b]"/> Config Supplier ID</h3>
                    <button onClick={() => setIdConfigModalOpen(false)} className="text-slate-400 hover:text-rose-500"><X size={18}/></button>
                  </div>
                  <div className="p-4 sm:p-5 space-y-4">
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Prefix (Supplier)</label>
                      <input value={idConfig.prefixes['Supplier']} onChange={e=>setIdConfig({...idConfig, prefixes: {...idConfig.prefixes, 'Supplier': e.target.value.toUpperCase()}})} className="w-full px-3 py-2.5 border border-slate-200 rounded-lg outline-none focus:border-[#ab8a3b] font-mono font-bold text-[13px]" />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Prefix (Service)</label>
                      <input value={idConfig.prefixes['Service']} onChange={e=>setIdConfig({...idConfig, prefixes: {...idConfig.prefixes, 'Service': e.target.value.toUpperCase()}})} className="w-full px-3 py-2.5 border border-slate-200 rounded-lg outline-none focus:border-[#ab8a3b] font-mono font-bold text-[13px]" />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Prefix (OEM)</label>
                      <input value={idConfig.prefixes['OEM']} onChange={e=>setIdConfig({...idConfig, prefixes: {...idConfig.prefixes, 'OEM': e.target.value.toUpperCase()}})} className="w-full px-3 py-2.5 border border-slate-200 rounded-lg outline-none focus:border-[#ab8a3b] font-mono font-bold text-[13px]" />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Date Format</label>
                      <select value={idConfig.dateFormat} onChange={e=>setIdConfig({...idConfig, dateFormat: e.target.value})} className="w-full px-3 py-2.5 border border-slate-200 rounded-lg outline-none focus:border-[#ab8a3b] font-mono font-bold text-[13px] bg-white">
                        <option value="YYMMDD">YYMMDD (260317)</option>
                        <option value="YYMM">YYMM (2603)</option>
                        <option value="YYYY">YYYY (2026)</option>
                        <option value="NONE">No Date</option>
                      </select>
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Running Number Length</label>
                      <input type="number" min="2" max="6" value={idConfig.runningLength} onChange={e=>setIdConfig({...idConfig, runningLength: Number(e.target.value)})} className="w-full px-3 py-2.5 border border-slate-200 rounded-lg outline-none focus:border-[#ab8a3b] font-mono font-bold text-[13px]" />
                    </div>
                    <div className="mt-4 p-4 bg-slate-900 rounded-xl border-l-4 border-[#ab8a3b]">
                      <p className="text-[9px] text-slate-400 font-bold uppercase tracking-widest mb-1">Continuous Preview:</p>
                      <p className="text-[14px] font-black text-white font-mono">{generateSupplierID(currentCategory || 'Supplier')}</p>
                    </div>
                  </div>
                  <div className="p-4 border-t border-slate-100 bg-slate-50 flex justify-end">
                    <button onClick={() => { setIdConfigModalOpen(false); setForm({...form, supplierID: generateSupplierID(currentCategory || 'Supplier')}); }} className="bg-[#ab8a3b] text-[#111f42] px-6 py-2 rounded-lg font-black text-[10px] uppercase tracking-widest hover:brightness-95 transition-all">Apply Generator</button>
                  </div>
                </div>
              </DraggableWrapper>

    </div>
  );
};

export default SupplierIdConfigModal;

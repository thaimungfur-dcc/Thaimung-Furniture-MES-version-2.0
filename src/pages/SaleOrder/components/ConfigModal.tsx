import React from 'react';
import { X, Settings } from 'lucide-react';

interface ConfigModalProps {
  configModal: boolean;
  setConfigModal: (open: boolean) => void;
  idConfig: { format: string; reset: string };
  setIdConfig: (config: any) => void;
  currentSONumber: string;
}

export default function ConfigModal({
  configModal,
  setConfigModal,
  idConfig,
  setIdConfig,
  currentSONumber
}: ConfigModalProps) {
  if (!configModal) return null;

  return (
    <div className="fixed inset-0 bg-[#0f172a]/50 backdrop-blur-sm z-[110] flex items-center justify-center p-4">
      <div className="bg-white rounded-[3rem] w-full max-w-sm shadow-2xl p-10 border border-white relative overflow-hidden">
        <div className="absolute -top-10 -right-10 w-40 h-40 bg-[#ab8a3b]/5 rounded-full"></div>
        <div className="flex justify-between items-center mb-8 relative z-10">
          <h2 className="text-xl font-normal text-[#111f42] uppercase tracking-tighter flex items-center gap-3"><Settings className="text-[#ab8a3b]" size={24}/> Document Config</h2>
          <button onClick={()=>setConfigModal(false)} className="text-slate-300 hover:text-red-500 transition-colors"><X size={24}/></button>
        </div>
        <div className="space-y-6 relative z-10">
          <div className="space-y-2">
            <label className="text-[10px] font-normal text-slate-400 uppercase tracking-widest ml-1">SO Format Pattern</label>
            <input type="text" value={idConfig.format} onChange={e=>setIdConfig({...idConfig, format: e.target.value})} className="w-full border-2 border-slate-100 p-4 rounded-2xl font-mono text-sm font-bold focus:border-[#ab8a3b] outline-none bg-slate-50 transition-all"/>
          </div>
          <div className="bg-[#111f42] p-6 rounded-3xl text-center shadow-xl shadow-navy/20">
            <p className="text-[9px] font-normal text-white/50 mb-2 uppercase tracking-widest">LIVE PREVIEW</p>
            <p className="font-mono text-xl font-bold text-white tracking-widest">{currentSONumber}</p>
          </div>
          <button onClick={()=>setConfigModal(false)} className="w-full bg-[#E3624A] text-white p-4 rounded-3xl font-normal uppercase tracking-[0.2em] shadow-lg shadow-orange-200 hover:-translate-y-0.5 active:scale-95 transition-all text-xs">Save Configuration</button>
        </div>
      </div>
    </div>
  );
}

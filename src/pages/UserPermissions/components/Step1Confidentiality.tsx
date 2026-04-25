import React from 'react';
import { Lock, Eye, ChevronDown } from 'lucide-react';
import { SYSTEM_MODULES } from '../constants';

interface Step1ConfidentialityProps {
  confidentialityMap: Record<string, boolean>;
  toggleConfidentiality: (id: string) => void;
  expandedModules: Record<string, boolean>;
  toggleExpand: (id: string) => void;
}

export default function Step1Confidentiality({
  confidentialityMap,
  toggleConfidentiality,
  expandedModules,
  toggleExpand
}: Step1ConfidentialityProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-in fade-in flex-1 min-h-0">
      <div className="md:col-span-1 space-y-6 overflow-y-auto custom-scrollbar pr-2">
        <div className="bg-white/80 backdrop-blur-md p-6 rounded-2xl shadow-sm border border-white/50">
          <h3 className="text-lg font-black text-[#111f42] mb-2 flex items-center gap-2 uppercase tracking-tight">
            <Lock size={20} className="text-[#E3624A]" />
            Confidentiality Rules
          </h3>
          <div className="space-y-4 mt-4">
            <div className="p-4 bg-green-50 rounded-xl border border-green-100">
              <div className="flex items-center gap-2 text-green-700 font-black text-[10px] uppercase tracking-widest mb-1">
                <Eye size={16} /> Public (No Lock)
              </div>
              <p className="text-xs text-green-600 leading-relaxed">
                Every logged-in user will have <strong>Read Only</strong> access by default. Specific rights can be added in Step 2.
              </p>
            </div>
            <div className="p-4 bg-red-50 rounded-xl border border-red-100">
              <div className="flex items-center gap-2 text-red-700 font-black text-[10px] uppercase tracking-widest mb-1">
                <Lock size={16} /> Confidential (Locked)
              </div>
              <p className="text-xs text-red-600 leading-relaxed">
                Only users explicitly assigned in <strong>Step 2</strong> will have access. Others will have <strong>No Access</strong>.
              </p>
            </div>
          </div>
        </div>
        
        <div className="bg-[#111f42] p-6 rounded-2xl shadow-xl text-white">
          <h4 className="text-[10px] font-black uppercase tracking-widest text-[#E3624A] mb-4">Quick Summary</h4>
          <div className="space-y-3">
            <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest">
              <span className="text-white/40">Total Modules</span>
              <span className="font-black">{SYSTEM_MODULES.length}</span>
            </div>
            <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest">
              <span className="text-white/40">Confidential</span>
              <span className="font-black text-[#E3624A]">{Object.values(confidentialityMap).filter(v => v).length}</span>
            </div>
            <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest">
              <span className="text-white/40">Public</span>
              <span className="font-black text-emerald-400">{Object.values(confidentialityMap).filter(v => !v).length}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="md:col-span-2 bg-white/70 backdrop-blur-md rounded-2xl shadow-sm border border-white/50 overflow-hidden flex flex-col h-full">
        <div className="p-4 bg-gray-50/80 border-b border-gray-200 flex justify-between items-center">
          <h3 className="text-sm font-bold text-[#0F172A] uppercase tracking-wider">Module Configuration</h3>
          <span className="text-[10px] font-bold text-[#64748B] uppercase">Toggle Lock to set Confidentiality</span>
        </div>
        <div className="overflow-y-auto custom-scrollbar p-6 space-y-4">
          {SYSTEM_MODULES?.map(module => {
            const isConfidential = confidentialityMap[module.id];
            const hasSub = module.subItems && module.subItems.length > 0;
            const isExpanded = expandedModules[module.id];

            return (
              <div key={module.id} className="space-y-2">
                <div className={`flex items-center justify-between p-4 rounded-xl border transition-all ${isConfidential ? 'bg-red-50/30 border-red-100' : 'bg-white border-gray-100 hover:border-[#ab8a3b]/30'}`}>
                  <div className="flex items-center gap-4">
                    <div className={`p-2.5 rounded-xl ${isConfidential ? 'bg-red-100 text-red-600' : 'bg-gray-100 text-gray-600'}`}>
                      <module.icon size={20} />
                    </div>
                    <div>
                      <div className="font-bold text-[#0F172A] text-sm flex items-center gap-2">
                        {module.label}
                        {hasSub && (
                          <button onClick={() => toggleExpand(module.id)} className="p-1 hover:bg-gray-200 rounded transition-colors">
                            <ChevronDown size={14} className={`transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
                          </button>
                        )}
                      </div>
                      <div className="text-[10px] text-[#64748B] font-medium uppercase tracking-tighter">
                        {isConfidential ? 'Restricted Access' : 'Public Access (Read Only for all)'}
                      </div>
                    </div>
                  </div>
                  <button 
                    onClick={() => toggleConfidentiality(module.id)}
                    className={`p-2 rounded-lg transition-all ${isConfidential ? 'bg-red-600 text-white shadow-lg shadow-red-200' : 'bg-gray-200 text-gray-400 hover:bg-gray-300'}`}
                  >
                    {isConfidential ? <Lock size={18} /> : <Eye size={18} />}
                  </button>
                </div>

                {hasSub && isExpanded && (
                  <div className="ml-12 space-y-2 animate-in slide-in-from-top-2">
                    {module.subItems?.map(sub => {
                      const subConfidential = confidentialityMap[sub.id];
                      return (
                        <div key={sub.id} className={`flex items-center justify-between p-3 rounded-lg border transition-all ${subConfidential ? 'bg-red-50/20 border-red-50' : 'bg-white/50 border-gray-50'}`}>
                          <span className="text-xs font-bold text-[#64748B]">{sub.label}</span>
                          <button 
                            onClick={() => toggleConfidentiality(sub.id)}
                            className={`p-1.5 rounded transition-all ${subConfidential ? 'text-red-500' : 'text-gray-300 hover:text-gray-400'}`}
                          >
                            {subConfidential ? <Lock size={14} /> : <Eye size={14} />}
                          </button>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

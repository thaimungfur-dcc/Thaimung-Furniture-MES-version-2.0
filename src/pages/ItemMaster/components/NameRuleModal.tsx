import React from 'react';
import { Settings, X, Tag, RefreshCw } from 'lucide-react';
import { DraggableWrapper } from "../../../components/shared/DraggableWrapper";

interface NameRuleModalProps {
    showNameRuleModal: boolean;
    setShowNameRuleModal: (show: boolean) => void;
    selectedRuleType: string;
    setSelectedRuleType: (type: string) => void;
    groups: string[];
    nameRules: Record<string, string>;
    setNameRules: (rules: Record<string, string>) => void;
    previewNameRule: string;
}

export default function NameRuleModal({ showNameRuleModal, setShowNameRuleModal, selectedRuleType, setSelectedRuleType, groups, nameRules, setNameRules, previewNameRule }: NameRuleModalProps) {
    if (!showNameRuleModal) return null;

    return (
        <div className="modal-overlay" onClick={() => setShowNameRuleModal(false)}>
            
            <DraggableWrapper>
                  <div className="modal-box w-full animate-fade-in-up" style={{ maxWidth: '480px', borderRadius: '16px', borderTop: '6px solid #ab8a3b' }} onClick={e => e.stopPropagation()}>
                            <div className="bg-[#111f42] px-6 py-2.5 flex justify-between items-center text-white">
                                <h3 className="text-[12px] font-black uppercase tracking-widest font-mono flex items-center gap-2"><Settings size={16} className="text-[#ab8a3b]"/> Name Generation Rules</h3>
                                <button onClick={() => setShowNameRuleModal(false)} className="hover:bg-white/10 p-1 rounded-lg"><X size={18}/></button>
                            </div>
                            <div className="p-4 sm:p-5 bg-white space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-1.5">
                                        <label className="text-[10px] font-bold text-slate-400 uppercase">Target Item Type</label>
                                        <select value={selectedRuleType} onChange={e => setSelectedRuleType(e.target.value)} className="input-primary text-[12px] font-bold bg-slate-50 border-slate-200">
                                            {groups?.filter(x => x !== 'All')?.map(g => <option key={g} value={g}>{g}</option>)}
                                        </select>
                                    </div>
                                    <div className="space-y-1.5">
                                        <label className="text-[10px] font-bold text-slate-400 uppercase">Tags Helper</label>
                                        <div className="text-[9px] text-slate-400 bg-slate-50 p-2 rounded border border-dashed border-slate-200 h-10 overflow-hidden truncate">
                                            {'{Category}, {SubCategory}, {Code}'}
                                        </div>
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-bold text-slate-400 uppercase">Generation Pattern</label>
                                    <div className="relative">
                                        <Tag size={16} className="absolute left-3 top-3 text-slate-300" />
                                        <input value={nameRules[selectedRuleType] || ''} onChange={e => setNameRules({...nameRules, [selectedRuleType]: e.target.value})} className="input-primary pl-10 font-mono text-[13px] border-[#ab8a3b]/30" />
                                    </div>
                                </div>
                                <div className="p-4 bg-slate-900 rounded-2xl border-l-4 border-[#ab8a3b] shadow-inner">
                                    <span className="text-[8px] font-bold text-slate-500 block mb-2 tracking-[0.2em] font-mono">LIVE PREVIEW</span>
                                    <span className="text-[15px] font-black text-white font-mono tracking-tight">{previewNameRule}</span>
                                </div>
                                <button onClick={() => setShowNameRuleModal(false)} className="w-full py-3 bg-[#ab8a3b] text-[#111f42] text-[11px] font-black uppercase rounded-xl shadow-lg shadow-[#ab8a3b]/20 hover:brightness-95 transition-all flex items-center justify-center gap-2">
                                    <RefreshCw size={14}/> Save & Apply Changes
                                </button>
                            </div>
                        </div>
                </DraggableWrapper>

        </div>
    );
}

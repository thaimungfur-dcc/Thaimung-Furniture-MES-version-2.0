import React from 'react';
import { Settings2, X, Check, PenTool, Trash2 } from 'lucide-react';
import { DraggableWrapper } from "../../../components/shared/DraggableWrapper";

interface GroupModalProps {
  showGroupModal: boolean;
  setShowGroupModal: (show: boolean) => void;
  editingGroup: string | null;
  editGroupText: string;
  setEditGroupText: (text: string) => void;
  saveEditGroup: () => void;
  cancelEditGroup: () => void;
  newGroup: string;
  setNewGroup: (text: string) => void;
  addGroup: () => void;
  groups: string[];
  startEditGroup: (g: string) => void;
  removeGroup: (g: string) => void;
}

export default function GroupModal({
  showGroupModal, setShowGroupModal, editingGroup, editGroupText, setEditGroupText,
  saveEditGroup, cancelEditGroup, newGroup, setNewGroup, addGroup, groups,
  startEditGroup, removeGroup
}: GroupModalProps) {
  if (!showGroupModal) return null;

  return (
    <div className="modal-overlay open" onClick={() => setShowGroupModal(false)}>
      
          <DraggableWrapper>
                <div className="modal-box p-0" style={{ maxWidth: '240px', borderRadius: '16px' }} onClick={e => e.stopPropagation()}>
                  <div className="px-4 py-3 bg-[#111f42] flex justify-between items-center text-white border-b-[4px] border-[#ab8a3b]">
                    <h3 className="font-black text-[10px] tracking-widest uppercase flex items-center gap-1.5 font-mono">
                      <Settings2 size={14} className="text-[#ab8a3b]" /> Config
                    </h3>
                    <button onClick={() => setShowGroupModal(false)} className="text-slate-400 hover:text-white transition-colors p-1 bg-white/10 rounded-md"><X size={14} /></button>
                  </div>
                  <div className="p-4 bg-[#F9F7F6] space-y-3">
                    <div className="flex flex-col gap-2">
                      {editingGroup ? (
                        <div className="flex gap-1.5 w-full">
                          <input value={editGroupText} onChange={e => setEditGroupText(e.target.value.toUpperCase())} className="input-primary w-full bg-amber-50 focus:bg-white font-bold px-2 py-1.5 text-[10px] min-w-0" placeholder="Rename" />
                          <button onClick={saveEditGroup} className="px-2 bg-emerald-500 text-white rounded-lg shadow-sm hover:bg-emerald-600 transition-colors shrink-0"><Check size={12} /></button>
                          <button onClick={cancelEditGroup} className="px-2 bg-slate-400 text-white rounded-lg shadow-sm hover:bg-slate-500 transition-colors shrink-0"><X size={12} /></button>
                        </div>
                      ) : (
                        <div className="flex gap-1.5 w-full">
                          <input value={newGroup} onChange={e => setNewGroup(e.target.value.toUpperCase())} className="input-primary w-full font-bold uppercase px-2 py-1.5 text-[10px] min-w-0" placeholder="New (AS)" />
                          <button onClick={addGroup} className="px-2.5 bg-[#111f42] text-[#ab8a3b] rounded-lg font-black text-[9px] uppercase tracking-wider shadow-sm hover:bg-[#1e346b] transition-colors font-mono shrink-0">ADD</button>
                        </div>
                      )}
                    </div>

                    <div className="space-y-1.5 max-h-[200px] overflow-y-auto master-custom-scrollbar pr-1">
                      {groups.filter(x => x !== 'All').map(g => (
                        <div key={g} className="flex justify-between items-center p-2 bg-white rounded-lg border border-slate-200 group hover:border-[#ab8a3b] transition-colors">
                          <span className="font-mono text-[11px] font-black text-[#111f42] flex-1 truncate">{g}</span>
                          <div className="flex gap-1 opacity-40 group-hover:opacity-100 transition-opacity shrink-0 ml-1">
                            <button onClick={() => startEditGroup(g)} className="w-6 h-6 rounded-md bg-blue-50 text-blue-500 flex items-center justify-center hover:bg-blue-500 hover:text-white transition-colors"><PenTool size={12} /></button>
                            <button onClick={() => removeGroup(g)} className="w-6 h-6 rounded-md bg-red-50 text-red-500 flex items-center justify-center hover:bg-red-500 hover:text-white transition-colors"><Trash2 size={12} /></button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </DraggableWrapper>

    </div>
  );
}

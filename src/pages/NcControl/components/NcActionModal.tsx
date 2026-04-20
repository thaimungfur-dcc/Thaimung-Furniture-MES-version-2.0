import React from 'react';
import { X, FileWarning, User, AlertTriangle, MessageSquare, ClipboardCheck, Save, Send } from 'lucide-react';

interface NcActionModalProps {
  modalOpen: boolean;
  setModalOpen: (open: boolean) => void;
  modalMode: string;
  modalTab: string;
  setModalTab: (tab: string) => void;
  formData: any;
  setFormData: (data: any) => void;
  handleSaveNC: () => void;
}

const NcActionModal: React.FC<NcActionModalProps> = ({
  modalOpen,
  setModalOpen,
  modalMode,
  modalTab,
  setModalTab,
  formData,
  setFormData,
  handleSaveNC
}) => {
  if (!modalOpen) return null;

  const isGeneralDisabled = modalMode === 'view' || modalMode === 'department';
  const isResponseDisabled = modalMode === 'view';
  const isFollowupDisabled = modalMode === 'view' || modalMode === 'department';

  return (
    <div className="fixed inset-0 bg-[#111f42]/40 backdrop-blur-sm z-50 flex items-center justify-center p-4 no-print animate-in zoom-in duration-200">
      <div className="bg-white rounded-2xl w-full max-w-5xl shadow-2xl overflow-hidden flex flex-col max-h-[95vh]">
        <div className="px-6 py-4 flex justify-between items-center bg-[#2C3F70] border-b-4 border-[#E3624A] text-white shrink-0">
          <div className="flex items-center gap-3">
            {modalMode === 'department' ? <User size={24} className="text-[#E3624A] bg-white/20 p-1 rounded" /> : <FileWarning size={24} className="text-[#E3624A]" />}
            <h2 className="text-lg font-semibold uppercase tracking-widest">{modalMode === 'department' ? 'Department Response Form' : 'NC Analysis & Management'}</h2>
          </div>
          <button onClick={() => setModalOpen(false)} className="hover:bg-white/10 p-1.5 rounded-lg transition-colors">
            <X size={24} />
          </button>
        </div>
        
        <div className="flex bg-slate-50 border-b overflow-x-auto no-scrollbar shrink-0">
          {[ 
            { id: 'general', label: '1. Problem Details', icon: AlertTriangle }, 
            { id: 'response', label: '2. Department Response', icon: MessageSquare }, 
            { id: 'followup', label: '3. Follow Up (QC)', icon: ClipboardCheck } 
          ].map(tab => {
            const isActive = modalTab === tab.id;
            let tabStyle = isActive ? (tab.id === 'response' ? 'bg-rose-500 text-white border-b-rose-700 shadow-inner' : 'bg-white text-[#111f42] border-b-[#E3624A]') : 'text-slate-400 hover:bg-slate-100';
            if (!isActive && tab.id === 'response') tabStyle = 'text-rose-500 hover:bg-rose-50';
            return (
              <button 
                key={tab.id} 
                onClick={() => setModalTab(tab.id)} 
                className={`px-8 py-3.5 flex items-center gap-2 text-[10px] font-black uppercase tracking-widest border-r border-slate-200 border-b-2 transition-all ${tabStyle}`}
              >
                <tab.icon size={16} /> {tab.label}
              </button>
            );
          })}
        </div>

        <div className="flex-1 overflow-y-auto p-8 custom-scrollbar bg-slate-50/30 space-y-8 animate-in fade-in duration-300">
          {modalTab === 'general' && (
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-slate-400 uppercase">Department</label>
                <input 
                  disabled={isGeneralDisabled} 
                  value={formData.department} 
                  onChange={e => setFormData({ ...formData, department: e.target.value })} 
                  className="w-full px-3 py-2 border rounded-lg focus:border-[#111f42] outline-none font-bold text-[12px] disabled:bg-slate-50" 
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-slate-400 uppercase">Item / Process</label>
                <input 
                  disabled={isGeneralDisabled} 
                  value={formData.item} 
                  onChange={e => setFormData({ ...formData, item: e.target.value })} 
                  className="w-full px-3 py-2 border rounded-lg text-[12px] disabled:bg-slate-50" 
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-slate-400 uppercase">Severity</label>
                <select 
                  disabled={isGeneralDisabled} 
                  value={formData.severity} 
                  onChange={e => setFormData({ ...formData, severity: e.target.value })} 
                  className="w-full px-3 py-2 border rounded-lg bg-white text-[12px] disabled:bg-slate-50"
                >
                  <option>Minor</option>
                  <option>Major</option>
                  <option>Critical</option>
                </select>
              </div>
              <div className="space-y-1.5 col-span-2">
                <label className="text-[10px] font-bold text-slate-400 uppercase">Problem Description</label>
                <textarea 
                  disabled={isGeneralDisabled} 
                  rows={4} 
                  value={formData.problem} 
                  onChange={e => setFormData({ ...formData, problem: e.target.value })} 
                  className="w-full px-3 py-2 border rounded-lg outline-none resize-none text-[12px] disabled:bg-slate-50" 
                />
              </div>
            </div>
          )}

          {modalTab === 'response' && (
            <div className={`bg-white p-6 rounded-2xl border shadow-sm space-y-6 animate-in fade-in ${modalMode === 'department' ? 'border-4 border-amber-400 bg-amber-50/30' : 'border-slate-200'}`}>
              <div className="bg-amber-50/50 p-4 rounded-xl border border-amber-100 text-amber-700 flex items-center gap-3">
                <MessageSquare size={20} />
                <p className="text-[11px] font-bold italic uppercase tracking-widest">Department Root Cause & Corrective Actions</p>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Root Cause / สาเหตุที่แท้จริง</label>
                <textarea 
                  disabled={isResponseDisabled} 
                  value={formData.response?.rootCause || ''} 
                  onChange={e => setFormData({ ...formData, response: { ...formData.response, rootCause: e.target.value } })} 
                  rows={3} 
                  className="w-full px-4 py-3 border rounded-xl outline-none focus:border-amber-400 text-[12px] disabled:bg-slate-50" 
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Corrective Action</label>
                  <textarea 
                    disabled={isResponseDisabled} 
                    value={formData.response?.corrective || ''} 
                    onChange={e => setFormData({ ...formData, response: { ...formData.response, corrective: e.target.value } })} 
                    rows={3} 
                    className="w-full px-4 py-3 border rounded-xl outline-none focus:border-amber-400 text-[12px] disabled:bg-slate-50" 
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Preventive Action</label>
                  <textarea 
                    disabled={isResponseDisabled} 
                    value={formData.response?.preventive || ''} 
                    onChange={e => setFormData({ ...formData, response: { ...formData.response, preventive: e.target.value } })} 
                    rows={3} 
                    className="w-full px-4 py-3 border rounded-xl outline-none focus:border-amber-400 text-[12px] disabled:bg-slate-50" 
                  />
                </div>
              </div>
            </div>
          )}

          {modalTab === 'followup' && (
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-6 animate-in fade-in">
              <div className="p-4 bg-blue-50/50 rounded-xl border border-blue-100 text-blue-700 flex items-center gap-3">
                <ClipboardCheck size={20} />
                <p className="text-[11px] font-bold italic uppercase tracking-widest">Internal Follow Up (QC)</p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-slate-400 uppercase">Follow Up Status</label>
                  <select 
                    disabled={isFollowupDisabled} 
                    value={formData.followUp?.status || 'Waiting'} 
                    onChange={e => setFormData({ ...formData, followUp: { ...formData.followUp, status: e.target.value } })} 
                    className="w-full px-3 py-2 border rounded-lg bg-white text-[12px] disabled:bg-slate-50"
                  >
                    <option>Waiting</option>
                    <option>In Progress</option>
                    <option>Success</option>
                    <option>Failed</option>
                  </select>
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-slate-400 uppercase">Checked By</label>
                  <input 
                    disabled={isFollowupDisabled} 
                    value={formData.followUp?.checker || ''} 
                    onChange={e => setFormData({ ...formData, followUp: { ...formData.followUp, checker: e.target.value } })} 
                    className="w-full px-3 py-2 border rounded-lg bg-white text-[12px] disabled:bg-slate-50" 
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Monitoring Results</label>
                <textarea 
                  disabled={isFollowupDisabled} 
                  value={formData.followUp?.results || ''} 
                  onChange={e => setFormData({ ...formData, followUp: { ...formData.followUp, results: e.target.value } })} 
                  rows={4} 
                  className="w-full px-4 py-3 border rounded-xl outline-none focus:border-blue-400 text-[12px] disabled:bg-slate-50" 
                />
              </div>
            </div>
          )}
        </div>

        <div className="p-6 bg-slate-50 border-t flex justify-between items-center shrink-0 px-8">
          <button 
            onClick={() => setModalOpen(false)} 
            className="px-6 py-2.5 rounded-lg border font-bold text-[11px] uppercase text-slate-500 bg-white hover:bg-slate-100 transition-all"
          >
            Close
          </button>
          {modalMode === 'department' ? (
            <button 
              onClick={handleSaveNC} 
              className="px-10 py-2.5 text-white rounded-lg font-bold shadow-md uppercase tracking-widest flex items-center gap-2 hover:opacity-90 transition-all bg-amber-500 text-[12px]"
            >
              <Send size={14} /> Submit Response
            </button>
          ) : (
            <button 
              onClick={handleSaveNC} 
              disabled={modalMode === 'view'} 
              className="px-10 py-2.5 text-white rounded-lg font-bold shadow-md uppercase tracking-widest flex items-center gap-2 hover:opacity-90 transition-all bg-[#111f42] text-[12px] disabled:opacity-50"
            >
              <Save size={14} /> Save Analysis
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default NcActionModal;

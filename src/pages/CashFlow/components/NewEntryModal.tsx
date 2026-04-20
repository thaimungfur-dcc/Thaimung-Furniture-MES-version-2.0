import React from 'react';
import { X, Plus } from 'lucide-react';

interface NewEntryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (e: React.FormEvent) => void;
  formData: any;
  setFormData: (data: any) => void;
}

export default function NewEntryModal({ isOpen, onClose, onSubmit, formData, setFormData }: NewEntryModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-[#111f42]/40 backdrop-blur-sm z-50 flex items-center justify-center p-4 no-print">
      <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden flex flex-col animate-in fade-in zoom-in duration-200">
        <div className="px-6 py-4 flex justify-between items-center bg-[#111f42] text-white">
          <h2 className="text-lg font-semibold uppercase tracking-widest flex items-center gap-2">
            <Plus size={20} /> Record Expense / Income
          </h2>
          <button onClick={onClose} className="hover:bg-white/20 p-1.5 rounded-lg transition-colors">
            <X size={20} />
          </button>
        </div>
        
        <form onSubmit={onSubmit} className="p-6 space-y-5">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="font-semibold text-slate-500 text-[10px] uppercase tracking-wider">Date</label>
              <input type="date" required value={formData.date} onChange={e => setFormData({...formData, date: e.target.value})} className="w-full px-3 py-2 border border-slate-200 rounded-lg outline-none focus:border-[#ab8a3b] font-medium" />
            </div>
            <div className="space-y-1.5">
              <label className="font-semibold text-slate-500 text-[10px] uppercase tracking-wider">Reference No.</label>
              <input type="text" value={formData.ref} onChange={e => setFormData({...formData, ref: e.target.value})} placeholder="Leave blank for Auto" className="w-full px-3 py-2 border border-slate-200 rounded-lg outline-none focus:border-[#ab8a3b] font-medium" />
            </div>
            <div className="space-y-1.5 col-span-2">
              <label className="font-semibold text-slate-500 text-[10px] uppercase tracking-wider">Description</label>
              <input type="text" required value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} placeholder="e.g. Marketing Expense" className="w-full px-3 py-2 border border-slate-200 rounded-lg outline-none focus:border-[#ab8a3b] font-medium" />
            </div>
            <div className="space-y-1.5">
              <label className="font-semibold text-slate-500 text-[10px] uppercase tracking-wider">Flow Category</label>
              <select value={formData.flowType} onChange={e => setFormData({...formData, flowType: e.target.value})} className="w-full px-3 py-2 border border-slate-200 rounded-lg outline-none focus:border-[#ab8a3b] font-medium">
                <option value="CFO">Operations (CFO)</option>
                <option value="CFI">Investing (CFI)</option>
                <option value="CFF">Financing (CFF)</option>
              </select>
            </div>
            <div className="space-y-1.5">
              <label className="font-semibold text-slate-500 text-[10px] uppercase tracking-wider">Type (In/Out)</label>
              <select value={formData.type} onChange={e => setFormData({...formData, type: e.target.value})} className="w-full px-3 py-2 border border-slate-200 rounded-lg outline-none focus:border-[#ab8a3b] font-medium">
                <option value="Out">Outflow (Expense)</option>
                <option value="In">Inflow (Revenue)</option>
              </select>
            </div>
            <div className="space-y-1.5 col-span-2">
              <label className="font-semibold text-slate-500 text-[10px] uppercase tracking-wider">Amount (฿)</label>
              <input type="number" step="0.01" required value={formData.amount} onChange={e => setFormData({...formData, amount: e.target.value})} placeholder="0.00" className="w-full px-3 py-2 border border-slate-200 rounded-lg outline-none focus:border-[#ab8a3b] font-medium text-lg" />
            </div>
            <div className="space-y-1.5 col-span-2">
              <label className="font-semibold text-slate-500 text-[10px] uppercase tracking-wider">Status</label>
              <div className="flex gap-4 mt-1">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="radio" value="Draft" checked={formData.status === 'Draft'} onChange={e => setFormData({...formData, status: e.target.value})} className="accent-[#ab8a3b]" />
                  <span className="text-sm font-semibold">Draft (Pending)</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="radio" value="Completed" checked={formData.status === 'Completed'} onChange={e => setFormData({...formData, status: e.target.value})} className="accent-[#ab8a3b]" />
                  <span className="text-sm font-semibold">Completed (Paid/Received)</span>
                </label>
              </div>
            </div>
          </div>

          <div className="pt-4 flex justify-end gap-3 border-t border-slate-100">
            <button type="button" onClick={onClose} className="px-5 py-2.5 rounded-lg font-semibold border border-slate-200 text-slate-500 hover:bg-slate-50 transition-colors uppercase tracking-wider">Cancel</button>
            <button type="submit" className="px-5 py-2.5 rounded-lg font-semibold text-white shadow-md hover:opacity-90 transition-all uppercase tracking-wider bg-[#111f42]">Save Entry</button>
          </div>
        </form>
      </div>
    </div>
  );
}

import React, { useState } from 'react';
import { X, Save, Hash, Package, User, Calendar, AlertCircle, Activity } from 'lucide-react';
import { JobOrder, ProductionStage } from '../types';
import { DraggableWrapper } from "../../../components/shared/DraggableWrapper";

interface JobOrderModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: Partial<JobOrder>) => void;
  editingOrder?: JobOrder;
}

export default function JobOrderModal({ isOpen, onClose, onSave, editingOrder }: JobOrderModalProps) {
  const [formData, setFormData] = useState<Partial<JobOrder>>(
    editingOrder || {
      joNo: `JO${new Date().getFullYear()}${(new Date().getMonth() + 1).toString().padStart(2, '0')}-${Math.floor(Math.random() * 1000).toString().padStart(3, '0')}`,
      productName: '',
      sku: '',
      qty: 1,
      received: 0,
      currentStage: 'Pending',
      status: 'Not Started',
      priority: 'Normal',
      dueDate: new Date().toISOString().split('T')[0],
      customerName: '',
      soRef: ''
    }
  );

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
      
          <DraggableWrapper>
                <div className="absolute inset-0 bg-[#111f42]/60 backdrop-blur-md" onClick={onClose} />
              </DraggableWrapper>

      
      <div className="relative w-full max-w-2xl bg-white rounded-[32px] shadow-2xl overflow-hidden flex flex-col animate-in zoom-in-95 duration-300">
        <div className="bg-[#111f42] p-5 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-[#ab8a3b] rounded-2xl flex items-center justify-center text-white shadow-lg">
              {editingOrder ? <Package size={24} /> : <Hash size={24} />}
            </div>
            <div>
              <h2 className="text-xl font-black text-white uppercase tracking-tight">
                {editingOrder ? 'Edit Work Order' : 'New Job Order'}
              </h2>
              <p className="text-[#ab8a3b] text-[10px] font-black uppercase tracking-widest mt-1">Manual Production Entry</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 text-white/40 hover:text-white hover:bg-white/10 rounded-xl transition-all">
            <X size={24} />
          </button>
        </div>

        <form onSubmit={(e) => { e.preventDefault(); onSave(formData); }} className="p-5 space-y-4 overflow-y-auto max-h-[70vh] custom-scrollbar">
          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                <Hash size={12} className="text-[#ab8a3b]" /> JO Number
              </label>
              <input 
                type="text"
                value={formData.joNo}
                onChange={(e) => setFormData({ ...formData, joNo: e.target.value })}
                className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 text-sm font-bold text-[#111f42] focus:border-[#ab8a3b] outline-none"
                required
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                <Calendar size={12} className="text-[#ab8a3b]" /> Target Due Date
              </label>
              <input 
                type="date"
                value={formData.dueDate}
                onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 text-sm font-bold text-[#111f42] focus:border-[#ab8a3b] outline-none"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
              <Package size={12} className="text-[#ab8a3b]" /> Product Name / Description
            </label>
            <input 
              type="text"
              placeholder="e.g. Modern Oak Table 180cm"
              value={formData.productName}
              onChange={(e) => setFormData({ ...formData, productName: e.target.value })}
              className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 text-sm font-bold text-[#111f42] focus:border-[#ab8a3b] outline-none"
              required
            />
          </div>

          <div className="grid grid-cols-3 gap-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                SKU / Code
              </label>
              <input 
                type="text"
                placeholder="SKU-001"
                value={formData.sku}
                onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
                className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 text-sm font-bold text-[#111f42] focus:border-[#ab8a3b] outline-none"
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                Target Qty
              </label>
              <input 
                type="number"
                min="1"
                value={formData.qty}
                onChange={(e) => setFormData({ ...formData, qty: Number(e.target.value) })}
                className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 text-sm font-bold text-[#111f42] focus:border-[#ab8a3b] outline-none"
                required
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                Priority
              </label>
              <select 
                value={formData.priority}
                onChange={(e) => setFormData({ ...formData, priority: e.target.value as any })}
                className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 text-sm font-bold text-[#111f42] focus:border-[#ab8a3b] outline-none appearance-none"
              >
                <option value="Normal">Normal</option>
                <option value="High">High</option>
                <option value="Urgent">Urgent</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                <User size={12} className="text-[#ab8a3b]" /> Customer (Optional)
              </label>
              <input 
                type="text"
                value={formData.customerName}
                onChange={(e) => setFormData({ ...formData, customerName: e.target.value })}
                className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 text-sm font-bold text-[#111f42] focus:border-[#ab8a3b] outline-none"
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                <Activity size={12} className="text-[#ab8a3b]" /> Current Stage
              </label>
              <select 
                value={formData.currentStage}
                onChange={(e) => setFormData({ ...formData, currentStage: e.target.value as ProductionStage })}
                className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 text-sm font-black text-[#111f42] font-mono text-[10px] uppercase tracking-widest focus:border-[#ab8a3b] outline-none appearance-none"
              >
                {['Pending', 'Cutting', 'Assembly', 'Finishing', 'Upholstery', 'QC', 'Packing', 'Completed']?.map(s => (
                  <option key={s} value={s}>{s.toUpperCase()}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="bg-amber-50 border border-amber-100 p-4 rounded-2xl flex gap-3">
             <AlertCircle className="text-[#ab8a3b] shrink-0" size={18} />
             <p className="text-[10px] text-[#ab8a3b] font-bold uppercase tracking-tight leading-relaxed">
               Ensuring accurate data will improve production forecasting and resource allocation.
             </p>
          </div>
        </form>

        <div className="p-5 bg-slate-50 border-t border-slate-100 flex items-center justify-end gap-4">
          <button onClick={onClose} className="px-5 py-3 text-[10px] font-black text-slate-400 uppercase tracking-widest hover:text-[#111f42] transition-colors">
            Cancel
          </button>
          <button 
            type="submit"
            onClick={(e) => { e.preventDefault(); onSave(formData); }}
            className="px-6 py-3 bg-[#111f42] text-white rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] shadow-lg shadow-blue-900/10 hover:brightness-110 active:scale-95 transition-all flex items-center gap-2"
          >
            <Save size={16} className="text-[#ab8a3b]" />
            Save Job Order
          </button>
        </div>
      </div>
    </div>
  );
}

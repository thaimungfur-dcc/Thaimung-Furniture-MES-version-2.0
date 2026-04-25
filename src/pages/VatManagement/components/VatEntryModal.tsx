import React from 'react';
import { Plus, X } from 'lucide-react';
import { DraggableWrapper } from "../../../components/shared/DraggableWrapper";

interface VatEntryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (e: React.FormEvent) => void;
  formData: {
    date: string;
    invoice: string;
    customer: string;
    amount: string;
    type: string;
    status: string;
  };
  setFormData: React.Dispatch<React.SetStateAction<any>>;
}

const VatEntryModal: React.FC<VatEntryModalProps> = ({ isOpen, onClose, onSubmit, formData, setFormData }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-[#111f42]/40 backdrop-blur-sm z-50 flex items-center justify-center p-4 no-print">
      
          <DraggableWrapper>
                <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden flex flex-col animate-in fade-in zoom-in duration-200">
                  <div className="px-6 py-2.5 flex justify-between items-center bg-[#111f42] text-white">
                    <h2 className="text-lg font-semibold uppercase tracking-widest flex items-center gap-2">
                      <Plus size={20} /> New Entry
                    </h2>
                    <button onClick={onClose} className="hover:bg-white/20 p-1.5 rounded-lg transition-colors">
                      <X size={20} />
                    </button>
                  </div>
                  
                  <form onSubmit={onSubmit} className="p-4 sm:p-5 space-y-5">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <label className="font-semibold text-slate-500 text-[10px] uppercase tracking-wider">Date</label>
                        <input type="date" required value={formData.date} onChange={e => setFormData({...formData, date: e.target.value})} className="w-full px-3 py-2 border border-slate-200 rounded-lg outline-none focus:border-slate-400 font-medium" />
                      </div>
                      <div className="space-y-1.5">
                        <label className="font-semibold text-slate-500 text-[10px] uppercase tracking-wider">Tax Type</label>
                        <select value={formData.type} onChange={e => setFormData({...formData, type: e.target.value})} className="w-full px-3 py-2 border border-slate-200 rounded-lg outline-none focus:border-slate-400 font-medium">
                          <option value="sales">Sales Tax (ภาษีขาย)</option>
                          <option value="purchase">Purchase Tax (ภาษีซื้อ)</option>
                        </select>
                      </div>
                      <div className="space-y-1.5">
                        <label className="font-semibold text-slate-500 text-[10px] uppercase tracking-wider">Invoice No.</label>
                        <input type="text" required value={formData.invoice} onChange={e => setFormData({...formData, invoice: e.target.value})} placeholder="INV-..." className="w-full px-3 py-2 border border-slate-200 rounded-lg outline-none focus:border-slate-400 font-medium" />
                      </div>
                      <div className="space-y-1.5">
                        <label className="font-semibold text-slate-500 text-[10px] uppercase tracking-wider">Customer / Vendor</label>
                        <input type="text" required value={formData.customer} onChange={e => setFormData({...formData, customer: e.target.value})} placeholder="Company Name" className="w-full px-3 py-2 border border-slate-200 rounded-lg outline-none focus:border-slate-400 font-medium" />
                      </div>
                      <div className="space-y-1.5 col-span-2">
                        <label className="font-semibold text-slate-500 text-[10px] uppercase tracking-wider">Base Amount (฿)</label>
                        <input type="number" step="0.01" required value={formData.amount} onChange={e => setFormData({...formData, amount: e.target.value})} placeholder="0.00" className="w-full px-3 py-2 border border-slate-200 rounded-lg outline-none focus:border-slate-400 font-medium" />
                      </div>
                    </div>
                    
                    <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 flex justify-between items-center mt-2">
                      <div>
                        <p className="font-semibold text-slate-400 text-[10px] uppercase tracking-widest">VAT (7%)</p>
                        <p className="font-bold text-lg text-[#b22026]">
                          ฿{((parseFloat(formData.amount) || 0) * 0.07)?.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-slate-400 text-[10px] uppercase tracking-widest">Total Amount</p>
                        <p className="font-bold text-2xl text-[#111f42]">
                          ฿{((parseFloat(formData.amount) || 0) * 1.07)?.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}
                        </p>
                      </div>
                    </div>

                    <div className="pt-4 flex justify-end gap-3 border-t border-slate-100">
                      <button type="button" onClick={onClose} className="px-5 py-2.5 rounded-lg font-semibold border border-slate-200 text-slate-500 hover:bg-slate-50 transition-colors uppercase tracking-wider">Cancel</button>
                      <button type="submit" className="px-5 py-2.5 rounded-lg font-semibold text-white shadow-md hover:opacity-90 transition-all uppercase tracking-wider bg-[#111f42]">Save Entry</button>
                    </div>
                  </form>
                </div>
              </DraggableWrapper>

    </div>
  );
};

export default VatEntryModal;

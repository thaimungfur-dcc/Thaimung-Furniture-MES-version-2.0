import React from 'react';
import { CreditCard, X, CheckCircle } from 'lucide-react';

export default function PaymentModal({ paymentModal, setPaymentModal, paymentForm, setPaymentForm, handlePaymentSubmit }: any) {
  if (!paymentModal) return null;

  return (
    <div className="fixed inset-0 bg-[#223149]/40 backdrop-blur-sm z-[60] flex items-center justify-center p-4 no-print">
      <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl overflow-hidden flex flex-col animate-in fade-in zoom-in duration-200">
        <div className="px-6 py-4 flex justify-between items-center bg-[#223149] text-white">
          <h2 className="text-lg font-semibold uppercase tracking-widest flex items-center gap-2">
            <CreditCard size={20} className="text-[#f2b33d]" /> Record Payment Receive
          </h2>
          <button onClick={() => setPaymentModal(null)} className="hover:bg-white/20 p-1.5 rounded-lg transition-colors">
            <X size={20} />
          </button>
        </div>
        
        <form onSubmit={handlePaymentSubmit} className="p-6 space-y-5">
          <div className="bg-gradient-to-br from-[#f0ede5]/50 to-[#f5f0e9] p-4 rounded-xl border border-[#d9b343]/20 flex justify-between items-center mb-2">
            <div>
              <p className="font-bold text-[#7693a6] text-[10px] uppercase tracking-widest">Balance Due</p>
              <p className="font-black text-xl text-[#ce5a43]">฿{(paymentModal.balance || 0).toLocaleString()}</p>
            </div>
            <div className="text-right">
              <p className="font-bold text-[#7693a6] text-[10px] uppercase tracking-widest">Invoice No.</p>
              <p className="font-bold text-sm text-[#223149]">{paymentModal.invNo}</p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="space-y-1.5">
              <label className="font-bold text-[#7693a6] text-[10px] uppercase tracking-wider">Payment Amount <span className="text-[#ce5a43]">*</span></label>
              <div className="relative">
                <span className="absolute left-3 top-2.5 text-[#7693a6] font-bold">฿</span>
                <input 
                  type="number" step="0.01" max={paymentModal.balance} required 
                  value={paymentForm.amount} onChange={(e: any) => setPaymentForm({...paymentForm, amount: e.target.value})} 
                  className="w-full px-3 py-2 pl-8 border border-slate-200 rounded-lg outline-none focus:border-[#496ca8] font-black text-lg text-right text-[#223149]" 
                  placeholder="0.00" 
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="font-bold text-[#7693a6] text-[10px] uppercase tracking-wider">Payment Date</label>
                <input type="date" required value={paymentForm.date} onChange={(e: any) => setPaymentForm({...paymentForm, date: e.target.value})} className="w-full px-3 py-2 border border-slate-200 rounded-lg outline-none focus:border-[#496ca8] font-bold text-xs text-[#223149]" />
              </div>
              <div className="space-y-1.5">
                <label className="font-bold text-[#7693a6] text-[10px] uppercase tracking-wider">Method</label>
                <select value={paymentForm.method} onChange={(e: any) => setPaymentForm({...paymentForm, method: e.target.value})} className="w-full px-3 py-2 border border-slate-200 rounded-lg outline-none focus:border-[#496ca8] font-bold text-xs text-[#223149]">
                  <option value="Bank Transfer">Bank Transfer</option>
                  <option value="Cash">Cash</option>
                  <option value="Cheque">Check</option>
                </select>
              </div>
            </div>
            <div className="space-y-1.5">
              <label className="font-bold text-[#7693a6] text-[10px] uppercase tracking-wider">Reference (Optional)</label>
              <input type="text" value={paymentForm.ref} onChange={(e: any) => setPaymentForm({...paymentForm, ref: e.target.value})} placeholder="Slip No. or Note" className="w-full px-3 py-2 border border-slate-200 rounded-lg outline-none focus:border-[#496ca8] font-bold text-xs text-[#223149]" />
            </div>
          </div>

          <div className="pt-4 flex justify-end gap-3 border-t border-slate-100">
            <button type="button" onClick={() => setPaymentModal(null)} className="px-5 py-2.5 rounded-lg font-bold border border-slate-200 text-[#7693a6] hover:bg-slate-50 transition-colors uppercase tracking-wider">Cancel</button>
            <button 
              type="submit" 
              disabled={!paymentForm.amount || Number(paymentForm.amount) <= 0 || Number(paymentForm.amount) > paymentModal.balance}
              className="px-5 py-2.5 rounded-lg font-bold text-white shadow-md hover:opacity-90 transition-all uppercase tracking-wider bg-gradient-to-r from-[#ce5a43] to-[#f28b30] disabled:opacity-50 disabled:from-slate-400 disabled:to-slate-400 flex items-center gap-2"
            >
              <CheckCircle size={16}/> Confirm Receive
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

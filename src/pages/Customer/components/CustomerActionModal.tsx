import React from 'react';
import { X, User, Info, MapPin, CreditCard, Pencil, Save, Settings, Settings2, FileText, Phone, Mail, ChevronDown } from 'lucide-react';
import { DraggableWrapper } from "../../../components/shared/DraggableWrapper";

interface CustomerActionModalProps {
  modalOpen: boolean;
  setModalOpen: (open: boolean) => void;
  modalMode: string;
  setModalMode: (mode: string) => void;
  activeFormTab: string;
  setActiveFormTab: (tab: string) => void;
  form: any;
  setForm: (form: any) => void;
  masterConfig: any;
  handleSave: () => void;
  setConfigModalOpen: (open: boolean) => void;
  setIdConfigModalOpen: (open: boolean) => void;
}

const CustomerActionModal: React.FC<CustomerActionModalProps> = ({
  modalOpen,
  setModalOpen,
  modalMode,
  setModalMode,
  activeFormTab,
  setActiveFormTab,
  form,
  setForm,
  masterConfig,
  handleSave,
  setConfigModalOpen,
  setIdConfigModalOpen
}) => {
  if (!modalOpen) return null;

  return (
    <div className="fixed inset-0 bg-[#111f42]/40 backdrop-blur-sm z-50 flex items-center justify-center p-4 no-print animate-in fade-in duration-200">
      
          <DraggableWrapper>
                <div className="bg-white rounded-2xl w-full max-w-5xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] border-t-[6px] border-[#ab8a3b]">
                  <div className="px-5 py-5 flex justify-between items-center bg-[#111f42] text-white shrink-0 border-b border-slate-100">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center text-[#ab8a3b] shadow-inner"><User size={24} /></div>
                      <div>
                        <h2 className="text-xl font-black uppercase tracking-widest">{modalMode === 'create' ? 'Register New Customer' : 'Customer Profile'}</h2>
                        <p className="text-[10px] text-slate-400 font-mono mt-1 font-bold tracking-widest uppercase">ID: {form.customerID}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <button onClick={() => setConfigModalOpen(true)} className="text-[10px] border border-[#ab8a3b] text-[#ab8a3b] px-3 py-1.5 rounded-lg hover:bg-[#ab8a3b] hover:text-[#111f42] transition-all font-bold uppercase flex items-center gap-1.5">
                        <Settings size={12} /> Config Cat
                      </button>
                      <button onClick={() => setModalOpen(false)} className="hover:bg-white/10 p-1.5 rounded-lg transition-colors text-slate-400 hover:text-white"><X size={24} /></button>
                    </div>
                  </div>
                  
                  <div className="flex-1 flex flex-col overflow-hidden bg-[#F9F7F6]">
                    <div className="px-5 py-2.5 bg-white border-b border-slate-100 flex items-center gap-4 shrink-0">
                      <div className="relative w-full max-w-xs group">
                        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-[#ab8a3b] pointer-events-none group-focus-within:text-[#111f42] transition-colors">
                          <Settings2 size={14} />
                        </div>
                        <select 
                          value={activeFormTab} 
                          onChange={(e) => setActiveFormTab(e.target.value)}
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-10 py-2.5 outline-none focus:border-[#ab8a3b] text-[#111f42] font-black text-[10px] uppercase tracking-widest shadow-sm cursor-pointer appearance-none transition-all hover:border-[#ab8a3b]/50"
                        >
                          <option value="general">GENERAL INFORMATION</option>
                          <option value="address">ADDRESSES & LOCATION</option>
                          <option value="financial">FINANCIAL & CREDIT</option>
                          <option value="contact">CONTACT PERSON</option>
                        </select>
                        <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                          <ChevronDown size={14} />
                        </div>
                      </div>
                      <div className="h-6 w-px bg-slate-200 hidden md:block"></div>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest hidden md:block italic">
                        {activeFormTab === 'general' ? 'Basic customer identity and categorization' : 
                         activeFormTab === 'address' ? 'Billing and shipping logistics' :
                         activeFormTab === 'financial' ? 'Credit terms and account status' : 
                         'Primary contact person details'}
                      </p>
                    </div>

                    <div className="flex-1 overflow-y-auto p-5 custom-scrollbar">
                      <div className="space-y-4 max-w-3xl">
                        {activeFormTab === 'general' && (
                          <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-sm grid grid-cols-2 gap-6 animate-in fade-in duration-300">
                            <div className="col-span-2 border-b border-slate-100 pb-2 mb-2">
                              <h4 className="text-[12px] font-black text-[#111f42] uppercase tracking-widest">GENERAL INFORMATION</h4>
                            </div>
                            <div className="space-y-1.5 col-span-2">
                              <div className="flex justify-between items-center">
                                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Customer ID</label>
                                {modalMode === 'create' && (
                                  <button onClick={() => setIdConfigModalOpen(true)} className="text-[9px] font-bold text-[#ab8a3b] flex items-center gap-1 hover:underline"><Settings2 size={10} /> Config ID</button>
                                )}
                              </div>
                              <input disabled value={form.customerID || ''} className="w-full px-3 py-2.5 border border-slate-200 rounded-lg outline-none font-bold bg-slate-50 text-slate-500 text-[13px] font-mono" placeholder="Auto Generated..." />
                            </div>
                            <div className="col-span-2 space-y-1.5">
                              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Customer Name</label>
                              <input disabled={modalMode === 'view'} value={form.customerName || ''} onChange={e => setForm({ ...form, customerName: e.target.value })} className="w-full px-3 py-2.5 border border-slate-200 rounded-lg focus:border-[#ab8a3b] outline-none font-bold bg-white disabled:bg-slate-50/50 disabled:text-slate-500 text-[13px]" placeholder="ชื่อลูกค้า / บริษัท..." />
                            </div>
                            <div className="space-y-1.5">
                              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Category (กลุ่มลูกค้า)</label>
                              <select disabled={modalMode === 'view'} value={form.category || 'Retail'} onChange={e => {
                                const newCat = e.target.value;
                                setForm({ ...form, category: newCat, subCategory: masterConfig.subCategories[newCat]?.[0] || '' });
                              }} className="w-full px-3 py-2.5 border border-slate-200 rounded-lg outline-none focus:border-[#ab8a3b] bg-white cursor-pointer font-bold text-[13px] disabled:bg-slate-50/50 disabled:text-slate-500">
                                {masterConfig.categories?.map((c: string) => <option key={c} value={c}>{c}</option>)}
                              </select>
                            </div>
                            <div className="space-y-1.5">
                              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Sub Category (ประเภทย่อย)</label>
                              <select disabled={modalMode === 'view'} value={form.subCategory || ''} onChange={e => setForm({ ...form, subCategory: e.target.value })} className="w-full px-3 py-2.5 border border-slate-200 rounded-lg outline-none focus:border-[#ab8a3b] bg-white cursor-pointer font-bold text-[13px] disabled:bg-slate-50/50 disabled:text-slate-500">
                                {masterConfig.subCategories[form.category || 'Retail']?.map((sc: string) => <option key={sc} value={sc}>{sc}</option>)}
                              </select>
                            </div>
                            <div className="space-y-1.5 col-span-2">
                              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Tax ID / เลขผู้เสียภาษี</label>
                              <input disabled={modalMode === 'view'} value={form.taxID || ''} onChange={e => setForm({ ...form, taxID: e.target.value })} className="w-full px-3 py-2.5 border border-slate-200 rounded-lg bg-white focus:border-[#ab8a3b] outline-none text-[13px] font-mono disabled:bg-slate-50/50 disabled:text-slate-500" placeholder="0000000000000" />
                            </div>
                          </div>
                        )}

                        {activeFormTab === 'financial' && (
                          <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-sm grid grid-cols-2 gap-6 animate-in fade-in duration-300">
                            <div className="col-span-2 border-b border-slate-100 pb-2 mb-2">
                              <h4 className="text-[12px] font-black text-[#111f42] uppercase tracking-widest">FINANCIAL DETAILS</h4>
                            </div>
                            <div className="space-y-1.5">
                              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Credit Term (Days)</label>
                              <input type="number" disabled={modalMode === 'view'} value={form.creditTerm || 0} onChange={e => setForm({ ...form, creditTerm: e.target.value })} className="w-full px-3 py-2.5 border border-slate-200 rounded-lg bg-white focus:border-[#ab8a3b] outline-none text-[13px] font-mono font-bold disabled:bg-slate-50/50 disabled:text-slate-500" />
                            </div>
                            <div className="space-y-1.5">
                              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Status</label>
                              <select disabled={modalMode === 'view'} value={form.status || 'Prospect'} onChange={e => setForm({ ...form, status: e.target.value })} className="w-full px-3 py-2.5 border border-slate-200 rounded-lg bg-white cursor-pointer focus:border-[#ab8a3b] outline-none text-[13px] font-bold disabled:bg-slate-50/50 disabled:text-slate-500">
                                <option>Prospect</option><option>Active</option><option>On-Hold</option><option>Blacklisted</option>
                              </select>
                            </div>
                          </div>
                        )}

                        {activeFormTab === 'address' && (
                          <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-sm grid grid-cols-1 md:grid-cols-2 gap-6 animate-in fade-in duration-300">
                            <div className="col-span-2 border-b border-slate-100 pb-2 mb-2">
                              <h4 className="text-[12px] font-black text-[#111f42] uppercase tracking-widest">CUSTOMER ADDRESSES</h4>
                            </div>
                            <div className="space-y-1.5 col-span-2 md:col-span-1">
                              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1"><FileText size={12} /> Billing Address (ที่อยู่ออกบิล)</label>
                              <textarea disabled={modalMode === 'view'} rows={4} value={form.billingAddress || ''} onChange={e => setForm({ ...form, billingAddress: e.target.value })} className="w-full px-3 py-2.5 border border-slate-200 rounded-lg focus:border-[#ab8a3b] outline-none text-[13px] resize-none bg-white disabled:bg-slate-50/50 disabled:text-slate-500" placeholder="ที่อยู่ออกใบกำกับภาษี..." />
                            </div>
                            <div className="space-y-1.5 col-span-2 md:col-span-1">
                              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1"><MapPin size={12} /> Shipping Address (ที่อยู่ส่งของ)</label>
                              <textarea disabled={modalMode === 'view'} rows={4} value={form.shippingAddress || ''} onChange={e => setForm({ ...form, shippingAddress: e.target.value })} className="w-full px-3 py-2.5 border border-slate-200 rounded-lg focus:border-[#ab8a3b] outline-none text-[13px] resize-none bg-white disabled:bg-slate-50/50 disabled:text-slate-500" placeholder="ที่อยู่สำหรับจัดส่งสินค้า..." />
                              <div className="flex justify-end mt-1">
                                <button disabled={modalMode === 'view'} onClick={() => setForm({ ...form, shippingAddress: form.billingAddress })} className="text-[9px] text-[#ab8a3b] font-bold hover:underline">Copy from Billing Address</button>
                              </div>
                            </div>
                          </div>
                        )}

                        {activeFormTab === 'contact' && (
                          <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-sm grid grid-cols-1 md:grid-cols-2 gap-6 animate-in fade-in duration-300">
                            <div className="col-span-2 border-b border-slate-100 pb-2 mb-2">
                              <h4 className="text-[12px] font-black text-[#111f42] uppercase tracking-widest">CONTACT PERSON</h4>
                            </div>
                            <div className="space-y-1.5 col-span-2">
                              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1"><User size={12} /> Name</label>
                              <input disabled={modalMode === 'view'} value={form.contactName || ''} onChange={e => setForm({ ...form, contactName: e.target.value })} className="w-full px-3 py-2.5 border border-slate-200 rounded-lg focus:border-[#ab8a3b] outline-none text-[13px] font-bold bg-white disabled:bg-slate-50/50 disabled:text-slate-500" placeholder="ชื่อผู้ติดต่อ..." />
                            </div>
                            <div className="space-y-1.5">
                              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1"><Phone size={12} /> Phone Number</label>
                              <input disabled={modalMode === 'view'} value={form.phone || ''} onChange={e => setForm({ ...form, phone: e.target.value })} className="w-full px-3 py-2.5 border border-slate-200 rounded-lg focus:border-[#ab8a3b] outline-none text-[13px] font-mono bg-white disabled:bg-slate-50/50 disabled:text-slate-500" placeholder="เบอร์โทร..." />
                            </div>
                            <div className="space-y-1.5">
                              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1"><Mail size={12} /> Email</label>
                              <input type="email" disabled={modalMode === 'view'} value={form.email || ''} onChange={e => setForm({ ...form, email: e.target.value })} className="w-full px-3 py-2.5 border border-slate-200 rounded-lg focus:border-[#ab8a3b] outline-none text-[13px] bg-white disabled:bg-slate-50/50 disabled:text-slate-500" placeholder="อีเมล..." />
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="p-4 sm:p-5 bg-slate-50 border-t border-slate-200 flex justify-between items-center px-5 rounded-b-2xl">
                    <button onClick={() => setModalOpen(false)} className="text-[11px] font-black uppercase tracking-widest text-slate-400 hover:text-[#111f42] transition-colors font-mono">Close</button>
                    <div className="flex gap-2">
                      {modalMode === 'view' ? (
                        <button onClick={() => setModalMode('edit')} className="bg-[#ab8a3b] text-white px-5 py-3 rounded-xl font-black shadow-md uppercase tracking-widest flex items-center gap-2 hover:bg-[#8f712c] transition-all font-mono text-[11px]"><Pencil size={14} /> Edit Profile</button>
                      ) : (
                        <button onClick={handleSave} className="bg-[#111f42] text-[#ab8a3b] px-6 py-3 rounded-xl font-black shadow-lg shadow-[#111f42]/20 uppercase tracking-widest flex items-center gap-2 hover:brightness-110 transition-all font-mono text-[11px]"><Save size={16} /> Save Changes</button>
                      )}
                    </div>
                  </div>
                </div>
              </DraggableWrapper>

    </div>
  );
};

export default CustomerActionModal;

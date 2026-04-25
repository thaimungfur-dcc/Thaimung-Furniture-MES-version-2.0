import React from 'react';
import { X, FileSignature, Info, List, History, User, Building2, PlusCircle, Trash2, Save, Pencil, Clock } from 'lucide-react';
import { DraggableWrapper } from "../../../components/shared/DraggableWrapper";

interface PrActionModalProps {
  modalOpen: boolean;
  setModalOpen: (open: boolean) => void;
  modalMode: string;
  setModalMode: (mode: string) => void;
  activeFormTab: string;
  setActiveFormTab: (tab: string) => void;
  formData: any;
  setFormData: (data: any) => void;
  handleAddItem: () => void;
  handleRemoveItem: (index: number) => void;
  handleItemChange: (index: number, field: string, value: any) => void;
  handleSave: () => void;
  formatCurrency: (amount: number) => string;
}

const PrActionModal: React.FC<PrActionModalProps> = ({
  modalOpen,
  setModalOpen,
  modalMode,
  setModalMode,
  activeFormTab,
  setActiveFormTab,
  formData,
  setFormData,
  handleAddItem,
  handleRemoveItem,
  handleItemChange,
  handleSave,
  formatCurrency
}) => {
  if (!modalOpen) return null;

  return (
    <div className="fixed inset-0 bg-[#111f42]/40 backdrop-blur-sm z-[100] flex items-center justify-center p-4 no-print animate-in fade-in duration-200">
      
          <DraggableWrapper>
                <div className="bg-white rounded-2xl w-full max-w-5xl shadow-2xl overflow-hidden flex flex-col max-h-[95vh]">
                  <div className="px-6 py-2.5 flex justify-between items-center bg-[#111f42] text-white shrink-0 border-b-4 border-[#E3624A]">
                    <div className="flex items-center gap-3">
                      <FileSignature size={22} className="text-[#E3624A]" />
                      <div>
                        <h2 className="text-lg font-semibold uppercase tracking-widest">{modalMode==='create' ? 'Create Purchase Requisition' : `PR Details: ${formData.id}`}</h2>
                        <p className="text-[10px] text-slate-300 font-mono mt-0.5">Fill in PR details, items, and view history.</p>
                      </div>
                    </div>
                    <button onClick={()=>setModalOpen(false)} className="hover:bg-white/20 p-2 rounded-full transition-colors"><X size={24}/></button>
                  </div>
                  
                  <div className="flex-1 flex flex-col md:flex-row overflow-hidden bg-slate-50/50">
                    <div className="w-full md:w-56 bg-white border-r border-slate-100 p-2 md:p-4 flex flex-row md:flex-col gap-2 overflow-x-auto shrink-0 border-b md:border-b-0">
                      {[
                        { id: 'general', label: '1. General Info', icon: Info },
                        { id: 'items', label: '2. Line Items', icon: List },
                        { id: 'history', label: '3. History Log', icon: History }
                      ]?.map(tab => (
                        <button 
                          key={tab.id} 
                          onClick={()=>setActiveFormTab(tab.id)} 
                          className={`flex-shrink-0 w-full md:w-auto flex items-center gap-3 px-4 py-3 rounded-xl transition-all text-left uppercase text-[10px] font-black tracking-widest ${activeFormTab === tab.id ? 'bg-[#111f42] text-white shadow-lg' : 'text-slate-400 hover:bg-slate-50'}`}
                        >
                          <tab.icon size={16}/> {tab.label}
                        </button>
                      ))}
                    </div>

                    <div className="flex-1 overflow-y-auto p-4 md:p-5 custom-scrollbar">
                      {activeFormTab === 'general' && (
                        <div className="animate-in fade-in duration-300">
                          <h3 className="text-[11px] font-black text-[#111f42] uppercase tracking-widest border-b border-slate-200 pb-2 mb-4 flex items-center gap-2">
                            <Info size={14} className="text-[#E3624A]"/> General Information
                          </h3>
                          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm grid grid-cols-1 md:grid-cols-2 gap-5">
                            <div className="space-y-1.5">
                              <label className="text-[10px] font-bold text-slate-400 uppercase">PR Number</label>
                              <input disabled value={formData.id} className="w-full px-3 py-2 border border-slate-200 rounded-lg bg-slate-50 font-mono font-bold text-[12px] text-slate-500" />
                            </div>
                            <div className="space-y-1.5">
                              <label className="text-[10px] font-bold text-slate-400 uppercase">Date</label>
                              <input type="date" disabled={modalMode==='view'} value={formData.date} onChange={e=>setFormData({...formData, date: e.target.value})} className="w-full px-3 py-2 border border-slate-200 rounded-lg outline-none focus:border-[#111f42] text-[12px] font-mono" />
                            </div>
                            <div className="space-y-1.5 md:col-span-2">
                              <label className="text-[10px] font-bold text-slate-400 uppercase">Status</label>
                              <select disabled={modalMode==='view'} value={formData.status} onChange={e=>setFormData({...formData, status: e.target.value})} className="w-full px-3 py-2 border border-slate-200 rounded-lg outline-none focus:border-[#111f42] text-[12px] font-bold cursor-pointer">
                                <option value="Pending Verify">Pending Verify</option>
                                <option value="Revise">Revise</option>
                                <option value="Pending Approve">Pending Approve</option>
                                <option value="Approved">Approved</option>
                                <option value="Rejected">Rejected</option>
                              </select>
                            </div>
                            <div className="space-y-1.5">
                              <label className="text-[10px] font-bold text-slate-400 uppercase">Requester Name</label>
                              <div className="relative">
                                <User size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"/>
                                <input disabled={modalMode==='view'} value={formData.requester} onChange={e=>setFormData({...formData, requester: e.target.value})} className="w-full pl-9 pr-3 py-2 border border-slate-200 rounded-lg outline-none focus:border-[#111f42] text-[12px]" placeholder="ชื่อผู้ขอซื้อ..." />
                              </div>
                            </div>
                            <div className="space-y-1.5">
                              <label className="text-[10px] font-bold text-slate-400 uppercase">Department</label>
                              <div className="relative">
                                <Building2 size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"/>
                                <input disabled={modalMode==='view'} value={formData.department} onChange={e=>setFormData({...formData, department: e.target.value})} className="w-full pl-9 pr-3 py-2 border border-slate-200 rounded-lg outline-none focus:border-[#111f42] text-[12px]" placeholder="แผนก..." />
                              </div>
                            </div>
                            <div className="space-y-1.5 md:col-span-2">
                              <label className="text-[10px] font-bold text-slate-400 uppercase">Objective / Remarks (วัตถุประสงค์)</label>
                              <textarea disabled={modalMode==='view'} rows={3} value={formData.objective} onChange={e=>setFormData({...formData, objective: e.target.value})} className="w-full px-3 py-2 border border-slate-200 rounded-lg outline-none focus:border-[#111f42] text-[12px] resize-none" placeholder="ระบุเหตุผลหรือวัตถุประสงค์ในการขอซื้อ..." />
                            </div>
                          </div>
                        </div>
                      )}

                      {activeFormTab === 'items' && (
                        <div className="animate-in fade-in duration-300 flex flex-col h-full">
                          <div className="flex justify-between items-end border-b border-slate-200 pb-2 mb-4 shrink-0">
                            <h3 className="text-[11px] font-black text-[#111f42] uppercase tracking-widest flex items-center gap-2">
                              <List size={14} className="text-[#E3624A]"/> Line Items List
                            </h3>
                            {modalMode !== 'view' && (
                              <button onClick={handleAddItem} className="flex items-center gap-1.5 px-3 py-1.5 bg-[#111f42] text-white rounded-lg text-[10px] font-bold uppercase hover:bg-[#1a2d5c] transition-colors shadow-sm">
                                <PlusCircle size={14}/> Add Row
                              </button>
                            )}
                          </div>
                          
                          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm flex flex-col overflow-hidden">
                            <div className="overflow-x-auto max-h-[350px] custom-scrollbar">
                              <table className="w-full text-left data-table relative">
                                <thead className="bg-slate-100 text-slate-600 border-b border-slate-200 sticky top-0 z-10 shadow-sm">
                                  <tr>
                                    <th className="px-3 py-2.5 font-bold uppercase text-center w-12">No.</th>
                                    <th className="px-3 py-2.5 font-bold uppercase min-w-[200px]">Description (รายการสินค้า)</th>
                                    <th className="px-3 py-2.5 font-bold uppercase text-center w-24">Qty</th>
                                    <th className="px-3 py-2.5 font-bold uppercase text-center w-24">Unit</th>
                                    <th className="px-3 py-2.5 font-bold uppercase text-right w-32">Est. Unit Price</th>
                                    <th className="px-3 py-2.5 font-bold uppercase text-right w-32 text-[#111f42]">Total Price</th>
                                    <th className="px-3 py-2.5 font-bold uppercase w-48">Note/Brand</th>
                                    {modalMode !== 'view' && <th className="px-3 py-2.5 font-bold uppercase text-center w-16">Act</th>}
                                  </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100">
                                  {formData.items?.map((item: any, index: number) => (
                                    <tr key={item.id} className="hover:bg-slate-50 transition-colors">
                                      <td className="px-3 py-1.5 text-center text-slate-400 font-medium">{index + 1}</td>
                                      <td className="px-3 py-1.5">
                                        <input 
                                          disabled={modalMode==='view'} value={item.description} 
                                          onChange={e => handleItemChange(index, 'description', e.target.value)}
                                          className="w-full px-2 py-1.5 border border-slate-200 rounded focus:border-[#111f42] outline-none text-[12px] disabled:bg-transparent disabled:border-transparent" 
                                          placeholder="ชื่อสินค้า/รายละเอียด..." 
                                        />
                                      </td>
                                      <td className="px-3 py-1.5">
                                        <input 
                                          type="number" min="1" disabled={modalMode==='view'} value={item.qty} 
                                          onChange={e => handleItemChange(index, 'qty', e.target.value)}
                                          className="w-full px-2 py-1.5 border border-slate-200 rounded text-center focus:border-[#111f42] outline-none text-[12px] font-mono disabled:bg-transparent disabled:border-transparent" 
                                          placeholder="0" 
                                        />
                                      </td>
                                      <td className="px-3 py-1.5">
                                        <input 
                                          disabled={modalMode==='view'} value={item.unit} 
                                          onChange={e => handleItemChange(index, 'unit', e.target.value)}
                                          className="w-full px-2 py-1.5 border border-slate-200 rounded text-center focus:border-[#111f42] outline-none text-[12px] disabled:bg-transparent disabled:border-transparent" 
                                          placeholder="pcs/box" 
                                        />
                                      </td>
                                      <td className="px-3 py-1.5">
                                        <input 
                                          type="number" min="0" disabled={modalMode==='view'} value={item.unitPrice} 
                                          onChange={e => handleItemChange(index, 'unitPrice', e.target.value)}
                                          className="w-full px-2 py-1.5 border border-slate-200 rounded text-right focus:border-[#111f42] outline-none text-[12px] font-mono disabled:bg-transparent disabled:border-transparent" 
                                          placeholder="0.00" 
                                        />
                                      </td>
                                      <td className="px-3 py-1.5 text-right font-mono font-bold text-[#E3624A] bg-orange-50/30">
                                         {formatCurrency(item.total)}
                                      </td>
                                      <td className="px-3 py-1.5">
                                        <input 
                                          disabled={modalMode==='view'} value={item.note} 
                                          onChange={e => handleItemChange(index, 'note', e.target.value)}
                                          className="w-full px-2 py-1.5 border border-slate-200 rounded focus:border-[#111f42] outline-none text-[12px] italic text-slate-500 disabled:bg-transparent disabled:border-transparent" 
                                          placeholder="หมายเหตุ..." 
                                        />
                                      </td>
                                      {modalMode !== 'view' && (
                                        <td className="px-3 py-1.5 text-center">
                                          <button 
                                            onClick={() => handleRemoveItem(index)}
                                            disabled={formData.items.length === 1}
                                            className="p-1.5 text-slate-400 hover:text-rose-500 hover:bg-rose-50 rounded transition-colors disabled:opacity-30"
                                            title="Remove Item"
                                          >
                                             <Trash2 size={14}/>
                                          </button>
                                        </td>
                                      )}
                                    </tr>
                                  ))}
                                </tbody>
                              </table>
                            </div>
                            
                            <div className="bg-slate-50 border-t border-slate-200 p-4 flex justify-end items-center gap-6 shrink-0">
                              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-widest">Est. Grand Total Amount:</span>
                              <div className="flex items-center gap-1 text-[#E3624A]">
                                <span className="text-sm font-bold">฿</span>
                                <span className="text-2xl font-black font-mono tracking-tight">{formatCurrency(formData.totalAmount).replace('฿','')}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}

                      {activeFormTab === 'history' && (
                        <div className="animate-in fade-in duration-300">
                          <h3 className="text-[11px] font-black text-[#111f42] uppercase tracking-widest border-b border-slate-200 pb-2 mb-6 flex items-center gap-2">
                            <History size={14} className="text-[#E3624A]"/> Document History Log
                          </h3>
                          
                          <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-sm">
                            <div className="space-y-4">
                              {formData.history && formData.history.length > 0 ? (
                                formData.history?.map((h: any, i: number) => (
                                  <div key={i} className="flex gap-4">
                                    <div className="flex flex-col items-center">
                                      <div className="w-8 h-8 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-500 shadow-sm z-10">
                                        <Clock size={14} />
                                      </div>
                                      {i !== formData.history.length - 1 && <div className="w-px h-full bg-slate-200 my-1"></div>}
                                    </div>
                                    <div className="pb-4 pt-1">
                                      <p className="text-[10px] text-slate-400 font-mono tracking-wider">{h.date}</p>
                                      <p className="text-[12px] font-bold text-[#111f42] mt-0.5">{h.action}</p>
                                      <p className="text-[11px] text-slate-500 mt-0.5 flex items-center gap-1"><User size={10}/> By {h.user}</p>
                                      {h.note && (
                                        <div className="mt-2 bg-slate-50 p-3 rounded-lg border border-slate-100">
                                          <p className="text-[11px] text-slate-600 italic">"{h.note}"</p>
                                        </div>
                                      )}
                                    </div>
                                  </div>
                                ))
                              ) : (
                                <div className="text-center py-10 text-slate-400">
                                  <History size={32} className="mx-auto mb-3 opacity-20"/>
                                  <p className="text-[11px] font-bold uppercase tracking-widest">No history recorded yet.</p>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="p-5 bg-slate-50 border-t border-slate-200 flex justify-between items-center shrink-0 px-5">
                    <button onClick={()=>setModalOpen(false)} className="px-6 py-2.5 rounded-lg border font-bold text-[12px] uppercase text-slate-500 bg-white hover:bg-slate-100 transition-all">Close</button>
                    {modalMode === 'view' ? (
                      <button onClick={()=>setModalMode('edit')} className="px-5 py-2.5 text-white rounded-lg font-bold shadow-md uppercase tracking-widest flex items-center gap-2 hover:opacity-90 transition-all bg-amber-500 text-[12px]">
                        <Pencil size={14}/> Edit PR
                      </button>
                    ) : (
                      <button onClick={handleSave} className="px-6 py-2.5 text-white rounded-lg font-bold shadow-md uppercase tracking-widest flex items-center gap-2 hover:opacity-90 transition-all bg-[#111f42] text-[12px]">
                        <Save size={14}/> Save PR
                      </button>
                    )}
                  </div>
                </div>
              </DraggableWrapper>

    </div>
  );
};

export default PrActionModal;

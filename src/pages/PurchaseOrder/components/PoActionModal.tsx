import React from 'react';
import { X, FileSignature, Info, List, History, User, Building2, CreditCard, MapPin, PlusCircle, Trash2, Save, Pencil, Stamp, Clock } from 'lucide-react';
import { DraggableWrapper } from "../../../components/shared/DraggableWrapper";

interface PoActionModalProps {
  modalOpen: boolean;
  setModalOpen: (open: boolean) => void;
  modalMode: string;
  setModalMode: (mode: string) => void;
  poForm: any;
  setPoForm: (form: any) => void;
  handleAddItem: () => void;
  handleRemoveItem: (index: number) => void;
  handleItemChange: (index: number, field: string, value: any) => void;
  handleSavePO: () => void;
  updatePOStatus: (status: string) => void;
  formatCurrency: (amount: number) => string;
}

const PoActionModal: React.FC<PoActionModalProps> = ({
  modalOpen,
  setModalOpen,
  modalMode,
  setModalMode,
  poForm,
  setPoForm,
  handleAddItem,
  handleRemoveItem,
  handleItemChange,
  handleSavePO,
  updatePOStatus,
  formatCurrency
}) => {
  if (!modalOpen) return null;

  return (
    <div className="fixed inset-0 bg-[#111f42]/40 backdrop-blur-sm z-[100] flex items-center justify-center p-4 no-print animate-in fade-in duration-200">
      
          <DraggableWrapper>
                <div className="bg-white rounded-2xl w-full max-w-4xl shadow-2xl overflow-hidden flex flex-col max-h-[95vh]">
                  <div className="px-6 py-2.5 flex justify-between items-center bg-[#111f42] text-white shrink-0 border-b-4 border-[#E3624A]">
                    <div className="flex items-center gap-3">
                      <FileSignature size={22} className="text-[#E3624A]" />
                      <div>
                        <h2 className="text-lg font-semibold uppercase tracking-widest">{modalMode==='create' ? 'Create Purchase Order' : modalMode === 'generate' ? 'Generate PO from PR' : `PO Details: ${poForm.poNumber}`}</h2>
                        <p className="text-[10px] text-slate-300 font-mono mt-0.5">Fill in vendor info and order items.</p>
                      </div>
                    </div>
                    <button onClick={()=>setModalOpen(false)} className="hover:bg-white/20 p-2 rounded-full transition-colors"><X size={24}/></button>
                  </div>
                  
                  <div className="flex-1 overflow-y-auto p-4 sm:p-5 md:p-5 custom-scrollbar bg-slate-50/30 space-y-4">
                    <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
                      <h3 className="text-[11px] font-black text-[#111f42] uppercase tracking-widest border-b border-slate-200 pb-2 mb-4 flex items-center gap-2">
                        <Info size={14} className="text-[#E3624A]"/> 1. Vendor & Delivery Info
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <div className="space-y-1.5">
                          <label className="text-[10px] font-bold text-slate-400 uppercase">PO Number</label>
                          <input disabled value={poForm.poNumber} className="w-full px-3 py-2 border border-slate-200 rounded-lg bg-slate-50 font-mono font-bold text-[12px] text-slate-500" />
                        </div>
                        <div className="space-y-1.5">
                          <label className="text-[10px] font-bold text-slate-400 uppercase">Date</label>
                          <input type="date" disabled={modalMode==='view'} value={poForm.date} onChange={e=>setPoForm({...poForm, date: e.target.value})} className="w-full px-3 py-2 border border-slate-200 rounded-lg outline-none focus:border-[#111f42] text-[12px] font-mono" />
                        </div>
                        <div className="space-y-1.5">
                          <label className="text-[10px] font-bold text-slate-400 uppercase">Status</label>
                          <select disabled={modalMode==='view' || modalMode==='approve'} value={poForm.status} onChange={e=>setPoForm({...poForm, status: e.target.value})} className="w-full px-3 py-2 border border-slate-200 rounded-lg outline-none focus:border-[#111f42] text-[12px] font-bold cursor-pointer">
                            <option value="Pending Approve">Pending Approve</option>
                            <option value="Approved">Approved</option>
                            <option value="Sent">Sent (รอรับสินค้า)</option>
                            <option value="Completed">Completed</option>
                          </select>
                        </div>
                        <div className="space-y-1.5">
                          <label className="text-[10px] font-bold text-slate-400 uppercase">PR Reference</label>
                          <input disabled value={poForm.prRef} className="w-full px-3 py-2 border border-slate-200 rounded-lg bg-slate-50 outline-none text-[12px]" placeholder="PR Ref..." />
                        </div>

                        <div className="col-span-1 md:col-span-2 border-t border-slate-100 my-1"></div>

                        <div className="space-y-1.5">
                          <label className="text-[10px] font-bold text-slate-400 uppercase">Vendor Name</label>
                          <div className="relative">
                            <Building2 size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"/>
                            <input disabled={modalMode==='view'} value={poForm.vendor} onChange={e=>setPoForm({...poForm, vendor: e.target.value})} className="w-full pl-9 pr-3 py-2 border border-slate-200 rounded-lg outline-none focus:border-[#111f42] text-[12px] font-bold" placeholder="ระบุชื่อผู้ขาย..." />
                          </div>
                        </div>
                        <div className="space-y-1.5">
                          <label className="text-[10px] font-bold text-slate-400 uppercase">Payment Term</label>
                          <div className="relative">
                            <CreditCard size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"/>
                            <select disabled={modalMode==='view'} value={poForm.paymentTerm} onChange={e=>setPoForm({...poForm, paymentTerm: e.target.value})} className="w-full pl-9 pr-3 py-2 border border-slate-200 rounded-lg outline-none focus:border-[#111f42] text-[12px]">
                              <option>Credit 30 Days</option>
                              <option>Credit 45 Days</option>
                              <option>Credit 60 Days</option>
                              <option>Cash / COD</option>
                            </select>
                          </div>
                        </div>
                        <div className="space-y-1.5 col-span-1 md:col-span-2">
                          <label className="text-[10px] font-bold text-slate-400 uppercase">Vendor Address</label>
                          <div className="relative">
                            <MapPin size={14} className="absolute left-3 top-3 text-slate-400"/>
                            <textarea disabled={modalMode==='view'} rows={2} value={poForm.vendorAddress} onChange={e=>setPoForm({...poForm, vendorAddress: e.target.value})} className="w-full pl-9 pr-3 py-2 border border-slate-200 rounded-lg outline-none focus:border-[#111f42] text-[12px] resize-none" placeholder="ที่อยู่ผู้จำหน่าย..." />
                          </div>
                        </div>
                        
                        <div className="col-span-1 md:col-span-2 border-t border-slate-100 my-1"></div>

                        <div className="space-y-1.5">
                          <label className="text-[10px] font-bold text-slate-400 uppercase">Delivery Date</label>
                          <input type="date" disabled={modalMode==='view'} value={poForm.deliveryDate} onChange={e=>setPoForm({...poForm, deliveryDate: e.target.value})} className="w-full px-3 py-2 border border-slate-200 rounded-lg outline-none focus:border-[#111f42] text-[12px] font-mono text-[#b22026]" />
                        </div>
                        <div className="space-y-1.5">
                          <label className="text-[10px] font-bold text-slate-400 uppercase">Remarks</label>
                          <input disabled={modalMode==='view'} value={poForm.remarks} onChange={e=>setPoForm({...poForm, remarks: e.target.value})} className="w-full px-3 py-2 border border-slate-200 rounded-lg outline-none focus:border-[#111f42] text-[12px]" placeholder="ระบุหมายเหตุเพิ่มเติม (ถ้ามี)" />
                        </div>
                      </div>
                    </div>

                    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm flex flex-col overflow-hidden">
                      <div className="p-4 border-b border-slate-200 flex justify-between items-center bg-slate-50/50">
                        <h3 className="text-[11px] font-black text-[#111f42] uppercase tracking-widest flex items-center gap-2">
                          <List size={14} className="text-[#E3624A]"/> 2. Order Items
                        </h3>
                        {modalMode !== 'view' && modalMode !== 'approve' && (
                          <button onClick={handleAddItem} className="flex items-center gap-1.5 px-3 py-1.5 bg-[#111f42] text-white rounded-lg text-[10px] font-bold uppercase hover:bg-[#1a2d5c] transition-colors shadow-sm">
                            <PlusCircle size={14}/> Add Row
                          </button>
                        )}
                      </div>
                      
                      <div className="overflow-x-auto max-h-[350px] custom-scrollbar">
                        <table className="w-full text-left data-table relative">
                          <thead className="bg-slate-100 text-slate-600 border-b border-slate-200 sticky top-0 z-10 shadow-sm">
                            <tr>
                              <th className="px-3 py-2.5 font-bold uppercase text-center w-12">No.</th>
                              <th className="px-3 py-2.5 font-bold uppercase w-24">Item Code</th>
                              <th className="px-3 py-2.5 font-bold uppercase min-w-[200px]">Description</th>
                              <th className="px-3 py-2.5 font-bold uppercase text-center w-24">Qty</th>
                              <th className="px-3 py-2.5 font-bold uppercase text-right w-32">Unit Price</th>
                              <th className="px-3 py-2.5 font-bold uppercase text-right w-32 text-[#111f42]">Total</th>
                              {modalMode !== 'view' && modalMode !== 'approve' && <th className="px-3 py-2.5 font-bold uppercase text-center w-16">Act</th>}
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-100">
                            {poForm.items?.map((item: any, index: number) => (
                              <tr key={index} className="hover:bg-slate-50 transition-colors">
                                <td className="px-3 py-2 text-center text-slate-400 font-medium">{index + 1}</td>
                                <td className="px-3 py-2">
                                  <input 
                                    disabled={modalMode==='view' || modalMode==='approve'} value={item.code || ''} 
                                    onChange={e => handleItemChange(index, 'code', e.target.value)}
                                    className="w-full px-2 py-1.5 border border-slate-200 rounded focus:border-[#111f42] outline-none text-[12px] disabled:bg-transparent disabled:border-transparent font-bold" 
                                    placeholder="Code..." 
                                  />
                                </td>
                                <td className="px-3 py-2">
                                  <input 
                                    disabled={modalMode==='view' || modalMode==='approve'} value={item.name || ''} 
                                    onChange={e => handleItemChange(index, 'name', e.target.value)}
                                    className="w-full px-2 py-1.5 border border-slate-200 rounded focus:border-[#111f42] outline-none text-[12px] disabled:bg-transparent disabled:border-transparent" 
                                    placeholder="ชื่อสินค้า/รายละเอียด..." 
                                  />
                                </td>
                                <td className="px-3 py-2">
                                  <input 
                                    type="number" min="1" disabled={modalMode==='view' || modalMode==='approve'} value={item.qty || ''} 
                                    onChange={e => handleItemChange(index, 'qty', e.target.value)}
                                    className="w-full px-2 py-1.5 border border-slate-200 rounded text-center focus:border-[#111f42] outline-none text-[12px] font-mono disabled:bg-transparent disabled:border-transparent" 
                                    placeholder="0" 
                                  />
                                </td>
                                <td className="px-3 py-2">
                                  <input 
                                    type="number" min="0" disabled={modalMode==='view' || modalMode==='approve'} value={item.price || ''} 
                                    onChange={e => handleItemChange(index, 'price', e.target.value)}
                                    className="w-full px-2 py-1.5 border border-slate-200 rounded text-right focus:border-[#111f42] outline-none text-[12px] font-mono disabled:bg-transparent disabled:border-transparent" 
                                    placeholder="0.00" 
                                  />
                                </td>
                                <td className="px-3 py-2 text-right font-mono font-bold text-[#E3624A] bg-orange-50/30">
                                   {formatCurrency((item.qty || 0) * (item.price || 0))}
                                </td>
                                {modalMode !== 'view' && modalMode !== 'approve' && (
                                  <td className="px-3 py-2 text-center">
                                    <button 
                                      onClick={() => handleRemoveItem(index)}
                                      disabled={poForm.items.length === 1}
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
                      
                      <div className="bg-slate-50 border-t border-slate-200 p-4 flex flex-col items-end gap-1 text-[11px] shrink-0">
                        <div className="flex justify-between w-48 text-slate-500 font-bold">
                          <span>Sub Total:</span>
                          <span className="font-mono">{formatCurrency(poForm.subTotal)}</span>
                        </div>
                        <div className="flex justify-between w-48 text-slate-500 font-bold mb-2">
                          <span>VAT (7%):</span>
                          <span className="font-mono">{formatCurrency(poForm.vat)}</span>
                        </div>
                        <div className="flex justify-between w-64 items-center pt-2 border-t border-slate-200">
                          <span className="font-black text-[#111f42] uppercase tracking-widest text-[12px]">Grand Total:</span>
                          <span className="text-xl font-black font-mono tracking-tight text-[#E3624A]">{formatCurrency(poForm.grandTotal)}</span>
                        </div>
                      </div>
                    </div>

                    <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
                      <h3 className="text-[11px] font-black text-[#111f42] uppercase tracking-widest border-b border-slate-200 pb-2 mb-6 flex items-center gap-2">
                        <History size={14} className="text-[#E3624A]"/> 3. Document History Log
                      </h3>
                      <div className="space-y-4">
                        {poForm.history && poForm.history.length > 0 ? (
                          poForm.history?.map((h: any, i: number) => (
                            <div key={i} className="flex gap-4">
                              <div className="flex flex-col items-center">
                                <div className="w-8 h-8 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-500 shadow-sm z-10">
                                  <Clock size={14} />
                                </div>
                                {i !== poForm.history.length - 1 && <div className="w-px h-full bg-slate-200 my-1"></div>}
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
                          <div className="text-center py-6 text-slate-400">
                            <History size={32} className="mx-auto mb-3 opacity-20"/>
                            <p className="text-[11px] font-bold uppercase tracking-widest">No history recorded yet.</p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="p-5 bg-slate-50 border-t border-slate-200 flex justify-between items-center shrink-0 px-5">
                    <button onClick={()=>setModalOpen(false)} className="px-6 py-2.5 rounded-lg border font-bold text-[12px] uppercase text-slate-500 bg-white hover:bg-slate-100 transition-all">Close</button>
                    <div className="flex gap-2">
                      {modalMode === 'view' ? (
                        <button onClick={()=>setModalMode('edit')} className="px-5 py-2.5 text-white rounded-lg font-bold shadow-md uppercase tracking-widest flex items-center gap-2 hover:opacity-90 transition-all bg-amber-500 text-[12px]">
                          <Pencil size={14}/> Edit PO
                        </button>
                      ) : modalMode === 'approve' ? (
                        <button onClick={()=>updatePOStatus('Approved')} className="px-5 py-2 text-white rounded-lg font-bold shadow-md uppercase tracking-widest flex items-center gap-2 hover:opacity-90 transition-all bg-[#849a28] text-[12px]">
                          <Stamp size={14}/> Approve PO
                        </button>
                      ) : (
                        <button onClick={handleSavePO} className="px-6 py-2.5 text-white rounded-lg font-bold shadow-md uppercase tracking-widest flex items-center gap-2 hover:opacity-90 transition-all bg-[#111f42] text-[12px]">
                          <Save size={14}/> {modalMode === 'generate' ? 'Confirm Generate' : 'Save PO'}
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </DraggableWrapper>

    </div>
  );
};

export default PoActionModal;

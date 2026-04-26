import React from 'react';
import { X, FileText, Settings, Info, ShoppingCart, Truck, History, Plus, Trash2, Package, CheckCircle } from 'lucide-react';
import { MASTER_CUSTOMERS, MASTER_PRODUCTS } from '../constants';
import { calculateTotals, formatDate } from '../utils';
import { Order } from '../types';
import { DraggableWrapper } from "../../../components/shared/DraggableWrapper";

interface OrderModalProps {
  orderModal: { mode: string; data: Order };
  setOrderModal: (modal: any) => void;
  activeModalTab: string;
  setActiveModalTab: (tab: string) => void;
  setConfigModal: (open: boolean) => void;
  saveOrder: (e: React.FormEvent) => void;
  addDeliveryRound: (itemIdx: number) => void;
  updateDeliveryRound: (itemIdx: number, deliveryIdx: number, field: string, value: any) => void;
  removeDeliveryRound: (itemIdx: number, deliveryIdx: number) => void;
}

export default function OrderModal({
  orderModal,
  setOrderModal,
  activeModalTab,
  setActiveModalTab,
  setConfigModal,
  saveOrder,
  addDeliveryRound,
  updateDeliveryRound,
  removeDeliveryRound
}: OrderModalProps) {
  return (
    <div className="fixed inset-0 bg-[#111f42]/70 backdrop-blur-md z-[100] flex items-center justify-center p-4 no-print">
      
          <DraggableWrapper>
                <div className="bg-white rounded-[2.5rem] w-full max-w-6xl shadow-2xl flex flex-col h-[90vh] border border-white/20 overflow-hidden animate-in fade-in zoom-in duration-200">
                  <div className="px-5 py-6 flex justify-between items-center bg-[#111f42] text-white shrink-0">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center border border-white/20"><FileText size={24} /></div>
                      <div>
                        <div className="flex items-center gap-3">
                          <h2 className="text-2xl font-normal uppercase tracking-tighter">{orderModal.mode === 'create' ? 'New Sales Order' : orderModal.mode === 'edit' ? 'Edit Order' : 'Order Details'}</h2>
                          {orderModal.mode === 'create' && <button type="button" onClick={() => setConfigModal(true)} className="text-white/50 hover:text-white transition-colors"><Settings size={18} /></button>}
                        </div>
                        <p className="text-xs text-slate-400 font-mono mt-1 tracking-widest">{orderModal.data.soNumber}</p>
                      </div>
                    </div>
                    <button type="button" onClick={() => setOrderModal(null)} className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-white/10 transition-all"><X size={24} /></button>
                  </div>
                  
                  <div className="flex flex-1 overflow-hidden">
                    <div className="w-64 bg-slate-50 border-r border-slate-200 flex flex-col p-5 gap-2 shrink-0">
                      {[
                        { id: 'Order Info', icon: Info },
                        { id: 'Items & Pricing', icon: ShoppingCart },
                        { id: 'Delivery Schedule', icon: Truck },
                        { id: 'Summary & Note', icon: FileText },
                        { id: 'History Log', icon: History }
                      ]?.map(t => (
                        <button 
                          type="button"
                          key={t.id} 
                          onClick={() => setActiveModalTab(t.id)} 
                          className={`w-full text-left px-5 py-2.5 rounded-2xl text-xs font-normal uppercase tracking-widest flex items-center gap-4 transition-all ${activeModalTab === t.id ? 'bg-[#111f42] text-white shadow-xl shadow-navy/20 translate-x-1' : 'text-slate-500 hover:bg-white hover:text-[#111f42]'}`}
                        >
                          <t.icon size={18} /> {t.id}
                        </button>
                      ))}
                    </div>
                    
                    <div className="flex-1 overflow-y-auto p-4 sm:p-5 bg-white kanban-scroll relative">
                      <form onSubmit={saveOrder} id="mainOrderForm">
                        
                        {activeModalTab === 'Order Info' && (
                          <div className="space-y-5 animate-in fade-in duration-300">
                            <h4 className="text-sm font-normal uppercase tracking-widest border-b border-slate-100 pb-3 text-[#111f42]">Basic Information</h4>
                            <div className="grid grid-cols-2 gap-5">
                              <div className="space-y-2">
                                <label className="text-[10px] font-normal text-slate-400 uppercase tracking-widest ml-1">Customer</label>
                                <select required value={orderModal.data.customer} onChange={e => setOrderModal({...orderModal, data:{...orderModal.data, customer: e.target.value}})} disabled={orderModal.mode === 'view'} className="w-full bg-slate-50 border-2 border-slate-100 p-3.5 rounded-2xl text-sm font-medium focus:border-[#ab8a3b] outline-none">
                                  <option value="" disabled>Select Customer...</option>
                                  {MASTER_CUSTOMERS?.map(c => <option key={c} value={c}>{c}</option>)}
                                </select>
                              </div>
                              <div className="space-y-2">
                                <label className="text-[10px] font-normal text-slate-400 uppercase tracking-widest ml-1">Order Date</label>
                                <input type="date" required value={orderModal.data.date} onChange={e => setOrderModal({...orderModal, data:{...orderModal.data, date: e.target.value}})} disabled={orderModal.mode === 'view'} className="w-full bg-slate-50 border-2 border-slate-100 p-3.5 rounded-2xl text-sm font-medium focus:border-[#ab8a3b] outline-none" />
                              </div>
                              <div className="space-y-2">
                                <label className="text-[10px] font-normal text-slate-400 uppercase tracking-widest ml-1">Sales Person</label>
                                <input type="text" required value={orderModal.data.salesPerson} onChange={e => setOrderModal({...orderModal, data:{...orderModal.data, salesPerson: e.target.value}})} disabled={orderModal.mode === 'view'} className="w-full bg-slate-50 border-2 border-slate-100 p-3.5 rounded-2xl text-sm font-medium focus:border-[#ab8a3b] outline-none" />
                              </div>
                              <div className="space-y-2">
                                <label className="text-[10px] font-normal text-slate-400 uppercase tracking-widest ml-1">VAT Type</label>
                                <select value={orderModal.data.vatType} onChange={e => setOrderModal({...orderModal, data:{...orderModal.data, vatType: e.target.value}})} disabled={orderModal.mode === 'view'} className="w-full bg-slate-50 border-2 border-slate-100 p-3.5 rounded-2xl text-sm font-medium focus:border-[#ab8a3b] outline-none">
                                  <option value="Excl.">VAT Excluded (7% แยก)</option>
                                  <option value="Incl.">VAT Included (7% รวม)</option>
                                  <option value="No VAT">No VAT (ไม่มีภาษี)</option>
                                </select>
                              </div>
                            </div>
                          </div>
                        )}

                        {activeModalTab === 'Items & Pricing' && (
                          <div className="space-y-4 animate-in fade-in duration-300 pb-20">
                            <div className="flex justify-between items-center border-b border-slate-100 pb-3">
                              <h4 className="text-sm font-normal uppercase tracking-widest text-[#111f42]">Order Items</h4>
                              {orderModal.mode !== 'view' && (
                                <button type="button" onClick={() => setOrderModal({...orderModal, data:{...orderModal.data, items:[...orderModal.data.items, {sku:'',name:'',qty:1,price:0,discount:0,deliveries:[{ round: 1, date: orderModal.data.date, qty: 1 }]}]}})} className="px-4 py-2 bg-[#ab8a3b]/10 text-[#ab8a3b] rounded-xl font-normal text-[10px] uppercase tracking-widest flex items-center gap-2 hover:bg-[#ab8a3b] hover:text-white transition-all"><Plus size={14} /> Add Item</button>
                              )}
                            </div>
                            <div className="space-y-4">
                              {orderModal.data.items?.map((item, idx) => (
                                <div key={idx} className="bg-slate-50 p-4 sm:p-5 rounded-[2rem] border-2 border-slate-100 flex flex-wrap gap-4 items-end relative">
                                  <div className="absolute -top-3 -left-3 w-8 h-8 bg-white border-2 border-slate-100 rounded-full flex items-center justify-center font-bold text-slate-400 text-xs shadow-sm">{idx + 1}</div>
                                  <div className="flex-1 min-w-[200px] space-y-2">
                                    <label className="text-[9px] uppercase font-normal text-slate-400 tracking-widest ml-1">Product</label>
                                    <select required value={item.sku} onChange={e => {
                                      const p = MASTER_PRODUCTS.find(x => x.sku === e.target.value);
                                      if(p) {
                                        const newItems = [...orderModal.data.items];
                                        newItems[idx] = { ...newItems[idx], sku: p.sku, name: p.name, price: p.price, discount: 0 };
                                        setOrderModal({...orderModal, data: {...orderModal.data, items: newItems}});
                                      }
                                    }} disabled={orderModal.mode === 'view'} className="w-full bg-white border-2 border-white p-3 rounded-xl text-xs font-bold shadow-sm focus:border-[#ab8a3b] outline-none transition-all">
                                      <option value="" disabled>Select product...</option>
                                      {MASTER_PRODUCTS?.map(p => <option key={p.sku} value={p.sku}>{p.name} ({p.sku})</option>)}
                                    </select>
                                  </div>
                                  <div className="w-24 space-y-2">
                                    <label className="text-[9px] uppercase font-normal text-slate-400 tracking-widest ml-1 text-center block">Unit Price (฿)</label>
                                    <input type="number" min="0" required value={item.price} onChange={e => {
                                      const newItems = [...orderModal.data.items];
                                      newItems[idx].price = parseFloat(e.target.value) || 0;
                                      setOrderModal({...orderModal, data: {...orderModal.data, items: newItems}});
                                    }} disabled={orderModal.mode === 'view'} className="w-full bg-white border-2 border-white p-3 rounded-xl text-xs font-bold text-center shadow-sm focus:border-[#ab8a3b] outline-none" />
                                  </div>
                                  <div className="w-20 space-y-2">
                                    <label className="text-[9px] uppercase font-normal text-slate-400 tracking-widest ml-1 text-center block">Qty</label>
                                    <input type="number" min="1" required value={item.qty} onChange={e => {
                                      const newItems = [...orderModal.data.items];
                                      const newQty = parseInt(e.target.value) || 0;
                                      newItems[idx].qty = newQty;
                                      if (newItems[idx].deliveries.length === 1) {
                                        newItems[idx].deliveries[0].qty = newQty;
                                      }
                                      setOrderModal({...orderModal, data: {...orderModal.data, items: newItems}});
                                    }} disabled={orderModal.mode === 'view'} className="w-full bg-white border-2 border-white p-3 rounded-xl text-xs font-bold text-center shadow-sm focus:border-[#ab8a3b] outline-none" />
                                  </div>
                                  <div className="w-24 space-y-2">
                                    <label className="text-[9px] uppercase font-normal text-slate-400 tracking-widest ml-1 text-center block">Discount (฿)</label>
                                    <input type="number" min="0" required value={item.discount || 0} onChange={e => {
                                      const newItems = [...orderModal.data.items];
                                      newItems[idx].discount = parseFloat(e.target.value) || 0;
                                      setOrderModal({...orderModal, data: {...orderModal.data, items: newItems}});
                                    }} disabled={orderModal.mode === 'view'} className="w-full bg-white border-2 border-white p-3 rounded-xl text-xs font-bold text-center text-[#E3624A] shadow-sm focus:border-[#ab8a3b] outline-none" />
                                  </div>
                                  <div className="w-28 space-y-2 text-right">
                                    <span className="text-[10px] font-normal text-slate-400 uppercase tracking-widest mr-1">Row Total</span>
                                    <div className="font-bold text-sm text-[#111f42] py-3 pr-2">฿{((item.qty * item.price) - (item.discount || 0))?.toLocaleString()}</div>
                                  </div>
                                  {orderModal.mode !== 'view' && orderModal.data.items.length > 1 && (
                                    <button type="button" onClick={() => {
                                      const newItems = orderModal.data.items?.filter((_, i) => i !== idx);
                                      setOrderModal({...orderModal, data: {...orderModal.data, items: newItems}});
                                    }} className="text-slate-300 hover:text-red-500 pb-3 transition-colors px-2"><Trash2 size={20} /></button>
                                  )}
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {activeModalTab === 'Delivery Schedule' && (
                          <div className="space-y-5 animate-in fade-in duration-300">
                            <div className="flex justify-between items-center border-b border-slate-100 pb-3">
                              <h4 className="text-sm font-normal uppercase tracking-widest text-[#111f42]">Delivery Rounds & Split Management</h4>
                              <p className="text-[10px] font-normal text-slate-400 uppercase">Define specific delivery dates for items</p>
                            </div>

                            {orderModal.data.items?.map((item, itemIdx) => {
                              if (!item.sku) return (
                                <div key={itemIdx} className="bg-slate-50 p-4 sm:p-5 rounded-[2rem] border-2 border-dashed border-slate-200 text-center flex flex-col items-center justify-center gap-3">
                                  <Package size={32} className="text-slate-300" />
                                  <p className="text-xs text-slate-400 font-normal uppercase tracking-widest">Select product for item #{itemIdx + 1} first</p>
                                </div>
                              );

                              const allocatedQty = item.deliveries?.reduce((sum, d) => sum + (Number(d.qty) || 0), 0);
                              const requiredQty = item.qty || 0;
                              const isMatch = allocatedQty === requiredQty;
                              const isOver = allocatedQty > requiredQty;

                              return (
                                <div key={itemIdx} className={`bg-white p-4 sm:p-5 rounded-[2rem] border-2 shadow-sm relative overflow-hidden transition-all ${isOver ? 'border-red-200' : isMatch ? 'border-slate-100' : 'border-amber-200'}`}>
                                  <div className={`absolute top-0 left-0 w-1.5 h-full ${isOver ? 'bg-red-500' : isMatch ? 'bg-emerald-400' : 'bg-amber-400'}`}></div>
                                  
                                  <div className="flex justify-between items-start mb-6 ml-4">
                                    <div>
                                      <h5 className="font-bold text-[#111f42] text-sm uppercase tracking-tight">{itemIdx + 1}. {item.name}</h5>
                                      <p className="text-[10px] text-slate-400 font-mono mt-1">SKU: {item.sku}</p>
                                    </div>
                                    <div className="text-right">
                                      <span className="text-[9px] font-normal uppercase tracking-widest text-slate-400 block mb-1">Allocated / Required</span>
                                      <div className="flex items-baseline justify-end gap-1">
                                        <span className={`text-xl font-bold ${isOver ? 'text-red-500' : isMatch ? 'text-emerald-600' : 'text-amber-500'}`}>{allocatedQty}</span>
                                        <span className="text-sm font-normal text-slate-400">/ {requiredQty}</span>
                                      </div>
                                      {!isMatch && orderModal.mode !== 'view' && (
                                        <p className={`text-[9px] font-normal mt-1 uppercase ${isOver ? 'text-red-500' : 'text-amber-500'}`}>
                                          {isOver ? 'Over allocated!' : 'Missing allocation'}
                                        </p>
                                      )}
                                    </div>
                                  </div>

                                  <div className="ml-4 space-y-3">
                                    {item.deliveries?.map((del, delIdx) => (
                                      <div key={delIdx} className="bg-slate-50 border border-slate-100 p-4 rounded-xl flex items-center gap-4 group">
                                        <div className="w-16">
                                          <span className="text-[9px] font-normal uppercase tracking-widest text-slate-400 block">Round</span>
                                          <span className="font-bold text-[#111f42]">#{del.round}</span>
                                        </div>
                                        <div className="flex-1">
                                          <label className="text-[9px] font-normal uppercase tracking-widest text-slate-400 block mb-1">Target Date</label>
                                          <input type="date" required value={del.date} 
                                            onChange={e => updateDeliveryRound(itemIdx, delIdx, 'date', e.target.value)} 
                                            disabled={orderModal.mode === 'view'} 
                                            className="w-full bg-white border border-slate-200 p-2 rounded-lg text-xs font-bold outline-none focus:border-[#ab8a3b]" 
                                          />
                                        </div>
                                        <div className="w-24">
                                          <label className="text-[9px] font-normal uppercase tracking-widest text-slate-400 block mb-1">Deliver Qty</label>
                                          <input type="number" min="1" required value={del.qty} 
                                            onChange={e => updateDeliveryRound(itemIdx, delIdx, 'qty', parseInt(e.target.value) || 0)} 
                                            disabled={orderModal.mode === 'view'} 
                                            className="w-full bg-white border border-slate-200 p-2 rounded-lg text-xs font-bold outline-none focus:border-[#ab8a3b] text-center" 
                                          />
                                        </div>
                                        {orderModal.mode !== 'view' && item.deliveries.length > 1 && (
                                          <button type="button" onClick={() => removeDeliveryRound(itemIdx, delIdx)} className="text-slate-300 hover:text-red-500 mt-4 transition-colors">
                                            <X size={18} />
                                          </button>
                                        )}
                                      </div>
                                    ))}

                                    {orderModal.mode !== 'view' && (
                                      <button type="button" onClick={() => addDeliveryRound(itemIdx)} className="w-full py-3 mt-2 border-2 border-dashed border-slate-200 rounded-xl text-[10px] font-normal uppercase tracking-widest text-slate-400 hover:text-[#ab8a3b] hover:border-[#ab8a3b] hover:bg-[#ab8a3b]/5 transition-all flex items-center justify-center gap-2">
                                        <Plus size={14} /> Add Delivery Round
                                      </button>
                                    )}
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        )}

                        {activeModalTab === 'Summary & Note' && (
                          <div className="space-y-10 animate-in fade-in duration-300 max-w-2xl mx-auto py-6">
                            <div className="bg-slate-50 p-5 rounded-[2.5rem] border-2 border-slate-100 shadow-sm">
                              <h4 className="text-xs font-normal text-slate-400 uppercase tracking-widest border-b border-slate-200 pb-3 mb-6">Financial Summary</h4>
                              <div className="space-y-4 text-sm font-bold">
                                {(() => {
                                  const totals = calculateTotals(orderModal.data);
                                  return (
                                    <>
                                      <div className="flex justify-between text-slate-500 uppercase tracking-widest text-[10px]"><span className="font-normal">Subtotal</span><span className="font-mono text-base">฿{totals.subtotal?.toLocaleString()}</span></div>
                                      <div className="flex justify-between text-rose-500 uppercase tracking-widest text-[10px]"><span className="font-normal">Total Discount</span><span className="font-mono text-base">-฿{totals.totalDiscount?.toLocaleString()}</span></div>
                                      <div className="flex justify-between text-slate-500 uppercase tracking-widest text-[10px]"><span className="font-normal">VAT Amount ({orderModal.data.vatRate}%)</span><span className="font-mono text-base">฿{totals.vatAmount?.toLocaleString()}</span></div>
                                      <div className="flex justify-between text-[#111f42] text-2xl font-bold border-t-4 border-slate-200 pt-6 mt-6 uppercase tracking-tighter"><span className="font-normal">Grand Total</span><span className="font-mono text-3xl text-[#E3624A]">฿{totals.grandTotal?.toLocaleString()}</span></div>
                                    </>
                                  )
                                })()}
                              </div>
                            </div>
                            <div className="space-y-3">
                              <label className="text-[10px] font-normal text-slate-400 uppercase tracking-widest ml-1">Internal Note / Remarks</label>
                              <textarea rows={5} value={orderModal.data.note || ''} onChange={e => setOrderModal({...orderModal, data: {...orderModal.data, note: e.target.value}})} disabled={orderModal.mode === 'view'} placeholder="Add remarks..." className="w-full bg-white border-2 border-slate-100 rounded-3xl p-5 text-sm font-bold shadow-sm focus:border-[#ab8a3b] outline-none resize-none transition-all" />
                            </div>
                          </div>
                        )}

                        {activeModalTab === 'History Log' && (
                          <div className="animate-in fade-in duration-300 max-w-2xl mx-auto py-10">
                            <div className="relative pl-8 border-l-4 border-slate-100 space-y-12">
                              <div className="relative">
                                <div className="absolute -left-[42px] top-0 w-6 h-6 bg-[#111f42] rounded-full border-4 border-white shadow-md"></div>
                                <p className="text-xs font-normal text-[#111f42] uppercase tracking-widest">Status updated to {orderModal.data.status}</p>
                                <p className="text-[10px] text-slate-400 font-bold mt-1 uppercase">Processed by SYSTEM • Today</p>
                              </div>
                              <div className="relative">
                                <div className="absolute -left-[42px] top-0 w-6 h-6 bg-slate-200 rounded-full border-4 border-white shadow-md"></div>
                                <p className="text-xs font-normal text-slate-400 uppercase tracking-widest">Document Created</p>
                                <p className="text-[10px] text-slate-400 font-bold mt-1 uppercase">Generated by {orderModal.data.salesPerson} • {formatDate(orderModal.data.date)}</p>
                              </div>
                            </div>
                          </div>
                        )}
                        <button type="submit" className="hidden"></button>
                      </form>
                    </div>
                  </div>

                  <div className="px-5 py-6 border-t border-slate-200 bg-slate-50 flex justify-end gap-4 shrink-0 rounded-b-[2.5rem]">
                    <button type="button" onClick={() => setOrderModal(null)} className="px-5 py-3 rounded-2xl border-2 border-slate-200 text-slate-500 font-normal text-[10px] uppercase tracking-widest hover:bg-white transition-all">Close</button>
                    {orderModal.mode === 'view' ? (
                      <button type="button" onClick={() => setOrderModal({...orderModal, mode: 'edit'})} className="px-5 py-3 rounded-2xl bg-[#ab8a3b] text-white font-normal text-[10px] uppercase tracking-widest shadow-lg shadow-gold/20 hover:opacity-90 transition-all">Edit Order</button>
                    ) : (
                      <button type="button" onClick={saveOrder} className="px-6 py-3 rounded-2xl bg-[#111f42] text-white font-normal text-[10px] uppercase tracking-widest shadow-xl shadow-navy/20 hover:opacity-90 transition-all flex items-center gap-2"><CheckCircle size={14}/> Save Order</button>
                    )}
                  </div>
                </div>
              </DraggableWrapper>

    </div>
  );
}

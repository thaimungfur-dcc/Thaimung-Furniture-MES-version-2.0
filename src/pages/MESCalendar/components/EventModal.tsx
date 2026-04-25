import React from 'react';
import { X, CalendarDays, Palmtree, Clock, Save, Pencil } from 'lucide-react';
import { DraggableWrapper } from "../../../components/shared/DraggableWrapper";

interface EventModalProps {
  isOpen: boolean;
  onClose: () => void;
  mode: string;
  setMode: (mode: string) => void;
  eventForm: any;
  setEventForm: (form: any) => void;
  onSave: () => void;
}

export default function EventModal({ isOpen, onClose, mode, setMode, eventForm, setEventForm, onSave }: EventModalProps) {
  if (!isOpen) return null;

  return (
     <div className="fixed inset-0 bg-[#111f42]/40 backdrop-blur-sm z-[200] flex items-center justify-center p-4">
        
          <DraggableWrapper>
                <div className="bg-white rounded-none w-full max-w-xl shadow-2xl overflow-hidden flex flex-col animate-in zoom-in duration-200">
                     
                     {/* Modal Header */}
                     <div className={`px-6 py-2.5 flex justify-between items-center text-white shrink-0 border-b-4 ${eventForm.isHoliday ? 'bg-[#E3624A] border-[#952425]' : 'bg-[#111f42] border-[#E3624A]'}`}>
                       <div className="flex items-center gap-3">
                         {eventForm.isHoliday ? <Palmtree size={22} /> : <CalendarDays size={22} />}
                         <h2 className="text-base font-black uppercase tracking-[0.2em]">
                           {mode === 'create' ? (eventForm.isHoliday ? 'สร้างรายการวันหยุด' : 'สร้างกิจกรรมใหม่') : 
                            mode === 'view' ? 'รายละเอียด' : 'แก้ไขข้อมูล'}
                         </h2>
                       </div>
                       <button onClick={onClose} className="hover:bg-white/10 p-1 rounded-none transition-colors border border-transparent hover:border-white/20"><X size={24}/></button>
                     </div>

                    {/* Modal Body */}
                    <div className="p-4 sm:p-5 space-y-4 bg-slate-50/50">
                      
                      {/* Common Field: Title (Holiday Name / Event Name) */}
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                          {eventForm.isHoliday ? 'ชื่อวันหยุด (Holiday Name)' : 'หัวข้อกิจกรรม (Event Title)'}
                        </label>
                        <input 
                          disabled={mode==='view'} 
                          value={eventForm.title} 
                          onChange={e=>setEventForm({...eventForm, title: e.target.value})} 
                          className={`w-full px-4 py-2.5 border rounded-none focus:ring-0 outline-none font-black text-[14px] bg-white transition-all uppercase tracking-widest ${eventForm.isHoliday ? 'text-red-600 focus:border-red-400' : 'text-[#111f42] focus:border-[#111f42]'}`} 
                          placeholder={eventForm.isHoliday ? "*ระบุชื่อวันสำคัญ..." : "ระบุชื่อกิจกรรม..."} 
                        />
                      </div>

                      {/* Holiday Mode Layout: Only Date */}
                      {eventForm.isHoliday ? (
                        <div className="space-y-1.5">
                          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">วันที่ (Date)</label>
                          <div className="relative">
                            <input 
                              type="date" 
                              disabled={mode==='view'} 
                              value={eventForm.date} 
                              onChange={e=>setEventForm({...eventForm, date: e.target.value})} 
                              className="w-full px-4 py-2.5 border rounded-none bg-white outline-none focus:border-[#E3624A] font-mono font-black text-[14px] uppercase tracking-widest" 
                            />
                          </div>
                        </div>
                      ) : (
                        /* Event Mode Layout: Date + Time + More */
                        <>
                          <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-1.5">
                              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">วันที่ (Date)</label>
                              <input type="date" disabled={mode==='view'} value={eventForm.date} onChange={e=>setEventForm({...eventForm, date: e.target.value})} className="w-full px-4 py-2.5 border rounded-none bg-white outline-none focus:border-[#111f42] font-mono font-black text-[12px] uppercase tracking-widest" />
                            </div>
                            <div className="space-y-1.5">
                              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">เวลา (Time)</label>
                              <div className="relative">
                                <Clock size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                                <input type="time" disabled={mode==='view'} value={eventForm.time} onChange={e=>setEventForm({...eventForm, time: e.target.value})} className="w-full pl-9 pr-3 py-2.5 border rounded-none bg-white outline-none focus:border-[#111f42] font-mono font-black text-[12px]" />
                              </div>
                            </div>
                          </div>

                          <div className="grid grid-cols-3 gap-4">
                            <div className="space-y-1.5">
                              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">หมวดหมู่</label>
                              <select disabled={mode==='view'} value={eventForm.type} onChange={e=>setEventForm({...eventForm, type: e.target.value})} className="w-full px-3 py-2 border rounded-none bg-white outline-none focus:border-[#111f42] cursor-pointer font-black text-[11px] uppercase tracking-widest">
                                <option>Production</option><option>Maintenance</option><option>Logistics</option><option>QC</option><option>Meeting</option>
                              </select>
                            </div>
                            <div className="space-y-1.5">
                              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">ความสำคัญ</label>
                              <select disabled={mode==='view'} value={eventForm.priority} onChange={e=>setEventForm({...eventForm, priority: e.target.value})} className="w-full px-3 py-2 border rounded-none bg-white outline-none focus:border-[#111f42] cursor-pointer font-black text-[11px] uppercase tracking-widest">
                                <option>Low</option><option>Normal</option><option>High</option><option>Critical</option>
                              </select>
                            </div>
                            <div className="space-y-1.5">
                              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">สถานะ</label>
                              <select disabled={mode==='view'} value={eventForm.status} onChange={e=>setEventForm({...eventForm, status: e.target.value})} className="w-full px-3 py-2 border rounded-none bg-white outline-none focus:border-[#111f42] font-black cursor-pointer text-[11px] uppercase tracking-widest">
                                <option>Scheduled</option><option>Confirmed</option><option>Completed</option>
                              </select>
                            </div>
                          </div>
                        </>
                      )}
                    </div>

                    {/* Modal Footer */}
                    <div className="p-5 bg-slate-50 border-t flex justify-end gap-3">
                      <button onClick={onClose} className="px-6 py-2.5 border rounded-none font-black text-[12px] uppercase text-slate-500 bg-white hover:bg-slate-100 transition-all tracking-widest">Cancel</button>
                      {mode !== 'view' ? (
                        <button 
                          onClick={onSave} 
                          className={`px-6 py-2.5 text-white rounded-none font-black shadow-md uppercase tracking-[0.2em] flex items-center gap-2 hover:opacity-90 transition-all ${eventForm.isHoliday ? 'bg-[#E3624A]' : 'bg-[#111f42]'}`}
                        >
                          <Save size={16}/> {mode === 'create' ? 'บันทึกรายการ' : 'อัปเดตข้อมูล'}
                        </button>
                      ) : (
                        <button onClick={()=>setMode('edit')} className="px-6 py-2.5 bg-[#ab8a3b] text-white rounded-none font-black shadow-md uppercase tracking-[0.2em] flex items-center gap-2 hover:opacity-90 transition-all">
                          <Pencil size={16}/> แก้ไขข้อมูล
                        </button>
                      )}
                    </div>
                 </div>
              </DraggableWrapper>

    </div>
  );
}

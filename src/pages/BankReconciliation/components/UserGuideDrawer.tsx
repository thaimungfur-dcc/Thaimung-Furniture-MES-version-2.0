import React from 'react';
import { HelpCircle, X, RefreshCw, Lock } from 'lucide-react';
import { DraggableWrapper } from "../../../components/shared/DraggableWrapper";

export default function UserGuideDrawer({ isGuideOpen, setIsGuideOpen }: any) {
  if (!isGuideOpen) return null;

  return (
    <div className="fixed inset-0 z-[60] flex justify-end no-print">
      
          <DraggableWrapper>
                <div className="absolute inset-0 bg-[#223149]/40 backdrop-blur-sm animate-in fade-in duration-300" onClick={() => setIsGuideOpen(false)}></div>
              </DraggableWrapper>

      <div className="relative w-full max-w-md h-full bg-white shadow-2xl flex flex-col animate-in slide-in-from-right duration-300 border-l border-white/20">
        <div className="px-6 py-5 flex justify-between items-center bg-[#223f59] text-white shrink-0 shadow-md">
          <h2 className="text-base font-bold uppercase tracking-widest flex items-center gap-2"><HelpCircle size={20} className="text-[#0ea5e9]" /> คู่มือการใช้งาน (BANK REC GUIDE)</h2>
          <button onClick={() => setIsGuideOpen(false)} className="hover:bg-white/20 p-1.5 rounded-lg transition-colors"><X size={20} /></button>
        </div>
        <div className="flex-1 overflow-y-auto p-6 md:p-8 bg-[#f5f0e9] text-[13px] text-[#223149] space-y-6">
          <div className="bg-emerald-50 border border-emerald-200 p-4 rounded-xl flex items-start gap-3 text-emerald-800 shadow-sm mb-6">
            <div className="bg-emerald-100 p-1.5 rounded-lg shrink-0"><RefreshCw size={18} className="text-emerald-600"/></div>
            <div className="flex-1 min-w-0">
               <p className="text-[12px] font-black uppercase text-emerald-700 mb-1">Centralized Policy</p>
               <p className="text-[11px] font-bold leading-relaxed">ข้อมูลธนาคารและรายการรับ-จ่ายทั้งหมดถูกซิงค์มาจาก Master Data Center และระบบ AR/AP โดยอัตโนมัติ</p>
            </div>
          </div>
          <div>
            <h3 className="text-sm font-black text-[#223149] border-b-2 border-[#0ea5e9]/30 pb-2 mb-3 flex items-center gap-2"><Lock size={16} className="text-[#0ea5e9]"/> 1. การจัดการข้อมูล</h3>
            <p className="font-medium leading-relaxed bg-blue-50 p-3 rounded-lg border border-blue-100 text-blue-800 italic">"ระบบได้ล็อกการทำรายการในหน้านี้เพื่อความแม่นยำของยอดเงิน" หากมีรายการที่ต้องบันทึกเพิ่มหรือปรับปรุงยอด กรุณาดำเนินการที่หน้า **Master Data Entry**</p>
          </div>
        </div>
        <div className="p-5 bg-white border-t border-slate-100 flex justify-end shrink-0 shadow-inner">
          <button onClick={() => setIsGuideOpen(false)} className="px-6 py-2.5 rounded-lg font-bold bg-[#223f59] text-white hover:opacity-90 uppercase tracking-wider">เข้าใจแล้ว (Close)</button>
        </div>
      </div>
    </div>
  );
}

import React from 'react';
import { HelpCircle, X, RefreshCw, Lock, Kanban } from 'lucide-react';
import { DraggableWrapper } from "../../../components/shared/DraggableWrapper";

export default function UserGuideDrawer({ isGuideOpen, setIsGuideOpen }: any) {
  if (!isGuideOpen) return null;

  return (
    <div className="fixed inset-0 z-[60] flex justify-end no-print">
      
          <DraggableWrapper>
                <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-300" onClick={() => setIsGuideOpen(false)}></div>
              </DraggableWrapper>

      <div className="relative w-full max-w-md h-full bg-white shadow-2xl flex flex-col animate-in slide-in-from-right duration-300 border-l border-white/20">
        <div className="px-6 py-5 flex justify-between items-center bg-[#1e293b] text-white shrink-0 shadow-md">
          <h2 className="text-base font-bold uppercase tracking-widest flex items-center gap-2"><HelpCircle size={20} className="text-[#df8a5d]" /> คู่มือการใช้งาน (TAX USER GUIDE)</h2>
          <button onClick={() => setIsGuideOpen(false)} className="hover:bg-white/20 p-1.5 rounded-lg transition-colors"><X size={20} /></button>
        </div>
        
        <div className="flex-1 overflow-y-auto p-6 md:p-8 bg-[#f5f0e9] text-[13px] text-[#223149] space-y-6">
          <div className="bg-emerald-50 border border-emerald-200 p-4 rounded-xl flex items-start gap-3 text-emerald-800 shadow-sm mb-6">
            <div className="bg-emerald-100 p-1.5 rounded-lg shrink-0"><RefreshCw size={18} className="text-emerald-600"/></div>
            <div className="flex-1 min-w-0">
               <p className="text-[12px] font-black uppercase text-emerald-700 mb-1">Auto-Sync & Centralized Policy</p>
               <p className="text-[11px] font-bold leading-relaxed">
                 หน้านี้ทำหน้าที่แสดงผลและตรวจสอบรายการภาษีแบบ **Read-Only** เท่านั้น โดยข้อมูลทั้งหมดจะถูกซิงค์มาจาก:
                 <br/>• **Master Data:** รายการที่บันทึกผ่าน Master Data Center
                 <br/>• **AR/AP Sync:** ภาษีที่เกิดขึ้นจากการออกใบแจ้งหนี้หรือรับบิลเจ้าหนี้
               </p>
            </div>
          </div>

          <div>
            <h3 className="text-sm font-black text-[#1e293b] border-b-2 border-[#df8a5d]/30 pb-2 mb-3 flex items-center gap-2"><Lock size={16} className="text-[#ce5a43]"/> 1. การจัดการข้อมูล</h3>
            <p className="font-medium leading-relaxed bg-blue-50 p-3 rounded-lg border border-blue-100 text-blue-800 italic">
              "เพื่อความถูกต้องตามมาตรฐานบัญชีและป้องกันข้อมูลซ้ำซ้อน ระบบได้ระงับการเพิ่ม/แก้ไขรายการในหน้านี้โดยตรง" 
              <br/><br/>
              หากต้องการเพิ่มใบกำกับภาษีใหม่ หรือแก้ไขยอดเงิน กรุณาไปดำเนินการที่หน้า <span className="font-bold underline">Master Data Entry</span>
            </p>
          </div>

          <div>
            <h3 className="text-sm font-black text-[#1e293b] border-b-2 border-[#df8a5d]/30 pb-2 mb-3 flex items-center gap-2"><Kanban size={16} className="text-[#ce5a43]"/> 2. มุมมองการตรวจสอบ</h3>
            <ul className="list-disc pl-5 space-y-2 marker:text-[#df8a5d] font-medium text-[12px]">
              <li><strong className="text-[#1e293b]">BOARD:</strong> ตรวจสอบสถานะเอกสารภาษี ตั้งแต่บันทึก (Recorded) -&gt; ตรวจสอบ (Verified) -&gt; ยื่นแบบ (Filed)</li>
              <li><strong className="text-[#496ca8]">DETAILED DATA:</strong> ตารางข้อมูลรวมที่คำนวณฐานภาษีและ VAT แยกส่วนให้อัตโนมัติ เพื่อใช้ตรวจสอบความถูกต้องก่อนยื่น ภ.พ.30</li>
            </ul>
          </div>
        </div>

        <div className="p-5 bg-white border-t border-slate-100 flex justify-end shrink-0 shadow-inner">
          <button onClick={() => setIsGuideOpen(false)} className="px-6 py-2.5 rounded-lg font-bold bg-[#1e293b] text-white hover:opacity-90 transition-colors uppercase tracking-wider">
            รับทราบ (Close)
          </button>
        </div>
      </div>
    </div>
  );
}

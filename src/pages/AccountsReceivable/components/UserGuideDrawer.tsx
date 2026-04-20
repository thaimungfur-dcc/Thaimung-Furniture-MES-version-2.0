import React from 'react';
import { HelpCircle, X, Kanban, FileText, CreditCard, RefreshCw } from 'lucide-react';

export default function UserGuideDrawer({ isGuideOpen, setIsGuideOpen }: any) {
  if (!isGuideOpen) return null;

  return (
    <div className="fixed inset-0 z-[60] flex justify-end no-print">
      <div className="absolute inset-0 bg-[#223149]/40 backdrop-blur-sm animate-in fade-in duration-300" onClick={() => setIsGuideOpen(false)}></div>
      <div className="relative w-full max-w-md h-full bg-white shadow-2xl flex flex-col animate-in slide-in-from-right duration-300 border-l border-white/20">
        <div className="px-6 py-5 flex justify-between items-center bg-[#223149] text-white shrink-0 shadow-md">
          <h2 className="text-base font-bold uppercase tracking-widest flex items-center gap-2">
            <HelpCircle size={20} className="text-[#df8a5d]" /> คู่มือการใช้งาน (USER GUIDE)
          </h2>
          <button onClick={() => setIsGuideOpen(false)} className="hover:bg-white/20 p-1.5 rounded-lg transition-colors"><X size={20} /></button>
        </div>
        
        <div className="flex-1 overflow-y-auto p-6 md:p-8 bg-[#f5f0e9] text-[13px] text-[#223149] space-y-8">
          <div>
            <h3 className="text-sm font-black text-[#223149] border-b-2 border-[#df8a5d]/30 pb-2 mb-3 flex items-center gap-2"><Kanban size={16} className="text-[#ce5a43]"/> 1. ภาพรวมการใช้งาน (Overview)</h3>
            <p className="leading-relaxed font-medium mb-2">ระบบจัดการฐานข้อมูล (Database) นี้ เน้นไปที่ <strong>การปฏิบัติงานรายวัน (Operation)</strong> สำหรับการรับชำระเงินและตามหนี้ รวมทั้งการจัดการข้อมูลเชิงลึกเพื่อส่งต่อให้ฝั่ง Dashboard ประมวลผล</p>
            <div className="bg-emerald-50 border border-emerald-200 p-3 rounded-xl flex items-start gap-3 text-emerald-800 shadow-sm mt-3">
              <div className="bg-emerald-100 p-1.5 rounded-lg shrink-0">
                 <RefreshCw size={16} className="text-emerald-600"/>
              </div>
              <div className="flex-1 min-w-0 mt-0.5">
                 <p className="text-[11px] font-bold tracking-wide leading-relaxed">
                   <span className="uppercase font-black mr-1 text-emerald-700">Auto-Sync Active:</span> 
                   ข้อมูลใบแจ้งหนี้ทั้งหมดซิงค์มาจาก Master Data Center โดยตรง <span className="text-rose-600 font-black underline">ไม่อนุญาตให้เพิ่มข้อมูลใหม่ในหน้านี้</span>
                 </p>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-sm font-black text-[#223149] border-b-2 border-[#df8a5d]/30 pb-2 mb-3 flex items-center gap-2"><FileText size={16} className="text-[#ce5a43]"/> 2. มุมมองตารางแบบละเอียด (DETAILED INVOICES)</h3>
            <ul className="list-disc pl-5 space-y-1.5 marker:text-[#df8a5d] font-medium text-[12px]">
              <li>แสดงข้อมูลครบถ้วนทั้งวันที่ออกบิล (Issue Date) และวันครบกำหนด (Due Date) สำหรับใช้คำนวณ DSO</li>
              <li>แสดงเครดิตเทอม และประเภทลูกค้า (New / Returning) สำหรับวิเคราะห์ Retention</li>
              <li>สามารถคลิก <strong>Mark Bad Debt</strong> เพื่อแท็กว่าหนี้ก้อนนี้เป็นหนี้สูญ และจะถูกนำไปคำนวณเป็น Bad Debt Ratio</li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-black text-[#223149] border-b-2 border-[#df8a5d]/30 pb-2 mb-3 flex items-center gap-2"><CreditCard size={16} className="text-[#ce5a43]"/> 3. การรับชำระเงิน (Pay)</h3>
            <ul className="list-disc pl-5 space-y-1.5 marker:text-[#df8a5d] font-medium text-[12px]">
              <li>คลิก <strong>Pay</strong> บนการ์ดใดๆ เพื่อทำการบันทึกรับชำระเงินตัดยอดหนี้</li>
              <li>ระบบจะบันทึกวันที่จ่ายเงินจริง (Pay Date) ทันทีที่จ่ายครบ ซึ่งเป็นหัวใจสำคัญในการคำนวณ CEI และ WACD</li>
            </ul>
          </div>
        </div>

        <div className="p-5 bg-white border-t border-slate-100 flex justify-end shrink-0 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
          <button onClick={() => setIsGuideOpen(false)} className="px-6 py-2.5 rounded-lg font-bold bg-[#223149] text-white hover:opacity-90 transition-colors uppercase tracking-wider">
            เข้าใจแล้ว (Close)
          </button>
        </div>
      </div>
    </div>
  );
}

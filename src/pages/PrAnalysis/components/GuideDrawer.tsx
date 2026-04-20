import React from 'react';
import { HelpCircle, X, LayoutDashboard, Activity } from 'lucide-react';

interface GuideDrawerProps {
  onClose: () => void;
}

export default function GuideDrawer({ onClose }: GuideDrawerProps) {
  return (
    <>
      <div className="fixed inset-0 bg-[#111f42]/40 backdrop-blur-sm z-[60] animate-in fade-in duration-200" onClick={onClose} />
      <div className="fixed inset-y-0 right-0 w-full md:w-[450px] bg-white shadow-2xl z-[70] flex flex-col animate-in slide-in-from-right duration-300">
        <div className="px-6 py-5 flex justify-between items-center bg-[#111f42] text-white shrink-0 border-b-4 border-[#E3624A]">
          <h2 className="text-base font-semibold uppercase tracking-widest flex items-center gap-2">
            <HelpCircle size={20} className="text-[#E3624A]" /> คู่มือการใช้งาน Analysis
          </h2>
          <button onClick={onClose} className="hover:bg-white/20 p-1.5 rounded-lg transition-colors">
            <X size={20} />
          </button>
        </div>
        
        <div className="flex-1 overflow-y-auto p-6 md:p-8 bg-slate-50 text-[13px] text-slate-700 space-y-8 custom-scrollbar">
          <div>
            <h3 className="text-sm font-bold text-[#111f42] border-b-2 border-slate-200 pb-2 mb-3 flex items-center gap-2"><LayoutDashboard size={16}/> 1. ภาพรวม (Overview)</h3>
            <p className="leading-relaxed text-slate-600">หน้าวิเคราะห์ข้อมูล PR ช่วยให้ผู้บริหารติดตามแนวโน้มการสั่งซื้อ สัดส่วนสถานะ และการใช้งบประมาณของแต่ละแผนกแบบ Real-time</p>
          </div>
          <div>
            <h3 className="text-sm font-bold text-[#111f42] border-b-2 border-slate-200 pb-2 mb-3 flex items-center gap-2"><Activity size={16}/> 2. การตีความกราฟ</h3>
            <ul className="list-disc pl-5 space-y-3 marker:text-[#b84530]">
              <li><strong>Status Distribution:</strong> ดูว่าตอนนี้มีคอขวดที่สถานะใด เช่น มีรายการ Revise สูงผิดปกติหรือไม่</li>
              <li><strong>Spend by Dept:</strong> เปรียบเทียบงบประมาณที่แผนกต่างๆ ร้องขอมา เพื่อจัดลำดับความสำคัญ</li>
            </ul>
          </div>
        </div>

        <div className="p-4 bg-white border-t border-slate-100 flex justify-end shrink-0">
          <button onClick={onClose} className="px-6 py-2.5 rounded-lg font-semibold bg-[#111f42] text-white hover:opacity-90 transition-colors uppercase tracking-wider text-[11px]">
            เข้าใจแล้ว (Close)
          </button>
        </div>
      </div>
    </>
  );
}

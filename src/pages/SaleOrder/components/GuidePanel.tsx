import React from 'react';
import { X, HelpCircle, LayoutDashboard, Plus, Truck, Kanban } from 'lucide-react';
import { DraggableWrapper } from "../../../components/shared/DraggableWrapper";

interface GuidePanelProps {
  isGuideOpen: boolean;
  setIsGuideOpen: (open: boolean) => void;
}

export default function GuidePanel({ isGuideOpen, setIsGuideOpen }: GuidePanelProps) {
  return (
    <div className={`fixed inset-0 z-[200] transition-opacity duration-300 no-print ${isGuideOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
      
          <DraggableWrapper>
                <div className="absolute inset-0 bg-[#111f42]/40 backdrop-blur-sm" onClick={() => setIsGuideOpen(false)}></div>
              </DraggableWrapper>

      <div className={`absolute top-0 right-0 h-full w-full max-w-md bg-white shadow-2xl transform transition-transform duration-300 ease-in-out flex flex-col ${isGuideOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        <div className="bg-[#111f42] text-white p-6 flex justify-between items-center border-b-4 border-[#E3624A] shrink-0">
          <h2 className="text-lg font-bold flex items-center gap-3 tracking-widest uppercase"><HelpCircle size={22} className="text-[#ab8a3b]" /> คู่มือการใช้งาน (SO)</h2>
          <button onClick={() => setIsGuideOpen(false)} className="hover:bg-white/20 p-2 rounded-xl transition-colors"><X size={20} /></button>
        </div>
        <div className="flex-1 overflow-y-auto p-8 space-y-8 text-[#111f42] kanban-scroll">
          <div>
            <h3 className="font-bold text-[14px] flex items-center gap-3 border-b border-slate-100 pb-2 mb-4"><LayoutDashboard size={18} className="text-[#ab8a3b]"/> 1. ภาพรวมระบบ (OVERVIEW)</h3>
            <p className="text-slate-600 text-[12px] leading-relaxed ml-8 font-light">ระบบ <strong className="text-[#111f42] font-normal">Sales Order (SO)</strong> ใช้สำหรับออกใบสั่งขายและบันทึกข้อมูลการสั่งซื้อสินค้าอย่างเป็นทางการ หลังจากที่มีการตกลงซื้อขายกับลูกค้า</p>
          </div>
          <div>
            <h3 className="font-bold text-[14px] flex items-center gap-3 border-b border-slate-100 pb-2 mb-4"><Plus size={18} className="text-[#E3624A]"/> 2. การสร้างใบสั่งขาย (NEW ORDER)</h3>
            <p className="text-slate-600 text-[12px] leading-relaxed ml-8 font-light">คลิกปุ่ม <strong className="text-[#111f42] font-normal">NEW ORDER</strong> ระบุลูกค้า, รายการสินค้า และที่สำคัญสามารถ <strong className="font-normal">แบ่งรอบจัดส่งสินค้าได้ (Split Delivery)</strong> ในแถบ Delivery Schedule</p>
          </div>
          <div>
            <h3 className="font-bold text-[14px] flex items-center gap-3 border-b border-slate-100 pb-2 mb-4"><Truck size={18} className="text-blue-500"/> 3. การแบ่งรอบจัดส่ง (SPLIT DELIVERY)</h3>
            <p className="text-slate-600 text-[12px] leading-relaxed ml-8 font-light">ใน 1 รายการสินค้า หากต้องการทยอยส่ง สามารถกดปุ่ม <strong className="font-normal">+ Add Delivery Round</strong> เพื่อกำหนดวันที่และจำนวนย่อยที่จะส่งในแต่ละรอบได้ ระบบจะเช็คยอดรวมให้อัตโนมัติ</p>
          </div>
          <div>
            <h3 className="font-bold text-[14px] flex items-center gap-3 border-b border-slate-100 pb-2 mb-4"><Kanban size={18} className="text-[#6b7556]"/> 4. สถานะใบสั่งขาย (KANBAN BOARD)</h3>
            <ul className="text-slate-600 text-[12px] leading-relaxed ml-8 space-y-3 font-light">
              <li className="flex items-start gap-2"><span className="w-1.5 h-1.5 rounded-full bg-slate-400 mt-1.5 shrink-0"></span><span><strong className="text-[#111f42] font-normal">Booking:</strong> สั่งจองสินค้า (ระบบจะทำการล็อกสต็อกสินค้าไว้)</span></li>
              <li className="flex items-start gap-2"><span className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-1.5 shrink-0"></span><span><strong className="text-[#111f42] font-normal">JO Created:</strong> สั่งผลิตสินค้า (กรณีสินค้าในคลังไม่เพียงพอ)</span></li>
              <li className="flex items-start gap-2"><span className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-1.5 shrink-0"></span><span><strong className="text-[#111f42] font-normal">Production:</strong> สินค้าอยู่ระหว่างขั้นตอนการผลิต</span></li>
              <li className="flex items-start gap-2"><span className="w-1.5 h-1.5 rounded-full bg-orange-500 mt-1.5 shrink-0"></span><span><strong className="text-[#111f42] font-normal">Ready to Ship:</strong> สินค้าผลิตเสร็จสิ้น พร้อมสำหรับการจัดส่ง</span></li>
              <li className="flex items-start gap-2"><span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-1.5 shrink-0"></span><span><strong className="text-[#111f42] font-normal">Delivered:</strong> จัดส่งสินค้าให้ลูกค้าเสร็จสมบูรณ์</span></li>
              <li className="flex items-start gap-2"><span className="w-1.5 h-1.5 rounded-full bg-red-500 mt-1.5 shrink-0"></span><span><strong className="text-[#E3624A] font-normal">Returned:</strong> สินค้าถูกตีกลับ คืนเงิน หรือยกเลิกออเดอร์</span></li>
            </ul>
          </div>
        </div>
        <div className="p-6 bg-white border-t border-slate-100 flex justify-end shrink-0">
          <button onClick={() => setIsGuideOpen(false)} className="px-8 py-3 bg-[#111f42] text-white font-normal rounded-xl shadow-lg hover:bg-[#111f42]/90 transition-all uppercase tracking-widest text-[11px]">เข้าใจแล้ว</button>
        </div>
      </div>
    </div>
  );
}

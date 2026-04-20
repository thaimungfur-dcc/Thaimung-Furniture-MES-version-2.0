import React from 'react';
import { HelpCircle, X } from 'lucide-react';

interface GuideDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function GuideDrawer({ isOpen, onClose }: GuideDrawerProps) {
  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 bg-[#111f42]/40 backdrop-blur-sm z-[100] animate-in fade-in duration-200" onClick={onClose} />
      <div className="fixed inset-y-0 right-0 w-full md:w-[450px] bg-white shadow-2xl z-[110] flex flex-col animate-in slide-in-from-right duration-300">
        <div className="px-6 py-5 flex justify-between items-center bg-[#111f42] text-white shrink-0 border-b-4 border-[#E3624A]">
          <div className="flex items-center gap-2"><HelpCircle size={20} className="text-[#E3624A]" /><h2 className="text-base font-semibold uppercase tracking-widest">คู่มือการใช้งานปฏิทิน</h2></div>
          <button onClick={onClose} className="hover:bg-white/20 p-1.5 rounded-lg transition-colors"><X size={20} /></button>
        </div>
        <div className="flex-1 overflow-y-auto p-8 text-slate-700 space-y-8 text-[13px] leading-relaxed">
           <section>
              <h4 className="font-black border-b pb-1 text-[#111f42] uppercase flex items-center gap-2 mb-3">1. การใช้งานปฏิทิน</h4>
              <p>คุณสามารถเปลี่ยนเดือนได้ที่แถบเมนูด้านบน โดยใช้ปุ่มลูกศร <b>ซ้าย/ขวา</b> และกดปุ่ม <b>Today</b> เพื่อกลับมายังวันปัจจุบัน</p>
           </section>
           <section>
              <h4 className="font-black border-b pb-1 text-[#111f42] uppercase flex items-center gap-2 mb-3">2. การเพิ่มกิจกรรมและวันหยุด</h4>
              <p>กดปุ่ม <b>Add Event</b> สำหรับกิจกรรมประจำโรงงานที่มีรายละเอียดเวลาและหมวดหมู่ หรือกดปุ่ม <b>Add Holiday</b> สำหรับวันสำคัญประจำปี ซึ่งจะมีรูปแบบที่กระชับกว่า</p>
           </section>
           <section>
              <h4 className="font-black border-b pb-1 text-[#111f42] uppercase flex items-center gap-2 mb-3">3. ความหมายของเครื่องหมาย</h4>
              <p>รายการที่มีเครื่องหมาย <b>*</b> นำหน้าชื่อ จะถูกจัดเป็น "วันหยุด" และแสดงผลด้วยตัวอักษรหรือพื้นหลังสีแดง</p>
           </section>
           <section>
              <h4 className="font-black border-b pb-1 text-[#111f42] uppercase flex items-center gap-2 mb-3">4. หมวดหมู่กิจกรรมโรงงาน</h4>
              <div className="grid grid-cols-1 gap-3 font-mono text-[11px]">
                 <div className="flex items-center gap-2"><div className="w-4 h-4 bg-indigo-100 border border-indigo-200 rounded"></div> <span className="text-indigo-700 font-bold">Production: แผนการผลิต</span></div>
                 <div className="flex items-center gap-2"><div className="w-4 h-4 bg-amber-100 border border-amber-200 rounded"></div> <span className="text-amber-700 font-bold">Maintenance: ซ่อมบำรุงเครื่องจักร</span></div>
                 <div className="flex items-center gap-2"><div className="w-4 h-4 bg-teal-100 border border-teal-200 rounded"></div> <span className="text-teal-700 font-bold">Logistics: คลังสินค้าและขนส่ง</span></div>
                 <div className="flex items-center gap-2"><div className="w-4 h-4 bg-purple-100 border border-purple-200 rounded"></div> <span className="text-purple-700 font-bold">QC: การตรวจสอบคุณภาพ</span></div>
              </div>
           </section>
           <section>
              <h4 className="font-black border-b pb-1 text-[#111f42] uppercase flex items-center gap-2 mb-3">5. ความหมายของสีหัวปฏิทิน</h4>
              <div className="grid grid-cols-1 gap-3">
                 <div className="flex items-center gap-2"><div className="w-4 h-4 bg-[#e11d48] rounded"></div> <span>สีแดง: วันอาทิตย์ (SUN)</span></div>
                 <div className="flex items-center gap-2"><div className="w-4 h-4 bg-[#a98ab6] rounded"></div> <span>สีม่วงลาเวนเดอร์: วันเสาร์ (SAT)</span></div>
                 <div className="flex items-center gap-2"><div className="w-4 h-4 bg-[#111f42] rounded"></div> <span>สีน้ำเงิน: วันทำงานปกติ (MON-FRI)</span></div>
              </div>
           </section>
        </div>
        <div className="p-4 border-t flex justify-end bg-slate-50"><button onClick={onClose} className="bg-[#111f42] text-white px-8 py-2.5 rounded-none font-bold text-[12px] uppercase tracking-wider shadow-md">ปิดคู่มือ</button></div>
      </div>
    </>
  );
}

import React from 'react';
import { HelpCircle, X, Settings2 } from 'lucide-react';

interface GuideDrawerProps {
  isGuideOpen: boolean;
  setIsGuideOpen: (show: boolean) => void;
}

export default function GuideDrawer({ isGuideOpen, setIsGuideOpen }: GuideDrawerProps) {
  if (!isGuideOpen) return null;

  return (
    <>
      <div className="fixed inset-0 bg-[#111f42]/40 backdrop-blur-sm z-[100] animate-in fade-in duration-200" onClick={() => setIsGuideOpen(false)} />
      <div className="fixed inset-y-0 right-0 w-full md:w-[450px] bg-white shadow-2xl z-[110] flex flex-col animate-in slide-in-from-right duration-300">
        <div className="px-6 py-5 flex justify-between items-center bg-[#111f42] text-white shrink-0 border-b-4 border-[#ab8a3b]">
          <div className="flex items-center gap-2"><HelpCircle size={20} className="text-[#ab8a3b]" /><h2 className="text-base font-semibold uppercase tracking-widest">คู่มือการใช้งาน Master Code</h2></div>
          <button onClick={() => setIsGuideOpen(false)} className="hover:bg-white/20 p-1.5 rounded-lg transition-colors"><X size={20} /></button>
        </div>
        <div className="flex-1 overflow-y-auto p-8 text-slate-700 space-y-8 text-[13px] leading-relaxed">
          <section>
            <h4 className="font-black border-b pb-1 text-[#111f42] uppercase flex items-center gap-2 mb-3">1. โครงสร้างรหัส (Code Structure)</h4>
            <p>รหัส Master Code จะถูกสร้างอัตโนมัติ โดยการนำ <b>รหัสหมวดหลัก (Code)</b> มาต่อกับ <b>รหัสหมวดรอง (Sub Code)</b> ตัวอย่างเช่น <br/><br/> <span className="bg-slate-100 px-3 py-1.5 rounded font-mono text-[#111f42] font-bold">FG + SF = FGSF</span></p>
          </section>
          <section>
            <h4 className="font-black border-b pb-1 text-[#111f42] uppercase flex items-center gap-2 mb-3">2. การจัดการกลุ่ม (Config Groups)</h4>
            <p>คุณสามารถเพิ่ม แก้ไข หรือลบกลุ่ม (Group Type) ได้โดยคลิกที่ปุ่ม <span className="inline-flex items-center gap-1 bg-white border border-[#ab8a3b] text-[#ab8a3b] px-2 py-0.5 rounded text-[10px] uppercase font-bold"><Settings2 size={10}/> Config Groups</span> ซึ่งอยู่บริเวณมุมขวาบนในหน้าต่างการสร้างรหัสใหม่</p>
          </section>
          <section>
            <h4 className="font-black border-b pb-1 text-[#111f42] uppercase flex items-center gap-2 mb-3">3. การจัดการข้อมูล</h4>
            <p>สามารถแก้ไข (Edit) หรือลบ (Delete) ข้อมูลรหัสได้ที่ปุ่ม Action ด้านขวาสุดของตาราง และสามารถค้นหารหัสได้อย่างรวดเร็วในช่องค้นหาด้านบน</p>
          </section>
          <section>
            <h4 className="font-black border-b pb-1 text-[#111f42] uppercase flex items-center gap-2 mb-3">4. ความหมายของกลุ่มพื้นฐาน</h4>
            <div className="grid grid-cols-1 gap-3 font-mono text-[11px]">
              <div className="flex items-center gap-2"><div className="w-4 h-4 bg-[#111f42]/10 border border-[#111f42]/20 rounded"></div> <span className="text-[#111f42] font-bold">FG: สินค้าสำเร็จรูป (Finished Goods)</span></div>
              <div className="flex items-center gap-2"><div className="w-4 h-4 bg-[#10b981]/10 border border-[#10b981]/20 rounded"></div> <span className="text-[#10b981] font-bold">RM: วัตถุดิบหลัก (Raw Materials)</span></div>
              <div className="flex items-center gap-2"><div className="w-4 h-4 bg-[#ab8a3b]/10 border border-[#ab8a3b]/20 rounded"></div> <span className="text-[#ab8a3b] font-bold">HW: อุปกรณ์/อะไหล่ (Hardware)</span></div>
              <div className="flex items-center gap-2"><div className="w-4 h-4 bg-[#E3624A]/10 border border-[#E3624A]/20 rounded"></div> <span className="text-[#E3624A] font-bold">FB: ผ้าและหนัง (Fabric/Leather)</span></div>
              <div className="flex items-center gap-2"><div className="w-4 h-4 bg-[#4e546a]/10 border border-[#4e546a]/20 rounded"></div> <span className="text-[#4e546a] font-bold">PK: บรรจุภัณฑ์ (Packaging)</span></div>
            </div>
          </section>
        </div>
        <div className="p-4 border-t flex justify-end bg-slate-50"><button onClick={()=>setIsGuideOpen(false)} className="bg-[#111f42] text-white px-8 py-2.5 rounded-none font-bold text-[12px] uppercase tracking-wider shadow-md hover:bg-[#1e346b] transition-colors">ปิดคู่มือ</button></div>
      </div>
    </>
  );
}

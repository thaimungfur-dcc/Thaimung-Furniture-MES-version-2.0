import React from 'react';
import { X, HelpCircle } from 'lucide-react';

export const GuideDrawer = ({ isGuideOpen, setIsGuideOpen }: any) => {
    if (!isGuideOpen) return null;

    return (
        <>
            <div className="fixed inset-0 bg-[#111f42]/40 backdrop-blur-sm z-[100] animate-in fade-in duration-200 no-print" onClick={() => setIsGuideOpen(false)} />
            <div className="fixed inset-y-0 right-0 w-full md:w-[450px] bg-white shadow-2xl z-[110] flex flex-col animate-in slide-in-from-right duration-300 no-print text-[12px]">
                <div className="px-6 py-5 flex justify-between items-center bg-[#111f42] text-white shrink-0 border-b-4 border-[#ab8a3b]">
                    <div className="flex items-center gap-2"><HelpCircle size={20} className="text-[#ab8a3b]" /><h2 className="text-base font-semibold uppercase tracking-widest font-mono text-[12px]">Warehouse In Guide</h2></div>
                    <button onClick={() => setIsGuideOpen(false)} className="hover:bg-white/20 p-1.5 rounded-lg transition-colors"><X size={20} /></button>
                </div>
                <div className="flex-1 overflow-y-auto p-8 text-slate-700 space-y-8 leading-relaxed font-sans text-[11px]">
                    <section>
                        <h4 className="font-black border-b pb-1 text-[#111f42] uppercase flex items-center gap-2 mb-3">1. การรับสินค้าจากเอกสาร</h4>
                        <p>เลือกแท็บ **Pending JO** (รับสินค้าสำเร็จรูปจากการผลิต) หรือ **Pending PO** (รับวัตถุดิบจากการสั่งซื้อ) แล้วกดปุ่ม **RECEIVE** (ไอคอนดาวน์โหลด) เพื่อรับสินค้า ระบบจะคำนวณจำนวนที่เหลือให้โดยอัตโนมัติ</p>
                    </section>
                    <section>
                        <h4 className="font-black border-b pb-1 text-[#111f42] uppercase flex items-center gap-2 mb-3">2. การบังคับปิดงาน (Force Close)</h4>
                        <p>สำหรับรายการที่อยู่ระหว่างดำเนินการ (In Progress) หากไม่ต้องการรับสินค้าที่เหลือแล้ว สามารถกดไอคอน **Power** (สีแดง) เพื่อบังคับปิดงานได้ทันที</p>
                    </section>
                    <section>
                        <h4 className="font-black border-b pb-1 text-[#111f42] uppercase flex items-center gap-2 mb-3">3. การพิมพ์รายงาน</h4>
                        <p>เข้าสู่แท็บ **RECEIVE REPORT** เลือกช่วงเวลาที่ต้องการ แล้วกด Generate เพื่อสรุปยอดรับเข้าทั้งหมด และสามารถกด Print Preview เพื่อดูเอกสารแบบ A4 ได้</p>
                    </section>
                </div>
                <div className="p-4 border-t flex justify-end bg-slate-50 text-[10px] font-mono font-bold"><button onClick={()=>setIsGuideOpen(false)} className="bg-[#111f42] text-white px-8 py-2 rounded-xl font-bold uppercase shadow-md transition-all">Close Guide</button></div>
            </div>
        </>
    );
};

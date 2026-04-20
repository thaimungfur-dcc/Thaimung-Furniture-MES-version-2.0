import React from 'react';
import { HelpCircle, X } from 'lucide-react';

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
                    <div className="flex items-center gap-2"><HelpCircle size={20} className="text-[#ab8a3b]" /><h2 className="text-base font-semibold uppercase tracking-widest">ITEM CODE User Guide</h2></div>
                    <button onClick={() => setIsGuideOpen(false)} className="hover:bg-white/20 p-1.5 rounded-lg transition-colors"><X size={20} /></button>
                </div>
                <div className="flex-1 overflow-y-auto p-8 text-slate-700 space-y-8 text-[13px] leading-relaxed font-sans">
                    <section>
                        <h4 className="font-black border-b pb-1 text-[#111f42] uppercase flex items-center gap-2 mb-3">1. ทะเบียนรหัสสินค้า (Item Code)</h4>
                        <p>หน้าจอนี้ใช้สำหรับลงทะเบียนรายละเอียดเชิงลึกของ <b>สินค้าสำเร็จรูป (FG)</b> และ <b>วัตถุดิบ (RM)</b></p>
                    </section>
                    <section>
                        <h4 className="font-black border-b pb-1 text-[#111f42] uppercase flex items-center gap-2 mb-3">2. การนำเข้า Excel</h4>
                        <p>ระบบรองรับไฟล์ขนาดใหญ่และมี <b>Preview Mode</b> ให้ตรวจสอบความถูกต้อง 5 แถวแรกก่อนบันทึกลงฐานข้อมูลจริง</p>
                    </section>
                </div>
                <div className="p-4 border-t flex justify-end bg-slate-50"><button onClick={()=>setIsGuideOpen(false)} className="bg-[#111f42] text-white px-8 py-2.5 rounded-none font-bold text-[12px] uppercase tracking-wider shadow-md hover:bg-[#1e346b] transition-colors">ปิดคู่มือ</button></div>
            </div>
        </>
    );
}

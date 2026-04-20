import React from 'react';
import { HelpCircle, X, Search, LayoutDashboard, Printer } from 'lucide-react';

export default function GuideDrawer({ isGuideOpen, setIsGuideOpen }: any) {
    if (!isGuideOpen) return null;

    return (
        <>
            <div className="fixed inset-0 bg-[#111f42]/40 backdrop-blur-sm z-[100] no-print animate-in fade-in duration-200" onClick={() => setIsGuideOpen(false)} />
            <div className="fixed inset-y-0 right-0 w-full md:w-[450px] bg-white shadow-2xl z-[110] flex flex-col animate-in slide-in-from-right duration-300 no-print text-[12px]">
                <div className="px-6 py-5 flex justify-between items-center bg-[#111f42] text-white shrink-0 border-b-4 border-[#ab8a3b]">
                    <div className="flex items-center gap-2"><HelpCircle size={20} className="text-[#ab8a3b]" /><h2 className="text-base font-semibold uppercase tracking-widest font-mono">Stock Card Guide</h2></div>
                    <button onClick={() => setIsGuideOpen(false)} className="hover:bg-white/20 p-1 rounded-lg transition-colors"><X size={20} /></button>
                </div>
                <div className="flex-1 overflow-y-auto p-8 text-slate-700 space-y-8 leading-relaxed font-sans">
                    <section>
                        <h4 className="font-black border-b pb-1 text-[#111f42] uppercase flex items-center gap-2 mb-3"><Search size={16} className="text-[#ab8a3b]"/> 1. การตรวจสอบสถานะสินค้า</h4>
                        <p>เลือกสินค้าที่ต้องการตรวจสอบจากช่องค้นหา (SKU/Name) ระบบจะดึงข้อมูลความเคลื่อนไหวทั้งหมด เช่น วันที่รับเข้า, เอกสารอ้างอิง และยอดคงเหลือปัจจุบัน (Stock Balance)</p>
                    </section>
                    <section>
                        <h4 className="font-black border-b pb-1 text-[#111f42] uppercase flex items-center gap-2 mb-3"><LayoutDashboard size={16} className="text-[#ab8a3b]"/> 2. การวิเคราะห์แนวโน้ม</h4>
                        <p>ใช้หน้า Dashboard เพื่อดูปริมาณการเคลื่อนไหวรายเดือน (Stock Movement Trend) และจัดอันดับสินค้าที่มีความถี่ในการรับ-จ่ายสูงสุด (Active Items)</p>
                    </section>
                    <section>
                        <h4 className="font-black border-b pb-1 text-[#111f42] uppercase flex items-center gap-2 mb-3"><Printer size={16} className="text-[#ab8a3b]"/> 3. การพิมพ์รายงาน</h4>
                        <p>คุณสามารถสั่งพิมพ์รายงานประวัติสินค้า (Export Ledger) เพื่อใช้สำหรับการตรวจนับสต็อก (Stock Count) หรือแนบประกอบเอกสารบัญชีได้ทันที</p>
                    </section>
                </div>
                <div className="p-4 border-t flex justify-end bg-slate-50 text-[10px]"><button onClick={()=>setIsGuideOpen(false)} className="bg-[#111f42] text-white px-8 py-2.5 rounded-none font-bold text-[12px] uppercase tracking-wider shadow-md hover:bg-[#1e346b] transition-colors font-mono text-[11px]">เข้าใจแล้ว</button></div>
            </div>
        </>
    );
}

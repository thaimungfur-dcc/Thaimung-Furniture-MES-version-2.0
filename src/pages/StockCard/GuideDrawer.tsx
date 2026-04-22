import React from 'react';
import { HelpCircle, X, Search, LayoutDashboard, Printer } from 'lucide-react';

export default function GuideDrawer({ isGuideOpen, setIsGuideOpen }: any) {
    if (!isGuideOpen) return null;

    return (
        <>
            <div className="fixed inset-0 bg-[#111f42]/40 backdrop-blur-sm z-[100] no-print animate-in fade-in duration-200" onClick={() => setIsGuideOpen(false)} />
            <div className="fixed inset-y-0 right-0 w-full md:w-[450px] bg-white shadow-2xl z-[110] flex flex-col animate-in slide-in-from-right duration-300 no-print text-[12px]">
                <div className="px-6 py-6 flex justify-between items-center bg-[#111f42] text-white shrink-0 border-b-8 border-[#ab8a3b]">
                    <div className="flex items-center gap-4">
                        <HelpCircle size={24} className="text-[#ab8a3b]" />
                        <h2 className="text-xl font-black uppercase tracking-[0.2em] font-mono leading-none">STOCK CARD GUIDE</h2>
                    </div>
                    <button onClick={() => setIsGuideOpen(false)} className="hover:bg-white/20 p-2 rounded-none transition-colors border border-white/10"><X size={20} /></button>
                </div>
                <div className="flex-1 overflow-y-auto p-10 text-slate-700 space-y-12 leading-relaxed bg-[#f8fafc]">
                    <section>
                        <h4 className="font-black border-b-2 border-slate-200 pb-2 text-[#111f42] uppercase flex items-center gap-3 mb-5 tracking-[0.1em] text-[13px]"><Search size={18} className="text-[#ab8a3b]"/> 1. Product Ledger Lookup</h4>
                        <p className="text-[12px] font-black uppercase tracking-widest opacity-60">เลือกสินค้าจากช่องค้นหา ระบบจะแสดงประวัติเข้า-ออกพร้อมยอดคงเหลือแบบเรียลไทม์</p>
                    </section>
                    <section>
                        <h4 className="font-black border-b-2 border-slate-200 pb-2 text-[#111f42] uppercase flex items-center gap-3 mb-5 tracking-[0.1em] text-[13px]"><LayoutDashboard size={18} className="text-[#ab8a3b]"/> 2. Inventory Analytics</h4>
                        <p className="text-[12px] font-black uppercase tracking-widest opacity-60">ใช้หน้า Dashboard วิเคราะห์ความถี่ในการหมุนเวียนสินค้าและปริมาณการรับ-จ่ายรายเดือน</p>
                    </section>
                    <section>
                        <h4 className="font-black border-b-2 border-slate-200 pb-2 text-[#111f42] uppercase flex items-center gap-3 mb-5 tracking-[0.1em] text-[13px]"><Printer size={18} className="text-[#ab8a3b]"/> 3. Export & Reporting</h4>
                        <p className="text-[12px] font-black uppercase tracking-widest opacity-60">สามารถสั่งพิมพ์ข้อมูล Ledger เฉพาะ Lot หรือทั้งหมด เพื่อใช้ในการกระทบยอดสต็อก</p>
                    </section>
                </div>
                <div className="p-8 border-t bg-white flex justify-end shrink-0">
                    <button onClick={()=>setIsGuideOpen(false)} className="bg-[#111f42] text-[#ab8a3b] px-12 py-4 rounded-none font-black text-[12px] uppercase tracking-[0.3em] shadow-2xl hover:bg-[#0a1229] transition-all font-mono">DISMISS GUIDE</button>
                </div>
            </div>
        </>
    );
}

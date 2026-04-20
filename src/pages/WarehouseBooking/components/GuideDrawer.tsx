import React from 'react';
import { HelpCircle, X } from 'lucide-react';

interface GuideDrawerProps {
    isOpen: boolean;
    closeDrawer: () => void;
}

export default function GuideDrawer({ isOpen, closeDrawer }: GuideDrawerProps) {
    if (!isOpen) return null;

    return (
        <>
            <div className="fixed inset-0 bg-[#111f42]/40 backdrop-blur-sm z-[70000] no-print animate-in fade-in" onClick={closeDrawer} />
            <div className="fixed inset-y-0 right-0 w-full md:w-[450px] bg-white shadow-2xl z-[71000] flex flex-col animate-in slide-in-from-right duration-300 no-print font-sans">
                <div className="px-6 py-5 flex justify-between items-center bg-[#111f42] text-white shrink-0 border-b-4 border-[#ab8a3b]">
                    <div className="flex items-center gap-2 font-sans">
                        <HelpCircle size={20} className="text-[#ab8a3b]" />
                        <h2 className="text-base font-semibold uppercase tracking-widest font-mono">Booking Guide</h2>
                    </div>
                    <button onClick={closeDrawer} className="hover:bg-white/20 p-1.5 rounded-lg transition-colors leading-none"><X size={20} /></button>
                </div>
                <div className="flex-1 overflow-y-auto p-8 text-slate-700 space-y-8 leading-relaxed text-[12px] font-sans">
                    <section>
                        <h4 className="font-black border-b pb-1 text-[#111f42] uppercase flex items-center gap-2 mb-3">1. การจัดสรรสินค้า (Allocate)</h4>
                        <p>ป้อนจำนวนสินค้าที่ต้องการล็อคสต็อกไว้สำหรับใบสั่งขาย โดยระบบจะคำนวณยอดคงเหลือให้แบบ Real-time</p>
                    </section>
                    <section>
                        <h4 className="font-black border-b pb-1 text-[#111f42] uppercase flex items-center gap-2 mb-3">2. การพิมพ์ป้ายจอง (TAG)</h4>
                        <p>กดปุ่มไอคอน **Tag** เพื่อสร้างบาร์โค้ดและ QR Code สำหรับพิมพ์ไปแปะไว้ที่พาเลทหรือชั้นวางสินค้า</p>
                    </section>
                    <section>
                        <h4 className="font-black border-b pb-1 text-[#111f42] uppercase flex items-center gap-2 mb-3">3. การพิมพ์รายงาน (Report)</h4>
                        <p>เลือกช่วงวันที่ที่ต้องการและกด **Generate** เพื่อสรุปยอดการจองสินค้าทั้งหมดในช่วงเวลานั้นๆ ออกเป็น PDF</p>
                    </section>
                </div>
                <div className="p-4 border-t flex justify-end bg-slate-50 font-sans">
                    <button onClick={closeDrawer} className="bg-[#111f42] text-white px-8 py-2.5 rounded-none font-bold text-[12px] uppercase tracking-wider shadow-md hover:bg-[#1e346b] transition-colors leading-none font-mono">เข้าใจแล้ว</button>
                </div>
            </div>
        </>
    );
}

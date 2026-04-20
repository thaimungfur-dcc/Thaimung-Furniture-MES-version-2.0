import React from 'react';
import { HelpCircle, X } from 'lucide-react';

export default function GuideDrawer({ isGuideOpen, setIsGuideOpen }: any) {
    if (!isGuideOpen) return null;

    return (
        <>
            <div className="fixed inset-0 bg-[#111f42]/40 backdrop-blur-sm z-[100] animate-in fade-in duration-200 no-print" onClick={() => setIsGuideOpen(false)} />
            <div className="fixed inset-y-0 right-0 w-full md:w-[450px] bg-white shadow-2xl z-[110] flex flex-col animate-in slide-in-from-right duration-300 no-print">
                <div className="px-6 py-5 flex justify-between items-center bg-[#111f42] text-white shrink-0 border-b-4 border-[#ab8a3b]">
                    <div className="flex items-center gap-2"><HelpCircle size={20} className="text-[#ab8a3b]" /><h2 className="text-base font-semibold uppercase tracking-widest font-mono text-[12px]">Inventory Guide</h2></div>
                    <button onClick={() => setIsGuideOpen(false)} className="hover:bg-white/20 p-1.5 rounded-lg transition-colors"><X size={20} /></button>
                </div>
                <div className="flex-1 overflow-y-auto p-8 text-slate-700 space-y-8 leading-relaxed font-sans text-[11px]">
                    <section>
                        <h4 className="font-black border-b pb-1 text-[#111f42] uppercase flex items-center gap-2 mb-3">1. การบริหารสต็อกและแผนงาน</h4>
                        <p>ตรวจสอบยอดคงเหลือและยอดพร้อมขาย พร้อมวิเคราะห์แผนงานรับเข้า-จ่ายออกในอนาคต</p>
                    </section>
                    <section>
                        <h4 className="font-black border-b pb-1 text-[#111f42] uppercase flex items-center gap-2 mb-3">2. สีคอลัมน์ไฮไลท์</h4>
                        <ul className="list-disc pl-5 mt-2 space-y-2 font-medium">
                            <li><b className="text-[#2e4756]">Available (#2e4756):</b> ยอดที่พร้อมใช้จริง (Semi-Bold)</li>
                            <li><b className="text-[#10b981]">Plan In (#10b981):</b> แผนการรับเข้าคลัง (สีเขียว)</li>
                            <li><b className="text-[#d99036]">Plan Out (#d99036):</b> แผนการเบิกออก (สีส้ม)</li>
                        </ul>
                    </section>
                </div>
                <div className="p-4 border-t flex justify-end bg-slate-50 text-[10px] font-mono"><button onClick={()=>setIsGuideOpen(false)} className="bg-[#111f42] text-white px-8 py-2 rounded-xl font-bold uppercase shadow-md transition-all">Close Guide</button></div>
            </div>
        </>
    );
}

import React from 'react';
import { X, HelpCircle } from 'lucide-react';

interface GuideDrawerProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function GuideDrawer({ isOpen, onClose }: GuideDrawerProps) {
    if (!isOpen) return null;

    return (
        <>
            <div 
                className="fixed inset-0 bg-[#111f42]/40 backdrop-blur-sm z-[100] animate-in fade-in duration-200" 
                onClick={onClose} 
            />
            <div className="fixed inset-y-0 right-0 w-full md:w-[400px] bg-white shadow-2xl z-[110] flex flex-col animate-in slide-in-from-right duration-300 no-print">
                <div className="px-6 py-4 flex justify-between items-center bg-[#111f42] text-white shrink-0 border-b-4 border-[#ab8a3b]">
                    <div className="flex items-center gap-2">
                        <HelpCircle size={18} className="text-[#ab8a3b]" />
                        <h2 className="text-sm font-semibold uppercase tracking-widest">QC MASTER GUIDE</h2>
                    </div>
                    <button onClick={onClose} className="hover:bg-white/20 p-1 rounded-lg transition-colors">
                        <X size={18} />
                    </button>
                </div>
                <div className="flex-1 overflow-y-auto p-6 text-slate-700 space-y-6 text-[12px] leading-relaxed">
                    <section>
                        <h4 className="font-black border-b pb-1 text-[#111f42] uppercase flex items-center gap-2 mb-2">1. การเข้าถึงมาตรฐาน</h4>
                        <p>เลือกหมวดหมู่เพื่อดูรายการสินค้า และกดเลือกสินค้าเพื่อดูรายละเอียดจุดตรวจสอบ</p>
                    </section>
                    <section>
                        <h4 className="font-black border-b pb-1 text-[#111f42] uppercase flex items-center gap-2 mb-2">2. การตั้งค่าจุดตรวจ</h4>
                        <p>ในแต่ละขั้นตอน คุณสามารถระบุเกณฑ์ Acceptance Criteria และค่า Tolerance พร้อมภาพอ้างอิง</p>
                    </section>
                </div>
                <div className="p-4 border-t flex justify-end bg-slate-50">
                    <button 
                        onClick={onClose} 
                        className="bg-[#111f42] text-white px-8 py-2 rounded-lg font-bold text-[11px] uppercase tracking-wider shadow-md hover:bg-[#1e346b] transition-colors"
                    >
                        เข้าใจแล้ว
                    </button>
                </div>
            </div>
        </>
    );
}

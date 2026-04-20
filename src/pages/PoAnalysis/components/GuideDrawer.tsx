import React from 'react';
import { HelpCircle, X, LayoutDashboard, ArrowUpRight, AlertCircle } from 'lucide-react';

interface GuideDrawerProps {
  onClose: () => void;
}

export default function GuideDrawer({ onClose }: GuideDrawerProps) {
  return (
    <>
      <div className="fixed inset-0 bg-[#111f42]/40 backdrop-blur-sm z-[60] animate-in fade-in duration-200" onClick={onClose} />
      <div className="fixed inset-y-0 right-0 w-full md:w-[450px] bg-white shadow-2xl z-[70] flex flex-col animate-in slide-in-from-right duration-300">
        <div className="px-6 py-5 flex justify-between items-center bg-[#111f42] text-white shrink-0 border-b-4 border-[#E3624A]">
          <h2 className="text-base font-semibold uppercase tracking-widest flex items-center gap-2">
            <HelpCircle size={20} className="text-[#E3624A]" /> คู่มือการใช้งาน PO Analysis
          </h2>
          <button onClick={onClose} className="hover:bg-white/20 p-1.5 rounded-lg transition-colors">
            <X size={20} />
          </button>
        </div>
        
        <div className="flex-1 overflow-y-auto p-6 md:p-8 bg-slate-50 text-[13px] text-slate-700 space-y-8 custom-scrollbar">
          <div>
            <h3 className="text-sm font-bold text-[#111f42] border-b-2 border-slate-200 pb-2 mb-3 flex items-center gap-2"><LayoutDashboard size={16}/> 1. วัตถุประสงค์ (Purpose)</h3>
            <p className="leading-relaxed text-slate-600 text-justify">หน้าจอนี้ใช้สำหรับวิเคราะห์ประสิทธิภาพการจัดซื้อ ยอดการใช้จ่าย และประสิทธิภาพของซัพพลายเออร์ เพื่อใช้ประกอบการวางแผนบริหารงบประมาณ</p>
          </div>

          <div>
            <h3 className="text-sm font-bold text-[#111f42] border-b-2 border-slate-200 pb-2 mb-3 flex items-center gap-2"><ArrowUpRight size={16}/> 2. ตัวชี้วัดสำคัญ (Key Metrics)</h3>
            <ul className="space-y-3">
              <li><strong>Total Orders:</strong> จำนวนใบสั่งซื้อทั้งหมดในช่วงเวลาที่เลือก</li>
              <li><strong>Pending Delivery:</strong> จำนวนรายการที่ยังไม่ได้รับสินค้า ช่วยเร่งรัดติดตามของ</li>
              <li><strong>On-Time Rate:</strong> เปอร์เซ็นต์ที่คู่ค้าส่งของตรงเวลา สะท้อนความน่าเชื่อถือ</li>
            </ul>
          </div>

          <div className="bg-blue-50 p-4 rounded-2xl border border-blue-100">
            <div className="flex items-center gap-2 text-blue-700 font-bold mb-1">
              <AlertCircle size={16}/> ข้อมูลคู่ค้า (Vendors)
            </div>
            <p className="text-[12px] text-blue-800 leading-relaxed italic">กราฟแท่งแสดงยอดสั่งซื้อสะสมแยกตามรายชื่อบริษัท ช่วยให้ฝ่ายจัดซื้อเจรจาต่อรองส่วนลดได้ง่ายขึ้นเมื่อเห็นยอดซื้อรวม</p>
          </div>
        </div>

        <div className="p-4 bg-white border-t border-slate-100 flex justify-end shrink-0">
          <button onClick={onClose} className="px-6 py-2.5 rounded-lg font-semibold bg-[#111f42] text-white hover:opacity-90 transition-all uppercase tracking-wider text-[11px]">
            เข้าใจแล้ว (Close)
          </button>
        </div>
      </div>
    </>
  );
}

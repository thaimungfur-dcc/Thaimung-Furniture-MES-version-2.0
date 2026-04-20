import React from 'react';
import { X, Printer } from 'lucide-react';

interface NcPreviewModalProps {
  previewModal: string | null;
  setPreviewModal: (mode: string | null) => void;
  selectedItem: any;
  formatDateYMD: (date: string) => string;
}

const NcPreviewModal: React.FC<NcPreviewModalProps> = ({
  previewModal,
  setPreviewModal,
  selectedItem,
  formatDateYMD
}) => {
  if (previewModal !== 'print' || !selectedItem) return null;

  return (
    <div className="fixed inset-0 bg-[#111f42]/60 backdrop-blur-sm z-[80] flex items-center justify-center p-4 no-print animate-in zoom-in duration-200">
      <div className="bg-white rounded-2xl w-full max-w-4xl shadow-2xl overflow-hidden flex flex-col max-h-[95vh]">
        <div className="px-6 py-4 flex justify-between items-center bg-[#2C3F70] border-b-4 border-[#E3624A] text-white shrink-0">
          <h2 className="text-lg font-semibold uppercase tracking-widest flex items-center gap-2">
            <Printer size={20} /> Preview SCAR Report
          </h2>
          <button onClick={() => setPreviewModal(null)} className="hover:bg-white/10 p-1 rounded-lg transition-colors">
            <X size={24} />
          </button>
        </div>
        
        <div className="flex-1 overflow-y-auto p-4 bg-slate-200 flex justify-center print:p-0 print:bg-white custom-scrollbar">
          <div className="bg-white p-10 shadow-md w-full max-w-[794px] min-h-[1123px] h-max flex flex-col print:shadow-none">
            {/* Header Section */}
            <div className="flex justify-between items-start border-b-2 border-[#111f42] pb-2 mb-4 text-[#111f42] relative">
              <div className="whitespace-nowrap flex flex-col justify-start">
                <h2 className="text-[15px] font-black tracking-tight text-[#111f42] leading-none mb-1">บริษัท ไทยมั่งเฟอร์นิเจอร์ จํากัด</h2>
                <p className="text-[11px] font-semibold text-[#111f42] leading-none mb-1">Thaimung Furniture Co., Ltd.</p>
                <p className="text-[9px] font-bold text-[#111f42] leading-none uppercase">TAX ID : 0105546077645</p>
              </div>
              <div className="text-right text-[9px] font-medium leading-tight text-[#111f42] whitespace-nowrap flex flex-col justify-start">
                <p>สำนักงานใหญ่ : เลขที่ 22/88 หมู่ที่ 3 ตําบลท่าเสา อําเภอกระทุ่มแบน จังหวัดสมุทรสาคร 74110</p>
                <p>Head Office : 22/88 Moo 3, Tha Sao, Krathum Baen, Samut Sakhon 74110</p>
                <div className="flex justify-end gap-3 mt-0.5">
                  <p>TEL. 082-569-5654, 091-516-5999</p>
                  <p>E-mail : thaimungfurniture.dcc@gmail.com</p>
                </div>
              </div>
            </div>

            {/* Title Section */}
            <div className="flex justify-between items-end mb-4">
              <div>
                <p className="text-[10px] font-bold text-[#111f42] uppercase tracking-widest">PURCHASING DEPARTMENT</p>
                <p className="text-[9px] text-slate-500 font-mono mt-0.5 whitespace-nowrap">FM-PU01-XX, Rev. 00 (2026-Mar-15)</p>
              </div>
              <div className="text-center px-4">
                <h3 className="text-2xl font-black text-[#E3624A] uppercase tracking-widest whitespace-nowrap">SCAR REPORT</h3>
                <p className="text-[11px] font-bold mt-0.5 text-[#111f42]">ใบแจ้งให้แก้ไขข้อบกพร่อง</p>
              </div>
              <div className="flex justify-end text-[10px] font-mono flex flex-col items-end gap-1">
                <div className="flex gap-3">
                  <span className="font-bold text-slate-500 w-16 text-right">SCAR NO:</span> 
                  <span className="font-black text-[#111f42] w-24 text-left">{selectedItem.id}</span>
                </div>
                <div className="flex gap-3">
                  <span className="font-bold text-slate-500 w-16 text-right">DATE:</span> 
                  <span className="font-bold text-[#111f42] w-24 text-left">{formatDateYMD(selectedItem.date)}</span>
                </div>
              </div>
            </div>
            
            {/* Info Section */}
            <div className="grid grid-cols-[1.5fr_1fr] gap-3 mb-4">
              <div className="border border-slate-200 p-4 rounded-lg bg-slate-50/50 flex flex-col justify-center min-h-[100px]">
                <p className="font-bold border-b border-slate-200 mb-2 pb-1 uppercase text-[#111f42] text-[9px] tracking-widest">Vendor Information</p>
                <p className="font-black text-[13px] uppercase text-[#111f42]">{selectedItem.vendor}</p>
                <p className="text-slate-600 text-[10px] leading-relaxed mt-1"><b>Material:</b> {selectedItem.item}</p>
              </div>
              <div className="border border-slate-200 p-4 rounded-lg bg-slate-50/50 flex justify-between items-center min-h-[100px]">
                <div className="flex flex-col justify-center gap-1">
                  <p className="font-bold border-b border-slate-200 mb-2 pb-1 uppercase text-[#111f42] text-[9px] tracking-widest">Assessment Details</p>
                  <p className="text-[11px]"><b>Severity:</b> <span className="font-bold text-rose-600 uppercase">{selectedItem.severity}</span></p>
                  <p className="text-[11px]"><b>Status:</b> {selectedItem.status}</p>
                </div>
                <div className="flex flex-col items-center pl-4 border-l border-slate-200 ml-2">
                  <img 
                    src={`https://api.qrserver.com/v1/create-qr-code/?size=100x100&data=${encodeURIComponent(`https://scar.tallintelligence.com/${selectedItem.id}`)}`} 
                    className="w-16 h-16 mix-blend-multiply" 
                    alt="QR" 
                  />
                  <span className="text-[7px] font-bold text-slate-400 mt-1 uppercase">Scan to Respond</span>
                </div>
              </div>
            </div>

            {/* Content Section */}
            <div className="space-y-3 flex-1">
              <div className="border border-slate-200 rounded-lg p-3 bg-white">
                <h4 className="font-bold text-[#b22026] border-b mb-1 pb-1 uppercase text-[10px]">1. Non-Conformance Description</h4>
                <p className="text-[10px] leading-relaxed text-slate-700 whitespace-pre-wrap">{selectedItem.problem}</p>
              </div>
              <div className="border border-slate-200 rounded-lg p-3 bg-slate-50/20">
                <h4 className="font-bold text-amber-600 border-b mb-1 pb-1 uppercase text-[10px]">2. Supplier Response (Root Cause & Action)</h4>
                <div className="grid grid-cols-1 gap-1 text-[10px]">
                  <p><b>Root Cause:</b> {selectedItem.vendorResponse?.rootCause || '-'}</p>
                  <p><b>Action:</b> {selectedItem.vendorResponse?.corrective || '-'}</p>
                  <p><b>Preventive:</b> {selectedItem.vendorResponse?.preventive || '-'}</p>
                </div>
              </div>
              <div className="border border-slate-200 rounded-lg p-3 bg-white">
                <h4 className="font-bold text-blue-600 border-b mb-1 pb-1 uppercase text-[10px]">3. Internal Follow Up Results</h4>
                <p className="text-[10px] text-slate-700">{selectedItem.followUp?.results || 'Pending internal follow up.'}</p>
              </div>
            </div>

            {/* Footer Signatures */}
            <div className="grid grid-cols-3 gap-6 mt-auto py-8 text-center text-[9px] break-inside-avoid">
              <div className="border border-slate-200 p-3 rounded-lg flex flex-col h-28">
                <p className="font-bold border-b pb-1 uppercase">Issued By</p>
                <div className="flex-1 border-b border-dashed mb-1"></div>
                <p className="font-bold">{selectedItem.requester}</p>
              </div>
              <div className="border border-slate-200 p-3 rounded-lg flex flex-col h-28">
                <p className="font-bold border-b pb-1 uppercase">Vendor Accepted</p>
                <div className="flex-1 border-b border-dashed mb-1"></div>
                <p className="font-bold">{selectedItem.vendorResponse?.responder || '-'}</p>
              </div>
              <div className="border border-slate-200 p-3 rounded-lg flex flex-col h-28">
                <p className="font-bold border-b pb-1 uppercase">Followed Up By</p>
                <div className="flex-1 border-b border-dashed mb-1"></div>
                <p className="font-bold">{selectedItem.followUp?.checker || '-'}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="p-4 bg-white border-t flex justify-end gap-3 shrink-0 no-print">
          <button 
            onClick={() => setPreviewModal(null)} 
            className="px-6 py-2 border rounded-lg font-bold text-[12px] uppercase text-slate-500 hover:bg-slate-50 transition-colors"
          >
            Cancel
          </button>
          <button 
            onClick={() => window.print()} 
            className="px-8 py-2 bg-[#ab8a3b] text-white rounded-lg font-bold text-[12px] shadow-md uppercase flex items-center gap-2 hover:opacity-90 transition-all"
          >
            <Printer size={16} /> Print Report
          </button>
        </div>
      </div>
    </div>
  );
};

export default NcPreviewModal;

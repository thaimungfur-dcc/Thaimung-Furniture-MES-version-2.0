import React, { useState, useRef } from 'react';
import { UploadCloud, AlertCircle, CheckCircle, FileText, X } from 'lucide-react';
import { DraggableModal } from './DraggableModal';
import { parseCSV } from '../../utils/csvUtils';

interface CsvUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  expectedHeaders: string[];
  onConfirm: (data: any[]) => void;
  instructions?: string;
}

export const CsvUploadModal: React.FC<CsvUploadModalProps> = ({
  isOpen, onClose, title = "Bulk CSV Upload", expectedHeaders, onConfirm, instructions
}) => {
  const [data, setData] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.name.endsWith('.csv')) {
      setError("กรุณาอัปโหลดไฟล์นามสกุล .csv เท่านั้น");
      return;
    }

    parseCSV(file, (parsedData) => {
      // Validate Headers
      if (parsedData.length > 0) {
        const fileHeaders = Object.keys(parsedData[0]);
        const missingHeaders = expectedHeaders.filter(h => !fileHeaders.includes(h));
        
        if (missingHeaders.length > 0) {
          setError(`ไฟล์ CSV ขาดคอลัมน์ที่จำเป็น: ${missingHeaders.join(', ')}`);
          setData([]);
          return;
        }
      }

      setError(null);
      setData(parsedData);
    });
  };

  const handleConfirm = () => {
    if (data.length > 0) {
      onConfirm(data);
    }
  };

  const reset = () => {
    setData([]);
    setError(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <DraggableModal isOpen={isOpen} onClose={() => { reset(); onClose(); }} title={title} width="max-w-4xl">
      <div className="space-y-6">
        
        {/* Instructions */}
        <div className="bg-blue-50 border border-blue-200 text-blue-800 p-4 rounded-xl text-sm">
          <div className="font-bold mb-1 flex items-center gap-2">
            <AlertCircle size={16} /> คำแนะนำในการเตรียมไฟล์ CSV:
          </div>
          <div className="ml-6 space-y-1">
            <p>{instructions || "อัปโหลดไฟล์ข้อมูลทีละหลายรายการเพื่อความรวดเร็ว"}</p>
            <p className="font-bold mt-2">✨ หัวคอลัมน์ (Row 1) ต้องสะกดตามนี้ทุกตัวอักษร:</p>
            <div className="flex flex-wrap gap-2 mt-2">
              {expectedHeaders.map(h => (
                 <span key={h} className="bg-blue-200/50 px-2 py-1 rounded text-xs font-mono font-bold tracking-tight text-blue-900 border border-blue-300">
                   {h}
                 </span>
              ))}
            </div>
          </div>
        </div>

        {/* Upload Area */}
        {!data.length && (
          <div 
             className="border-2 border-dashed border-slate-300 bg-white rounded-xl p-10 flex flex-col items-center justify-center text-center cursor-pointer hover:border-blue-500 hover:bg-blue-50 transition-all"
             onClick={() => fileInputRef.current?.click()}
          >
            <UploadCloud size={48} className="text-slate-400 mb-4" />
            <h4 className="font-bold text-slate-700">คลิกเพื่อเลือกไฟล์ .csv</h4>
            <p className="text-xs text-slate-500 mt-1">หรือลากไฟล์มาวางในพื้นที่นี้</p>
            <input 
              type="file" 
              accept=".csv" 
              className="hidden" 
              ref={fileInputRef}
              onChange={handleFileUpload}
            />
          </div>
        )}

        {error && (
          <div className="p-4 bg-red-50 text-red-600 rounded-lg border border-red-200 flex items-start gap-2 text-sm">
            <X size={18} className="shrink-0 mt-0.5" />
            <div>
              <div className="font-bold">เกิดข้อผิดพลาด</div>
              <div>{error}</div>
            </div>
          </div>
        )}

        {/* Data Preview */}
        {data.length > 0 && (
          <div className="space-y-4">
             <div className="flex justify-between items-center bg-green-50 text-green-700 p-3 rounded-lg border border-green-200">
               <div className="flex items-center gap-2">
                 <CheckCircle size={18} />
                 <span className="font-bold text-sm">อ่านไฟล์สำเร็จ พบข้อมูลจำนวน {data.length.toLocaleString()} รายการ</span>
               </div>
               <button onClick={reset} className="text-xs underline hover:text-green-900">เปลี่ยนไฟล์</button>
             </div>

             <div className="border rounded-xl bg-white overflow-hidden">
                <div className="bg-slate-100 px-4 py-2 text-xs font-bold text-slate-500 uppercase border-b">
                  ตัวอย่างข้อมูล 5 รายการแรก (Preview)
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm">
                    <thead className="bg-slate-50 border-b">
                      <tr>
                        {expectedHeaders.map(h => (
                          <th key={h} className="p-3 font-semibold text-slate-600 whitespace-nowrap">{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y">
                      {data.slice(0, 5).map((row, i) => (
                        <tr key={i} className="hover:bg-slate-50">
                          {expectedHeaders.map(h => (
                            <td key={h} className="p-3 text-slate-600 whitespace-nowrap">{row[h] || '-'}</td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                {data.length > 5 && (
                   <div className="p-3 text-center text-xs text-slate-500 bg-slate-50 border-t">
                     ... และอีก {(data.length - 5).toLocaleString()} รายการ
                   </div>
                )}
             </div>

             <div className="flex justify-end gap-3 pt-4 border-t">
               <button onClick={() => { reset(); onClose(); }} className="px-5 py-2 rounded-lg font-bold text-sm text-slate-600 hover:bg-slate-100 transition-colors border">
                 ยกเลิก
               </button>
               <button onClick={handleConfirm} className="px-6 py-2 rounded-lg font-bold text-sm text-white bg-[#111f42] hover:opacity-90 shadow-lg transition-transform hover:scale-105">
                 ยืนยันการนำเข้าข้อมูล
               </button>
             </div>
          </div>
        )}
      </div>
    </DraggableModal>
  );
};

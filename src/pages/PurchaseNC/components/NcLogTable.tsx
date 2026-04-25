import React from 'react';
import { Eye, Pencil, Printer } from 'lucide-react';

interface ScarItem {
  id: string;
  date: string;
  vendor: string;
  severity: string;
  status: string;
}

interface NcLogTableProps {
  logTableData: ScarItem[];
  openModal: (mode: string, data: ScarItem) => void;
  setSelectedItem: (item: ScarItem) => void;
  setPreviewModal: (mode: string) => void;
  getSeverityClass: (severity: string) => string;
  getStatusClass: (status: string) => string;
  formatDate: (date: string) => string;
}

const NcLogTable: React.FC<NcLogTableProps> = ({
  logTableData,
  openModal,
  setSelectedItem,
  setPreviewModal,
  getSeverityClass,
  getStatusClass,
  formatDate
}) => {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left border-collapse">
        <thead className="bg-[#2C3F70] text-white sticky top-0 z-10">
          <tr className="border-b-4 border-[#E3624A]">
            <th className="px-6 py-4 text-[10px] font-semibold uppercase tracking-widest whitespace-nowrap">SCAR NO.</th>
            <th className="px-6 py-4 text-[10px] font-semibold uppercase tracking-widest whitespace-nowrap">DATE</th>
            <th className="px-6 py-4 text-[10px] font-semibold uppercase tracking-widest whitespace-nowrap">VENDOR</th>
            <th className="px-6 py-4 text-[10px] font-semibold uppercase tracking-widest text-center whitespace-nowrap">SEVERITY</th>
            <th className="px-6 py-4 text-[10px] font-semibold uppercase tracking-widest text-center whitespace-nowrap">STATUS</th>
            <th className="px-6 py-4 text-[10px] font-semibold uppercase tracking-widest text-center whitespace-nowrap">ACTION</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100 text-[11px]">
          {logTableData.length > 0 ? logTableData?.map(scar => (
            <tr key={scar.id} className="hover:bg-slate-50 transition-colors">
              <td className="px-6 py-4 font-bold text-rose-600 whitespace-nowrap">{scar.id}</td>
              <td className="px-6 py-4 text-slate-500 font-mono whitespace-nowrap">{formatDate(scar.date)}</td>
              <td className="px-6 py-4 font-bold text-[#111f42] uppercase whitespace-nowrap">{scar.vendor}</td>
              <td className="px-6 py-4 text-center">
                <span className={`px-2.5 py-1 rounded text-[9px] font-bold uppercase shadow-sm whitespace-nowrap ${getSeverityClass(scar.severity)}`}>
                  {scar.severity}
                </span>
              </td>
              <td className="px-6 py-4 text-center">
                <span className={`px-3 py-1.5 rounded-md border font-bold text-[9px] uppercase whitespace-nowrap ${getStatusClass(scar.status)}`}>
                  {scar.status}
                </span>
              </td>
              <td className="px-6 py-4 text-center">
                <div className="flex justify-center gap-1.5">
                  <button 
                    onClick={() => openModal('view', scar)} 
                    className="p-1.5 text-[#3d97bd] hover:bg-[#3d97bd]/10 rounded transition-colors"
                  >
                    <Eye size={16} />
                  </button>
                  <button 
                    onClick={() => openModal('edit', scar)} 
                    className="p-1.5 text-amber-600 hover:bg-amber-50 rounded transition-colors"
                  >
                    <Pencil size={16} />
                  </button>
                  <button 
                    onClick={() => { setSelectedItem(scar); setPreviewModal('print'); }} 
                    className="p-1.5 text-purple-600 hover:bg-purple-100 rounded transition-colors"
                  >
                    <Printer size={16} />
                  </button>
                </div>
              </td>
            </tr>
          )) : (
            <tr>
              <td colSpan={6} className="px-6 py-12 text-center text-slate-400 italic">No records found.</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default NcLogTable;

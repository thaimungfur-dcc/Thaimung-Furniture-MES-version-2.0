import React from 'react';
import { Eye, Pencil, Printer } from 'lucide-react';

interface PrItem {
  id: string;
  date: string;
  requester: string;
  department: string;
  items: any[];
  totalAmount: number;
  status: string;
}

interface PrTableProps {
  paginatedPRs: PrItem[];
  openModal: (mode: string, data?: any) => void;
  setSelectedPR: (pr: any) => void;
  setPreviewModal: (open: boolean) => void;
  formatDate: (date: string) => string;
  formatCurrency: (amount: number) => string;
}

const PrTable: React.FC<PrTableProps> = ({
  paginatedPRs,
  openModal,
  setSelectedPR,
  setPreviewModal,
  formatDate,
  formatCurrency
}) => {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left border-collapse whitespace-nowrap data-table">
        <thead className="bg-[#2C3F70] text-white">
          <tr className="border-b-4 border-[#E3624A]">
            <th className="px-6 py-4 font-semibold uppercase tracking-widest text-[11px]">PR NO.</th>
            <th className="px-6 py-4 font-semibold uppercase tracking-widest text-[11px]">DATE</th>
            <th className="px-6 py-4 font-semibold uppercase tracking-widest text-[11px]">REQUESTER / DEPT</th>
            <th className="px-6 py-4 font-semibold uppercase tracking-widest text-center text-[11px]">ITEMS</th>
            <th className="px-6 py-4 font-semibold text-[#FACC15] uppercase tracking-widest text-right text-[11px]">EST. TOTAL AMOUNT</th>
            <th className="px-6 py-4 font-semibold uppercase tracking-widest text-center text-[11px]">STATUS</th>
            <th className="px-6 py-4 font-semibold uppercase tracking-widest text-center w-32 text-[11px]">ACTION</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {paginatedPRs?.map(item => (
            <tr key={item.id} className="hover:bg-slate-50 transition-colors">
              <td className="px-6 py-2.5 font-mono font-bold text-[#111f42] text-[12px]">{item.id}</td>
              <td className="px-6 py-2.5 text-slate-500 font-mono text-[12px]">{formatDate(item.date)}</td>
              <td className="px-6 py-2.5">
                <div className="flex flex-col gap-0.5">
                  <span className="font-bold text-[#111f42] text-[12px]">{item.requester}</span>
                  <span className="text-slate-500 text-[10px]">{item.department}</span>
                </div>
              </td>
              <td className="px-6 py-2.5 text-center font-bold text-slate-600">{item.items.length}</td>
              <td className="px-6 py-2.5 text-right font-mono font-black text-[#E3624A] text-[13px]">
                {formatCurrency(item.totalAmount)}
              </td>
              <td className="px-6 py-2.5 text-center">
                <span className={`px-2.5 py-1 rounded-md border font-bold text-[9px] uppercase tracking-widest
                  ${item.status === 'Approved' ? 'bg-[#849a28]/10 text-[#849a28] border-[#849a28]/30' : 
                    item.status === 'Revise' ? 'bg-rose-50 text-rose-600 border-rose-200' : 
                    item.status === 'Pending Approve' ? 'bg-[#3d97bd]/10 text-[#3d97bd] border-[#3d97bd]/30' : 
                    item.status === 'Rejected' ? 'bg-slate-200 text-slate-700 border-slate-300' :
                    'bg-amber-50 text-amber-600 border-amber-200'}`
                }>
                  {item.status}
                </span>
              </td>
              <td className="px-6 py-2.5 text-center">
                <div className="flex justify-center gap-1">
                  <button onClick={() => openModal('view', item)} className="p-1.5 text-[#3d97bd] bg-[#3d97bd]/10 hover:bg-[#3d97bd]/20 rounded transition-colors" title="View"><Eye size={14}/></button>
                  <button onClick={() => openModal('edit', item)} className="p-1.5 text-amber-600 bg-amber-50 hover:bg-amber-100 rounded transition-colors" title="Edit"><Pencil size={14}/></button>
                  <button onClick={() => {setSelectedPR(item); setPreviewModal(true);}} className="p-1.5 text-[#be73bf] bg-[#be73bf]/10 hover:bg-[#be73bf]/20 rounded transition-colors" title="Print"><Printer size={14}/></button>
                </div>
              </td>
            </tr>
          ))}
          {paginatedPRs.length === 0 && (
            <tr><td colSpan={7} className="px-6 py-12 text-center text-slate-400 italic text-[12px]">No Purchase Requisitions found.</td></tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default PrTable;

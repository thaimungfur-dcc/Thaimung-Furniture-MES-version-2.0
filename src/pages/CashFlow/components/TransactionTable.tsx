import React from 'react';
import { Calendar, CheckCircle } from 'lucide-react';

interface Transaction {
  id: number;
  date: string;
  ref: string;
  description: string;
  category: string;
  type: 'In' | 'Out';
  flowType: string;
  amount: number;
  status: 'Draft' | 'Completed';
  balance?: number;
}

interface TransactionTableProps {
  data: Transaction[];
  onApprove: (item: Transaction) => void;
}

export default function TransactionTable({ data, onApprove }: TransactionTableProps) {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' });
  };

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left border-collapse">
        <thead className="bg-[#2C3F70] text-white">
          <tr className="border-b-4 border-[#E3624A]">
            <th className="px-6 py-3 text-[10px] font-semibold uppercase tracking-widest">DATE</th>
            <th className="px-6 py-3 text-[10px] font-semibold uppercase tracking-widest">REF</th>
            <th className="px-6 py-3 text-[10px] font-semibold uppercase tracking-widest">DESCRIPTION</th>
            <th className="px-6 py-3 text-[10px] font-semibold uppercase tracking-widest text-center">FLOW</th>
            <th className="px-6 py-3 text-[10px] font-semibold uppercase tracking-widest text-right">INFLOW</th>
            <th className="px-6 py-3 text-[10px] font-semibold uppercase tracking-widest text-right">OUTFLOW</th>
            <th className="px-6 py-3 text-[10px] font-semibold text-yellow-300 uppercase tracking-widest text-right">BALANCE</th>
            <th className="px-6 py-3 text-[10px] font-semibold uppercase tracking-widest text-center">STATUS</th>
            <th className="px-6 py-3 text-[10px] font-semibold uppercase tracking-widest text-center">ACTION</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-50">
          {data.length > 0 ? data.map((item) => (
            <tr key={item.id} className="transition-colors hover:bg-slate-50">
              <td className="px-6 py-2.5">
                <div className="flex items-center gap-2 text-slate-600">
                  <Calendar size={14} />
                  <span className="font-semibold text-[12px] whitespace-nowrap">{formatDate(item.date)}</span>
                </div>
              </td>
              <td className="px-6 py-2.5">
                <span className="font-bold text-[12px] text-[#ab8a3b] whitespace-nowrap">{item.ref}</span>
              </td>
              <td className="px-6 py-2.5">
                <span className="font-medium text-[12px] text-slate-700">{item.description}</span>
              </td>
              <td className="px-6 py-2.5 text-center">
                <span className="px-2 py-1 rounded text-[9px] font-bold uppercase tracking-wider bg-slate-100 text-slate-600">
                  {item.flowType}
                </span>
              </td>
              <td className="px-6 py-2.5 text-right">
                <span className="font-bold text-[12px] text-[#6b7556] whitespace-nowrap">
                  {item.type === 'In' ? `฿${item.amount?.toLocaleString()}` : '-'}
                </span>
              </td>
              <td className="px-6 py-2.5 text-right">
                <span className="font-bold text-[12px] text-[#E3624A] whitespace-nowrap">
                  {item.type === 'Out' ? `฿${item.amount?.toLocaleString()}` : '-'}
                </span>
              </td>
              <td className="px-6 py-2.5 text-right bg-blue-50/30">
                <span className="font-bold text-[12px] text-[#111f42] whitespace-nowrap">
                  {item.status === 'Completed' ? `฿${(item.balance || 0)?.toLocaleString()}` : '-'}
                </span>
              </td>
              <td className="px-6 py-2.5 text-center">
                <span className={`px-3 py-1 font-semibold uppercase tracking-widest border rounded-md text-[9px] ${item.status === 'Completed' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-amber-50 text-amber-600 border-amber-100'}`}>
                  {item.status}
                </span>
              </td>
              <td className="px-6 py-2.5 text-center">
                {item.status === 'Draft' && item.type === 'Out' ? (
                  <button 
                    onClick={() => onApprove(item)}
                    className="px-3 py-1.5 bg-[#ab8a3b] hover:bg-[#ab8a3b]/90 text-white rounded-md text-[9px] font-bold uppercase tracking-widest transition-all flex items-center justify-center gap-1 mx-auto whitespace-nowrap"
                  >
                    <CheckCircle size={12} /> Approve
                  </button>
                ) : (
                  <span className="text-slate-300">-</span>
                )}
              </td>
            </tr>
          )) : (
            <tr>
              <td colSpan={9} className="px-6 py-12 text-center font-medium text-slate-400">
                No records found for the selected criteria.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

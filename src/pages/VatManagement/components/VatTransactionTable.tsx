import React from 'react';
import { Calendar } from 'lucide-react';

interface VatRecord {
  id: number;
  date: string;
  type: string;
  invoice: string;
  customer: string;
  amount: number;
  vat: number;
  total: number;
  status: string;
}

interface VatTransactionTableProps {
  data: VatRecord[];
  vatSubTab: string;
  loading: boolean;
}

const VatTransactionTable: React.FC<VatTransactionTableProps> = ({ data, vatSubTab, loading }) => {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' });
  };

  return (
    <div className="overflow-x-auto">
      {loading ? (
        <div className="p-8 text-center font-medium text-slate-500">Loading data...</div>
      ) : (
        <table className="w-full text-left border-collapse">
          <thead className="bg-[#2C3F70] text-white">
            <tr className="border-b-4 border-[#E3624A]">
              <th className="px-6 py-4 text-[10px] font-semibold uppercase tracking-widest">DATE</th>
              {vatSubTab === 'all' && <th className="px-6 py-4 text-[10px] font-semibold uppercase tracking-widest">TYPE</th>}
              <th className="px-6 py-4 text-[10px] font-semibold uppercase tracking-widest">INVOICE NO.</th>
              <th className="px-6 py-4 text-[10px] font-semibold uppercase tracking-widest">CUSTOMER / VENDOR</th>
              <th className="px-6 py-4 text-[10px] font-semibold uppercase tracking-widest text-center">BASE AMOUNT</th>
              <th className="px-6 py-4 text-[10px] font-semibold text-yellow-300 uppercase tracking-widest text-center">VAT (7%)</th>
              <th className="px-6 py-4 text-[10px] font-semibold uppercase tracking-widest text-center">TOTAL</th>
              <th className="px-6 py-4 text-[10px] font-semibold uppercase tracking-widest text-center">STATUS</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {data.length > 0 ? data.map((item) => (
              <tr key={item.id} className="transition-colors hover:bg-slate-50">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2 text-slate-600">
                    <Calendar size={14} />
                    <span className="font-semibold text-[12px]">{formatDate(item.date)}</span>
                  </div>
                </td>
                {vatSubTab === 'all' && (
                  <td className="px-6 py-4">
                    <span className={`px-2.5 py-1 rounded-md text-[9px] font-bold uppercase tracking-wider border ${item.type === 'sales' ? 'bg-[#fdebe9] text-[#E3624A] border-[#fdebe9]' : 'bg-[#f0f4f8] text-[#6b7556] border-[#f0f4f8]'}`}>
                      {item.type}
                    </span>
                  </td>
                )}
                <td className="px-6 py-4">
                  <span className="font-semibold text-[12px] text-[#111f42]">{item.invoice}</span>
                </td>
                <td className="px-6 py-4">
                  <span className="font-medium text-[12px] text-slate-700">{item.customer}</span>
                </td>
                <td className="px-6 py-4 text-center">
                  <span className="font-semibold text-[12px] text-slate-700">฿{item.amount?.toLocaleString()}</span>
                </td>
                <td className="px-6 py-4 text-center">
                  <span className="font-semibold text-[12px]" style={{ color: '#b22026' }}>
                    ฿{item.vat?.toLocaleString()}
                  </span>
                </td>
                <td className="px-6 py-4 text-center">
                  <span className="font-semibold text-[12px] text-[#111f42]">฿{item.total?.toLocaleString()}</span>
                </td>
                <td className="px-6 py-4 text-center">
                  <span className={`px-3 py-1.5 font-semibold uppercase tracking-widest border rounded-md text-[9px] ${item.status === 'Recorded' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-amber-50 text-amber-600 border-amber-100'}`}>
                    {item.status}
                  </span>
                </td>
              </tr>
            )) : (
              <tr>
                <td colSpan={vatSubTab === 'all' ? 8 : 7} className="px-6 py-12 text-center font-medium text-slate-400">
                  No records found for the selected criteria.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default VatTransactionTable;

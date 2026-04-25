import React from 'react';
import { Eye, Pencil, ChevronLeft, ChevronRight, Star } from 'lucide-react';

interface Customer {
  id: string | number;
  customerID: string;
  customerName: string;
  category: string;
  subCategory: string;
  contactName: string;
  phone: string;
  creditTerm: number;
  status: string;
  rating: number;
}

interface CustomerTableProps {
  paginatedCustomers: Customer[];
  filteredCustomers: Customer[];
  currentPage: number;
  setCurrentPage: (page: number) => void;
  itemsPerPage: number;
  setItemsPerPage: (count: number) => void;
  totalPages: number;
  openModal: (mode: string, data?: any) => void;
  getStatusClass: (status: string) => string;
}

const CustomerTable: React.FC<CustomerTableProps> = ({
  paginatedCustomers,
  filteredCustomers,
  currentPage,
  setCurrentPage,
  itemsPerPage,
  setItemsPerPage,
  totalPages,
  openModal,
  getStatusClass
}) => {
  return (
    <div className="bg-white border border-slate-100 shadow-sm overflow-hidden rounded-none animate-in fade-in duration-500 no-print min-h-[600px]">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse whitespace-nowrap">
          <thead className="bg-[#111f42] text-white sticky top-0 z-10 shadow-sm">
            <tr className="border-b-[3px] border-[#ab8a3b]">
              <th className="px-6 py-4 text-[11px] font-bold uppercase tracking-widest">ID</th>
              <th className="px-6 py-4 text-[11px] font-bold uppercase tracking-widest">CUSTOMER NAME</th>
              <th className="px-6 py-4 text-[11px] font-bold uppercase tracking-widest text-center">CAT</th>
              <th className="px-6 py-4 text-[11px] font-bold uppercase tracking-widest text-center">SUB CAT</th>
              <th className="px-6 py-4 text-[11px] font-bold uppercase tracking-widest">CONTACT / PHONE</th>
              <th className="px-6 py-4 text-[11px] font-bold text-[#ab8a3b] uppercase tracking-widest text-center">TERM</th>
              <th className="px-6 py-4 text-[11px] font-bold uppercase tracking-widest text-center">STATUS</th>
              <th className="px-6 py-4 text-[11px] font-bold uppercase tracking-widest text-center">ACTION</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-[12px] font-medium text-[#111f42]">
            {paginatedCustomers?.map(cust => (
              <tr key={cust.id} className="hover:bg-slate-50 transition-colors">
                <td className="px-6 py-3 font-mono font-black text-[#ab8a3b]">{cust.customerID}</td>
                <td className="px-6 py-3 font-bold text-[#111f42] uppercase">{cust.customerName}</td>
                <td className="px-6 py-3 text-center">
                  <span className={`px-2 py-1 rounded text-[9px] font-bold border tracking-wider uppercase ${cust.category === 'Retail' ? 'bg-[#72A09E]/10 text-[#72A09E] border-[#72A09E]/20' : cust.category === 'Wholesale' ? 'bg-[#ab8a3b]/10 text-[#ab8a3b] border-[#ab8a3b]/20' : 'bg-[#E3624A]/10 text-[#E3624A] border-[#E3624A]/20'}`}>{cust.category}</span>
                </td>
                <td className="px-6 py-3 text-center text-slate-500 font-medium italic">{cust.subCategory}</td>
                <td className="px-6 py-3">
                  <div className="font-bold">{cust.contactName}</div>
                  <div className="text-[10px] text-slate-400 font-mono mt-0.5">{cust.phone}</div>
                </td>
                <td className="px-6 py-3 text-center font-mono font-black text-[#E3624A]">{cust.creditTerm} Days</td>
                <td className="px-6 py-3 text-center">
                  <span className={`px-2.5 py-1 rounded text-[9px] font-bold uppercase tracking-wider border ${getStatusClass(cust.status)}`}>{cust.status}</span>
                </td>
                <td className="px-6 py-3 text-center">
                  <div className="flex justify-center items-center gap-1 opacity-60 hover:opacity-100 transition-opacity">
                    <button onClick={() => openModal('view', cust)} className="w-7 h-7 rounded bg-white border border-slate-200 flex items-center justify-center text-[#72A09E] transition-colors hover:text-white hover:bg-[#72A09E] hover:border-[#72A09E]"><Eye size={14} /></button>
                    <button onClick={() => openModal('edit', cust)} className="w-7 h-7 rounded bg-white border border-slate-200 flex items-center justify-center text-[#ab8a3b] transition-colors hover:text-white hover:bg-[#ab8a3b] hover:border-[#ab8a3b]"><Pencil size={14} /></button>
                  </div>
                </td>
              </tr>
            ))}
            {paginatedCustomers.length === 0 && (
              <tr><td colSpan={8} className="px-6 py-8 text-center text-slate-400 italic">No records found.</td></tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Controls */}
      <div className="px-6 py-4 border-t border-slate-100 flex flex-col md:flex-row justify-between items-center gap-4 bg-slate-50/30">
        <div className="flex items-center gap-2 text-[11px] text-slate-500 font-bold uppercase tracking-wider">
          <span>Show</span>
          <select 
            value={itemsPerPage} 
            onChange={e => {setItemsPerPage(Number(e.target.value)); setCurrentPage(1);}}
            className="bg-white border border-slate-200 rounded-md px-2 py-1 focus:outline-none focus:border-[#ab8a3b] cursor-pointer shadow-sm text-[#111f42]"
          >
            <option value={10}>10</option>
            <option value={20}>20</option>
            <option value={50}>50</option>
          </select>
          <span>entries</span>
        </div>
        <div className="flex items-center gap-2">
          <button 
            onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))} 
            disabled={currentPage === 1}
            className="p-2 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 disabled:opacity-50 transition-all"
          >
            <ChevronLeft size={16} />
          </button>
          <span className="text-[11px] font-bold text-[#111f42] px-4 bg-white border border-slate-200 py-2.5 rounded-lg shadow-sm">Page {currentPage} of {totalPages}</span>
          <button 
            onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))} 
            disabled={currentPage === totalPages}
            className="p-2 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 disabled:opacity-50 transition-all"
          >
            <ChevronRight size={16} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default CustomerTable;

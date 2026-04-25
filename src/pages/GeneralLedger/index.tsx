import React, { useState, useEffect, useMemo } from 'react';
import { 
  Calendar,
  Database,
  HelpCircle,
  BookOpen
} from 'lucide-react';
import { PageHeader } from '../../components/shared/PageHeader';
import DataTable from './components/DataTable';
import UserGuideDrawer from './components/UserGuideDrawer';

export default function GeneralLedger() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedMonth, setSelectedMonth] = useState('2026-03');
  const [glRecords, setGlRecords] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [isGuideOpen, setIsGuideOpen] = useState(false);

  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(20);

  // Initialize Data - Synced from Master Data
  useEffect(() => {
    setLoading(true);
    setTimeout(() => {
      const mockData = [
        { id: 1, date: '2026-03-01', jvNo: 'JV-2603-001', accountCode: '1101-00', accountName: 'Cash in Bank', debit: 500000, credit: 0, description: 'Initial Capital', source: 'Master' },
        { id: 2, date: '2026-03-01', jvNo: 'JV-2603-001', accountCode: '3101-00', accountName: 'Share Capital', debit: 0, credit: 500000, description: 'Initial Capital', source: 'Master' },
        { id: 3, date: '2026-03-05', jvNo: 'JV-2603-002', accountCode: '5101-00', accountName: 'Office Supplies', debit: 15000, credit: 0, description: 'Buy supplies', source: 'AP' },
        { id: 4, date: '2026-03-05', jvNo: 'JV-2603-002', accountCode: '1101-00', accountName: 'Cash in Bank', debit: 0, credit: 15000, description: 'Buy supplies', source: 'AP' },
        { id: 5, date: '2026-03-10', jvNo: 'JV-2603-003', accountCode: '1102-00', accountName: 'Accounts Receivable', debit: 45000, credit: 0, description: 'Sales Invoice INV-001', source: 'AR' },
        { id: 6, date: '2026-03-10', jvNo: 'JV-2603-003', accountCode: '4101-00', accountName: 'Sales Revenue', debit: 0, credit: 45000, description: 'Sales Invoice INV-001', source: 'AR' },
        { id: 7, date: '2026-03-15', jvNo: 'JV-2603-004', accountCode: '5201-00', accountName: 'Travel Expenses', debit: 3500, credit: 0, description: 'Petty Cash Reimbursement', source: 'PC' },
        { id: 8, date: '2026-03-15', jvNo: 'JV-2603-004', accountCode: '1103-00', accountName: 'Petty Cash', debit: 0, credit: 3500, description: 'Petty Cash Reimbursement', source: 'PC' },
      ];
      setGlRecords(mockData);
      setLoading(false);
    }, 600);
  }, []);

  const filteredData = useMemo(() => {
    let result = glRecords;
    if (searchTerm) {
      const q = searchTerm.toLowerCase();
      result = result.filter(e => e.jvNo.toLowerCase().includes(q) || e.accountName.toLowerCase().includes(q) || e.accountCode.toLowerCase().includes(q) || e.description.toLowerCase().includes(q));
    }
    return result;
  }, [glRecords, searchTerm]);

  useEffect(() => { setCurrentPage(1); }, [selectedMonth, searchTerm, itemsPerPage]);

  const totalDebit = filteredData.reduce((s, i) => s + i.debit, 0);
  const totalCredit = filteredData.reduce((s, i) => s + i.credit, 0);

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredData.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);

  return (
    <div className="flex flex-col space-y-4 w-full relative flex-1 transition-colors duration-500 text-[12px]">
      <style>{`
        @keyframes fadeUp { from { opacity: 0; transform: translate(-50%, 5px); } to { opacity: 1; transform: translate(-50%, 0); } }
        .animate-fade-up { animation: fadeUp 0.2s ease-out forwards; }
        .custom-scrollbar::-webkit-scrollbar { width: 6px; height: 6px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #CBD5E1; border-radius: 3px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #94A3B8; }
      `}</style>
      
      <PageHeader
        title="GENERAL LEDGER"
        subtitle="สมุดบัญชีแยกประเภททั่วไป (Read-Only)"
        icon={BookOpen}
        rightContent={
          <div className="flex items-center justify-end gap-2 w-full lg:w-auto overflow-x-auto custom-scrollbar pb-1">
            <div className="flex items-center bg-white border border-slate-200 rounded-lg overflow-hidden shadow-sm shrink-0">
              <div className="px-2 py-1.5 bg-slate-50 border-r border-slate-200 text-[#111f42]">
                <Calendar size={14} />
              </div>
              <input type="month" value={selectedMonth} readOnly className="px-2 py-1.5 text-[11px] font-bold text-[#111f42] bg-transparent outline-none cursor-default" />
            </div>

            <div className="flex bg-[#e2e8f0] p-1 border border-slate-200 shadow-inner rounded-xl shrink-0">
              <button className="py-1.5 font-black transition-all flex items-center gap-1.5 uppercase tracking-widest rounded-lg text-[10px] bg-[#111f42] text-white shadow-sm">
                <Database size={12} /> DETAILED DATA
              </button>
            </div>
            <button onClick={() => setIsGuideOpen(true)} className="p-2 transition-all flex items-center justify-center rounded-xl bg-white text-slate-400 hover:text-[#111f42] hover:bg-slate-50 border border-slate-200 shadow-sm shrink-0"><HelpCircle size={16} /></button>
          </div>
        }
      />

      <div className="w-full flex-1 flex flex-col h-full overflow-hidden px-0 z-10 relative">
        <DataTable 
          filteredData={filteredData}
          totalDebit={totalDebit}
          totalCredit={totalCredit}
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          currentItems={currentItems}
          totalPages={totalPages}
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
          itemsPerPage={itemsPerPage}
          setItemsPerPage={setItemsPerPage}
        />

        <UserGuideDrawer isGuideOpen={isGuideOpen} setIsGuideOpen={setIsGuideOpen} />
      </div>
    </div>
  );
}

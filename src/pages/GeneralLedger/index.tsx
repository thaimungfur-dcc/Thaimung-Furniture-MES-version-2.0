import React, { useState, useEffect, useMemo } from 'react';
import { 
  Calendar,
  Database,
  HelpCircle,
  BookOpen
} from 'lucide-react';
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
    <>
      <style>{`
        * { font-family: 'JetBrains Mono', 'Noto Sans Thai', sans-serif !important; }
        @keyframes fadeUp { from { opacity: 0; transform: translate(-50%, 5px); } to { opacity: 1; transform: translate(-50%, 0); } }
        .animate-fade-up { animation: fadeUp 0.2s ease-out forwards; }
        .custom-scrollbar::-webkit-scrollbar { width: 6px; height: 6px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #CBD5E1; border-radius: 3px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #94A3B8; }
      `}</style>
      
      <div className="min-h-screen p-4 md:p-6 transition-colors duration-500 text-[12px] bg-gradient-to-br from-[#f5f0e9] via-[#f0ede5] to-[#c6c2bb] flex flex-col">
        <div className="w-full space-y-6 relative max-w-[1600px] mx-auto flex-1 flex flex-col h-full overflow-hidden">
          
          {/* Header */}
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 flex-shrink-0">
            <div className="flex items-center gap-4 shrink-0">
              <div className="relative w-12 h-12 bg-white flex items-center justify-center shadow-lg flex-shrink-0 rounded-2xl border-[3px] border-white/60 bg-clip-padding backdrop-blur-sm">
                <svg width="0" height="0" className="absolute">
                  <defs>
                    <linearGradient id="glGradient" x1="0" y1="0" x2="24" y2="24" gradientUnits="userSpaceOnUse">
                      <stop stopColor="#374151" offset="0%" />
                      <stop stopColor="#4b5563" offset="100%" />
                    </linearGradient>
                  </defs>
                </svg>
                <BookOpen size={24} strokeWidth={2.5} stroke="url(#glGradient)" />
              </div>
              <div className="flex flex-col justify-center">
                <h1 className="text-2xl tracking-tight uppercase leading-none drop-shadow-sm">
                  <span className="text-[#374151] font-light">GENERAL</span> <span className="text-[#4b5563] font-black">LEDGER</span>
                </h1>
                <p className="font-medium text-[12px] uppercase tracking-widest mt-1 text-[#6b7280] leading-none">
                  สมุดบัญชีแยกประเภททั่วไป (Read-Only)
                </p>
              </div>
            </div>
            
            <div className="flex items-center justify-end gap-2 w-full lg:w-auto overflow-x-auto custom-scrollbar pb-1">
              <div className="flex items-center bg-white/80 backdrop-blur-md border border-white/50 rounded-lg overflow-hidden shadow-sm shrink-0">
                <div className="px-2 py-1.5 bg-white/50 border-r border-white/50 text-[#4b5563]">
                  <Calendar size={14} />
                </div>
                <input type="month" value={selectedMonth} readOnly className="px-2 py-1.5 text-[11px] font-bold text-[#223149] bg-transparent outline-none cursor-default" />
              </div>

              <div className="flex bg-white/80 backdrop-blur-md p-1 border border-white/50 shadow-sm rounded-lg shrink-0">
                <button className="px-4 py-1.5 font-bold transition-all flex items-center gap-1.5 uppercase tracking-widest rounded text-[10px] bg-gradient-to-r from-[#374151] to-[#4b5563] text-white shadow-sm">
                  <Database size={12} /> DETAILED DATA
                </button>
              </div>
              <button onClick={() => setIsGuideOpen(true)} className="p-2 transition-all flex items-center justify-center rounded-lg bg-white/80 backdrop-blur-md text-[#4b5563] hover:bg-white border border-white/50 shadow-sm hover:shadow shrink-0"><HelpCircle size={16} /></button>
            </div>
          </div>

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
    </>
  );
}

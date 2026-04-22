import React, { useState, useEffect, useMemo } from 'react';
import { 
  Calendar,
  Kanban,
  Database,
  HelpCircle,
  ArrowRightLeft
} from 'lucide-react';
import KanbanBoard from './components/KanbanBoard';
import DataTable from './components/DataTable';
import UserGuideDrawer from './components/UserGuideDrawer';

export default function BankReconciliation() {
  const [mainTab, setMainTab] = useState('kanban'); // 'kanban' | 'data' 
  const [subTab, setSubTab] = useState('all'); 
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedMonth, setSelectedMonth] = useState('2026-03');
  const [records, setRecords] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [isGuideOpen, setIsGuideOpen] = useState(false);

  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  // Initialize Data - Synced from Master Data conceptually
  useEffect(() => {
    setLoading(true);
    setTimeout(() => {
      const mockData = [
        { id: 1, date: '2026-03-10', refNo: 'CHK-001', description: 'จ่ายค่าสินค้าให้ Thai Steel Co.', bankAmount: null, bookAmount: -52000, bankAccount: 'KBank', type: 'Outstanding Check', status: 'Investigating', source: 'Master' },
        { id: 2, date: '2026-03-11', refNo: 'DEP-002', description: 'นำฝากเช็คจากลูกค้า Siam Design', bankAmount: null, bookAmount: 12000, bankAccount: 'SCB', type: 'Deposit in Transit', status: 'Unmatched', source: 'Master' },
        { id: 3, date: '2026-03-05', refNo: 'FEE-001', description: 'ค่าธรรมเนียมโอนเงินตปท.', bankAmount: -1500, bookAmount: null, bankAccount: 'KTB', type: 'Bank Fee', status: 'Adjusting', source: 'Master' },
        { id: 4, date: '2026-03-12', refNo: 'TRF-004', description: 'รับชำระเงินจาก Home Pro', bankAmount: 69550, bookAmount: 69550, bankAccount: 'KBank', type: 'Normal', status: 'Reconciled', source: 'Master' },
      ];
      const processed = mockData.map(rec => {
        const bank = rec.bankAmount || 0;
        const book = rec.bookAmount || 0;
        return { ...rec, diff: Math.abs(bank - book) };
      });
      setRecords(processed);
      setLoading(false);
    }, 600);
  }, []);

  const filteredData = useMemo(() => {
    let result = records;
    if (subTab !== 'all') {
      result = result.filter(r => r.status === subTab);
    }
    if (searchTerm) {
      const q = searchTerm.toLowerCase();
      result = result.filter(r => r.refNo.toLowerCase().includes(q) || r.description.toLowerCase().includes(q) || r.bankAccount.toLowerCase().includes(q));
    }
    return result;
  }, [records, subTab, searchTerm]);

  useEffect(() => { setCurrentPage(1); }, [subTab, selectedMonth, searchTerm, itemsPerPage, mainTab]);

  const totalUnmatchedCount = records.filter(r => r.status !== 'Reconciled').length;
  const totalDiffAmount = records.filter(r => r.status !== 'Reconciled').reduce((s, i) => s + i.diff, 0);

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
        .kanban-scroll::-webkit-scrollbar { width: 6px; height: 6px; }
        .kanban-scroll::-webkit-scrollbar-track { background: transparent; }
        .kanban-scroll::-webkit-scrollbar-thumb { background: #CBD5E1; border-radius: 3px; }
        .kanban-scroll::-webkit-scrollbar-thumb:hover { background: #94A3B8; }
      `}</style>
      
      <div className="min-h-screen p-4 md:p-6 transition-colors duration-500 text-[12px] bg-gradient-to-br from-[#f5f0e9] via-[#f0ede5] to-[#c6c2bb] flex flex-col">
        <div className="w-full space-y-6 relative flex-1 flex flex-col h-full overflow-hidden">
          
          {/* Header */}
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 flex-shrink-0">
            <div className="flex items-center gap-4 shrink-0">
              <div className="relative w-12 h-12 bg-white flex items-center justify-center shadow-lg flex-shrink-0 rounded-2xl border-[3px] border-white/60 bg-clip-padding backdrop-blur-sm">
                <svg width="0" height="0" className="absolute">
                  <defs>
                    <linearGradient id="recGradient" x1="0" y1="0" x2="24" y2="24" gradientUnits="userSpaceOnUse"><stop stopColor="#223f59" offset="0%" /><stop stopColor="#0ea5e9" offset="100%" /></linearGradient>
                  </defs>
                </svg>
                <ArrowRightLeft size={24} strokeWidth={2.5} stroke="url(#recGradient)" />
              </div>
              <div className="flex flex-col justify-center">
                <h1 className="text-2xl tracking-tight uppercase leading-none drop-shadow-sm"><span className="text-[#223f59] font-light">BANK</span> <span className="text-[#0ea5e9] font-black">RECONCILIATION</span></h1>
                <p className="font-medium text-[12px] uppercase tracking-widest mt-1 text-[#496ca8] leading-none">ฐานข้อมูลกระทบยอดธนาคาร (Read-Only Database)</p>
              </div>
            </div>
            
            <div className="flex items-center justify-end gap-2 w-full lg:w-auto overflow-x-auto custom-scrollbar pb-1">
              <div className="flex items-center bg-white/80 backdrop-blur-md border border-white/50 rounded-lg overflow-hidden shadow-sm shrink-0">
                <div className="px-2 py-1.5 bg-white/50 border-r border-white/50 text-[#0ea5e9]"><Calendar size={14} /></div>
                <input type="month" value={selectedMonth} readOnly className="px-2 py-1.5 text-[11px] font-bold text-[#223149] bg-transparent outline-none cursor-default" />
              </div>
              <div className="flex bg-white/80 backdrop-blur-md p-1 border border-white/50 shadow-sm rounded-lg shrink-0">
                <button onClick={() => setMainTab('kanban')} className="px-4 py-1.5 font-bold transition-all flex items-center gap-1.5 uppercase tracking-widest rounded text-[10px]" style={mainTab === 'kanban' ? { backgroundColor: '#0ea5e9', color: 'white', boxShadow: '0 2px 4px -1px rgba(14,165,233,0.3)' } : { color: '#7693a6', backgroundColor: 'transparent' }}><Kanban size={12} /> BOARD</button>
                <button onClick={() => setMainTab('data')} className="px-4 py-1.5 font-bold transition-all flex items-center gap-1.5 uppercase tracking-widest rounded text-[10px]" style={mainTab === 'data' ? { background: 'linear-gradient(to right, #0ea5e9, #223f59)', color: 'white', boxShadow: '0 2px 4px -1px rgba(34,63,89,0.3)' } : { color: '#7693a6', backgroundColor: 'transparent' }}><Database size={12} /> DETAILED DATA</button>
              </div>
              <button onClick={() => setIsGuideOpen(true)} className="p-2 transition-all flex items-center justify-center rounded-lg bg-white/80 backdrop-blur-md text-[#0ea5e9] hover:bg-white border border-white/50 shadow-sm hover:shadow shrink-0"><HelpCircle size={16} /></button>
            </div>
          </div>

          {mainTab === 'kanban' && <KanbanBoard records={records} />}
          
          {mainTab === 'data' && (
            <DataTable 
              records={records}
              subTab={subTab}
              setSubTab={setSubTab}
              searchTerm={searchTerm}
              setSearchTerm={setSearchTerm}
              totalUnmatchedCount={totalUnmatchedCount}
              totalDiffAmount={totalDiffAmount}
              currentItems={currentItems}
            />
          )}

          <UserGuideDrawer isGuideOpen={isGuideOpen} setIsGuideOpen={setIsGuideOpen} />

        </div>
      </div>
    </>
  );
}

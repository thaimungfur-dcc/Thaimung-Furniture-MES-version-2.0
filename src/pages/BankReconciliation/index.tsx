import React, { useState, useEffect, useMemo } from 'react';
import { 
  Calendar,
  Kanban,
  Database,
  HelpCircle,
  ArrowRightLeft
} from 'lucide-react';
import { PageHeader } from '../../components/shared/PageHeader';
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
      const processed = mockData?.map(rec => {
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
      result = result?.filter(r => r.status === subTab);
    }
    if (searchTerm) {
      const q = searchTerm.toLowerCase();
      result = result?.filter(r => r.refNo.toLowerCase().includes(q) || r.description.toLowerCase().includes(q) || r.bankAccount.toLowerCase().includes(q));
    }
    return result;
  }, [records, subTab, searchTerm]);

  useEffect(() => { setCurrentPage(1); }, [subTab, selectedMonth, searchTerm, itemsPerPage, mainTab]);

  const totalUnmatchedCount = records?.filter(r => r.status !== 'Reconciled').length;
  const totalDiffAmount = records?.filter(r => r.status !== 'Reconciled')?.reduce((s, i) => s + i.diff, 0);

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredData.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);

  return (
    <div className="flex flex-col space-y-4 w-full relative flex-1 transition-colors duration-500 text-[12px]">
      <style>{`
        @keyframes fadeUp { from { opacity: 0; transform: translate(-50%, 5px); } to { opacity: 1; transform: translate(-50%, 0); } }
        .animate-fade-up { animation: fadeUp 0.2s ease-out forwards; }
        .kanban-scroll::-webkit-scrollbar { width: 6px; height: 6px; }
        .kanban-scroll::-webkit-scrollbar-track { background: transparent; }
        .kanban-scroll::-webkit-scrollbar-thumb { background: #CBD5E1; border-radius: 3px; }
        .kanban-scroll::-webkit-scrollbar-thumb:hover { background: #94A3B8; }
      `}</style>
      
      <PageHeader
        title="BANK RECONCILIATION"
        subtitle="ฐานข้อมูลกระทบยอดธนาคาร (Read-Only Database)"
        icon={ArrowRightLeft}
        rightContent={
          <div className="flex items-center justify-end gap-2 w-full lg:w-auto overflow-x-auto custom-scrollbar pb-1">
            <div className="flex items-center bg-white border border-slate-200 rounded-lg overflow-hidden shadow-sm shrink-0">
              <div className="px-2 py-1.5 bg-slate-50 border-r border-slate-200 text-[#111f42]"><Calendar size={14} /></div>
              <input type="month" value={selectedMonth} readOnly className="px-2 py-1.5 text-[11px] font-bold text-[#111f42] bg-transparent outline-none cursor-default" />
            </div>
            <div className="flex bg-[#e2e8f0] p-1 border border-slate-200 shadow-inner rounded-xl shrink-0">
              <button onClick={() => setMainTab('kanban')} className={`px-4 py-1.5 font-black transition-all flex items-center gap-1.5 uppercase tracking-widest rounded-lg text-[10px] ${mainTab === 'kanban' ? 'bg-[#111f42] text-white shadow-sm' : 'text-slate-500 hover:bg-slate-50'}`}><Kanban size={12} /> BOARD</button>
              <button onClick={() => setMainTab('data')} className={`px-4 py-1.5 font-black transition-all flex items-center gap-1.5 uppercase tracking-widest rounded-lg text-[10px] ${mainTab === 'data' ? 'bg-[#1e293b] text-white shadow-sm' : 'text-slate-500 hover:bg-slate-50'}`}><Database size={12} /> DETAILED DATA</button>
            </div>
            <button onClick={() => setIsGuideOpen(true)} className="p-2 transition-all flex items-center justify-center rounded-xl bg-white text-slate-400 hover:text-[#111f42] hover:bg-slate-50 border border-slate-200 shadow-sm shrink-0"><HelpCircle size={16} /></button>
          </div>
        }
      />

      <div className="w-full flex-1 flex flex-col h-full overflow-hidden px-0 z-10 relative">
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
  );
}

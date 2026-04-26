import React, { useState, useEffect, useMemo } from 'react';
import { 
  Calendar,
  Kanban,
  Database,
  HelpCircle,
  Coins
} from 'lucide-react';
import { PageHeader } from '../../components/shared/PageHeader';
import KanbanBoard from './components/KanbanBoard';
import DataTable from './components/DataTable';
import UserGuideDrawer from './components/UserGuideDrawer';

export default function PettyCash() {
  const [mainTab, setMainTab] = useState('kanban'); // 'kanban' | 'data' 
  const [subTab, setSubTab] = useState('all'); 
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedMonth, setSelectedMonth] = useState('2026-03');
  const [vouchers, setVouchers] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [isGuideOpen, setIsGuideOpen] = useState(false);

  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  // Initialize Data - Synced from Master Data
  useEffect(() => {
    setLoading(true);
    setTimeout(() => {
      const mockData = [
        { id: 1, pcvNo: 'PCV-2603-001', employee: 'Somchai K.', department: 'Sales', category: 'Travel & Transport', description: 'ค่าทางด่วนไปพบลูกค้า', date: '2026-03-02', amount: 350, status: 'Reimbursed', source: 'Master' },
        { id: 2, pcvNo: 'PCV-2603-002', employee: 'Wipa D.', department: 'Admin/HR', category: 'Office Supplies', description: 'ซื้อแฟ้มและปากกา', date: '2026-03-05', amount: 1200, status: 'Reimbursed', source: 'Master' },
        { id: 3, pcvNo: 'PCV-2603-003', employee: 'Piti S.', department: 'Operations', category: 'Meals & Entertainment', description: 'เลี้ยงรับรอง Supplier', date: '2026-03-08', amount: 2500, status: 'Approved', source: 'Master' },
        { id: 4, pcvNo: 'PCV-2603-004', employee: 'Aree Y.', department: 'Marketing', category: 'Postage & Delivery', description: 'ส่งเอกสารด่วน EMS', date: '2026-03-10', amount: 150, status: 'Pending Approval', source: 'Master' },
        { id: 5, pcvNo: 'PCV-2603-005', employee: 'Somchai K.', department: 'Sales', category: 'Travel & Transport', description: 'ค่าแท็กซี่', date: '2026-03-11', amount: 220, status: 'Draft', source: 'Master' },
        { id: 6, pcvNo: 'PCV-2603-006', employee: 'Niran T.', department: 'IT', category: 'Office Supplies', description: 'สาย LAN และ หัว RJ45', date: '2026-03-12', amount: 850, status: 'Pending Approval', source: 'Master' },
      ];
      setVouchers(mockData);
      setLoading(false);
    }, 600);
  }, []);

  const filteredData = useMemo(() => {
    let result = vouchers;
    if (subTab !== 'all') {
      result = result?.filter(e => e.status === subTab);
    }
    if (searchTerm) {
      const q = searchTerm.toLowerCase();
      result = result?.filter(e => e.pcvNo.toLowerCase().includes(q) || e.employee.toLowerCase().includes(q) || e.description.toLowerCase().includes(q));
    }
    return result;
  }, [vouchers, subTab, searchTerm]);

  useEffect(() => { setCurrentPage(1); }, [subTab, selectedMonth, searchTerm, itemsPerPage, mainTab]);

  const totalAmount = filteredData?.reduce((s, i) => s + i.amount, 0);

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
        title="PETTY CASH"
        subtitle="ฐานข้อมูลเงินสดย่อย (Read-Only Database)"
        icon={Database}
        rightContent={
          <div className="flex items-center justify-end gap-2 w-full lg:w-auto overflow-x-auto custom-scrollbar pb-1">
            <div className="flex items-center bg-white border border-slate-200 rounded-lg overflow-hidden shadow-sm shrink-0">
              <div className="px-2 py-1.5 bg-slate-50 border-r border-slate-200 text-[#111f42]">
                <Calendar size={14} />
              </div>
              <input type="month" value={selectedMonth} readOnly className="px-2 py-1.5 text-[11px] font-bold text-[#111f42] bg-transparent outline-none cursor-default" />
            </div>

            <div className="flex bg-[#e2e8f0] p-1 border border-slate-200 shadow-inner rounded-xl shrink-0">
              <button onClick={() => setMainTab('kanban')} className={`px-4 py-1.5 font-black transition-all flex items-center gap-1.5 uppercase tracking-widest rounded-lg text-[10px] ${mainTab === 'kanban' ? 'bg-[#111f42] text-white shadow-sm' : 'text-slate-500 hover:bg-slate-50'}`}>
                <Kanban size={12} /> BOARD
              </button>
              <button onClick={() => setMainTab('data')} className={`px-4 py-1.5 font-black transition-all flex items-center gap-1.5 uppercase tracking-widest rounded-lg text-[10px] ${mainTab === 'data' ? 'bg-[#1e293b] text-white shadow-sm' : 'text-slate-500 hover:bg-slate-50'}`}>
                <Database size={12} /> DETAILED DATA
              </button>
            </div>
            <button onClick={() => setIsGuideOpen(true)} className="p-2 transition-all flex items-center justify-center rounded-xl bg-white text-slate-400 hover:text-[#111f42] hover:bg-slate-50 border border-slate-200 shadow-sm shrink-0"><HelpCircle size={16} /></button>
          </div>
        }
      />

      <div className="w-full flex-1 flex flex-col h-full overflow-hidden px-0 z-10 relative">
        {mainTab === 'kanban' && <KanbanBoard vouchers={vouchers} />}
        
        {mainTab === 'data' && (
          <DataTable 
            filteredData={filteredData}
            totalAmount={totalAmount}
            subTab={subTab}
            setSubTab={setSubTab}
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            currentItems={currentItems}
          />
        )}

        <UserGuideDrawer isGuideOpen={isGuideOpen} setIsGuideOpen={setIsGuideOpen} />
      </div>
    </div>
  );
}

import React, { useState, useEffect, useMemo } from 'react';
import { 
  Calendar,
  Kanban,
  Database,
  HelpCircle
} from 'lucide-react';
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
      result = result.filter(e => e.status === subTab);
    }
    if (searchTerm) {
      const q = searchTerm.toLowerCase();
      result = result.filter(e => e.pcvNo.toLowerCase().includes(q) || e.employee.toLowerCase().includes(q) || e.description.toLowerCase().includes(q));
    }
    return result;
  }, [vouchers, subTab, searchTerm]);

  useEffect(() => { setCurrentPage(1); }, [subTab, selectedMonth, searchTerm, itemsPerPage, mainTab]);

  const totalAmount = filteredData.reduce((s, i) => s + i.amount, 0);

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
        <div className="w-full space-y-6 relative max-w-[1600px] mx-auto flex-1 flex flex-col h-full overflow-hidden">
          
          {/* Header */}
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 flex-shrink-0">
            <div className="flex items-center gap-4 shrink-0">
              <div className="relative w-12 h-12 bg-white flex items-center justify-center shadow-lg flex-shrink-0 rounded-2xl border-[3px] border-white/60 bg-clip-padding backdrop-blur-sm">
                <svg width="0" height="0" className="absolute">
                  <defs>
                    <linearGradient id="pcGradient" x1="0" y1="0" x2="24" y2="24" gradientUnits="userSpaceOnUse">
                      <stop stopColor="#7fa85a" offset="0%" />
                      <stop stopColor="#d9b343" offset="100%" />
                    </linearGradient>
                  </defs>
                </svg>
                <Database size={24} strokeWidth={2.5} stroke="url(#pcGradient)" />
              </div>
              <div className="flex flex-col justify-center">
                <h1 className="text-2xl tracking-tight uppercase leading-none drop-shadow-sm">
                  <span className="text-[#223149] font-light">PETTY</span> <span className="text-[#7fa85a] font-black">CASH</span>
                </h1>
                <p className="font-medium text-[12px] uppercase tracking-widest mt-1 text-[#496ca8] leading-none">
                  ฐานข้อมูลเงินสดย่อย (Read-Only Database)
                </p>
              </div>
            </div>
            
            <div className="flex items-center justify-end gap-2 w-full lg:w-auto overflow-x-auto custom-scrollbar pb-1">
              <div className="flex items-center bg-white/80 backdrop-blur-md border border-white/50 rounded-lg overflow-hidden shadow-sm shrink-0">
                <div className="px-2 py-1.5 bg-white/50 border-r border-white/50 text-[#7fa85a]">
                  <Calendar size={14} />
                </div>
                <input type="month" value={selectedMonth} readOnly className="px-2 py-1.5 text-[11px] font-bold text-[#223149] bg-transparent outline-none cursor-default" />
              </div>

              <div className="flex bg-white/80 backdrop-blur-md p-1 border border-white/50 shadow-sm rounded-lg shrink-0">
                <button onClick={() => setMainTab('kanban')} className="px-4 py-1.5 font-bold transition-all flex items-center gap-1.5 uppercase tracking-widest rounded text-[10px]" style={mainTab === 'kanban' ? { backgroundColor: '#d9b343', color: 'white', boxShadow: '0 2px 4px -1px rgba(217,179,67,0.3)' } : { color: '#7693a6', backgroundColor: 'transparent' }}>
                  <Kanban size={12} /> BOARD
                </button>
                <button onClick={() => setMainTab('data')} className="px-4 py-1.5 font-bold transition-all flex items-center gap-1.5 uppercase tracking-widest rounded text-[10px]" style={mainTab === 'data' ? { background: 'linear-gradient(to right, #7fa85a, #d9b343)', color: 'white', boxShadow: '0 2px 4px -1px rgba(127,168,90,0.3)' } : { color: '#7693a6', backgroundColor: 'transparent' }}>
                  <Database size={12} /> DETAILED DATA
                </button>
              </div>
              <button onClick={() => setIsGuideOpen(true)} className="p-2 transition-all flex items-center justify-center rounded-lg bg-white/80 backdrop-blur-md text-[#7fa85a] hover:bg-white border border-white/50 shadow-sm hover:shadow shrink-0"><HelpCircle size={16} /></button>
            </div>
          </div>

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
    </>
  );
}

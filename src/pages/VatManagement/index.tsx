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

export default function VatManagement() {
  const [mainTab, setMainTab] = useState('data'); // 'kanban' | 'data' 
  const [subTab, setSubTab] = useState('all'); 
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedMonth, setSelectedMonth] = useState('2026-03');
  const [taxRecords, setTaxRecords] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [isGuideOpen, setIsGuideOpen] = useState(false);

  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  // Initialize Mock Data - Synced from Master Data conceptually
  useEffect(() => {
    setLoading(true);
    setTimeout(() => {
      const mockData = [
        { id: 1, docNo: 'IV-2603001', date: '2026-03-01', entityName: 'Modern Home Co.', type: 'Sales', taxMethod: 'Vat Exclude', amount: 100000, status: 'Verified', source: 'Master' },
        { id: 2, docNo: 'IV-2603002', date: '2026-03-02', entityName: 'Index Living', type: 'Sales', taxMethod: 'Vat Include', amount: 53500, status: 'Verified', source: 'Master' },
        { id: 3, docNo: 'IV-2603003', date: '2026-03-05', entityName: 'Agro Tech Co.', type: 'Sales', taxMethod: 'No Vat', amount: 80000, status: 'Verified', source: 'Master' },
        { id: 4, docNo: 'PV-2603001', date: '2026-03-06', entityName: 'Electricity Authority', type: 'Purchase', taxMethod: 'Vat Exclude', amount: 45000, status: 'Verified', source: 'Master' },
        { id: 5, docNo: 'PV-2603002', date: '2026-03-08', entityName: 'Water Works', type: 'Purchase', taxMethod: 'Vat Exclude', amount: 5000, status: 'Recorded', source: 'Master' },
        { id: 6, docNo: 'IV-2603004', date: '2026-03-10', entityName: 'Global Exports', type: 'Sales', taxMethod: 'No Vat', amount: 350000, status: 'Verified', source: 'Master' },
        { id: 7, docNo: 'PV-2603003', date: '2026-03-12', entityName: 'Stationery World', type: 'Purchase', taxMethod: 'Vat Include', amount: 2140, status: 'Recorded', source: 'Master' },
        { id: 8, docNo: 'PV-2603004', date: '2026-03-15', entityName: 'Fuel Supply Ltd', type: 'Purchase', taxMethod: 'Vat Exclude', amount: 12000, status: 'Recorded', source: 'Master' },
      ];
      
      const processed = mockData.map(rec => {
        let base = 0;
        let vat = 0;
        let total = 0;
        const rawAmt = parseFloat(rec.amount as any) || 0;

        if (rec.taxMethod === 'Vat Exclude') {
          base = rawAmt;
          vat = base * 0.07;
          total = base + vat;
        } else if (rec.taxMethod === 'Vat Include') {
          total = rawAmt;
          base = total / 1.07;
          vat = total - base;
        } else {
          base = rawAmt;
          vat = 0;
          total = base;
        }
        return { ...rec, baseAmount: base, vatAmount: vat, totalAmount: total };
      });
      
      setTaxRecords(processed);
      setLoading(false);
    }, 600);
  }, []);

  const filteredData = useMemo(() => {
    let result = taxRecords;
    if (subTab !== 'all') {
      result = result.filter(r => r.status === subTab || r.type === subTab || r.taxMethod === subTab);
    }
    if (searchTerm) {
      const q = searchTerm.toLowerCase();
      result = result.filter(r => r.docNo.toLowerCase().includes(q) || r.entityName.toLowerCase().includes(q));
    }
    return result;
  }, [taxRecords, subTab, searchTerm]);

  useEffect(() => { setCurrentPage(1); }, [subTab, searchTerm]);

  const totalBase = filteredData.reduce((s, i) => s + i.baseAmount, 0);
  const totalVat = filteredData.reduce((s, i) => s + i.vatAmount, 0);

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
      
      <div className="min-h-screen p-4 md:p-6 transition-colors duration-500 text-[12px] bg-gradient-to-br from-[#f8fafc] via-[#f1f5f9] to-[#e2e8f0] flex flex-col">
        <div className="w-full space-y-6 relative max-w-[1600px] mx-auto flex-1 flex flex-col h-full overflow-hidden">
          
          {/* Header */}
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 flex-shrink-0">
            <div className="flex items-center gap-4 shrink-0">
              <div className="relative w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-lg border-[3px] border-white/60 bg-clip-padding backdrop-blur-sm">
                <svg width="0" height="0" className="absolute">
                  <defs>
                    <linearGradient id="dbTaxGrad" x1="0" y1="0" x2="24" y2="24" gradientUnits="userSpaceOnUse">
                      <stop stopColor="#1e293b" offset="0%" />
                      <stop stopColor="#496ca8" offset="100%" />
                    </linearGradient>
                  </defs>
                </svg>
                <Database size={24} strokeWidth={2.5} stroke="url(#dbTaxGrad)" />
              </div>
              <div className="flex flex-col justify-center">
                <h1 className="text-2xl tracking-tight uppercase leading-none drop-shadow-sm">
                  <span className="text-[#1e293b] font-light">TAX</span> <span className="text-[#496ca8] font-black">RECORDS</span>
                </h1>
                <p className="font-medium text-[12px] uppercase tracking-widest mt-1 text-[#475569] leading-none">
                  ฐานข้อมูลภาษี (Read-Only Database)
                </p>
              </div>
            </div>
            
            <div className="flex items-center justify-end gap-2 w-full lg:w-auto overflow-x-auto custom-scrollbar pb-1">
              <div className="flex items-center bg-white/80 backdrop-blur-md border border-white/50 rounded-lg overflow-hidden shadow-sm shrink-0">
                <div className="px-2 py-1.5 bg-white/50 border-r border-white/50 text-[#496ca8]">
                  <Calendar size={14} />
                </div>
                <input 
                  type="month" 
                  value={selectedMonth}
                  onChange={(e) => setSelectedMonth(e.target.value)}
                  className="px-2 py-1.5 text-[11px] font-bold text-[#223149] bg-transparent outline-none cursor-pointer hover:bg-white/50 transition-colors"
                />
              </div>

              <div className="flex bg-white/80 backdrop-blur-md p-1 border border-white shadow-sm rounded-lg shrink-0">
                <button 
                  onClick={() => setMainTab('kanban')} 
                  className="px-4 py-1.5 font-bold transition-all flex items-center gap-1.5 uppercase tracking-widest rounded text-[10px]"
                  style={mainTab === 'kanban' ? { backgroundColor: '#1e293b', color: 'white' } : { color: '#64748b' }}
                >
                  <Kanban size={12} /> BOARD
                </button>
                <button 
                  onClick={() => setMainTab('data')} 
                  className="px-4 py-1.5 font-bold transition-all flex items-center gap-1.5 uppercase tracking-widest rounded text-[10px]"
                  style={mainTab === 'data' ? { background: 'linear-gradient(to right, #1e293b, #496ca8)', color: 'white' } : { color: '#64748b' }}
                >
                  <Database size={12} /> DETAILED DATA
                </button>
              </div>

              <button 
                onClick={() => setIsGuideOpen(true)}
                className="p-2 transition-all rounded-lg bg-white/80 backdrop-blur-md text-slate-500 border border-white shadow-sm hover:shadow shrink-0"
              >
                <HelpCircle size={16} />
              </button>
            </div>
          </div>

          {mainTab === 'kanban' && <KanbanBoard taxRecords={taxRecords} />}
          
          {mainTab === 'data' && (
            <DataTable 
              filteredData={filteredData}
              totalBase={totalBase}
              totalVat={totalVat}
              subTab={subTab}
              setSubTab={setSubTab}
              searchTerm={searchTerm}
              setSearchTerm={setSearchTerm}
              currentItems={currentItems}
              totalPages={totalPages}
              currentPage={currentPage}
              setCurrentPage={setCurrentPage}
              itemsPerPage={itemsPerPage}
              setItemsPerPage={setItemsPerPage}
            />
          )}

          <UserGuideDrawer isGuideOpen={isGuideOpen} setIsGuideOpen={setIsGuideOpen} />

        </div>
      </div>
    </>
  );
}

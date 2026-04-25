import React, { useState, useEffect, useMemo } from 'react';
import { 
  Calendar,
  Kanban,
  Database,
  HelpCircle,
  ShieldCheck, 
  Receipt, 
  ArrowUpCircle, 
  ArrowDownCircle 
} from 'lucide-react';
import { PageHeader } from '../../components/shared/PageHeader';
import { KpiCard } from '../../components/shared/KpiCard';
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
      
      const processed = mockData?.map(rec => {
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
    <div className="flex flex-col space-y-4 w-full relative flex-1 animate-fade-in-up">
      <style>{`
        @keyframes fadeUp { from { opacity: 0; transform: translate(-50%, 5px); } to { opacity: 1; transform: translate(-50%, 0); } }
        .animate-fade-up { animation: fadeUp 0.2s ease-out forwards; }
        .kanban-scroll::-webkit-scrollbar { width: 6px; height: 6px; }
        .kanban-scroll::-webkit-scrollbar-track { background: transparent; }
        .kanban-scroll::-webkit-scrollbar-thumb { background: #CBD5E1; border-radius: 3px; }
        .kanban-scroll::-webkit-scrollbar-thumb:hover { background: #94A3B8; }
      `}</style>
      
      {/* Header Section */}
      <PageHeader
        Icon={Receipt}
        title="VAT & TAX MANAGEMENT"
        subtitle="ระบบบริหารจัดการภาษีมูลค่าเพิ่มและรายงานภาษี (Tax Center)"
        extra={
          <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto">
            <div className="flex items-center bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden h-10 transition-all focus-within:border-[#111f42]">
              <div className="px-3 flex items-center text-slate-400">
                <Calendar size={14} />
              </div>
              <input 
                type="month" 
                value={selectedMonth} 
                onChange={(e) => setSelectedMonth(e.target.value)} 
                className="pr-4 py-2 text-[12px] font-bold text-[#111f42] outline-none cursor-pointer bg-transparent" 
              />
            </div>
            <div className="flex bg-white p-1 border border-slate-200 shadow-sm rounded-xl h-10">
              <button 
                onClick={() => setMainTab('kanban')} 
                className={`px-4 py-0 font-black transition-all flex items-center gap-2 uppercase tracking-widest rounded-lg text-[10px] ${mainTab === 'kanban' ? 'bg-[#111f42] text-white shadow-md' : 'text-slate-500 hover:bg-slate-50'}`}
              >
                <Kanban size={12} /> BOARD
              </button>
              <button 
                onClick={() => setMainTab('data')} 
                className={`px-4 py-0 font-black transition-all flex items-center gap-2 uppercase tracking-widest rounded-lg text-[10px] ${mainTab === 'data' ? 'bg-[#E3624A] text-white shadow-md' : 'text-slate-500 hover:bg-slate-50'}`}
              >
                <Database size={12} /> TAX RECORDS
              </button>
            </div>
            <button 
              onClick={() => setIsGuideOpen(true)} 
              className="w-10 h-10 flex items-center justify-center transition-all rounded-xl bg-white border border-slate-200 shadow-sm hover:bg-slate-100 text-slate-500"
            >
              <HelpCircle size={18} />
            </button>
          </div>
        }
      />

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 no-print animate-in fade-in duration-500">
        <KpiCard 
          title="Total Base Amount"
          value={`฿${totalBase?.toLocaleString()}`}
          icon={Receipt}
          color="#111f42"
          subValue="Revenue excluding tax"
        />
        <KpiCard 
          title="Output VAT (Sales)"
          value={`฿${(filteredData.filter((i: any)=>i.type==='Sales').reduce((s: number,i: any)=>s+i.vatAmount,0))?.toLocaleString()}`}
          icon={ArrowUpCircle}
          color="#ce5a43"
          subValue="Tax on sales collection"
        />
        <KpiCard 
          title="Input VAT (Purchase)"
          value={`฿${(filteredData.filter((i: any)=>i.type==='Purchase').reduce((s: number,i: any)=>s+i.vatAmount,0))?.toLocaleString()}`}
          icon={ArrowDownCircle}
          color="#496ca8"
          subValue="Tax from procurement"
        />
        <KpiCard 
          title="Net Tax Position"
          value={`฿${totalVat?.toLocaleString()}`}
          icon={ShieldCheck}
          color="#10b981"
          subValue="Tax payable or claimable"
        />
      </div>

      {mainTab === 'kanban' && (
        <KanbanBoard 
          taxRecords={taxRecords} 
        />
      )}

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

      <UserGuideDrawer 
        isGuideOpen={isGuideOpen}
        setIsGuideOpen={setIsGuideOpen}
      />
    </div>
  );
}

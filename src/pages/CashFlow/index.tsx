import React, { useState, useEffect, useMemo } from 'react';
import { 
  Search, 
  Download, 
  Printer,
  Calendar,
  X,
  CheckCircle,
  Kanban,
  FileText,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  HelpCircle,
  Database,
  ArrowUpRight,
  ArrowDownRight,
  AlertTriangle,
  Clock,
  Ban,
  RefreshCw,
  Link as LinkIcon,
  Lock,
  ShieldCheck,
  ArrowUpCircle, 
  ArrowDownCircle,
  TrendingUp,
  AlertCircle 
} from 'lucide-react';

import { PageHeader } from '../../components/shared/PageHeader';
import { KpiCard } from '../../components/shared/KpiCard';

export default function CashFlow() {
  const [mainTab, setMainTab] = useState('kanban'); // 'kanban' | 'data' 
  const [subTab, setSubTab] = useState('all'); 
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedMonth, setSelectedMonth] = useState('2026-03');
  const [transactions, setTransactions] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  
  // Modal States
  const [isGuideOpen, setIsGuideOpen] = useState(false);

  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  // Initialize Data - Synced with AR/AP and Master Data conceptually
  useEffect(() => {
    setLoading(true);
    setTimeout(() => {
      const mockData = [
        // SYNCED FROM AR (INFLOWS)
        { id: 1, date: '2026-02-10', refNo: 'INV-2026-001', description: 'Receipt from Home Pro', category: 'Sales', type: 'Inflow', amount: 69550, status: 'Cleared', source: 'AR' },
        { id: 2, date: '2026-03-01', refNo: 'INV-2026-002', description: 'Receipt from IKEA Thailand', category: 'Sales', type: 'Inflow', amount: 90000, status: 'Cleared', source: 'AR' },
        { id: 3, date: '2026-02-28', refNo: 'INV-2026-004', description: 'Expected from Siam Design', category: 'Sales', type: 'Inflow', amount: 120000, status: 'Delayed', source: 'AR' },
        { id: 4, date: '2026-03-12', refNo: 'INV-2026-006', description: 'Expected from Thaiwat Material', category: 'Sales', type: 'Inflow', amount: 45000, status: 'Pending', source: 'AR' },
        { id: 5, date: '2026-04-05', refNo: 'INV-2026-010', description: 'Expected from Office Mate', category: 'Sales', type: 'Inflow', amount: 32000, status: 'Forecasted', source: 'AR' },

        // SYNCED FROM AP (OUTFLOWS)
        { id: 6, date: '2026-03-10', refNo: 'VB-2026-002', description: 'Payment to Wood Inter', category: 'Raw Materials', type: 'Outflow', amount: 120000, status: 'Cleared', source: 'AP' },
        { id: 7, date: '2026-03-05', refNo: 'VB-2026-003', description: 'Payment to Fastner Pro', category: 'Raw Materials', type: 'Outflow', amount: 45000, status: 'Cleared', source: 'AP' },
        { id: 8, date: '2026-03-25', refNo: 'VB-2026-001', description: 'Expected Pay to Thai Steel Co.', category: 'Raw Materials', type: 'Outflow', amount: 85000, status: 'Forecasted', source: 'AP' },
        { id: 9, date: '2026-02-28', refNo: 'VB-2026-004', description: 'Overdue Pay to Global Chem', category: 'Raw Materials', type: 'Outflow', amount: 150000, status: 'Delayed', source: 'AP' },
        { id: 10, date: '2026-03-20', refNo: 'VB-2026-009', description: 'Expected Pay to Clean Pro Services', category: 'Overhead', type: 'Outflow', amount: 18000, status: 'Pending', source: 'AP' },

        // MANUAL ENTRIES (TAX, PAYROLL, ETC) VIA MASTER DATA
        { id: 11, date: '2026-03-08', refNo: 'PAY-001', description: 'Payroll March 2026', category: 'Payroll', type: 'Outflow', amount: 250000, status: 'Cleared', source: 'Master' },
        { id: 12, date: '2026-03-01', refNo: 'EXP-055', description: 'Office Rent', category: 'Overhead', type: 'Outflow', amount: 45000, status: 'Cleared', source: 'Master' },
        { id: 13, date: '2026-03-28', refNo: 'TAX-001', description: 'VAT Payment Feb 2026', category: 'Taxes', type: 'Outflow', amount: 315000, status: 'Forecasted', source: 'Master' },
      ];
      setTransactions(mockData);
      setLoading(false);
    }, 600);
  }, []);

  const filteredData = useMemo(() => {
    let result = transactions;
    if (subTab !== 'all') {
      if (subTab === 'Inflow' || subTab === 'Outflow') {
        result = result?.filter(tx => tx.type === subTab);
      } else {
        result = result?.filter(tx => tx.status === subTab);
      }
    }
    if (searchTerm) {
      const q = searchTerm.toLowerCase();
      result = result?.filter(tx => tx.refNo.toLowerCase().includes(q) || tx.description.toLowerCase().includes(q));
    }
    return result;
  }, [transactions, subTab, searchTerm]);

  useEffect(() => { setCurrentPage(1); }, [subTab, selectedMonth, searchTerm, itemsPerPage, mainTab]);

  const totalInflows = filteredData?.filter(i => i.type === 'Inflow' && i.status === 'Cleared')?.reduce((s, i) => s + i.amount, 0);
  const totalOutflows = filteredData?.filter(i => i.type === 'Outflow' && i.status === 'Cleared')?.reduce((s, i) => s + i.amount, 0);
  const netPending = filteredData?.filter(i => i.status === 'Pending' || i.status === 'Forecasted')?.reduce((s, i) => i.type === 'Inflow' ? s + i.amount : s - i.amount, 0);

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredData.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);

  const formatDate = (dateString: string) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString('th-TH', { day: 'numeric', month: 'short', year: '2-digit' });
  };

  const getSourceBadge = (source: string) => {
    switch (source) {
      case 'AR': return <span className="bg-emerald-50 text-emerald-600 border border-emerald-100 text-[8px] px-1.5 py-0.5 rounded-full font-black uppercase tracking-tighter">Inflow/AR</span>;
      case 'AP': return <span className="bg-rose-50 text-rose-600 border border-rose-100 text-[8px] px-1.5 py-0.5 rounded-full font-black uppercase tracking-tighter">Outflow/AP</span>;
      default: return <span className="bg-slate-50 text-slate-500 border border-slate-100 text-[8px] px-1.5 py-0.5 rounded-full font-black uppercase tracking-tighter">Direct/Master</span>;
    }
  };

  return (
    <div className="flex flex-col space-y-4 w-full relative flex-1 animate-fade-in-up">
      <style>{`
        .kanban-scroll::-webkit-scrollbar { width: 6px; height: 6px; }
        .kanban-scroll::-webkit-scrollbar-track { background: transparent; }
        .kanban-scroll::-webkit-scrollbar-thumb { background: #CBD5E1; border-radius: 3px; }
        .kanban-scroll::-webkit-scrollbar-thumb:hover { background: #94A3B8; }
        @media print {
          @page { size: A4 landscape; margin: 15mm; }
          .no-print { display: none !important; }
        }
      `}</style>
      
      {/* Header Section */}
      <PageHeader
        Icon={RefreshCw}
        title="CASH FLOW MANAGEMENT"
        subtitle="วิเคราะห์กระแสเงินสดและพยากรณ์สภาพคล่อง (Forecasting)"
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
                <Database size={12} /> DETAILED DATA
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
          title="Cleared Inflows"
          value={`฿${totalInflows?.toLocaleString()}`}
          icon={ArrowUpCircle}
          color="#10b981"
          subValue="Revenue collected and cleared"
        />
        <KpiCard 
          title="Cleared Outflows"
          value={`฿${totalOutflows?.toLocaleString()}`}
          icon={ArrowDownCircle}
          color="#ce5a43"
          subValue="Payments settled successfully"
        />
        <KpiCard 
          title="Net Cash Position"
          value={`฿${(totalInflows - totalOutflows)?.toLocaleString()}`}
          icon={TrendingUp}
          color="#111f42"
          subValue="Actual cash balance change"
        />
        <KpiCard 
          title="Net Pending/Forecast"
          value={`฿${netPending?.toLocaleString()}`}
          icon={AlertCircle}
          color={netPending >= 0 ? "#10b981" : "#ce5a43"}
          subValue="Future expected liquidity"
        />
      </div>

      {mainTab === 'kanban' && (
        <div className="flex-1 overflow-x-auto overflow-y-hidden kanban-scroll flex h-full">
          <div className="flex gap-4 h-full min-w-max items-start">
            {[
              { id: 'Forecasted', title: 'คาดการณ์ (Forecasted)', color: 'bg-slate-400' },
              { id: 'Pending', title: 'กำลังดำเนินการ (Pending)', color: 'bg-amber-400' },
              { id: 'Cleared', title: 'สำเร็จ (Cleared)', color: 'bg-emerald-400' },
              { id: 'Delayed', title: 'ล่าช้า (Delayed)', color: 'bg-rose-400' },
              { id: 'Cancelled', title: 'ยกเลิก (Cancelled)', color: 'bg-fuchsia-400' },
            ]?.map(col => {
              const colItems = transactions?.filter(i => i.status === col.id);
              return (
                <div key={col.id} className="w-[300px] flex-shrink-0 flex flex-col h-full bg-slate-50/50 rounded-2xl p-4 border border-slate-200 shadow-sm">
                  <div className="flex justify-between items-center mb-4">
                    <h4 className="font-black text-[#111f42] text-[10px] uppercase tracking-widest flex items-center gap-2">
                      <div className={`w-2.5 h-2.5 rounded-full ${col.color}`}></div> {col.title}
                    </h4>
                    <span className="bg-white text-[#111f42] text-[10px] px-2 py-0.5 rounded-full font-bold border border-slate-200 shadow-sm">{colItems.length}</span>
                  </div>
                  <div className="flex-1 overflow-y-auto kanban-scroll space-y-3 pr-2">
                    {colItems?.map(tx => (
                      <div key={tx.id} className="bg-white p-4 rounded-xl shadow-sm border border-slate-100 group relative hover:border-[#111f42]/30 transition-all">
                        <div className="flex justify-between items-center mb-2">
                          <span className="font-mono text-[9px] font-bold px-2 py-0.5 rounded bg-slate-50 border border-slate-200 text-slate-500 uppercase tracking-widest">{tx.refNo}</span>
                          {getSourceBadge(tx.source)}
                        </div>
                        <h5 className="font-black text-[12px] text-[#111f42] mb-1 leading-snug uppercase tracking-tight">{tx.description}</h5>
                        <p className="text-[10px] font-mono text-slate-400 mb-3 uppercase tracking-widest">{formatDate(tx.date)}</p>
                        <div className="border-t border-slate-100 pt-3 flex justify-between items-center">
                          <span className={`text-[12px] font-black ${tx.type === 'Inflow' ? 'text-emerald-600' : 'text-rose-600'}`}>
                            {tx.type === 'Inflow' ? '+' : '-'} ฿{tx.amount?.toLocaleString()}
                          </span>
                          <span className="text-[8px] font-black text-slate-300 uppercase tracking-widest flex items-center gap-1"><Lock size={8}/> SYNCED</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {mainTab === 'data' && (
        <div className="bg-white border border-slate-200 shadow-sm overflow-hidden rounded-xl flex-1 flex flex-col transition-all">
          <div className="p-3 flex items-center justify-between gap-4 bg-white/80 border-b border-slate-200 overflow-x-auto flex-shrink-0">
            <div className="flex items-center gap-4 flex-shrink-0">
              <div className="relative flex items-center">
                <select 
                  value={subTab} onChange={(e) => setSubTab(e.target.value)}
                  className="appearance-none bg-white border border-slate-200 shadow-sm rounded-lg pl-4 pr-10 py-2 text-[10px] font-bold text-[#111f42] uppercase tracking-widest outline-none focus:border-[#111f42] cursor-pointer h-10"
                >
                  <option value="all">All Records</option>
                  <option value="Inflow">Only Inflows</option>
                  <option value="Outflow">Only Outflows</option>
                  <option value="Forecasted">Forecasted</option>
                  <option value="Cleared">Cleared</option>
                </select>
                <ChevronDown size={14} className="absolute right-3 pointer-events-none text-slate-400" />
              </div>

              <div className="relative w-64 flex items-center bg-white border border-slate-200 shadow-sm rounded-lg px-3 py-1.5 h-10">
                <Search className="text-slate-400" size={16} />
                <input 
                  type="text" 
                  placeholder="Search ref or description..." 
                  className="w-full bg-transparent border-none outline-none ml-2 text-[#111f42] font-black uppercase tracking-widest placeholder:opacity-50 text-[10px]"
                  value={searchTerm}
                  onChange={e => setSearchTerm(e.target.value)}
                />
              </div>
            </div>

            <div className="flex items-center gap-2 justify-end flex-shrink-0 ml-auto">
              <button 
                className="h-10 py-0 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 transition-all font-black text-[10px] uppercase tracking-widest flex items-center gap-2 shadow-sm"
              >
                <Printer size={16} /> PRINT REPORT
              </button>
              <button 
                className="h-10 py-0 rounded-lg bg-[#111f42] text-white hover:bg-[#1a2d5c] transition-all font-black text-[10px] uppercase tracking-widest flex items-center gap-2 shadow-md"
              >
                <Download size={16} className="text-[#E3624A]" /> EXPORT CSV
              </button>
            </div>
          </div>

          <div className="overflow-x-auto flex-1 kanban-scroll bg-white">
            <table className="w-full text-left border-collapse min-w-[1000px]">
              <thead className="bg-[#111f42] text-white sticky top-0 z-10">
                <tr>
                  <th className="text-[10px] font-black uppercase tracking-[0.2em] w-32">Date</th>
                  <th className="text-[10px] font-black uppercase tracking-[0.2em] w-40">Ref No.</th>
                  <th className="text-[10px] font-black uppercase tracking-[0.2em]">Description / Category</th>
                  <th className="text-[10px] font-black uppercase tracking-[0.2em] w-32">Source</th>
                  <th className="text-[10px] font-black uppercase tracking-[0.2em] text-right w-40">Amount</th>
                  <th className="text-[10px] font-black uppercase tracking-[0.2em] text-center w-32">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {currentItems?.map(tx => (
                  <tr key={tx.id} className="hover:bg-slate-50 transition-colors group">
                    <td className="font-mono text-[11px] text-slate-500">{formatDate(tx.date)}</td>
                    <td className="font-mono text-[11px] font-black text-[#111f42] tracking-tighter uppercase">{tx.refNo}</td>
                    <td className="">
                      <div className="font-black text-[#111f42] uppercase text-[12px]">{tx.description}</div>
                      <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{tx.category}</div>
                    </td>
                    <td className="">{getSourceBadge(tx.source)}</td>
                    <td className="text-right">
                      <span className={`font-black text-[13px] ${tx.type === 'Inflow' ? 'text-emerald-600' : 'text-rose-600'}`}>
                        {tx.type === 'Inflow' ? '+' : '-'} ฿{tx.amount?.toLocaleString()}
                      </span>
                    </td>
                    <td className="text-center">
                      <span className={`inline-flex px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border ${
                        tx.status === 'Cleared' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' :
                        tx.status === 'Delayed' ? 'bg-rose-50 text-rose-600 border-rose-100' :
                        tx.status === 'Forecasted' ? 'bg-slate-50 text-slate-500 border-slate-100' :
                        'bg-amber-50 text-amber-600 border-amber-100'
                      }`}>
                        {tx.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="bg-white border-t border-slate-100 flex items-center justify-between shadow-inner">
            <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
              Showing {indexOfFirstItem + 1}-{Math.min(indexOfLastItem, filteredData.length)} of {filteredData.length} records
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 mr-4">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Rows:</span>
                <select 
                  value={itemsPerPage} onChange={e => setItemsPerPage(Number(e.target.value))}
                  className="bg-slate-50 border border-slate-200 rounded px-2 py-1 text-[10px] font-black text-[#111f42]"
                >
                  <option value={5}>5</option>
                  <option value={10}>10</option>
                  <option value={20}>20</option>
                </select>
              </div>
              <div className="flex items-center gap-1">
                <button 
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage(p => p - 1)}
                  className="p-2 rounded-lg hover:bg-slate-100 disabled:opacity-30 transition-all"
                >
                  <ChevronLeft size={16} />
                </button>
                <div className="flex items-center">
                  {Array.from({ length: totalPages }, (_, i) => i + 1)?.map(p => (
                    <button 
                      key={p} onClick={() => setCurrentPage(p)}
                      className={`w-8 h-8 rounded-lg font-black text-[10px] transition-all ${currentPage === p ? 'bg-[#111f42] text-white shadow-md' : 'text-slate-400 hover:bg-slate-50'}`}
                    >
                      {p}
                    </button>
                  ))}
                </div>
                <button 
                  disabled={currentPage === totalPages}
                  onClick={() => setCurrentPage(p => p + 1)}
                  className="p-2 rounded-lg hover:bg-slate-100 disabled:opacity-30 transition-all"
                >
                  <ChevronRight size={16} />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* User Guide Drawer */}
      {isGuideOpen && (
        <>
          <div className="fixed inset-0 bg-[#111f42]/40 backdrop-blur-sm z-[100] animate-in fade-in duration-200 no-print" onClick={() => setIsGuideOpen(false)} />
          <div className="fixed inset-y-0 right-0 w-full md:w-[450px] bg-white shadow-2xl z-[110] flex flex-col animate-in slide-in-from-right duration-300 no-print">
            <div className="py-5 flex justify-between items-center bg-[#111f42] text-white shrink-0">
              <h2 className="text-base font-black uppercase tracking-[0.2em] flex items-center gap-3"><HelpCircle size={20} className="text-[#E3624A]" /> CASH FLOW GUIDE</h2>
              <button onClick={() => setIsGuideOpen(false)} className="hover:bg-white/20 p-2 rounded-lg transition-colors"><X size={20} /></button>
            </div>
            <div className="flex-1 overflow-y-auto p-8 text-slate-700 bg-slate-50 space-y-8">
               <section>
                  <h4 className="font-black text-[#111f42] uppercase text-[12px] tracking-widest border-b-2 border-[#111f42]/10 pb-2 mb-4">1. Data Integration</h4>
                  <p className="leading-relaxed text-[13px]">หน้าจอนี้ดึงข้อมูลอัตโนมัติจากโมดูล **AR (Accounts Receivable)** สำหรับรายรับ และ **AP (Accounts Payable)** สำหรับรายจ่าย</p>
               </section>
            </div>
            <div className="p-6 border-t bg-white flex justify-end shrink-0"><button onClick={()=>setIsGuideOpen(false)} className="bg-[#111f42] text-white px-10 py-3 rounded-xl font-black text-[12px] uppercase tracking-[0.2em] shadow-xl hover:bg-[#1e346b] transition-all">CLOSE GUIDE</button></div>
          </div>
        </>
      )}
    </div>
  );
}

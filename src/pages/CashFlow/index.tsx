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
  ShieldCheck
} from 'lucide-react';

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
        result = result.filter(tx => tx.type === subTab);
      } else {
        result = result.filter(tx => tx.status === subTab);
      }
    }
    if (searchTerm) {
      const q = searchTerm.toLowerCase();
      result = result.filter(tx => tx.refNo.toLowerCase().includes(q) || tx.description.toLowerCase().includes(q));
    }
    return result;
  }, [transactions, subTab, searchTerm]);

  useEffect(() => { setCurrentPage(1); }, [subTab, selectedMonth, searchTerm, itemsPerPage, mainTab]);

  const totalInflows = filteredData.filter(i => i.type === 'Inflow' && i.status === 'Cleared').reduce((s, i) => s + i.amount, 0);
  const totalOutflows = filteredData.filter(i => i.type === 'Outflow' && i.status === 'Cleared').reduce((s, i) => s + i.amount, 0);
  const netPending = filteredData.filter(i => i.status === 'Pending' || i.status === 'Forecasted').reduce((s, i) => i.type === 'Inflow' ? s + i.amount : s - i.amount, 0);

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredData.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);

  const formatDate = (dateString: string) => {
    if (!dateString) return '-';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' });
  };

  const getSourceBadge = (source: string) => {
    if (source === 'AR') return <span className="flex items-center gap-0.5 px-1.5 py-0.5 bg-blue-100 text-blue-700 rounded text-[8px] font-bold tracking-widest uppercase border border-blue-200"><LinkIcon size={8}/> AR Sync</span>;
    if (source === 'AP') return <span className="flex items-center gap-0.5 px-1.5 py-0.5 bg-rose-100 text-rose-700 rounded text-[8px] font-bold tracking-widest uppercase border border-rose-200"><LinkIcon size={8}/> AP Sync</span>;
    return <span className="px-1.5 py-0.5 bg-indigo-100 text-indigo-700 rounded text-[8px] font-bold tracking-widest uppercase border border-indigo-200 flex items-center gap-0.5"><Database size={8}/> Master</span>;
  };

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
                    <linearGradient id="cfGradient" x1="0" y1="0" x2="24" y2="24" gradientUnits="userSpaceOnUse">
                      <stop stopColor="#933b5b" offset="0%" />
                      <stop stopColor="#ce5a43" offset="100%" />
                    </linearGradient>
                  </defs>
                </svg>
                <Database size={24} strokeWidth={2.5} stroke="url(#cfGradient)" />
              </div>
              <div className="flex flex-col justify-center">
                <h1 className="text-2xl tracking-tight uppercase leading-none drop-shadow-sm">
                  <span className="text-[#223149] font-light">CASH FLOW</span> <span className="text-[#933b5b] font-black">RECORDS</span>
                </h1>
                <p className="font-medium text-[12px] uppercase tracking-widest mt-1 text-[#496ca8] leading-none">
                  ฐานข้อมูลรับ-จ่าย (Read-Only Database)
                </p>
              </div>
            </div>
            
            <div className="flex items-center justify-end gap-2 w-full lg:w-auto overflow-x-auto custom-scrollbar pb-1">
              <div className="flex items-center bg-white/80 backdrop-blur-md border border-white/50 rounded-lg overflow-hidden shadow-sm shrink-0">
                <div className="px-2 py-1.5 bg-white/50 border-r border-white/50 text-[#496ca8]">
                  <Calendar size={14} />
                </div>
                <input 
                  type="month" value={selectedMonth} readOnly
                  className="px-2 py-1.5 text-[11px] font-bold text-[#223149] bg-transparent outline-none cursor-default"
                />
              </div>

              <div className="flex bg-white/80 backdrop-blur-md p-1 border border-white/50 shadow-sm rounded-lg shrink-0">
                <button 
                  onClick={() => setMainTab('kanban')} 
                  className="px-4 py-1.5 font-bold transition-all flex items-center gap-1.5 uppercase tracking-widest rounded text-[10px]"
                  style={mainTab === 'kanban' ? { backgroundColor: '#ce5a43', color: 'white', boxShadow: '0 2px 4px -1px rgba(206,90,67,0.3)' } : { color: '#7693a6', backgroundColor: 'transparent' }}
                >
                  <Kanban size={12} /> BOARD
                </button>
                <button 
                  onClick={() => setMainTab('data')} 
                  className="px-4 py-1.5 font-bold transition-all flex items-center gap-1.5 uppercase tracking-widest rounded text-[10px]"
                  style={mainTab === 'data' ? { background: 'linear-gradient(to right, #933b5b, #ce5a43)', color: 'white', boxShadow: '0 2px 4px -1px rgba(147,59,91,0.3)' } : { color: '#7693a6', backgroundColor: 'transparent' }}
                >
                  <Database size={12} /> DETAILED DATA
                </button>
              </div>

              <button 
                onClick={() => setIsGuideOpen(true)}
                className="p-2 transition-all flex items-center justify-center rounded-lg bg-white/80 backdrop-blur-md text-[#496ca8] hover:bg-white border border-white/50 shadow-sm hover:shadow shrink-0"
              >
                <HelpCircle size={16} />
              </button>
            </div>
          </div>

          {/* =========================================
              VIEW: KANBAN BOARD (Read-Only)
             ========================================= */}
          {mainTab === 'kanban' && (
            <div className="flex-1 overflow-x-auto overflow-y-hidden kanban-scroll pb-4 flex h-full mt-2">
              <div className="flex gap-6 h-full min-w-max items-start">
                {[
                  { id: 'Forecasted', title: 'คาดการณ์ (Forecasted)', color: 'bg-[#7693a6]' },
                  { id: 'Pending', title: 'กำลังดำเนินการ (Pending)', color: 'bg-[#d9b343]' },
                  { id: 'Cleared', title: 'สำเร็จ (Cleared)', color: 'bg-[#7fa85a]' },
                  { id: 'Delayed', title: 'ล่าช้า (Delayed)', color: 'bg-[#ce5a43]' },
                  { id: 'Cancelled', title: 'ยกเลิก (Cancelled)', color: 'bg-[#933b5b]' },
                ].map(col => {
                  const colItems = transactions.filter(i => i.status === col.id);
                  return (
                    <div key={col.id} className="w-[320px] flex-shrink-0 flex flex-col h-full bg-white/60 backdrop-blur-md rounded-2xl p-4 border border-white shadow-sm">
                      <div className="flex justify-between items-center mb-4">
                        <h4 className="font-black text-[#223149] text-xs uppercase tracking-widest flex items-center gap-2">
                          <div className={`w-2.5 h-2.5 rounded-full ${col.color}`}></div> {col.title}
                        </h4>
                        <span className="bg-white/80 text-[#223149] text-[10px] px-2 py-0.5 rounded-full font-bold border border-white shadow-sm">{colItems.length}</span>
                      </div>
                      <div className="flex-1 overflow-y-auto kanban-scroll space-y-3 pr-2">
                        {colItems.map(tx => (
                          <div key={tx.id} className="bg-white/90 backdrop-blur p-4 rounded-xl shadow-sm border border-white group relative">
                            <div className="flex justify-between items-center mb-2">
                              <span className="font-mono text-[10px] font-bold px-2 py-0.5 rounded bg-slate-50 border border-slate-200 text-[#223149]">{tx.refNo}</span>
                              {getSourceBadge(tx.source)}
                            </div>
                            <h5 className="font-bold text-sm text-[#223149] mb-1 leading-snug">{tx.description}</h5>
                            <p className="text-[9px] font-mono text-[#7693a6] mb-3">Date: {formatDate(tx.date)}</p>
                            <div className="border-t border-black/5 pt-3 flex justify-between items-center">
                              <span className={`text-xs font-black ${tx.type === 'Inflow' ? 'text-[#7fa85a]' : 'text-[#ce5a43]'}`}>
                                {tx.type === 'Inflow' ? '+' : '-'}฿{tx.amount.toLocaleString()}
                              </span>
                              <span className="text-[8px] font-black text-slate-300 uppercase tracking-widest flex items-center gap-1"><Lock size={8}/> Synchronized</span>
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

          {/* =========================================
              VIEW: DETAILED DATA (Data Table)
             ========================================= */}
          {mainTab === 'data' && (
            <div className="bg-white/90 backdrop-blur-md border border-white shadow-sm overflow-hidden rounded-none flex-1 flex flex-col mt-2">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-0 border-b border-slate-200">
                <div className="p-4 border-r border-slate-200 flex flex-col justify-center bg-emerald-50/30">
                  <p className="text-[10px] font-bold text-[#7fa85a] uppercase tracking-widest mb-1 flex items-center gap-1"><ArrowUpRight size={12}/> Cleared Inflows</p>
                  <p className="text-xl font-black text-[#7fa85a] font-mono">฿{totalInflows.toLocaleString()}</p>
                </div>
                <div className="p-4 border-r border-slate-200 flex flex-col justify-center bg-rose-50/30">
                  <p className="text-[10px] font-bold text-[#ce5a43] uppercase tracking-widest mb-1 flex items-center gap-1"><ArrowDownRight size={12}/> Cleared Outflows</p>
                  <p className="text-xl font-black text-[#ce5a43] font-mono">฿{totalOutflows.toLocaleString()}</p>
                </div>
                <div className="p-4 flex flex-col justify-center bg-[#223149] text-white">
                  <p className="text-[10px] font-bold text-[#a8bbbf] uppercase tracking-widest mb-1 flex items-center gap-1"><AlertTriangle size={12}/> Net Pending/Forecasted</p>
                  <p className={`text-xl font-black font-mono ${netPending >= 0 ? 'text-[#7fa85a]' : 'text-[#ce5a43]'}`}>
                    {netPending >= 0 ? '+' : ''}฿{netPending.toLocaleString()}
                  </p>
                </div>
              </div>

              <div className="p-3 flex items-center justify-between gap-4 bg-white/80 border-b border-slate-200 overflow-x-auto flex-shrink-0">
                <div className="flex items-center gap-4 flex-shrink-0">
                  <div className="relative flex items-center">
                    <select 
                      value={subTab} onChange={(e) => setSubTab(e.target.value)}
                      className="appearance-none bg-white border border-slate-200 shadow-sm rounded-lg pl-4 pr-10 py-2 text-[10px] font-bold text-[#223149] uppercase tracking-widest outline-none focus:border-[#496ca8] cursor-pointer"
                    >
                      <option value="all">All Records</option>
                      <option value="Inflow">Only Inflows</option>
                      <option value="Outflow">Only Outflows</option>
                      <option value="Forecasted">Forecasted</option>
                      <option value="Cleared">Cleared</option>
                    </select>
                    <ChevronDown size={14} className="absolute right-3 pointer-events-none text-[#7693a6]" />
                  </div>
                  <div className="relative w-64 flex items-center bg-white border border-slate-200 shadow-sm rounded-lg px-3 py-1.5">
                    <Search className="text-[#7693a6]" size={16} />
                    <input 
                      type="text" placeholder="Search Ref or Desc..." 
                      className="w-full bg-transparent border-none outline-none ml-2 text-[#223149] font-medium placeholder-[#7693a6] text-[12px]"
                      value={searchTerm} onChange={e => setSearchTerm(e.target.value)}
                    />
                  </div>
                </div>

                <div className="flex items-center gap-2 justify-end flex-shrink-0 ml-auto font-black text-[#223149]">
                  <button className="p-2.5 rounded-lg border border-slate-200 hover:bg-slate-50 transition-all flex items-center gap-2 font-bold text-[10px] uppercase tracking-widest text-[#496ca8]">
                    <Download size={16} /> Export
                  </button>
                  <div className="h-6 w-px mx-2 bg-slate-300" />
                  <div className="flex items-center gap-2 px-5 py-2.5 rounded-lg border border-slate-200 bg-slate-50 text-slate-400 font-bold uppercase tracking-widest text-[10px] cursor-not-allowed">
                    <Lock size={14} /> Locked (Auto-Sync)
                  </div>
                </div>
              </div>

              <div className="overflow-x-auto flex-1 custom-scrollbar bg-white">
                <table className="w-full text-left border-collapse min-w-[1000px]">
                  <thead className="bg-gradient-to-r from-[#223149] to-[#3c5d7d] text-white sticky top-0 z-10">
                    <tr className="border-b-4 border-[#ce5a43]">
                      <th className="px-4 py-4 text-[10px] font-bold uppercase tracking-widest whitespace-nowrap">Date</th>
                      <th className="px-4 py-4 text-[10px] font-bold uppercase tracking-widest whitespace-nowrap text-center">Source</th>
                      <th className="px-4 py-4 text-[10px] font-bold uppercase tracking-widest whitespace-nowrap">Reference</th>
                      <th className="px-4 py-4 text-[10px] font-bold uppercase tracking-widest">Description</th>
                      <th className="px-4 py-4 text-[10px] font-bold uppercase tracking-widest text-center">Type</th>
                      <th className="px-4 py-4 text-[10px] font-bold uppercase tracking-widest text-right whitespace-nowrap">Amount</th>
                      <th className="px-4 py-4 text-[10px] font-bold uppercase tracking-widest text-center whitespace-nowrap">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {currentItems.map((tx) => (
                      <tr key={tx.id} className="hover:bg-slate-50 transition-colors">
                        <td className="px-4 py-3 font-mono whitespace-nowrap">{formatDate(tx.date)}</td>
                        <td className="px-4 py-3 text-center">{getSourceBadge(tx.source)}</td>
                        <td className="px-4 py-3 font-mono font-bold text-[#496ca8]">{tx.refNo}</td>
                        <td className="px-4 py-3 font-medium text-[#223149]">
                           {tx.description}
                           <span className="block text-[9px] text-slate-400 mt-0.5">{tx.category}</span>
                        </td>
                        <td className="px-4 py-3 text-center whitespace-nowrap">
                          <span className={`px-2 py-1 rounded text-[9px] font-bold uppercase tracking-wider ${tx.type === 'Inflow' ? 'bg-[#7fa85a]/10 text-[#7fa85a]' : 'bg-[#ce5a43]/10 text-[#ce5a43]'}`}>
                            {tx.type}
                          </span>
                        </td>
                        <td className={`px-4 py-3 font-mono font-black text-right whitespace-nowrap ${tx.type === 'Inflow' ? 'text-[#7fa85a]' : 'text-[#ce5a43]'}`}>
                          {tx.type === 'Inflow' ? '+' : '-'}฿{tx.amount.toLocaleString()}
                        </td>
                        <td className="px-4 py-3 text-center whitespace-nowrap">
                          <span className={`px-2 py-1 rounded text-[9px] font-bold uppercase tracking-wider
                            ${tx.status === 'Cleared' ? 'bg-[#7fa85a]/10 text-[#7fa85a]' : 
                              tx.status === 'Pending' ? 'bg-[#d9b343]/10 text-[#d9b343]' :
                              tx.status === 'Forecasted' ? 'bg-slate-100 text-slate-500' :
                              'bg-[#ce5a43]/10 text-[#ce5a43]'}`}>
                            {tx.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* User Guide Drawer */}
          {isGuideOpen && (
            <div className="fixed inset-0 z-[60] flex justify-end no-print">
              <div className="absolute inset-0 bg-[#223149]/40 backdrop-blur-sm animate-in fade-in duration-300" onClick={() => setIsGuideOpen(false)}></div>
              <div className="relative w-full max-w-md h-full bg-white shadow-2xl flex flex-col animate-in slide-in-from-right duration-300 border-l border-white/20">
                <div className="px-6 py-5 flex justify-between items-center bg-[#223149] text-white shrink-0 shadow-md">
                  <h2 className="text-base font-bold uppercase tracking-widest flex items-center gap-2">
                    <HelpCircle size={20} className="text-[#df8a5d]" /> คู่มือการใช้งาน (USER GUIDE)
                  </h2>
                  <button onClick={() => setIsGuideOpen(false)} className="hover:bg-white/20 p-1.5 rounded-lg transition-colors"><X size={20} /></button>
                </div>
                
                <div className="flex-1 overflow-y-auto p-6 md:p-8 bg-[#f5f0e9] text-[13px] text-[#223149] space-y-6">
                  <div className="bg-emerald-50 border border-emerald-200 p-4 rounded-xl flex items-start gap-3 text-emerald-800 shadow-sm mb-6">
                    <div className="bg-emerald-100 p-1.5 rounded-lg shrink-0"><RefreshCw size={18} className="text-emerald-600"/></div>
                    <div className="flex-1 min-w-0">
                       <p className="text-[12px] font-black uppercase text-emerald-700 mb-1">Auto-Sync & Master Data Policy</p>
                       <p className="text-[11px] font-bold leading-relaxed">
                         หน้านี้ทำหน้าที่แสดงผลข้อมูลแบบ **Read-Only** เท่านั้น โดยข้อมูลทั้งหมดจะถูกซิงค์มาจาก:
                         <br/>• **AR Sync:** รายการรับชำระจากลูกหนี้
                         <br/>• **AP Sync:** รายการจ่ายชำระให้เจ้าหนี้
                         <br/>• **Master:** รายการอื่นๆ เช่น ภาษีหรือเงินเดือนที่บันทึกผ่าน Master Data Center
                       </p>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-sm font-black text-[#223149] border-b-2 border-[#ce5a43]/30 pb-2 mb-3 flex items-center gap-2"><Lock size={16} className="text-[#ce5a43]"/> 1. การแก้ไขข้อมูล</h3>
                    <p className="font-medium leading-relaxed bg-blue-50 p-3 rounded-lg border border-blue-100 text-blue-800">
                      เพื่อความถูกต้องสูงสุดและป้องกันข้อมูลขัดแย้ง <span className="font-bold underline">ระบบได้ล็อกการแก้ไขและเพิ่มข้อมูลในหน้านี้</span> หากต้องการอัปเดต ต้องกลับไปดำเนินการที่หน้า **Master Data Entry** เท่านั้น
                    </p>
                  </div>

                  <div>
                    <h3 className="text-sm font-black text-[#223149] border-b-2 border-[#ce5a43]/30 pb-2 mb-3 flex items-center gap-2"><Kanban size={16} className="text-[#ce5a43]"/> 2. มุมมองกระแสเงินสด</h3>
                    <ul className="list-disc pl-5 space-y-1.5 marker:text-[#ce5a43] font-medium">
                      <li><strong>BOARD:</strong> ติดตามสถานะของเงินในท่อ (Pipeline) ตั้งแต่ Forecast ไปจนถึงสำเร็จ (Cleared)</li>
                      <li><strong>DETAILED DATA:</strong> ตารางข้อมูลรวมที่ระบุแหล่งที่มา (Source) ของเงินแต่ละรายการอย่างชัดเจน</li>
                    </ul>
                  </div>
                </div>

                <div className="p-5 bg-white border-t border-slate-100 flex justify-end shrink-0 shadow-inner">
                  <button onClick={() => setIsGuideOpen(false)} className="px-6 py-2.5 rounded-lg font-bold bg-[#223149] text-white hover:opacity-90 transition-colors uppercase tracking-wider">
                    เข้าใจแล้ว (Close)
                  </button>
                </div>
              </div>
            </div>
          )}

        </div>
      </div>
    </>
  );
}

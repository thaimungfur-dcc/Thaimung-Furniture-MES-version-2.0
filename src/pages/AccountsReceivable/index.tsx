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
  TrendingUp,
  AlertCircle
} from 'lucide-react';

import { PageHeader } from '../../components/shared/PageHeader';
import { KpiCard } from '../../components/shared/KpiCard';
import KanbanBoard from './components/KanbanBoard';
import InvoiceTable from './components/InvoiceTable';
import PaymentModal from './components/PaymentModal';
import PrintPreviewModal from './components/PrintPreviewModal';
import WacdCalc from './components/WacdCalc';
import UserGuideDrawer from './components/UserGuideDrawer';
import { isOverdue } from './utils';

export default function AccountsReceivable() {
  const [mainTab, setMainTab] = useState('kanban'); // 'kanban' | 'invoices' | 'wacd'
  const [subTab, setSubTab] = useState('all'); 
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedMonth, setSelectedMonth] = useState('2026-03');
  const [invoices, setInvoices] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  
  // Modal States
  const [paymentModal, setPaymentModal] = useState<any>(null);
  const [previewModal, setPreviewModal] = useState<any>(null);
  const [isGuideOpen, setIsGuideOpen] = useState(false);

  const [paymentForm, setPaymentForm] = useState({
    date: new Date().toISOString().split('T')[0],
    amount: 0,
    method: 'Transfer',
    reference: '',
    note: ''
  });

  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  // Initialize Data - Synced from Sale Order conceptually
  useEffect(() => {
    setLoading(true);
    setTimeout(() => {
      const mockData = [
        { id: 1, issueDate: '2026-02-10', dueDate: '2026-03-12', invoiceNo: 'INV-2026-001', soRef: 'SO-2602-044', customerId: 'C-101', customer: 'Home Pro (Thailand)', industry: 'Retail', creditTerm: 30, amount: 69550, paid: 0, balance: 69550, status: 'Open', isBadDebt: false, risk: 'Low' },
        { id: 2, issueDate: '2026-02-05', dueDate: '2026-03-07', invoiceNo: 'INV-2026-002', soRef: 'SO-2602-012', customerId: 'C-102', customer: 'IKEA Thailand', industry: 'Retail', creditTerm: 30, amount: 90000, paid: 0, balance: 90000, status: 'Open', isBadDebt: false, risk: 'Low' },
        { id: 3, issueDate: '2026-01-20', dueDate: '2026-02-19', invoiceNo: 'INV-2026-003', soRef: 'SO-2601-098', customerId: 'C-105', customer: 'Baan & Beyond', industry: 'Retail', creditTerm: 30, amount: 45000, paid: 0, balance: 45000, status: 'Overdue', isBadDebt: false, risk: 'Medium' },
        { id: 4, issueDate: '2025-12-15', dueDate: '2026-01-14', invoiceNo: 'INV-2026-004', soRef: 'SO-2512-441', customerId: 'C-120', customer: 'Siam Design', industry: 'Construction', creditTerm: 30, amount: 120000, paid: 0, balance: 120000, status: 'Overdue', isBadDebt: true, risk: 'High' },
        { id: 5, issueDate: '2026-03-01', dueDate: '2026-03-31', invoiceNo: 'INV-2026-005', soRef: 'SO-2603-001', customerId: 'C-101', customer: 'Home Pro (Thailand)', industry: 'Retail', creditTerm: 30, amount: 35000, paid: 35000, balance: 0, status: 'Paid', isBadDebt: false, risk: 'Low' },
      ];
      setInvoices(mockData);
      setLoading(false);
    }, 600);
  }, []);

  const filteredInvoices = useMemo(() => {
    let result = invoices;
    if (subTab !== 'all') {
      if (subTab === 'BadDebt') result = result.filter(inv => inv.isBadDebt);
      else result = result.filter(inv => inv.status === subTab);
    }
    if (searchTerm) {
      const q = searchTerm.toLowerCase();
      result = result.filter(inv => inv.invoiceNo.toLowerCase().includes(q) || inv.customer.toLowerCase().includes(q) || inv.soRef.toLowerCase().includes(q));
    }
    return result;
  }, [invoices, subTab, searchTerm]);

  useEffect(() => { setCurrentPage(1); }, [subTab, selectedMonth, searchTerm, itemsPerPage, mainTab]);

  const updateStatus = (id: number, newStatus: string) => {
    setInvoices(prev => prev?.map(inv => inv.id === id ? { ...inv, status: newStatus } : inv));
  };

  const toggleBadDebt = (id: number) => {
    setInvoices(prev => prev?.map(inv => inv.id === id ? { ...inv, isBadDebt: !inv.isBadDebt } : inv));
  };

  const handlePaymentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (paymentModal) {
      const invId = paymentModal.id;
      setInvoices(prev => prev?.map(inv => {
        if (inv.id === invId) {
          const newPaid = inv.paid + paymentForm.amount;
          return {
            ...inv,
            paid: newPaid,
            balance: inv.amount - newPaid,
            status: newPaid >= inv.amount ? 'Paid' : 'Partial'
          };
        }
        return inv;
      }));
      setPaymentModal(null);
    }
  };

  const totalOutstanding = invoices.reduce((s, i) => (!i.isBadDebt ? s + i.balance : s), 0);
  const totalOverdueAmount = invoices.reduce((s, i) => isOverdue(i) ? s + i.balance : s, 0);
  const totalBadDebtAmount = invoices.reduce((s, i) => i.isBadDebt ? s + i.balance : s, 0);

  // Pagination Calculation
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredInvoices.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredInvoices.length / itemsPerPage);

  const executePrint = () => {
    setPreviewModal(null);
    setTimeout(() => window.print(), 100);
  };

  const executeExportCSV = () => {
    const headers = ['Issue Date', 'Due Date', 'Inv No.', 'SO Ref', 'Customer', 'Industry', 'Credit Term', 'Risk', 'Amount', 'Paid', 'Balance', 'Status', 'Is Bad Debt'];
    const csvRows = [
      headers.join(','),
      ...filteredInvoices?.map(row => [
        row.issueDate, row.dueDate, row.invoiceNo, row.soRef, `"${row.customer}"`, row.industry, row.creditTerm, row.risk, row.amount, row.paid, row.balance, row.status, row.isBadDebt
      ].join(','))
    ].join('\n');

    const blob = new Blob(['\uFEFF' + csvRows], { type: 'text/csv;charset=utf-8;' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.setAttribute('href', url);
    a.setAttribute('download', `AR_Detailed_Database_${subTab}_${selectedMonth}.csv`);
    a.click();
    setPreviewModal(null);
  };

  return (
    <div className="flex flex-col space-y-4 w-full relative flex-1 animate-fade-in-up">
      <style>{`
        @keyframes fadeUp { from { opacity: 0; transform: translate(-50%, 5px); } to { opacity: 1; transform: translate(-50%, 0); } }
        .animate-fade-up { animation: fadeUp 0.2s ease-out forwards; }
        .kanban-scroll::-webkit-scrollbar { width: 6px; height: 6px; }
        .kanban-scroll::-webkit-scrollbar-track { background: transparent; }
        .kanban-scroll::-webkit-scrollbar-thumb { background: #CBD5E1; border-radius: 3px; }
        .kanban-scroll::-webkit-scrollbar-thumb:hover { background: #94A3B8; }

        @media print {
          @page { size: A4 landscape; margin: 15mm; }
          body { background-color: white !important; -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; }
          .no-print { display: none !important; }
          .print-container { padding: 0 !important; width: 100% !important; max-width: none !important; background: white !important; }
          .print-only { display: block !important; }
          table { page-break-inside: auto; width: 100%; }
          tr { page-break-inside: avoid; page-break-after: auto; }
          thead { display: table-header-group; }
          tfoot { display: table-footer-group; }
          .break-inside-avoid { page-break-inside: avoid; break-inside: avoid; }
          .bg-white { background-color: white !important; }
          .text-white { color: black !important; }
        }
        .print-only { display: none; }
      `}</style>
      
      {/* Header Section */}
      <PageHeader
        Icon={RefreshCw}
        title="ACCOUNTS RECEIVABLE"
        subtitle="ระบบจัดการฐานข้อมูลลูกหนี้และการจัดเก็บรายได้ (Collection Management)"
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
                onClick={() => setMainTab('invoices')} 
                className={`px-4 py-0 font-black transition-all flex items-center gap-2 uppercase tracking-widest rounded-lg text-[10px] ${mainTab === 'invoices' ? 'bg-[#E3624A] text-white shadow-md' : 'text-slate-500 hover:bg-slate-50'}`}
              >
                <Database size={12} /> DETAILED INVOICES
              </button>
              <button 
                onClick={() => setMainTab('wacd')} 
                className={`px-4 py-0 font-black transition-all flex items-center gap-2 uppercase tracking-widest rounded-lg text-[10px] ${mainTab === 'wacd' ? 'bg-[#1e3a8a] text-white shadow-md' : 'text-slate-500 hover:bg-slate-50'}`}
              >
                <RefreshCw size={12} /> WACD CALC
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
          title="Total Receivable"
          value={`฿${(invoices.reduce((s, i) => s + i.balance, 0))?.toLocaleString()}`}
          icon={TrendingUp}
          color="#111f42"
          subValue="Current outstanding AR"
        />
        <KpiCard 
          title="Total Overdue"
          value={`฿${(invoices.reduce((s, i) => isOverdue(i) ? s + i.balance : s, 0))?.toLocaleString()}`}
          icon={AlertCircle}
          color="#ce5a43"
          subValue="Past due invoice amount"
        />
        <KpiCard 
          title="Bad Debt Reserve"
          value={`฿${(invoices.reduce((s, i) => i.isBadDebt ? s + i.balance : s, 0))?.toLocaleString()}`}
          icon={AlertCircle}
          color="#933b5b"
          subValue="High risk/uncollectible"
        />
        <KpiCard 
          title="Collection Rate"
          value={`${((invoices.reduce((s,i)=>s+i.paid,0) / (invoices.reduce((s,i)=>s+i.amount,0)||1)) * 100).toFixed(1)}%`}
          icon={CheckCircle}
          color="#10b981"
          subValue="Cash inflow efficiency"
        />
      </div>

      {/* Main Content Area */}
      {mainTab === 'kanban' && (
        <KanbanBoard 
          invoices={invoices} 
          updateStatus={updateStatus} 
          setPaymentModal={setPaymentModal} 
        />
      )}

      {mainTab === 'invoices' && (
        <InvoiceTable 
          invoices={invoices}
          loading={loading}
          subTab={subTab}
          setSubTab={setSubTab}
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          executeExportCSV={executeExportCSV}
          totalOutstanding={totalOutstanding}
          totalOverdueAmount={totalOverdueAmount}
          totalBadDebtAmount={totalBadDebtAmount}
          currentItems={currentItems}
          totalPages={totalPages}
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
          itemsPerPage={itemsPerPage}
          setItemsPerPage={setItemsPerPage}
          filteredInvoices={filteredInvoices}
          indexOfFirstItem={indexOfFirstItem}
          indexOfLastItem={indexOfLastItem}
          setPaymentModal={setPaymentModal}
          toggleBadDebt={toggleBadDebt}
          setPreviewModal={setPreviewModal}
        />
      )}

      {mainTab === 'wacd' && (
        <WacdCalc invoices={invoices} />
      )}

      <PaymentModal 
        paymentModal={paymentModal}
        setPaymentModal={setPaymentModal}
        paymentForm={paymentForm}
        setPaymentForm={setPaymentForm}
        handlePaymentSubmit={handlePaymentSubmit}
      />

      <PrintPreviewModal 
        previewModal={previewModal}
        setPreviewModal={setPreviewModal}
        executePrint={executePrint}
        filteredInvoices={filteredInvoices}
        totalOutstanding={totalOutstanding}
        totalOverdueAmount={totalOverdueAmount}
        totalBadDebtAmount={totalBadDebtAmount}
        subTab={subTab}
      />

      <UserGuideDrawer 
        isGuideOpen={isGuideOpen}
        setIsGuideOpen={setIsGuideOpen}
      />
    </div>
  );
}

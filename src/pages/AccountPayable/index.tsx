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
  AlertCircle,
  TrendingUp,
  LayoutList
} from 'lucide-react';

import { PageHeader } from '../../components/shared/PageHeader';
import { KpiCard } from '../../components/shared/KpiCard';
import KanbanBoard from './components/KanbanBoard';
import BillTable from './components/BillTable';
import PaymentModal from './components/PaymentModal';
import PrintPreviewModal from './components/PrintPreviewModal';
import UserGuideDrawer from './components/UserGuideDrawer';
import { isOverdue } from './utils';

export default function AccountPayable() {
  const [mainTab, setMainTab] = useState('kanban'); // 'kanban' | 'invoices' 
  const [subTab, setSubTab] = useState('all'); 
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedMonth, setSelectedMonth] = useState('2026-03');
  const [bills, setBills] = useState<any[]>([]);
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

  // Initialize Data - Synced from Procurement conceptually
  useEffect(() => {
    setLoading(true);
    setTimeout(() => {
      const mockData = [
        { id: 1, issueDate: '2026-02-10', dueDate: '2026-03-12', billNo: 'VB-2026-001', poRef: 'PO-2602-015', vendorId: 'V-001', vendor: 'Thai Steel Co.', vendorType: 'Material', creditTerm: 30, amount: 85000, paid: 0, balance: 85000, status: 'Open', isDisputed: false, risk: 'Low', exceptionReason: '' },
        { id: 2, issueDate: '2026-02-05', dueDate: '2026-03-07', billNo: 'VB-2026-002', poRef: 'PO-2602-008', vendorId: 'V-002', vendor: 'Wood Inter Co.', vendorType: 'Material', creditTerm: 30, amount: 120000, paid: 0, balance: 120000, status: 'Waiting Approval', isDisputed: false, risk: 'Low', exceptionReason: '' },
        { id: 3, issueDate: '2026-01-20', dueDate: '2026-02-19', billNo: 'VB-2026-003', poRef: 'PO-2601-112', vendorId: 'V-003', vendor: 'Fastner Pro', vendorType: 'Spare Parts', creditTerm: 30, amount: 45000, paid: 0, balance: 45000, status: 'Open', isDisputed: false, risk: 'High', exceptionReason: 'Quality Discrepancy' },
        { id: 4, issueDate: '2025-12-15', dueDate: '2026-01-14', billNo: 'VB-2026-004', poRef: 'PO-2512-099', vendorId: 'V-004', vendor: 'Global Chemical Ltd.', vendorType: 'Chemical', creditTerm: 30, amount: 150000, paid: 0, balance: 150000, status: 'Overdue', isDisputed: true, risk: 'Critical', exceptionReason: 'Invoice mismatch' },
        { id: 5, issueDate: '2026-03-01', dueDate: '2026-03-31', billNo: 'VB-2026-005', poRef: 'PO-2603-001', vendorId: 'V-001', vendor: 'Thai Steel Co.', vendorType: 'Material', creditTerm: 30, amount: 65000, paid: 65000, balance: 0, status: 'Paid', isDisputed: false, risk: 'Low', exceptionReason: '' },
      ];
      setBills(mockData);
      setLoading(false);
    }, 600);
  }, []);

  const filteredBills = useMemo(() => {
    let result = bills;
    if (subTab !== 'all') {
      if (subTab === 'Disputed') result = result?.filter(b => b.isDisputed);
      else result = result?.filter(b => b.status === subTab);
    }
    if (searchTerm) {
      const q = searchTerm.toLowerCase();
      result = result?.filter(b => b.billNo.toLowerCase().includes(q) || b.vendor.toLowerCase().includes(q) || b.poRef.toLowerCase().includes(q));
    }
    return result;
  }, [bills, subTab, searchTerm]);

  useEffect(() => { setCurrentPage(1); }, [subTab, selectedMonth, searchTerm, itemsPerPage, mainTab]);

  const updateStatus = (id: number, newStatus: string) => {
    setBills(prev => prev?.map(b => b.id === id ? { ...b, status: newStatus } : b));
  };

  const toggleDisputed = (id: number) => {
    setBills(prev => prev?.map(b => b.id === id ? { ...b, isDisputed: !b.isDisputed } : b));
  };

  const handlePaymentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (paymentModal) {
      const billId = paymentModal.id;
      setBills(prev => prev?.map(b => {
        if (b.id === billId) {
          const newPaid = b.paid + paymentForm.amount;
          return {
            ...b,
            paid: newPaid,
            balance: b.amount - newPaid,
            status: newPaid >= b.amount ? 'Paid' : 'Partial'
          };
        }
        return b;
      }));
      setPaymentModal(null);
    }
  };

  const totalPayable = bills?.reduce((s, i) => (!i.isDisputed ? s + i.balance : s), 0);
  const totalOverdueAmount = bills?.reduce((s, i) => isOverdue(i) ? s + i.balance : s, 0);
  const totalDisputedAmount = bills?.reduce((s, i) => i.isDisputed ? s + i.balance : s, 0);

  // Pagination Calculation
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredBills.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredBills.length / itemsPerPage);

  const executePrint = () => {
    setPreviewModal(null);
    setTimeout(() => window.print(), 100);
  };

  const executeExportCSV = () => {
    const headers = ['Issue Date', 'Due Date', 'Bill No.', 'PO Ref', 'Vendor', 'Vendor Type', 'Credit Term (Days)', 'Risk Level', 'Exception', 'Amount', 'Disc. Available', 'Disc. Captured', 'Paid', 'Balance', 'Status', 'Is Disputed'];
    const csvRows = [
      headers.join(','),
      ...(filteredBills?.map(row => [
        row.issueDate, row.dueDate, row.billNo, row.poRef, `"${row.vendor}"`, row.vendorType, row.creditTerm, row.risk, `"${row.exceptionReason}"`, row.amount, row.discountAvailable, row.discountCaptured, row.paid, row.balance, row.status, row.isDisputed
      ].join(',')) || [])
    ].join('\n');

    const blob = new Blob(['\uFEFF' + csvRows], { type: 'text/csv;charset=utf-8;' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.setAttribute('href', url);
    a.setAttribute('download', `AP_Detailed_Database_${subTab}_${selectedMonth}.csv`);
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
        Icon={Database}
        title="ACCOUNTS PAYABLE"
        subtitle="ระบบจัดการฐานข้อมูลเจ้าหนี้และบอร์ดอนุมัติจ่าย (Database)"
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
                <Database size={12} /> DETAILED BILLS
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
          title="Total Payable"
          value={`฿${totalPayable?.toLocaleString()}`}
          icon={Database}
          color="#111f42"
          subValue="Current outstanding balance"
        />
        <KpiCard 
          title="Total Overdue"
          value={`฿${totalOverdueAmount?.toLocaleString()}`}
          icon={AlertCircle}
          color="#ce5a43"
          subValue="Past due payment amount"
        />
        <KpiCard 
          title="Disputed/Exception"
          value={`฿${totalDisputedAmount?.toLocaleString()}`}
          icon={AlertCircle}
          color="#933b5b"
          subValue="Bills with active issues"
        />
        <KpiCard 
          title="Payment Progress"
          value={`${((bills?.reduce((s,i)=>s+i.paid,0) / (bills?.reduce((s,i)=>s+i.amount,0)||1)) * 100).toFixed(1)}%`}
          icon={CheckCircle}
          color="#10b981"
          subValue="Completed settlement ratio"
        />
      </div>

      {/* Main Content Area */}
      {mainTab === 'kanban' && (
        <KanbanBoard 
          bills={bills} 
          updateStatus={updateStatus} 
          setPaymentModal={setPaymentModal} 
        />
      )}

      {mainTab === 'invoices' && (
        <BillTable 
          bills={bills}
          loading={loading}
          subTab={subTab}
          setSubTab={setSubTab}
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          executeExportCSV={executeExportCSV}
          totalPayable={totalPayable}
          totalOverdueAmount={totalOverdueAmount}
          totalDisputedAmount={totalDisputedAmount}
          currentItems={currentItems}
          totalPages={totalPages}
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
          itemsPerPage={itemsPerPage}
          setItemsPerPage={setItemsPerPage}
          filteredBills={filteredBills}
          indexOfFirstItem={indexOfFirstItem}
          indexOfLastItem={indexOfLastItem}
          setPaymentModal={setPaymentModal}
          toggleDisputed={toggleDisputed}
          setPreviewModal={setPreviewModal}
        />
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
        filteredBills={filteredBills}
        totalPayable={totalPayable}
        totalOverdueAmount={totalOverdueAmount}
        totalDisputedAmount={totalDisputedAmount}
        subTab={subTab}
      />

      <UserGuideDrawer 
        isGuideOpen={isGuideOpen}
        setIsGuideOpen={setIsGuideOpen}
      />
    </div>
  );
}

import React, { useState, useEffect, useMemo } from 'react';
import { 
  Calendar,
  HelpCircle,
  Database,
  Activity,
  Kanban,
  RefreshCw
} from 'lucide-react';
import KanbanBoard from './components/KanbanBoard';
import InvoiceTable from './components/InvoiceTable';
import WacdCalc from './components/WacdCalc';
import PaymentModal from './components/PaymentModal';
import PrintPreviewModal from './components/PrintPreviewModal';
import UserGuideDrawer from './components/UserGuideDrawer';
import { isOverdue } from './utils';

export default function ARDatabase() {
  const [mainTab, setMainTab] = useState('invoices'); // 'kanban' | 'invoices' | 'wacd'
  const [subTab, setSubTab] = useState('all'); 
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedMonth, setSelectedMonth] = useState('2026-03');
  const [invoices, setInvoices] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  
  // Modal States
  const [previewModal, setPreviewModal] = useState<string | null>(null); 
  const [paymentModal, setPaymentModal] = useState<any>(null); 
  const [isGuideOpen, setIsGuideOpen] = useState(false);
  
  const [paymentForm, setPaymentForm] = useState({
    amount: '',
    date: new Date().toISOString().split('T')[0],
    method: 'Bank Transfer',
    ref: ''
  });

  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  // Initialize Comprehensive Data
  useEffect(() => {
    setLoading(true);
    setTimeout(() => {
      const mockData = [
        { id: 1, invNo: 'INV-2026-001', soRef: 'SO-2026-001', customer: 'Home Pro', customerType: 'Returning', issueDate: '2026-01-05', dueDate: '2026-02-05', payDate: '2026-02-10', creditTerm: 30, amount: 69550, paid: 69550, balance: 0, status: 'Paid', risk: 'Low', isBadDebt: false },
        { id: 2, invNo: 'INV-2026-002', soRef: 'SO-2026-002', customer: 'IKEA Thailand', customerType: 'Returning', issueDate: '2026-01-10', dueDate: '2026-02-10', payDate: '2026-03-01', creditTerm: 30, amount: 90000, paid: 90000, balance: 0, status: 'Paid', risk: 'Low', isBadDebt: false },
        { id: 3, invNo: 'INV-2026-003', soRef: 'SO-2026-003', customer: 'Index Living', customerType: 'Returning', issueDate: '2026-02-01', dueDate: '2026-03-01', payDate: '2026-02-15', creditTerm: 30, amount: 35000, paid: 35000, balance: 0, status: 'Paid', risk: 'Low', isBadDebt: false },
        { id: 4, invNo: 'INV-2026-004', soRef: 'SO-2026-004', customer: 'Siam Design', customerType: 'New', issueDate: '2026-01-14', dueDate: '2026-02-28', payDate: null, creditTerm: 45, amount: 120000, paid: 0, balance: 120000, status: 'Overdue', risk: 'High', isBadDebt: false },
        { id: 5, invNo: 'INV-2026-005', soRef: 'SO-2026-005', customer: 'SB Furniture', customerType: 'Returning', issueDate: '2026-02-13', dueDate: '2026-03-15', payDate: '2026-03-12', creditTerm: 30, amount: 150000, paid: 150000, balance: 0, status: 'Paid', risk: 'Low', isBadDebt: false },
        { id: 6, invNo: 'INV-2026-006', soRef: 'SO-2026-006', customer: 'Thaiwat Material', customerType: 'Returning', issueDate: '2026-02-10', dueDate: '2026-03-12', payDate: null, creditTerm: 30, amount: 45000, paid: 0, balance: 45000, status: 'Waiting Payment', risk: 'Medium', isBadDebt: false },
        { id: 7, invNo: 'INV-2026-007', soRef: 'SO-2026-007', customer: 'BKK Furniture', customerType: 'New', issueDate: '2026-01-01', dueDate: '2026-02-15', payDate: '2026-02-20', creditTerm: 45, amount: 25000, paid: 10000, balance: 15000, status: 'Overdue', risk: 'High', isBadDebt: false },
        { id: 8, invNo: 'INV-2026-008', soRef: 'SO-2026-008', customer: 'Modern Home Co.', customerType: 'New', issueDate: '2026-02-26', dueDate: '2026-03-28', payDate: null, creditTerm: 30, amount: 55000, paid: 0, balance: 55000, status: 'Pending Billing', risk: 'Medium', isBadDebt: false },
        { id: 9, invNo: 'INV-2026-009', soRef: 'SO-2026-009', customer: 'Central Group', customerType: 'Returning', issueDate: '2026-02-18', dueDate: '2026-03-20', payDate: null, creditTerm: 30, amount: 88000, paid: 0, balance: 88000, status: 'Waiting Payment', risk: 'Low', isBadDebt: false },
        { id: 10, invNo: 'INV-2026-010', soRef: 'SO-2026-010', customer: 'Office Mate', customerType: 'Returning', issueDate: '2026-03-06', dueDate: '2026-04-05', payDate: null, creditTerm: 30, amount: 32000, paid: 0, balance: 32000, status: 'Billed', risk: 'Low', isBadDebt: false },
        { id: 11, invNo: 'INV-2026-011', soRef: 'SO-2026-011', customer: 'Global Exports Co.', customerType: 'New', issueDate: '2025-12-27', dueDate: '2026-02-10', payDate: null, creditTerm: 45, amount: 85000, paid: 0, balance: 85000, status: 'Overdue', risk: 'High', isBadDebt: true },
        { id: 12, invNo: 'INV-2026-012', soRef: 'SO-2026-012', customer: 'Coastal Shipping', customerType: 'New', issueDate: '2025-11-26', dueDate: '2026-01-25', payDate: '2026-02-10', creditTerm: 60, amount: 145000, paid: 50000, balance: 95000, status: 'Overdue', risk: 'High', isBadDebt: true },
        { id: 13, invNo: 'INV-2026-013', soRef: 'SO-2026-013', customer: 'TechAdvantage Software', customerType: 'Returning', issueDate: '2026-01-06', dueDate: '2026-02-05', payDate: null, creditTerm: 30, amount: 62000, paid: 0, balance: 62000, status: 'Overdue', risk: 'Medium', isBadDebt: false },
      ];
      
      const processed = mockData.map(inv => {
        const today = new Date('2026-03-12'); 
        const due = new Date(inv.dueDate);
        
        if (inv.isBadDebt) inv.status = 'Bad Debt';
        else if (inv.balance === 0) inv.status = 'Paid';
        else if (due < today) inv.status = 'Overdue';
        
        return inv;
      });
      
      setInvoices(processed);
      setLoading(false);
    }, 600);
  }, []);

  const updateStatus = (id: number, newStatus: string) => {
    setInvoices(invoices.map(inv => inv.id === id ? { ...inv, status: newStatus } : inv));
  };

  const toggleBadDebt = (id: number) => {
    setInvoices(invoices.map(inv => {
      if (inv.id === id) {
        const isNowBadDebt = !inv.isBadDebt;
        let newStatus = inv.status;
        
        if (isNowBadDebt) newStatus = 'Bad Debt';
        else if (inv.balance === 0) newStatus = 'Paid';
        else if (new Date(inv.dueDate) < new Date('2026-03-12')) newStatus = 'Overdue';
        else newStatus = 'Waiting Payment';

        return { ...inv, isBadDebt: isNowBadDebt, status: newStatus, risk: isNowBadDebt ? 'High' : inv.risk };
      }
      return inv;
    }));
  };

  const handlePaymentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!paymentModal) return;
    
    const payAmt = parseFloat(paymentForm.amount) || 0;
    if (payAmt <= 0) return;

    setInvoices(invoices.map(inv => {
      if (inv.id === paymentModal.id) {
        const newPaid = inv.paid + payAmt;
        const newBalance = Math.max(0, inv.amount - newPaid);
        
        return {
          ...inv,
          paid: newPaid,
          balance: newBalance,
          payDate: newBalance === 0 ? paymentForm.date : inv.payDate,
          status: newBalance === 0 ? 'Paid' : (inv.isBadDebt ? 'Bad Debt' : inv.status)
        };
      }
      return inv;
    }));

    setPaymentModal(null);
    setPaymentForm({ amount: '', date: new Date().toISOString().split('T')[0], method: 'Bank Transfer', ref: '' });
  };

  const filteredInvoices = useMemo(() => {
    let result = invoices;
    if (subTab === 'Unpaid') result = result.filter(b => b.balance > 0 && !b.isBadDebt);
    else if (subTab === 'Overdue') result = result.filter(b => isOverdue(b));
    else if (subTab === 'BadDebt') result = result.filter(b => b.isBadDebt);
    else if (subTab === 'Exception') result = result.filter(b => b.exceptionReason && b.exceptionReason.trim() !== '');
    
    if (searchTerm) {
      const q = searchTerm.toLowerCase();
      result = result.filter(b => b.invNo.toLowerCase().includes(q) || b.customer.toLowerCase().includes(q));
    }
    return result;
  }, [invoices, subTab, searchTerm]);

  useEffect(() => {
    setCurrentPage(1);
  }, [subTab, selectedMonth, searchTerm, itemsPerPage, mainTab]);

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
    const headers = ['Issue Date', 'Due Date', 'Invoice No.', 'SO Ref', 'Customer', 'Customer Type', 'Credit Term (Days)', 'Risk Level', 'Exception', 'Amount', 'Paid', 'Balance', 'Status', 'Is Bad Debt'];
    const csvRows = [
      headers.join(','),
      ...filteredInvoices.map(row => [
        row.issueDate, row.dueDate, row.invNo, row.soRef, `"${row.customer}"`, row.customerType, row.creditTerm, row.risk, `"${row.exceptionReason}"`, row.amount, row.paid, row.balance, row.status, row.isBadDebt
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
    <>
      <style>{`
        * { font-family: 'JetBrains Mono', 'Noto Sans Thai', sans-serif !important; }
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
      
      <div className="min-h-screen p-4 md:p-6 transition-colors duration-500 text-[12px] print-container overflow-hidden flex flex-col bg-gradient-to-br from-[#f5f0e9] via-[#f0ede5] to-[#c6c2bb]">
        <div className="w-full space-y-6 relative max-w-[1600px] mx-auto flex-1 flex flex-col h-full overflow-hidden">
          
          {/* Top Main Navigation Header */}
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 no-print flex-shrink-0">
            <div className="flex items-center gap-4 shrink-0">
              <div className="relative w-12 h-12 bg-white flex items-center justify-center shadow-lg flex-shrink-0 rounded-2xl border-[3px] border-white/60 bg-clip-padding backdrop-blur-sm">
                <svg width="0" height="0" className="absolute">
                  <defs>
                    <linearGradient id="arGradient" x1="0" y1="0" x2="24" y2="24" gradientUnits="userSpaceOnUse">
                      <stop stopColor="#933b5b" offset="0%" />
                      <stop stopColor="#ce5a43" offset="100%" />
                    </linearGradient>
                  </defs>
                </svg>
                <Database size={24} strokeWidth={2.5} stroke="url(#arGradient)" />
              </div>
              <div className="flex flex-col justify-center">
                <h1 className="text-2xl tracking-tight uppercase leading-none drop-shadow-sm">
                  <span className="text-[#223149] font-light">ACCOUNTS</span> <span className="text-[#933b5b] font-black">RECEIVABLE</span>
                </h1>
                <p className="font-medium text-[12px] uppercase tracking-widest mt-1 text-[#496ca8] leading-none">
                  ระบบจัดการฐานข้อมูลลูกหนี้และบอร์ดติดตามหนี้ (Database)
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

              {/* Main Tabs */}
              <div className="flex bg-white/80 backdrop-blur-md p-1 border border-white/50 shadow-sm rounded-lg shrink-0">
                <button 
                  onClick={() => setMainTab('kanban')} 
                  className="px-4 py-1.5 font-bold transition-all flex items-center gap-1.5 uppercase tracking-widest rounded text-[10px] whitespace-nowrap"
                  style={mainTab === 'kanban' ? { backgroundColor: '#ce5a43', color: 'white', boxShadow: '0 2px 4px -1px rgba(206,90,67,0.3)' } : { color: '#7693a6', backgroundColor: 'transparent' }}
                >
                  <Kanban size={12} /> BOARD
                </button>
                <button 
                  onClick={() => setMainTab('invoices')} 
                  className="px-4 py-1.5 font-bold transition-all flex items-center gap-1.5 uppercase tracking-widest rounded text-[10px] whitespace-nowrap"
                  style={mainTab === 'invoices' ? { background: 'linear-gradient(to right, #933b5b, #ce5a43)', color: 'white', boxShadow: '0 2px 4px -1px rgba(147,59,91,0.3)' } : { color: '#7693a6', backgroundColor: 'transparent' }}
                >
                  <Database size={12} /> DETAILED INVOICES
                </button>
                <button 
                  onClick={() => setMainTab('wacd')} 
                  className="px-4 py-1.5 font-bold transition-all flex items-center gap-1.5 uppercase tracking-widest rounded text-[10px] whitespace-nowrap"
                  style={mainTab === 'wacd' ? { backgroundColor: '#223149', color: 'white', boxShadow: '0 2px 4px -1px rgba(34,49,73,0.3)' } : { color: '#7693a6', backgroundColor: 'transparent' }}
                >
                  <Activity size={12} /> WACD CALC
                </button>
              </div>

              <button 
                onClick={() => setIsGuideOpen(true)}
                className="p-2 transition-all flex items-center justify-center rounded-lg bg-white/80 backdrop-blur-md text-[#496ca8] hover:bg-white border border-white/50 shadow-sm hover:shadow shrink-0"
                title="คู่มือการใช้งาน (User Guide)"
              >
                <HelpCircle size={16} />
              </button>
            </div>
          </div>

          {/* Removed SYNC NOTIFICATION BANNER as requested */}

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
      </div>
    </>
  );
}

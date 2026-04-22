import React, { useState, useEffect, useMemo } from 'react';
import { 
  Calendar,
  HelpCircle,
  Database,
  Kanban
} from 'lucide-react';
import KanbanBoard from './components/KanbanBoard';
import BillTable from './components/BillTable';
import PaymentModal from './components/PaymentModal';
import PrintPreviewModal from './components/PrintPreviewModal';
import UserGuideDrawer from './components/UserGuideDrawer';
import { isOverdue } from './utils';

export default function APDatabase() {
  const [mainTab, setMainTab] = useState('invoices'); // 'kanban' | 'invoices'
  const [subTab, setSubTab] = useState('all'); 
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedMonth, setSelectedMonth] = useState('2026-03');
  const [bills, setBills] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  
  // Modal States
  const [previewModal, setPreviewModal] = useState<string | null>(null); 
  const [paymentModal, setPaymentModal] = useState<any>(null); 
  const [isGuideOpen, setIsGuideOpen] = useState(false);
  
  const [paymentForm, setPaymentForm] = useState({
    amount: '',
    discountCaptured: '',
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
        { id: 1, billNo: 'VB-2026-001', poRef: 'PO-2026-001', vendor: 'Thai Steel Co.', vendorType: 'Contract', issueDate: '2026-02-23', receivedDate: '2026-02-24', approvedDate: '2026-02-28', dueDate: '2026-03-25', payDate: null, creditTerm: 30, amount: 85000, discountAvailable: 1700, discountCaptured: 0, paid: 0, balance: 85000, exceptionReason: '', status: 'Pending Approval', risk: 'Low', isDisputed: false },
        { id: 2, billNo: 'VB-2026-002', poRef: 'PO-2026-002', vendor: 'Wood Inter', vendorType: 'Contract', issueDate: '2026-02-08', receivedDate: '2026-02-09', approvedDate: '2026-02-12', dueDate: '2026-03-10', payDate: null, creditTerm: 30, amount: 120000, discountAvailable: 2400, discountCaptured: 2400, paid: 117600, balance: 0, exceptionReason: '', status: 'Paid', risk: 'Low', isDisputed: false },
        { id: 3, billNo: 'VB-2026-003', poRef: 'PO-2026-003', vendor: 'Fastner Pro', vendorType: 'Spot', issueDate: '2026-02-03', receivedDate: '2026-02-05', approvedDate: '2026-02-10', dueDate: '2026-03-05', payDate: '2026-03-04', creditTerm: 30, amount: 45000, discountAvailable: 0, discountCaptured: 0, paid: 45000, balance: 0, exceptionReason: '', status: 'Paid', risk: 'Low', isDisputed: false },
        { id: 4, billNo: 'VB-2026-004', poRef: 'PO-2026-004', vendor: 'Global Chem', vendorType: 'Critical', issueDate: '2026-01-14', receivedDate: '2026-01-16', approvedDate: '2026-01-25', dueDate: '2026-02-28', payDate: null, creditTerm: 45, amount: 150000, discountAvailable: 3000, discountCaptured: 0, paid: 0, balance: 150000, exceptionReason: 'PO Mismatch / ไม่มีใบสั่งซื้อ', status: 'Overdue', risk: 'High', isDisputed: true },
        { id: 5, billNo: 'VB-2026-005', poRef: 'PO-2026-005', vendor: 'Office Mate', vendorType: 'Contract', issueDate: '2026-02-13', receivedDate: '2026-02-15', approvedDate: '2026-02-18', dueDate: '2026-03-15', payDate: '2026-03-12', creditTerm: 30, amount: 12500, discountAvailable: 0, discountCaptured: 0, paid: 12500, balance: 0, exceptionReason: '', status: 'Paid', risk: 'Low', isDisputed: false },
        { id: 6, billNo: 'VB-2026-006', poRef: 'PO-2026-006', vendor: 'Hardware House', vendorType: 'Contract', issueDate: '2026-02-10', receivedDate: '2026-02-12', approvedDate: '2026-02-16', dueDate: '2026-03-12', payDate: null, creditTerm: 30, amount: 55000, discountAvailable: 1100, discountCaptured: 0, paid: 0, balance: 55000, exceptionReason: '', status: 'Waiting Payment', risk: 'Medium', isDisputed: false },
        { id: 7, billNo: 'VB-2026-007', poRef: 'PO-2026-007', vendor: 'IT City', vendorType: 'Spot', issueDate: '2026-01-01', receivedDate: '2026-01-03', approvedDate: '2026-01-15', dueDate: '2026-02-15', payDate: '2026-02-20', creditTerm: 45, amount: 32000, discountAvailable: 0, discountCaptured: 0, paid: 10000, balance: 22000, exceptionReason: 'Price Discrepancy / ราคาไม่ตรง', status: 'Overdue', risk: 'High', isDisputed: false },
        { id: 8, billNo: 'VB-2026-008', poRef: 'PO-2026-008', vendor: 'Packaging World', vendorType: 'Contract', issueDate: '2026-02-26', receivedDate: '2026-02-28', approvedDate: '', dueDate: '2026-03-28', payDate: null, creditTerm: 30, amount: 48000, discountAvailable: 960, discountCaptured: 0, paid: 0, balance: 48000, exceptionReason: '', status: 'Pending Approval', risk: 'Medium', isDisputed: false },
        { id: 9, billNo: 'VB-2026-009', poRef: 'PO-2026-009', vendor: 'Clean Pro Services', vendorType: 'Spot', issueDate: '2026-02-18', receivedDate: '2026-02-19', approvedDate: '2026-02-22', dueDate: '2026-03-20', payDate: null, creditTerm: 30, amount: 18000, discountAvailable: 0, discountCaptured: 0, paid: 0, balance: 18000, exceptionReason: '', status: 'Waiting Payment', risk: 'Low', isDisputed: false },
        { id: 10, billNo: 'VB-2026-010', poRef: 'PO-2026-010', vendor: 'Logistics Plus', vendorType: 'Contract', issueDate: '2026-03-06', receivedDate: '2026-03-08', approvedDate: '2026-03-10', dueDate: '2026-04-05', payDate: null, creditTerm: 30, amount: 95000, discountAvailable: 0, discountCaptured: 0, paid: 0, balance: 95000, exceptionReason: '', status: 'Approved', risk: 'Low', isDisputed: false },
        { id: 11, billNo: 'VB-2026-011', poRef: 'PO-2026-011', vendor: 'Marketing Agency', vendorType: 'Spot', issueDate: '2025-12-27', receivedDate: '2025-12-28', approvedDate: '2026-01-05', dueDate: '2026-02-10', payDate: null, creditTerm: 45, amount: 75000, discountAvailable: 0, discountCaptured: 0, paid: 0, balance: 75000, exceptionReason: '', status: 'Overdue', risk: 'High', isDisputed: true },
        { id: 12, billNo: 'VB-2026-012', poRef: 'PO-2026-012', vendor: 'Consulting Group', vendorType: 'Spot', issueDate: '2025-11-26', receivedDate: '2025-11-28', approvedDate: '2025-12-05', dueDate: '2026-01-25', payDate: '2026-02-10', creditTerm: 60, amount: 110000, discountAvailable: 0, discountCaptured: 0, paid: 50000, balance: 60000, exceptionReason: '', status: 'Overdue', risk: 'High', isDisputed: true },
        { id: 13, billNo: 'VB-2026-013', poRef: 'PO-2026-013', vendor: 'TechAdvantage Software', vendorType: 'Contract', issueDate: '2026-01-06', receivedDate: '2026-01-08', approvedDate: '2026-01-12', dueDate: '2026-02-05', payDate: null, creditTerm: 30, amount: 62000, discountAvailable: 0, discountCaptured: 0, paid: 0, balance: 62000, exceptionReason: '', status: 'Overdue', risk: 'Medium', isDisputed: false },
      ];
      
      const processed = mockData.map(bill => {
        const today = new Date('2026-03-12'); 
        const due = new Date(bill.dueDate);
        
        if (bill.isDisputed) bill.status = 'Disputed';
        else if (bill.balance === 0) bill.status = 'Paid';
        else if (due < today) bill.status = 'Overdue';
        
        return bill;
      });
      
      setBills(processed);
      setLoading(false);
    }, 600);
  }, []);

  const updateStatus = (id: number, newStatus: string) => {
    setBills(bills.map(bill => bill.id === id ? { ...bill, status: newStatus } : bill));
  };

  const toggleDisputed = (id: number) => {
    setBills(bills.map(bill => {
      if (bill.id === id) {
        const isNowDisputed = !bill.isDisputed;
        let newStatus = bill.status;
        
        if (isNowDisputed) newStatus = 'Disputed';
        else if (bill.balance === 0) newStatus = 'Paid';
        else if (new Date(bill.dueDate) < new Date('2026-03-12')) newStatus = 'Overdue';
        else newStatus = 'Waiting Payment';

        return { ...bill, isDisputed: isNowDisputed, status: newStatus, risk: isNowDisputed ? 'High' : bill.risk };
      }
      return bill;
    }));
  };

  const handlePaymentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!paymentModal) return;
    
    const payAmt = parseFloat(paymentForm.amount) || 0;
    const discAmt = parseFloat(paymentForm.discountCaptured) || 0;
    const totalDeduction = payAmt + discAmt;

    if (totalDeduction <= 0) return;

    setBills(bills.map(bill => {
      if (bill.id === paymentModal.id) {
        const newPaid = bill.paid + payAmt;
        const newDiscountCaptured = (bill.discountCaptured || 0) + discAmt;
        const newBalance = Math.max(0, bill.amount - newPaid - newDiscountCaptured);
        
        return {
          ...bill,
          paid: newPaid,
          discountCaptured: newDiscountCaptured,
          balance: newBalance,
          payDate: newBalance === 0 ? paymentForm.date : bill.payDate,
          status: newBalance === 0 ? 'Paid' : (bill.isDisputed ? 'Disputed' : bill.status)
        };
      }
      return bill;
    }));

    setPaymentModal(null);
    setPaymentForm({ amount: '', discountCaptured: '', date: new Date().toISOString().split('T')[0], method: 'Bank Transfer', ref: '' });
  };

  const filteredBills = useMemo(() => {
    let result = bills;
    if (subTab === 'Unpaid') result = result.filter(b => b.balance > 0 && !b.isDisputed);
    else if (subTab === 'Overdue') result = result.filter(b => isOverdue(b));
    else if (subTab === 'Disputed') result = result.filter(b => b.isDisputed);
    else if (subTab === 'Exception') result = result.filter(b => b.exceptionReason && b.exceptionReason.trim() !== '');
    
    if (searchTerm) {
      const q = searchTerm.toLowerCase();
      result = result.filter(b => b.billNo.toLowerCase().includes(q) || b.vendor.toLowerCase().includes(q));
    }
    return result;
  }, [bills, subTab, searchTerm]);

  useEffect(() => {
    setCurrentPage(1);
  }, [subTab, selectedMonth, searchTerm, itemsPerPage, mainTab]);

  const totalPayable = bills.reduce((s, i) => (!i.isDisputed ? s + i.balance : s), 0);
  const totalOverdueAmount = bills.reduce((s, i) => isOverdue(i) ? s + i.balance : s, 0);
  const totalDisputedAmount = bills.reduce((s, i) => i.isDisputed ? s + i.balance : s, 0);

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
      ...filteredBills.map(row => [
        row.issueDate, row.dueDate, row.billNo, row.poRef, `"${row.vendor}"`, row.vendorType, row.creditTerm, row.risk, `"${row.exceptionReason}"`, row.amount, row.discountAvailable, row.discountCaptured, row.paid, row.balance, row.status, row.isDisputed
      ].join(','))
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
        <div className="w-full space-y-6 relative flex-1 flex flex-col h-full overflow-hidden">
          
          {/* Top Main Navigation Header */}
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 no-print flex-shrink-0">
            <div className="flex items-center gap-4 shrink-0">
              <div className="relative w-12 h-12 bg-white flex items-center justify-center shadow-lg flex-shrink-0 rounded-2xl border-[3px] border-white/60 bg-clip-padding backdrop-blur-sm">
                <svg width="0" height="0" className="absolute">
                  <defs>
                    <linearGradient id="apGradient" x1="0" y1="0" x2="24" y2="24" gradientUnits="userSpaceOnUse">
                      <stop stopColor="#933b5b" offset="0%" />
                      <stop stopColor="#ce5a43" offset="100%" />
                    </linearGradient>
                  </defs>
                </svg>
                <Database size={24} strokeWidth={2.5} stroke="url(#apGradient)" />
              </div>
              <div className="flex flex-col justify-center">
                <h1 className="text-2xl tracking-tight uppercase leading-none drop-shadow-sm">
                  <span className="text-[#223149] font-light">ACCOUNTS</span> <span className="text-[#933b5b] font-black">PAYABLE</span>
                </h1>
                <p className="font-medium text-[12px] uppercase tracking-widest mt-1 text-[#496ca8] leading-none">
                  ระบบจัดการฐานข้อมูลเจ้าหนี้และบอร์ดอนุมัติจ่าย (Database)
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
                  <Database size={12} /> DETAILED BILLS
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
      </div>
    </>
  );
}

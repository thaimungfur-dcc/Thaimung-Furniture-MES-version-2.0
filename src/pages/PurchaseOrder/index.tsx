import React, { useState, useEffect, useMemo } from 'react';
import { 
  ShoppingBag, 
  Search, 
  Plus, 
  Kanban, 
  Calendar, 
  HelpCircle,
  FileClock,
  Truck,
  CheckSquare,
  Coins,
  List,
  X,
  ShoppingCart,
  CheckCircle
} from 'lucide-react';

import { PageHeader } from '../../components/shared/PageHeader';
import { KpiCard } from '../../components/shared/KpiCard';
import PoKanbanBoard from './components/PoKanbanBoard';
import PoPrWaitingTable from './components/PoPrWaitingTable';
import PoTable from './components/PoTable';
import PoActionModal from './components/PoActionModal';
import PoPreviewModal from './components/PoPreviewModal';

// Helper: Format Date
const formatDate = (dateString: string) => {
  if (!dateString) return '-';
  const date = new Date(dateString);
  return date.toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' });
};

// Helper: Format Currency
const formatCurrency = (val: number) => {
  return '฿' + (Number(val) || 0)?.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
};

// Helper: Get consistent status badge styles for List View
const getStatusBadgeClass = (status: string) => {
  switch(status) {
    case 'Pending Verify': return 'bg-amber-50 text-amber-600 border-amber-200';
    case 'Revise': return 'bg-rose-50 text-rose-600 border-rose-200';
    case 'Pending Approve': return 'bg-[#3d97bd]/10 text-[#3d97bd] border-[#3d97bd]/30';
    case 'Approved': return 'bg-[#849a28]/10 text-[#849a28] border-[#849a28]/30';
    case 'Sent': return 'bg-[#be73bf]/10 text-[#be73bf] border-[#be73bf]/30';
    case 'Completed': return 'bg-[#849a28]/10 text-[#849a28] border-[#849a28]/30';
    case 'Rejected': return 'bg-rose-50 text-rose-600 border-rose-200';
    default: return 'bg-slate-50 text-slate-600 border-slate-200';
  }
};

export default function PurchaseOrder() {
  const [activeTab, setActiveTab] = useState('kanban'); 
  const [searchQuery, setSearchQuery] = useState('');
  const [dateFilter, setDateFilter] = useState('this_month'); 
  const [selectedMonth, setSelectedMonth] = useState('2026-03'); 

  // Modal States
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState('view'); 
  const [previewModal, setPreviewModal] = useState<string | null>(null); 
  const [isGuideOpen, setIsGuideOpen] = useState(false);

  // Kanban Limits State
  const [kanbanLimits, setKanbanLimits] = useState<Record<string, number>>({
    pendingPR: 5,
    'Pending Approve': 5,
    'Approved': 5,
    'Sent': 5
  });

  // Data States
  const [pendingPRs, setPendingPRs] = useState<any[]>([]);
  const [poList, setPoList] = useState<any[]>([]);
  const [selectedItem, setSelectedItem] = useState<any>(null);
  
  // Form State for Generating PO
  const [poForm, setPoForm] = useState<any>({
    id: '', poNumber: '', date: '', vendor: '', vendorAddress: '', prRef: '', 
    paymentTerm: 'Credit 30 Days', deliveryDate: '', remarks: '', status: 'Pending Approve', 
    subTotal: 0, vat: 0, grandTotal: 0, items: [], history: []
  });

  useEffect(() => {
    // Mock Approved PRs
    const mockPRs = [
      { id: 'PR-2603-001', date: '2026-03-05', requester: 'สมชาย ใจดี', department: 'Production', totalAmount: 15000, items: [{code: 'RM-001', name: 'Digital Thermometer', qty: 2, price: 7500}] },
      { id: 'PR-2603-002', date: '2026-03-10', requester: 'วิภา', department: 'Warehouse', totalAmount: 9000, items: [{code: 'PT-WHL-001', name: 'ล้อเลื่อนยูรีเทน 2 นิ้ว', qty: 200, price: 45}] },
      { id: 'PR-2603-005', date: '2026-03-11', requester: 'ชัย', department: 'Production', totalAmount: 40000, items: [{code: 'RM-MT-002', name: 'ท่อสแตนเลส 304 (0.5 นิ้ว)', qty: 500, price: 80}] },
      { id: 'PR-2603-007', date: '2026-03-12', requester: 'สมร', department: 'Production', totalAmount: 72700, items: [{code: 'RM-WD-005', name: 'ไม้อัดยาง 15mm', qty: 100, price: 450}, {code: 'PT-GLG-001', name: 'กาวลาเท็กซ์ 1kg', qty: 20, price: 85}] },
    ];

    // Mock Existing POs
    const mockPOs = [
      { id: 1, poNumber: 'PO-2603-001', date: '2026-03-01', vendor: 'บริษัท ไทยสตีล จำกัด', vendorAddress: '123 ถนนบางนาตราด กทม.', prRef: 'PR-2602-050', grandTotal: 8025, subTotal: 7500, vat: 525, status: 'Sent', items: [{code: 'RM-MT-001', name: 'ท่อสแตนเลส 304 (1 นิ้ว)', qty: 50, price: 150}], paymentTerm: 'Credit 30 Days', deliveryDate: '2026-03-25', remarks: 'ด่วน', history: [{date: '2026-03-01 10:00', action: 'Created PO', user: 'Admin'}] },
      { id: 2, poNumber: 'PO-2603-002', date: '2026-03-05', vendor: 'ร้านน็อตแอนด์โบลต์', vendorAddress: '456 พระราม 2', prRef: 'PR-2603-003', grandTotal: 535, subTotal: 500, vat: 35, status: 'Completed', items: [{code: 'PT-SCR-001', name: 'สกรูเกลียวปล่อย #8', qty: 1000, price: 0.5}], paymentTerm: 'Cash', deliveryDate: '2026-03-10', remarks: '-', history: [] },
      { id: 3, poNumber: 'PO-2603-003', date: '2026-03-08', vendor: 'Office Supply Co.', vendorAddress: '789 สุขุมวิท', prRef: 'PR-2603-004', grandTotal: 5000, subTotal: 4672.90, vat: 327.10, status: 'Pending Approve', items: [{code: 'OF-001', name: 'เก้าอี้สำนักงาน', qty: 10, price: 467.29}], paymentTerm: 'Credit 30 Days', deliveryDate: '2026-03-30', remarks: '-', history: [] },
    ];

    setPendingPRs(mockPRs);
    setPoList(mockPOs);
  }, []);

  const [pendingItemsPerPage, setPendingItemsPerPage] = useState(10);
  const [poItemsPerPage, setPoItemsPerPage] = useState(10);

  const filteredPendingPRs = useMemo(() => {
    return pendingPRs?.filter(p => {
      const matchSearch = p.id.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          p.requester.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          p.department.toLowerCase().includes(searchQuery.toLowerCase());
      const matchDate = dateFilter === 'all' ? true : p.date.startsWith(selectedMonth);
      return matchSearch && matchDate;
    });
  }, [pendingPRs, searchQuery, dateFilter, selectedMonth]);

  const [pendingCurrentPage, setPendingCurrentPage] = useState(1);
  const paginatedPendingPRs = useMemo(() => {
    const start = (pendingCurrentPage - 1) * pendingItemsPerPage;
    return filteredPendingPRs.slice(start, start + pendingItemsPerPage);
  }, [filteredPendingPRs, pendingCurrentPage, pendingItemsPerPage]);
  const pendingTotalPages = Math.ceil(filteredPendingPRs.length / pendingItemsPerPage) || 1;

  const filteredPOList = useMemo(() => {
    return poList?.filter(p => {
      const matchSearch = p.poNumber.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          p.vendor.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          p.prRef.toLowerCase().includes(searchQuery.toLowerCase());
      const matchDate = dateFilter === 'all' ? true : p.date.startsWith(selectedMonth);
      return matchSearch && matchDate;
    });
  }, [poList, searchQuery, dateFilter, selectedMonth]);

  const [currentPage, setCurrentPage] = useState(1);
  const paginatedPOList = useMemo(() => {
    const start = (currentPage - 1) * poItemsPerPage;
    return filteredPOList.slice(start, start + poItemsPerPage);
  }, [filteredPOList, currentPage, poItemsPerPage]);
  const totalPages = Math.ceil(filteredPOList.length / poItemsPerPage) || 1;

  useEffect(() => { 
    setCurrentPage(1); 
    setPendingCurrentPage(1); 
  }, [dateFilter, searchQuery, selectedMonth]);

  const getNewPONumber = () => {
    return `PO-${selectedMonth.replace('-','').slice(2)}-${String(poList.length + 1).padStart(3, '0')}`;
  };

  const openModal = (mode: string, data: any = null) => {
    setModalMode(mode);
    if (mode === 'create') {
      setPoForm({
        id: Date.now(), poNumber: getNewPONumber(), date: new Date().toISOString().split('T')[0], 
        vendor: '', vendorAddress: '', prRef: 'Manual', paymentTerm: 'Credit 30 Days', 
        deliveryDate: '', remarks: '', status: 'Pending Approve', subTotal: 0, vat: 0, grandTotal: 0, 
        items: [{ code: '', name: '', qty: '', price: 0 }], history: []
      });
    } else if (mode === 'generate' && data) {
      setSelectedItem(data); 
      const sub = data.items?.reduce((s: number, i: any) => s + (i.qty * i.price), 0);
      const vt = sub * 0.07;
      setPoForm({
        id: Date.now(), poNumber: getNewPONumber(), date: new Date().toISOString().split('T')[0], 
        vendor: '', vendorAddress: '', prRef: data.id, paymentTerm: 'Credit 30 Days', 
        deliveryDate: '', remarks: '', status: 'Pending Approve', subTotal: sub, vat: vt, grandTotal: sub + vt, 
        items: data.items?.map((i: any) => ({ ...i })), history: []
      });
    } else {
      setSelectedItem(data); 
      setPoForm(JSON.parse(JSON.stringify(data)));
    }
    setModalOpen(true);
  };

  const handleAddItem = () => {
    setPoForm((prev: any) => ({
       ...prev,
       items: [...prev.items, { code: '', name: '', qty: '', price: 0 }]
    }));
  };

  const handleRemoveItem = (index: number) => {
    setPoForm((prev: any) => {
       const newItems = [...prev.items];
       newItems.splice(index, 1);
       const sub = newItems?.reduce((s, i) => s + ((Number(i.qty)||0) * (Number(i.price)||0)), 0);
       const vt = sub * 0.07;
       return { ...prev, items: newItems, subTotal: sub, vat: vt, grandTotal: sub + vt };
    });
  };

  const handleItemChange = (index: number, field: string, value: any) => {
    setPoForm((prev: any) => {
       const newItems = [...prev.items];
       newItems[index][field] = value;
       const sub = newItems?.reduce((s, i) => s + ((Number(i.qty)||0) * (Number(i.price)||0)), 0);
       const vt = sub * 0.07;
       return { ...prev, items: newItems, subTotal: sub, vat: vt, grandTotal: sub + vt };
    });
  };

  const handleSavePO = () => {
    if(!poForm.vendor) return alert('กรุณาระบุชื่อผู้ขาย (Vendor Name)');
    if(poForm.items.length === 0) return alert('ต้องมีรายการสินค้าอย่างน้อย 1 รายการ');
    const now = new Date();
    const formattedNow = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
    if (modalMode === 'create' || modalMode === 'generate') {
      const newPO = { ...poForm, history: [{ date: formattedNow, user: 'Admin', action: 'Created PO', note: '' }] };
      setPoList([newPO, ...poList]);
      if (modalMode === 'generate' && selectedItem) {
        setPendingPRs(pendingPRs?.filter(p => p.id !== selectedItem.id));
      }
    } else {
      const updatedPO = { ...poForm, history: [...(poForm.history || []), { date: formattedNow, user: 'Admin', action: `Updated PO`, note: '' }] };
      setPoList(poList?.map(p => p.id === poForm.id ? updatedPO : p));
    }
    setModalOpen(false);
  };

  const updatePOStatus = (status: string, poId: any = null) => {
    const targetId = poId || poForm.id;
    if(!targetId) return;
    const now = new Date();
    const formattedNow = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
    setPoList(poList?.map(p => {
      if (p.id === targetId) {
        return { ...p, status, history: [...(p.history || []), { date: formattedNow, user: 'Admin', action: `Status changed to ${status}`, note: '' }] };
      }
      return p;
    }));
    setModalOpen(false);
  };

  const executePrint = () => {
    setPreviewModal(null);
    setTimeout(() => window.print(), 100);
  };

  return (
    <div className="flex flex-col space-y-4 w-full relative flex-1 animate-fade-in-up">
      <style>{`
        .kanban-scroll::-webkit-scrollbar { width: 6px; height: 6px; }
        .kanban-scroll::-webkit-scrollbar-thumb { background: #CBD5E1; border-radius: 3px; }
        @media print {
          @page { size: A4 portrait; margin: 10mm; }
          .no-print { display: none !important; }
        }
      `}</style>

      {/* Header Section */}
      <PageHeader 
        Icon={ShoppingBag}
        title="PURCHASE ORDER"
        subtitle="ระบบสั่งซื้อสินค้าและวัสดุ (PO)"
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
                onClick={() => setActiveTab('kanban')} 
                className={`px-4 py-0 font-black transition-all flex items-center gap-2 uppercase tracking-widest rounded-lg text-[10px] ${activeTab === 'kanban' ? 'bg-[#111f42] text-white shadow-md' : 'text-slate-500 hover:bg-slate-50'}`}
              >
                <Kanban size={14} /> BOARD
              </button>
              <button 
                onClick={() => setActiveTab('pending')} 
                className={`px-4 py-0 font-black transition-all flex items-center gap-2 uppercase tracking-widest rounded-lg text-[10px] ${activeTab === 'pending' ? 'bg-[#E3624A] text-white shadow-md' : 'text-slate-500 hover:bg-slate-50'}`}
              >
                <FileClock size={14} /> PR WAITING
              </button>
              <button 
                onClick={() => setActiveTab('list')} 
                className={`px-4 py-0 font-black transition-all flex items-center gap-2 uppercase tracking-widest rounded-lg text-[10px] ${activeTab === 'list' ? 'bg-[#1c213f] text-white shadow-md' : 'text-slate-500 hover:bg-slate-50'}`}
              >
                <List size={14} /> PO LIST
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
          title="PR to Process"
          value={filteredPendingPRs.length}
          icon={FileClock}
          color="#f59e0b"
          subValue="Waiting for PO Generation"
        />
        <KpiCard 
          title="Open POs"
          value={filteredPOList?.filter(p=>p.status!=='Completed' && p.status!=='Rejected').length}
          icon={Truck}
          color="#3d97bd"
          subValue="Active Delivery Tracking"
        />
        <KpiCard 
          title="Completed"
          value={filteredPOList?.filter(p=>p.status==='Completed').length}
          icon={CheckSquare}
          color="#849a28"
          subValue="Finished Procurement"
        />
        <KpiCard 
          title="Total Spend (Mo)"
          value={formatCurrency(filteredPOList?.reduce((acc, p) => acc + p.grandTotal, 0))}
          icon={Coins}
          color="#E3624A"
          subValue="Total Monthly Expenditure"
        />
      </div>

        {/* Kanban View */}
        {activeTab === 'kanban' && (
          <PoKanbanBoard 
            filteredPendingPRs={filteredPendingPRs}
            poList={poList}
            selectedMonth={selectedMonth}
            dateFilter={dateFilter}
            kanbanLimits={kanbanLimits}
            setKanbanLimits={setKanbanLimits}
            openModal={openModal}
            setSelectedItem={setSelectedItem}
            setPreviewModal={setPreviewModal}
            updatePOStatus={updatePOStatus}
            formatDate={formatDate}
            formatCurrency={formatCurrency}
          />
        )}

        {/* PR Waiting View */}
        {activeTab === 'pending' && (
          <PoPrWaitingTable 
            paginatedPendingPRs={paginatedPendingPRs}
            filteredPendingPRs={filteredPendingPRs}
            pendingCurrentPage={pendingCurrentPage}
            setPendingCurrentPage={setPendingCurrentPage}
            pendingItemsPerPage={pendingItemsPerPage}
            setPendingItemsPerPage={setPendingItemsPerPage}
            pendingTotalPages={pendingTotalPages}
            openModal={openModal}
            formatDate={formatDate}
            formatCurrency={formatCurrency}
          />
        )}

        {/* List View */}
        {activeTab === 'list' && (
          <PoTable 
            paginatedPOList={paginatedPOList}
            filteredPOList={filteredPOList}
            currentPage={currentPage}
            setCurrentPage={setCurrentPage}
            poItemsPerPage={poItemsPerPage}
            setPoItemsPerPage={setPoItemsPerPage}
            totalPages={totalPages}
            openModal={openModal}
            setSelectedItem={setSelectedItem}
            setPreviewModal={setPreviewModal}
            formatDate={formatDate}
            formatCurrency={formatCurrency}
            getStatusBadgeClass={getStatusBadgeClass}
          />
        )}

        {/* Modals */}
        <PoActionModal 
          modalOpen={modalOpen}
          setModalOpen={setModalOpen}
          modalMode={modalMode}
          setModalMode={setModalMode}
          poForm={poForm}
          setPoForm={setPoForm}
          handleAddItem={handleAddItem}
          handleRemoveItem={handleRemoveItem}
          handleItemChange={handleItemChange}
          handleSavePO={handleSavePO}
          updatePOStatus={updatePOStatus}
          formatCurrency={formatCurrency}
        />

        <PoPreviewModal 
          previewModal={previewModal}
          setPreviewModal={setPreviewModal}
          selectedItem={selectedItem}
          formatDate={formatDate}
          formatCurrency={formatCurrency}
          executePrint={executePrint}
        />

        {/* Guide Drawer */}
        {isGuideOpen && (
          <>
            <div className="fixed inset-0 bg-[#111f42]/40 backdrop-blur-sm z-[60] animate-in fade-in duration-200 no-print" onClick={() => setIsGuideOpen(false)} />
            <div className="fixed inset-y-0 right-0 w-full md:w-[450px] bg-white shadow-2xl z-[70] flex flex-col animate-in slide-in-from-right duration-300 no-print">
              <div className="py-5 flex justify-between items-center bg-[#111f42] text-white shrink-0 border-b-4 border-[#E3624A]">
                <h2 className="text-base font-semibold uppercase tracking-widest flex items-center gap-2">
                  <HelpCircle size={20} className="text-[#E3624A]" /> คู่มือการใช้งาน (PO)
                </h2>
                <button onClick={() => setIsGuideOpen(false)} className="hover:bg-white/20 p-1.5 rounded-lg transition-colors">
                  <X size={20} />
                </button>
              </div>
              <div className="flex-1 overflow-y-auto p-8 text-slate-700 space-y-8 text-[13px] leading-relaxed">
                 <div>
                    <h4 className="font-bold border-b pb-1 text-[#111f42] uppercase flex items-center gap-2 mb-3">
                      <ShoppingBag size={16} className="text-[#E3624A]"/> 1. การสร้างใบสั่งซื้อ
                    </h4>
                    <p>คุณสามารถสร้าง PO ได้โดยตรง หรือสร้างจากการอ้างอิงใบขอซื้อ (PR) ที่ผ่านการอนุมัติแล้วในหน้า <b>PR WAITING</b></p>
                 </div>
                 <div>
                    <h4 className="font-bold border-b pb-1 text-[#111f42] uppercase flex items-center gap-2 mb-3">
                      <Kanban size={16} className="text-[#E3624A]"/> 2. การติดตามสถานะ
                    </h4>
                    <p>ใช้หน้า <b>BOARD</b> เพื่อดูภาพรวมของใบสั่งซื้อ ตั้งแต่รออนุมัติ จนถึงขั้นตอนการรับสินค้า</p>
                 </div>
                 <div>
                    <h4 className="font-bold border-b pb-1 text-[#111f42] uppercase flex items-center gap-2 mb-3">
                      <CheckCircle size={16} className="text-[#E3624A]"/> 3. การอนุมัติและส่งมอบ
                    </h4>
                    <p>เมื่อ PO ได้รับการอนุมัติแล้ว สามารถพิมพ์เอกสารเพื่อส่งให้ผู้ขาย และรอรับสินค้าเพื่อเปลี่ยนสถานะเป็น <b>Completed</b></p>
                 </div>
              </div>
              <div className="p-4 border-t flex justify-end bg-slate-50">
                <button onClick={() => setIsGuideOpen(false)} className="bg-[#111f42] text-white py-2.5 rounded-xl font-bold text-[12px] uppercase tracking-wider shadow-md">
                  เข้าใจแล้ว
                </button>
              </div>
            </div>
          </>
        )}
      </div>
  );
}

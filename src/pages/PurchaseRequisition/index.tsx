import React, { useState, useEffect, useMemo } from 'react';
import { 
  ShoppingCart, 
  Search, 
  Plus, 
  X, 
  List, 
  Kanban, 
  Calendar, 
  HelpCircle,
  ChevronLeft,
  ChevronRight,
  Info,
  AlertCircle,
  CheckCircle,
  Clock,
  TrendingUp
} from 'lucide-react';

import PrKanbanBoard from './components/PrKanbanBoard';
import PrTable from './components/PrTable';
import PrActionModal from './components/PrActionModal';
import PrPreviewModal from './components/PrPreviewModal';

// Helper: Format Date
const formatDate = (dateString: string) => {
  if (!dateString) return '-';
  const date = new Date(dateString);
  return date.toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' });
};

// Helper: Format Currency
const formatCurrency = (amount: number) => {
  return '฿' + Number(amount || 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
};

// --- Mock Data for PR ---
const generateMockPRs = () => {
  return [
    { id: 'PR-2601-001', date: '2026-01-10', requester: 'คุณสมชาย ใจดี', department: 'Production', objective: 'สั่งซื้อเครื่องมือวัดอุณหภูมิสำหรับไลน์ผลิต A', status: 'Approved', totalAmount: 15000, items: [{ id: 'i1', description: 'Digital Thermometer รุ่น X-100', qty: 2, unit: 'pcs', unitPrice: 7500, total: 15000, note: 'สเปคตามที่ QA กำหนด' }], history: [{ date: '2026-01-10 09:15', user: 'คุณสมชาย ใจดี', action: 'Created PR', note: '' }, { date: '2026-01-11 14:30', user: 'คุณวิรัช (Manager)', action: 'Approved', note: 'ดำเนินการสั่งซื้อได้เลย' }] },
    { id: 'PR-2601-002', date: '2026-01-15', requester: 'คุณวิภาวรรณ สุขใส', department: 'HR & Admin', objective: 'สั่งซื้ออุปกรณ์สำนักงานประจำเดือน', status: 'Pending Verify', totalAmount: 10450, items: [{ id: 'i1', description: 'กระดาษถ่ายเอกสาร A4 80 แกรม', qty: 50, unit: 'ream', unitPrice: 110, total: 5500, note: 'Double A' }, { id: 'i2', description: 'ปากกาลูกลื่นสีน้ำเงิน', qty: 100, unit: 'pcs', unitPrice: 5, total: 500, note: '' }, { id: 'i3', description: 'แฟ้มตราช้าง 2 นิ้ว', qty: 20, unit: 'pcs', unitPrice: 85, total: 1700, note: 'สีน้ำเงิน' }, { id: 'i4', description: 'หมึกพิมพ์ HP Laser 107a', qty: 2, unit: 'cartridge', unitPrice: 1200, total: 2400, note: 'ของแท้เท่านั้น' }], history: [{ date: '2026-01-15 11:20', user: 'คุณวิภาวรรณ สุขใส', action: 'Created PR', note: 'ของเริ่มขาดสต็อก' }] },
    { id: 'PR-2601-003', date: '2026-01-20', requester: 'คุณดนัย วิศวกรรม', department: 'Maintenance', objective: 'อะไหล่ซ่อมบำรุงเครื่องทำความเย็น', status: 'Pending Approve', totalAmount: 48500, items: [{ id: 'i1', description: 'Compressor 5HP', qty: 1, unit: 'set', unitPrice: 45000, total: 45000, note: 'ด่วนมาก เครื่องเบอร์ 3 เสีย' }, { id: 'i2', description: 'น้ำยาแอร์ R-404a', qty: 1, unit: 'tank', unitPrice: 3500, total: 3500, note: '' }], history: [{ date: '2026-01-20 08:00', user: 'คุณดนัย วิศวกรรม', action: 'Created PR', note: 'เครื่องเสียกระทันหัน' }, { date: '2026-01-20 09:15', user: 'คุณวิรัช (Manager)', action: 'Verified', note: 'ตรวจสอบสเปคแล้ว ถูกต้อง' }] },
    { id: 'PR-2602-001', date: '2026-02-05', requester: 'คุณณัฐพล จัดส่ง', department: 'Logistics', objective: 'สั่งทำสติ๊กเกอร์ติดกล่องบรรจุภัณฑ์', status: 'Revise', totalAmount: 3000, items: [{ id: 'i1', description: 'Sticker Fragile (ระวังแตก)', qty: 5000, unit: 'pcs', unitPrice: 0.6, total: 3000, note: 'ขนาด 5x5 cm' }], history: [{ date: '2026-02-05 13:45', user: 'คุณณัฐพล จัดส่ง', action: 'Created PR', note: '' }] },
    { id: 'PR-2602-002', date: '2026-02-12', requester: 'คุณสมร ช่างทอง', department: 'QA/QC', objective: 'อุปกรณ์ทดสอบในห้องแล็บ', status: 'Pending Verify', totalAmount: 8500, items: [{ id: 'i1', description: 'Petri Dish (Glass)', qty: 100, unit: 'pcs', unitPrice: 45, total: 4500, note: 'ขอให้ระบุแบรนด์ด้วย' }, { id: 'i2', description: 'สารเคมีทดสอบ E.Coli', qty: 2, unit: 'bottle', unitPrice: 2000, total: 4000, note: '' }] },
    { id: 'PR-2602-003', date: '2026-02-18', requester: 'คุณนพดล ไอที', department: 'IT', objective: 'เมาส์และคีย์บอร์ดไร้สาย', status: 'Approved', totalAmount: 4500, items: [{ id: 'i1', description: 'Wireless Mouse & Keyboard Set', qty: 5, unit: 'set', unitPrice: 900, total: 4500, note: '' }] },
    { id: 'PR-2603-001', date: '2026-03-01', requester: 'คุณกิตติ รปภ.', department: 'Security', objective: 'ไฟฉายแรงสูงสำหรับ รปภ. กะกลางคืน', status: 'Revise', totalAmount: 1800, items: [{ id: 'i1', description: 'ไฟฉาย LED', qty: 3, unit: 'pcs', unitPrice: 600, total: 1800, note: '' }] },
    { id: 'PR-2603-002', date: '2026-03-05', requester: 'คุณมานี แม่บ้าน', department: 'Admin', objective: 'น้ำยาทำความสะอาดห้องน้ำ', status: 'Pending Verify', totalAmount: 1200, items: [{ id: 'i1', description: 'น้ำยาล้างห้องน้ำ 3.8 ลิตรส', qty: 10, unit: 'gallon', unitPrice: 120, total: 1200, note: '' }] },
    { id: 'PR-2603-003', date: '2026-03-10', requester: 'คุณชูเกียรติ', department: 'Warehouse', objective: 'เทปใสปิดกล่อง', status: 'Approved', totalAmount: 2400, items: [{ id: 'i1', description: 'เทปใส 2 นิ้ว', qty: 100, unit: 'roll', unitPrice: 24, total: 2400, note: '' }] },
    { id: 'PR-2603-004', date: '2026-03-15', requester: 'คุณวารี', department: 'Production', objective: 'ชุดพนักงานบรรจุ', status: 'Pending Approve', totalAmount: 5000, items: [{id: 'i1', description: 'ชุดกราวน์', qty: 10, unit: 'ชุด', unitPrice: 500, total: 5000, note: ''}] },
    { id: 'PR-2603-005', date: '2026-03-20', requester: 'คุณประเสริฐ', department: 'Maintenance', objective: 'น้ำมันหล่อลื่น', status: 'Pending Verify', totalAmount: 3200, items: [{id: 'i1', description: 'จาระบี Food Grade', qty: 2, unit: 'ถัง', unitPrice: 1600, total: 3200, note: ''}] },
    { id: 'PR-2603-006', date: '2026-03-25', requester: 'คุณนิดา', department: 'HR & Admin', objective: 'กาแฟและชาต้อนรับแขก', status: 'Approved', totalAmount: 1500, items: [{id: 'i1', description: 'กาแฟคั่วบด', qty: 5, unit: 'ถุง', unitPrice: 300, total: 1500, note: ''}] },
  ];
};

export default function PurchaseRequisition() {
  const [activeTab, setActiveTab] = useState('kanban'); // 'kanban' | 'list'
  const [prs, setPrs] = useState(generateMockPRs());
  
  // List View Filters
  const [listTimeFilter, setListTimeFilter] = useState('this_month'); 
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedMonth, setSelectedMonth] = useState('2026-03'); 
  
  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  // Kanban Limits State
  const [kanbanLimits, setKanbanLimits] = useState<Record<string, number>>({
    'Pending Verify': 5,
    'Revise': 5,
    'Pending Approve': 5,
    'Approved': 5,
    'Rejected': 5
  });

  // Modals
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState('view');
  const [activeFormTab, setActiveFormTab] = useState('general'); 
  const [previewModal, setPreviewModal] = useState(false);
  const [selectedPR, setSelectedPR] = useState<any>(null);
  const [isGuideOpen, setIsGuideOpen] = useState(false);

  // Form State for PR
  const [formData, setFormData] = useState<any>({
    id: '', date: '', requester: '', department: '', objective: '', status: 'Pending Verify', totalAmount: 0, items: [], history: []
  });

  // Derived Data
  const filteredPRs = useMemo(() => {
    return prs.filter(pr => {
      const matchTime = listTimeFilter === 'all' || pr.date.startsWith(selectedMonth);
      const q = searchQuery.toLowerCase();
      const matchSearch = pr.id.toLowerCase().includes(q) || 
                          pr.requester.toLowerCase().includes(q) || 
                          pr.department.toLowerCase().includes(q) ||
                          pr.objective.toLowerCase().includes(q);
      
      return matchTime && matchSearch;
    });
  }, [prs, listTimeFilter, searchQuery, selectedMonth]);

  const paginatedPRs = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredPRs.slice(start, start + itemsPerPage);
  }, [filteredPRs, currentPage, itemsPerPage]);

  const totalPages = Math.ceil(filteredPRs.length / itemsPerPage) || 1;

  useEffect(() => { setCurrentPage(1); }, [listTimeFilter, searchQuery, selectedMonth]);

  // --- Form Handlers ---
  const getNewPRId = () => {
     const count = prs.filter(p => p.date.startsWith(selectedMonth)).length + 1;
     return `PR-${selectedMonth.replace('-','').slice(2)}-${String(count).padStart(3, '0')}`;
  };

  const openModal = (mode: string, data: any = null) => {
    setModalMode(mode);
    setActiveFormTab('general');
    if (mode === 'create') {
      setFormData({
        id: getNewPRId(),
        date: new Date().toISOString().split('T')[0],
        requester: '', department: '', objective: '', status: 'Pending Verify', totalAmount: 0,
        items: [{ id: `item_${Date.now()}`, description: '', qty: '', unit: '', unitPrice: '', total: 0, note: '' }],
        history: []
      });
    } else {
      setFormData(JSON.parse(JSON.stringify(data))); 
    }
    setModalOpen(true);
  };

  const handleAddItem = () => {
    setFormData((prev: any) => ({
       ...prev,
       items: [...prev.items, { id: `item_${Date.now()}`, description: '', qty: '', unit: '', unitPrice: '', total: 0, note: '' }]
    }));
  };

  const handleRemoveItem = (index: number) => {
    setFormData((prev: any) => {
       const newItems = [...prev.items];
       newItems.splice(index, 1);
       const newTotal = newItems.reduce((sum, item) => sum + (Number(item.total) || 0), 0);
       return { ...prev, items: newItems, totalAmount: newTotal };
    });
  };

  const handleItemChange = (index: number, field: string, value: any) => {
    setFormData((prev: any) => {
       const newItems = [...prev.items];
       newItems[index][field] = value;
       if (field === 'qty' || field === 'unitPrice') {
          const q = Number(newItems[index].qty) || 0;
          const p = Number(newItems[index].unitPrice) || 0;
          newItems[index].total = q * p;
       }
       const newTotal = newItems.reduce((sum, item) => sum + (Number(item.total) || 0), 0);
       return { ...prev, items: newItems, totalAmount: newTotal };
    });
  };

  const handleSave = () => {
    if (!formData.requester || !formData.department) return alert('กรุณากรอกข้อมูลผู้ขอซื้อและแผนก');
    if (formData.items.length === 0) return alert('ต้องมีรายการสินค้าอย่างน้อย 1 รายการ');
    const hasEmptyDesc = formData.items.some((i: any) => !i.description.trim());
    if (hasEmptyDesc) return alert('กรุณาระบุรายละเอียดสินค้าให้ครบถ้วน');

    const now = new Date();
    const formattedNow = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;

    if (modalMode === 'create') {
      const newPR = {
        ...formData,
        history: [{ date: formattedNow, user: formData.requester, action: 'Created PR', note: '' }]
      };
      setPrs([newPR, ...prs]);
    } else {
      const updatedPR = {
        ...formData,
        history: [...(formData.history || []), { date: formattedNow, user: 'System', action: `Updated PR Status to ${formData.status}`, note: '' }]
      };
      setPrs(prs.map(p => p.id === formData.id ? updatedPR : p));
    }
    setModalOpen(false);
  };

  const executePrint = () => {
    setPreviewModal(false);
    setTimeout(() => window.print(), 100);
  };

  return (
    <div className="min-h-screen transition-colors duration-500 text-[12px] flex flex-col bg-[#F7F5F2]">
      <style>{`
        * { font-family: 'JetBrains Mono', 'Noto Sans Thai', sans-serif !important; }
        .kanban-scroll::-webkit-scrollbar { width: 6px; height: 6px; }
        .kanban-scroll::-webkit-scrollbar-thumb { background: #CBD5E1; border-radius: 3px; }
        @media print {
          @page { size: A4 portrait; margin: 10mm; }
          .no-print { display: none !important; }
        }
      `}</style>
      
      <div className="w-full space-y-6 relative flex-1 flex flex-col pt-8 px-8 pb-10">
        {/* Header */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-6 no-print flex-shrink-0">
          <div className="flex items-center gap-5">
            <div className="w-14 h-14 bg-white text-[#111f42] flex items-center justify-center shadow-md flex-shrink-0 rounded-2xl border border-slate-200">
              <ShoppingCart size={28} />
            </div>
            <div className="flex flex-col justify-center">
              <h1 className="text-3xl tracking-tight uppercase leading-none">
                <span className="text-[#b84530] font-black">PURCHASE</span> <span className="text-[#111f42] font-semibold">REQUISITION</span>
              </h1>
              <p className="font-medium text-[14px] uppercase tracking-widest mt-1.5 text-slate-500 leading-none">
                ระบบจัดการใบขอซื้อ (PR)
              </p>
            </div>
          </div>
          
          <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto">
            <div className="flex items-center bg-white border border-slate-200 rounded-lg shadow-sm">
              <div className="px-3 py-2.5 bg-slate-50 border-r border-slate-200 text-slate-500">
                <Calendar size={14} />
              </div>
              <input 
                type="month" 
                value={selectedMonth} 
                onChange={(e) => setSelectedMonth(e.target.value)} 
                className="px-3 py-2 text-[12px] font-bold text-[#111f42] outline-none hover:bg-slate-50 cursor-pointer" 
              />
            </div>
            <div className="flex bg-white p-1 border border-slate-200 shadow-sm rounded-lg">
              <button 
                onClick={() => setActiveTab('kanban')} 
                className={`px-5 py-2.5 font-semibold transition-all flex items-center gap-2 uppercase tracking-widest rounded-md text-[11px] ${activeTab === 'kanban' ? 'bg-[#ab8a3b] text-white shadow-md' : 'text-slate-500 hover:bg-slate-50'}`}
              >
                <Kanban size={14} /> BOARD
              </button>
              <button 
                onClick={() => setActiveTab('list')} 
                className={`px-5 py-2.5 font-semibold transition-all flex items-center gap-2 uppercase tracking-widest rounded-md text-[11px] ${activeTab === 'list' ? 'bg-[#E3624A] text-white shadow-md' : 'text-slate-500 hover:bg-slate-50'}`}
              >
                <List size={14} /> PR LIST
              </button>
            </div>
            <button 
              onClick={() => setIsGuideOpen(true)} 
              className="p-2.5 transition-all rounded-lg bg-white border border-slate-200 shadow-sm hover:bg-slate-100"
            >
              <HelpCircle size={18} />
            </button>
          </div>
        </div>

        {/* Kanban View */}
        {activeTab === 'kanban' && (
          <PrKanbanBoard 
            prs={prs}
            selectedMonth={selectedMonth}
            listTimeFilter={listTimeFilter}
            kanbanLimits={kanbanLimits}
            setKanbanLimits={setKanbanLimits}
            openModal={openModal}
            setSelectedPR={setSelectedPR}
            setPreviewModal={setPreviewModal}
            formatDate={formatDate}
            formatCurrency={formatCurrency}
          />
        )}

        {/* List View */}
        {activeTab === 'list' && (
          <div className="bg-white border border-slate-100 shadow-sm overflow-hidden rounded-none flex-1 flex flex-col no-print">
            <div className="p-3 flex items-center justify-between gap-4 bg-white border-b border-slate-100 overflow-x-auto flex-shrink-0">
              <div className="flex items-center gap-4 flex-shrink-0">
                <div className="flex bg-slate-100 p-1 rounded-lg">
                  <button 
                    onClick={() => setListTimeFilter('this_month')} 
                    className={`px-4 py-1.5 whitespace-nowrap text-[10px] font-bold uppercase rounded-md transition-all ${listTimeFilter === 'this_month' ? 'bg-white text-[#111f42] shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                  >
                    This Month
                  </button>
                  <button 
                    onClick={() => setListTimeFilter('all')} 
                    className={`px-4 py-1.5 whitespace-nowrap text-[10px] font-bold uppercase rounded-md transition-all ${listTimeFilter === 'all' ? 'bg-white text-[#111f42] shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                  >
                    All
                  </button>
                </div>
                <div className="relative w-64 flex items-center bg-white border border-slate-200 rounded-lg px-3 py-1.5">
                  <Search className="text-slate-400" size={16} />
                  <input 
                    type="text" 
                    placeholder="Search PR No / Requester..." 
                    className="w-full bg-transparent border-none outline-none ml-2 text-slate-700 font-medium text-[12px]" 
                    value={searchQuery} 
                    onChange={e => setSearchQuery(e.target.value)} 
                  />
                </div>
              </div>
              <button 
                onClick={() => openModal('create')} 
                className="flex-shrink-0 bg-[#1f8764] text-white text-[11px] font-bold px-6 py-2.5 rounded-lg uppercase tracking-widest flex items-center gap-2 shadow-md hover:opacity-90 transition-all"
              >
                <Plus size={16} strokeWidth={3} /> NEW PR
              </button>
            </div>

            <PrTable 
              paginatedPRs={paginatedPRs}
              openModal={openModal}
              setSelectedPR={setSelectedPR}
              setPreviewModal={setPreviewModal}
              formatDate={formatDate}
              formatCurrency={formatCurrency}
            />

            {/* Pagination */}
            <div className="px-6 py-4 border-t border-slate-100 flex flex-col md:flex-row justify-between items-center gap-4 bg-slate-50/50 flex-shrink-0">
              <div className="flex items-center gap-3 text-[12px] text-slate-500 font-medium">
                <p>Showing <span className="font-bold text-[#111f42]">{filteredPRs.length > 0 ? (currentPage - 1) * itemsPerPage + 1 : 0}</span> to <span className="font-bold text-[#111f42]">{Math.min(currentPage * itemsPerPage, filteredPRs.length)}</span> of <span className="font-bold text-[#111f42]">{filteredPRs.length}</span> entries</p>
              </div>
              <div className="flex items-center gap-2">
                <button onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))} disabled={currentPage === 1} className="p-2 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 disabled:opacity-50 transition-all"><ChevronLeft size={16} /></button>
                <div className="flex gap-1">
                  {[...Array(totalPages)].map((_, i) => (
                    <button key={i + 1} onClick={() => setCurrentPage(i + 1)} className={`w-8 h-8 rounded-lg text-[12px] font-bold transition-all border ${currentPage === i + 1 ? 'bg-[#111f42] text-white border-[#111f42] shadow-sm' : 'bg-white text-slate-500 border-slate-200 hover:bg-slate-50'}`}>{i + 1}</button>
                  ))}
                </div>
                <button onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))} disabled={currentPage === totalPages} className="p-2 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 disabled:opacity-50 transition-all"><ChevronRight size={16} /></button>
              </div>
            </div>
          </div>
        )}

        {/* Modals */}
        <PrActionModal 
          modalOpen={modalOpen}
          setModalOpen={setModalOpen}
          modalMode={modalMode}
          setModalMode={setModalMode}
          activeFormTab={activeFormTab}
          setActiveFormTab={setActiveFormTab}
          formData={formData}
          setFormData={setFormData}
          handleAddItem={handleAddItem}
          handleRemoveItem={handleRemoveItem}
          handleItemChange={handleItemChange}
          handleSave={handleSave}
          formatCurrency={formatCurrency}
        />

        <PrPreviewModal 
          previewModal={previewModal}
          setPreviewModal={setPreviewModal}
          selectedPR={selectedPR}
          formatDate={formatDate}
          formatCurrency={formatCurrency}
          executePrint={executePrint}
        />

        {/* Guide Drawer */}
        {isGuideOpen && (
          <>
            <div className="fixed inset-0 bg-[#111f42]/40 backdrop-blur-sm z-[60] animate-in fade-in duration-200 no-print" onClick={() => setIsGuideOpen(false)} />
            <div className="fixed inset-y-0 right-0 w-full md:w-[450px] bg-white shadow-2xl z-[70] flex flex-col animate-in slide-in-from-right duration-300 no-print">
              <div className="px-6 py-5 flex justify-between items-center bg-[#111f42] text-white shrink-0 border-b-4 border-[#E3624A]">
                <h2 className="text-base font-semibold uppercase tracking-widest flex items-center gap-2">
                  <HelpCircle size={20} className="text-[#E3624A]" /> คู่มือการใช้งาน (PR)
                </h2>
                <button onClick={() => setIsGuideOpen(false)} className="hover:bg-white/20 p-1.5 rounded-lg transition-colors">
                  <X size={20} />
                </button>
              </div>
              <div className="flex-1 overflow-y-auto p-8 text-slate-700 space-y-8 text-[13px] leading-relaxed">
                 <div>
                    <h4 className="font-bold border-b pb-1 text-[#111f42] uppercase flex items-center gap-2 mb-3">
                      <ShoppingCart size={16} className="text-[#E3624A]"/> 1. การสร้างใบขอซื้อ
                    </h4>
                    <p>กดปุ่ม <b>NEW PR</b> เพื่อสร้างรายการใหม่ ระบุชื่อผู้ขอ แผนก และรายการสินค้าที่ต้องการสั่งซื้อ</p>
                 </div>
                 <div>
                    <h4 className="font-bold border-b pb-1 text-[#111f42] uppercase flex items-center gap-2 mb-3">
                      <Kanban size={16} className="text-[#E3624A]"/> 2. การติดตามสถานะ
                    </h4>
                    <p>ใช้หน้า <b>BOARD</b> เพื่อดูภาพรวมของใบขอซื้อในแต่ละขั้นตอน ตั้งแต่รอตรวจสอบจนถึงอนุมัติ</p>
                 </div>
                 <div>
                    <h4 className="font-bold border-b pb-1 text-[#111f42] uppercase flex items-center gap-2 mb-3">
                      <CheckCircle size={16} className="text-[#E3624A]"/> 3. การอนุมัติ
                    </h4>
                    <p>ผู้มีอำนาจสามารถเปลี่ยนสถานะเป็น <b>Approved</b> หรือ <b>Rejected</b> พร้อมระบุเหตุผลในประวัติ (History Log)</p>
                 </div>
              </div>
              <div className="p-4 border-t flex justify-end bg-slate-50">
                <button onClick={() => setIsGuideOpen(false)} className="bg-[#111f42] text-white px-8 py-2.5 rounded-xl font-bold text-[12px] uppercase tracking-wider shadow-md">
                  เข้าใจแล้ว
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

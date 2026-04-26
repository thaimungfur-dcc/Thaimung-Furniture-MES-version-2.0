import React, { useState, useEffect, useMemo } from 'react';
import { 
  ShieldAlert, 
  Search, 
  Plus, 
  Calendar, 
  LayoutDashboard, 
  Kanban,
  List,
  HelpCircle,
  TrendingUp,
  AlertCircle,
  CheckCircle,
  Bell,
  ArrowRight,
  X
} from 'lucide-react';

import { PageHeader } from '../../components/shared/PageHeader';
import { KpiCard } from '../../components/shared/KpiCard';
import NcCharts from './components/NcCharts';
import NcKanbanBoard from './components/NcKanbanBoard';
import NcLogTable from './components/NcLogTable';
import NcActionModal from './components/NcActionModal';
import NcPreviewModal from './components/NcPreviewModal';

interface ScarItem {
  id: string;
  date: string;
  vendor: string;
  email: string;
  item: string;
  problem: string;
  severity: string;
  status: string;
  requester: string;
  vendorResponse: {
    rootCause: string;
    corrective: string;
    preventive: string;
    responder: string;
    date: string;
  };
  followUp: {
    status: string;
    results: string;
    checker: string;
    date: string;
  };
}

export default function PurchaseNC() {
  const [activeTab, setActiveTab] = useState('dashboard'); 
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [selectedMonth, setSelectedMonth] = useState('2026-03'); 
  const [loading, setLoading] = useState(false);
  
  const [stackExpanded, setStackExpanded] = useState<Record<string, boolean>>({
    'Submitted': false, 'Vendor Responded': false, 'Follow up': false, 'Closed': false
  });

  const [modalOpen, setModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState('view'); 
  const [modalTab, setModalTab] = useState('general');
  const [isGuideOpen, setIsGuideOpen] = useState(false);
  const [previewModal, setPreviewModal] = useState<string | null>(null);
  const [selectedItem, setSelectedItem] = useState<ScarItem | null>(null);

  const [scarData, setScarData] = useState<ScarItem[]>([]);
  const [formData, setFormData] = useState<any>({ 
    id: '', date: '', vendor: '', email: '', item: '', problem: '', severity: 'Minor', status: 'Submitted',
    vendorResponse: { rootCause: '', corrective: '', preventive: '', responder: '', date: '' },
    followUp: { status: 'Waiting', results: '', checker: '', date: '' }
  });

  const theme = { 
    primary: '#111f42', 
    accent: '#E3624A', 
    green: '#688a65', 
    warning: '#f59e0b', 
    danger: '#ef4444', 
    bg: '#F7F5F2' 
  };

  useEffect(() => {
    setLoading(true);
    setTimeout(() => {
      const mockData: ScarItem[] = [
        { id: 'SCAR-2603-001', date: '2026-03-01', vendor: 'Thai Steel Co., Ltd.', email: 'contact@thaisteel.example.com', item: 'เหล็กกล่อง 1x1', problem: 'เหล็กเป็นสนิมเกินเกณฑ์มาตรฐาน', severity: 'Major', status: 'Submitted', requester: 'สมชาย', vendorResponse: { rootCause: '', corrective: '', preventive: '', responder: '', date: '' }, followUp: { status: 'Waiting', results: '', checker: '', date: '' } },
        { id: 'SCAR-2603-002', date: '2026-03-02', vendor: 'Wood Intertrade', email: 'sales@woodinter.example.com', item: 'ไม้อัด 15mm', problem: 'ความหนาไม่ได้มาตรฐาน (14.2mm)', severity: 'Critical', status: 'Vendor Responded', requester: 'วิภา', vendorResponse: { rootCause: 'เครื่องจักรคลาดเคลื่อน', corrective: 'ส่งของใหม่แทน', preventive: 'Calibrate เครื่องจักรทุกเดือน', responder: 'คุณมานพ', date: '2026-03-03' }, followUp: { status: 'In Progress', results: 'รอตรวจสอบล็อตใหม่', checker: 'พีระ (PC)', date: '' } },
        { id: 'SCAR-2603-003', date: '2026-03-05', vendor: 'Pack & Go Supply', email: 'support@packandgo.example.com', item: 'กล่องกระดาษ', problem: 'ส่งของไม่ครบตาม PO', severity: 'Minor', status: 'Closed', requester: 'นพดล', vendorResponse: { rootCause: 'นับจำนวนผิด', corrective: 'ส่งเพิ่มทันที', preventive: 'Double Check ระบบคลัง', responder: 'คุณอารีย์', date: '2026-03-06' }, followUp: { status: 'Success', results: 'ได้รับของครบแล้ว', checker: 'PC Team', date: '2026-03-08' } },
        { id: 'SCAR-2603-004', date: '2026-03-06', vendor: 'Color Master Paint', email: 'service@colorpaint.example.com', item: 'สีพ่นดำด้าน', problem: 'สีผิดเฉด', severity: 'Major', status: 'Follow up', requester: 'ชัยสิทธิ์', vendorResponse: { rootCause: 'ผสมแม่สีผิด', corrective: 'เปลี่ยนถังใหม่', preventive: 'ใช้เครื่องตรวจสีดิจิทัล', responder: 'คุณมานะ', date: '2026-03-07' }, followUp: { status: 'In Progress', results: 'รอตัวอย่างสีทดสอบ', checker: 'QA Team', date: '' } },
        { id: 'SCAR-2603-005', date: '2026-03-08', vendor: 'Fastner Pro', email: 'info@fastnerpro.example.com', item: 'น็อต M8', problem: 'เกลียวรูดหลายรายการ', severity: 'Major', status: 'Submitted', requester: 'วิรัช', vendorResponse: { rootCause: '', corrective: '', preventive: '', responder: '', date: '' }, followUp: { status: 'Waiting', results: '', checker: '', date: '' } },
        { id: 'SCAR-2603-006', date: '2026-03-10', vendor: 'Logistics Star', email: 'logistics@star.com', item: 'ขนส่งสินค้า', problem: 'สินค้าเสียหายจากการรัดสาย', severity: 'Major', status: 'Submitted', requester: 'ดนัย', vendorResponse: { rootCause: '', corrective: '', preventive: '', responder: '', date: '' }, followUp: { status: 'Waiting', results: '', checker: '', date: '' } },
        { id: 'SCAR-2603-007', date: '2026-03-11', vendor: 'Thai Metal Works', email: 'office@tmw.com', item: 'แผ่นอลูมิเนียม', problem: 'มีรอยขีดข่วนลึก', severity: 'Critical', status: 'Submitted', requester: 'สมชาย', vendorResponse: { rootCause: '', corrective: '', preventive: '', responder: '', date: '' }, followUp: { status: 'Waiting', results: '', checker: '', date: '' } },
        { id: 'SCAR-2603-008', date: '2026-03-12', vendor: 'Plastic Union', email: 'sales@pu.com', item: 'ถุงพลาสติก', problem: 'รอยซีลไม่แข็งแรง', severity: 'Minor', status: 'Submitted', requester: 'ก้อย', vendorResponse: { rootCause: '', corrective: '', preventive: '', responder: '', date: '' }, followUp: { status: 'Waiting', results: '', checker: '', date: '' } },
        { id: 'SCAR-2603-009', date: '2026-03-13', vendor: 'Chemical Solution', email: 'info@chemsol.com', item: 'น้ำยาทำความสะอาด', problem: 'ค่า pH ไม่ตรงสเปค', severity: 'Major', status: 'Submitted', requester: 'วิรัช', vendorResponse: { rootCause: '', corrective: '', preventive: '', responder: '', date: '' }, followUp: { status: 'Waiting', results: '', checker: '', date: '' } },
        { id: 'SCAR-2603-010', date: '2026-03-14', vendor: 'Inter Paper', email: 'service@interpaper.com', item: 'แกนกระดาษ', problem: 'แกนคดงอ', severity: 'Major', status: 'Submitted', requester: 'วิภา', vendorResponse: { rootCause: '', corrective: '', preventive: '', responder: '', date: '' }, followUp: { status: 'Waiting', results: '', checker: '', date: '' } },
        { id: 'SCAR-2603-011', date: '2026-03-15', vendor: 'Thai Steel Co., Ltd.', email: 'contact@thaisteel.com', item: 'เหล็กเส้น 9mm', problem: 'หน้าตัดไม่ได้รูป', severity: 'Critical', status: 'Submitted', requester: 'สมชาย', vendorResponse: { rootCause: '', corrective: '', preventive: '', responder: '', date: '' }, followUp: { status: 'Waiting', results: '', checker: '', date: '' } },
        { id: 'SCAR-2603-012', date: '2026-03-16', vendor: 'Thai Steel Co., Ltd.', email: 'contact@thaisteel.com', item: 'เหล็กเส้น 12mm', problem: 'มีคราบน้ำมันหนาเกินไป', severity: 'Minor', status: 'Submitted', requester: 'วิรัช', vendorResponse: { rootCause: '', corrective: '', preventive: '', responder: '', date: '' }, followUp: { status: 'Waiting', results: '', checker: '', date: '' } },
      ];
      setScarData(mockData);
      setLoading(false);
    }, 500);
  }, []);

  const formatDate = (dateString: string) => {
    if (!dateString) return '-';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' });
  };

  const formatDateYMD = (dateString: string) => {
    if (!dateString) return '-';
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = date?.toLocaleString('en-US', { month: 'short' });
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const getSeverityClass = (severity: string) => {
    switch(severity) {
      case 'Critical': return 'bg-[#ef4444] text-white'; 
      case 'Major': return 'bg-[#ea580c] text-white'; 
      case 'Minor': return 'bg-[#fbbf24] text-white'; 
      default: return 'bg-slate-100 text-slate-500';
    }
  };

  const getStatusClass = (status: string) => {
    switch(status) {
      case 'Closed': return 'bg-emerald-50 text-emerald-600 border-emerald-200';
      case 'Submitted': return 'bg-rose-50 text-rose-600 border-rose-200';
      case 'Vendor Responded': return 'bg-amber-50 text-amber-600 border-amber-200';
      case 'Follow up': return 'bg-blue-50 text-blue-600 border-blue-200';
      default: return 'bg-slate-50 text-slate-600 border-slate-200';
    }
  };

  const monthFilteredData = useMemo(() => scarData?.filter(item => item.date.startsWith(selectedMonth)), [scarData, selectedMonth]);
  
  const logTableData = useMemo(() => {
    let result = monthFilteredData;
    if (filterStatus !== 'all') {
      result = result?.filter(item => item.status === filterStatus);
    }
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      result = result?.filter(item => item.id.toLowerCase().includes(q) || item.vendor.toLowerCase().includes(q));
    }
    return result;
  }, [monthFilteredData, searchQuery, filterStatus]);

  const stats = useMemo(() => ({
    total: monthFilteredData.length,
    pending: monthFilteredData?.filter(p => p.status === 'Submitted').length,
    followup: monthFilteredData?.filter(p => ['Vendor Responded', 'Follow up'].includes(p.status)).length,
    closed: monthFilteredData?.filter(p => p.status === 'Closed').length,
    critical: monthFilteredData?.filter(d => d.severity === 'Critical').length,
    major: monthFilteredData?.filter(d => d.severity === 'Major').length,
    minor: monthFilteredData?.filter(d => d.severity === 'Minor').length,
  }), [monthFilteredData]);

  const openModal = (mode: string, data: any = null) => {
    setModalMode(mode);
    setModalTab(mode === 'vendor' ? 'response' : 'general');
    if (mode === 'create') {
      const newCount = scarData?.filter(d => d.date.startsWith(selectedMonth)).length + 1;
      setFormData({ 
        id: `SCAR-${selectedMonth.slice(2, 4)}${selectedMonth.split('-')[1]}-${String(newCount).padStart(3, '0')}`, 
        date: new Date().toISOString().split('T')[0], vendor: '', email: '', item: '', problem: '', severity: 'Minor', status: 'Submitted',
        vendorResponse: { rootCause: '', corrective: '', preventive: '', responder: '', date: '' },
        followUp: { status: 'Waiting', results: '', checker: '', date: '' }
      });
    } else {
      setFormData({ ...data });
    }
    setModalOpen(true);
  };

  const handleSaveSCAR = () => {
    if(modalMode !== 'vendor' && (!formData.vendor || !formData.problem)) return alert('กรุณากรอกข้อมูลให้ครบถ้วน');
    let finalData = { ...formData };
    if (modalMode === 'vendor') {
      finalData.status = 'Vendor Responded';
      finalData.vendorResponse.date = new Date().toISOString().split('T')[0];
    }
    if(modalMode === 'create') setScarData([finalData, ...scarData]);
    else setScarData(scarData?.map(d => d.id === finalData.id ? finalData : d));
    setModalOpen(false);
  };

  const handleSendEmail = (item: ScarItem) => {
    if (!item.email) return alert('ไม่พบอีเมลผู้จำหน่าย');
    const subject = encodeURIComponent(`SCAR Action Required: ${item.id}`);
    const body = encodeURIComponent(`Dear ${item.vendor},\n\nPlease review SCAR No: ${item.id}.\n\nProblem: ${item.problem}`);
    window.location.href = `mailto:${item.email}?subject=${subject}&body=${body}`;
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
        Icon={ShieldAlert}
        title="PURCHASE NC (SCAR)"
        subtitle="Supplier Corrective Action Request"
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
                onClick={() => setActiveTab('dashboard')} 
                className={`px-4 py-0 font-black transition-all flex items-center gap-2 uppercase tracking-widest rounded-lg text-[10px] ${activeTab === 'dashboard' ? 'bg-[#111f42] text-white shadow-md' : 'text-slate-500 hover:bg-slate-50'}`}
              >
                <LayoutDashboard size={14} /> DASHBOARD
              </button>
              <button 
                onClick={() => setActiveTab('kanban')} 
                className={`px-4 py-0 font-black transition-all flex items-center gap-2 uppercase tracking-widest rounded-lg text-[10px] ${activeTab === 'kanban' ? 'bg-[#E3624A] text-white shadow-md' : 'text-slate-500 hover:bg-slate-50'}`}
              >
                <Kanban size={14} /> KANBAN
              </button>
              <button 
                onClick={() => setActiveTab('log')} 
                className={`px-4 py-0 font-black transition-all flex items-center gap-2 uppercase tracking-widest rounded-lg text-[10px] ${activeTab === 'log' ? 'bg-[#1c213f] text-white shadow-md' : 'text-slate-500 hover:bg-slate-50'}`}
              >
                <List size={14} /> LOG SHEET
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

        {/* Content Views */}
        {activeTab === 'dashboard' && (
          <div className="flex flex-col gap-4 animate-in fade-in duration-500 w-full no-print overflow-y-auto pb-6 transition-all">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <KpiCard 
                title="TOTAL ISSUED"
                value={stats.total}
                icon={ShieldAlert}
                color="#E3624A"
                subValue="Total Quality Discrepancies"
              />
              <KpiCard 
                title="PENDING RESPONSE"
                value={stats.pending}
                icon={Bell}
                color="#f59e0b"
                subValue="Waiting for Vendor Action"
              />
              <KpiCard 
                title="CLOSED NCs"
                value={stats.closed}
                icon={CheckCircle}
                color="#688a65"
                subValue="Corrective Actions Verified"
              />
            </div>

            <NcCharts stats={stats} scarData={scarData} theme={theme} />
            
            <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex flex-col">
              <div className="flex justify-between items-center mb-6">
                <h3 className="font-bold text-[#111f42] flex items-center gap-2 text-lg">
                  <TrendingUp size={20} className="text-[#E3624A]"/> Recent Activity
                </h3>
              </div>
              <div className="space-y-4">
                {scarData.slice(0, 5)?.map((item, i) => (
                  <div key={i} className="flex justify-between items-center border-b border-slate-100 last:border-0 last:pb-0">
                    <div className="flex flex-col">
                      <span className="font-bold text-[#111f42] text-xs">{item.id} - {item.vendor}</span>
                      <span className="text-slate-400 text-[10px]">{formatDate(item.date)}</span>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-[9px] font-bold uppercase tracking-wider border ${getStatusClass(item.status)}`}>
                      {item.status}
                    </span>
                  </div>
                ))}
              </div>
              <button 
                onClick={() => setActiveTab('log')} 
                className="mt-6 w-full py-3.5 bg-[#111f42] text-white font-bold rounded-xl hover:bg-[#111f42]/90 shadow-md transition-all flex items-center justify-center gap-2 uppercase tracking-widest text-[11px]"
              >
                View All Records <ArrowRight size={16}/>
              </button>
            </div>
          </div>
        )}

        {activeTab === 'kanban' && (
          <NcKanbanBoard 
            monthFilteredData={monthFilteredData}
            stackExpanded={stackExpanded}
            setStackExpanded={setStackExpanded}
            openModal={openModal}
            handleSendEmail={handleSendEmail}
            getSeverityClass={getSeverityClass}
            formatDate={formatDate}
          />
        )}

        {activeTab === 'log' && (
          <div className="bg-white border border-slate-100 shadow-sm overflow-hidden rounded-none flex-1 flex flex-col no-print">
            <div className="p-3 flex items-center justify-between gap-4 bg-white border-b border-slate-100 overflow-x-auto flex-shrink-0">
              <div className="flex items-center gap-4 flex-shrink-0">
                <div className="flex bg-slate-100 p-1 rounded-lg">
                  {['all', 'Submitted', 'Vendor Responded', 'Follow up', 'Closed']?.map(f => (
                    <button 
                      key={f} 
                      onClick={() => setFilterStatus(f)} 
                      className={`px-4 py-1.5 whitespace-nowrap text-[10px] font-bold uppercase rounded-md transition-all ${filterStatus === f ? 'bg-[#2C3F70] text-white shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                    >
                      {f}
                    </button>
                  ))}
                </div>
                <div className="relative w-64 flex items-center bg-white border border-slate-200 rounded-lg px-3 py-1.5">
                  <Search className="text-slate-400" size={16} />
                  <input 
                    type="text" 
                    placeholder="Search SCAR NO / Vendor..." 
                    className="w-full bg-transparent border-none outline-none ml-2 text-slate-700 font-medium text-[12px]" 
                    value={searchQuery} 
                    onChange={e => setSearchQuery(e.target.value)} 
                  />
                </div>
              </div>
              <button 
                onClick={() => openModal('create')} 
                className="flex-shrink-0 bg-[#111f42] text-white text-[11px] font-bold py-2.5 rounded-lg uppercase tracking-widest flex items-center gap-2 shadow-md hover:opacity-90 transition-all"
              >
                <Plus size={16} strokeWidth={3} className="text-[#E3624A]" /> ISSUE SCAR
              </button>
            </div>

            <NcLogTable 
              logTableData={logTableData}
              openModal={openModal}
              setSelectedItem={setSelectedItem}
              setPreviewModal={setPreviewModal}
              getSeverityClass={getSeverityClass}
              getStatusClass={getStatusClass}
              formatDate={formatDate}
            />
          </div>
        )}

        {/* Modals */}
        <NcActionModal 
          modalOpen={modalOpen}
          setModalOpen={setModalOpen}
          modalMode={modalMode}
          modalTab={modalTab}
          setModalTab={setModalTab}
          formData={formData}
          setFormData={setFormData}
          handleSaveSCAR={handleSaveSCAR}
        />

        <NcPreviewModal 
          previewModal={previewModal}
          setPreviewModal={setPreviewModal}
          selectedItem={selectedItem}
          formatDateYMD={formatDateYMD}
        />

        {/* Guide Drawer */}
        {isGuideOpen && (
          <>
            <div className="fixed inset-0 bg-[#111f42]/40 backdrop-blur-sm z-[60] animate-in fade-in duration-200 no-print" onClick={() => setIsGuideOpen(false)} />
            <div className="fixed inset-y-0 right-0 w-full md:w-[450px] bg-white shadow-2xl z-[70] flex flex-col animate-in slide-in-from-right duration-300 no-print">
              <div className="py-5 flex justify-between items-center bg-[#111f42] text-white shrink-0 border-b-4 border-[#E3624A]">
                <h2 className="text-base font-semibold uppercase tracking-widest flex items-center gap-2">
                  <HelpCircle size={20} className="text-[#E3624A]" /> คู่มือระบบ SCAR
                </h2>
                <button onClick={() => setIsGuideOpen(false)} className="hover:bg-white/20 p-1.5 rounded-lg transition-colors">
                  <X size={20} />
                </button>
              </div>
              <div className="flex-1 overflow-y-auto p-8 text-slate-700 space-y-8 text-[13px] leading-relaxed">
                 <div>
                    <h4 className="font-bold border-b pb-1 text-[#111f42] uppercase flex items-center gap-2 mb-3">
                      <AlertCircle size={16} className="text-[#E3624A]"/> 1. การออกใบ SCAR
                    </h4>
                    <p>เมื่อพบปัญหาคุณภาพสินค้าจากผู้จำหน่าย (Vendor) ให้ทำการสร้างใบ SCAR เพื่อแจ้งให้ผู้จำหน่ายทราบและดำเนินการแก้ไข</p>
                 </div>
                 <div>
                    <h4 className="font-bold border-b pb-1 text-[#111f42] uppercase flex items-center gap-2 mb-3">
                      <TrendingUp size={16} className="text-[#E3624A]"/> 2. การติดตามผล (Follow Up)
                    </h4>
                    <p>หลังจากผู้จำหน่ายตอบกลับ (Vendor Responded) ทีม PC หรือ QA จะต้องทำการตรวจสอบผลการแก้ไขและบันทึกในส่วน Follow Up</p>
                 </div>
                 <div>
                    <h4 className="font-bold border-b pb-1 text-[#111f42] uppercase flex items-center gap-2 mb-3">
                      <CheckCircle size={16} className="text-[#E3624A]"/> 3. การปิดงาน (Closed)
                    </h4>
                    <p>เมื่อการแก้ไขเสร็จสมบูรณ์และผ่านการตรวจสอบ ให้เปลี่ยนสถานะเป็น Closed เพื่อเสร็จสิ้นกระบวนการ</p>
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

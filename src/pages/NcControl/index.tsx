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

import NcKpiCard from '../PurchaseNC/components/NcKpiCard';
import NcCharts from '../PurchaseNC/components/NcCharts';
import NcKanbanBoard from './components/NcKanbanBoard';
import NcLogTable from './components/NcLogTable';
import NcActionModal from './components/NcActionModal';
import NcPreviewModal from './components/NcPreviewModal';

interface NcItem {
  id: string;
  date: string;
  department: string;
  item: string;
  problem: string;
  severity: string;
  status: string;
  requester: string;
  response: {
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

export default function NcControl() {
  const [activeTab, setActiveTab] = useState('dashboard'); 
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [selectedMonth, setSelectedMonth] = useState('2026-03'); 
  const [loading, setLoading] = useState(false);
  
  const [stackExpanded, setStackExpanded] = useState<Record<string, boolean>>({
    'Submitted': false, 'Responded': false, 'Follow up': false, 'Closed': false
  });

  const [modalOpen, setModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState('view'); 
  const [modalTab, setModalTab] = useState('general');
  const [isGuideOpen, setIsGuideOpen] = useState(false);
  const [previewModal, setPreviewModal] = useState<string | null>(null);
  const [selectedItem, setSelectedItem] = useState<NcItem | null>(null);

  const [ncData, setNcData] = useState<NcItem[]>([]);
  const [formData, setFormData] = useState<any>({ 
    id: '', date: '', department: '', item: '', problem: '', severity: 'Minor', status: 'Submitted',
    response: { rootCause: '', corrective: '', preventive: '', responder: '', date: '' },
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
      const mockData: NcItem[] = [
        { id: 'NC-2603-001', date: '2026-03-01', department: 'Production Line 1', item: 'โต๊ะทำงาน T-01', problem: 'รอยขีดข่วนบนหน้าท็อป', severity: 'Major', status: 'Submitted', requester: 'สมชาย', response: { rootCause: '', corrective: '', preventive: '', responder: '', date: '' }, followUp: { status: 'Waiting', results: '', checker: '', date: '' } },
        { id: 'NC-2603-002', date: '2026-03-02', department: 'Assembly', item: 'เก้าอี้ C-05', problem: 'น็อตหลวม', severity: 'Critical', status: 'Responded', requester: 'วิภา', response: { rootCause: 'พนักงานประกอบไม่แน่น', corrective: 'ขันน็อตใหม่ทั้งหมด', preventive: 'อบรมพนักงานใหม่', responder: 'คุณมานพ', date: '2026-03-03' }, followUp: { status: 'In Progress', results: 'รอตรวจสอบล็อตใหม่', checker: 'พีระ (QC)', date: '' } },
        { id: 'NC-2603-003', date: '2026-03-05', department: 'Packaging', item: 'ตู้เสื้อผ้า W-02', problem: 'กล่องบรรจุภัณฑ์ฉีกขาด', severity: 'Minor', status: 'Closed', requester: 'นพดล', response: { rootCause: 'กล่องบางเกินไป', corrective: 'เปลี่ยนกล่องใหม่', preventive: 'แจ้งจัดซื้อเปลี่ยนสเปคกล่อง', responder: 'คุณอารีย์', date: '2026-03-06' }, followUp: { status: 'Success', results: 'เปลี่ยนกล่องเรียบร้อย', checker: 'QC Team', date: '2026-03-08' } },
      ];
      setNcData(mockData);
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
    const month = date.toLocaleString('en-US', { month: 'short' });
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
      case 'Responded': return 'bg-amber-50 text-amber-600 border-amber-200';
      case 'Follow up': return 'bg-blue-50 text-blue-600 border-blue-200';
      default: return 'bg-slate-50 text-slate-600 border-slate-200';
    }
  };

  const monthFilteredData = useMemo(() => ncData.filter(item => item.date.startsWith(selectedMonth)), [ncData, selectedMonth]);
  
  const logTableData = useMemo(() => {
    let result = monthFilteredData;
    if (filterStatus !== 'all') {
      result = result.filter(item => item.status === filterStatus);
    }
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      result = result.filter(item => item.id.toLowerCase().includes(q) || item.department.toLowerCase().includes(q));
    }
    return result;
  }, [monthFilteredData, searchQuery, filterStatus]);

  const stats = useMemo(() => ({
    total: monthFilteredData.length,
    pending: monthFilteredData.filter(p => p.status === 'Submitted').length,
    followup: monthFilteredData.filter(p => ['Responded', 'Follow up'].includes(p.status)).length,
    closed: monthFilteredData.filter(p => p.status === 'Closed').length,
    critical: monthFilteredData.filter(d => d.severity === 'Critical').length,
    major: monthFilteredData.filter(d => d.severity === 'Major').length,
    minor: monthFilteredData.filter(d => d.severity === 'Minor').length,
  }), [monthFilteredData]);

  const openModal = (mode: string, data: any = null) => {
    setModalMode(mode);
    setModalTab(mode === 'department' ? 'response' : 'general');
    if (mode === 'create') {
      const newCount = ncData.filter(d => d.date.startsWith(selectedMonth)).length + 1;
      setFormData({ 
        id: `NC-${selectedMonth.slice(2, 4)}${selectedMonth.split('-')[1]}-${String(newCount).padStart(3, '0')}`, 
        date: new Date().toISOString().split('T')[0], department: '', item: '', problem: '', severity: 'Minor', status: 'Submitted',
        response: { rootCause: '', corrective: '', preventive: '', responder: '', date: '' },
        followUp: { status: 'Waiting', results: '', checker: '', date: '' }
      });
    } else {
      setFormData({ ...data });
    }
    setModalOpen(true);
  };

  const handleSaveNC = () => {
    if(modalMode !== 'department' && (!formData.department || !formData.problem)) return alert('กรุณากรอกข้อมูลให้ครบถ้วน');
    let finalData = { ...formData };
    if (modalMode === 'department') {
      finalData.status = 'Responded';
      finalData.response.date = new Date().toISOString().split('T')[0];
    }
    if(modalMode === 'create') setNcData([finalData, ...ncData]);
    else setNcData(ncData.map(d => d.id === finalData.id ? finalData : d));
    setModalOpen(false);
  };

  return (
    <div className="transition-colors duration-500 text-[12px] flex flex-col bg-[#F7F5F2] pt-8 pb-10">
      <style>{`
        * { font-family: 'JetBrains Mono', 'Noto Sans Thai', sans-serif !important; }
        .kanban-scroll::-webkit-scrollbar { width: 6px; height: 6px; }
        .kanban-scroll::-webkit-scrollbar-thumb { background: #CBD5E1; border-radius: 3px; }
        @media print {
          @page { size: A4 portrait; margin: 10mm; }
          .no-print { display: none !important; }
        }
      `}</style>
      
      <div className="w-full space-y-6 relative flex-1 flex flex-col">
        {/* Header */}
        <PageHeader 
          title="NC CONTROL" 
          subtitle="Non-Conformance Control"
          icon={ShieldAlert}
          iconColor="text-[#E3624A]"
          rightContent={
            <>
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
                  onClick={() => setActiveTab('dashboard')} 
                  className={`px-5 py-2.5 font-semibold transition-all flex items-center gap-2 uppercase tracking-widest rounded-md text-[11px] ${activeTab === 'dashboard' ? 'bg-[#111f42] text-white shadow-md' : 'text-slate-500 hover:bg-slate-50'}`}
                >
                  <LayoutDashboard size={14} /> DASHBOARD
                </button>
                <button 
                  onClick={() => setActiveTab('kanban')} 
                  className={`px-5 py-2.5 font-semibold transition-all flex items-center gap-2 uppercase tracking-widest rounded-md text-[11px] ${activeTab === 'kanban' ? 'bg-[#ab8a3b] text-white shadow-md' : 'text-slate-500 hover:bg-slate-50'}`}
                >
                  <Kanban size={14} /> KANBAN
                </button>
                <button 
                  onClick={() => setActiveTab('log')} 
                  className={`px-5 py-2.5 font-semibold transition-all flex items-center gap-2 uppercase tracking-widest rounded-md text-[11px] ${activeTab === 'log' ? 'bg-[#E3624A] text-white shadow-md' : 'text-slate-500 hover:bg-slate-50'}`}
                >
                  <List size={14} /> LOG SHEET
                </button>
              </div>
            </>
          }
          actionButton={
            <button 
              onClick={() => setIsGuideOpen(true)} 
              className="p-2.5 transition-all rounded-lg bg-white border border-slate-200 shadow-sm hover:bg-slate-100"
            >
              <HelpCircle size={18} />
            </button>
          }
        />

        {/* Content Views */}
        {activeTab === 'dashboard' && (
          <div className="flex flex-col gap-6 animate-in fade-in duration-500 w-full no-print pb-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              <NcKpiCard 
                title="TOTAL ISSUED"
                value={stats.total}
                icon={ShieldAlert}
                color="#E3624A"
                bgColor="#fdebe9"
              />
              <NcKpiCard 
                title="PENDING RESPONSE"
                value={stats.pending}
                icon={Bell}
                color="#f59e0b"
                bgColor="#fffbeb"
              />
              <NcKpiCard 
                title="CLOSED NCs"
                value={stats.closed}
                icon={CheckCircle}
                color="#688a65"
                bgColor="#f0fdf4"
              />
            </div>

            <NcCharts stats={stats} scarData={ncData} theme={theme} />
            
            <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex flex-col">
              <div className="flex justify-between items-center mb-6">
                <h3 className="font-bold text-[#111f42] flex items-center gap-2 text-lg">
                  <TrendingUp size={20} className="text-[#E3624A]"/> Recent Activity
                </h3>
              </div>
              <div className="space-y-4">
                {ncData.slice(0, 5).map((item, i) => (
                  <div key={i} className="flex justify-between items-center border-b border-slate-100 pb-4 last:border-0 last:pb-0">
                    <div className="flex flex-col">
                      <span className="font-bold text-[#111f42] text-xs">{item.id} - {item.department}</span>
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
            getSeverityClass={getSeverityClass}
            formatDate={formatDate}
          />
        )}

        {activeTab === 'log' && (
          <div className="bg-white border border-slate-100 shadow-sm overflow-hidden rounded-none flex-1 flex flex-col no-print">
            <div className="p-3 flex items-center justify-between gap-4 bg-white border-b border-slate-100 overflow-x-auto flex-shrink-0">
              <div className="flex items-center gap-4 flex-shrink-0">
                <div className="flex bg-slate-100 p-1 rounded-lg">
                  {['all', 'Submitted', 'Responded', 'Follow up', 'Closed'].map(f => (
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
                    placeholder="Search NC NO / Department..." 
                    className="w-full bg-transparent border-none outline-none ml-2 text-slate-700 font-medium text-[12px]" 
                    value={searchQuery} 
                    onChange={e => setSearchQuery(e.target.value)} 
                  />
                </div>
              </div>
              <button 
                onClick={() => openModal('create')} 
                className="flex-shrink-0 bg-[#111f42] text-white text-[11px] font-bold px-6 py-2.5 rounded-lg uppercase tracking-widest flex items-center gap-2 shadow-md hover:opacity-90 transition-all"
              >
                <Plus size={16} strokeWidth={3} className="text-[#E3624A]" /> ISSUE NC
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
          handleSaveNC={handleSaveNC}
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
              <div className="px-6 py-5 flex justify-between items-center bg-[#111f42] text-white shrink-0 border-b-4 border-[#E3624A]">
                <h2 className="text-base font-semibold uppercase tracking-widest flex items-center gap-2">
                  <HelpCircle size={20} className="text-[#E3624A]" /> คู่มือระบบ NC
                </h2>
                <button onClick={() => setIsGuideOpen(false)} className="hover:bg-white/20 p-1.5 rounded-lg transition-colors">
                  <X size={20} />
                </button>
              </div>
              <div className="flex-1 overflow-y-auto p-8 text-slate-700 space-y-8 text-[13px] leading-relaxed">
                 <div>
                    <h4 className="font-bold border-b pb-1 text-[#111f42] uppercase flex items-center gap-2 mb-3">
                      <AlertCircle size={16} className="text-[#E3624A]"/> 1. การออกใบ NC
                    </h4>
                    <p>เมื่อพบปัญหาคุณภาพสินค้าภายในโรงงาน ให้ทำการสร้างใบ NC เพื่อแจ้งให้แผนกที่เกี่ยวข้องทราบและดำเนินการแก้ไข</p>
                 </div>
                 <div>
                    <h4 className="font-bold border-b pb-1 text-[#111f42] uppercase flex items-center gap-2 mb-3">
                      <TrendingUp size={16} className="text-[#E3624A]"/> 2. การติดตามผล (Follow Up)
                    </h4>
                    <p>หลังจากแผนกที่เกี่ยวข้องตอบกลับ (Responded) ทีม QC จะต้องทำการตรวจสอบผลการแก้ไขและบันทึกในส่วน Follow Up</p>
                 </div>
                 <div>
                    <h4 className="font-bold border-b pb-1 text-[#111f42] uppercase flex items-center gap-2 mb-3">
                      <CheckCircle size={16} className="text-[#E3624A]"/> 3. การปิดงาน (Closed)
                    </h4>
                    <p>เมื่อการแก้ไขเสร็จสมบูรณ์และผ่านการตรวจสอบ ให้เปลี่ยนสถานะเป็น Closed เพื่อเสร็จสิ้นกระบวนการ</p>
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

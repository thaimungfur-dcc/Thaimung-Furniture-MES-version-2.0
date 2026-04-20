import React, { useState, useEffect, useRef, useMemo } from 'react';
import { 
  Truck, 
  Search, 
  Plus, 
  X, 
  LayoutDashboard, 
  UploadCloud, 
  HelpCircle,
  List,
  ChevronDown,
  Filter,
  PieChart,
  BarChart2
} from 'lucide-react';
import Chart from 'chart.js/auto';

import { useMasterData } from '../../context/MasterDataContext';
import SupplierKpiCard from './components/SupplierKpiCard';
import SupplierTable from './components/SupplierTable';
import SupplierActionModal from './components/SupplierActionModal';
import SupplierConfigModal from './components/SupplierConfigModal';
import SupplierIdConfigModal from './components/SupplierIdConfigModal';

export default function SupplierManagement() {
  const [activeTab, setActiveTab] = useState('list'); // 'list' | 'dashboard'
  const [searchQuery, setSearchQuery] = useState('');
  const [catFilter, setCatFilter] = useState('All');
  const fileInputRef = useRef<HTMLInputElement>(null);

  // --- Master Data Configuration ---
  const [masterConfig, setMasterConfig] = useState({
    categories: ['Supplier', 'Service', 'OEM'],
    subCategories: {
      'Supplier': ['Raw Material', 'Packaging', 'Hardware', 'Chemicals'],
      'Service': ['Logistics', 'Maintenance', 'Consulting', 'IT Support'],
      'OEM': ['Metal Parts', 'Plastic Injection', 'Electronic Assembly', 'Mold & Die']
    }
  });

  // --- ID Generator Config ---
  const [idConfig, setIdConfig] = useState({
    prefixes: {
      'Supplier': 'SUP',
      'Service': 'SEV',
      'OEM': 'OEM'
    },
    dateFormat: 'YYMM',
    runningLength: 3
  });

  // Modal & UI States
  const [modalOpen, setModalOpen] = useState(false);
  const [configModalOpen, setConfigModalOpen] = useState(false);
  const [idConfigModalOpen, setIdConfigModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState('view'); 
  const [activeFormTab, setActiveFormTab] = useState('general');
  const [isGuideOpen, setIsGuideOpen] = useState(false);

  // Pagination States
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  // Refs for Charts
  const chartStatusRef = useRef<HTMLCanvasElement>(null);
  const chartTypeRef = useRef<HTMLCanvasElement>(null);
  const chartInstances = useRef<Record<string, Chart | null>>({});

  // Mock Supplier Data
  const { suppliers, addSupplier, updateSupplier, deleteSupplier: contextDeleteSupplier } = useMasterData();

  const [form, setForm] = useState<any>({});

  const filterCategories = ['All', ...masterConfig.categories];

  // Helper: Generate Supplier ID
  const generateSupplierID = (category: string) => {
    const date = new Date();
    const yy = String(date.getFullYear()).slice(2);
    const mm = String(date.getMonth() + 1).padStart(2, '0');
    const dd = String(date.getDate()).padStart(2, '0');
    
    let dateStr = '';
    if (idConfig.dateFormat === 'YYMMDD') dateStr = `${yy}${mm}${dd}`;
    else if (idConfig.dateFormat === 'YYMM') dateStr = `${yy}${mm}`;
    else if (idConfig.dateFormat === 'YYYY') dateStr = String(date.getFullYear());

    const prefix = (idConfig.prefixes as any)[category] || 'SUP';
    const nextRunning = suppliers.length + 1;
    const running = String(nextRunning).padStart(idConfig.runningLength, '0');
    
    return `${prefix}${dateStr}-${running}`;
  };

  // Filtering Logic
  const filteredSuppliers = useMemo(() => {
    return suppliers.filter(s => {
      const matchSearch = s.supplierName.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          s.supplierID.toLowerCase().includes(searchQuery.toLowerCase());
      const matchCat = catFilter === 'All' ? true : s.category === catFilter;
      return matchSearch && matchCat;
    });
  }, [suppliers, searchQuery, catFilter]);

  // Pagination Logic
  const paginatedSuppliers = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredSuppliers.slice(start, start + itemsPerPage);
  }, [filteredSuppliers, currentPage, itemsPerPage]);

  const totalPages = Math.ceil(filteredSuppliers.length / itemsPerPage) || 1;

  const stats = {
    total: suppliers.length,
    active: suppliers.filter(s => s.status === 'Active').length,
    supplierCat: suppliers.filter(s => s.category === 'Supplier').length,
    avgRating: (suppliers.reduce((acc, curr) => acc + (curr.rating || 0), 0) / (suppliers.filter(s => s.rating > 0).length || 1)).toFixed(1)
  };

  useEffect(() => {
    if (activeTab === 'dashboard') {
      const timer = setTimeout(() => initCharts(), 100);
      return () => clearTimeout(timer);
    }
  }, [activeTab, suppliers]);

  const initCharts = () => {
    Object.values(chartInstances.current).forEach((c: any) => c && c.destroy());
    const commonOptions: any = { responsive: true, maintainAspectRatio: false, plugins: { legend: { position: 'bottom', labels: { usePointStyle: true, font: { size: 10 } } } } };

    if (chartStatusRef.current) {
      chartInstances.current.status = new Chart(chartStatusRef.current, {
        type: 'doughnut',
        data: {
          labels: ['Active', 'Prospect', 'On-Hold', 'Blacklisted'],
          datasets: [{
            data: ['Active', 'Prospect', 'On-Hold', 'Blacklisted'].map(status => suppliers.filter(s => s.status === status).length),
            backgroundColor: ['#10b981', '#72A09E', '#ab8a3b', '#E3624A'],
            borderWidth: 0
          }]
        },
        options: {
          ...commonOptions,
          cutout: '75%'
        }
      });
    }

    if (chartTypeRef.current) {
      chartInstances.current.type = new Chart(chartTypeRef.current, {
        type: 'bar',
        data: {
          labels: masterConfig.categories,
          datasets: [{
            label: 'Suppliers',
            data: masterConfig.categories.map(c => suppliers.filter(s => s.category === c).length),
            backgroundColor: '#111f42', borderRadius: 6
          }]
        },
        options: { ...commonOptions, plugins: { legend: { display: false } }, scales: { y: { beginAtZero: true, ticks: { stepSize: 1 } }, x: { grid: { display: false } } } }
      });
    }
  };

  // Handlers
  const openModal = (mode: string, data: any = null) => {
    setModalMode(mode);
    setActiveFormTab('general');
    if (mode === 'create') {
      setForm({ 
        supplierID: generateSupplierID('Supplier'), 
        supplierName: '', 
        category: 'Supplier', 
        subCategory: masterConfig.subCategories['Supplier'][0], 
        status: 'Prospect', 
        rating: 0, 
        creditTerm: 30,
        vendorAddress: '',
        contactName: '',
        phone: '',
        email: '',
        taxID: ''
      });
    } else {
      setForm(JSON.parse(JSON.stringify(data)));
    }
    setModalOpen(true);
  };

  const handleSave = () => {
    if(!form.supplierName) return;
    if(modalMode === 'create') {
      addSupplier({...form, id: Date.now().toString()});
    } else {
      updateSupplier(form.id, form);
    }
    setModalOpen(false);
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@300;400;500;700;800;900&family=Noto+Sans+Thai:wght@300;400;500;600;700;900&display=swap');
        * { font-family: 'JetBrains Mono', 'Noto Sans Thai', sans-serif !important; }
        .custom-scrollbar::-webkit-scrollbar { width: 6px; height: 6px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #CBD5E1; border-radius: 3px; }
        @media print {
          @page { size: A4 portrait; margin: 15mm; }
          .no-print { display: none !important; }
          .print-container { padding: 0 !important; width: 100% !important; max-width: none !important; }
          .print-only { display: block !important; }
        }
        .print-only { display: none; }
      `}</style>
      
      <div className="min-h-screen pt-8 px-8 pb-10 transition-colors duration-500 text-[12px] bg-[#F9F7F6]">
        <div className="w-full space-y-6 relative max-w-full mx-auto">
          
          {/* Header */}
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-6 no-print">
            <div className="flex items-center gap-4 w-full md:w-auto">
                <div className="w-14 h-14 bg-white text-[#E3624A] flex items-center justify-center shadow-md flex-shrink-0 rounded-2xl border border-slate-200 relative">
                    <Truck size={28} className="text-[#111f42]" strokeWidth={2.5} />
                    <div className="absolute bottom-[14px] right-[14px] w-[6px] h-[6px] bg-[#ab8a3b] rounded-[1px]"></div>
                </div>
              <div className="flex flex-col justify-center">
                <h1 className="text-3xl tracking-tight whitespace-nowrap uppercase leading-none">
                  <span className="font-black text-[#E3624A]">SUPPLIER</span> <span className="font-light text-[#111f42]">MANAGEMENT</span>
                </h1>
                <div className="flex items-center gap-3">
                    <p className="font-medium text-[11px] font-bold mt-1.5 text-slate-500 leading-none">
                        <span className="tracking-normal ml-1">ฐานข้อมูลและการวิเคราะห์คู่ค้า</span>
                    </p>
                </div>
              </div>
            </div>
            
            <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto">
              <div className="flex bg-[#e2e8f0] p-1 border border-slate-200 shadow-inner rounded-xl overflow-hidden flex-shrink-0">
                <button onClick={() => setActiveTab('dashboard')} className={`px-6 py-2.5 font-bold transition-all flex items-center gap-2 uppercase tracking-wide rounded-lg text-[11px] whitespace-nowrap ${activeTab === 'dashboard' ? 'bg-[#111f42] text-white shadow-md' : 'text-slate-500 hover:bg-slate-50'}`}>
                  <LayoutDashboard size={14} /> DASHBOARD
                </button>
                <button onClick={() => setActiveTab('list')} className={`px-6 py-2.5 font-bold transition-all flex items-center gap-2 uppercase tracking-wide rounded-lg text-[11px] whitespace-nowrap ${activeTab === 'list' ? 'bg-[#ab8a3b] text-white shadow-md' : 'text-slate-500 hover:bg-slate-50'}`}>
                  <List size={14} /> LIST VIEW
                </button>
              </div>
              <button onClick={() => setIsGuideOpen(true)} className="p-2.5 transition-all rounded-xl bg-white text-slate-400 hover:bg-[#111f42] hover:text-white border border-slate-200 shadow-sm">
                <HelpCircle size={20} />
              </button>
            </div>
          </div>

          {/* KPI Cards */}
          <SupplierKpiCard stats={stats} />

          {/* DASHBOARD VIEW */}
          {activeTab === 'dashboard' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 animate-in fade-in duration-500 no-print">
               <div className="bg-white p-6 rounded-[32px] border border-slate-100 shadow-sm flex flex-col h-[400px]">
                  <h3 className="text-xs font-black text-[#111f42] uppercase tracking-widest mb-6 flex items-center gap-2"><PieChart size={16} className="text-[#E3624A]"/> Supplier Status Overview</h3>
                  <div className="flex-1 relative"><canvas ref={chartStatusRef}></canvas></div>
               </div>
               <div className="bg-white p-6 rounded-[32px] border border-slate-100 shadow-sm flex flex-col h-[400px]">
                  <h3 className="text-xs font-black text-[#111f42] uppercase tracking-widest mb-6 flex items-center gap-2"><BarChart2 size={16} className="text-[#E3624A]"/> Suppliers by Category</h3>
                  <div className="flex-1 relative"><canvas ref={chartTypeRef}></canvas></div>
               </div>
            </div>
          )}

          {/* LIST VIEW */}
          {activeTab === 'list' && (
            <div className="flex flex-col flex-1">
              {/* Table Toolbar */}
              <div className="p-4 flex items-center justify-between gap-4 bg-slate-50/50 border border-slate-100 border-b-0 overflow-x-auto no-scrollbar rounded-t-none">
                <div className="flex items-center gap-4 flex-shrink-0">
                  <div className="relative flex-shrink-0 group">
                    <div className="absolute left-3 top-1/2 -translate-y-1/2 text-[#ab8a3b] pointer-events-none group-focus-within:text-[#111f42] transition-colors">
                      <Filter size={14} />
                    </div>
                    <select 
                      value={catFilter} 
                      onChange={e => {setCatFilter(e.target.value); setCurrentPage(1);}} 
                      className="bg-white border border-slate-200 rounded-xl pl-9 pr-10 py-2.5 outline-none focus:border-[#ab8a3b] text-[#111f42] font-black text-[10px] uppercase tracking-widest shadow-sm cursor-pointer appearance-none transition-all hover:border-[#ab8a3b]/50 min-w-[180px]"
                    >
                      {filterCategories.map(f => (
                        <option key={f} value={f}>{f === 'All' ? 'ALL CATEGORIES' : f.toUpperCase()}</option>
                      ))}
                    </select>
                    <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                      <ChevronDown size={14} />
                    </div>
                  </div>
                  <div className="h-6 w-px bg-slate-200 flex-shrink-0 hidden lg:block"></div>
                  <div className="relative w-48 md:w-64 flex-shrink-0">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
                    <input 
                      type="text" 
                      placeholder="Search Supplier Name / ID..." 
                      className="w-full bg-white border border-slate-200 rounded-xl pl-9 pr-4 py-2.5 outline-none focus:border-[#ab8a3b] text-[#111f42] font-bold text-[12px] shadow-sm transition-all"
                      value={searchQuery}
                      onChange={e => setSearchQuery(e.target.value)}
                    />
                  </div>
                </div>

                <div className="flex items-center gap-3 flex-shrink-0 ml-auto">
                  <button 
                    onClick={() => fileInputRef.current?.click()} 
                    className="flex justify-center items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-100 text-slate-600 hover:text-[#111f42] hover:bg-slate-200 transition-all font-bold uppercase tracking-wide text-[11px] shadow-sm"
                  >
                    <UploadCloud size={16} className="text-slate-400" /> IMPORT
                    <input type="file" ref={fileInputRef} className="hidden" />
                  </button>
                  <button 
                    onClick={() => openModal('create')} 
                    className="flex justify-center items-center gap-2 px-6 py-2.5 bg-[#111f42] text-white rounded-xl font-bold uppercase tracking-wide text-[11px] shadow-md hover:bg-[#1a2d5c] transition-all"
                  >
                    <Plus size={16} className="text-[#ab8a3b]" strokeWidth={3} /> NEW SUPPLIER
                  </button>
                </div>
              </div>

              <SupplierTable 
                suppliers={paginatedSuppliers}
                onView={(supp) => openModal('view', supp)}
                onEdit={(supp) => openModal('edit', supp)}
                currentPage={currentPage}
                totalPages={totalPages}
                itemsPerPage={itemsPerPage}
                onPageChange={setCurrentPage}
                onItemsPerPageChange={(items) => {setItemsPerPage(items); setCurrentPage(1);}}
              />
            </div>
          )}

          {/* Action Modal */}
          <SupplierActionModal 
            modalOpen={modalOpen}
            setModalOpen={setModalOpen}
            modalMode={modalMode}
            setModalMode={setModalMode}
            form={form}
            setForm={setForm}
            activeFormTab={activeFormTab}
            setActiveFormTab={setActiveFormTab}
            handleSave={handleSave}
            masterConfig={masterConfig}
            setIdConfigModalOpen={setIdConfigModalOpen}
            setConfigModalOpen={setConfigModalOpen}
            generateSupplierID={generateSupplierID}
          />

          {/* Config Modals */}
          <SupplierConfigModal 
            configModalOpen={configModalOpen}
            setConfigModalOpen={setConfigModalOpen}
            masterConfig={masterConfig}
          />

          <SupplierIdConfigModal 
            idConfigModalOpen={idConfigModalOpen}
            setIdConfigModalOpen={setIdConfigModalOpen}
            idConfig={idConfig}
            setIdConfig={setIdConfig}
            generateSupplierID={generateSupplierID}
            currentCategory={form.category}
            setForm={setForm}
            form={form}
          />

          {/* User Guide Drawer */}
          {isGuideOpen && (
            <>
              <div className="fixed inset-0 bg-[#111f42]/40 backdrop-blur-sm z-[60] animate-in fade-in duration-200 no-print" onClick={() => setIsGuideOpen(false)} />
              <div className="fixed inset-y-0 right-0 w-full md:w-[450px] bg-white shadow-2xl z-[70] flex flex-col animate-in slide-in-from-right duration-300 no-print">
                <div className="px-6 py-5 flex justify-between items-center bg-[#111f42] text-white shrink-0 border-b-4 border-[#E3624A]">
                  <h2 className="text-base font-semibold uppercase tracking-widest flex items-center gap-2"><HelpCircle size={20} className="text-[#E3624A]" /> คู่มือการใช้งาน Supplier</h2>
                  <button onClick={() => setIsGuideOpen(false)} className="hover:bg-white/20 p-1.5 rounded-lg transition-colors"><X size={20} /></button>
                </div>
                <div className="flex-1 overflow-y-auto p-8 text-slate-700 space-y-8 text-[13px]">
                   <section>
                      <h4 className="font-bold border-b pb-1 text-[#111f42] uppercase flex items-center gap-2 mb-3"><LayoutDashboard size={16}/> 1. การบริหารหมวดหมู่</h4>
                      <p className="leading-relaxed">หน้าจอออกแบบให้แยกคู่ค้าตาม **Category (CAT)** หลัก 3 ประเภทคือ Supplier, Service และ OEM พร้อมระบบหมวดย่อย (Sub Cat) ที่สัมพันธ์กัน</p>
                   </section>
                </div>
                <div className="p-4 border-t flex justify-end bg-slate-50"><button onClick={()=>setIsGuideOpen(false)} className="bg-[#111f42] text-white px-8 py-2.5 rounded-xl font-bold text-[12px] uppercase tracking-wider shadow-md hover:bg-[#1a2d5c] transition-colors">เข้าใจแล้ว</button></div>
              </div>
            </>
          )}

        </div>
      </div>
    </>
  );
}

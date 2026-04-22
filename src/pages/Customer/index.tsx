import React, { useState, useEffect, useRef, useMemo } from 'react';
import { 
  Users, 
  Search, 
  Plus, 
  X, 
  LayoutDashboard, 
  UploadCloud, 
  HelpCircle,
  List,
  Building2,
  Star,
  ShieldCheck,
  Coins,
  PieChart,
  BarChart2,
  Settings,
  ChevronDown,
  Filter
} from 'lucide-react';
import Chart from 'chart.js/auto';

import { useMasterData } from '../../context/MasterDataContext';
import { PageHeader } from '../../components/shared/PageHeader';
import { KpiCard } from '../../components/shared/KpiCard';
import CustomerTable from './components/CustomerTable';
import CustomerActionModal from './components/CustomerActionModal';
import CustomerConfigModal from './components/CustomerConfigModal';
import CustomerIdConfigModal from './components/CustomerIdConfigModal';

export default function CustomerManagement() {
  const [activeTab, setActiveTab] = useState('list'); // 'list' | 'dashboard'
  const [searchQuery, setSearchQuery] = useState('');
  const [catFilter, setCatFilter] = useState('All');
  const fileInputRef = useRef<HTMLInputElement>(null);

  // --- Master Data Configuration ---
  const [masterConfig, setMasterConfig] = useState({
    categories: ['Retail', 'Wholesale', 'Corporate', 'Project'],
    subCategories: {
      'Retail': ['Walk-in', 'Online', 'VIP'],
      'Wholesale': ['Dealer', 'Distributor', 'Franchise'],
      'Corporate': ['SME', 'Enterprise', 'Government'],
      'Project': ['Condo', 'Hotel', 'Hospital']
    }
  });

  // --- ID Generator Config ---
  const [idConfig, setIdConfig] = useState({
    prefix: 'CUST',
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

  // Mock Customer Data
  const { customers, addCustomer, updateCustomer, deleteCustomer: contextDeleteCustomer } = useMasterData();

  const [form, setForm] = useState<any>({});

  const filterCategories = ['All', ...masterConfig.categories];

  // Helper: Generate Customer ID
  const generateCustomerID = () => {
    const date = new Date();
    const yy = String(date.getFullYear()).slice(2);
    const mm = String(date.getMonth() + 1).padStart(2, '0');
    const dd = String(date.getDate()).padStart(2, '0');
    
    let dateStr = '';
    if (idConfig.dateFormat === 'YYMMDD') dateStr = `${yy}${mm}${dd}`;
    else if (idConfig.dateFormat === 'YYMM') dateStr = `${yy}${mm}`;
    else if (idConfig.dateFormat === 'YYYY') dateStr = String(date.getFullYear());

    const nextRunning = customers.length + 1;
    const running = String(nextRunning).padStart(idConfig.runningLength, '0');
    return `${idConfig.prefix}${dateStr}-${running}`;
  };

  // Filtering Logic
  const filteredCustomers = useMemo(() => {
    return customers.filter(c => {
      const matchSearch = c.customerName.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          c.customerID.toLowerCase().includes(searchQuery.toLowerCase());
      const matchCat = catFilter === 'All' ? true : c.category === catFilter;
      return matchSearch && matchCat;
    });
  }, [customers, searchQuery, catFilter]);

  // Pagination Logic
  const paginatedCustomers = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredCustomers.slice(start, start + itemsPerPage);
  }, [filteredCustomers, currentPage, itemsPerPage]);

  const totalPages = Math.ceil(filteredCustomers.length / itemsPerPage) || 1;

  const stats = {
    total: customers.length,
    active: customers.filter(c => c.status === 'Active').length,
    wholesaleCat: customers.filter(c => c.category === 'Wholesale').length,
    avgRating: (customers.reduce((acc, curr) => acc + (curr.rating || 0), 0) / customers.filter(c => c.rating > 0).length || 0).toFixed(1)
  };

  useEffect(() => {
    if (activeTab === 'dashboard') {
      const timer = setTimeout(() => initCharts(), 100);
      return () => clearTimeout(timer);
    }
  }, [activeTab, customers]);

  const initCharts = () => {
    (Object.values(chartInstances.current) as (Chart | null)[]).forEach(c => {
      if (c && typeof c.destroy === 'function') {
        c.destroy();
      }
    });
    const commonOptions = { responsive: true, maintainAspectRatio: false, plugins: { legend: { position: 'bottom' as const, labels: { usePointStyle: true, font: { size: 10 } } } } };

    if (chartStatusRef.current) {
      chartInstances.current.status = new Chart(chartStatusRef.current, {
        type: 'doughnut',
        data: {
          labels: ['Active', 'Prospect', 'On-Hold', 'Blacklisted'],
          datasets: [{
            data: ['Active', 'Prospect', 'On-Hold', 'Blacklisted'].map(status => customers.filter(c => c.status === status).length),
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
            label: 'Customers',
            data: masterConfig.categories.map(cat => customers.filter(c => c.category === cat).length),
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
        customerID: generateCustomerID(), 
        customerName: '', 
        category: 'Retail', 
        subCategory: masterConfig.subCategories['Retail'][0], 
        status: 'Prospect', 
        rating: 0, 
        creditTerm: 0,
        billingAddress: '',
        shippingAddress: '',
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
    if(!form.customerName) return alert('Please enter Customer Name');
    if(modalMode === 'create') {
      addCustomer({...form, id: Date.now().toString()});
    } else {
      updateCustomer(form.id, form);
    }
    setModalOpen(false);
  };

  const getStatusClass = (status: string) => {
    switch(status) {
      case 'Active': return 'bg-emerald-50 text-emerald-600 border-emerald-100';
      case 'Prospect': return 'bg-blue-50 text-blue-600 border-blue-100';
      case 'On-Hold': return 'bg-amber-50 text-amber-600 border-amber-100';
      default: return 'bg-slate-50 text-slate-600 border-slate-100';
    }
  };

  return (
    <div className="w-full space-y-4 relative flex-1 flex flex-col pt-0 transition-colors duration-500 bg-[#F9F7F6]">
      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 6px; height: 6px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #CBD5E1; border-radius: 3px; }
      `}</style>
      
      {/* Header */}
      <PageHeader
        title="CUSTOMER MANAGEMENT"
        subtitle="ฐานข้อมูลลูกค้าระบบการขาย"
        icon={Users}
        rightContent={
          <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto">
            <div className="flex bg-[#e2e8f0] p-1 border border-slate-200 shadow-inner rounded-xl overflow-hidden flex-shrink-0">
              <button onClick={() => setActiveTab('dashboard')} className={`px-6 py-2.5 font-black transition-all flex items-center gap-2 uppercase tracking-widest rounded-lg text-[10px] whitespace-nowrap ${activeTab === 'dashboard' ? 'bg-[#111f42] text-white shadow-md' : 'text-slate-500 hover:bg-slate-50'}`}>
                <LayoutDashboard size={14} /> DASHBOARD
              </button>
              <button onClick={() => setActiveTab('list')} className={`px-6 py-2.5 font-black transition-all flex items-center gap-2 uppercase tracking-widest rounded-lg text-[10px] whitespace-nowrap ${activeTab === 'list' ? 'bg-[#111f42] text-white shadow-md' : 'text-slate-500 hover:bg-slate-50'}`}>
                <List size={14} /> LIST VIEW
              </button>
            </div>
            <button onClick={() => setIsGuideOpen(true)} className="p-2.5 transition-all rounded-xl bg-white text-slate-400 hover:bg-[#111f42] hover:text-white border border-slate-200 shadow-sm">
              <HelpCircle size={20} />
            </button>
          </div>
        }
      />

      <div className="flex flex-col w-full gap-5 no-print animate-in fade-in duration-500 relative z-10 px-0 max-w-full">
        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
          <KpiCard title="Total Customers" value={stats.total} icon={Users} color="#111f42" subValue="All Clients" />
          <KpiCard title="Active Clients" value={stats.active} icon={ShieldCheck} color="#10b981" subValue="Currently Active" />
          <KpiCard title="Wholesale B2B" value={stats.wholesaleCat} icon={Building2} color="#72A09E" subValue="B2B Customers" />
          <KpiCard title="Avg. Rating" value={stats.avgRating} icon={Star} color="#ab8a3b" subValue="Client Score" />
        </div>

        {/* DASHBOARD VIEW */}
        {activeTab === 'dashboard' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 animate-in fade-in duration-500 no-print">
             <div className="bg-white p-6 rounded-none shadow-sm flex flex-col h-[400px] border border-slate-200">
                <h3 className="text-xs font-black text-[#111f42] uppercase tracking-[0.2em] mb-6 flex items-center gap-3">
                  <div className="w-2 h-2 bg-[#111f42] rounded-none"></div>
                  Customer Status Overview
                </h3>
                <div className="flex-1 relative"><canvas ref={chartStatusRef}></canvas></div>
             </div>
             <div className="bg-white p-6 rounded-none shadow-sm flex flex-col h-[400px] border border-slate-200">
                <h3 className="text-xs font-black text-[#111f42] uppercase tracking-[0.2em] mb-6 flex items-center gap-3">
                  <div className="w-2 h-2 bg-[#111f42] rounded-none"></div>
                  Customers by Category
                </h3>
                <div className="flex-1 relative"><canvas ref={chartTypeRef}></canvas></div>
             </div>
          </div>
        )}

        {/* LIST VIEW */}
        {activeTab === 'list' && (
          <div className="flex flex-col flex-1 w-full bg-white shadow-sm border border-slate-200">
            {/* Table Toolbar */}
            <div className="p-4 flex items-center justify-between gap-4 bg-slate-50/50 border-b border-slate-100 overflow-x-auto no-scrollbar rounded-none">
              <div className="flex items-center gap-4 flex-shrink-0">
                <div className="relative flex-shrink-0 group">
                  <div className="absolute left-3 top-1/2 -translate-y-1/2 text-[#ab8a3b] pointer-events-none group-focus-within:text-[#111f42] transition-colors">
                    <Filter size={14} />
                  </div>
                  <select 
                    value={catFilter} 
                    onChange={e => {setCatFilter(e.target.value); setCurrentPage(1);}} 
                    className="bg-white border border-slate-200 rounded-none pl-9 pr-10 py-2.5 outline-none focus:border-[#ab8a3b] text-[#111f42] font-black text-[10px] uppercase tracking-widest shadow-sm cursor-pointer appearance-none transition-all hover:border-[#ab8a3b]/50 min-w-[180px]"
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
                <div className="relative w-48 md:w-60 flex-shrink-0">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
                  <input 
                    type="text" 
                    placeholder="Search Customer Name / ID..." 
                    className="w-full bg-white border border-slate-200 rounded-none pl-9 pr-4 py-2 outline-none focus:border-[#ab8a3b] text-slate-700 font-black uppercase tracking-widest text-[10px] shadow-sm transition-all placeholder:opacity-50"
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                  />
                </div>
              </div>
              <div className="flex items-center gap-3 flex-shrink-0 ml-auto">
                <button 
                  onClick={() => fileInputRef.current?.click()} 
                  className="flex justify-center items-center gap-2 px-5 py-2.5 rounded-none bg-slate-100 text-slate-600 hover:text-[#111f42] hover:bg-slate-200 transition-all font-black uppercase tracking-widest text-[11px] shadow-sm"
                >
                  <UploadCloud size={16} className="text-slate-400" /> IMPORT
                  <input type="file" ref={fileInputRef} className="hidden" />
                </button>
                <button 
                  onClick={() => openModal('create')} 
                  className="flex justify-center items-center gap-2 px-6 py-2.5 bg-[#111f42] text-white rounded-none font-black uppercase tracking-widest text-[11px] shadow-md hover:bg-[#1a2d5c] transition-all"
                >
                  <Plus size={16} className="text-[#ab8a3b]" strokeWidth={3} /> NEW CUSTOMER
                </button>
              </div>
            </div>

            <CustomerTable 
              paginatedCustomers={paginatedCustomers}
              filteredCustomers={filteredCustomers}
              currentPage={currentPage}
              setCurrentPage={setCurrentPage}
              itemsPerPage={itemsPerPage}
              setItemsPerPage={setItemsPerPage}
              totalPages={totalPages}
              openModal={openModal}
              getStatusClass={getStatusClass}
            />
          </div>
        )}

        {/* Modals */}
        <CustomerActionModal 
          modalOpen={modalOpen}
          setModalOpen={setModalOpen}
          modalMode={modalMode}
          setModalMode={setModalMode}
          activeFormTab={activeFormTab}
          setActiveFormTab={setActiveFormTab}
          form={form}
          setForm={setForm}
          masterConfig={masterConfig}
          handleSave={handleSave}
          setConfigModalOpen={setConfigModalOpen}
          setIdConfigModalOpen={setIdConfigModalOpen}
        />

        <CustomerConfigModal 
          configModalOpen={configModalOpen}
          setConfigModalOpen={setConfigModalOpen}
          masterConfig={masterConfig}
        />

        <CustomerIdConfigModal 
          idConfigModalOpen={idConfigModalOpen}
          setIdConfigModalOpen={setIdConfigModalOpen}
          idConfig={idConfig}
          setIdConfig={setIdConfig}
          generateCustomerID={generateCustomerID}
          setForm={setForm}
          form={form}
        />

        {/* Guide Drawer */}
        {isGuideOpen && (
          <>
            <div className="fixed inset-0 bg-[#111f42]/40 backdrop-blur-sm z-[60] animate-in fade-in duration-200 no-print" onClick={() => setIsGuideOpen(false)} />
            <div className="fixed inset-y-0 right-0 w-full md:w-[450px] bg-white shadow-2xl z-[70] flex flex-col animate-in slide-in-from-right duration-300 no-print">
              <div className="px-6 py-5 flex justify-between items-center bg-[#111f42] text-white shrink-0 border-b-4 border-[#E3624A]">
                <h2 className="text-base font-black uppercase tracking-[0.2em] flex items-center gap-3"><HelpCircle size={20} className="text-[#E3624A]" /> CUSTOMER GUIDE</h2>
                <button onClick={() => setIsGuideOpen(false)} className="hover:bg-white/20 p-2 rounded-none border border-white/10 transition-colors"><X size={20} /></button>
              </div>
              <div className="flex-1 overflow-y-auto p-8 text-slate-700 space-y-8 text-[13px] bg-[#f5f0e9]">
                 <section>
                    <h4 className="font-black border-b-2 border-[#111f42]/10 pb-2 text-[#111f42] uppercase flex items-center gap-2 mb-4 tracking-widest"><LayoutDashboard size={18}/> 1. Customer Categories</h4>
                    <p className="leading-relaxed font-black uppercase text-[10px] tracking-widest opacity-70">หน้าจอออกแบบให้แยกลูกค้าตาม **Category (CAT)** หลัก 4 ประเภทคือ Retail, Wholesale, Corporate และ Project พร้อมระบบหมวดย่อย (Sub Cat) ที่สัมพันธ์กัน</p>
                 </section>
                 <section>
                    <h4 className="font-black border-b-2 border-[#111f42]/10 pb-2 text-[#111f42] uppercase flex items-center gap-2 mb-4 tracking-widest"><BarChart2 size={18}/> 2. Address Logic</h4>
                    <p className="leading-relaxed font-black uppercase text-[10px] tracking-widest opacity-70">ลูกค้า 1 รายจะรองรับที่อยู่ 2 ประเภทคือ Billing Address (สำหรับออกใบกำกับภาษี) และ Shipping Address (สำหรับจัดส่ง)</p>
                 </section>
                 <div className="bg-[#111f42] p-6 rounded-none border shadow-md flex gap-4 text-white">
                    <Settings className="text-[#ab8a3b] shrink-0" size={24}/>
                    <div>
                      <p className="font-black text-[#ab8a3b] text-[11px] mb-2 uppercase tracking-[0.2em]">Master Data Config</p>
                      <p className="text-[10px] font-black leading-relaxed uppercase tracking-widest opacity-80">ผู้ใช้สามารถใช้ปุ่ม "Config rules" ในหน้าแก้ไขเพื่อจัดการหมวดหมู่ หรือตั้งค่ารูปแบบการรันเลข ID ได้ด้วยตนเอง</p>
                    </div>
                 </div>
              </div>
              <div className="p-6 border-t bg-white flex justify-end shrink-0"><button onClick={()=>setIsGuideOpen(false)} className="bg-[#111f42] text-white px-10 py-3 rounded-none font-black text-[12px] uppercase tracking-[0.2em] shadow-xl hover:bg-[#1e346b] transition-all">รับทราบ (Close)</button></div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

import React from 'react';
import { LayoutList, Truck, PackageMinus, Search, UploadCloud, PlusCircle } from 'lucide-react';

interface OutboundToolbarProps {
  activeTab: string;
  setActiveTab: (tab: any) => void;
  activeWhTab: string;
  setActiveWhTab: (val: string) => void;
  statusFilter: string;
  setStatusFilter: (val: string) => void;
  searchQuery: string;
  setSearchQuery: (val: string) => void;
  onUploadClick: () => void;
  onOutboundClick: () => void;
  warehouses: string[];
  statuses: string[];
  getStatusCount: (status: string) => number;
}

export const OutboundToolbar: React.FC<OutboundToolbarProps> = ({
  activeTab,
  setActiveTab,
  activeWhTab,
  setActiveWhTab,
  statusFilter,
  setStatusFilter,
  searchQuery,
  setSearchQuery,
  onUploadClick,
  onOutboundClick,
  warehouses,
  statuses,
  getStatusCount
}) => {
  return (
    <div className="flex flex-col gap-4">
      {/* Tab Switcher Area */}
      <div className="flex bg-[#e2e8f0] p-1 border border-slate-200 shadow-inner w-full md:w-fit rounded-xl overflow-hidden font-sans no-print">
        <button onClick={() => setActiveTab('all')} className={`px-6 py-2 text-[10px] font-black transition-all flex items-center gap-2 uppercase tracking-widest rounded-lg ${activeTab === 'all' ? 'bg-[#111f42] text-[#ab8a3b] shadow-md border-b-2 border-[#ab8a3b]' : 'text-slate-500 hover:bg-slate-50'}`}>
          <LayoutList size={14} /> ALL OUTBOUND
        </button>
        <button onClick={() => setActiveTab('delivery')} className={`px-6 py-2 text-[10px] font-black transition-all flex items-center gap-2 uppercase tracking-widest rounded-lg ${activeTab === 'delivery' ? 'bg-[#111f42] text-[#ab8a3b] shadow-md border-b-2 border-[#ab8a3b]' : 'text-slate-500 hover:bg-slate-50'}`}>
          <Truck size={14} /> DELIVERY LIST
        </button>
        <button onClick={() => setActiveTab('mrp')} className={`px-6 py-2 text-[10px] font-black transition-all flex items-center gap-2 uppercase tracking-widest rounded-lg ${activeTab === 'mrp' ? 'bg-[#111f42] text-[#ab8a3b] shadow-md border-b-2 border-[#ab8a3b]' : 'text-slate-500 hover:bg-slate-50'}`}>
          <PackageMinus size={14} /> MRP LIST (RM)
        </button>
      </div>

      {/* Main Toolbar Container */}
      <div className="bg-white border-b border-slate-100 flex flex-col lg:flex-row items-center justify-between gap-4 p-4 bg-slate-50/50">
        <div className="flex flex-col md:flex-row items-center gap-3 w-full lg:w-auto overflow-x-auto no-scrollbar">
          <div className="flex bg-white rounded-xl border border-slate-200 p-1 shrink-0">
            {activeTab === 'all' ? (
              warehouses.map(wh => (
                <button 
                  key={wh} 
                  onClick={() => setActiveWhTab(wh)} 
                  className={`px-4 py-1.5 text-[9px] font-black uppercase tracking-widest transition-all rounded-lg ${activeWhTab === wh ? 'bg-[#111f42] text-white' : 'text-slate-400 hover:bg-slate-50'}`}
                >
                  {wh}
                </button>
              ))
            ) : (
              statuses.map(status => (
                <button 
                  key={status} 
                  onClick={() => setStatusFilter(status)} 
                  className={`px-4 py-1.5 text-[9px] font-black uppercase tracking-widest transition-all rounded-lg flex items-center gap-2 ${statusFilter === status ? 'bg-[#111f42] text-white' : 'text-slate-400 hover:bg-slate-50'}`}
                >
                  {status}
                  <span className={`px-1 rounded-full text-[8px] ${statusFilter === status ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-400'}`}>
                    {getStatusCount(status)}
                  </span>
                </button>
              ))
            )}
          </div>

          <div className="relative w-full lg:w-72 shrink-0">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input 
              type="text" 
              value={searchQuery} 
              onChange={(e) => setSearchQuery(e.target.value)} 
              placeholder="Search SKU / Item / Trx..." 
              className="w-full bg-white border border-slate-200 rounded-xl pl-9 pr-4 py-2 text-[11px] outline-none focus:border-[#ab8a3b] font-black h-10 uppercase tracking-widest"
            />
          </div>
        </div>

        {activeTab === 'all' && (
          <div className="flex gap-2">
            <button 
              onClick={onUploadClick} 
              className="h-10 px-5 rounded-xl bg-white text-slate-600 text-[10px] font-black uppercase tracking-widest hover:bg-slate-50 transition-all flex items-center gap-2 font-mono border border-slate-200 shadow-sm"
            >
              <UploadCloud size={16} className="text-slate-400" /> UPLOAD CSV
            </button>
            <button 
              onClick={onOutboundClick} 
              className="h-10 px-5 rounded-xl bg-[#111f42] text-[#ab8a3b] text-[10px] font-black uppercase tracking-widest shadow-sm hover:brightness-110 transition-all flex items-center gap-2 font-mono"
            >
              <PlusCircle size={16} /> NEW OUTBOUND
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

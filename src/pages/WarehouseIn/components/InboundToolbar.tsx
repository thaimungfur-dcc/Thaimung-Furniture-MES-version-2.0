import React from 'react';
import { Filter, ChevronDown, Search, UploadCloud, PlusCircle } from 'lucide-react';

interface InboundToolbarProps {
  activeTab: string;
  activeWhTab: string;
  setActiveWhTab: (val: string) => void;
  statusFilter: string;
  setStatusFilter: (val: string) => void;
  searchQuery: string;
  setSearchQuery: (val: string) => void;
  onImportClick: () => void;
  onManualClick: () => void;
  warehouses: string[];
  statuses: string[];
}

export const InboundToolbar: React.FC<InboundToolbarProps> = ({
  activeTab,
  activeWhTab,
  setActiveWhTab,
  statusFilter,
  setStatusFilter,
  searchQuery,
  setSearchQuery,
  onImportClick,
  onManualClick,
  warehouses,
  statuses
}) => {
  return (
    <div className="px-6 py-4 border-b border-slate-100 flex flex-col lg:flex-row items-center justify-between gap-4 bg-slate-50/50 sticky top-0 z-20">
      <div className="flex items-center gap-3 w-full lg:w-auto overflow-x-auto no-scrollbar">
        <div className="relative shrink-0">
          <Filter className="absolute left-3 top-1/2 -translate-y-1/2 text-[#111f42]" size={14} />
          <select 
            value={activeTab === 'all' ? activeWhTab : statusFilter} 
            onChange={(e) => activeTab === 'all' ? setActiveWhTab(e.target.value) : setStatusFilter(e.target.value)} 
            className="appearance-none min-w-[200px] bg-white border border-slate-200 rounded-xl pl-9 pr-10 py-2.5 outline-none focus:border-[#111f42] text-[#111f42] font-black text-[11px] uppercase tracking-wider shadow-sm transition-all cursor-pointer font-mono h-10"
          >
            {activeTab === 'all' 
              ? warehouses?.map(wh => <option key={wh} value={wh}>{wh === 'All' ? 'ALL WAREHOUSES' : wh + ' WAREHOUSE'}</option>) 
              : statuses?.map(s => <option key={s} value={s}>{s.toUpperCase()}</option>)
            }
          </select>
          <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400"><ChevronDown size={14} /></div>
        </div>
        <div className="h-6 w-px bg-slate-200 mx-1 hidden lg:block shrink-0"></div>
        <div className="relative w-full lg:w-72 shrink-0">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input 
            type="text" 
            value={searchQuery} 
            onChange={(e) => setSearchQuery(e.target.value)} 
            placeholder="Search SKU / Item / Ref..." 
            className="w-full bg-white border border-slate-200 rounded-xl pl-9 pr-4 py-2 text-[11px] outline-none focus:border-[#111f42] font-black h-10 uppercase tracking-widest"
          />
        </div>
      </div>

      {activeTab === 'all' && (
        <div className="flex gap-2">
          <button 
            onClick={onImportClick} 
            className="h-10 px-5 rounded-xl bg-white text-slate-600 text-[10px] font-black uppercase tracking-widest hover:bg-slate-50 transition-all flex items-center gap-2 font-mono border border-slate-200 shadow-sm"
          >
            <UploadCloud size={16} className="text-slate-400" /> UPLOAD CSV
          </button>
          <button 
            onClick={onManualClick} 
            className="h-10 px-5 rounded-xl bg-[#E3624A] text-white text-[10px] font-black uppercase tracking-widest shadow-sm shadow-[#E3624A]/20 hover:brightness-110 transition-all flex items-center gap-2 font-mono"
          >
            <PlusCircle size={16} /> DIRECT RECEIVE
          </button>
        </div>
      )}
    </div>
  );
};

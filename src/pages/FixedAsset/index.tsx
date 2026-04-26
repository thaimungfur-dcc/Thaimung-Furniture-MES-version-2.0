import React, { useState, useEffect, useMemo } from 'react';
import { 
  Calendar,
  Kanban,
  Database,
  HelpCircle,
  Building
} from 'lucide-react';
import { PageHeader } from '../../components/shared/PageHeader';
import KanbanBoard from './components/KanbanBoard';
import DataTable from './components/DataTable';
import UserGuideDrawer from './components/UserGuideDrawer';

export default function FixedAsset() {
  const [mainTab, setMainTab] = useState('data'); // 'kanban' | 'data' 
  const [subTab, setSubTab] = useState('all'); 
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedMonth, setSelectedMonth] = useState('2026-03');
  const [assets, setAssets] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [isGuideOpen, setIsGuideOpen] = useState(false);

  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  // Initialize Data - Synced from Master Data
  useEffect(() => {
    setLoading(true);
    setTimeout(() => {
      const mockData = [
        { id: 1, assetCode: 'FA-IT-001', name: 'Server Rack', category: 'IT Equipment', purchaseDate: '2024-01-15', cost: 120000, accumDep: 40000, nbv: 80000, status: 'Active', location: 'Server Room' },
        { id: 2, assetCode: 'FA-VH-001', name: 'Delivery Truck', category: 'Vehicles', purchaseDate: '2023-05-10', cost: 850000, accumDep: 150000, nbv: 700000, status: 'Active', location: 'Warehouse' },
        { id: 3, assetCode: 'FA-OF-001', name: 'Office Desk Set', category: 'Furniture', purchaseDate: '2022-11-20', cost: 45000, accumDep: 30000, nbv: 15000, status: 'Maintenance', location: 'HQ' },
        { id: 4, assetCode: 'FA-MC-001', name: 'Cutting Machine', category: 'Machinery', purchaseDate: '2020-02-15', cost: 2500000, accumDep: 2000000, nbv: 500000, status: 'Active', location: 'Factory 1' },
        { id: 5, assetCode: 'FA-IT-002', name: 'Old Printer', category: 'IT Equipment', purchaseDate: '2019-06-10', cost: 15000, accumDep: 14999, nbv: 1, status: 'Disposed', location: 'Storage' },
      ];
      setAssets(mockData);
      setLoading(false);
    }, 600);
  }, []);

  const filteredData = useMemo(() => {
    let result = assets;
    if (subTab !== 'all') {
      result = result?.filter(e => e.status === subTab);
    }
    if (searchTerm) {
      const q = searchTerm.toLowerCase();
      result = result?.filter(e => e.assetCode.toLowerCase().includes(q) || e.name.toLowerCase().includes(q) || e.category.toLowerCase().includes(q));
    }
    return result;
  }, [assets, subTab, searchTerm]);

  useEffect(() => { setCurrentPage(1); }, [subTab, selectedMonth, searchTerm, itemsPerPage, mainTab]);

  const totalCost = filteredData?.reduce((s, i) => s + i.cost, 0);
  const totalNBV = filteredData?.reduce((s, i) => s + i.nbv, 0);

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredData.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);

  return (
    <div className="flex flex-col space-y-4 w-full relative flex-1 transition-colors duration-500 text-[12px]">
      <style>{`
        @keyframes fadeUp { from { opacity: 0; transform: translate(-50%, 5px); } to { opacity: 1; transform: translate(-50%, 0); } }
        .animate-fade-up { animation: fadeUp 0.2s ease-out forwards; }
        .kanban-scroll::-webkit-scrollbar { width: 6px; height: 6px; }
        .kanban-scroll::-webkit-scrollbar-track { background: transparent; }
        .kanban-scroll::-webkit-scrollbar-thumb { background: #CBD5E1; border-radius: 3px; }
        .kanban-scroll::-webkit-scrollbar-thumb:hover { background: #94A3B8; }
      `}</style>
      
      <PageHeader
        title="FIXED ASSET"
        subtitle="ทะเบียนทรัพย์สิน (Read-Only Database)"
        icon={Building}
        rightContent={
          <div className="flex items-center justify-end gap-2 w-full lg:w-auto overflow-x-auto custom-scrollbar pb-1">
            <div className="flex items-center bg-white border border-slate-200 rounded-lg overflow-hidden shadow-sm shrink-0">
              <div className="px-2 py-1.5 bg-slate-50 border-r border-slate-200 text-[#111f42]">
                <Calendar size={14} />
              </div>
              <input type="month" value={selectedMonth} readOnly className="px-2 py-1.5 text-[11px] font-bold text-[#111f42] bg-transparent outline-none cursor-default" />
            </div>

            <div className="flex bg-[#e2e8f0] p-1 border border-slate-200 shadow-inner rounded-xl shrink-0">
              <button onClick={() => setMainTab('kanban')} className={`px-4 py-1.5 font-black transition-all flex items-center gap-1.5 uppercase tracking-widest rounded-lg text-[10px] ${mainTab === 'kanban' ? 'bg-[#111f42] text-white shadow-sm' : 'text-slate-500 hover:bg-slate-50'}`}>
                <Kanban size={12} /> BOARD
              </button>
              <button onClick={() => setMainTab('data')} className={`px-4 py-1.5 font-black transition-all flex items-center gap-1.5 uppercase tracking-widest rounded-lg text-[10px] ${mainTab === 'data' ? 'bg-[#1e293b] text-white shadow-sm' : 'text-slate-500 hover:bg-slate-50'}`}>
                <Database size={12} /> DETAILED DATA
              </button>
            </div>
            <button onClick={() => setIsGuideOpen(true)} className="p-2 transition-all flex items-center justify-center rounded-xl bg-white text-slate-400 hover:text-[#111f42] hover:bg-slate-50 border border-slate-200 shadow-sm shrink-0"><HelpCircle size={16} /></button>
          </div>
        }
      />

      <div className="w-full flex-1 flex flex-col h-full overflow-hidden px-0 z-10 relative">
        {mainTab === 'kanban' && <KanbanBoard assets={assets} />}
        
        {mainTab === 'data' && (
          <DataTable 
            filteredData={filteredData}
            totalCost={totalCost}
            totalNBV={totalNBV}
            subTab={subTab}
            setSubTab={setSubTab}
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            currentItems={currentItems}
            totalPages={totalPages}
            currentPage={currentPage}
            setCurrentPage={setCurrentPage}
            itemsPerPage={itemsPerPage}
            setItemsPerPage={setItemsPerPage}
          />
        )}

        <UserGuideDrawer isGuideOpen={isGuideOpen} setIsGuideOpen={setIsGuideOpen} />
      </div>
    </div>
  );
}

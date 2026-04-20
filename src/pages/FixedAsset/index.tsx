import React, { useState, useEffect, useMemo } from 'react';
import { 
  Calendar,
  Kanban,
  Database,
  HelpCircle,
  Building
} from 'lucide-react';
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
      result = result.filter(e => e.status === subTab);
    }
    if (searchTerm) {
      const q = searchTerm.toLowerCase();
      result = result.filter(e => e.assetCode.toLowerCase().includes(q) || e.name.toLowerCase().includes(q) || e.category.toLowerCase().includes(q));
    }
    return result;
  }, [assets, subTab, searchTerm]);

  useEffect(() => { setCurrentPage(1); }, [subTab, selectedMonth, searchTerm, itemsPerPage, mainTab]);

  const totalCost = filteredData.reduce((s, i) => s + i.cost, 0);
  const totalNBV = filteredData.reduce((s, i) => s + i.nbv, 0);

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredData.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);

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
      `}</style>
      
      <div className="min-h-screen p-4 md:p-6 transition-colors duration-500 text-[12px] bg-gradient-to-br from-[#f5f0e9] via-[#f0ede5] to-[#c6c2bb] flex flex-col">
        <div className="w-full space-y-6 relative max-w-[1600px] mx-auto flex-1 flex flex-col h-full overflow-hidden">
          
          {/* Header */}
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 flex-shrink-0">
            <div className="flex items-center gap-4 shrink-0">
              <div className="relative w-12 h-12 bg-white flex items-center justify-center shadow-lg flex-shrink-0 rounded-2xl border-[3px] border-white/60 bg-clip-padding backdrop-blur-sm">
                <svg width="0" height="0" className="absolute">
                  <defs>
                    <linearGradient id="faGradient" x1="0" y1="0" x2="24" y2="24" gradientUnits="userSpaceOnUse">
                      <stop stopColor="#115e59" offset="0%" />
                      <stop stopColor="#0f766e" offset="100%" />
                    </linearGradient>
                  </defs>
                </svg>
                <Building size={24} strokeWidth={2.5} stroke="url(#faGradient)" />
              </div>
              <div className="flex flex-col justify-center">
                <h1 className="text-2xl tracking-tight uppercase leading-none drop-shadow-sm">
                  <span className="text-[#115e59] font-light">FIXED</span> <span className="text-[#0f766e] font-black">ASSET</span>
                </h1>
                <p className="font-medium text-[12px] uppercase tracking-widest mt-1 text-[#0f766e] leading-none">
                  ทะเบียนทรัพย์สิน (Read-Only Database)
                </p>
              </div>
            </div>
            
            <div className="flex items-center justify-end gap-2 w-full lg:w-auto overflow-x-auto custom-scrollbar pb-1">
              <div className="flex items-center bg-white/80 backdrop-blur-md border border-white/50 rounded-lg overflow-hidden shadow-sm shrink-0">
                <div className="px-2 py-1.5 bg-white/50 border-r border-white/50 text-[#0f766e]">
                  <Calendar size={14} />
                </div>
                <input type="month" value={selectedMonth} readOnly className="px-2 py-1.5 text-[11px] font-bold text-[#223149] bg-transparent outline-none cursor-default" />
              </div>

              <div className="flex bg-white/80 backdrop-blur-md p-1 border border-white/50 shadow-sm rounded-lg shrink-0">
                <button onClick={() => setMainTab('kanban')} className="px-4 py-1.5 font-bold transition-all flex items-center gap-1.5 uppercase tracking-widest rounded text-[10px]" style={mainTab === 'kanban' ? { backgroundColor: '#0f766e', color: 'white', boxShadow: '0 2px 4px -1px rgba(15,118,110,0.3)' } : { color: '#7693a6', backgroundColor: 'transparent' }}>
                  <Kanban size={12} /> BOARD
                </button>
                <button onClick={() => setMainTab('data')} className="px-4 py-1.5 font-bold transition-all flex items-center gap-1.5 uppercase tracking-widest rounded text-[10px]" style={mainTab === 'data' ? { background: 'linear-gradient(to right, #115e59, #0f766e)', color: 'white', boxShadow: '0 2px 4px -1px rgba(15,118,110,0.3)' } : { color: '#7693a6', backgroundColor: 'transparent' }}>
                  <Database size={12} /> DETAILED DATA
                </button>
              </div>
              <button onClick={() => setIsGuideOpen(true)} className="p-2 transition-all flex items-center justify-center rounded-lg bg-white/80 backdrop-blur-md text-[#0f766e] hover:bg-white border border-white/50 shadow-sm hover:shadow shrink-0"><HelpCircle size={16} /></button>
            </div>
          </div>

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
    </>
  );
}

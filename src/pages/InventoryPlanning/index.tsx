import React, { useState, useEffect, useMemo } from 'react';
import { 
    Boxes, CheckCircle2, AlertTriangle, 
    ArrowDownToLine, HelpCircle, Package, Loader2, Calendar
} from 'lucide-react';
import { KpiCard } from '../../components/shared/KpiCard';
import AnalysisCharts from './AnalysisCharts';
import InventoryTable from './InventoryTable';
import GuideDrawer from './GuideDrawer';

import { PageHeader } from '../../components/shared/PageHeader';

export default function InventoryPlanning() {
    // --- State Management ---
    const [activeTab, setActiveTab] = useState('stock');
    const [selectedMonth, setSelectedMonth] = useState('2026-03');
    const [searchQuery, setSearchQuery] = useState('');
    const [activeFilter, setActiveFilter] = useState('All');
    const [itemsPerPage, setItemsPerPage] = useState(10); 
    const [currentPage, setCurrentPage] = useState(1);
    const [isGuideOpen, setIsGuideOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [inventoryItems, setInventoryItems] = useState<any[]>([]);

    // --- Item Master: Source of Truth ---
    const itemsMaster = useMemo(() => [
        { id: 'FG-LD-001', name: "ราวตากผ้าสแตนเลส (รุ่นพับได้)", image: 'https://img.lazcdn.com/g/p/34e7a032d760b1c364f89257709b64c2.png_720x720q80.png', leadTime: 7, avgUsage: 12 },
        { id: 'FG-LD-002', name: "ราวแขวนผ้าบาร์คู่ (ล้อเลื่อน)", image: 'https://th-live.slatic.net/p/97a2344704633a1f437198d7f01ba0b5.jpg', leadTime: 7, avgUsage: 5 },
        { id: 'FG-OF-001', name: "เก้าอี้จัดเลี้ยง (เบาะนวม)", image: 'https://www.tub-collection.co.uk/cdn/shop/files/23029darkgrey1.jpg?v=1715512979', leadTime: 14, avgUsage: 25 },
        { id: 'FG-BD-001', name: "ชุดเครื่องนอนครบเซ็ต", image: 'https://assets.wfcdn.com/im/37040247/compr-r85/2998/299822032/Nova+Boucle+Platform+Bed.jpg', leadTime: 30, avgUsage: 8 },
        { id: 'RM-ST-01', name: "ท่อสแตนเลส 1 นิ้ว", image: 'https://images.unsplash.com/photo-1582735689369-4fe89db7114c?auto=format&fit=crop&w=100&q=80', leadTime: 5, avgUsage: 50 },
        { id: 'FG-LD-003', name: "ราวตากผ้าอลูมิเนียม", image: 'https://img.lazcdn.com/g/p/34e7a032d760b1c364f89257709b64c2.png_720x720q80.png', leadTime: 7, avgUsage: 10 },
        { id: 'FG-OF-002', name: "เก้าอี้สำนักงานพรีเมียม", image: 'https://www.tub-collection.co.uk/cdn/shop/files/23029darkgrey1.jpg?v=1715512979', leadTime: 10, avgUsage: 15 },
        { id: 'RM-WD-005', name: "ไม้อัดยาง 15mm", image: 'https://images.unsplash.com/photo-1582735689369-4fe89db7114c?auto=format&fit=crop&w=100&q=80', leadTime: 14, avgUsage: 20 },
        { id: 'PK-BOX-01', name: "กล่องกระดาษ Size L", image: 'https://img.lazcdn.com/g/p/34e7a032d760b1c364f89257709b64c2.png_720x720q80.png', leadTime: 5, avgUsage: 100 },
        { id: 'FG-SF-505', name: "โซฟาผ้า 3 ที่นั่ง", image: 'https://www.tub-collection.co.uk/cdn/shop/files/23029darkgrey1.jpg?v=1715512979', leadTime: 21, avgUsage: 3 },
        { id: 'FG-DT-402', name: "โต๊ะทานข้าวหินอ่อน", image: 'https://img.lazcdn.com/g/p/34e7a032d760b1c364f89257709b64c2.png_720x720q80.png', leadTime: 14, avgUsage: 1 },
    ], []);

    const filters = ['All', 'Healthy', 'Low Stock', 'Critical', 'Out of Stock'];

    // --- Data Sync Logic ---
    useEffect(() => {
        setLoading(true);
        setTimeout(() => {
            const syncItems = itemsMaster.map(item => {
                const onhand = Math.floor(Math.random() * 500); 
                const booking = Math.floor(Math.random() * 200);
                const available = onhand - booking;
                const planIn = Math.floor(Math.random() * 300);
                const planOut = Math.floor(Math.random() * 100);
                const estQty = available + planIn - planOut;
                const minPoint = Math.ceil(item.avgUsage * item.leadTime);
                
                let status = 'Healthy';
                if (onhand === 0) status = 'Out of Stock';
                else if (onhand < minPoint / 2) status = 'Critical';
                else if (onhand < minPoint) status = 'Low Stock';

                return { ...item, onhand, booking, available, planIn, planOut, estQty, minPoint, status };
            });
            setInventoryItems(syncItems);
            setLoading(false);
        }, 500);
    }, [itemsMaster, selectedMonth]);

    // --- Computed Filtering & Pagination ---
    const filteredItems = useMemo(() => {
        let res = inventoryItems;
        if (activeFilter !== 'All') res = res.filter(i => i.status === activeFilter);
        if (searchQuery) {
            const q = searchQuery.toLowerCase();
            res = res.filter(i => i.id.toLowerCase().includes(q) || i.name.toLowerCase().includes(q));
        }
        return res;
    }, [inventoryItems, activeFilter, searchQuery]);

    const paginatedItems = useMemo(() => {
        const start = (currentPage - 1) * itemsPerPage;
        return filteredItems.slice(start, start + itemsPerPage);
    }, [filteredItems, currentPage, itemsPerPage]);

    const totalPages = Math.ceil(filteredItems.length / itemsPerPage) || 1;

    const stats = useMemo(() => {
        return {
            totalOnhand: inventoryItems.reduce((s, i) => s + i.onhand, 0).toLocaleString(),
            totalAvailable: inventoryItems.reduce((s, i) => s + i.available, 0).toLocaleString(),
            planIn: inventoryItems.reduce((s, i) => s + i.planIn, 0).toLocaleString(),
            lowStockCount: inventoryItems.filter(i => ['Low Stock', 'Critical', 'Out of Stock'].includes(i.status)).length
        };
    }, [inventoryItems]);

    const getStatusClass = (status: string) => {
        switch(status) {
            case 'Healthy': return 'bg-emerald-50 text-emerald-600 border-emerald-100';
            case 'Low Stock': return 'bg-amber-50 text-amber-600 border-amber-100';
            case 'Critical': return 'bg-rose-50 text-rose-600 border-rose-200';
            case 'Out of Stock': return 'bg-slate-900 text-white border-slate-900';
            default: return 'bg-slate-50 text-slate-400 border-slate-200';
        }
    };

    const getFilterCount = (f: string) => {
        if (f === 'All') return inventoryItems.length;
        return inventoryItems.filter(i => i.status === f).length;
    };

    return (
        <div className="flex flex-col flex-1 animate-in fade-in slide-in-from-bottom-2 duration-500">
            <style>{`
                /* Navy Header with Gold Bottom Border */
                .minimal-th { 
                    font-size: 11px !important; 
                    text-transform: uppercase; 
                    letter-spacing: 0.1em; 
                    color: #FFFFFF; 
                    padding: 14px 14px; 
                    font-weight: 800; 
                    background-color: #111f42 !important; 
                    border-bottom: 2.5px solid #111f42 !important; 
                    white-space: nowrap; 
                    user-select: none;
                }
                
                .minimal-td { padding: 10px 14px; vertical-align: middle; color: #111f42; font-size: 12px !important; font-weight: 500; border-bottom: 1px solid rgba(226, 232, 240, 0.6); }
                tr:hover .minimal-td { background-color: rgba(171, 138, 59, 0.05); }
                
                .badge { display: inline-flex; align-items: center; padding: 0.15rem 0.6rem; border-radius: 6px; font-weight: 700; font-size: 10px; border: 1px solid transparent; text-transform: uppercase; }
                .animate-fade-in-up { animation: fadeInUp 0.4s ease-out forwards; }
                @keyframes fadeInUp { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
                
                .month-picker-container {
                    background: white;
                    border: 1px solid #E2E8F0;
                    border-radius: 12px;
                    display: flex;
                    align-items: center;
                    padding: 2px 12px;
                    height: 40px;
                    box-shadow: 0 2px 4px rgba(0,0,0,0.02);
                }

                /* Highlight Column Styles for Body Cells */
                .cell-available { background-color: rgba(46, 71, 86, 0.06) !important; }
                .cell-plan-in { background-color: rgba(137, 136, 97, 0.06) !important; }
                .cell-plan-out { background-color: rgba(217, 144, 54, 0.06) !important; }
            `}</style>

            <div className="w-full space-y-4 relative flex-1 flex flex-col">
                {/* Header Section */}
                <PageHeader
                    Icon={Boxes}
                    title="INVENTORY PLANNING"
                    subtitle="Stock Projections & Reorder Points"
                    extra={
                        <div className="flex flex-wrap items-center gap-4 w-full lg:w-auto">
                            <div className="month-picker-container group hover:border-[#111f42] transition-all">
                                <Calendar size={14} className="text-slate-400 group-hover:text-[#111f42] mr-3" />
                                <input 
                                    type="month" 
                                    value={selectedMonth}
                                    onChange={(e) => setSelectedMonth(e.target.value)}
                                    className="bg-transparent border-none outline-none text-[13px] font-bold text-[#111f42] cursor-pointer font-mono"
                                />
                            </div>

                            <div className="flex bg-[#e2e8f0] p-1 border border-slate-200 shadow-inner rounded-xl h-10 overflow-hidden shrink-0">
                                <button onClick={() => setActiveTab('stock')} className={`px-5 py-1.5 text-[10px] font-bold transition-all rounded-lg uppercase ${activeTab === 'stock' ? 'bg-[#111f42] text-white shadow-sm' : 'text-slate-500 hover:bg-slate-50'}`}>STOCK PLAN</button>
                                <button onClick={() => setActiveTab('analysis')} className={`px-5 py-1.5 text-[10px] font-bold transition-all rounded-lg uppercase ${activeTab === 'analysis' ? 'bg-[#111f42] text-white shadow-sm' : 'text-slate-500 hover:bg-slate-50'}`}>ANALYSIS</button>
                            </div>
                            <button onClick={() => setIsGuideOpen(true)} className="p-2.5 transition-all rounded-xl bg-white text-slate-400 hover:bg-[#111f42] hover:text-white border border-slate-200 shadow-sm"><HelpCircle size={18}/></button>
                        </div>
                    }
                />

                <main className="flex-1 relative z-10 flex flex-col gap-6">
                    
                    {/* KPI Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 animate-fade-in-up shrink-0">
                        <KpiCard title="Total Onhand" value={stats.totalOnhand} color="#111f42" icon={Package} subValue="Physical Units" />
                        <KpiCard title="Available Stock" value={stats.totalAvailable} color="#10b981" icon={CheckCircle2} subValue="Net Available" />
                        <KpiCard title="Production Plan" value={stats.planIn} color="#ab8a3b" icon={ArrowDownToLine} subValue="Scheduled Incoming" />
                        <KpiCard title="Alert Items" value={stats.lowStockCount} color="#E3624A" icon={AlertTriangle} subValue="Low/Out of Stock" />
                    </div>

                    {/* Unified Table Container - FLAT DESIGN */}
                    <div className="bg-white border border-slate-200 flex flex-col min-h-[650px] animate-fade-in-up shadow-sm relative overflow-hidden rounded-2xl">
                        {activeTab === 'stock' ? (
                            <InventoryTable 
                                activeFilter={activeFilter}
                                setActiveFilter={setActiveFilter}
                                filters={filters}
                                getFilterCount={getFilterCount}
                                searchQuery={searchQuery}
                                setSearchQuery={setSearchQuery}
                                paginatedItems={paginatedItems}
                                getStatusClass={getStatusClass}
                                currentPage={currentPage}
                                setCurrentPage={setCurrentPage}
                                totalPages={totalPages}
                            />
                        ) : (
                            <AnalysisCharts inventoryItems={inventoryItems} />
                        )}
                    </div>
                </main>
            </div>

            <GuideDrawer isGuideOpen={isGuideOpen} setIsGuideOpen={setIsGuideOpen} />

            {/* Loading Overlay */}
            {loading && (
                <div className="fixed inset-0 z-[20000] bg-white/60 backdrop-blur-md flex flex-col items-center justify-center gap-4 animate-in fade-in duration-300">
                    <Loader2 className="animate-spin text-[#111f42]" size={40} />
                    <p className="font-black text-[#111f42] uppercase tracking-[0.3em] text-[9px] animate-pulse font-mono">Syncing Planning Data...</p>
                </div>
            )}
        </div>
    );
}

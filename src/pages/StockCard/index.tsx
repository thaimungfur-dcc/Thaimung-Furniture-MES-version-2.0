import React, { useState, useEffect, useMemo, useRef } from 'react';
import { 
    FileSpreadsheet, FileText, LayoutDashboard, 
    ChevronLeft, ChevronRight, Package,
    Layers, Database, HelpCircle, Loader2
} from 'lucide-react';
import { useMasterData } from '../../context/MasterDataContext';
import { useGoogleSheets } from '../../hooks/useGoogleSheets';
import AlertModal from './AlertModal';
import GuideDrawer from './GuideDrawer';
import DashboardCharts from './DashboardCharts';
import { PageHeader } from '../../components/shared/PageHeader';
import { StockCardToolbar } from './components/StockCardToolbar';
import { DraggableWrapper } from "../../components/shared/DraggableWrapper";

export default function StockCardApp() {
    // --- State Management ---
    const [activeTab, setActiveTab] = useState('card');
    const [itemSearchText, setItemSearchText] = useState('');
    const [isItemDropdownOpen, setIsItemDropdownOpen] = useState(false);
    const [isGuideOpen, setIsGuideOpen] = useState(false);
    const [viewState, setViewState] = useState({ itemId: '', lotId: '', page: 1, rows: 10 });
    
    const dropdownRef = useRef<HTMLDivElement>(null);

    // --- Item Master: Source of Truth ---
    const { items } = useMasterData();
    const itemsMaster = useMemo(() => (items || [])?.map(item => ({
        id: item.itemCode,
        name: item.itemName,
        unit: item.baseUnit,
        category: item.category,
        subCategory: item.subCategory
    })), [items]);

    // --- Data Fetching ---
    const { data: historyLogs, loading: inLoading } = useGoogleSheets<any>('HistoryLogs');
    const { data: warehouseOutLogs, loading: outLoading } = useGoogleSheets<any>('WarehouseOutLogs');
    
    // Combine logs into movements
    const movementsRaw = useMemo(() => {
        const inMoves = historyLogs?.filter(l => l.sku === viewState.itemId)?.map(l => ({
            date: l.date,
            type: 'IN',
            docId: l.transId,
            ref: l.refNo,
            lot: l.lotNo,
            in: Number(l.qty) || 0,
            out: 0,
            loc: l.location,
            sku: l.sku
        }));

        const outMoves = warehouseOutLogs?.filter(l => l.sku === viewState.itemId)?.map(l => ({
            date: l.date,
            type: 'OUT',
            docId: l.transId,
            ref: l.refNo,
            lot: l.lotNo,
            in: 0,
            out: Number(l.qty) || 0,
            loc: l.location,
            sku: l.sku
        }));

        // Combine and sort
        const combined = [...inMoves, ...outMoves]
            .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

        // Calculate running balance (chronological sum)
        // We need to sort ASC to calculate balance correctly, then we can display DESC
        const ascSorted = combined.slice().sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
        let balance = 0;
        const withBalance = ascSorted?.map(m => {
            balance += m.in - m.out;
            return { ...m, balance };
        });

        // Return DESC for display
        return withBalance.reverse();
    }, [historyLogs, warehouseOutLogs, viewState.itemId]);

    const movements = movementsRaw;
    const loading = inLoading || outLoading;

    const [alert, setAlert] = useState({ isOpen: false, title: '', text: '', icon: 'success' });

    // Handle Dropdown outside click
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsItemDropdownOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    // Computed Logic
    const filteredItems = useMemo(() => {
        if (!itemSearchText) return itemsMaster;
        const q = itemSearchText.toLowerCase();
        return itemsMaster?.filter(i => i.id.toLowerCase().includes(q) || i.name.toLowerCase().includes(q));
    }, [itemSearchText, itemsMaster]);

    const selectedItemDetails = useMemo(() => 
        itemsMaster.find(i => i.id === viewState.itemId) || { name: '-', unit: '-', category: '-', subCategory: '-' }
    , [viewState.itemId, itemsMaster]);

    const currentBalance = useMemo(() => movements[0]?.balance || 0, [movements]);
    const availableLots = useMemo(() => Array.from(new Set(movements?.map(m => m.lot))).sort(), [movements]);
    const filteredMovements = useMemo(() => viewState.lotId ? movements?.filter(m => m.lot === viewState.lotId) : movements, [movements, viewState.lotId]);
    const paginatedMovements = useMemo(() => filteredMovements.slice((viewState.page - 1) * viewState.rows, viewState.page * viewState.rows), [filteredMovements, viewState.page, viewState.rows]);
    const totalPages = Math.ceil(filteredMovements.length / viewState.rows) || 1;

    // Handlers
    const handleItemSelect = (item: any) => {
        setViewState({ ...viewState, itemId: item.id, page: 1, lotId: '' });
        setItemSearchText(`${item.id}: ${item.name}`);
        setIsItemDropdownOpen(false);
    };

    const handleClearSearch = () => {
        setItemSearchText('');
        setViewState({ ...viewState, itemId: '', page: 1 });
    };

    return (
        <div className="flex flex-col w-full pb-10 animate-fade-in-up">
            <PageHeader
                Icon={FileSpreadsheet}
                title="STOCK CARD"
                subtitle="Inventory Ledger System"
                extra={
                    <div className="flex items-center gap-3 w-full lg:w-auto">
                        <div className="flex bg-[#e2e8f0] p-1 border border-slate-200 shadow-inner rounded-xl overflow-hidden h-12">
                            <button onClick={() => setActiveTab('card')} className={`px-6 py-1.5 text-[10px] font-black transition-all rounded-lg flex items-center gap-2 uppercase tracking-[0.2em] ${activeTab === 'card' ? 'bg-[#111f42] text-white shadow-xl' : 'text-slate-500 hover:bg-slate-50'}`}>
                                <FileText size={16} /> LEDGER
                            </button>
                            <button onClick={() => setActiveTab('dashboard')} className={`px-6 py-1.5 text-[10px] font-black transition-all flex items-center gap-2 uppercase tracking-[0.2em] rounded-lg ${activeTab === 'dashboard' ? 'bg-[#111f42] text-white shadow-xl' : 'text-slate-500 hover:bg-slate-50'}`}>
                                <LayoutDashboard size={16} /> ANALYTICS
                            </button>
                        </div>
                        <button onClick={() => setIsGuideOpen(true)} className="p-2.5 transition-all rounded-xl bg-white text-slate-400 hover:bg-[#111f42] hover:text-white border border-slate-200 shadow-sm">
                            <HelpCircle size={18}/>
                        </button>
                    </div>
                }
            />

            <main className="relative z-10 flex flex-col gap-4 mt-4">
                
                {/* 1. STOCK CARD TAB - COMBINED LAYOUT */}
                {activeTab === 'card' && (
                    <div className="flex flex-col animate-fade-in-up bg-white border border-slate-200 shadow-sm rounded-2xl overflow-hidden min-h-[600px] w-full mt-6">
                        
                        {/* COMBINED: Search Toolbar Section */}
                        <StockCardToolbar 
                            itemSearchText={itemSearchText}
                            setItemSearchText={setItemSearchText}
                            setIsItemDropdownOpen={setIsItemDropdownOpen}
                            isItemDropdownOpen={isItemDropdownOpen}
                            handleClearSearch={handleClearSearch}
                            filteredItems={filteredItems}
                            handleItemSelect={handleItemSelect}
                            viewState={viewState}
                            setViewState={setViewState}
                            availableLots={availableLots}
                            onExportClick={() => window.print()}
                            dropdownRef={dropdownRef}
                        />

                        {/* COMBINED: Premium Product Detail Bar */}
                        {viewState.itemId && (
                            <div className="flex flex-col lg:flex-row justify-between items-center gap-6 animate-in slide-in-from-left duration-500 overflow-visible border-b border-slate-100 bg-[#111f42] p-8 relative">
                                <div className="absolute right-[-15px] top-[-15px] opacity-10 transform rotate-[-12deg] scale-125 pointer-events-none text-[#ab8a3b]"><Package size={160} /></div>
                                
                                <div className="relative z-10 flex-1">
                                    <div className="flex items-center gap-2 mb-2">
                                        <div className="w-1.5 h-1.5 rounded-none bg-[#ab8a3b]"></div>
                                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest font-mono">Current Ledger Product</span>
                                    </div>
                                    <h2 className="flex flex-wrap items-center gap-3">
                                        <span className="text-4xl font-black font-mono text-[#ab8a3b] tracking-tighter leading-none">{viewState.itemId}</span>
                                        <span className="text-3xl font-black text-white font-sans tracking-tight leading-none uppercase">{selectedItemDetails.name}</span>
                                    </h2>
                                </div>
                                
                                <div className="relative z-10 bg-white/5 border border-white/10 p-6 flex items-center gap-10 shrink-0 shadow-2xl backdrop-blur-sm rounded-xl">
                                    <div className="text-right">
                                        <span className="text-[10px] font-black text-[#ab8a3b] uppercase tracking-widest font-mono block mb-1">Balance</span>
                                        <div className="flex items-baseline justify-end gap-2 leading-none">
                                            <span className="text-5xl font-black text-white font-mono tracking-tighter">{currentBalance?.toLocaleString()}</span>
                                            <span className="text-[12px] font-black text-slate-400 uppercase font-mono">{selectedItemDetails.unit}</span>
                                        </div>
                                    </div>
                                    
                                    <div className="w-px h-12 bg-white/10"></div>
                                    
                                    <div className="text-right">
                                        <div className="flex items-center justify-end gap-1.5 mb-1.5">
                                            <Database size={12} className="text-[#ab8a3b]" />
                                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest font-mono block">Category</span>
                                        </div>
                                        <div className="flex flex-col items-end leading-none">
                                            <span className="text-lg font-black text-white uppercase font-mono tracking-tight">{selectedItemDetails.category}</span>
                                            <div className="flex items-center gap-1.5 mt-1.5">
                                                <Layers size={10} className="text-[#ab8a3b]" />
                                                <span className="text-[9px] font-black text-slate-500 uppercase tracking-[0.2em] font-mono">{selectedItemDetails.subCategory}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                            <div className="w-full">
                                <table className="w-full text-left whitespace-nowrap">
                                    <thead className="sticky top-0 z-10 shadow-sm border-b border-slate-200">
                                        <tr>
                                            <th className="text-[11px] font-black uppercase tracking-widest text-white bg-[#111f42] border-b-2 border-[#111f42]">Date / Time</th>
                                            <th className="text-[11px] font-black uppercase tracking-widest text-center text-white bg-[#111f42] border-b-2 border-[#111f42]">Type</th>
                                            <th className="text-[11px] font-black uppercase tracking-widest text-white bg-[#111f42] border-b-2 border-[#111f42]">Document ID</th>
                                            <th className="text-[11px] font-black uppercase tracking-widest text-white bg-[#111f42] border-b-2 border-[#111f42]">Reference</th>
                                            <th className="text-[11px] font-black uppercase tracking-widest text-white bg-[#111f42] border-b-2 border-[#111f42]">Lot Number</th>
                                            <th className="text-[11px] font-black uppercase tracking-widest text-right text-emerald-400 bg-[#111f42] border-b-2 border-[#111f42]">IN (+)</th>
                                            <th className="text-[11px] font-black uppercase tracking-widest text-right text-[#E3624A] bg-[#111f42] border-b-2 border-[#111f42]">OUT (-)</th>
                                            <th className="text-[11px] font-black uppercase tracking-widest text-right text-white bg-[#111f42] border-b-2 border-[#111f42]">BALANCE</th>
                                            <th className="text-[11px] font-black uppercase tracking-widest text-white bg-[#111f42] border-b-2 border-[#111f42]">Location</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-100 bg-white">
                                        {paginatedMovements?.map((m, idx) => (
                                            <tr key={idx} className="hover:bg-slate-50 transition-colors">
                                                <td className="font-mono text-[11px] text-slate-400 font-black uppercase tracking-widest">{m.date}</td>
                                                <td className="text-center">
                                                    <span className={`px-3 py-1 text-[10px] font-black uppercase tracking-widest border ${m.type === 'IN' ? 'bg-emerald-50 text-emerald-600 border-emerald-200' : 'bg-rose-50 text-rose-600 border-rose-100'} font-mono`}>{m.type}</span>
                                                </td>
                                                <td className="font-black text-[#111f42] font-mono tracking-wider text-[11px]">{m.docId}</td>
                                                <td className="text-[10px] font-black text-slate-400 font-mono italic uppercase tracking-widest">{m.ref}</td>
                                                <td className="font-black text-[#ab8a3b] font-mono text-[11px] tracking-wider">{m.lot}</td>
                                                <td className="text-right font-black text-[#10b981] font-mono text-[14px]">{m.in > 0 ? `+${m.in?.toLocaleString()}` : '-'}</td>
                                                <td className="text-right font-black text-[#E3624A] font-mono text-[14px]">{m.out > 0 ? `-${m.out?.toLocaleString()}` : '-'}</td>
                                                <td className="text-right font-black text-[#111f42] font-mono text-[16px] bg-slate-50/30 h-full">{m.balance?.toLocaleString()}</td>
                                                <td className="font-black text-slate-500 font-mono text-[10px] uppercase tracking-widest">{m.loc}</td>
                                            </tr>
                                        ))}
                                        {paginatedMovements.length === 0 && (
                                            <tr>
                                                <td colSpan={9} className="text-center py-24 text-slate-300 italic flex flex-col items-center justify-center gap-3 bg-white">
                                                    <div className="w-16 h-16 rounded-none bg-slate-50 flex items-center justify-center border border-slate-100 shadow-inner">
                                                        <FileText size={32} strokeWidth={1.5} className="opacity-30" />
                                                    </div>
                                                    <span className="font-black uppercase tracking-widest text-[10px]">{viewState.itemId ? 'No matching records for current lot filter' : 'Please select an item to load Stock Ledger'}</span>
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>

                            {/* Pagination Footer */}
                            {viewState.itemId && (
                                <div className="py-3 border-t border-slate-100 flex justify-between items-center bg-slate-50/50 shrink-0 mt-auto">
                                    <div className="flex items-center gap-2 text-[10px] text-slate-400 font-black uppercase font-mono tracking-widest">
                                        <span>Show</span>
                                        <select 
                                            value={viewState.rows} 
                                            onChange={(e) => setViewState({...viewState, rows: Number(e.target.value), page: 1})}
                                            className="bg-white border border-slate-200 rounded-lg px-1.5 py-0.5 focus:border-[#ab8a3b] outline-none text-[#111f42] font-black"
                                        >
                                            <option value={10}>10</option>
                                            <option value={20}>20</option>
                                        </select>
                                        <span>records</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <button onClick={() => setViewState(p => ({...p, page: Math.max(1, p.page - 1)}))} disabled={viewState.page === 1} className="p-1.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 disabled:opacity-30 transition-all shadow-sm"><ChevronLeft size={14}/></button>
                                        <span className="text-[10px] font-black text-[#111f42] px-3 font-mono uppercase tracking-widest">Page {viewState.page} of {totalPages}</span>
                                        <button onClick={() => setViewState(p => ({...p, page: Math.min(totalPages, p.page + 1)}))} disabled={viewState.page === totalPages} className="p-1.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 disabled:opacity-30 transition-all shadow-sm"><ChevronRight size={14}/></button>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}

                    {/* 2. DASHBOARD TAB */}
                    {activeTab === 'dashboard' && (
                        <DashboardCharts />
                    )}
                </main>

                <GuideDrawer isGuideOpen={isGuideOpen} setIsGuideOpen={setIsGuideOpen} />

                {/* Loading Overlay */}
                {loading && (
                    <div className="fixed inset-0 z-[20000] bg-white/60 backdrop-blur-md flex flex-col items-center justify-center gap-4 animate-in fade-in duration-300">
                        
                    <DraggableWrapper>
                          <Loader2 className="animate-spin text-[#111f42]" size={40} />
                        </DraggableWrapper>

                        <p className="font-black text-[#111f42] uppercase tracking-[0.3em] text-[9px] animate-pulse font-mono">Syncing Master Ledger...</p>
                    </div>
                )}

                {/* Alert Notification */}
                <AlertModal {...alert} onClose={() => setAlert({ ...alert, isOpen: false })} />
            </div>
    );
}

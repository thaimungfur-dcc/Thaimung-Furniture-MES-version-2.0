import React, { useState, useEffect, useMemo, useRef } from 'react';
import { 
    FileSpreadsheet, FileText, LayoutDashboard, Search, X, Printer, 
    ChevronLeft, ChevronRight, Package, Filter, ChevronDown,
    Layers, Database, HelpCircle, Loader2
} from 'lucide-react';
import { useMasterData } from '../../context/MasterDataContext';
import AlertModal from './AlertModal';
import GuideDrawer from './GuideDrawer';
import DashboardCharts from './DashboardCharts';

export default function StockCardApp() {
    // --- State Management ---
    const [activeTab, setActiveTab] = useState('card');
    const [itemSearchText, setItemSearchText] = useState('');
    const [isItemDropdownOpen, setIsItemDropdownOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [isGuideOpen, setIsGuideOpen] = useState(false);
    const [viewState, setViewState] = useState({ itemId: '', lotId: '', page: 1, rows: 10 });
    
    const dropdownRef = useRef<HTMLDivElement>(null);

    // --- Item Master: Source of Truth ---
    const { items } = useMasterData();
    const itemsMaster = useMemo(() => items.map(item => ({
        id: item.itemCode,
        name: item.itemName,
        unit: item.baseUnit,
        category: item.category,
        subCategory: item.subCategory
    })), [items]);

    const [movements, setMovements] = useState<any[]>([]);
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
        return itemsMaster.filter(i => i.id.toLowerCase().includes(q) || i.name.toLowerCase().includes(q));
    }, [itemSearchText, itemsMaster]);

    const selectedItemDetails = useMemo(() => 
        itemsMaster.find(i => i.id === viewState.itemId) || { name: '-', unit: '-', category: '-', subCategory: '-' }
    , [viewState.itemId, itemsMaster]);

    const currentBalance = useMemo(() => movements[0]?.balance || 0, [movements]);
    const availableLots = useMemo(() => Array.from(new Set(movements.map(m => m.lot))).sort(), [movements]);
    const filteredMovements = useMemo(() => viewState.lotId ? movements.filter(m => m.lot === viewState.lotId) : movements, [movements, viewState.lotId]);
    const paginatedMovements = useMemo(() => filteredMovements.slice((viewState.page - 1) * viewState.rows, viewState.page * viewState.rows), [filteredMovements, viewState.page, viewState.rows]);
    const totalPages = Math.ceil(filteredMovements.length / viewState.rows) || 1;

    // Handlers
    const handleItemSelect = (item: any) => {
        setLoading(true);
        setViewState({ ...viewState, itemId: item.id, page: 1, lotId: '' });
        setItemSearchText(`${item.id}: ${item.name}`);
        setIsItemDropdownOpen(false);
        
        setTimeout(() => {
            setMovements([
                { date: '2026-03-15 14:20', type: 'OUT', docId: 'DO2603-042', ref: 'SO-2026-088', lot: 'L2601-A', in: 0, out: 12, balance: 488, loc: 'FG-Z01' },
                { date: '2026-03-12 09:45', type: 'IN', docId: 'GR2603-015', ref: 'JO-2026-005', lot: 'L2601-A', in: 500, out: 0, balance: 500, loc: 'FG-Z01' },
                { date: '2026-02-28 16:00', type: 'OUT', docId: 'DO2602-105', ref: 'SO-2026-012', lot: 'L2512-B', in: 0, out: 5, balance: 0, loc: 'FG-Z02' },
                { date: '2026-02-15 10:00', type: 'IN', docId: 'GR2602-001', ref: 'JO-2026-001', lot: 'L2512-B', in: 5, out: 0, balance: 5, loc: 'FG-Z02' },
            ]);
            setLoading(false);
        }, 400);
    };

    const handleClearSearch = () => {
        setItemSearchText('');
        setViewState({ ...viewState, itemId: '', page: 1 });
        setMovements([]);
    };

    return (
        <div className="min-h-screen pt-8 px-8 pb-10 transition-colors duration-500 text-[12px] bg-[#F9F7F6] flex flex-col">
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@300;400;500;700;800;900&family=Noto+Sans+Thai:wght@300;400;500;600;700;900&display=swap');
                * { font-family: 'JetBrains Mono', 'Noto Sans Thai', sans-serif !important; }
                
                .master-custom-scrollbar::-webkit-scrollbar { width: 6px; height: 6px; }
                .master-custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
                .master-custom-scrollbar::-webkit-scrollbar-thumb { background: #CBD5E1; border-radius: 3px; }
                
                .minimal-th { font-size: 11px !important; text-transform: uppercase; letter-spacing: 0.1em; color: #FFFFFF; padding: 12px 14px; font-weight: 800; background-color: #111f42; border-bottom: 2px solid #ab8a3b; white-space: nowrap; }
                .minimal-td { padding: 10px 14px; vertical-align: middle; color: #111f42; font-size: 12px !important; font-weight: 500; border-bottom: 1px solid rgba(226, 232, 240, 0.6); }
                tr:hover .minimal-td { background-color: rgba(171, 138, 59, 0.05); }

                /* Premium Product Info Bar - Improved with Darker Gradient, Tilt and Padding */
                .item-info-premium { 
                    background: linear-gradient(135deg, rgba(171, 138, 59, 0.15) 0%, rgba(17, 31, 66, 0.08) 100%); 
                    border-left: 6px solid #ab8a3b; 
                    position: relative; 
                    overflow: visible; 
                    padding: 24px 0 24px 24px; /* Increased padding top/bottom */
                    margin: 12px 0; /* Added margin top/bottom */
                    transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
                }
                .item-info-premium:hover {
                    transform: perspective(1000px) rotateX(1deg) rotateY(-0.5deg);
                    box-shadow: 0 10px 30px -10px rgba(17, 31, 66, 0.1);
                }

                .info-watermark-bg { 
                    position: absolute; right: -15px; top: -15px; opacity: 0.025; 
                    transform: rotate(-12deg) scale(1.3); pointer-events: none; color: #111f42;
                    transition: transform 0.6s ease;
                }
                
                .balance-card {
                    background: white;
                    border: 1px solid rgba(226, 232, 240, 0.8);
                    border-radius: 18px;
                    padding: 12px 24px;
                    display: flex;
                    align-items: center;
                    gap: 24px;
                    box-shadow: 0 4px 15px -3px rgba(17, 31, 66, 0.05);
                }

                .custom-dropdown { 
                    position: absolute; top: 100%; left: 0; right: 0; background: white; 
                    border: 1px solid #E2E8F0; border-radius: 0.75rem; 
                    box-shadow: 0 10px 40px -10px rgba(0, 0, 0, 0.2); 
                    z-index: 1000; margin-top: 4px; max-height: 250px; overflow-y: auto; 
                }
                .dropdown-item { padding: 12px 16px; cursor: pointer; border-bottom: 1px solid #F1F5F9; transition: all 0.2s; }
                .dropdown-item:hover { background-color: #F9F7F6; }
                
                .animate-fade-in-up { animation: fadeInUp 0.4s ease-out forwards; }
                @keyframes fadeInUp { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
            `}</style>

            <div className="w-full space-y-4 relative flex-1 flex flex-col">
                {/* Header */}
                <header className="flex flex-col md:flex-row justify-between items-center gap-4 flex-shrink-0 z-10 bg-[#F9F7F6] no-print">
                    <div className="flex items-center gap-4 w-full md:w-auto">
                        <div className="w-12 h-12 bg-white flex items-center justify-center rounded-xl shadow-sm border border-slate-200 relative shrink-0">
                            <FileSpreadsheet size={24} className="text-[#111f42]" strokeWidth={2.5} />
                            <div className="absolute bottom-[10px] right-[10px] w-1.5 h-1.5 bg-[#ab8a3b] rounded-full"></div>
                        </div>
                        <div>
                            <h1 className="text-2xl tracking-tight whitespace-nowrap uppercase leading-none font-mono">
                                <span className="font-light text-[#111f42]">STOCK</span> <span className="font-black text-[#E3624A]">CARD</span>
                            </h1>
                            <p className="text-slate-500 text-[10px] mt-1 font-bold uppercase tracking-widest opacity-80 font-mono">Inventory Ledger System</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-3 w-full lg:w-auto">
                        <div className="flex bg-[#e2e8f0] p-1 border border-slate-200 shadow-inner rounded-xl overflow-hidden h-10">
                            <button onClick={() => setActiveTab('card')} className={`px-5 py-1.5 text-[10px] font-bold transition-all rounded-lg flex items-center gap-2 uppercase tracking-wide ${activeTab === 'card' ? 'bg-[#ab8a3b] text-white shadow-md' : 'text-slate-500 hover:bg-slate-50'}`}>
                                <FileText size={14} /> STOCK CARD
                            </button>
                            <button onClick={() => setActiveTab('dashboard')} className={`px-5 py-1.5 text-[10px] font-bold transition-all flex items-center gap-2 uppercase tracking-wide rounded-lg ${activeTab === 'dashboard' ? 'bg-[#ab8a3b] text-white shadow-md' : 'text-slate-500 hover:bg-slate-50'}`}>
                                <LayoutDashboard size={14} /> DASHBOARD
                            </button>
                        </div>
                        <button onClick={() => setIsGuideOpen(true)} className="p-2.5 transition-all rounded-xl bg-white text-slate-400 hover:bg-[#111f42] hover:text-white border border-slate-200 shadow-sm">
                            <HelpCircle size={18}/>
                        </button>
                    </div>
                </header>

                <main className="flex-1 relative z-10 flex flex-col gap-6">
                    
                    {/* 1. STOCK CARD TAB - COMBINED LAYOUT */}
                    {activeTab === 'card' && (
                        <div className="flex flex-col animate-fade-in-up bg-white border border-slate-200 shadow-sm rounded-none overflow-visible min-h-[600px] flex-1">
                            
                            {/* COMBINED: Search Toolbar Section */}
                            <div className="p-5 border-b border-slate-100 bg-slate-50/30 relative z-[100] overflow-visible">
                                <div className="grid grid-cols-1 md:grid-cols-12 gap-5 items-end">
                                    <div className="md:col-span-5 relative" ref={dropdownRef}>
                                        <label className="block text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1.5 font-mono">Select Product from Item Master</label>
                                        <div className="relative h-10">
                                            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                                            <input 
                                                type="text" 
                                                value={itemSearchText} 
                                                onChange={(e) => {setItemSearchText(e.target.value); setIsItemDropdownOpen(true);}}
                                                onFocus={() => setIsItemDropdownOpen(true)}
                                                placeholder="Search SKU or Name..." 
                                                className="w-full h-full bg-white border border-slate-200 rounded-xl pl-9 pr-10 text-[12px] font-bold text-[#111f42] outline-none focus:border-[#ab8a3b] transition-all shadow-sm"
                                            />
                                            {itemSearchText && (
                                                <button onClick={handleClearSearch} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-300 hover:text-[#E3624A] transition-colors"><X size={14}/></button>
                                            )}
                                        </div>
                                        {isItemDropdownOpen && (
                                            <div className="custom-dropdown master-custom-scrollbar animate-in slide-in-from-top-2 duration-200">
                                                {filteredItems.map(item => (
                                                    <div key={item.id} onClick={() => handleItemSelect(item)} className="dropdown-item">
                                                        <div className="text-[11px] font-black text-[#111f42] font-mono tracking-wider">{item.id}</div>
                                                        <div className="text-[10px] text-slate-500 font-bold">{item.name}</div>
                                                    </div>
                                                ))}
                                                {filteredItems.length === 0 && <div className="p-4 text-center text-xs text-slate-400 italic font-mono">No items found in master database</div>}
                                            </div>
                                        )}
                                    </div>
                                    <div className="md:col-span-3">
                                        <label className="block text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1.5 font-mono">Lot Tracking</label>
                                        <div className="relative h-10">
                                            <Filter size={12} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#ab8a3b]" />
                                            <select 
                                                value={viewState.lotId} 
                                                onChange={(e) => setViewState({...viewState, lotId: e.target.value, page: 1})}
                                                disabled={!viewState.itemId}
                                                className="w-full h-full bg-white border border-slate-200 rounded-xl pl-9 pr-8 text-[10px] font-black text-[#111f42] outline-none focus:border-[#ab8a3b] appearance-none disabled:bg-slate-50 disabled:text-slate-300 cursor-pointer font-bold"
                                            >
                                                <option value="">ALL LOT NUMBERS</option>
                                                {availableLots.map(lot => <option key={lot} value={lot as string}>{lot as string}</option>)}
                                            </select>
                                            <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                                        </div>
                                    </div>
                                    <div className="md:col-span-4 flex justify-end gap-2">
                                        <button onClick={() => window.print()} className="h-10 px-6 rounded-xl bg-[#111f42] text-white text-[10px] font-black uppercase tracking-widest shadow-md hover:bg-[#1e346b] transition-all flex items-center gap-2 font-mono">
                                            <Printer size={14} className="text-[#ab8a3b]" /> EXPORT LEDGER
                                        </button>
                                    </div>
                                </div>
                            </div>

                            {/* COMBINED: Premium Product Detail Bar inside the container - UPDATED SPACING & COLOR */}
                            {viewState.itemId && (
                                <div className="item-info-premium flex flex-col lg:flex-row justify-between items-center gap-6 animate-in slide-in-from-left duration-500 overflow-visible border-b border-slate-100">
                                    <div className="info-watermark-bg"><Package size={160} /></div>
                                    
                                    <div className="relative z-10 flex-1">
                                        <div className="flex items-center gap-2 mb-1.5">
                                            <div className="w-2 h-2 rounded-full bg-[#ab8a3b]"></div>
                                            <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest font-mono">Ledger Context</span>
                                        </div>
                                        <h2 className="flex flex-wrap items-center gap-3">
                                            <span className="text-3xl font-black font-mono text-[#ab8a3b] tracking-tighter leading-none">{viewState.itemId}</span>
                                            <span className="text-2xl font-black text-[#111f42] font-sans tracking-tight leading-none uppercase">{selectedItemDetails.name}</span>
                                        </h2>
                                    </div>
                                    
                                    <div className="relative z-10 balance-card shrink-0 mr-4">
                                        <div className="text-right">
                                            <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest font-mono block mb-0.5">Stock Balance</span>
                                            <div className="flex items-baseline justify-end gap-1.5 leading-none">
                                                <span className="text-4xl font-black text-[#111f42] font-mono tracking-tighter">{currentBalance.toLocaleString()}</span>
                                                <span className="text-[10px] font-black text-[#ab8a3b] uppercase font-mono">{selectedItemDetails.unit}</span>
                                            </div>
                                        </div>
                                        
                                        <div className="w-px h-10 bg-slate-100"></div>
                                        
                                        <div className="text-right">
                                            <div className="flex items-center justify-end gap-1.5 mb-1">
                                                <Database size={10} className="text-slate-300" />
                                                <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest font-mono block">Category</span>
                                            </div>
                                            <div className="flex flex-col items-end leading-none">
                                                <span className="text-sm font-black text-[#111f42] uppercase font-mono tracking-tight">{selectedItemDetails.category}</span>
                                                <div className="flex items-center gap-1 mt-1">
                                                    <Layers size={8} className="text-[#ab8a3b]" />
                                                    <span className="text-[8px] font-bold text-slate-300 uppercase tracking-[0.2em]">{selectedItemDetails.subCategory}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* COMBINED: Movement Table - Integrated */}
                            <div className="flex-1 overflow-auto master-custom-scrollbar">
                                <table className="w-full text-left whitespace-nowrap">
                                    <thead className="sticky top-0 z-10 shadow-sm border-b border-slate-200">
                                        <tr>
                                            <th className="minimal-th border-b-0">Date / Time</th>
                                            <th className="minimal-th border-b-0 text-center">Type</th>
                                            <th className="minimal-th border-b-0">Document ID</th>
                                            <th className="minimal-th border-b-0">Reference</th>
                                            <th className="minimal-th border-b-0">Lot Number</th>
                                            <th className="minimal-th border-b-0 text-right text-emerald-400">IN (+)</th>
                                            <th className="minimal-th border-b-0 text-right text-[#E3624A]">OUT (-)</th>
                                            <th className="minimal-th border-b-0 text-right bg-[#111f42] border-l-2 border-[#ab8a3b]">BALANCE</th>
                                            <th className="minimal-th border-b-0">Location</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-100 bg-white">
                                        {paginatedMovements.map((m, idx) => (
                                            <tr key={idx} className="hover:bg-slate-50 transition-colors">
                                                <td className="minimal-td font-mono text-[11px] text-slate-500">{m.date}</td>
                                                <td className="minimal-td text-center">
                                                    <span className={`badge ${m.type === 'IN' ? 'bg-emerald-50 text-emerald-600 border-emerald-200' : 'bg-rose-50 text-rose-600 border-rose-100'} font-mono font-bold`}>{m.type}</span>
                                                </td>
                                                <td className="minimal-td font-black text-[#111f42] font-mono tracking-wide">{m.docId}</td>
                                                <td className="minimal-td text-[10px] font-bold text-slate-400 font-mono italic">{m.ref}</td>
                                                <td className="minimal-td font-black text-[#ab8a3b] font-mono text-[11px] tracking-wider">{m.lot}</td>
                                                <td className="minimal-td text-right font-black text-emerald-600 font-mono">{m.in > 0 ? `+${m.in.toLocaleString()}` : '-'}</td>
                                                <td className="minimal-td text-right font-black text-[#E3624A] font-mono">{m.out > 0 ? `-${m.out.toLocaleString()}` : '-'}</td>
                                                <td className="minimal-td text-right font-black text-[#111f42] font-mono text-[13px] bg-slate-50/50 border-l-2 border-slate-100">{m.balance.toLocaleString()}</td>
                                                <td className="minimal-td font-bold text-slate-500 font-mono text-[11px]">{m.loc}</td>
                                            </tr>
                                        ))}
                                        {paginatedMovements.length === 0 && (
                                            <tr>
                                                <td colSpan={9} className="text-center py-24 text-slate-300 italic flex flex-col items-center justify-center gap-3 bg-white">
                                                    <div className="w-16 h-16 rounded-full bg-slate-50 flex items-center justify-center border border-slate-100 shadow-inner">
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
                                <div className="px-6 py-3 border-t border-slate-100 flex justify-between items-center bg-slate-50/50 shrink-0 mt-auto">
                                    <div className="flex items-center gap-2 text-[10px] text-slate-400 font-bold uppercase font-mono tracking-widest">
                                        <span>Show</span>
                                        <select 
                                            value={viewState.rows} 
                                            onChange={(e) => setViewState({...viewState, rows: Number(e.target.value), page: 1})}
                                            className="bg-white border border-slate-200 rounded px-1.5 py-0.5 focus:border-[#ab8a3b] outline-none text-[#111f42] font-bold"
                                        >
                                            <option value={10}>10</option>
                                            <option value={20}>20</option>
                                        </select>
                                        <span>records</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <button onClick={() => setViewState(p => ({...p, page: Math.max(1, p.page - 1)}))} disabled={viewState.page === 1} className="p-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 disabled:opacity-30 transition-all shadow-sm"><ChevronLeft size={14}/></button>
                                        <span className="text-[10px] font-black text-[#111f42] px-3 font-mono uppercase tracking-widest">Page {viewState.page} of {totalPages}</span>
                                        <button onClick={() => setViewState(p => ({...p, page: Math.min(totalPages, p.page + 1)}))} disabled={viewState.page === totalPages} className="p-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 disabled:opacity-30 transition-all shadow-sm"><ChevronRight size={14}/></button>
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
                        <Loader2 className="animate-spin text-[#ab8a3b]" size={40} />
                        <p className="font-black text-[#111f42] uppercase tracking-[0.3em] text-[9px] animate-pulse font-mono">Syncing Master Ledger...</p>
                    </div>
                )}

                {/* Alert Notification */}
                <AlertModal {...alert} onClose={() => setAlert({ ...alert, isOpen: false })} />
            </div>
        </div>
    );
}

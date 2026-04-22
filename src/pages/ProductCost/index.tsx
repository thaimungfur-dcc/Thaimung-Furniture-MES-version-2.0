import React, { useState, useEffect, useMemo } from 'react';
import { 
    Package, Settings, List, Box, 
    PlusCircle, CheckCircle, Circle, Tag, 
    X, Trash2, Search, Plus, 
    ChevronLeft, ChevronRight, Eye, Check, 
    HelpCircle, Info, RefreshCw, FileText, Settings2, DollarSign, Clock, 
    Cpu, CornerDownRight, ChevronDown, Edit3, Save, LayoutGrid, Calculator,
    Users, Factory, Building, ShoppingBag, Briefcase, History, Coins,
    Phone, Mail, TrendingUp, ShieldCheck, Target, Zap, ArrowDownToLine,
    Droplets, Gauge
} from 'lucide-react';

import { useMasterData } from '../../context/MasterDataContext';
import { useGoogleSheets } from '../../hooks/useGoogleSheets';
import { PageHeader } from '../../components/shared/PageHeader';
import ProductCostTable from './components/ProductCostTable';

// --- ERP Palette ---
const palette = {
    primary: '#111f42',     // Navy
    accent: '#E3624A',      // Terracotta
    deepRed: '#952425',     // Dark Red
    gold: '#ab8a3b',        // Gold
    success: '#10b981',     // Green
    warning: '#f59e0b',     // Amber
    danger: '#ef4444',      // Red
    muted: '#72A09E',       // Muted Teal
    slate: '#4e546a',       // Slate
    lightBg: '#F9F7F6'      // Neutral Bg
};

// --- KPI Card Component ---
const KpiCard = ({ title, val, color, IconComponent, desc }: any) => (
    <div className="bg-white p-6 rounded-[22px] shadow-sm hover:shadow-md transition-all duration-300 border border-black/5 relative overflow-hidden group h-full cursor-pointer">
        <div className="absolute -right-6 -bottom-6 opacity-[0.03] transform rotate-12 group-hover:scale-110 transition-transform duration-700 pointer-events-none z-0">
            <IconComponent size={120} />
        </div>
        <div className="relative z-10 flex justify-between items-start">
            <div className="flex-1 min-w-0 flex flex-col gap-1">
                <p className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] truncate">{title}</p>
                <div className="flex items-baseline gap-2 mt-1">
                    <h4 className="text-3xl font-black font-mono tracking-tighter leading-tight truncate text-[#111f42]">{val}</h4>
                </div>
                {desc && (
                    <p className="text-[8px] text-slate-400 font-bold mt-2 flex items-center gap-1.5 truncate uppercase">
                        <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{backgroundColor: color}}></span>
                        {desc}
                    </p>
                )}
            </div>
            <div className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0 shadow-sm border border-black/5 bg-slate-50" style={{ color: color }}>
                <IconComponent size={24} strokeWidth={2.5} />
            </div>
        </div>
    </div>
);

export default function ProductCost() {
    const { items } = useMasterData();
    const { data: costItems, addRow: addCost, updateRow: updateCost, loading: costLoading } = useGoogleSheets<any>('ProductCost');
    const [viewMode, setViewMode] = useState('summary');
    const [searchQuery, setSearchQuery] = useState('');
    const [showBOMModal, setShowBOMModal] = useState(false);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [isGuideOpen, setIsGuideOpen] = useState(false);
    
    const isLoading = costLoading;

    const [bomTab, setBomTab] = useState('productCost');

    const kpis = useMemo(() => {
        const count = costItems.length;
        const avgCost = count > 0 ? costItems.reduce((s, i) => s + (i.totalCost || 0), 0) / count : 0;
        const totalVal = costItems.reduce((s, i) => s + ((i.totalCost || 0) * (i.batchSize || 1)), 0);
        const avgMargin = count > 0 ? costItems.reduce((s, i) => s + (i.targetMargin || 0), 0) / count : 0;
        return { count, avgCost, totalVal, avgMargin };
    }, [costItems]);

    // Form State
    const [form, setForm] = useState<any>({
        itemId: '', item: '', itemName: '', category: '', targetMargin: 25, batchSize: 1,
        dm: [], dl: [], factory_oh: [], office_oh: [], utilities: [], depreciation: [],
        selling: [], admin: [], others: [],
        history: []
    });

    useEffect(() => {
        // Removed mock data initialization as it now uses Google Sheets API
    }, []);
    // --- Logic & Filtering ---
    const filteredItems = useMemo(() => {


        if (!searchQuery) return costItems;
        const q = searchQuery.toLowerCase();
        return costItems.filter(p => (p.item + p.itemName).toLowerCase().includes(q));
    }, [costItems, searchQuery]);

    const productRows = useMemo(() => {
        const result = [];
        for (let i = 0; i < filteredItems.length; i += 5) result.push(filteredItems.slice(i, i + 5));
        return result;
    }, [filteredItems]);

    // --- Calculation Engine ---
    const sumSection = (arr: any[]) => (arr || []).reduce((s, i) => s + (Number(i.cost) || 0), 0);
    const totals = useMemo(() => {
        const c_dm = sumSection(form.dm), c_dl = sumSection(form.dl);
        const c_foh = sumSection(form.factory_oh), c_ooh = sumSection(form.office_oh);
        const c_util = sumSection(form.utilities), c_dep = sumSection(form.depreciation);
        const c_sell = sumSection(form.selling), c_admin = sumSection(form.admin);
        const c_others = sumSection(form.others);

        const bSize = Number(form.batchSize) || 1;
        
        // Part A: Product Cost (Direct + Amortized OH)
        const productA = c_dm + c_dl + ((c_foh + c_ooh + c_util + c_dep) / bSize);
        
        // Part B: Period Cost (Selling + Admin + Amortized Others)
        const periodB = c_sell + c_admin + (c_others / bSize);
        
        const total = productA + periodB;
        const suggested = Math.ceil(total * (1 + (form.targetMargin / 100)));
        const profitPerUnit = suggested - total;
        const marginPct = suggested > 0 ? (profitPerUnit / suggested) * 100 : 0;

        return { 
            dm: c_dm, dl: c_dl, foh: c_foh, ooh: c_ooh, util: c_util, dep: c_dep, 
            sell: c_sell, admin: c_admin, others: c_others,
            productA, periodB, total, suggested, profitPerUnit, marginPct 
        };
    }, [form]);

    // Actions
    const openBOM = (p: any, e: any) => {
        if(e) e.stopPropagation();
        setForm({
            ...JSON.parse(JSON.stringify(p)),
            utilities: p.utilities || [],
            depreciation: p.depreciation || [],
            others: p.others || [],
            batchSize: p.batchSize || 1
        });
        setBomTab('productCost');
        setShowBOMModal(true);
    };

    const handleCreateNew = () => {
        setForm({
            itemId: Date.now().toString(), item: '', itemName: '', category: 'ทั่วไป', targetMargin: 25, batchSize: 1,
            dm: [], dl: [], factory_oh: [], office_oh: [], utilities: [], depreciation: [],
            selling: [], admin: [], others: [], history: []
        });
        setShowCreateModal(true);
    };

    const updateRow = (section: string, index: number, key: string, value: any) => {
        const newForm = { ...form };
        const row = newForm[section][index];
        row[key] = value;
        if (section === 'dm') {
            const qty = Number(row.qty) || 0, price = Number(row.pricePerUnit) || 0, scrap = Number(row.scrap) || 0;
            row.cost = qty * price * (1 + scrap / 100);
        } else if (section === 'dl') {
            row.cost = (Number(row.rate) || 0) * (Number(row.timeHrs) || 0);
        }
        setForm(newForm);
    };

    const addRow = (section: string) => {
        const newForm = { ...form };
        const emptyRow = section === 'dm' ? { name: '', qty: 0, pricePerUnit: 0, scrap: 0, cost: 0, unit: 'KG' } :
                         section === 'dl' ? { name: '', rate: 0, timeHrs: 0, cost: 0 } : { name: '', subType: '', cost: 0 };
        newForm[section].push(emptyRow);
        setForm(newForm);
    };

    const removeRow = (section: string, index: number) => {
        const newForm = { ...form };
        newForm[section].splice(index, 1);
        setForm(newForm);
    };

    const saveBOM = async () => {
        const updatedItem = {
            ...form, 
            productCost: totals.productA, 
            periodCost: totals.periodB, 
            totalCost: totals.total,
            suggestedPrice: totals.suggested, 
            status: 'Active'
        };
        
        try {
            const existing = costItems.find(i => i.itemId === form.itemId);
            if (existing) {
                await updateCost(existing.id, updatedItem);
            } else {
                await addCost({ ...updatedItem, id: String(Date.now()) });
            }
            setShowBOMModal(false); 
            setShowCreateModal(false);
            window.alert('BOM saved successfully.');
        } catch (error) {
            console.error('Error saving BOM:', error);
            window.alert('Error saving BOM.');
        }
    };

    const getAccCode = (section: string, row: any) => {
        let group = "31";
        let type = "OF";
        if (section === 'office_oh') { group = "32"; type = "OA"; }
        else if (section === 'utilities') { group = "33"; type = "UT"; }
        else if (section === 'depreciation') { group = "34"; type = "DE"; }
        else if (section === 'selling') { group = "40"; type = "SE"; }
        else if (section === 'admin') { group = "50"; type = "AD"; }
        else if (section === 'others') { group = "60"; type = "EX"; }
        
        let yy = "00";
        if (row.subType) {
            const match = row.subType.match(/\.(\d+)/);
            if (match && match[1]) yy = match[1].padStart(2, '0');
        }
        return `${group}-${yy}-00-${type}`;
    };


    return (
        <div className="relative w-full flex flex-col pb-10 transition-colors duration-500 text-[12px] border-l-4 border-l-[#ab8a3b]">
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@300;400;500;700;800;900&family=Noto+Sans+Thai:wght@300;400;500;600;700;900&display=swap');
                * { font-family: 'JetBrains Mono', 'Noto Sans Thai', sans-serif !important; }
                .master-custom-scrollbar::-webkit-scrollbar { width: 6px; height: 6px; }
                .master-custom-scrollbar::-webkit-scrollbar-thumb { background: #CBD5E1; border-radius: 3px; }
                
                .minimal-th { font-size: 11px !important; text-transform: uppercase; letter-spacing: 0.1em; color: #FFFFFF; padding: 14px 16px; font-weight: 800; background-color: #111f42 !important; border-bottom: 2.5px solid #ab8a3b !important; white-space: nowrap; }
                .minimal-td { padding: 10px 14px; vertical-align: middle; color: #111f42; font-size: 12px !important; font-weight: 500; border-bottom: 1px solid rgba(226, 232, 240, 0.6); }
                tr:hover .minimal-td { background-color: rgba(171, 138, 59, 0.05); }
                
                .input-table { width: 100%; background: transparent; border-bottom: 1px dashed #cbd5e1; outline: none; padding: 4px 0; font-size: 11px; transition: all 0.2s; }
                .input-table:focus { border-bottom-color: #ab8a3b; border-bottom-style: solid; }
                
                .hover-card { flex: 1; transition: all 0.6s cubic-bezier(0.25, 1, 0.5, 1); min-width: 0; }
                @media (min-width: 1024px) { .hover-card:hover { flex: 3; } }
                
                .animate-fade-in-up { animation: fadeInUp 0.4s ease-out forwards; }
                @keyframes fadeInUp { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
            `}</style>

            <div className="w-full space-y-4 relative flex-1 flex flex-col">
                {/* Header */}
                <PageHeader
                    title="PRODUCT COST"
                    subtitle="Standard Costing Engine"
                    icon={Coins}
                    rightContent={
                        <div className="flex items-center gap-3 w-full lg:w-auto justify-end">
                            <div className="flex bg-[#e2e8f0] p-1 rounded-xl border border-slate-200 shadow-inner h-10 overflow-hidden">
                                <button onClick={() => setViewMode('summary')} className={`px-5 py-1.5 text-[10px] font-black uppercase transition-all rounded-lg ${viewMode === 'summary' ? 'bg-[#ab8a3b] text-white shadow-md' : 'text-slate-500 hover:bg-white/50'}`}><LayoutGrid size={14} className="mr-2 inline" /> Cards</button>
                                <button onClick={() => setViewMode('list')} className={`px-5 py-1.5 text-[10px] font-black uppercase transition-all rounded-lg ${viewMode === 'list' ? 'bg-[#ab8a3b] text-white shadow-md' : 'text-slate-500 hover:bg-white/50'}`}><List size={14} className="mr-2 inline" /> SKU List</button>
                            </div>
                            <button onClick={() => setIsGuideOpen(true)} className="p-2.5 bg-white border border-slate-200 rounded-xl text-slate-400 hover:text-[#111f42] transition-all shadow-sm h-10"><HelpCircle size={20} /></button>
                        </div>
                    }
                />

                <main className="flex-1 relative z-10 flex flex-col gap-6">
                    {/* KPI Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 animate-fade-in-up shrink-0">
                        <KpiCard title="Active SKUs" val={kpis.count} color={palette.primary} IconComponent={Box} desc="Defined Portfolio" />
                        <KpiCard title="Avg Portfolio Cost" val={`฿${kpis.avgCost.toLocaleString(undefined, {maximumFractionDigits: 0})}`} color={palette.gold} IconComponent={Calculator} desc="System Average" />
                        <KpiCard title="Avg Margin Target" val={`${kpis.avgMargin.toFixed(1)}%`} color={palette.success} IconComponent={TrendingUp} desc="Portfolio Markup" />
                        <KpiCard title="Total Asset Val" val={`฿${(kpis.totalVal / 1000000).toFixed(1)}M`} color={palette.accent} IconComponent={Coins} desc="Standard Value" />
                    </div>

                    <div className="bg-white rounded-none shadow-sm border border-black/5 flex flex-col overflow-hidden animate-fade-in-up min-h-[600px] flex-1">
                        <div className="px-6 py-4 border-b border-black/5 flex flex-col lg:flex-row items-center justify-between gap-4 bg-slate-50/30">
                            <div className="relative w-full lg:w-96">
                                <Search size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" />
                                <input type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="Search catalogue..." className="w-full pl-10 pr-4 py-2.5 text-[11px] font-bold rounded-xl border border-black/5 focus:outline-none focus:border-[#ab8a3b] bg-white shadow-sm" />
                            </div>
                            <div className="flex gap-2">
                                 <button onClick={handleCreateNew} className="px-6 py-2.5 bg-[#111f42] text-white rounded-xl text-[10px] font-black tracking-widest uppercase shadow-lg shadow-blue-900/20 hover:brightness-110 transition-all flex items-center gap-2">
                                    <Plus size={16} className="text-[#E3624A]" strokeWidth={3} /> NEW PRODUCT COST
                                </button>
                            </div>
                        </div>

                        <div className="flex-1 flex flex-col p-8 overflow-y-auto master-custom-scrollbar">
                            {viewMode === 'summary' ? (
                                <div className="flex-1 space-y-4">
                                    {productRows.map((row, rowIndex) => (
                                        <div key={rowIndex} className="flex flex-col lg:flex-row gap-6 w-full h-auto lg:h-[400px]">
                                            {row.map(product => (
                                                <div 
                                                    key={product.itemId} 
                                                    className="hover-card group relative flex flex-col justify-end p-0 bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-xl border border-slate-200 cursor-pointer h-[350px] lg:h-full border-t-4 border-t-[#ab8a3b]"
                                                    onClick={(e) => openBOM(product, e)}
                                                >
                                                    {/* Card Image Section */}
                                                    <img src={product.imageLink} alt={product.itemName} className="absolute inset-0 w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-all duration-700 group-hover:scale-105" />
                                                    <div className="absolute inset-0 bg-gradient-to-t from-[#111f42] via-[#111f42]/40 to-transparent opacity-90 group-hover:opacity-100 transition-opacity duration-500"></div>
                                                    
                                                    {/* Card Info Section */}
                                                    <div className="relative z-10 flex flex-col h-full justify-end p-5">
                                                        <span className="px-2 py-0.5 bg-white/20 backdrop-blur-md text-white text-[8px] font-black tracking-widest uppercase rounded-sm mb-2 inline-block border border-white/10 w-fit">{product.category}</span>
                                                        <h2 className="text-lg lg:text-xl font-black text-white leading-tight mb-1.5 tracking-tight drop-shadow-md line-clamp-2 font-thai">{product.itemName}</h2>
                                                        
                                                        {/* Split Pricing Box */}
                                                        <div className="flex bg-slate-50/10 backdrop-blur-md border border-white/20 rounded-lg overflow-hidden my-3">
                                                            <div className="flex-1 p-2 border-r border-white/10">
                                                                <span className="text-[7px] text-white/60 block font-black uppercase mb-0.5 tracking-widest">COST</span>
                                                                <span className="text-[13px] font-mono font-black text-white">฿{product.totalCost.toLocaleString()}</span>
                                                            </div>
                                                            <div className="flex-1 p-2 bg-white/10">
                                                                <span className="text-[7px] text-[#E3624A] block font-black uppercase mb-0.5 tracking-widest">PRICE</span>
                                                                <span className="text-[15px] font-black text-[#E3624A] font-mono leading-none">฿{product.suggestedPrice.toLocaleString()}</span>
                                                            </div>
                                                        </div>

                                                        <div className="grid transition-all duration-500 ease-in-out grid-rows-[0fr] lg:group-hover:grid-rows-[1fr] opacity-0 lg:group-hover:opacity-100 mt-0 lg:group-hover:mt-2">
                                                            <div className="overflow-hidden flex flex-col">
                                                                <div className="pt-3 border-t border-white/20">
                                                                    <button className="w-full py-2.5 bg-[#111f42] text-white rounded-xl font-black text-[9px] uppercase tracking-widest shadow-lg flex items-center justify-center gap-2 border border-[#ab8a3b]/50">
                                                                        <Calculator size={14} className="text-[#ab8a3b]" /> ANALYZE COST
                                                                    </button>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                            {row.length < 5 && [...Array(5 - row.length)].map((_, i) => (<div key={`e-${i}`} className="hidden lg:block flex-1"></div>))}
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="bg-[#F9F7F6]">
                                    <ProductCostTable 
                                        data={filteredItems}
                                        onOpenBOM={openBOM}
                                    />
                                </div>
                            )}
                        </div>
                    </div>
                </main>
            </div>

            {/* MODAL: BOM EDITOR & CREATE */}
            {(showBOMModal || showCreateModal) && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-[#111f42]/60 backdrop-blur-sm animate-in fade-in">
                    <div className="bg-[#F9F7F6] w-full max-w-[1200px] h-[95vh] rounded-[32px] overflow-hidden shadow-2xl border-t-[8px] border-[#ab8a3b] flex flex-col animate-in zoom-in-95">
                        <div className="bg-[#111f42] px-8 py-5 flex justify-between items-center text-white shrink-0">
                            <div>
                                <h3 className="text-xl font-black uppercase tracking-widest font-thai">{form.itemName || 'New Product Costing'}</h3>
                                <p className="text-[9px] font-bold text-slate-400 mt-1 uppercase font-mono tracking-widest">SKU: {form.item || 'PENDING'}</p>
                            </div>
                            <button onClick={() => {setShowBOMModal(false); setShowCreateModal(false);}} className="p-2 hover:bg-white/10 rounded-xl transition-all"><X size={24} /></button>
                        </div>

                        <div className="bg-white px-8 py-4 border-b border-slate-100 flex justify-between items-center shrink-0">
                            <div className="flex gap-4 font-mono">
                                <button onClick={() => setBomTab('productCost')} className={`px-5 py-2 rounded-lg text-xs font-black uppercase transition-all ${bomTab==='productCost'?'bg-slate-100 text-[#111f42] border border-slate-200 shadow-sm':'text-slate-400 hover:bg-slate-50'}`}>A. Product Cost</button>
                                <button onClick={() => setBomTab('periodCost')} className={`px-5 py-2 rounded-lg text-xs font-black uppercase transition-all ${bomTab==='periodCost'?'bg-slate-100 text-[#111f42] border border-slate-200 shadow-sm':'text-slate-400 hover:bg-slate-50'}`}>B. Period Cost</button>
                                <button onClick={() => setBomTab('summary')} className={`px-5 py-2 rounded-lg text-xs font-black uppercase transition-all ${bomTab==='summary'?'bg-slate-100 text-[#111f42] border border-slate-200 shadow-sm':'text-slate-400 hover:bg-slate-50'}`}>Summary</button>
                            </div>
                            <div className="text-right">
                                <label className="text-[9px] font-black text-slate-400 uppercase font-mono tracking-widest leading-none block mb-1">Total Unit Cost</label>
                                <div className="text-3xl font-black text-[#10b981] font-mono leading-none">฿{totals.total.toLocaleString(undefined, {minimumFractionDigits: 2})}</div>
                            </div>
                        </div>

                        <div className="flex-1 overflow-y-auto master-custom-scrollbar p-8 bg-[#F9F7F6]">
                            {bomTab === 'productCost' && (
                                <div className="space-y-8 animate-fade-in-up">
                                    <div className="bg-amber-50 rounded-2xl p-6 border border-amber-100 flex items-center justify-between">
                                        <div>
                                            <h4 className="font-black text-[#111f42] uppercase text-xs tracking-widest flex items-center gap-2"><Zap size={16} className="text-amber-500" /> Manufacturing Amortization</h4>
                                            <p className="text-[10px] text-slate-500 font-bold uppercase mt-1">Batch Size applies to Section 3.1 - 3.4 (OH & Capital Assets)</p>
                                        </div>
                                        <div className="flex items-center gap-3 bg-white px-4 py-2 rounded-xl shadow-sm border border-amber-200">
                                            <label className="text-[10px] font-black uppercase text-slate-400">Standard Batch Size</label>
                                            <input type="number" value={form.batchSize} onChange={e=>setForm({...form, batchSize: e.target.value})} className="w-24 text-right font-black text-[#111f42] outline-none" />
                                        </div>
                                    </div>

                                    {showCreateModal && (
                                        <div className="bg-white rounded-2xl border border-black/5 shadow-sm p-6 grid grid-cols-2 gap-6 font-mono">
                                            <div className="col-span-2"><label className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Product Name</label><input value={form.itemName} onChange={e=>setForm({...form, itemName: e.target.value})} className="input-table text-base font-bold" placeholder="Product Title" /></div>
                                            <div>
                                                <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest">SKU / ID</label>
                                                <select 
                                                    value={form.item} 
                                                    onChange={e => {
                                                        const selectedItem = items.find(i => i.itemCode === e.target.value);
                                                        setForm({...form, item: e.target.value, itemName: selectedItem?.itemName || '', category: selectedItem?.category || ''});
                                                    }} 
                                                    className="input-table font-mono w-full"
                                                >
                                                    <option value="">Select Item...</option>
                                                    {items.filter(i => i.itemType === 'FG').map(item => (
                                                        <option key={item.id} value={item.itemCode}>{item.itemCode} - {item.itemName}</option>
                                                    ))}
                                                </select>
                                            </div>
                                            <div><label className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Category</label><input value={form.category} onChange={e=>setForm({...form, category: e.target.value})} className="input-table" placeholder="Category" readOnly /></div>
                                        </div>
                                    )}

                                    {/* 1. DM, 2. DL */}
                                    <div className="bg-white rounded-2xl border border-black/5 shadow-sm p-6">
                                        <h4 className="text-xs font-black text-[#111f42] uppercase tracking-widest flex items-center gap-2 border-b pb-3 mb-4"><Box size={16} className="text-[#10b981]"/> 1. Direct Material (วัตถุดิบทางตรง)</h4>
                                        <table className="w-full text-left font-mono text-[11px] mb-4">
                                            <thead><tr><th className="minimal-th w-24">Acc Code</th><th className="minimal-th w-auto">Material</th><th className="minimal-th w-20 text-center">Unit</th><th className="minimal-th w-24 text-right">Qty</th><th className="minimal-th w-28 text-right">Price</th><th className="minimal-th w-32 text-right">Total</th><th className="minimal-th w-10"></th></tr></thead>
                                            <tbody>{form.dm.map((r: any, i: number) => (
                                                <tr key={i}><td className="minimal-td text-slate-400">11-01-00-DM</td><td className="minimal-td"><input value={r.name} onChange={e=>updateRow('dm', i, 'name', e.target.value)} className="input-table font-thai" /></td><td className="minimal-td"><input value={r.unit} onChange={e=>updateRow('dm', i, 'unit', e.target.value)} className="input-table text-center" /></td><td className="minimal-td"><input type="number" value={r.qty} onChange={e=>updateRow('dm', i, 'qty', e.target.value)} className="input-table text-right font-bold"/></td><td className="minimal-td"><input type="number" value={r.pricePerUnit} onChange={e=>updateRow('dm', i, 'pricePerUnit', e.target.value)} className="input-table text-right text-emerald-600 font-bold"/></td><td className="minimal-td text-right font-black">฿{(r.cost||0).toLocaleString()}</td><td className="minimal-td text-center"><button onClick={()=>removeRow('dm', i)} className="text-slate-200 hover:text-rose-500 transition-colors"><Trash2 size={14}/></button></td></tr>
                                            ))}</tbody>
                                        </table>
                                        <button onClick={()=>addRow('dm')} className="text-[10px] font-black uppercase text-[#ab8a3b] flex items-center gap-1 hover:brightness-110 transition-all"><Plus size={14}/> Add Row</button>
                                    </div>

                                    <div className="bg-white rounded-2xl border border-black/5 shadow-sm p-6">
                                        <h4 className="text-xs font-black text-[#111f42] uppercase tracking-widest flex items-center gap-2 border-b pb-3 mb-4"><Users size={16} className="text-[#3981BF]"/> 2. Direct Labor (ค่าแรงทางตรง)</h4>
                                        <table className="w-full text-left font-mono text-[11px] mb-4">
                                            <thead><tr><th className="minimal-th w-24">Acc Code</th><th className="minimal-th w-auto">Activity</th><th className="minimal-th w-32 text-right">Rate / Hr</th><th className="minimal-th w-32 text-right">Time (Hrs)</th><th className="minimal-th w-32 text-right">Unit Total</th><th className="minimal-th w-10"></th></tr></thead>
                                            <tbody>{form.dl.map((r: any, i: number) => (
                                                <tr key={i}><td className="minimal-td text-slate-400">20-01-00-DL</td><td className="minimal-td"><input value={r.name} onChange={e=>updateRow('dl', i, 'name', e.target.value)} className="input-table font-thai"/></td><td className="minimal-td"><input type="number" value={r.rate} onChange={e=>updateRow('dl', i, 'rate', e.target.value)} className="input-table text-right"/></td><td className="minimal-td"><input type="number" value={r.timeHrs} onChange={e=>updateRow('dl', i, 'timeHrs', e.target.value)} className="input-table text-right font-bold"/></td><td className="minimal-td text-right font-black">฿{(r.cost||0).toLocaleString()}</td><td className="minimal-td text-center"><button onClick={()=>removeRow('dl', i)} className="text-slate-200 hover:text-rose-500"><Trash2 size={14}/></button></td></tr>
                                            ))}</tbody>
                                        </table>
                                        <button onClick={()=>addRow('dl')} className="text-[10px] font-black uppercase text-[#ab8a3b] flex items-center gap-1 hover:brightness-110 transition-all"><Plus size={14}/> Add Activity</button>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                        <div className="bg-white rounded-2xl border border-black/5 shadow-sm p-6">
                                            <h4 className="text-xs font-black text-[#111f42] uppercase tracking-widest flex items-center gap-2 border-b pb-3 mb-4"><Factory size={16} className="text-slate-400"/> 3.1 Manufacturing OH</h4>
                                            <table className="w-full text-left font-mono text-[11px] mb-4">
                                                <thead><tr><th className="minimal-th w-auto">Item Name</th><th className="minimal-th w-32 text-right">Batch Cost</th><th className="minimal-th w-10"></th></tr></thead>
                                                <tbody>{form.factory_oh.map((r: any, i: number) => (
                                                    <tr key={i}><td className="minimal-td"><input value={r.name} onChange={e=>updateRow('factory_oh', i, 'name', e.target.value)} className="input-table font-thai"/></td><td className="minimal-td text-right"><input type="number" value={r.cost} onChange={e=>updateRow('factory_oh', i, 'cost', e.target.value)} className="input-table text-right font-black"/></td><td className="minimal-td text-center"><button onClick={()=>removeRow('factory_oh', i)} className="text-slate-200 hover:text-rose-500"><Trash2 size={14}/></button></td></tr>
                                                ))}</tbody>
                                            </table>
                                            <button onClick={()=>addRow('factory_oh')} className="text-[10px] font-black uppercase text-[#ab8a3b] flex items-center gap-1"><Plus size={14}/> Add OH</button>
                                        </div>
                                        <div className="bg-white rounded-2xl border border-black/5 shadow-sm p-6">
                                            <h4 className="text-xs font-black text-[#111f42] uppercase tracking-widest flex items-center gap-2 border-b pb-3 mb-4"><Building size={16} className="text-slate-400"/> 3.2 Office OH (Prod. Support)</h4>
                                            <table className="w-full text-left font-mono text-[11px] mb-4">
                                                <thead><tr><th className="minimal-th w-auto">Item Name</th><th className="minimal-th w-32 text-right">Batch Cost</th><th className="minimal-th w-10"></th></tr></thead>
                                                <tbody>{form.office_oh.map((r: any, i: number) => (
                                                    <tr key={i}><td className="minimal-td"><input value={r.name} onChange={e=>updateRow('office_oh', i, 'name', e.target.value)} className="input-table font-thai"/></td><td className="minimal-td text-right"><input type="number" value={r.cost} onChange={e=>updateRow('office_oh', i, 'cost', e.target.value)} className="input-table text-right font-black"/></td><td className="minimal-td text-center"><button onClick={()=>removeRow('office_oh', i)} className="text-slate-200 hover:text-rose-500"><Trash2 size={14}/></button></td></tr>
                                                ))}</tbody>
                                            </table>
                                            <button onClick={()=>addRow('office_oh')} className="text-[10px] font-black uppercase text-[#ab8a3b] flex items-center gap-1"><Plus size={14}/> Add Support Cost</button>
                                        </div>
                                        <div className="bg-white rounded-2xl border border-black/5 shadow-sm p-6">
                                            <h4 className="text-xs font-black text-[#111f42] uppercase tracking-widest flex items-center gap-2 border-b pb-3 mb-4"><Droplets size={16} className="text-blue-500"/> 3.3 Utilities & Power (Direct)</h4>
                                            <table className="w-full text-left font-mono text-[11px] mb-4">
                                                <thead><tr><th className="minimal-th w-auto">Resource</th><th className="minimal-th w-32 text-right">Batch Cost</th><th className="minimal-th w-10"></th></tr></thead>
                                                <tbody>{form.utilities.map((r: any, i: number) => (
                                                    <tr key={i}><td className="minimal-td"><input value={r.name} onChange={e=>updateRow('utilities', i, 'name', e.target.value)} className="input-table font-thai"/></td><td className="minimal-td text-right"><input type="number" value={r.cost} onChange={e=>updateRow('utilities', i, 'cost', e.target.value)} className="input-table text-right font-black"/></td><td className="minimal-td text-center"><button onClick={()=>removeRow('utilities', i)} className="text-slate-200 hover:text-rose-500"><Trash2 size={14}/></button></td></tr>
                                                ))}</tbody>
                                            </table>
                                            <button onClick={()=>addRow('utilities')} className="text-[10px] font-black uppercase text-[#ab8a3b] flex items-center gap-1"><Plus size={14}/> Add Utility</button>
                                        </div>
                                        <div className="bg-white rounded-2xl border border-black/5 shadow-sm p-6">
                                            <h4 className="text-xs font-black text-[#111f42] uppercase tracking-widest flex items-center gap-2 border-b pb-3 mb-4"><Gauge size={16} className="text-slate-500"/> 3.4 Machine Depreciation</h4>
                                            <table className="w-full text-left font-mono text-[11px] mb-4">
                                                <thead><tr><th className="minimal-th w-auto">Asset Name</th><th className="minimal-th w-32 text-right">Batch Amort.</th><th className="minimal-th w-10"></th></tr></thead>
                                                <tbody>{form.depreciation.map((r: any, i: number) => (
                                                    <tr key={i}><td className="minimal-td"><input value={r.name} onChange={e=>updateRow('depreciation', i, 'name', e.target.value)} className="input-table font-thai"/></td><td className="minimal-td text-right"><input type="number" value={r.cost} onChange={e=>updateRow('depreciation', i, 'cost', e.target.value)} className="input-table text-right font-black"/></td><td className="minimal-td text-center"><button onClick={()=>removeRow('depreciation', i)} className="text-slate-200 hover:text-rose-500"><Trash2 size={14}/></button></td></tr>
                                                ))}</tbody>
                                            </table>
                                            <button onClick={()=>addRow('depreciation')} className="text-[10px] font-black uppercase text-[#ab8a3b] flex items-center gap-1"><Plus size={14}/> Add Asset</button>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {bomTab === 'periodCost' && (
                                <div className="space-y-8 animate-fade-in-up">
                                    <div className="bg-white rounded-2xl border border-black/5 shadow-sm p-6">
                                        <h4 className="text-xs font-black text-[#111f42] uppercase tracking-widest flex items-center gap-2 border-b pb-3 mb-4"><ShoppingBag size={16} className="text-[#E3624A]"/> 4. Selling Expenses (ค่าใช้จ่ายการขาย)</h4>
                                        <table className="w-full text-left font-mono text-[11px] mb-4">
                                            <thead><tr><th className="minimal-th w-24">Acc Code</th><th className="minimal-th w-48">Type</th><th className="minimal-th w-auto">Description</th><th className="minimal-th w-40 text-right">Cost (฿)</th><th className="minimal-th w-10"></th></tr></thead>
                                            <tbody>{form.selling.map((r: any, i: number) => (
                                                <tr key={i}><td className="minimal-td text-slate-400">{getAccCode('selling', r)}</td><td className="minimal-td"><select value={r.subType} onChange={e=>updateRow('selling', i, 'subType', e.target.value)} className="input-table text-[10px] font-bold"><option value="">-- เลือก --</option><option value="4.1 ก่อนขาย">4.1 ก่อนขาย</option><option value="4.2 ระหว่างขาย">4.2 ระหว่างขาย</option></select></td><td className="minimal-td"><input value={r.name} onChange={e=>updateRow('selling', i, 'name', e.target.value)} className="input-table font-thai"/></td><td className="minimal-td text-right"><input type="number" value={r.cost} onChange={e=>updateRow('selling', i, 'cost', e.target.value)} className="input-table text-right font-black"/></td><td className="minimal-td text-center"><button onClick={()=>removeRow('selling', i)} className="text-slate-200 hover:text-rose-500 transition-colors"><Trash2 size={14}/></button></td></tr>
                                            ))}</tbody>
                                        </table>
                                        <button onClick={()=>addRow('selling')} className="text-[10px] font-black uppercase text-[#ab8a3b] flex items-center gap-1 hover:brightness-110 transition-all"><Plus size={14}/> Add Row</button>
                                    </div>
                                    <div className="bg-white rounded-2xl border border-black/5 shadow-sm p-6">
                                        <h4 className="text-xs font-black text-[#111f42] uppercase tracking-widest flex items-center gap-2 border-b pb-3 mb-4"><Briefcase size={16} className="text-[#3981BF]"/> 5. Admin Expenses (ค่าใช้จ่ายบริหาร)</h4>
                                        <table className="w-full text-left font-mono text-[11px] mb-4">
                                            <thead><tr><th className="minimal-th w-24">Acc Code</th><th className="minimal-th w-48">Type</th><th className="minimal-th w-auto">Description</th><th className="minimal-th w-40 text-right">Cost (฿)</th><th className="minimal-th w-10"></th></tr></thead>
                                            <tbody>{form.admin.map((r: any, i: number) => (
                                                <tr key={i}><td className="minimal-td text-slate-400">{getAccCode('admin', r)}</td><td className="minimal-td"><select value={r.subType} onChange={e=>updateRow('admin', i, 'subType', e.target.value)} className="input-table text-[10px] font-bold"><option value="">-- เลือก --</option><option value="5.1 บุคลากร">5.1 บุคลากร</option><option value="5.2 สำนักงาน">5.2 สำนักงาน</option></select></td><td className="minimal-td"><input value={r.name} onChange={e=>updateRow('admin', i, 'name', e.target.value)} className="input-table font-thai"/></td><td className="minimal-td text-right"><input type="number" value={r.cost} onChange={e=>updateRow('admin', i, 'cost', e.target.value)} className="input-table text-right font-black"/></td><td className="minimal-td text-center"><button onClick={()=>removeRow('admin', i)} className="text-slate-200 hover:text-rose-500 transition-colors"><Trash2 size={14}/></button></td></tr>
                                            ))}</tbody>
                                        </table>
                                        <button onClick={()=>addRow('admin')} className="text-[10px] font-black uppercase text-[#ab8a3b] flex items-center gap-1 hover:brightness-110 transition-all"><Plus size={14}/> Add Row</button>
                                    </div>
                                    <div className="bg-white rounded-2xl border border-black/5 shadow-sm p-6">
                                        <h4 className="text-xs font-black text-[#111f42] uppercase tracking-widest flex items-center gap-2 border-b pb-3 mb-4"><Settings2 size={16} className="text-slate-400"/> 6. อื่นๆ (Extra Costs)</h4>
                                        <table className="w-full text-left font-mono text-[11px] mb-4">
                                            <thead><tr><th className="minimal-th w-24">Acc Code</th><th className="minimal-th w-auto">Description</th><th className="minimal-th w-40 text-right">Batch Cost (฿)</th><th className="minimal-th w-10"></th></tr></thead>
                                            <tbody>{form.others.map((r: any, i: number) => (
                                                <tr key={i}><td className="minimal-td text-slate-400">{getAccCode('others', r)}</td><td className="minimal-td"><input value={r.name} onChange={e=>updateRow('others', i, 'name', e.target.value)} className="input-table font-thai" placeholder="เช่น ค่าจ้างผลิตภายนอก, ค่าวิจัย"/></td><td className="minimal-td text-right"><input type="number" value={r.cost} onChange={e=>updateRow('others', i, 'cost', e.target.value)} className="input-table text-right font-black"/></td><td className="minimal-td text-center"><button onClick={()=>removeRow('others', i)} className="text-slate-200 hover:text-rose-500 transition-colors"><Trash2 size={14}/></button></td></tr>
                                            ))}</tbody>
                                        </table>
                                        <button onClick={()=>addRow('others')} className="text-[10px] font-black uppercase text-[#ab8a3b] flex items-center gap-1 hover:brightness-110 transition-all"><Plus size={14}/> Add Extra Cost</button>
                                    </div>
                                </div>
                            )}

                            {bomTab === 'summary' && (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 animate-fade-in-up font-mono">
                                    <div className="space-y-6">
                                        <div className="bg-white p-8 rounded-3xl border border-black/5 shadow-sm space-y-6">
                                            <h4 className="font-black text-xs uppercase tracking-widest text-slate-400 border-b pb-3">Profitability Analysis</h4>
                                            <div className="grid grid-cols-2 gap-4">
                                                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                                                    <span className="text-[8px] font-black text-slate-400 uppercase block mb-1">Profit / Unit</span>
                                                    <span className="text-xl font-black text-[#111f42]">฿{totals.profitPerUnit.toLocaleString(undefined, {minimumFractionDigits: 2})}</span>
                                                </div>
                                                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                                                    <span className="text-[8px] font-black text-slate-400 uppercase block mb-1">Net Margin %</span>
                                                    <span className="text-xl font-black text-[#10b981]">{totals.marginPct.toFixed(2)}%</span>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="bg-white p-8 rounded-3xl border border-black/5 shadow-sm space-y-6">
                                            <h4 className="font-black text-xs uppercase tracking-widest text-slate-400 border-b pb-3">BOM Structure Summary</h4>
                                            <div className="space-y-3 text-sm">
                                                <div className="flex justify-between"><span>Product Cost (A)</span><span className="font-black">฿{totals.productA.toLocaleString(undefined, {minimumFractionDigits: 2})}</span></div>
                                                <div className="flex justify-between"><span>Period Cost (B)</span><span className="font-black">฿{totals.periodB.toLocaleString(undefined, {minimumFractionDigits: 2})}</span></div>
                                                <div className="pt-2 border-t flex justify-between font-black text-[#111f42]"><span>Grand Total Unit Cost</span><span>฿{totals.total.toLocaleString(undefined, {minimumFractionDigits: 2})}</span></div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="bg-[#111f42] p-8 rounded-[32px] text-white relative overflow-hidden shadow-xl flex flex-col justify-center">
                                        <div className="absolute right-[-20px] top-[-20px] opacity-10 transform rotate-12"><Coins size={150}/></div>
                                        <label className="text-[10px] font-black uppercase tracking-[0.3em] text-[#ab8a3b]">Suggested Selling Price</label>
                                        <div className="text-6xl font-black font-mono tracking-tighter my-6 leading-none">฿{totals.suggested.toLocaleString()}</div>
                                        <div className="mt-4 flex items-center gap-4 bg-white/10 p-4 rounded-2xl border border-white/10">
                                            <label className="text-[10px] font-black uppercase text-white/50 whitespace-nowrap"><Target size={14} className="inline mr-1" /> Target Margin %</label>
                                            <input type="number" value={form.targetMargin} onChange={e=>setForm({...form, targetMargin: Number(e.target.value)})} className="bg-transparent font-black text-2xl outline-none w-full text-right"/>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>

                        <div className="p-8 border-t bg-white flex justify-end gap-3 shrink-0 font-mono">
                            <button onClick={() => {setShowBOMModal(false); setShowCreateModal(false);}} className="px-8 py-3 text-slate-400 font-black uppercase text-[10px] hover:text-[#111f42] transition-colors">Discard</button>
                            <button onClick={saveBOM} className="px-12 py-3 bg-[#111f42] text-[#ab8a3b] rounded-2xl font-black uppercase text-[11px] shadow-lg hover:scale-[1.02] transition-transform flex items-center gap-2"><Save size={16}/> Finalize & Save BOM</button>
                        </div>
                    </div>
                </div>
            )}

            {/* USER GUIDE DRAWER */}
            {isGuideOpen && (
                <div className="fixed inset-0 z-[500] flex justify-end animate-in fade-in duration-300 font-thai">
                    <div className="absolute inset-0 bg-[#111f42]/40 backdrop-blur-sm" onClick={() => setIsGuideOpen(false)} />
                    <div className="relative w-full max-w-lg bg-white h-full shadow-2xl flex flex-col animate-in slide-in-from-right duration-500">
                        <div className="bg-[#111f42] px-8 py-6 flex justify-between items-center text-white border-b-4 border-[#ab8a3b]">
                            <div className="flex items-center gap-3"><HelpCircle size={22} className="text-[#ab8a3b]" /><h3 className="text-lg font-black uppercase tracking-widest">คู่มือการใช้งานระบบต้นทุน</h3></div>
                            <button onClick={() => setIsGuideOpen(false)} className="p-2 hover:bg-white/10 rounded-xl transition-all"><X size={20} /></button>
                        </div>
                        <div className="flex-1 overflow-y-auto p-8 space-y-10 text-slate-600 leading-relaxed">
                            <section>
                                <h4 className="font-black text-[#111f42] border-b pb-2 mb-4 flex items-center gap-2 text-[14px]">
                                    <span className="bg-[#ab8a3b] text-[#111f42] font-mono w-6 h-6 rounded-full flex items-center justify-center text-[12px]">01</span>
                                    โครงสร้างต้นทุนมาตรฐาน (Standard Cost Structure)
                                </h4>
                                <p className="text-[13px]">ระบบแบ่งโครงสร้างต้นทุนออกเป็น 2 ส่วนหลักเพื่อความแม่นยำในการวิเคราะห์กำไร (Profitability Analysis):</p>
                                <ul className="list-disc ml-5 mt-2 text-[12px] space-y-2">
                                    <li><b>Part A: Product Cost (ต้นทุนผลิตภัณฑ์)</b> คือต้นทุนที่เกี่ยวข้องกับการผลิตโดยตรง ประกอบด้วย Direct Material (วัตถุดิบ), Direct Labor (ค่าแรงทางตรง) และ Manufacturing Overheads (โสหุ้ยการผลิต) ซึ่งจะถูกปันส่วนตาม Batch Size</li>
                                    <li><b>Part B: Period Cost (ต้นทุนตามงวดเวลา)</b> คือค่าใช้จ่ายในการขายและบริหาร (SG&A) รวมถึงค่าใช้จ่ายพิเศษอื่นๆ (Extra Costs) ที่เกิดขึ้นเพื่อสนับสนุนการดำเนินงาน</li>
                                </ul>
                            </section>

                            <section>
                                <h4 className="font-black text-[#111f42] border-b pb-2 mb-4 flex items-center gap-2 text-[14px]">
                                    <span className="bg-[#ab8a3b] text-[#111f42] font-mono w-6 h-6 rounded-full flex items-center justify-center text-[12px]">02</span>
                                    การปันส่วนต้นทุนด้วย Batch Size (Cost Amortization)
                                </h4>
                                <div className="space-y-3 text-[12px]">
                                    <p><b>• Batch Size Amortization:</b> ระบบจะนำค่าใช้จ่ายที่เป็นก้อนใหญ่ (Batch Costs) เช่น ค่าไฟโรงงาน, ค่าเสื่อมราคาเครื่องจักร หรือค่าจ้างผลิตภายนอก มาหารด้วยจำนวนชิ้นที่ผลิตในล็อตนั้นๆ เพื่อหาต้นทุนต่อหน่วย (Unit Cost) ที่แท้จริง</p>
                                    <p><b>• 3.3 Power & Utilities:</b> บันทึกค่าพลังงานที่ใช้สำหรับเครื่องจักรเฉพาะตัว เพื่อความแม่นยำในการคำนวณต้นทุนพลังงานต่อหน่วย</p>
                                    <p><b>• 3.4 Machine Depreciation:</b> การปันส่วนค่าเสื่อมราคาช่วยให้บริษัททราบถึงต้นทุนแฝงจากการใช้สินทรัพย์ถาวรในการผลิต</p>
                                </div>
                            </section>

                            <section>
                                <h4 className="font-black text-[#111f42] border-b pb-2 mb-4 flex items-center gap-2 text-[14px]">
                                    <span className="bg-[#ab8a3b] text-[#111f42] font-mono w-6 h-6 rounded-full flex items-center justify-center text-[12px]">03</span>
                                    การวิเคราะห์กำไรและตั้งราคา (Profitability & Pricing)
                                </h4>
                                <p className="text-[13px]">
                                    ในส่วนของ <b>Summary</b> ระบบจะคำนวณราคาขายแนะนำ (Suggested Price) ตาม <b>Target Margin %</b> ที่คุณกำหนด โดยจะแสดงผลลัพธ์เป็น:
                                </p>
                                <ul className="list-disc ml-5 mt-2 text-[12px] space-y-1">
                                    <li><b>Profit / Unit:</b> กำไรสุทธิเป็นตัวเงินต่อหนึ่งหน่วยสินค้า</li>
                                    <li><b>Net Margin %:</b> อัตรากำไรสุทธิเทียบกับราคาขาย เพื่อใช้เปรียบเทียบประสิทธิภาพการทำกำไรระหว่างสินค้าแต่ละประเภท</li>
                                </ul>
                            </section>
                            
                            <div className="p-6 bg-slate-50 border border-slate-100 rounded-2xl italic text-[11px] text-slate-400">
                                * การคำนวณต้นทุนที่แม่นยำช่วยให้บริษัทสามารถแข่งขันได้ในระยะยาวและรักษาเสถียรภาพทางการเงิน
                            </div>
                        </div>
                        <div className="p-6 border-t bg-white flex justify-end">
                            <button onClick={() => setIsGuideOpen(false)} className="px-8 py-3 bg-[#111f42] text-white rounded-xl font-black text-[10px] uppercase shadow-lg hover:brightness-110 transition-all">ปิดคู่มือ</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

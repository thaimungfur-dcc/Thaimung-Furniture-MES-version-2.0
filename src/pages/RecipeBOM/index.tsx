import React, { useState, useEffect, useMemo, useRef } from 'react';
import { 
    Layers, Settings, List, BarChart2, Database, Box, Leaf, 
    PlusCircle, CheckCircle, Circle, Tag, AlertOctagon, RotateCcw, 
    CheckCircle2, X, Pencil, Trash2, Search, UploadCloud, Plus, 
    ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, Eye, Check, 
    HelpCircle, Info, RefreshCw, FileText, Settings2, DollarSign, Clock, 
    Cpu, CornerDownRight, ChevronDown, Edit3, Save
} from 'lucide-react';
import Chart from 'chart.js/auto';
import { CsvUploadModal } from '../../components/shared/CsvUploadModal';
import { PageHeader } from '../../components/shared/PageHeader';
import { KpiCard } from '../../components/shared/KpiCard';
import BomListTable from './components/BomListTable';
import { DraggableWrapper } from "../../components/shared/DraggableWrapper";

export default function BOMManagementApp() {
    // --- State Management ---
    const [activeTab, setActiveTab] = useState('list');
    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState('All');
    const [showModal, setShowModal] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [showUploadModal, setShowUploadModal] = useState(false);
    const [isGuideOpen, setIsGuideOpen] = useState(false);

    // Data States
    const [products, setProducts] = useState<any[]>([]);
    const [materialDb, setMaterialDb] = useState<any[]>([]);
    const [itemMasterFG, setItemMasterFG] = useState<any[]>([]); 
    const [selectedProduct, setSelectedProduct] = useState<any>(null);
    const [bomItems, setBomItems] = useState<any[]>([]);
    const [newItem, setNewItem] = useState({ code: '', name: '', qty: 1, scrap: 0, type: '', unit: '', cost: 0 });

    const fileInputRef = useRef(null);

    // Initial Data Fetch
    useEffect(() => {
        setItemMasterFG([
            { itemCode: 'FG-LD-001', itemName: 'ราวตากผ้าสแตนเลส (รุ่นพับได้)', category: 'Laundry', stdPrice: 1200 },
            { itemCode: 'FG-LD-002', itemName: 'ราวแขวนผ้าบาร์คู่ (ล้อเลื่อน)', category: 'Laundry', stdPrice: 950 },
            { itemCode: 'FG-BD-101', itemName: 'โครงเตียงไม้สัก 6 ฟุต', category: 'Bedroom', stdPrice: 18500 },
            { itemCode: 'FG-SF-505', itemName: 'โซฟาผ้า 3 ที่นั่ง', category: 'Living', stdPrice: 12900 }
        ]);

        setMaterialDb([
            { code: 'MT-SS304-01', name: 'ท่อสแตนเลส 304 (1 นิ้ว)', type: 'RM', unit: 'M', cost: 150 },
            { code: 'MT-WOOD-01', name: 'ไม้สักแปรรูป 2x4', type: 'RM', unit: 'Ft', cost: 450 },
            { code: 'FB-HEAT-01', name: 'ผ้าสะท้อนความร้อน', type: 'RM', unit: 'Yard', cost: 120 },
            { code: 'WIP-FRAME-01', name: 'โครงเชื่อมสำเร็จ', type: 'WIP', unit: 'Set', cost: 850 }
        ]);

        setProducts([
            { id: 'FG-LD-001', name: 'ราวตากผ้าสแตนเลส (รุ่นพับได้)', category: 'Laundry', subCategory: 'Steel', version: 'V.1.0', cost: 1250.00, stdPrice: 2400, status: 'Active', 
                items: [
                    { code: 'WIP-FRAME-01', name: 'โครงเชื่อมสำเร็จ', type: 'WIP', qty: 1, unit: 'Set', cost: 850, scrap: 0 },
                    { code: 'MT-SS304-01', name: 'ท่อสแตนเลส 304 (1 นิ้ว)', type: 'RM', qty: 2.5, unit: 'M', cost: 150, scrap: 5 }
                ]
            }
        ]);
    }, []);

    // Total Calculation Logic
    const totalBomCost = useMemo(() => {
        return bomItems.reduce((sum, item) => {
            const qty = Number(item.qty) || 0;
            const cost = Number(item.cost) || 0;
            const scrap = Number(item.scrap) || 0;
            return sum + (qty * cost * (1 + scrap / 100));
        }, 0);
    }, [bomItems]);

    const getStatusClass = (status: string) => {
        if (status === 'Active') return 'bg-emerald-50 text-emerald-600 border-emerald-100';
        if (status === 'Draft') return 'bg-slate-50 text-slate-400 border-slate-100';
        return 'bg-amber-50 text-amber-600 border-amber-100';
    };

    const closeModal = () => {
        setShowModal(false);
        setIsEditing(false);
        setSelectedProduct(null);
    };

    const openBomModal = (product: any = null) => {
        if (product) {
            setSelectedProduct(JSON.parse(JSON.stringify(product)));
            setBomItems(JSON.parse(JSON.stringify(product.items || []))?.map((i: any) => ({...i})));
            setIsEditing(false);
        } else {
            setSelectedProduct({ id: '', name: '', category: 'General', subCategory: '', version: 'V.1.0', status: 'Draft', stdPrice: 0, cost: 0 });
            setBomItems([]);
            setIsEditing(true);
        }
        setShowModal(true);
    };

    const handleProductSelect = (e: any) => {
        const item = itemMasterFG.find(i => i.itemCode === e.target.value);
        if (item) {
            setSelectedProduct({ ...selectedProduct, id: item.itemCode, name: item.itemName, category: item.category, stdPrice: item.stdPrice || 0 });
        }
    };

    const onMaterialSelect = (e: any) => {
        const mat = materialDb.find(m => m.code === e.target.value);
        if (mat) {
            setNewItem({ ...newItem, code: mat.code, name: mat.name, type: mat.type, unit: mat.unit, cost: mat.cost });
        } else {
            setNewItem({ code: '', name: '', qty: 1, scrap: 0, type: '', unit: '', cost: 0 });
        }
    };

    const addBomItem = () => {
        if (!newItem.code) return;
        setBomItems([...bomItems, { ...newItem }]);
        setNewItem({ code: '', name: '', qty: 1, scrap: 0, type: '', unit: '', cost: 0 });
    };

    const removeBomItem = (index: number) => {
        const newItems = [...bomItems];
        newItems.splice(index, 1);
        setBomItems(newItems);
    };

    const saveBOM = () => {
        if (!selectedProduct?.id) { alert("โปรดเลือกรหัสสินค้า"); return; }
        const updatedProducts = [...products];
        const idx = updatedProducts.findIndex(p => p.id === selectedProduct.id);
        const dataToSave = { ...selectedProduct, items: bomItems, cost: totalBomCost };

        if (idx !== -1) updatedProducts[idx] = dataToSave;
        else updatedProducts.unshift(dataToSave);

        setProducts(updatedProducts);
        closeModal();
        alert('บันทึกโครงสร้างสูตรการผลิตเรียบร้อยแล้ว');
    };

    const filteredProducts = useMemo(() => {
        let res = products;
        if (statusFilter !== 'All') res = res.filter(p => p.status === statusFilter);
        if (searchQuery) {
            const q = searchQuery.toLowerCase();
            res = res.filter(p => p.id.toLowerCase().includes(q) || p.name.toLowerCase().includes(q));
        }
        return res;
    }, [products, statusFilter, searchQuery]);

    return (
        <>
            <style>{`
                .master-custom-scrollbar::-webkit-scrollbar { width: 6px; height: 6px; }
                .master-custom-scrollbar::-webkit-scrollbar-thumb { background: #CBD5E1; border-radius: 3px; }
                
                .minimal-th {
                    font-size: 11px; text-transform: uppercase; letter-spacing: 0.1em; color: #FFFFFF; 
                    padding: 16px 12px; font-weight: 800; background-color: #111f42; border-bottom: 2px solid #ab8a3b;
                    white-space: nowrap;
                }
                .minimal-td { padding: 12px 12px; vertical-align: middle; color: #111f42; font-size: 12px; font-weight: 500; border-bottom: 1px solid rgba(226, 232, 240, 0.6); }
                tr:hover .minimal-td { background-color: rgba(171, 138, 59, 0.05); }

                .modal-overlay { position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(17, 31, 66, 0.6); backdrop-filter: blur(4px); z-index: 10001; display: flex; justify-content: center; align-items: center; padding: 1rem; }
                .modal-box { background: #F9F7F6; width: 100%; max-height: 90vh; box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25); overflow: hidden; display: flex; flex-direction: column; }
                
                .input-primary { width: 100%; background: white; border: 1px solid #E2E8F0; border-radius: 0.5rem; padding: 8px 12px; font-size: 13px; color: #111f42; outline: none; transition: border 0.2s; }
                .input-primary:focus { border-color: #ab8a3b; box-shadow: 0 0 0 2px rgba(171, 138, 59, 0.1); }
                
                .filter-btn { border-radius: 0.5rem; font-size: 0.75rem; font-weight: 700; transition: all 0.3s; white-space: nowrap; border: 1px solid transparent; }
                .filter-btn.active { background-color: #111f42; color: #FFFFFF; }
                .badge { display: inline-flex; align-items: center; padding: 0.15rem 0.6rem; border-radius: 6px; font-weight: 700; font-size: 10px; border: 1px solid transparent; text-transform: uppercase; }
            `}</style>

            <div className="flex flex-col w-full pb-10">
                {/* Header Section */}
                <PageHeader
                    title="BOM MANAGEMENT"
                    subtitle="ระบบจัดการสูตรการผลิตและโครงสร้างสินค้า"
                    icon={Layers}
                    rightContent={
                        <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto">
                            <div className="flex bg-[#e2e8f0] p-1 border border-slate-200 shadow-inner w-full md:w-fit flex-shrink-0 rounded-xl overflow-hidden">
                                <button onClick={() => setActiveTab('list')} className={`px-6 py-2.5 text-xs font-bold transition-all flex items-center gap-2 whitespace-nowrap uppercase tracking-wide rounded-lg ${activeTab === 'list' ? 'bg-[#ab8a3b] text-white shadow-md' : 'text-slate-500 hover:bg-slate-50'}`}>
                                    <List size={14} /> PRODUCT LIST
                                </button>
                                <button onClick={() => setActiveTab('analytics')} className={`px-6 py-2.5 text-xs font-bold transition-all flex items-center gap-2 whitespace-nowrap uppercase tracking-wide rounded-lg ${activeTab === 'analytics' ? 'bg-[#ab8a3b] text-white shadow-md' : 'text-slate-500 hover:bg-slate-50'}`}>
                                    <BarChart2 size={14} /> ANALYTICS
                                </button>
                            </div>
                            <button onClick={() => setIsGuideOpen(true)} className="p-2.5 transition-all rounded-xl bg-white text-slate-400 hover:bg-[#111f42] hover:text-white border border-slate-200 shadow-sm">
                                <HelpCircle size={20} />
                            </button>
                        </div>
                    }
                />

                <main className="relative z-10 flex flex-col gap-4">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                        <KpiCard title="Total Products" value={products.length} color="#111f42" icon={Box} subValue="FG with BOM Records" />
                        <KpiCard title="Active Formula" value={products.filter(p=>p.status==='Active').length} color="#ab8a3b" icon={CheckCircle} subValue="Ready for Production" />
                        <KpiCard title="Avg Cost / Set" value="฿4,250" color="#10b981" icon={DollarSign} subValue="Current Production Avg" />
                        <KpiCard title="Pending Review" value={products.filter(p=>p.status==='Draft').length} color="#E3624A" icon={Clock} subValue="Draft or Pending" />
                    </div>

                    <div className="bg-white border border-slate-200 flex flex-col min-h-[600px] w-full">
                        <div className="px-6 py-4 border-b border-slate-100 flex flex-col lg:flex-row items-center justify-between gap-4 bg-slate-50/50">
                            <div className="flex flex-1 items-center gap-3 w-full lg:w-auto overflow-x-auto no-scrollbar">
                                <div className="flex items-center gap-1 p-1 bg-white rounded-lg border border-slate-200 shadow-sm shrink-0">
                                    {['All', 'Active', 'Draft', 'Review']?.map(s => (
                                        <button key={s} onClick={() => setStatusFilter(s)} 
                                            className={`filter-btn flex items-center gap-2 px-3 py-1.5 text-[11px] transition-all duration-200 ${statusFilter === s ? 'active' : 'hover:bg-slate-50'}`}>
                                            <span>{s}</span>
                                            <span className={`text-[10px] font-black ${statusFilter === s ? 'text-white/70' : 'text-slate-400'}`}>
                                                {s === 'All' ? products.length : products.filter(p => p.status === s).length}
                                            </span>
                                        </button>
                                    ))}
                                </div>
                                <div className="h-6 w-px bg-slate-200 mx-1 hidden lg:block"></div>
                                <div className="relative w-full lg:w-64">
                                    <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                                    <input type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="Search Product..." className="input-primary pl-9 pr-4 py-2 text-[12px]" />
                                </div>
                            </div>
                            <div className="flex gap-2">
                                <button onClick={() => setShowUploadModal(true)} className="px-5 py-2.5 rounded-xl text-[12px] font-bold bg-slate-100 text-slate-600 hover:bg-slate-200 flex items-center gap-2 uppercase tracking-wide">
                                    <UploadCloud size={16} /> Upload
                                </button>
                                <button onClick={() => openBomModal()} className="px-5 py-2.5 rounded-xl text-[12px] font-bold bg-[#111f42] text-white shadow-md flex items-center gap-2 uppercase tracking-wide">
                                    <Plus size={16} className="text-[#ab8a3b]" /> NEW BOM
                                </button>
                            </div>
                        </div>

                        <div className="w-full">
                            <BomListTable 
                                data={filteredProducts} 
                                onManageBom={openBomModal} 
                                getStatusClass={getStatusClass} 
                            />
                        </div>
                    </div>
                </main>

                {/* MODAL: BOM EDITOR */}
                {showModal && (
                    <div className="modal-overlay" onClick={closeModal}>
                        
                        <DraggableWrapper>
                              <div className="modal-box max-w-[1200px] border-t-[6px] border-[#ab8a3b] rounded-2xl animate-fade-in-up" onClick={e => e.stopPropagation()}>
                                                    <div className="bg-[#111f42] px-8 py-5 flex justify-between items-center text-white shrink-0">
                                                        <div className="flex items-center gap-4">
                                                            <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center text-[#ab8a3b] shadow-inner"><Layers size={24} /></div>
                                                            <div>
                                                                <h3 className="text-xl font-black uppercase tracking-widest">{selectedProduct?.id ? selectedProduct.name : 'Create New BOM'}</h3>
                                                                <p className="text-[10px] font-bold text-slate-400 mt-1 uppercase tracking-widest font-mono">Bill of Materials Configuration</p>
                                                            </div>
                                                        </div>
                                                        <button onClick={closeModal} className="p-1.5 bg-white/10 rounded-lg hover:bg-white/20 transition-all"><X size={24} /></button>
                                                    </div>

                                                    {/* Header Info Bar */}
                                                    <div className="px-8 py-5 bg-white border-b border-slate-100 flex justify-between items-end gap-8 relative overflow-hidden shrink-0">
                                                        <div className="absolute right-[-20px] bottom-[-20px] opacity-[0.03] transform -rotate-12 pointer-events-none"><Layers size={200}/></div>
                                                        <div className="flex-1 grid grid-cols-2 md:grid-cols-4 gap-6 relative z-10">
                                                            <div className="space-y-1.5">
                                                                <label className="block text-[9px] font-black text-slate-400 uppercase tracking-widest font-mono">Product SKU</label>
                                                                {selectedProduct.id === '' ? (
                                                                    <select onChange={handleProductSelect} className="input-primary py-1.5 font-bold border-[#ab8a3b]/30">
                                                                        <option value="">-- Choose FG Item --</option>
                                                                        {itemMasterFG?.map(i => <option key={i.itemCode} value={i.itemCode}>{i.itemCode} - {i.itemName}</option>)}
                                                                    </select>
                                                                ) : (
                                                                    <div className="h-9 flex items-center font-mono font-black text-[#ab8a3b] text-[15px]">{selectedProduct.id}</div>
                                                                )}
                                                            </div>
                                                            <div className="space-y-1.5">
                                                                <label className="block text-[9px] font-black text-slate-400 uppercase tracking-widest font-mono">Category</label>
                                                                <div className="h-9 flex items-center font-bold text-[#111f42] text-[13px] uppercase">{selectedProduct.category}</div>
                                                            </div>
                                                            <div className="space-y-1.5">
                                                                <label className="block text-[9px] font-black text-slate-400 uppercase tracking-widest font-mono">BOM Version</label>
                                                                <div className="h-9 flex items-center font-mono font-black text-[#111f42] text-[13px]">{selectedProduct.version}</div>
                                                            </div>
                                                            <div className="space-y-1.5">
                                                                <label className="block text-[9px] font-black text-[#E3624A] uppercase tracking-widest flex items-center gap-1.5 font-mono"><DollarSign size={10}/> Selling Price (฿)</label>
                                                                <input type="number" disabled={!isEditing} value={selectedProduct.stdPrice || 0} onChange={e=>setSelectedProduct({...selectedProduct, stdPrice: Number(e.target.value)})} className="input-primary py-1.5 font-black border-[#ab8a3b]/30 h-9" />
                                                            </div>
                                                        </div>
                                                        <div className="text-right shrink-0 border-l border-slate-100 pl-8 relative z-10">
                                                            <label className="block text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1 font-mono text-emerald-600">Total FG Cost</label>
                                                            <div className="text-3xl font-black text-[#10b981] font-mono tracking-tighter">฿{totalBomCost?.toLocaleString(undefined, {minimumFractionDigits: 2})}</div>
                                                        </div>
                                                    </div>

                                                    {/* BOM Data Table */}
                                                    <div className="flex-1 overflow-y-auto master-custom-scrollbar bg-[#F9F7F6] p-8">
                                                        <div className="bg-white rounded-none border border-slate-200 shadow-sm overflow-hidden mb-6">
                                                            <table className="w-full text-left table-fixed">
                                                                <thead>
                                                                    <tr className="bg-[#111f42]">
                                                                        <th className="minimal-th w-12 text-center text-[10px]">#</th>
                                                                        <th className="minimal-th w-auto text-[10px]">Component / Material</th>
                                                                        <th className="minimal-th w-24 text-center text-[10px]">Type</th>
                                                                        <th className="minimal-th w-28 text-right text-[10px]">Quantity</th>
                                                                        <th className="minimal-th w-20 text-center text-[10px]">Unit</th>
                                                                        <th className="minimal-th w-32 text-right text-[10px]">Std Cost</th>
                                                                        <th className="minimal-th w-20 text-center text-[10px]">Scrap%</th>
                                                                        <th className="minimal-th w-36 text-right text-[10px]">Total Cost</th>
                                                                        {isEditing && <th className="minimal-th w-16 text-center text-[10px]"></th>}
                                                                    </tr>
                                                                </thead>
                                                                <tbody>
                                                                    {bomItems?.map((item, idx) => {
                                                                        const lineTotal = Number(item.qty) * Number(item.cost) * (1 + (Number(item.scrap) || 0) / 100);
                                                                        return (
                                                                            <tr key={idx} className="hover:bg-slate-50 transition-colors border-b border-slate-50 last:border-0 font-mono">
                                                                                <td className="minimal-td text-center text-[10px] text-slate-300">{idx+1}</td>
                                                                                <td className="minimal-td truncate">
                                                                                    <div className="flex flex-col min-w-0">
                                                                                        <span className="font-black text-[11px] text-[#ab8a3b] truncate">{item.code}</span>
                                                                                        <span className="text-[11px] font-bold text-slate-600 truncate">{item.name}</span>
                                                                                    </div>
                                                                                </td>
                                                                                <td className="minimal-td text-center">
                                                                                    <span className={`text-[9px] font-black px-1.5 py-0.5 rounded ${item.type==='WIP'?'bg-blue-50 text-blue-500 border-blue-100':'bg-slate-100 text-slate-400'}`}>
                                                                                        {item.type}
                                                                                    </span>
                                                                                </td>
                                                                                <td className="minimal-td text-right">
                                                                                    {isEditing ? (
                                                                                        <input type="number" value={item.qty} onChange={e => {
                                                                                            const ni = [...bomItems];
                                                                                            ni[idx] = { ...ni[idx], qty: Number(e.target.value) || 0 };
                                                                                            setBomItems(ni);
                                                                                        }} className="input-primary text-right py-1 w-full font-black border-[#ab8a3b]/20" />
                                                                                    ) : (
                                                                                        <span className="font-black text-[#111f42]">{item.qty}</span>
                                                                                    )}
                                                                                </td>
                                                                                <td className="minimal-td text-center font-bold text-slate-400 uppercase">{item.unit}</td>
                                                                                <td className="minimal-td text-right">
                                                                                    {isEditing ? (
                                                                                        <input type="number" value={item.cost} onChange={e => {
                                                                                            const ni = [...bomItems];
                                                                                            ni[idx] = { ...ni[idx], cost: Number(e.target.value) || 0 };
                                                                                            setBomItems(ni);
                                                                                        }} className="input-primary text-right py-1 w-full font-bold text-emerald-600 border-[#ab8a3b]/20" />
                                                                                    ) : (
                                                                                        <span className="text-emerald-600 font-bold">฿{Number(item.cost)?.toLocaleString()}</span>
                                                                                    )}
                                                                                </td>
                                                                                <td className="minimal-td text-center">
                                                                                    {isEditing ? (
                                                                                        <input type="number" value={item.scrap} onChange={e => {
                                                                                            const ni = [...bomItems];
                                                                                            ni[idx] = { ...ni[idx], scrap: Number(e.target.value) || 0 };
                                                                                            setBomItems(ni);
                                                                                        }} className="input-primary text-center py-1 w-full text-amber-500 font-bold border-[#ab8a3b]/20" />
                                                                                    ) : (
                                                                                        <span className="font-bold text-amber-500">{item.scrap}%</span>
                                                                                    )}
                                                                                </td>
                                                                                <td className="minimal-td text-right font-black text-[#111f42] bg-slate-50/20">
                                                                                    ฿{lineTotal?.toLocaleString(undefined, {minimumFractionDigits: 2})}
                                                                                </td>
                                                                                {isEditing && (
                                                                                    <td className="minimal-td text-center">
                                                                                        <button onClick={() => removeBomItem(idx)} className="text-slate-300 hover:text-rose-500 transition-colors p-1"><Trash2 size={14}/></button>
                                                                                    </td>
                                                                                )}
                                                                            </tr>
                                                                        );
                                                                    })}

                                                                    {/* ADD ITEM ROW INTEGRATED IN TABLE */}
                                                                    {isEditing && (
                                                                        <tr className="bg-amber-50/40 border-t-2 border-[#ab8a3b]/30">
                                                                            <td className="minimal-td text-center text-amber-600"><Plus size={14}/></td>
                                                                            <td className="minimal-td">
                                                                                <select value={newItem.code} onChange={onMaterialSelect} className="input-primary py-1.5 font-bold border-[#ab8a3b]/40 h-10">
                                                                                    <option value="">-- Select Component --</option>
                                                                                    {materialDb?.map(m => <option key={m.code} value={m.code}>{m.code} - {m.name}</option>)}
                                                                                </select>
                                                                            </td>
                                                                            <td className="minimal-td text-center text-[10px] font-mono text-slate-400 uppercase">{newItem.type || '-'}</td>
                                                                            <td className="minimal-td"><input type="number" value={newItem.qty} onChange={e=>setNewItem({...newItem, qty: Number(e.target.value)})} className="input-primary text-right font-black h-10 border-[#ab8a3b]/40" placeholder="0" /></td>
                                                                            <td className="minimal-td text-center text-[10px] font-mono text-slate-400 uppercase font-bold">{newItem.unit || '-'}</td>
                                                                            <td className="minimal-td"><input type="number" value={newItem.cost} onChange={e=>setNewItem({...newItem, cost: Number(e.target.value)})} className="input-primary text-right font-bold text-emerald-600 h-10 border-[#ab8a3b]/40" placeholder="0.00" /></td>
                                                                            <td className="minimal-td"><input type="number" value={newItem.scrap} onChange={e=>setNewItem({...newItem, scrap: Number(e.target.value)})} className="input-primary text-center font-bold text-amber-500 h-10 border-[#ab8a3b]/40" placeholder="0" /></td>
                                                                            <td className="minimal-td text-right">
                                                                                <button 
                                                                                    onClick={addBomItem} 
                                                                                    disabled={!newItem.code}
                                                                                    className="w-full h-10 bg-[#111f42] text-[#ab8a3b] rounded-xl font-black text-[11px] uppercase tracking-widest shadow-md hover:brightness-110 disabled:opacity-50 transition-all flex items-center justify-center gap-2"
                                                                                >
                                                                                    <Plus size={14} strokeWidth={3}/> Add Item
                                                                                </button>
                                                                            </td>
                                                                            <td className="minimal-td"></td>
                                                                        </tr>
                                                                    )}
                                                                </tbody>
                                                            </table>
                                                        </div>
                                                    </div>

                                                    <div className="p-6 border-t bg-white flex justify-between items-center shrink-0">
                                                        <button onClick={() => setIsEditing(!isEditing)} className={`px-5 py-2.5 rounded-xl text-[11px] font-black uppercase transition-all flex items-center gap-2 ${isEditing ? 'bg-[#ab8a3b] text-[#111f42] shadow-md' : 'bg-slate-100 text-slate-500 hover:bg-slate-200'}`}>
                                                            {isEditing ? <CheckCircle size={16}/> : <Edit3 size={16}/>} {isEditing ? 'Confirm Structure' : 'Modify BOM'}
                                                        </button>
                                                        <div className="flex gap-3">
                                                            <button onClick={closeModal} className="px-6 py-3 text-slate-400 hover:text-slate-600 text-[11px] font-black uppercase transition-colors font-mono font-mono">Discard</button>
                                                            <button onClick={saveBOM} disabled={!isEditing} className={`px-10 py-3 rounded-xl font-black uppercase text-[11px] transition-all flex items-center gap-2 ${isEditing ? 'bg-[#111f42] text-[#ab8a3b] shadow-lg shadow-[#111f42]/20' : 'bg-slate-100 text-slate-300 cursor-not-allowed'}`}>
                                                                <Save size={16}/> Save BOM Structure
                                                            </button>
                                                        </div>
                                                    </div>
                                                </div>
                            </DraggableWrapper>

                    </div>
                )}

                {/* MODAL: UPLOAD */}
                <CsvUploadModal 
                    isOpen={showUploadModal}
                    onClose={() => setShowUploadModal(false)}
                    onConfirm={(data) => {
                        window.alert(`Simulating import of ${data.length} BOM records.`);
                        setShowUploadModal(false);
                    }}
                    expectedHeaders={['ParentCode', 'Component', 'Qty', 'Unit', 'Cost', 'Scrap']}
                    title="IMPORT BOM DATA"
                />

                {/* User Guide Drawer */}
                {isGuideOpen && (
                    <>
                        <div className="fixed inset-0 bg-[#111f42]/40 backdrop-blur-sm z-[100] animate-in fade-in duration-200" onClick={() => setIsGuideOpen(false)} />
                        <div className="fixed inset-y-0 right-0 w-full md:w-[450px] bg-white shadow-2xl z-[110] flex flex-col animate-in slide-in-from-right duration-300 font-sans">
                            <div className="px-6 py-5 flex justify-between items-center bg-[#111f42] text-white shrink-0 border-b-4 border-[#ab8a3b]">
                                <div className="flex items-center gap-2"><HelpCircle size={20} className="text-[#ab8a3b]" /><h2 className="text-base font-semibold uppercase tracking-widest font-mono">BOM Management Guide</h2></div>
                                <button onClick={() => setIsGuideOpen(false)} className="hover:bg-white/20 p-1.5 rounded-lg transition-colors"><X size={20} /></button>
                            </div>
                            <div className="flex-1 overflow-y-auto p-8 text-slate-700 space-y-8 text-[13px] leading-relaxed">
                                <section>
                                    <h4 className="font-black border-b pb-1 text-[#111f42] uppercase flex items-center gap-2 mb-3">1. การจัดการสูตร (BOM)</h4>
                                    <p>ใช้สำหรับสร้างโครงสร้างสินค้าโดยการเลือกวัตถุดิบและส่วนประกอบจากทะเบียนสินค้า</p>
                                </section>
                                <section>
                                    <h4 className="font-black border-b pb-1 text-[#111f42] uppercase flex items-center gap-2 mb-3">2. การคำนวณต้นทุน</h4>
                                    <p>ระบบจะคำนวณต้นทุนแต่ละแถวให้โดยอัตโนมัติ (Qty * Cost * Scrap%) และนำมารวมเป็นต้นทุนผลิตสินค้าด้านบน (Total FG Cost)</p>
                                </section>
                            </div>
                            <div className="p-4 border-t flex justify-end bg-slate-50"><button onClick={()=>setIsGuideOpen(false)} className="bg-[#111f42] text-white px-8 py-2.5 rounded-none font-bold text-[12px] uppercase tracking-wider shadow-md hover:bg-[#1e346b] transition-colors font-mono font-mono font-mono">ปิดคู่มือ</button></div>
                        </div>
                    </>
                )}
            </div>
        </>
    );
}

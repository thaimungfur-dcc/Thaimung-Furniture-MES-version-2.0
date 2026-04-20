import React, { useState, useEffect, useMemo } from 'react';
import { 
    Palette, LayoutGrid, List, BarChart2, Search, Plus, HelpCircle, X, Filter, ChevronDown
} from 'lucide-react';
import FabricGrid from './components/FabricGrid';
import FabricTable from './components/FabricTable';
import FabricDashboard from './components/FabricDashboard';
import FabricActionModal from './components/FabricActionModal';

export default function FabricDesignApp() {
    // State
    const [viewMode, setViewMode] = useState<'grid' | 'list' | 'dashboard'>('grid');
    const [searchQuery, setSearchQuery] = useState('');
    const [categoryFilter, setCategoryFilter] = useState('All');
    const [showModal, setShowModal] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [isConfigMode, setIsConfigMode] = useState(false); 
    const [isGuideOpen, setIsGuideOpen] = useState(false); 
    const [activeModalTab, setActiveModalTab] = useState('info');

    const [patterns, setPatterns] = useState<any[]>([]);
    const [fabricCategories, setFabricCategories] = useState(['Jacquard', 'Printed', 'Solid', 'Knitted', 'Embroidered']);
    const [newCategoryInput, setNewCategoryInput] = useState('');

    const [form, setForm] = useState<any>({
        id: null, code: '', name: '', category: 'Jacquard', 
        composition: '', width: '', weight: '', 
        colors: [], tags: '', application: '', image: null, status: 'Active', history: []
    });

    // Mock Data
    useEffect(() => {
        setPatterns([
            { id: 1, code: 'PTN-2026-001', name: 'Royal Flora Gold', category: 'Jacquard', composition: '100% Polyester', width: '58"', weight: '250 gsm', colors: ['#ab8a3b', '#111f42'], tags: 'Luxury, 2026', application: 'Sofa, Armchair', status: 'Active', image: 'https://v.etsystatic.com/video/upload/q_auto/Golden_Botanica_imtio0.jpg', history: [{date: '2026-01-10 09:00', action: 'Created Design', user: 'Admin'}] },
            { id: 2, code: 'PTN-2026-002', name: 'Minimalist Grid', category: 'Printed', composition: '100% Cotton', width: '44"', weight: '180 gsm', colors: ['#FFFFFF', '#000000'], tags: 'Modern, Minimal', application: 'Ironing Board Cover', status: 'Active', image: 'https://garden.spoonflower.com/c/10129777/i/s/K3v7pj78VBXCiwxwpC4nH_ycD5VGLqTClWGNtHzNyeWukkClzotwJcKJqdidDA/10129777.png', history: [{date: '2026-01-12 11:30', action: 'Created Design', user: 'Admin'}] },
            { id: 3, code: 'PTN-2026-003', name: 'Deep Ocean Velvet', category: 'Solid', composition: 'Polyester Velvet', width: '60"', weight: '320 gsm', colors: ['#1e3a8a'], tags: 'Velvet, Premium', application: 'Premium Sofa, Curtains', status: 'Active', image: 'https://gruenestoffe.de/cdn/shop/products/Austria33_1_1024x1024.jpg?v=1677588629', history: [{date: '2026-01-15 14:15', action: 'Created Design', user: 'Admin'}] },
            { id: 4, code: 'PTN-2026-004', name: 'Tropical Summer', category: 'Printed', composition: 'Rayon', width: '58"', weight: '150 gsm', colors: ['#10b981', '#f59e0b'], tags: 'Summer, Bright', application: 'Outdoor Furniture, Pillows', status: 'In Development', image: 'https://media.istockphoto.com/id/694526816/vector/vector-seamless-pattern-with-multicolor-palm-tree-leaves-summer-tropical-background.jpg?s=612x612&w=0&k=20&c=L0HmTug28L-gcuKnxa5YCW94RGXcPT7WXeJ-KpfYeHY=', history: [{date: '2026-02-01 10:45', action: 'Created Design', user: 'Designer'}] },
        ]);
    }, []);

    // Logic
    const filteredPatterns = useMemo(() => {
        let res = patterns;
        if (categoryFilter !== 'All') res = res.filter(p => p.category === categoryFilter);
        if (searchQuery) {
            const q = searchQuery.toLowerCase();
            res = res.filter(p => p.code.toLowerCase().includes(q) || p.name.toLowerCase().includes(q) || p.tags.toLowerCase().includes(q) || (p.application && p.application.toLowerCase().includes(q)));
        }
        return res;
    }, [patterns, categoryFilter, searchQuery]);

    const getCategoryCount = (cat: string) => {
        if(cat === 'All') return patterns.length;
        return patterns.filter(p => p.category === cat).length;
    };

    // Handlers
    const openModal = (pattern = null) => {
        setIsConfigMode(false); 
        setActiveModalTab('info');
        if (pattern) {
            setIsEditing(true);
            setForm({ ...pattern });
        } else {
            setIsEditing(false);
            setForm({
                id: null, code: 'AUTO-GEN', name: '', category: fabricCategories[0] || '', 
                composition: '', width: '', weight: '', 
                colors: ['#000000'], tags: '', application: '', image: null, status: 'Active', history: []
            });
        }
        setShowModal(true);
    };

    const closeModal = () => setShowModal(false);

    const getFormattedDate = () => {
        const now = new Date();
        const yy = now.getFullYear();
        const mm = String(now.getMonth() + 1).padStart(2, '0');
        const dd = String(now.getDate()).padStart(2, '0');
        const hh = String(now.getHours()).padStart(2, '0');
        const min = String(now.getMinutes()).padStart(2, '0');
        return `${yy}-${mm}-${dd} ${hh}:${min}`;
    };

    const savePattern = () => {
        if (!form.name || !form.category) {
            window.alert('โปรดระบุชื่อและหมวดหมู่ของลายผ้า');
            return;
        }
        
        const newPatterns = [...patterns];
        const timestamp = getFormattedDate();

        if (isEditing) {
            const idx = newPatterns.findIndex(p => p.id === form.id);
            if (idx !== -1) {
                newPatterns[idx] = {
                    ...form,
                    history: [...(form.history || []), { date: timestamp, action: 'Updated Design', user: 'Admin' }]
                };
            }
        } else {
            const newId = Date.now();
            const newCode = `PTN-2026-${String(newPatterns.length + 1).padStart(3, '0')}`;
            newPatterns.unshift({ 
                ...form, 
                id: newId, 
                code: newCode,
                history: [{ date: timestamp, action: 'Created Design', user: 'Admin' }]
            });
        }
        
        setPatterns(newPatterns);
        closeModal();
    };

    const deletePattern = (id: any) => {
        if (window.confirm('คุณแน่ใจหรือไม่ว่าต้องการลบลายผ้านี้?')) {
            setPatterns(prev => prev.filter(p => p.id !== id));
            closeModal();
        }
    };

    const addCategory = () => {
        if(newCategoryInput && !fabricCategories.includes(newCategoryInput)){
            setFabricCategories(prev => [...prev, newCategoryInput]);
            setNewCategoryInput('');
        }
    };
    
    const removeCategory = (cat: string) => {
        setFabricCategories(prev => prev.filter(c => c !== cat));
        if (categoryFilter === cat) setCategoryFilter('All');
    };

    return (
        <div className="flex-1 flex flex-col h-screen overflow-hidden bg-[#F9F7F6] animate-fade-in-up">
            <style>{`
                .master-custom-scrollbar::-webkit-scrollbar { width: 6px; height: 6px; }
                .master-custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
                .master-custom-scrollbar::-webkit-scrollbar-thumb { background: #CBD5E1; border-radius: 3px; }
                .no-scrollbar::-webkit-scrollbar { display: none; }

                .minimal-th { font-size: 11px; text-transform: uppercase; letter-spacing: 0.05em; color: #FFFFFF; padding: 12px 16px; font-weight: 800; background-color: #111f42; border-bottom: 2px solid #ab8a3b; white-space: nowrap; cursor: pointer; user-select: none; }
                .minimal-td { padding: 12px 16px; vertical-align: middle; color: #111f42; font-size: 12px; font-weight: 500; border-bottom: 1px solid rgba(226, 232, 240, 0.6); }
                tr:hover .minimal-td { background-color: rgba(171, 138, 59, 0.05); }

                .modal-overlay { position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(17, 31, 66, 0.6); backdrop-filter: blur(4px); z-index: 10001; display: flex; justify-content: center; align-items: center; padding: 1rem; }
                .modal-box { background: #F9F7F6; width: 100%; max-width: 800px; max-height: 90vh; border-radius: 16px; box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25); border-top: 6px solid #ab8a3b; overflow: hidden; display: flex; flex-direction: column; }
                
                .badge { display: inline-flex; align-items: center; padding: 0.15rem 0.6rem; border-radius: 6px; font-weight: 700; font-size: 10px; gap: 0.375rem; border: 1px solid transparent; font-family: "JetBrains Mono", monospace; text-transform: uppercase; }
                .badge-green { background-color: rgba(16, 185, 129, 0.1); color: #10b981; border-color: rgba(16, 185, 129, 0.2); }
                .badge-gray { background-color: #F1F5F9; color: #64748B; border-color: #E2E8F0; }
                
                .input-primary { width: 100%; background: white; border: 1px solid #E2E8F0; border-radius: 0.5rem; padding: 8px 12px; font-size: 13px; transition: all 0.2s; color: #111f42; outline: none; }
                .input-primary:focus { outline: none; border-color: #ab8a3b; box-shadow: 0 0 0 2px rgba(171, 138, 59, 0.1); }

                .animate-fade-in-up { animation: fadeInUp 0.4s ease-out forwards; }
                @keyframes fadeInUp { from { opacity: 0; transform: translateY(15px); } to { opacity: 1; transform: translateY(0); } }

                .pattern-card { background-color: white; border: 1px solid #E2E8F0; border-radius: 1rem; overflow: hidden; transition: all 0.3s ease; position: relative; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05); }
                .pattern-card:hover { transform: translateY(-4px); box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1); border-color: #ab8a3b; }
            `}</style>

            {/* Header Toolbar */}
            <div className="px-8 pt-14 pb-2 flex flex-col md:flex-row justify-between items-center gap-6 flex-shrink-0 z-10 bg-[#F9F7F6]">
                <div className="flex items-center gap-4 w-full md:w-auto">
                    <div className="w-14 h-14 flex items-center justify-center rounded-2xl bg-white shadow-sm flex-shrink-0 border border-slate-200 relative">
                        <Palette size={28} className="text-[#111f42]" strokeWidth={2.5} />
                        <div className="absolute bottom-[14px] right-[14px] w-[6px] h-[6px] bg-[#ab8a3b] rounded-[1px]"></div>
                    </div>
                    <div>
                        <h1 className="text-3xl tracking-tight whitespace-nowrap uppercase leading-none font-mono">
                            <span className="font-black text-[#E3624A]">FABRIC</span> <span className="font-light text-[#111f42]">DESIGN AND PATTERN</span>
                        </h1>
                        <p className="text-slate-500 text-[11px] mt-1.5 font-bold">
                            <span className="tracking-normal ml-1">ฐานข้อมูลแบบและลายผ้ามาตรฐาน</span>
                        </p>
                    </div>
                </div>
                <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto">
                    <div className="flex bg-[#e2e8f0] p-1 border border-slate-200 shadow-inner rounded-xl items-center flex-shrink-0 overflow-hidden">
                        <button onClick={() => setViewMode('grid')} className={`px-5 py-2.5 text-xs font-bold transition-all flex items-center gap-2 rounded-lg uppercase tracking-wide ${viewMode === 'grid' ? 'bg-[#ab8a3b] text-white shadow-md' : 'text-slate-500 hover:bg-slate-50'}`}><LayoutGrid size={14} /> GRID</button>
                        <button onClick={() => setViewMode('list')} className={`px-5 py-2.5 text-xs font-bold transition-all flex items-center gap-2 rounded-lg uppercase tracking-wide ${viewMode === 'list' ? 'bg-[#ab8a3b] text-white shadow-md' : 'text-slate-500 hover:bg-slate-50'}`}><List size={14} /> LIST</button>
                        <button onClick={() => setViewMode('dashboard')} className={`px-5 py-2.5 text-xs font-bold transition-all flex items-center gap-2 rounded-lg uppercase tracking-wide ${viewMode === 'dashboard' ? 'bg-[#ab8a3b] text-white shadow-md' : 'text-slate-500 hover:bg-slate-50'}`}><BarChart2 size={14} /> DASHBOARD</button>
                    </div>
                    <button onClick={() => setIsGuideOpen(true)} className="p-2.5 transition-all rounded-xl bg-white text-slate-400 hover:bg-[#111f42] hover:text-white border border-slate-200 shadow-sm" title="Help">
                        <HelpCircle size={20} />
                    </button>
                </div>
            </div>

            {/* Main Area */}
            <main className="flex-1 overflow-y-auto master-custom-scrollbar relative z-10 px-8 pt-4 pb-10 flex flex-col gap-4">
                <div className="bg-white rounded-none shadow-sm border border-slate-200 flex flex-col overflow-hidden min-h-[600px]">
                    
                    {/* Toolbar Filter */}
                    <div className="px-6 py-4 border-b border-slate-100 flex flex-col lg:flex-row items-center justify-between gap-4 bg-slate-50/50">
                        <div className="flex flex-1 items-center gap-3 w-full lg:w-auto overflow-x-auto no-scrollbar">
                            <div className="relative flex-shrink-0">
                                <Filter className="absolute left-3 top-1/2 -translate-y-1/2 text-[#ab8a3b]" size={14} />
                                <select 
                                    value={categoryFilter} 
                                    onChange={(e) => setCategoryFilter(e.target.value)} 
                                    className="appearance-none min-w-[200px] bg-white border border-slate-200 rounded-lg pl-9 pr-8 py-2.5 outline-none focus:border-[#ab8a3b] text-[#111f42] font-bold text-[11px] uppercase tracking-wider shadow-sm transition-all cursor-pointer"
                                >
                                    <option value="All">ALL CATEGORIES ({patterns.length})</option>
                                    {fabricCategories.map(cat => (
                                        <option key={cat} value={cat}>
                                            {cat.toUpperCase()} ({getCategoryCount(cat)})
                                        </option>
                                    ))}
                                </select>
                                <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                                    <ChevronDown size={14} />
                                </div>
                            </div>
                            
                            <div className="h-6 w-px bg-slate-200 mx-1 hidden lg:block shrink-0"></div>

                            <div className="relative w-full lg:w-64 shrink-0">
                                <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                                <input type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="Search Design..." className="input-primary pl-9 pr-4 py-2.5 text-xs bg-white transition-colors" />
                            </div>
                        </div>
                        <div className="flex gap-3 shrink-0 flex-nowrap items-center ml-auto">
                            <button onClick={() => openModal()} className="px-6 py-2.5 rounded-xl text-xs font-bold bg-[#111f42] text-white hover:bg-[#1e346b] shadow-md flex items-center gap-2 uppercase tracking-wide whitespace-nowrap transition-all">
                                <Plus size={16} className="text-[#ab8a3b]" strokeWidth={3} /> ADD DESIGN
                            </button>
                        </div>
                    </div>

                    {/* View Content */}
                    <div className="flex-1 overflow-y-auto master-custom-scrollbar p-6">
                        {viewMode === 'dashboard' ? (
                            <FabricDashboard patterns={patterns} />
                        ) : viewMode === 'grid' ? (
                            <FabricGrid patterns={filteredPatterns} onEdit={openModal} />
                        ) : (
                            <FabricTable patterns={filteredPatterns} onEdit={openModal} />
                        )}
                    </div>
                </div>
            </main>

            {/* User Guide Drawer */}
            {isGuideOpen && (
                <>
                    <div className="fixed inset-0 bg-[#111f42]/40 backdrop-blur-sm z-[100] no-print" onClick={() => setIsGuideOpen(false)} />
                    <div className="fixed inset-y-0 right-0 w-full md:w-[450px] bg-white shadow-2xl z-[110] flex flex-col no-print">
                        <div className="px-6 py-5 flex justify-between items-center bg-[#111f42] text-white shrink-0 border-b-4 border-[#ab8a3b]">
                            <div className="flex items-center gap-2"><HelpCircle size={20} className="text-[#ab8a3b]" /><h2 className="text-base font-semibold uppercase tracking-widest">คู่มือการใช้งานระบบ</h2></div>
                            <button onClick={() => setIsGuideOpen(false)} className="hover:bg-white/20 p-1.5 rounded-lg transition-colors"><X size={20} /></button>
                        </div>
                        <div className="flex-1 overflow-y-auto p-8 text-slate-700 space-y-8 text-[13px] leading-relaxed">
                            <section>
                                <h4 className="font-black border-b pb-1 text-[#111f42] uppercase flex items-center gap-2 mb-3">1. เพิ่มลายผ้าใหม่</h4>
                                <p>กดปุ่ม <span className="bg-[#111f42] text-white px-1.5 rounded-[3px]">ADD DESIGN</span> เพื่อสร้างข้อมูลและอัพโหลดรูปภาพ</p>
                            </section>
                            <section>
                                <h4 className="font-black border-b pb-1 text-[#111f42] uppercase flex items-center gap-2 mb-3">2. แก้ไข / ลบข้อมูล</h4>
                                <p>สามารถกดไอคอน Pencil ที่รูปภาพในโหมด Grid หรือคอลัมน์ขวาสุดในโหมด List เพื่อเข้าสู่หน้าจอแก้ไข</p>
                            </section>
                        </div>
                        <div className="p-4 border-t flex justify-end bg-slate-50"><button onClick={()=>setIsGuideOpen(false)} className="bg-[#111f42] text-white px-8 py-2.5 rounded-none font-bold text-[12px] uppercase tracking-wider shadow-md hover:bg-[#1e346b] transition-colors">เข้าใจแล้ว</button></div>
                    </div>
                </>
            )}

            {/* Modal */}
            <FabricActionModal 
                show={showModal}
                onClose={closeModal}
                isEditing={isEditing}
                form={form}
                setForm={setForm}
                activeTab={activeModalTab}
                setActiveTab={setActiveModalTab}
                isConfigMode={isConfigMode}
                setIsConfigMode={setIsConfigMode}
                fabricCategories={fabricCategories}
                newCategoryInput={newCategoryInput}
                setNewCategoryInput={setNewCategoryInput}
                addCategory={addCategory}
                removeCategory={removeCategory}
                onSave={savePattern}
                onDelete={deletePattern}
            />
        </div>
    );
}

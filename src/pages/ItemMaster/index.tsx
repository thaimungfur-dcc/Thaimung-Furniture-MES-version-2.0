import React, { useState, useEffect, useMemo, useRef } from 'react';
import { 
    Package, List, BarChart2, Database, Box, Leaf, 
    PlusCircle, UploadCloud, Plus, HelpCircle
} from 'lucide-react';
import Chart from 'chart.js/auto';
import { useMasterData } from '../../context/MasterDataContext';
import { KpiCard } from '../../components/shared/KpiCard';
import ItemTable from './components/ItemTable';
import ItemModal from './components/ItemModal';
import { CsvUploadModal } from '../../components/shared/CsvUploadModal';
import { PageHeader } from '../../components/shared/PageHeader';
import NameRuleModal from './components/NameRuleModal';
import GuideDrawer from './components/GuideDrawer';

export default function ItemMasterApp() {
    // --- State Management ---
    const [activeTab, setActiveTab] = useState('list');
    const [showModal, setShowModal] = useState(false);
    const [showNameRuleModal, setShowNameRuleModal] = useState(false);
    const [isGuideOpen, setIsGuideOpen] = useState(false);
    
    // Data State
    const { items, addItem, updateItem, deleteItem: contextDeleteItem } = useMasterData();
    const [groups, setGroups] = useState(['All', 'FG', 'RM', 'WIP', 'HW', 'FB', 'PK']);
    
    // Upload State
    const [showUploadModal, setShowUploadModal] = useState(false);

    // Name Rules State
    const [selectedRuleType, setSelectedRuleType] = useState('FG');
    const [nameRules, setNameRules] = useState<Record<string, string>>({
        'FG': '{Category} {SubCategory} {Code}',
        'RM': 'MAT {Category} {SubCategory}',
        'WIP': 'WIP {Category} {SubCategory}',
        'PK': 'PACK {Category} {Code}',
        'HW': 'HARDWARE {Category} {Code}',
        'FB': 'FABRIC {Category} {SubCategory}'
    });

    // Refs
    const typeChartRef = useRef<HTMLCanvasElement>(null);
    const charts = useRef<any>({});

    // Form State
    const [form, setForm] = useState<any>({
        id: null,
        itemCode: '', itemName: '', itemType: 'FG', category: '', subCategory: '',
        baseUnit: '', stdCost: 0, stdPrice: 0, leadTime: 0, moq: 0, status: 'Active'
    });

    // Helper functions
    const closeModal = () => setShowModal(false);

    // Analytics Chart
    useEffect(() => {
        if (activeTab === 'analytics' && items.length > 0) {
            if (charts.current.type) charts.current.type.destroy();
            Chart.defaults.font.family = "'JetBrains Mono', 'Noto Sans Thai', sans-serif";

            if (typeChartRef.current) {
                const counts: any = {};
                items.forEach(i => counts[i.itemType] = (counts[i.itemType] || 0) + 1);
                charts.current.type = new Chart(typeChartRef.current, {
                    type: 'doughnut',
                    data: {
                        labels: Object.keys(counts),
                        datasets: [{
                            data: Object.values(counts),
                            backgroundColor: ['#111f42', '#ab8a3b', '#E3624A', '#72A09E', '#4e546a', '#10b981'],
                            borderWidth: 0
                        }]
                    },
                    options: { responsive: true, maintainAspectRatio: false, cutout: '70%', plugins: { legend: { position: 'right' } } }
                });
            }
        }
    }, [activeTab, items]);

    const fgCount = items.filter(i => i.itemType === 'FG').length;
    const rmCount = items.filter(i => i.itemType === 'RM').length;
    const newCount = items.filter(i => new Date(i.updatedAt).getMonth() === new Date().getMonth()).length;

    const getTypeClass = (type: string) => {
        switch(type) {
            case 'FG': return 'bg-[#111f42]/10 text-[#111f42] border-[#111f42]/20'; 
            case 'RM': return 'bg-[#10b981]/10 text-[#10b981] border-[#10b981]/20'; 
            case 'WIP': return 'bg-[#ab8a3b]/10 text-[#ab8a3b] border-[#ab8a3b]/20'; 
            default: return 'bg-slate-100 text-slate-500 border-slate-200';
        }
    };

    const openModal = (item: any = null) => {
        if (item) setForm(JSON.parse(JSON.stringify(item)));
        else setForm({ id: null, itemCode: '', itemName: '', itemType: 'FG', category: '', subCategory: '', baseUnit: '', stdCost: 0, stdPrice: 0, leadTime: 0, moq: 0, status: 'Active' });
        setShowModal(true);
    };

    const saveItem = () => {
        if (!form.itemName || !form.itemType) return;
        const now = new Date().toISOString().split('T')[0];
        if (form.id) {
            updateItem(form.id, { ...form, updatedAt: now });
        } else {
            const newId = Date.now().toString();
            const generatedCode = form.itemCode || `${form.itemType}-${String(items.length + 1).padStart(4, '0')}`;
            addItem({ ...form, id: newId, itemCode: generatedCode, updatedAt: now });
        }
        setShowModal(false);
        alert('Item Saved Successfully');
    };

    const deleteItem = (id: string) => {
        if (window.confirm('Delete this item Master Record?')) {
            contextDeleteItem(id);
        }
    };

    const confirmUpload = (parsedData: any[]) => {
        // Assume imported data is valid, iterate and add
        const now = new Date().toISOString().split('T')[0];
        parsedData.forEach((row: any) => {
             const newId = Date.now().toString() + Math.random().toString();
             addItem({
                 id: newId,
                 itemCode: row.ItemCode || `${row.Type || 'FG'}-${String(Math.floor(Math.random() * 9999)).padStart(4, '0')}`,
                 itemName: row.ItemName || 'Imported Item',
                 itemType: row.Type || 'FG',
                 category: row.Category || 'General',
                 subCategory: row.SubCategory || '',
                 baseUnit: row.Unit || 'PCS',
                 stdCost: parseFloat(row.Cost) || 0,
                 stdPrice: parseFloat(row.Price) || 0,
                 leadTime: 0,
                 moq: 0,
                 status: 'Active',
                 updatedAt: now
             });
        });
        alert(`Successfully imported ${parsedData.length} records into system.`);
        setShowUploadModal(false);
    };

    const previewNameRule = useMemo(() => {
        const rule = nameRules[selectedRuleType] || '';
        return rule.replace('{Category}', 'Dining').replace('{SubCategory}', 'Oak').replace('{Code}', '001');
    }, [selectedRuleType, nameRules]);

    return (
        <>
            <style>{`
                .master-custom-scrollbar::-webkit-scrollbar { width: 6px; height: 6px; }
                .master-custom-scrollbar::-webkit-scrollbar-thumb { background: #CBD5E1; border-radius: 3px; }
                .no-scrollbar::-webkit-scrollbar { display: none; }
                
                .minimal-th {
                    font-size: 12px; text-transform: uppercase; letter-spacing: 0.05em; color: #FFFFFF; 
                    padding: 16px 16px; font-weight: 800; background-color: #111f42; border-bottom: 2px solid #ab8a3b;
                    white-space: nowrap; cursor: pointer; transition: background-color 0.2s;
                }
                .minimal-th:hover { background-color: #1e346b; }
                .minimal-td { padding: 8px 16px; vertical-align: middle; color: #111f42; font-size: 12px; font-weight: 500; border-bottom: 1px solid rgba(226, 232, 240, 0.6); }
                tr:hover .minimal-td { background-color: rgba(171, 138, 59, 0.05); }

                .filter-btn { border-radius: 0.5rem; font-size: 0.75rem; font-weight: 700; transition: all 0.3s; white-space: nowrap; border: 1px solid transparent; }
                .filter-btn.active { background-color: #111f42; color: #FFFFFF; }
                
                .modal-overlay { position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(17, 31, 66, 0.6); backdrop-filter: blur(4px); z-index: 10001; display: flex; justify-content: center; align-items: center; padding: 1rem; }
                .modal-box { background: #F9F7F6; width: 100%; max-height: 90vh; box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25); overflow: hidden; display: flex; flex-direction: column; }
                
                .input-primary { width: 100%; background: white; border: 1px solid #E2E8F0; border-radius: 0.5rem; padding: 8px 12px; font-size: 13px; color: #111f42; outline: none; transition: border 0.2s; }
                .input-primary:focus { border-color: #ab8a3b; box-shadow: 0 0 0 2px rgba(171, 138, 59, 0.1); }
            `}</style>

            <div className="flex flex-col w-full pb-10">
                {/* Header Section */}
                <PageHeader
                    title="ITEM CODE"
                    subtitle="ระบบจัดการรหัสสินค้าและวัตถุดิบ"
                    icon={Package}
                    rightContent={
                        <div className="flex items-center gap-3 w-full lg:w-auto">
                            <div className="flex bg-[#e2e8f0] p-1 border border-slate-200 shadow-inner w-full md:w-fit flex-shrink-0 rounded-xl overflow-hidden">
                                <button onClick={() => setActiveTab('list')} className={`px-6 py-2.5 text-xs font-black transition-all flex items-center gap-2 whitespace-nowrap uppercase tracking-widest rounded-lg ${activeTab === 'list' ? 'bg-[#ab8a3b] text-white shadow-md' : 'text-slate-500 hover:bg-slate-50'}`}>
                                    <List size={14} /> MASTER LIST
                                </button>
                                <button onClick={() => setActiveTab('analytics')} className={`px-6 py-2.5 text-xs font-black transition-all flex items-center gap-2 whitespace-nowrap uppercase tracking-widest rounded-lg ${activeTab === 'analytics' ? 'bg-[#ab8a3b] text-white shadow-md' : 'text-slate-500 hover:bg-slate-50'}`}>
                                    <BarChart2 size={14} /> ANALYTICS
                                </button>
                            </div>
                            <button onClick={() => setIsGuideOpen(true)} className="p-2.5 transition-all rounded-xl bg-white text-slate-400 hover:bg-[#111f42] hover:text-white border border-slate-200 shadow-sm">
                                <HelpCircle size={20} />
                            </button>
                        </div>
                    }
                />

                {/* Main Content Area */}
                <main className="relative z-10 flex flex-col gap-4">
                    
                    {/* KPI Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                        <KpiCard title="Total Master Records" value={items.length} color="#111f42" icon={Database} subValue="All Items Registered" />
                        <KpiCard title="Finished Goods" value={fgCount} color="#ab8a3b" icon={Box} subValue="Items Ready for Sale" />
                        <KpiCard title="Raw Materials" value={rmCount} color="#10b981" icon={Leaf} subValue="Components & Materials" />
                        <KpiCard title="New Registered" value={newCount} color="#E3624A" icon={PlusCircle} subValue="Registered This Month" />
                    </div>

                    {/* Table Section */}
                    <div className="bg-white border border-slate-200 flex flex-col min-h-[600px] w-full rounded-2xl overflow-hidden shadow-sm">
                        {activeTab === 'list' && (
                            <>
                                <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between gap-4 bg-slate-50/50">
                                    <div className="flex-1"></div>
                                    <div className="flex gap-2 shrink-0 ml-auto items-center">
                                        <button onClick={() => setShowUploadModal(true)} className="px-5 py-2.5 rounded-xl text-[12px] font-black bg-slate-100 text-slate-600 hover:bg-slate-200 flex items-center gap-2 uppercase tracking-widest transition-all">
                                            <UploadCloud size={16} /> Upload
                                        </button>
                                        <button onClick={() => openModal()} className="px-5 py-2.5 rounded-xl text-[12px] font-black bg-[#111f42] text-white shadow-md flex items-center gap-2 uppercase tracking-[0.15em] transition-all hover:bg-[#1e346b]">
                                            <Plus size={16} className="text-[#ab8a3b]" /> NEW RECORD
                                        </button>
                                    </div>
                                </div>
                                <ItemTable 
                                    items={items}
                                    getTypeClass={getTypeClass}
                                    openModal={openModal}
                                    deleteItem={deleteItem}
                                />
                            </>
                        )}
                        {activeTab === 'analytics' && (
                            <div className="p-6 flex-1 flex flex-col items-center justify-center min-h-[400px]">
                                <h3 className="text-sm font-black text-[#111f42] uppercase tracking-widest mb-6">Item Distribution by Type</h3>
                                <div className="w-full max-w-md h-64 relative">
                                    <canvas ref={typeChartRef}></canvas>
                                </div>
                            </div>
                        )}
                    </div>
                </main>

                <ItemModal 
                    showModal={showModal}
                    closeModal={closeModal}
                    form={form}
                    setForm={setForm}
                    groups={groups}
                    setShowNameRuleModal={setShowNameRuleModal}
                    saveItem={saveItem}
                />

                <NameRuleModal 
                    showNameRuleModal={showNameRuleModal}
                    setShowNameRuleModal={setShowNameRuleModal}
                    selectedRuleType={selectedRuleType}
                    setSelectedRuleType={setSelectedRuleType}
                    groups={groups}
                    nameRules={nameRules}
                    setNameRules={setNameRules}
                    previewNameRule={previewNameRule}
                />

                <CsvUploadModal 
                    isOpen={showUploadModal}
                    onClose={() => setShowUploadModal(false)}
                    title="Bulk Item Import"
                    expectedHeaders={['ItemCode', 'ItemName', 'Type', 'Category', 'SubCategory', 'Unit', 'Cost', 'Price']}
                    onConfirm={confirmUpload}
                    instructions="อัปโหลดไฟล์ Master Data สินค้า/วัตถุดิบ (รูปแบบ .csv)"
                />

                <GuideDrawer 
                    isGuideOpen={isGuideOpen}
                    setIsGuideOpen={setIsGuideOpen}
                />
            </div>
        </>
    );
}


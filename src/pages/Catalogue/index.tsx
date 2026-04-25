import React, { useState, useEffect, useMemo } from 'react';
import { 
    LayoutGrid, List, BarChart2, Search, Plus, Armchair, ChevronLeft, ChevronRight, Filter, ChevronDown
} from 'lucide-react';
import { PageHeader } from '../../components/shared/PageHeader';
import CatalogueGrid from './components/CatalogueGrid';
import CatalogueTable from './components/CatalogueTable';
import CatalogueDashboard from './components/CatalogueDashboard';
import CatalogueActionModal from './components/CatalogueActionModal';

export default function FurnitureCatalogueApp() {
    // State
    const [viewMode, setViewMode] = useState<'grid' | 'list' | 'dashboard'>('grid');
    const [searchQuery, setSearchQuery] = useState('');
    const [categoryFilter, setCategoryFilter] = useState('All');
    const [showModal, setShowModal] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [activeModalTab, setActiveModalTab] = useState('info'); 
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(12);

    const [products, setProducts] = useState<any[]>([]);
    const productCategories = ['Living Room', 'Bedroom', 'Dining', 'Office', 'Outdoor', 'Laundry'];
    
    // Mock Item Master Data (For Dropdown)
    const itemMasterFG = [
        { itemCode: 'FUR-2026-001', itemName: 'Nordic Sofa 3-Seater', category: 'Living Room', price: 25900 },
        { itemCode: 'FUR-2026-002', itemName: 'Grand Dining Table', category: 'Dining', price: 42500 },
        { itemCode: 'FUR-2026-005', itemName: 'Pro Ironing Board', category: 'Laundry', price: 1290 },
        { itemCode: 'OF-CHR-01', itemName: 'Smart Chair', category: 'Office', price: 4500 },
        { itemCode: 'OD-BEN-01', itemName: 'Garden Bench', category: 'Outdoor', price: 3200 },
        { itemCode: 'BD-BED-01', itemName: 'King Bed', category: 'Bedroom', price: 18900 },
        { itemCode: 'LR-TAB-01', itemName: 'Side Table', category: 'Living Room', price: 2500 },
        { itemCode: 'OF-DSK-02', itemName: 'Office Desk', category: 'Office', price: 12500 }
    ];

    // Form State
    const [form, setForm] = useState<any>({
        id: null, code: '', sku: '', name: '', category: 'Living Room', subCategory: '',
        material: '', dimensions: '', price: '', colors: [], tags: '', image: null, status: 'Active',
        description: '', materialDetail: '', spec_type: '', spec_adjust: '', spec_dim_ship: '', spec_weight: '',
        care_instructions: '', sales: 0, rating: 0, history: []
    });

    // Mock Data
    useEffect(() => {
        setProducts([
            { 
                id: 1, code: 'FUR-2026-001', sku: 'ND-SOF-3S', name: 'Nordic Sofa 3-Seater', category: 'Living Room', subCategory: 'Sofa',
                material: 'Fabric / Oak Wood', dimensions: '210 x 90 x 85 cm', price: '25,900', colors: ['#A9A9A9', '#1F2937'], 
                tags: 'Modern, Nordic, Cozy', status: 'Active', sales: 120, rating: 5,
                image: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&q=80&w=400',
                description: 'โซฟาสไตล์นอร์ดิก 3 ที่นั่ง นุ่มสบาย ดีไซน์มินิมอล', materialDetail: 'ผ้าลินินเกรดพรีเมียม โครงไม้โอ๊คแท้',
                spec_type: 'Sofa', spec_adjust: '-', spec_dim_ship: '215x95x90 cm', spec_weight: '45 kg',
                care_instructions: 'ดูดฝุ่นสม่ำเสมอ หลีกเลี่ยงแสงแดดจัด',
                history: [{date: '2025-10-01', action: 'Created', user: 'Admin'}]
            },
            { 
                id: 2, code: 'FUR-2026-002', sku: 'GR-DNT-01', name: 'Grand Dining Table', category: 'Dining', subCategory: 'Dining Table',
                material: 'Teak Wood / Marble', dimensions: '180 x 90 x 75 cm', price: '42,500', colors: ['#8B4513', '#F5F5F5'], 
                tags: 'Luxury, Marble', status: 'Active', sales: 45, rating: 4,
                image: 'https://xcdn.next.co.uk/common/items/default/default/itemimages/3_4Ratio/product/lge/773063s.jpg?im=Resize,width=750',
                history: [{date: '2025-10-05', action: 'Created', user: 'Admin'}]
            },
            { 
                id: 3, code: 'FUR-2026-005', sku: 'IB-PRO-01', name: 'Pro Ironing Board', category: 'Laundry', subCategory: 'Ironing Board',
                material: 'Steel / Cotton', dimensions: '37.5 x 100 x 86 cm', price: '1,290', colors: ['#E5E7EB', '#000000'],
                tags: 'Utility, Home', status: 'Active', sales: 850, rating: 5,
                image: 'https://m.media-amazon.com/images/I/91SaIdBVfXL._AC_UF894,1000_QL80_.jpg',
                description: 'ปรับความสูงได้หลายระดับ...', 
                history: [{date: '2026-01-15', action: 'Created', user: 'Admin'}]
            },
            { id: 4, name: 'Smart Chair', sales: 300, category: 'Office', price: '4,500', rating: 4, sku: 'OF-CHR-01', image: 'https://www.tub-collection.co.uk/cdn/shop/files/23029darkgrey1.jpg?v=1715512979' },
            { id: 5, name: 'Garden Bench', sales: 60, category: 'Outdoor', price: '3,200', rating: 3, sku: 'OD-BEN-01', image: 'https://assets.wfcdn.com/im/64989019/resize-h400-w400%5Ecompr-r85/2526/252634114/default_name.jpg' },
            { id: 6, name: 'King Bed', sales: 150, category: 'Bedroom', price: '18,900', rating: 4, sku: 'BD-BED-01', image: 'https://assets.wfcdn.com/im/37040247/compr-r85/2998/299822032/Nova+Boucle+Platform+Bed.jpg' },
            { id: 7, name: 'Side Table', sales: 90, category: 'Living Room', price: '2,500', rating: 2, sku: 'LR-TAB-01', image: 'https://tribesigns.com/cdn/shop/files/1_bafd6617-4797-42ac-a2ed-5f61e12a9b3a.jpg?v=1751274658&width=2048' },
            { id: 8, name: 'Office Desk', sales: 420, category: 'Office', price: '12,500', rating: 5, sku: 'OF-DSK-02', image: 'https://chopvalue.com/cdn/shop/products/chopvalue-homeofficedesk-lifestyle02_48b219f2-cdb9-460d-962d-9bfe23a7fc96_1200x.jpg?v=1697768091' }
        ]);
    }, []);

    // Filtering & Pagination
    const filteredProducts = useMemo(() => {
        let res = products;
        if (categoryFilter !== 'All') res = res.filter(p => p.category === categoryFilter);
        if (searchQuery) {
            const q = searchQuery.toLowerCase();
            res = res.filter(p => p.name?.toLowerCase().includes(q) || p.sku?.toLowerCase().includes(q));
        }
        return res;
    }, [products, categoryFilter, searchQuery]);

    const totalPages = Math.ceil(filteredProducts.length / itemsPerPage) || 1;
    const paginatedProducts = useMemo(() => {
        const start = (currentPage - 1) * itemsPerPage;
        return filteredProducts.slice(start, start + itemsPerPage);
    }, [filteredProducts, currentPage, itemsPerPage]);

    const prevPage = () => setCurrentPage(prev => Math.max(prev - 1, 1));
    const nextPage = () => setCurrentPage(prev => Math.min(prev + 1, totalPages));

    // Handlers
    const openModal = (product = null) => {
        setActiveModalTab('info');
        if (product) { 
            setIsEditing(true); 
            setForm({ ...product }); 
        }
        else {
            setIsEditing(false);
            setForm({ id: null, code: 'AUTO', sku: '', name: '', category: productCategories[0], subCategory: '', material: '', dimensions: '', price: '', colors: [], tags: '', image: null, status: 'Active', sales: 0, rating: 5, history: [] });
        }
        setShowModal(true);
    };

    const closeModal = () => setShowModal(false);
    
    const deleteProduct = (id: any) => {
        if (window.confirm('Are you sure you want to delete this furniture item?')) {
            setProducts(prev => prev.filter(p => p.id !== id));
            closeModal();
        }
    };

    const handleSave = () => {
        if (isEditing) {
            setProducts(prev => prev?.map(p => p.id === form.id ? form : p));
        } else {
            const newProduct = { ...form, id: Date.now() };
            setProducts(prev => [...prev, newProduct]);
        }
        closeModal();
    };

    return (
        <div className="flex flex-col space-y-4 w-full relative flex-1 animate-fade-in-up">
            <style>{`
                .wh-custom-scrollbar::-webkit-scrollbar { width: 6px; height: 6px; }
                .wh-custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
                .wh-custom-scrollbar::-webkit-scrollbar-thumb { background: #CBD5E1; border-radius: 3px; }
                .wh-custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #94A3B8; }
                .no-scrollbar::-webkit-scrollbar { display: none; }

                .minimal-th { font-size: 11px; text-transform: uppercase; letter-spacing: 0.05em; color: #FFFFFF; padding: 12px 16px; font-weight: 800; background-color: #111f42; border-bottom: 2px solid #ab8a3b; white-space: nowrap; cursor: pointer; user-select: none; }
                .minimal-td { padding: 12px 16px; vertical-align: middle; color: #111f42; font-size: 12px; font-weight: 500; border-bottom: 1px solid rgba(226, 232, 240, 0.6); }
                tr:hover .minimal-td { background-color: rgba(171, 138, 59, 0.05); }

                .modal-overlay { position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(17, 31, 66, 0.6); backdrop-filter: blur(4px); z-index: 1000; display: flex; justify-content: center; align-items: center; padding: 1rem; }
                .modal-box { background: #F9F7F6; width: 100%; max-width: 1000px; max-height: 90vh; border-radius: 16px; box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25); border-top: 6px solid #ab8a3b; overflow: hidden; display: flex; flex-direction: column; }
                
                .input-primary { width: 100%; background: white; border: 1px solid #E2E8F0; border-radius: 0.5rem; padding: 8px 12px; font-size: 13px; transition: all 0.2s; color: #111f42; outline: none; }
                .input-primary:focus { border-color: #ab8a3b; box-shadow: 0 0 0 2px rgba(171, 138, 59, 0.1); }
                .input-area { width: 100%; background: white; border: 1px solid #E2E8F0; border-radius: 0.5rem; padding: 8px 12px; font-size: 13px; transition: all 0.2s; color: #111f42; resize: vertical; min-height: 80px; outline: none; }
                .input-area:focus { border-color: #ab8a3b; box-shadow: 0 0 0 2px rgba(171, 138, 59, 0.1); }

                .animate-fade-in-up { animation: fadeInUp 0.5s ease-out forwards; }
                @keyframes fadeInUp { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }

                .furniture-card { background-color: white; border: 1px solid #E2E8F0; border-radius: 1rem; overflow: hidden; transition: all 0.3s ease; position: relative; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05); }
                .furniture-card:hover { transform: translateY(-4px); box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1); border-color: #ab8a3b; }
            `}</style>
            
            {/* Header */}
            <PageHeader
                title="FURNITURE CATALOGUE"
                subtitle="ฐานข้อมูลสินค้ามาตรฐาน (STD)"
                icon={Armchair}
                rightContent={
                    <div className="flex bg-[#e2e8f0] p-1 border border-slate-200 shadow-inner rounded-xl items-center flex-shrink-0 w-full md:w-auto overflow-hidden">
                        <button onClick={() => { setViewMode('grid'); setCurrentPage(1); }} className={`px-5 py-2.5 text-[11px] font-bold transition-all rounded-lg flex items-center gap-2 uppercase tracking-wide ${viewMode === 'grid' ? 'bg-[#111f42] text-white shadow-md' : 'text-slate-500 hover:bg-slate-50'}`}><LayoutGrid size={14} /> GRID</button>
                        <button onClick={() => { setViewMode('list'); setCurrentPage(1); }} className={`px-5 py-2.5 text-[11px] font-bold transition-all rounded-lg flex items-center gap-2 uppercase tracking-wide ${viewMode === 'list' ? 'bg-[#111f42] text-white shadow-md' : 'text-slate-500 hover:bg-slate-50'}`}><List size={14} /> LIST</button>
                        <button onClick={() => setViewMode('dashboard')} className={`px-5 py-2.5 text-[11px] font-bold transition-all rounded-lg flex items-center gap-2 uppercase tracking-wide ${viewMode === 'dashboard' ? 'bg-[#1e293b] text-white shadow-md' : 'text-slate-500 hover:bg-slate-50'}`}><BarChart2 size={14} /> DASHBOARD</button>
                    </div>
                }
            />

            {/* Main Container */}
            <main className="flex flex-col w-full relative z-10 flex-1">
                {viewMode !== 'dashboard' && (
                    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm flex flex-col lg:flex-row items-center justify-between gap-4 p-4 mt-2">
                        <div className="flex flex-1 items-center gap-3 w-full lg:w-auto overflow-x-auto no-scrollbar">
                            <div className="relative flex-shrink-0">
                                <Filter className="absolute left-3 top-1/2 -translate-y-1/2 text-[#ab8a3b]" size={14} />
                                <select 
                                    value={categoryFilter} 
                                    onChange={(e) => {setCategoryFilter(e.target.value); setCurrentPage(1);}} 
                                    className="appearance-none min-w-[200px] bg-white border border-slate-200 rounded-lg pl-9 pr-8 py-2.5 outline-none focus:border-[#ab8a3b] text-[#111f42] font-bold text-[11px] uppercase tracking-wider shadow-sm transition-all cursor-pointer"
                                >
                                    <option value="All">ALL CATEGORIES ({products.length})</option>
                                    {productCategories?.map(cat => (
                                        <option key={cat} value={cat}>
                                            {cat.toUpperCase()} ({products.filter(p => p.category === cat).length})
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
                                <input type="text" value={searchQuery} onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }} placeholder="Search Catalogue..." className="input-primary pl-9 pr-4 py-2.5 text-[12px] bg-white transition-colors border-slate-200" />
                            </div>
                        </div>
                        <div className="flex gap-3 shrink-0 flex-nowrap items-center ml-auto">
                            <button onClick={() => openModal()} className="py-2.5 rounded-xl text-[12px] font-bold bg-[#111f42] text-white shadow-md flex items-center gap-2 uppercase tracking-wide whitespace-nowrap hover:bg-[#1e346b] transition-all"><Plus size={16} className="text-[#ab8a3b]" /> ADD FURNITURE</button>
                        </div>
                    </div>
                )}

                {/* Scrollable Content */}
                <div className="flex-1 w-full mt-4">
                    {viewMode === 'dashboard' ? (
                        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 mt-2">
                           <CatalogueDashboard products={products} />
                        </div>
                    ) : viewMode === 'grid' ? (
                        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 flex flex-col min-h-[400px]">
                            <CatalogueGrid products={paginatedProducts} onEdit={openModal} />
                            
                            {/* Footer Pagination */}
                            <div className="mt-6 pt-4 border-t border-slate-100 flex flex-col md:flex-row justify-between items-center gap-4 flex-shrink-0">
                                <div className="flex items-center gap-2 text-[11px] text-slate-500 font-bold uppercase tracking-wider">
                                    <span>Rows:</span>
                                    <select value={itemsPerPage} onChange={(e) => { setItemsPerPage(Number(e.target.value)); setCurrentPage(1); }} className="bg-white border border-slate-200 rounded-md px-2 py-1 outline-none text-[#111f42]">
                                        <option value={8}>8</option><option value={12}>12</option><option value={24}>24</option>
                                    </select>
                                </div>
                                <div className="flex items-center gap-2">
                                    <button onClick={prevPage} disabled={currentPage === 1} className="p-2 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 disabled:opacity-30 text-slate-500 transition-all"><ChevronLeft size={16} /></button>
                                    <span className="text-[11px] font-bold text-[#111f42] bg-white border border-slate-200 py-2.5 rounded-lg shadow-sm uppercase tracking-widest">PAGE {currentPage} / {totalPages}</span>
                                    <button onClick={nextPage} disabled={currentPage === totalPages} className="p-2 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 disabled:opacity-30 text-slate-500 transition-all"><ChevronRight size={16} /></button>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <CatalogueTable products={filteredProducts} onEdit={openModal} />
                    )}
                </div>
            </main>

            {/* Modal */}
            <CatalogueActionModal 
                show={showModal}
                onClose={closeModal}
                isEditing={isEditing}
                form={form}
                setForm={setForm}
                activeTab={activeModalTab}
                setActiveTab={setActiveModalTab}
                productCategories={productCategories}
                itemMasterFG={itemMasterFG}
                onSave={handleSave}
                onDelete={deleteProduct}
            />
        </div>
    );
}

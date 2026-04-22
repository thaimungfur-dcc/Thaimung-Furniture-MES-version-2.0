import React, { useState, useMemo, useRef } from 'react';
import { 
    ClipboardCheck, HelpCircle, Flame, Activity, PaintBucket, Wrench, 
    Layers, Shirt, ClipboardList, Settings, X, Plus, Save, LayoutGrid, List
} from 'lucide-react';
import { PageHeader } from '../../components/shared/PageHeader';
import { 
    Category, Product, InspectionStandard, AppState, ViewMode, ModalMode 
} from './types';
import { 
    MAIN_CATEGORIES, ITEM_MASTER_DB, DEFAULT_CATEGORY_STEPS 
} from './constants';
import CategoryView from './components/CategoryView';
import ProductListView from './components/ProductListView';
import ProductDetailView from './components/ProductDetailView';
import ActionModal from './components/ActionModal';
import GuideDrawer from './components/GuideDrawer';

export default function InspectionStandards() {
    // --- State ---
    const [viewMode, setViewMode] = useState<ViewMode>('grid');
    const [appState, setAppState] = useState<AppState>('categories');
    const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
    const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
    const [activeDetailTab, setActiveDetailTab] = useState('dimensions');
    const [zoomLevel, setZoomLevel] = useState(100);
    const [isFit, setIsFit] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    
    const [showModal, setShowModal] = useState(false);
    const [modalMode, setModalMode] = useState<ModalMode>('standard');
    const [isEditing, setIsEditing] = useState(false);
    
    const [showConfigModal, setShowConfigModal] = useState(false);
    const [previewImage, setPreviewImage] = useState<string | null>(null);
    const [isGuideOpen, setIsGuideOpen] = useState(false);
    
    // Process Steps Configuration
    const [categorySteps, setCategorySteps] = useState(DEFAULT_CATEGORY_STEPS);
    const [configCategory, setConfigCategory] = useState<keyof typeof DEFAULT_CATEGORY_STEPS>('Laundry');
    const [newProcessName, setNewProcessName] = useState('');

    const [products, setProducts] = useState<Product[]>([
        { id: 1, code: 'FG-LD-001', name: 'ราวตากผ้าสแตนเลส (รุ่นพับได้)', category: 'clothes_rack', status: 'Active', image: 'https://img.lazcdn.com/g/p/34e7a032d760b1c364f89257709b64c2.png_720x720q80.png', dimensionImage: null },
        { id: 2, code: 'FG-LD-002', name: 'ราวแขวนผ้าบาร์คู่ (ล้อเลื่อน)', category: 'clothes_rack', status: 'Active', image: 'https://th-live.slatic.net/p/97a2344704633a1f437198d7f01ba0b5.jpg', dimensionImage: 'https://www.ikea.com/th/th/images/products/mulig-clothes-rack-white__1432098_pe982712_s5.jpg?f=s' },
    ]);

    const [standards, setStandards] = useState<InspectionStandard[]>([
        { id: 201, productId: 2, process: 'Welding', point: 'ข้อต่อมุมฉากฐานล้อ', criteria: 'เชื่อมพอกเต็ม 2 ด้าน แข็งแรง', tolerance: 'ความนูน 1-2mm', method: 'Visual', tool: 'Weld Gauge', image: 'https://www.ikea.com/th/th/images/products/mulig-clothes-rack-white__0710688_pe727725_s5.jpg?f=s' },
    ]);

    const [standardForm, setStandardForm] = useState<InspectionStandard>({ id: 0, productId: 0, process: '', point: '', criteria: '', tolerance: '', method: '', tool: '', image: null });
    const [productForm, setProductForm] = useState<Product>({ id: 0, code: '', name: '', category: '', status: 'Active', image: null, dimensionImage: null });

    const fileInputRef = useRef<HTMLInputElement>(null);
    const dimensionFileInputRef = useRef<HTMLInputElement>(null);

    // --- Computed ---
    const currentSteps = useMemo(() => {
        if (!selectedProduct) return [];
        const catInfo = MAIN_CATEGORIES.find(c => c.id === selectedProduct.category);
        return categorySteps[catInfo?.type as keyof typeof categorySteps || 'General'] || [];
    }, [selectedProduct, categorySteps]);

    const filteredProducts = useMemo(() => {
        let res = products;
        if (selectedCategory) res = res.filter(p => p.category === selectedCategory.id);
        if (searchQuery) {
            const q = searchQuery.toLowerCase();
            res = res.filter(p => p.name.toLowerCase().includes(q) || p.code.toLowerCase().includes(q));
        }
        return res;
    }, [products, selectedCategory, searchQuery]);

    const filteredStandards = useMemo(() => {
        if (!selectedProduct) return [];
        return standards.filter(std => std.productId === selectedProduct.id && std.process === activeDetailTab);
    }, [standards, selectedProduct, activeDetailTab]);

    const getProcessIcon = (proc: string) => {
        switch(proc) {
            case 'Welding': return Flame;
            case 'Bending': return Activity;
            case 'Coating': return PaintBucket;
            case 'Assembly': return Wrench;
            case 'Packaging': return Layers;
            case 'Cutting & Sewing': return Shirt;
            default: return ClipboardList;
        }
    };

    // --- Handlers ---
    const selectCategory = (category: Category) => { 
        setSelectedCategory(category); 
        setAppState('items'); 
        setSearchQuery(''); 
    };

    const selectProduct = (product: Product) => { 
        setSelectedProduct(product); 
        setAppState('detail'); 
        setActiveDetailTab('dimensions'); 
        setZoomLevel(100); 
        setIsFit(true); 
    };

    const goBack = () => { 
        if (appState === 'detail') { 
            setAppState('items'); 
            setSelectedProduct(null); 
        } else if (appState === 'items') { 
            setAppState('categories'); 
            setSelectedCategory(null); 
            setSearchQuery(''); 
        } 
    };

    const zoomIn = (e: React.MouseEvent) => { e.stopPropagation(); setIsFit(false); setZoomLevel(prev => Math.min(prev + 25, 300)); };
    const zoomOut = (e: React.MouseEvent) => { e.stopPropagation(); setIsFit(false); setZoomLevel(prev => Math.max(prev - 25, 25)); };
    const resetZoom = (e: React.MouseEvent) => { e.stopPropagation(); setIsFit(true); setZoomLevel(100); };

    const openStandardModal = (std: InspectionStandard | null = null) => {
        setModalMode('standard');
        const initialProcess = activeDetailTab === 'dimensions' ? (currentSteps[0] || 'Welding') : activeDetailTab;
        if (std) { 
            setIsEditing(true); 
            setStandardForm({ ...std }); 
        }
        else { 
            setIsEditing(false); 
            setStandardForm({ 
                id: Date.now(), 
                productId: selectedProduct?.id || 0, 
                process: initialProcess, 
                point: '', 
                criteria: '', 
                tolerance: '', 
                method: 'Visual Inspection', 
                tool: '', 
                image: null 
            }); 
        }
        setShowModal(true);
    };

    const openProductModal = (product: Product | null = null) => {
        setModalMode('product');
        if (product) { 
            setIsEditing(true); 
            setProductForm({ ...product }); 
        }
        else { 
            setIsEditing(false); 
            setProductForm({ 
                id: Date.now(), 
                code: '', 
                name: '', 
                category: selectedCategory?.id || '', 
                status: 'Active', 
                image: null,
                dimensionImage: null
            }); 
        }
        setShowModal(true);
    };

    const handleItemMasterSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const item = ITEM_MASTER_DB.find(i => i.itemCode === e.target.value);
        if (item) setProductForm(prev => ({ ...prev, code: item.itemCode, name: item.itemName, category: item.category }));
    };

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                if (modalMode === 'product') setProductForm(prev => ({ ...prev, image: reader.result as string }));
                else setStandardForm(prev => ({ ...prev, image: reader.result as string }));
            };
            reader.readAsDataURL(file);
        }
    };

    const handleDimensionImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                const updatedProducts = products.map(p => p.id === selectedProduct?.id ? { ...p, dimensionImage: reader.result as string } : p);
                setProducts(updatedProducts);
                if (selectedProduct) {
                    setSelectedProduct({ ...selectedProduct, dimensionImage: reader.result as string });
                }
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSave = () => {
        if (modalMode === 'product') {
            if (!productForm.name || !productForm.code) return window.alert('โปรดกรอกรหัสและชื่อสินค้า');
            if (isEditing) {
                setProducts(prev => prev.map(p => p.id === productForm.id ? productForm : p));
                if (selectedProduct && selectedProduct.id === productForm.id) {
                    setSelectedProduct(productForm);
                }
            } else {
                setProducts(prev => [{...productForm, id: Date.now()}, ...prev]);
            }
        } else {
            if (!standardForm.point || !standardForm.criteria) return window.alert('โปรดกรอกข้อมูลจุดตรวจสอบและเกณฑ์ยอมรับ');
            if (isEditing) {
                setStandards(prev => prev.map(s => s.id === standardForm.id ? standardForm : s));
            } else {
                setStandards(prev => [{...standardForm, id: Date.now()}, ...prev]);
            }
        }
        setShowModal(false);
    };

    const deleteProduct = (id: number) => {
        if (window.confirm('ยืนยันการลบสินค้าและมาตรฐานทั้งหมด?')) {
            setProducts(prev => prev.filter(p => p.id !== id));
            setStandards(prev => prev.filter(s => s.productId !== id));
            setShowModal(false);
            if (appState === 'detail') setAppState('items');
        }
    };

    const deleteStandard = (id: number) => {
        if (window.confirm('ยืนยันการลบจุดตรวจสอบนี้?')) {
            setStandards(prev => prev.filter(s => s.id !== id));
        }
    };

    const duplicateProduct = (e: React.MouseEvent, product: Product) => {
        e.stopPropagation();
        if (window.confirm(`คัดลอกมาตรฐานของ "${product.name}"?`)) {
            const newId = Date.now();
            const newProduct = { ...product, id: newId, name: product.name + ' (Copy)', code: product.code + '-CP', status: 'In Development' };
            const newStandards = standards.filter(s => s.productId === product.id).map(s => ({ ...s, id: Date.now() + Math.random(), productId: newId }));
            setProducts([newProduct, ...products]);
            setStandards([...standards, ...newStandards]);
        }
    };

    const addProcess = () => {
        if (newProcessName && !categorySteps[configCategory].includes(newProcessName)) {
            setCategorySteps(prev => ({ ...prev, [configCategory]: [...prev[configCategory], newProcessName] }));
            setNewProcessName('');
        }
    };

    const removeProcess = (proc: string) => {
        if (window.confirm(`ลบขั้นตอน ${proc}?`)) {
            setCategorySteps(prev => ({ ...prev, [configCategory]: prev[configCategory].filter(p => p !== proc) }));
            if (activeDetailTab === proc) setActiveDetailTab('dimensions');
        }
    };

    return (
        <div className="w-full space-y-4 relative flex-1 flex flex-col animate-fade-in-up bg-[#F9F7F6]">
            <style>{`
                .minimal-th { font-size: 11px; text-transform: uppercase; letter-spacing: 0.1em; color: #FFFFFF; padding: 12px 14px; font-weight: 800; background-color: #111f42; white-space: nowrap; }
                .minimal-td { padding: 10px 14px; vertical-align: middle; color: #111f42; font-size: 12px !important; font-weight: 500; border-bottom: 1px solid #F1F5F9; }
                
                .tab-btn { padding: 0.75rem 1.25rem; font-size: 0.7rem; font-weight: 800; border-bottom: 3px solid transparent; transition: all 0.2s; white-space: nowrap; display: flex; align-items: center; gap: 0.5rem; color: #94A3B8; text-transform: uppercase; letter-spacing: 0.05em; }
                .tab-btn.active { color: #111f42; border-color: #111f42; background-color: rgba(17, 31, 66, 0.05); }
                
                .modern-category-card { background: white; border-radius: 20px; border: 1px solid #E2E8F0; transition: all 0.3s ease; cursor: pointer; display: flex; flex-direction: column; height: 190px; position: relative; overflow: hidden; padding: 1.25rem; }
                .modern-category-card:hover { transform: translateY(-4px); border-color: #111f42; box-shadow: 0 10px 20px -5px rgba(17,31,66,0.08); }
                
                .icon-circle { width: 56px; height: 56px; display: flex; align-items: center; justify-content: center; background: #f8fafc; border-radius: 16px; transition: all 0.4s; }
                .modern-category-card:hover .icon-circle { background: #111f42; color: white; transform: scale(1.1) rotate(-5deg); }
                
                .product-card { background: white; border-radius: 14px; border: 1px solid #E2E8F0; overflow: hidden; transition: all 0.3s; cursor: pointer; }
                .product-card:hover { transform: translateY(-4px); border-color: #111f42; box-shadow: 0 8px 16px -4px rgba(0,0,0,0.08); }

                .input-primary { width: 100%; background: white; border: 1px solid #E2E8F0; border-radius: 0.5rem; padding: 8px 12px; font-size: 13px; color: #111f42; outline: none; transition: border 0.2s; }
                .input-primary:focus { border-color: #111f42; box-shadow: 0 0 0 2px rgba(17,31,66,0.08); }
                
                .modal-overlay { position: fixed; inset: 0; background: rgba(17, 31, 66, 0.5); backdrop-filter: blur(4px); z-index: 10001; display: flex; justify-content: center; align-items: center; padding: 1rem; }
                .animate-fade-in-up { animation: fadeInUp 0.3s ease-out forwards; }
                @keyframes fadeInUp { from { opacity: 0; transform: translateY(15px); } to { opacity: 1; transform: translateY(0); } }
            `}</style>

            <div className="flex flex-col w-full h-full relative z-10 px-0">
                {/* Header */}
                <PageHeader 
                    title="QC SPEC MASTER" 
                    subtitle="Inspection Hub"
                    icon={ClipboardCheck}
                    rightContent={
                        appState === 'items' && (
                            <div className="flex bg-[#e2e8f0] p-1 border border-slate-200 shadow-inner rounded-xl items-center flex-shrink-0 overflow-hidden h-9">
                                <button onClick={() => setViewMode('grid')} className={`px-4 py-1.5 text-[10px] font-bold transition-all rounded-lg flex items-center gap-2 uppercase tracking-wide ${viewMode === 'grid' ? 'bg-[#111f42] text-white shadow-sm' : 'text-slate-500 hover:bg-slate-50'}`}><LayoutGrid size={13} /> GRID</button>
                                <button onClick={() => setViewMode('list')} className={`px-4 py-1.5 text-[10px] font-bold transition-all rounded-lg flex items-center gap-2 uppercase tracking-wide ${viewMode === 'list' ? 'bg-[#1e293b] text-white shadow-sm' : 'text-slate-500 hover:bg-slate-50'}`}><List size={13} /> LIST</button>
                            </div>
                        )
                    }
                    actionButton={
                        <button onClick={() => setIsGuideOpen(true)} className="p-2 transition-all rounded-xl bg-white text-slate-400 hover:bg-[#111f42] hover:text-white border border-slate-200 shadow-sm">
                            <HelpCircle size={18} />
                        </button>
                    }
                />

                <main className="flex-1 overflow-y-auto master-custom-scrollbar relative z-10">
                    {appState === 'categories' && (
                        <CategoryView 
                            products={products} 
                            onSelectCategory={selectCategory} 
                        />
                    )}

                    {appState === 'items' && (
                        <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-6">
                            <ProductListView 
                                selectedCategory={selectedCategory}
                                filteredProducts={filteredProducts}
                                viewMode={viewMode}
                                searchQuery={searchQuery}
                                setSearchQuery={setSearchQuery}
                                onGoBack={goBack}
                                onSelectProduct={selectProduct}
                                onOpenProductModal={openProductModal}
                                onDuplicateProduct={duplicateProduct}
                            />
                        </div>
                    )}

                    {appState === 'detail' && selectedProduct && (
                        <ProductDetailView 
                            selectedProduct={selectedProduct}
                            selectedCategory={selectedCategory}
                            activeDetailTab={activeDetailTab}
                            currentSteps={currentSteps}
                            filteredStandards={filteredStandards}
                            zoomLevel={zoomLevel}
                            isFit={isFit}
                            onGoBack={goBack}
                            onOpenProductModal={openProductModal}
                            onSetActiveDetailTab={setActiveDetailTab}
                            onOpenConfigModal={() => setShowConfigModal(true)}
                            onZoomIn={zoomIn}
                            onZoomOut={zoomOut}
                            onResetZoom={resetZoom}
                            onDimensionImageClick={() => dimensionFileInputRef.current?.click()}
                            onOpenStandardModal={openStandardModal}
                            onDeleteStandard={deleteStandard}
                            onPreviewImage={setPreviewImage}
                            getProcessIcon={getProcessIcon}
                        />
                    )}
                </main>

                {/* Modals & Overlays */}
                <ActionModal 
                    showModal={showModal}
                    modalMode={modalMode}
                    isEditing={isEditing}
                    selectedCategory={selectedCategory}
                    activeDetailTab={activeDetailTab}
                    productForm={productForm}
                    standardForm={standardForm}
                    fileInputRef={fileInputRef}
                    onClose={() => setShowModal(false)}
                    onSave={handleSave}
                    onDeleteProduct={deleteProduct}
                    onImageUpload={handleImageUpload}
                    onProductFormChange={(f, v) => setProductForm(prev => ({ ...prev, [f]: v }))}
                    onStandardFormChange={(f, v) => setStandardForm(prev => ({ ...prev, [f]: v }))}
                    onItemMasterSelect={handleItemMasterSelect}
                />

                {/* Config Modal */}
                {showConfigModal && (
                    <div className="modal-overlay" onClick={() => setShowConfigModal(false)}>
                        <div className="modal-box w-full max-w-md border-t-[6px] border-[#111f42] rounded-2xl animate-fade-in-up" onClick={e => e.stopPropagation()}>
                            <div className="p-5 bg-[#111f42] flex justify-between items-center text-white">
                                <h3 className="text-lg font-black uppercase tracking-tight flex items-center gap-2"><Settings size={20} className="text-slate-400"/> Process Config</h3>
                                <button onClick={() => setShowConfigModal(false)} className="p-1.5 hover:bg-white/10 rounded-lg transition-colors"><X size={20} /></button>
                            </div>
                            <div className="p-6 bg-[#F9F7F6] space-y-4">
                                <div>
                                    <label className="block text-[10px] font-black text-slate-400 uppercase mb-1 font-mono">Category Type</label>
                                    <select 
                                        value={configCategory} 
                                        onChange={(e) => setConfigCategory(e.target.value as any)} 
                                        className="input-primary font-bold bg-white"
                                    >
                                        {Object.keys(categorySteps).map(k => <option key={k} value={k}>{k}</option>)}
                                    </select>
                                </div>
                                <div className="space-y-2">
                                    <label className="block text-[10px] font-black text-slate-400 uppercase mb-1 font-mono">Current Steps</label>
                                    <div className="flex flex-wrap gap-2">
                                        {categorySteps[configCategory].map(proc => (
                                            <div key={proc} className="bg-white border border-slate-200 px-3 py-1.5 rounded-lg flex items-center gap-2 shadow-sm">
                                                <span className="text-[11px] font-bold text-[#111f42]">{proc}</span>
                                                <button onClick={() => removeProcess(proc)} className="text-slate-300 hover:text-rose-500 transition"><X size={12} /></button>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                                <div className="pt-2">
                                    <label className="block text-[10px] font-black text-slate-400 uppercase mb-1 font-mono">Add New Step</label>
                                    <div className="flex gap-2">
                                        <input 
                                            value={newProcessName} 
                                            onChange={(e) => setNewProcessName(e.target.value)} 
                                            className="input-primary flex-1" 
                                            placeholder="Step name..." 
                                        />
                                        <button onClick={addProcess} className="bg-[#111f42] text-white px-4 rounded-lg font-black text-[10px] uppercase shadow-sm"><Plus size={16}/></button>
                                    </div>
                                </div>
                            </div>
                            <div className="p-4 border-t bg-white flex justify-end rounded-b-2xl">
                                <button onClick={() => setShowConfigModal(false)} className="bg-[#111f42] text-white px-8 py-2 rounded-xl font-black text-[10px] uppercase tracking-widest shadow-md">Close</button>
                            </div>
                        </div>
                    </div>
                )}

                {/* Lightbox Preview */}
                {previewImage && (
                    <div className="fixed inset-0 bg-[#111f42]/90 backdrop-blur-md z-[10010] flex items-center justify-center p-8" onClick={() => setPreviewImage(null)}>
                        <div className="relative max-w-full max-h-full animate-fade-in" onClick={e => e.stopPropagation()}>
                            <button onClick={() => setPreviewImage(null)} className="absolute -top-12 -right-12 text-white/50 hover:text-white transition-all"><X size={40}/></button>
                            <img src={previewImage} className="max-w-full max-h-[85vh] object-contain rounded-2xl shadow-2xl border-4 border-white/10" alt="Full Preview" />
                        </div>
                    </div>
                )}

                <GuideDrawer isOpen={isGuideOpen} onClose={() => setIsGuideOpen(false)} />
                
                <input type="file" ref={dimensionFileInputRef} className="hidden" accept="image/*" onChange={handleDimensionImageUpload} />
            </div>
        </div>
    );
}

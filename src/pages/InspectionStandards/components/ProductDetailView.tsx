import React from 'react';
import { 
    ArrowLeft, Pencil, Ruler, Settings, Minus, Plus, Maximize, 
    ImagePlus, Search, Trash2, Wrench, ClipboardList
} from 'lucide-react';
import { Category, Product, InspectionStandard } from '../types';

interface ProductDetailViewProps {
    selectedProduct: Product;
    selectedCategory: Category | null;
    activeDetailTab: string;
    currentSteps: string[];
    filteredStandards: InspectionStandard[];
    zoomLevel: number;
    isFit: boolean;
    onGoBack: () => void;
    onOpenProductModal: (product: Product) => void;
    onSetActiveDetailTab: (tab: string) => void;
    onOpenConfigModal: () => void;
    onZoomIn: (e: React.MouseEvent) => void;
    onZoomOut: (e: React.MouseEvent) => void;
    onResetZoom: (e: React.MouseEvent) => void;
    onDimensionImageClick: () => void;
    onOpenStandardModal: (std?: InspectionStandard) => void;
    onDeleteStandard: (id: number) => void;
    onPreviewImage: (img: string) => void;
    getProcessIcon: (proc: string) => any;
}

export default function ProductDetailView({
    selectedProduct,
    selectedCategory,
    activeDetailTab,
    currentSteps,
    filteredStandards,
    zoomLevel,
    isFit,
    onGoBack,
    onOpenProductModal,
    onSetActiveDetailTab,
    onOpenConfigModal,
    onZoomIn,
    onZoomOut,
    onResetZoom,
    onDimensionImageClick,
    onOpenStandardModal,
    onDeleteStandard,
    onPreviewImage,
    getProcessIcon
}: ProductDetailViewProps) {
    return (
        <div className="animate-fade-in flex flex-col h-full max-w-7xl mx-auto">
            <div className="flex items-center gap-3 mb-3 bg-white p-3 rounded-2xl border border-slate-200 shadow-sm shrink-0">
                <button 
                    onClick={onGoBack} 
                    className="w-8 h-8 flex items-center justify-center rounded-lg bg-slate-100 text-slate-500 hover:bg-[#111f42] hover:text-white transition shadow-sm"
                >
                    <ArrowLeft size={16} />
                </button>
                <div className="w-10 h-10 rounded-lg bg-slate-50 border border-slate-200 overflow-hidden flex-shrink-0">
                    {selectedProduct.image ? (
                        <img src={selectedProduct.image} className="w-full h-full object-cover" alt={selectedProduct.name} />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center text-slate-300">
                            <ClipboardList size={20} />
                        </div>
                    )}
                </div>
                <div className="flex-1">
                    <h2 className="text-lg font-black text-[#111f42] uppercase tracking-tight leading-tight">{selectedProduct.name}</h2>
                    <p className="text-[9px] text-slate-400 font-mono font-bold mt-0.5 tracking-widest uppercase">{selectedProduct.code} • {selectedCategory?.name}</p>
                </div>
                <button 
                    onClick={() => onOpenProductModal(selectedProduct)} 
                    className="px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-[10px] font-black text-[#ab8a3b] uppercase tracking-widest hover:bg-slate-100 transition-all flex items-center gap-2"
                >
                    <Pencil size={12}/> Edit Info
                </button>
            </div>

            <div className="flex-1 flex flex-col bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden min-h-0">
                {/* Navigation Bar - Compact */}
                <div className="flex justify-between items-center border-b border-slate-100 bg-slate-50/30 px-1 overflow-x-auto no-scrollbar shrink-0 h-11">
                    <div className="flex h-full">
                        <button 
                            onClick={() => onSetActiveDetailTab('dimensions')} 
                            className={`tab-btn h-full ${activeDetailTab === 'dimensions' ? 'active' : ''}`}
                        >
                            <Ruler size={14} /> Dims
                        </button>
                        <div className="w-px h-4 bg-slate-200 mx-1 self-center"></div>
                        {currentSteps.map(proc => {
                            const Icon = getProcessIcon(proc);
                            return (
                                <button 
                                    key={proc} 
                                    onClick={() => onSetActiveDetailTab(proc)} 
                                    className={`tab-btn h-full ${activeDetailTab === proc ? 'active' : ''}`}
                                >
                                    <Icon size={14} /> {proc}
                                </button>
                            );
                        })}
                    </div>
                    <button 
                        onClick={onOpenConfigModal} 
                        className="p-2.5 text-slate-300 hover:text-[#111f42] transition mr-1"
                    >
                        <Settings size={18} />
                    </button>
                </div>

                <div className={`flex-1 overflow-hidden relative ${activeDetailTab === 'dimensions' ? 'p-2' : 'p-4'}`}>
                    {activeDetailTab === 'dimensions' ? (
                        <div className="flex flex-col h-full w-full bg-slate-100 rounded-xl relative overflow-hidden group">
                            {/* Zoom Controls */}
                            <div className="absolute top-3 right-3 z-20 flex gap-2">
                                <div className="bg-white/90 backdrop-blur border border-slate-200 rounded-xl shadow-sm flex items-center p-0.5">
                                    <button onClick={onZoomOut} className="p-1.5 hover:bg-slate-100 rounded text-[#111f42]"><Minus size={14}/></button>
                                    <span className="w-12 text-center text-[10px] font-mono font-black text-[#ab8a3b]">{isFit ? 'FIT' : `${zoomLevel}%`}</span>
                                    <button onClick={onZoomIn} className="p-1.5 hover:bg-slate-100 rounded text-[#111f42]"><Plus size={14}/></button>
                                </div>
                                <button 
                                    onClick={onResetZoom} 
                                    className={`bg-white/90 backdrop-blur border border-slate-200 rounded-xl shadow-sm p-1.5 transition ${isFit ? 'text-[#ab8a3b]' : 'text-slate-400'}`}
                                >
                                    <Maximize size={16}/>
                                </button>
                            </div>

                            <div 
                                className="w-full h-full overflow-auto master-custom-scrollbar flex items-center justify-center p-2 cursor-pointer" 
                                onClick={onDimensionImageClick}
                            >
                                {selectedProduct.dimensionImage ? (
                                    <img 
                                        src={selectedProduct.dimensionImage} 
                                        className={`transition-all duration-300 ${isFit ? 'max-w-full max-h-full object-contain' : ''}`} 
                                        style={!isFit ? { width: `${zoomLevel}%`, maxWidth: 'none' } : {}} 
                                        alt="Specs" 
                                    />
                                ) : (
                                    <div className="flex flex-col items-center gap-2 text-slate-300">
                                        <ImagePlus size={48} strokeWidth={1} />
                                        <p className="text-[11px] font-black uppercase tracking-widest font-mono">Upload Dimension Specs</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    ) : (
                        <div className="flex flex-col h-full">
                            <div className="flex justify-between items-center mb-4 shrink-0">
                                <h3 className="text-[14px] font-black text-[#111f42] uppercase tracking-widest flex items-center gap-2">
                                    <span className="w-1.5 h-6 bg-[#ab8a3b] rounded-full"></span> {activeDetailTab} Checkpoints
                                </h3>
                                <button 
                                    onClick={() => onOpenStandardModal()} 
                                    className="h-8 bg-[#111f42] text-[#ab8a3b] px-4 rounded-lg text-[10px] font-black shadow-md hover:brightness-110 transition flex items-center gap-2 uppercase tracking-widest"
                                >
                                    <Plus size={14} strokeWidth={3} /> Add Point
                                </button>
                            </div>
                            <div className="flex-1 overflow-y-auto master-custom-scrollbar pr-1 pb-4">
                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                                    {filteredStandards.map(std => (
                                        <div key={std.id} className="group flex h-40 border border-slate-200 rounded-xl overflow-hidden bg-white hover:border-[#ab8a3b] transition-all shadow-sm">
                                            <div className="w-36 bg-slate-100 relative overflow-hidden border-r border-slate-100 shrink-0">
                                                {std.image ? (
                                                    <img src={std.image} className="w-full h-full object-cover" alt="Point" />
                                                ) : (
                                                    <div 
                                                        className="w-full h-full flex flex-col items-center justify-center text-slate-300 gap-1 cursor-pointer" 
                                                        onClick={() => onOpenStandardModal(std)}
                                                    >
                                                        <ImagePlus size={20}/>
                                                        <span className="text-[7px] font-black uppercase">No Image</span>
                                                    </div>
                                                )}
                                                <div 
                                                    className="absolute inset-0 bg-black/0 hover:bg-black/5 transition cursor-pointer" 
                                                    onClick={() => onOpenStandardModal(std)}
                                                ></div>
                                                {std.image && (
                                                    <button 
                                                        onClick={(e) => { e.stopPropagation(); onPreviewImage(std.image!); }} 
                                                        className="absolute bottom-1.5 right-1.5 w-6 h-6 bg-white/90 rounded-full flex items-center justify-center text-[#111f42] shadow-md hover:scale-110 transition z-20 border border-slate-200"
                                                    >
                                                        <Search size={12} />
                                                    </button>
                                                )}
                                            </div>
                                            <div className="flex-1 p-3 flex flex-col min-w-0">
                                                <div className="flex justify-between items-start mb-1.5">
                                                    <h4 className="font-black text-[#111f42] text-[12px] line-clamp-1 uppercase tracking-tight">{std.point}</h4>
                                                    <div className="flex gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
                                                        <button onClick={() => onOpenStandardModal(std)} className="p-1 text-slate-400 hover:text-[#ab8a3b] transition"><Pencil size={13}/></button>
                                                        <button onClick={() => onDeleteStandard(std.id)} className="p-1 text-slate-400 hover:text-[#E3624A] transition"><Trash2 size={13}/></button>
                                                    </div>
                                                </div>
                                                <div className="space-y-1.5 flex-1 overflow-y-auto no-scrollbar pr-0.5">
                                                    <div className="bg-emerald-50/50 p-2 rounded-lg border border-emerald-100">
                                                        <p className="text-[7px] text-emerald-700 font-black uppercase mb-0.5 tracking-wider">Criteria</p>
                                                        <p className="text-[10.5px] text-[#111f42] font-medium leading-tight">{std.criteria}</p>
                                                    </div>
                                                    <div className="grid grid-cols-2 gap-2">
                                                        <div className="bg-slate-50 p-1.5 rounded-lg border border-slate-100">
                                                            <p className="text-[7px] text-slate-400 font-bold uppercase mb-0.5">Tol</p>
                                                            <p className="text-[10px] font-mono font-bold text-[#111f42] truncate">{std.tolerance || '-'}</p>
                                                        </div>
                                                        <div className="bg-slate-50 p-1.5 rounded-lg border border-slate-100">
                                                            <p className="text-[7px] text-slate-400 font-bold uppercase mb-0.5">Tool</p>
                                                            <p className="text-[10px] font-bold text-[#111f42] truncate flex items-center gap-1">
                                                                <Wrench size={8} className="text-[#ab8a3b]" /> {std.tool || std.method}
                                                            </p>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

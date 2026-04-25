import React from 'react';
import { ArrowLeft, Search, Plus, LayoutGrid, List, Pencil, Copy, ArrowRight } from 'lucide-react';
import { ColumnDef } from '@tanstack/react-table';
import { Category, Product, ViewMode } from '../types';
import { DataTable } from '../../../components/shared/DataTable';

interface ProductListViewProps {
    selectedCategory: Category | null;
    filteredProducts: Product[];
    viewMode: ViewMode;
    searchQuery: string;
    setSearchQuery: (q: string) => void;
    onGoBack: () => void;
    onSelectProduct: (product: Product) => void;
    onOpenProductModal: (product?: Product) => void;
    onDuplicateProduct: (e: React.MouseEvent, product: Product) => void;
}

export default function ProductListView({
    selectedCategory,
    filteredProducts,
    viewMode,
    searchQuery,
    setSearchQuery,
    onGoBack,
    onSelectProduct,
    onOpenProductModal,
    onDuplicateProduct
}: ProductListViewProps) {

    const columns: ColumnDef<Product>[] = [
        {
            accessorKey: 'image',
            header: 'PREVIEW',
            cell: ({ row }) => {
                const product = row.original;
                return (
                    <div 
                       className="w-10 h-10 rounded-lg bg-slate-100 overflow-hidden border border-slate-200 cursor-pointer"
                       onClick={() => onSelectProduct(product)}
                    >
                        {product.image ? (
                            <img src={product.image} className="w-full h-full object-cover" alt={product.name} />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center text-slate-300">
                                <LayoutGrid size={16} />
                            </div>
                        )}
                    </div>
                );
            }
        },
        {
            accessorKey: 'code',
            header: 'CODE',
            cell: ({ row }) => {
                const product = row.original;
                return (
                    <span 
                      className="font-mono font-black text-[#ab8a3b] cursor-pointer hover:underline"
                      onClick={() => onSelectProduct(product)}
                    >
                      {product.code}
                    </span>
                );
            }
        },
        {
            accessorKey: 'name',
            header: 'PRODUCT NAME',
            cell: ({ row }) => {
                const product = row.original;
                return (
                    <span 
                      className="font-bold text-[13px] text-[#111f42] cursor-pointer hover:text-[#ab8a3b]"
                      onClick={() => onSelectProduct(product)}
                    >
                      {product.name}
                    </span>
                );
            }
        },
        {
            accessorKey: 'status',
            header: 'STATUS',
            cell: ({ row }) => {
                const product = row.original;
                return (
                    <span className={`px-2 py-0.5 rounded text-[8px] font-black uppercase tracking-wider ${product.status === 'Active' ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' : 'bg-slate-100 text-slate-400'}`}>
                        {product.status}
                    </span>
                );
            }
        },
        {
            id: 'action',
            header: 'ACTION',
            cell: ({ row }) => {
                const product = row.original;
                return (
                    <div className="flex gap-1">
                        <button 
                            onClick={(e) => { e.stopPropagation(); onOpenProductModal(product); }} 
                            className="p-1.5 rounded-lg text-slate-400 hover:text-[#ab8a3b] hover:bg-slate-100 transition-colors"
                        >
                            <Pencil size={14} />
                        </button>
                        <button 
                            onClick={() => onSelectProduct(product)}
                            className="p-1.5 rounded-lg text-[#ab8a3b] hover:bg-[#ab8a3b] hover:text-white transition-colors"
                        >
                            <ArrowRight size={16} />
                        </button>
                    </div>
                );
            }
        }
    ];

    return (
        <div className="animate-fade-in flex flex-col h-full w-full">
            <div className="flex items-center gap-3 mb-3 bg-white p-3 rounded-2xl border border-slate-200 shadow-sm shrink-0">
                <button 
                    onClick={onGoBack} 
                    className="w-8 h-8 flex items-center justify-center rounded-lg bg-slate-100 text-slate-500 hover:bg-[#111f42] hover:text-white transition shadow-sm"
                >
                    <ArrowLeft size={16} />
                </button>
                <h2 className="text-lg font-black text-[#111f42] uppercase tracking-widest">
                    {selectedCategory?.name} 
                    <span className="text-[11px] font-bold text-slate-400 ml-1">({filteredProducts.length})</span>
                </h2>
                
                <div className="ml-auto flex items-center gap-2">
                    {/* Only showing general Search input for backward-compatibility if they use ViewMode Grid. For List view, DataTable has its own search, but we can rely on DataTable's search entirely. For grid, we keep this. */}
                    {viewMode === 'grid' && (
                        <div className="relative lg:w-72 h-9">
                            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                            <input 
                                type="text" 
                                value={searchQuery} 
                                onChange={(e) => setSearchQuery(e.target.value)} 
                                placeholder="Search product..." 
                                className="input-primary pl-9 h-full text-[11px]" 
                            />
                        </div>
                    )}
                    <button 
                        onClick={() => onOpenProductModal()} 
                        className="h-9 px-5 rounded-xl text-[10px] font-black bg-[#111f42] text-[#ab8a3b] shadow-md hover:brightness-110 transition-all uppercase tracking-widest flex items-center gap-2 whitespace-nowrap"
                    >
                        <Plus size={14} strokeWidth={3} /> Add Product
                    </button>
                </div>
            </div>

            <div className="flex-1 overflow-y-auto no-scrollbar pb-6">
                {viewMode === 'grid' ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                        {filteredProducts?.map(product => (
                            <div key={product.id} onClick={() => onSelectProduct(product)} className="product-card group">
                                <div className="h-40 bg-slate-100 relative overflow-hidden border-b border-slate-50">
                                    {product.image ? (
                                        <img src={product.image} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" alt={product.name} />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-slate-300">
                                            <LayoutGrid size={40} strokeWidth={1} />
                                        </div>
                                    )}
                                    <div className="absolute top-2 left-2 bg-[#111f42]/80 backdrop-blur-md text-white text-[9px] px-2 py-0.5 rounded font-mono font-bold tracking-wider">{product.code}</div>
                                    <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-all">
                                        <button 
                                            onClick={(e) => { e.stopPropagation(); onOpenProductModal(product); }} 
                                            className="bg-white/90 p-1.5 rounded-lg text-[#ab8a3b] shadow-sm hover:bg-[#ab8a3b] hover:text-white transition"
                                        >
                                            <Pencil size={12} />
                                        </button>
                                        <button 
                                            onClick={(e) => onDuplicateProduct(e, product)} 
                                            className="bg-white/90 p-1.5 rounded-lg text-[#111f42] shadow-sm hover:bg-[#111f42] hover:text-white transition"
                                        >
                                            <Copy size={12} />
                                        </button>
                                    </div>
                                </div>
                                <div className="p-3">
                                    <h3 className="font-bold text-[#111f42] text-[13px] truncate leading-tight">{product.name}</h3>
                                    <div className="mt-3 flex justify-between items-center border-t border-slate-50 pt-2">
                                        <span className={`text-[8px] px-2 py-0.5 rounded font-black uppercase tracking-wider ${product.status === 'Active' ? 'bg-emerald-50 text-emerald-600' : 'bg-slate-100 text-slate-400'}`}>{product.status}</span>
                                        <span className="text-[#ab8a3b] text-[10px] font-black flex items-center gap-1 uppercase font-mono">Specs <ArrowRight size={12}/></span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="w-full">
                        <DataTable 
                           data={filteredProducts} 
                           columns={columns} 
                           fileName={`${selectedCategory?.name}_Products`} 
                           searchPlaceholder="Search Product Code, Name..."
                           itemsPerPage={15}
                        />
                    </div>
                )}
            </div>
        </div>
    );
}

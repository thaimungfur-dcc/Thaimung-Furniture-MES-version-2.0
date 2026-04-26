import React from 'react';
import { ArrowRight } from 'lucide-react';
import { MAIN_CATEGORIES } from '../constants';
import { Category, Product } from '../types';

interface CategoryViewProps {
    products: Product[];
    onSelectCategory: (category: Category) => void;
}

export default function CategoryView({ products, onSelectCategory }: CategoryViewProps) {
    return (
        <div className="animate-fade-in w-full">
            <div className="flex items-center gap-3 mb-6">
                <div className="w-1.5 h-6 bg-[#E3624A] rounded-full"></div>
                <h2 className="text-lg font-black text-[#111f42] uppercase tracking-widest">Select Product Category</h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pb-8">
                {MAIN_CATEGORIES?.map(cat => {
                    const IconComp = cat.Icon;
                    const itemCount = products?.filter(p => p.category === cat.id).length;
                    return (
                        <div 
                            key={cat.id} 
                            onClick={() => onSelectCategory(cat)} 
                            className="modern-category-card group"
                        >
                            <div className="flex justify-between items-start mb-2">
                                <div className="icon-circle text-[#111f42]">
                                    <IconComp size={28} className="transition-transform" strokeWidth={1.5} />
                                </div>
                                <span className="bg-[#111f42]/5 text-[#111f42] text-[9px] font-black px-2.5 py-1 rounded-full border border-[#111f42]/5 uppercase tracking-widest group-hover:bg-[#ab8a3b] transition-colors">
                                    {itemCount} Items
                                </span>
                            </div>
                            <div className="mt-auto">
                                <h3 className="font-black text-[#111f42] text-lg tracking-tight leading-tight">{cat.name}</h3>
                                <p className="text-slate-400 text-[10px] font-bold mt-0.5 uppercase tracking-widest truncate">{cat.desc}</p>
                            </div>
                            <div className="absolute bottom-5 right-5 opacity-0 group-hover:opacity-100 transform translate-x-2 group-hover:translate-x-0 transition-all duration-300">
                                <ArrowRight size={18} className="text-[#E3624A]" />
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

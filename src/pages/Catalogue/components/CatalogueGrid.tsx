import React from 'react';
import { Pencil, ImagePlus } from 'lucide-react';
import StarRating from './StarRating';

interface CatalogueGridProps {
  products: any[];
  onEdit: (product: any) => void;
}

const CatalogueGrid: React.FC<CatalogueGridProps> = ({ products, onEdit }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
      {products.map(p => (
        <div key={p.id} className="furniture-card flex flex-col h-full group">
          <div className="h-48 bg-slate-100 relative overflow-hidden shrink-0 border-b border-slate-100">
            {p.image ? (
              <img 
                src={p.image} 
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" 
                alt={p.name}
                referrerPolicy="no-referrer"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-slate-300">
                <ImagePlus size={40} strokeWidth={1} />
              </div>
            )}
            <div className="absolute top-2 right-2 flex gap-2 transition-opacity">
              <button 
                onClick={() => onEdit(p)} 
                className="bg-white/90 p-1.5 rounded-lg text-[#ab8a3b] shadow-sm hover:bg-white hover:text-[#111f42]"
              >
                <Pencil size={14} />
              </button>
            </div>
            <span className="absolute bottom-2 left-2 bg-[#111f42]/80 text-white text-[10px] px-2 py-1 rounded font-mono font-bold shadow-sm">
              {p.sku}
            </span>
          </div>
          <div className="p-4 flex flex-col flex-1 gap-1">
            <h3 className="font-bold text-[#111f42] text-sm truncate">{p.name}</h3>
            <p className="text-[11px] text-slate-500 font-medium uppercase tracking-wider">{p.category}</p>
            <div className="flex items-center justify-between mt-auto pt-3">
              <StarRating rating={p.rating} />
              <div className="text-[13px] font-black text-[#E3624A] font-mono">฿{p.price}</div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default CatalogueGrid;

import React from 'react';
import { Pencil, ImagePlus, Info } from 'lucide-react';

interface FabricGridProps {
  patterns: any[];
  onEdit: (pattern: any) => void;
}

const FabricGrid: React.FC<FabricGridProps> = ({ patterns, onEdit }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 pb-10 items-start">
      {patterns?.map(p => (
        <div key={p.id} className="pattern-card group h-auto">
          <div className="h-48 w-full bg-slate-100 relative overflow-hidden shrink-0 border-b border-slate-100">
            {p.image ? (
              <img 
                src={p.image} 
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" 
                alt={p.name}
                referrerPolicy="no-referrer"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-slate-300">
                <ImagePlus size={48} strokeWidth={1} />
              </div>
            )}
            <div className="absolute top-2 right-2 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
              <button 
                onClick={() => onEdit(p)} 
                className="bg-white/90 p-1.5 rounded-lg hover:bg-white text-[#ab8a3b] shadow-sm hover:text-[#111f42]"
              >
                <Pencil size={14} />
              </button>
            </div>
            <span className="absolute bottom-2 left-2 bg-[#111f42]/80 text-white text-[10px] px-2 py-0.5 rounded font-mono shadow-sm">
              {p.code}
            </span>
            <span className={`absolute top-2 left-2 text-[9px] px-2 py-0.5 rounded font-bold uppercase shadow-sm ${p.status === 'Active' ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-600'}`}>
              {p.status}
            </span>
          </div>
          <div className="p-4 space-y-3">
            <div>
              <h3 className="font-bold text-[#111f42] text-sm truncate" title={p.name}>{p.name}</h3>
              <p className="text-[11px] text-slate-500 font-mono uppercase tracking-widest mt-0.5">
                {p.category} | {p.composition}
              </p>
              <div className="mt-2 text-[10px] font-bold text-slate-600 bg-slate-50 px-2 py-1.5 rounded-lg border border-slate-100 flex items-center gap-1.5">
                <Info size={12} className="text-[#ab8a3b] shrink-0" />
                <span className="truncate">Usage: {p.application || '-'}</span>
              </div>
            </div>
            <div className="flex flex-wrap items-center gap-1.5">
              {p.colors && p.colors?.map((c: string, i: number) => (
                <div key={i} className="flex items-center gap-1 bg-white pl-1 pr-1.5 py-0.5 rounded-md border border-slate-200 shadow-sm" title={c}>
                  <span className="w-2.5 h-2.5 rounded-full border border-black/10 shadow-inner" style={{backgroundColor: c}}></span>
                  <span className="text-[8px] font-mono text-slate-500 font-bold uppercase">{c}</span>
                </div>
              ))}
            </div>
            <div className="pt-2 border-t border-slate-100 flex justify-between items-center text-[10px] font-mono font-bold text-slate-400">
              <span>W: {p.width}</span>
              <span>{p.weight}</span>
            </div>
          </div>
        </div>
      ))}
      {patterns.length === 0 && (
        <div className="col-span-full py-12 text-center text-slate-400 italic font-bold">No designs found.</div>
      )}
    </div>
  );
};

export default FabricGrid;

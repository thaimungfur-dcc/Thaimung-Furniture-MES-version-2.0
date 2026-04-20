import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface PaginationControlsProps {
    totalItems: number;
    page: number;
    rows: number;
    setPage: (page: number) => void;
}

export default function PaginationControls({ totalItems, page, rows, setPage }: PaginationControlsProps) {
    const totalPages = Math.ceil(totalItems / rows) || 1;
    return (
        <div className="px-6 py-4 border-t border-slate-100 bg-slate-50/50 shrink-0 flex justify-between items-center mt-auto no-print font-sans">
            <div className="text-[10px] text-slate-400 font-bold uppercase tracking-widest font-mono">
                <span>Showing {totalItems > 0 ? (page - 1) * rows + 1 : 0} to {Math.min(page * rows, totalItems)} of {totalItems} records</span>
            </div>
            <div className="flex items-center gap-1 font-mono">
                <button onClick={() => setPage(Math.max(1, page - 1))} disabled={page === 1} className="p-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 disabled:opacity-30 transition-all shadow-sm"><ChevronLeft size={16}/></button>
                <span className="text-[11px] font-bold text-[#111f42] px-4 font-mono leading-none">Page {page} of {totalPages}</span>
                <button onClick={() => setPage(Math.min(totalPages, page + 1))} disabled={page >= totalPages} className="p-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 disabled:opacity-30 transition-all shadow-sm"><ChevronRight size={16}/></button>
            </div>
        </div>
    );
}

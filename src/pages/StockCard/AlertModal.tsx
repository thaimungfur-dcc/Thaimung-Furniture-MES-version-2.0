import React from 'react';

export default function AlertModal({ isOpen, title, text, icon, onClose }: any) {
    if (!isOpen) return null;
    return (
        <div className="fixed inset-0 z-[20000] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-white rounded-2xl shadow-2xl max-w-sm w-full p-6 text-center animate-in zoom-in-95 border-t-4 border-[#ab8a3b]">
                <h3 className="text-lg font-black text-[#111f42] uppercase mb-2">{title}</h3>
                <p className="text-sm text-slate-500 mb-6 font-medium leading-relaxed">{text}</p>
                <button onClick={onClose} className="w-full py-2.5 bg-[#111f42] text-white rounded-xl font-bold text-xs uppercase tracking-widest hover:bg-[#1e346b] transition-all shadow-md">OK</button>
            </div>
        </div>
    );
}

import React from 'react';
import { DraggableWrapper } from "../../components/shared/DraggableWrapper";

export default function AlertModal({ isOpen, title, text, icon, onClose }: any) {
    if (!isOpen) return null;
    return (
        <div className="fixed inset-0 z-[20000] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
            
            <DraggableWrapper>
                  <div className="bg-white rounded-none shadow-2xl max-w-sm w-full p-5 text-center animate-in zoom-in-95 border-b-8 border-[#111f42]">
                            <h3 className="text-xl font-black text-[#111f42] uppercase mb-4 tracking-widest">{title}</h3>
                            <p className="text-xs text-slate-500 mb-8 font-black uppercase tracking-widest leading-relaxed opacity-60">{text}</p>
                            <button onClick={onClose} className="w-full py-2.5 bg-[#111f42] text-[#ab8a3b] rounded-none font-black text-xs uppercase tracking-[0.3em] hover:bg-[#0a1229] transition-all shadow-xl">DISMISS (OK)</button>
                        </div>
                </DraggableWrapper>

        </div>
    );
}

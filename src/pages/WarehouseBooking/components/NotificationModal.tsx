import React from 'react';
import { CheckCircle2, X, AlertTriangle, Info } from 'lucide-react';
import { DraggableWrapper } from "../../../components/shared/DraggableWrapper";

interface NotificationModalProps {
    isOpen: boolean;
    title: string;
    message: string;
    type: 'success' | 'error' | 'warning' | 'info';
    onClose: () => void;
}

export default function NotificationModal({ isOpen, title, message, type, onClose }: NotificationModalProps) {
    if (!isOpen) return null;
    const colors = {
        success: 'text-emerald-500',
        error: 'text-rose-500',
        warning: 'text-amber-500',
        info: 'text-blue-500'
    };
    return (
        <div className="fixed inset-0 z-[90000] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200 font-sans">
            
            <DraggableWrapper>
                  <div className="bg-white rounded-2xl shadow-2xl max-w-sm w-full p-4 sm:p-5 text-center border-t-4 border-[#ab8a3b] animate-in zoom-in-95">
                            <div className={`flex justify-center mb-4 ${colors[type] || 'text-slate-500'}`}>
                                {type === 'success' && <CheckCircle2 size={48} />}
                                {type === 'error' && <X size={48} className="bg-rose-100 rounded-full p-2" />}
                                {type === 'warning' && <AlertTriangle size={48} />}
                                {type === 'info' && <Info size={48} />}
                            </div>
                            <h3 className="text-lg font-black text-[#111f42] uppercase mb-2">{String(title)}</h3>
                            <p className="text-sm text-slate-500 mb-6 font-medium leading-relaxed">{String(message)}</p>
                            <button onClick={onClose} className="w-full py-2.5 bg-[#111f42] text-white rounded-xl font-bold text-xs uppercase tracking-widest hover:bg-[#1e346b] transition-all shadow-md">ตกลง</button>
                        </div>
                </DraggableWrapper>

        </div>
    );
}

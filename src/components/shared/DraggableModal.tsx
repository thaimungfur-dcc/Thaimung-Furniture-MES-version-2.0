import React from 'react';
import Draggable from 'react-draggable';
import { X } from 'lucide-react';

interface DraggableModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  width?: string;
  height?: string;
}

export const DraggableModal: React.FC<DraggableModalProps> = ({ 
  isOpen, 
  onClose, 
  title, 
  children, 
  width = 'max-w-2xl',
  height = 'max-h-[90vh]'
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none p-4">
      {/* Background Overlay (Clickable to close) */}
      <div className="absolute inset-0 bg-[#111f42]/40 backdrop-blur-sm pointer-events-auto" onClick={onClose} />
      
      {/* Draggable Modal Content */}
      <Draggable handle=".drag-handle" bounds="parent">
        <div className={`bg-white rounded-xl shadow-2xl pointer-events-auto flex flex-col w-full ${width} ${height} animate-in zoom-in duration-200 relative`}>
          {/* Header (Drag Handle) */}
          <div className="drag-handle cursor-move bg-[#2C3F70] border-b-4 border-[#E3624A] text-white px-5 py-3.5 rounded-t-xl flex justify-between items-center shrink-0">
            <h3 className="font-semibold uppercase tracking-wider text-sm">{title}</h3>
            <button 
              onClick={onClose} 
              className="hover:bg-white/20 p-1.5 rounded-lg transition-colors cursor-pointer"
              onMouseDown={(e) => e.stopPropagation()} // Prevent drag start when clicking close
            >
              <X size={20} />
            </button>
          </div>
          
          {/* Content Area */}
          <div className="flex-1 overflow-y-auto p-6 bg-slate-50 custom-scrollbar">
            {children}
          </div>
        </div>
      </Draggable>
    </div>
  );
};

import React, { useRef } from 'react';
import Draggable from 'react-draggable';
import { X, GripVertical } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface DraggableModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  width?: string;
  maxHeight?: string;
}

export function DraggableModal({ 
  isOpen, 
  onClose, 
  title, 
  children, 
  width = "max-w-4xl",
  maxHeight = "max-h-[85vh]"
}: DraggableModalProps) {
  const nodeRef = useRef(null);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-[#111f42]/40 backdrop-blur-sm"
          />

          {/* Draggable Dialog */}
          <Draggable
            nodeRef={nodeRef}
            handle=".drag-handle"
            bounds="parent"
          >
            <motion.div
              ref={nodeRef}
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className={`relative bg-white rounded-[32px] shadow-2xl border border-slate-200 overflow-hidden w-full ${width} flex flex-col`}
            >
              {/* Header / Drag Handle */}
              <div className="drag-handle flex items-center justify-between px-8 py-5 border-b border-slate-100 bg-slate-50/50 cursor-move active:cursor-grabbing">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-[#111f42] text-[#ab8a3b] rounded-xl shadow-lg shadow-blue-900/10 shrink-0">
                    <GripVertical size={16} />
                  </div>
                  <div>
                    <h3 className="text-sm font-black text-[#111f42] uppercase tracking-[0.2em]">{title}</h3>
                    <p className="text-[10px] font-black text-slate-400 tracking-widest uppercase">Draggable Workspace</p>
                  </div>
                </div>
                <button 
                  onClick={onClose}
                  className="p-2.5 bg-white text-slate-400 hover:text-[#E3624A] hover:bg-red-50 rounded-xl transition-all border border-slate-200"
                >
                  <X size={18} />
                </button>
              </div>

              {/* Content Area */}
              <div className={`overflow-y-auto master-custom-scrollbar ${maxHeight}`}>
                {children}
              </div>
            </motion.div>
          </Draggable>
        </div>
      )}
    </AnimatePresence>
  );
}

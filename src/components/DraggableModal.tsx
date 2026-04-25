import React, { useRef } from 'react';
import Draggable from 'react-draggable';
import { motion, AnimatePresence } from 'motion/react';
import { X } from 'lucide-react';

interface DraggableModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

export default function DraggableModal({ isOpen, onClose, title, children }: DraggableModalProps) {
  const nodeRef = useRef(null);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none">
          <Draggable nodeRef={nodeRef} handle=".drag-handle" bounds="parent">
            <motion.div
              ref={nodeRef}
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ duration: 0.2 }}
              className="pointer-events-auto absolute flex w-[500px] flex-col overflow-hidden rounded-xl bg-white shadow-2xl ring-1 ring-black/5"
            >
              {/* Header / Drag Handle */}
              <div className="drag-handle flex cursor-grab items-center justify-between bg-gray-900 px-4 py-3 text-white active:cursor-grabbing">
                <h3 className="text-sm font-semibold tracking-wide">{title}</h3>
                <button
                  onClick={onClose}
                  className="rounded-full p-1 hover:bg-white/20 transition-colors"
                >
                  <X size={16} />
                </button>
              </div>
              
              {/* Content */}
              <div className="p-4 sm:p-5">
                {children}
              </div>
            </motion.div>
          </Draggable>
        </div>
      )}
    </AnimatePresence>
  );
}

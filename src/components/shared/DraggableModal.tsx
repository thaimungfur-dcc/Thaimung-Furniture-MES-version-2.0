import React, { ReactNode, useRef } from 'react';
import Draggable from 'react-draggable';
import { motion, AnimatePresence } from 'motion/react';

interface DraggableModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
  width?: string;
  className?: string;
}

export function DraggableModal({
  isOpen,
  onClose,
  title = '',
  children,
  width = 'max-w-4xl',
  className = ''
}: DraggableModalProps) {
  const nodeRef = useRef(null);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
          {/* Backdrop (not draggable, but clickable to close) */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/40 backdrop-blur-sm pointer-events-auto"
            onClick={onClose}
          />
          
          <Draggable 
            nodeRef={nodeRef}
            handle=".modal-handle"
            bounds="parent"
            cancel=".modal-content"
          >
            <motion.div
              ref={nodeRef}
              initial={{ scale: 0.95, opacity: 0, y: 10 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 10 }}
              transition={{ type: "spring", duration: 0.3, bounce: 0.2 }}
              className={`relative bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col pointer-events-auto w-full ${width} ${className}`}
              style={{ maxHeight: '90vh' }}
              onClick={(e) => e.stopPropagation()} // Prevent closing when clicking on the modal
            >
              {title && (
                <div className="modal-handle flex items-center justify-between p-4 border-b border-slate-100 bg-slate-50 cursor-grab active:cursor-grabbing shrink-0">
                  <h3 className="font-bold text-slate-800 tracking-wide uppercase">{title}</h3>
                  <button 
                    onClick={onClose}
                    className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-slate-200 text-slate-500 transition-colors"
                  >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <line x1="18" y1="6" x2="6" y2="18"></line>
                      <line x1="6" y1="6" x2="18" y2="18"></line>
                    </svg>
                  </button>
                </div>
              )}
              
              <div className="modal-content overflow-y-auto master-custom-scrollbar flex-1 pb-2">
                {children}
              </div>
            </motion.div>
          </Draggable>
        </div>
      )}
    </AnimatePresence>
  );
}

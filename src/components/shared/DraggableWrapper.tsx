import React, { useRef, useEffect } from 'react';
import Draggable from 'react-draggable';
import { motion, AnimatePresence } from 'framer-motion';

interface DraggableWrapperProps {
  children: React.ReactElement;
  disabled?: boolean;
  onClose?: () => void;
  isOpen?: boolean;
}

export const DraggableWrapper: React.FC<DraggableWrapperProps> = ({ 
  children, 
  disabled = false,
  onClose,
  isOpen = true
}) => {
  const nodeRef = useRef<HTMLElement>(null);
  const handleRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (nodeRef.current && !disabled) {
      // Find the header to use as drag handle. It's usually the first div.
      const header = nodeRef.current.firstElementChild as HTMLElement;
      if (header) {
         header.classList.add('drag-handle', 'cursor-grab', 'active:cursor-grabbing');
         handleRef.current = header;
      }
    }
    return () => {
       if (handleRef.current) {
          handleRef.current.classList.remove('drag-handle', 'cursor-grab', 'active:cursor-grabbing');
       }
    };
  }, [disabled, isOpen]);

  if (!isOpen) return null;

  if (disabled) return children;

  if (!React.isValidElement(children)) {
    return children;
  }

  // Clone element to inject styles and ref
  const childWithRef = React.cloneElement(children as any, { 
    ref: nodeRef,
    style: { ...((children as any).props.style || {}), position: 'relative', pointerEvents: 'auto' },
    onClick: (e: any) => {
       e.stopPropagation();
       if ((children as any).props.onClick) (children as any).props.onClick(e);
    }
  });

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100000] flex items-center justify-center p-4 pointer-events-none">
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-[#111f42]/60 backdrop-blur-[4px] pointer-events-auto"
            onClick={onClose}
        />
        <Draggable nodeRef={nodeRef as React.RefObject<HTMLElement>} handle=".drag-handle" bounds="parent" cancel="button, input, select, textarea, .modal-content, .no-drag">
          <motion.div 
            initial={{ scale: 0.95, opacity: 0, y: 10 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 10 }}
            transition={{ type: "spring", duration: 0.3, bounce: 0.2 }}
            className="pointer-events-auto relative w-full flex justify-center items-center"
          >
            {childWithRef}
          </motion.div>
        </Draggable>
      </div>
    </AnimatePresence>
  );
};

import React from 'react';
import { DraggableModal } from './DraggableModal';
import { Button } from './Button';
import { motion } from 'motion/react';

interface AspectModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  onConfirm?: () => void;
  confirmText?: string;
  confirmVariant?: 'primary' | 'danger' | 'success';
  isLoading?: boolean;
  children: React.ReactNode;
  width?: string;
}

/**
 * AspectModal: A content-focused wrapper for DraggableModal
 * Follows the specific requirement for Save/Cancel actions and standardized content.
 */
export function AspectModal({ 
  isOpen, 
  onClose, 
  title, 
  onConfirm, 
  confirmText = "SAVE CHANGES",
  confirmVariant = "primary",
  isLoading = false,
  children,
  width = "max-w-2xl"
}: AspectModalProps) {
  return (
    <DraggableModal 
      isOpen={isOpen} 
      onClose={onClose} 
      title={title} 
      width={width}
    >
      <div className="flex flex-col">
        {/* Content Body */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="p-5 space-y-4"
        >
          {children}
        </motion.div>

        {/* Footer Actions */}
        <div className="p-5 border-t border-slate-100 bg-slate-50/50 flex items-center justify-end gap-4">
          <button 
            disabled={isLoading}
            onClick={onClose}
            className="px-5 py-3.5 text-[11px] font-black text-slate-400 hover:text-[#111f42] uppercase tracking-[0.2em] transition-all disabled:opacity-50"
          >
            Cancel
          </button>
          {onConfirm && (
            <Button
              variant={confirmVariant}
              onClick={onConfirm}
              isLoading={isLoading}
              className="min-w-[160px]"
            >
              {confirmText}
            </Button>
          )}
        </div>
      </div>
    </DraggableModal>
  );
}

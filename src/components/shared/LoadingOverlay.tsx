import React from 'react';
import { Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface LoadingOverlayProps {
  isLoading: boolean;
  message?: string;
  transparent?: boolean;
}

export function LoadingOverlay({ 
  isLoading, 
  message = "Processing Matrix...", 
  transparent = false 
}: LoadingOverlayProps) {
  return (
    <AnimatePresence>
      {isLoading && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className={`fixed inset-0 z-[999] flex flex-col items-center justify-center gap-5 ${
            transparent ? 'bg-white/40' : 'bg-[#111f42]/60'
          } backdrop-blur-md`}
        >
          <div className="relative">
            {/* Pulsing rings */}
            <div className="absolute inset-0 bg-[#ab8a3b] rounded-full blur-2xl opacity-20 animate-pulse"></div>
            <div className="relative p-8 bg-white rounded-[40px] shadow-2xl border border-white/20">
              <Loader2 className="animate-spin text-[#111f42]" size={48} strokeWidth={1} />
            </div>
          </div>
          
          <div className="text-center space-y-2">
            <h3 className={`text-sm font-black uppercase tracking-[0.4em] ${
              transparent ? 'text-[#111f42]' : 'text-white'
            }`}>
              {message}
            </h3>
            <div className="flex items-center justify-center gap-1.5">
              {[0, 1, 2].map((i) => (
                <motion.div
                  key={i}
                  animate={{ scale: [1, 1.5, 1], opacity: [0.3, 1, 0.3] }}
                  transition={{ duration: 1, repeat: Infinity, delay: i * 0.2 }}
                  className="w-1.5 h-1.5 rounded-full bg-[#ab8a3b]"
                />
              ))}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

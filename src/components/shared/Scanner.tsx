import React, { useEffect, useRef, useState } from 'react';
import { Html5Qrcode, Html5QrcodeScannerState } from 'html5-qrcode';
import { Camera, X, RefreshCw, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Button } from './Button';

interface ScannerProps {
  isOpen: boolean;
  onClose: () => void;
  onScan: (decodedText: string) => void;
  title?: string;
}

export function Scanner({ isOpen, onClose, onScan, title = "SCAN QR / BARCODE" }: ScannerProps) {
  const [error, setError] = useState<string | null>(null);
  const [isInitializing, setIsInitializing] = useState(true);
  const scannerRef = useRef<Html5Qrcode | null>(null);
  const containerId = 'qr-reader';

  useEffect(() => {
    if (isOpen) {
      setIsInitializing(true);
      setError(null);
      
      const startScanner = async () => {
        try {
          const scanner = new Html5Qrcode(containerId);
          scannerRef.current = scanner;

          await scanner.start(
            { facingMode: "environment" },
            {
              fps: 10,
              qrbox: { width: 250, height: 250 },
              aspectRatio: 1.0,
            },
            (decodedText) => {
              onScan(decodedText);
              stopScanner();
              onClose();
            },
            (errorMessage) => {
              // Ignore standard scanning errors to avoid noise
            }
          );
          setIsInitializing(false);
        } catch (err: any) {
          console.error("Scanner Error:", err);
          setError(err?.message || "Failed to access camera. Please check permissions.");
          setIsInitializing(false);
        }
      };

      // Small timeout to ensure container is rendered
      const timer = setTimeout(startScanner, 300);
      return () => {
        clearTimeout(timer);
        stopScanner();
      };
    }
  }, [isOpen]);

  const stopScanner = async () => {
    if (scannerRef.current && scannerRef.current.getState() === Html5QrcodeScannerState.SCANNING) {
      try {
        await scannerRef.current.stop();
        scannerRef.current = null;
      } catch (err) {
        console.warn("Error stopping scanner:", err);
      }
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 overflow-hidden">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-[#111f42]/80 backdrop-blur-md"
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 30 }}
            className="relative bg-white rounded-[40px] shadow-2xl w-full max-w-lg overflow-hidden flex flex-col"
          >
            {/* Header */}
            <div className="px-8 py-6 border-b border-slate-100 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-[#ab8a3b] text-[#111f42] rounded-xl">
                  <Camera size={20} />
                </div>
                <h3 className="text-sm font-black text-[#111f42] uppercase tracking-[0.2em]">{title}</h3>
              </div>
              <button 
                onClick={onClose}
                className="p-2 text-slate-400 hover:text-rose-500 hover:bg-rose-50 rounded-xl transition-all"
              >
                <X size={24} />
              </button>
            </div>

            {/* Scanner Area */}
            <div className="p-8 flex flex-col items-center bg-slate-50 min-h-[400px]">
              <div 
                id={containerId} 
                className="w-full aspect-square max-w-[320px] bg-black rounded-3xl overflow-hidden shadow-inner relative border-4 border-white"
              >
                {isInitializing && (
                  <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 bg-[#111f42] text-white z-10">
                    <RefreshCw className="animate-spin text-[#ab8a3b]" size={32} />
                    <p className="text-[10px] font-black tracking-widest uppercase opacity-60">Initializing Camera...</p>
                  </div>
                )}

                {error && (
                  <div className="absolute inset-0 flex flex-col items-center justify-center p-6 gap-4 bg-rose-50 text-rose-500 z-20 text-center">
                    <AlertCircle size={40} strokeWidth={1.5} />
                    <div>
                      <p className="text-xs font-black uppercase tracking-widest mb-2">Access Denied</p>
                      <p className="text-[10px] font-medium opacity-80 leading-relaxed">{error}</p>
                    </div>
                    <Button 
                      size="sm" 
                      variant="danger" 
                      className="mt-2"
                      onClick={() => window.location.reload()}
                    >
                      Retry & Refresh
                    </Button>
                  </div>
                )}
                
                {/* Visual Target Frame */}
                {!isInitializing && !error && (
                   <div className="absolute inset-0 border-[40px] border-[#111f42]/30 pointer-events-none z-10">
                      <div className="absolute inset-0 border-2 border-[#ab8a3b] animate-pulse"></div>
                      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[2px] bg-rose-500 shadow-[0_0_10px_rgba(244,63,94,0.8)] animate-[scan_2s_infinite]"></div>
                   </div>
                )}
              </div>
              
              <div className="mt-8 text-center space-y-2">
                <p className="text-xs font-black text-[#111f42] uppercase tracking-[0.15em]">Position code in frame</p>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-relaxed">
                  Scanning works best in well-lit environments.<br/>Ensure the code is clear and focused.
                </p>
              </div>
            </div>

            {/* Footer */}
            <div className="px-8 py-6 bg-white border-t border-slate-100 flex justify-center">
               <Button 
                variant="outline" 
                className="w-full rounded-2xl" 
                onClick={onClose}
               >
                Cancel Scanning
               </Button>
            </div>
          </motion.div>

          <style>{`
            @keyframes scan {
              0% { top: 0%; }
              50% { top: 100%; }
              100% { top: 0%; }
            }
            #${containerId} video {
              object-fit: cover !important;
              width: 100% !important;
              height: 100% !important;
            }
          `}</style>
        </div>
      )}
    </AnimatePresence>
  );
}

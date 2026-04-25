import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';

export default function Watermark() {
  const { user } = useAuth();
  const [isProtecting, setIsProtecting] = useState(false);
  
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Detect Print Screen key
      if (e.key === 'PrintScreen') {
        activateProtection();
      }
      // Detect Ctrl+P or Cmd+P (Print)
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'p') {
        activateProtection();
      }
      // Detect Snipping Tool shortcuts (Windows: Win + Shift + S)
      if (e.metaKey && e.shiftKey && e.key.toLowerCase() === 's') {
        activateProtection();
      }
      // Mac screenshot shortcuts (Cmd + Shift + 3/4/5)
      if (e.metaKey && e.shiftKey && ['3', '4', '5'].includes(e.key)) {
        activateProtection();
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      // Sometimes PrintScreen only fires on keyup
      if (e.key === 'PrintScreen') {
        activateProtection();
      }
    };

    const activateProtection = () => {
      setIsProtecting(true);
      // Keep protection active for a few seconds to cover the screenshot action
      setTimeout(() => setIsProtecting(false), 3500);
    };

    // Add print listeners
    const handleBeforePrint = () => setIsProtecting(true);
    const handleAfterPrint = () => setIsProtecting(false);
    
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    window.addEventListener('beforeprint', handleBeforePrint);
    window.addEventListener('afterprint', handleAfterPrint);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
      window.removeEventListener('beforeprint', handleBeforePrint);
      window.removeEventListener('afterprint', handleAfterPrint);
    };
  }, []);

  if (!user) return null;

  // Define who has permission to take clear screenshots (e.g., admin)
  // If role is not admin, they don't have permission
  const hasPermission = user.role?.toLowerCase() === 'admin';
  const watermarkText = `${user.name} (${user.employeeId}) - ${new Date()?.toLocaleString('en-GB')}`;

  return (
    <>
      {/* 
        1. Normal state: Watermark is hidden (opacity-0).
        2. Print state (@media print): Watermark is visible.
        3. Screenshot state (isProtecting): Watermark is visible.
      */}
      <div 
        className={`pointer-events-none fixed inset-0 z-[9999] overflow-hidden mix-blend-multiply transition-opacity duration-75
          ${isProtecting ? 'opacity-15' : 'opacity-0'} 
          print:opacity-15
        `}
      >
        <div className="flex h-[200%] w-[200%] -translate-x-1/4 -translate-y-1/4 -rotate-45 flex-wrap content-start">
          {Array.from({ length: 150 })?.map((_, i) => (
            <div key={i} className="p-10 text-3xl font-bold text-black whitespace-nowrap">
              {watermarkText}
            </div>
          ))}
        </div>
      </div>

      {/* The Blur Overlay for users without permission */}
      {!hasPermission && (
        <div 
          className={`pointer-events-none fixed inset-0 z-[9998] bg-white/40 backdrop-blur-xl transition-opacity duration-75
            ${isProtecting ? 'opacity-100' : 'opacity-0'} 
            print:opacity-100
          `}
        >
          <div className="flex h-full w-full items-center justify-center">
            <div className="rounded-3xl bg-white/90 p-10 text-center shadow-2xl border border-red-100">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-red-100">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <h2 className="text-2xl font-black text-red-600 tracking-tight uppercase">Confidential Information</h2>
              <p className="mt-3 text-sm font-medium text-gray-600 max-w-xs mx-auto leading-relaxed">
                You do not have permission to capture or print this screen. This action has been logged.
              </p>
              <div className="mt-6 inline-block rounded-lg bg-gray-100 px-4 py-2 text-xs font-mono text-gray-500">
                User: {user.employeeId} | IP Logged
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

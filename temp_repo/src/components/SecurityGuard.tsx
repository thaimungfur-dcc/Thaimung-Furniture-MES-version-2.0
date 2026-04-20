import React, { useEffect, useState } from 'react';

export default function SecurityGuard({ children }: { children: React.ReactNode }) {
  const [isBlurred, setIsBlurred] = useState(false);

  useEffect(() => {
    const handleBlur = () => setIsBlurred(true);
    const handleFocus = () => setIsBlurred(false);
    
    // Attempt to catch PrintScreen or common screenshot shortcuts
    const handleKeyDown = (e: KeyboardEvent) => {
      if (
        e.key === 'PrintScreen' || 
        (e.metaKey && e.shiftKey && (e.key === '3' || e.key === '4' || e.key === '5')) || // Mac shortcuts
        (e.ctrlKey && e.key === 'p') // Print
      ) {
        setIsBlurred(true);
        // Unblur after a few seconds
        setTimeout(() => setIsBlurred(false), 3000);
      }
    };

    window.addEventListener('blur', handleBlur);
    window.addEventListener('focus', handleFocus);
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('blur', handleBlur);
      window.removeEventListener('focus', handleFocus);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  return (
    <div 
      className={`min-h-screen transition-all duration-200 ${
        isBlurred ? 'filter blur-xl select-none' : ''
      }`}
    >
      {isBlurred && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-white/50">
          <p className="text-2xl font-bold text-red-600 drop-shadow-md">
            Screen capture is disabled for security reasons.
          </p>
        </div>
      )}
      {children}
    </div>
  );
}

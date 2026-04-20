import React from 'react';
import { useAuth } from '../context/AuthContext';

export default function Watermark() {
  const { user } = useAuth();
  
  if (!user) return null;

  const watermarkText = `${user.name} (${user.employeeId})`;

  return (
    <div className="pointer-events-none fixed inset-0 z-50 overflow-hidden opacity-[0.04] mix-blend-multiply">
      <div className="flex h-[200%] w-[200%] -translate-x-1/4 -translate-y-1/4 -rotate-45 flex-wrap content-start">
        {Array.from({ length: 150 }).map((_, i) => (
          <div key={i} className="p-10 text-3xl font-bold text-black whitespace-nowrap">
            {watermarkText}
          </div>
        ))}
      </div>
    </div>
  );
}

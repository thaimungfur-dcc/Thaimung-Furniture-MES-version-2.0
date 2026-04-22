import React, { useState, useEffect } from 'react';
import { Clock } from 'lucide-react';
import { motion } from 'motion/react';

export const DateTimeBadge: React.FC = () => {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const dayName = currentTime.toLocaleDateString('en-US', { weekday: 'long' }).toUpperCase();
  const dateString = currentTime.toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' });
  const formattedTime = currentTime.toLocaleTimeString('en-US', { 
    hour: '2-digit', 
    minute: '2-digit', 
    hour12: false 
  });

  return (
    <div className="flex items-center bg-white/70 backdrop-blur-sm rounded-2xl shadow-sm border border-white/40 overflow-hidden no-print">
      <div className="pl-5 pr-4 py-1 flex flex-col items-center leading-none">
        <div className="text-[10px] font-black text-slate-400 uppercase tracking-[0.25em] mb-1.5 active:text-master-gold transition-colors duration-500">
          {dayName}
        </div>
        <div className="text-xs font-black text-master-blue tracking-normal uppercase">
          {dateString}
        </div>
      </div>
      
      <div className="bg-master-blue flex items-center gap-2 px-6 py-2.5 rounded-xl shadow-inner border-l border-white/10 m-1">
        <motion.div
          animate={{ opacity: [1, 0.6, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <Clock size={16} className="text-[#F2B705]" strokeWidth={3} />
        </motion.div>
        <span className="text-xl font-black font-mono text-white tracking-[0.2em] leading-none">
          {formattedTime}
        </span>
      </div>
    </div>
  );
};

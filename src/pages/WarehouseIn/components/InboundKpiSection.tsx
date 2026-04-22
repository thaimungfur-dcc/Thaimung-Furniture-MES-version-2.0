import React from 'react';
import { Calendar, ClipboardList, Truck, CheckCircle } from 'lucide-react';
import { KpiCard } from '../../../components/shared/KpiCard';

interface InboundKpiSectionProps {
  stats: {
    todayIn: number;
    pendingJobs: number;
    pendingPOs: number;
    completed: number;
  };
}

export const InboundKpiSection: React.FC<InboundKpiSectionProps> = ({ stats }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 shrink-0">
      <KpiCard 
        label="Received Month" 
        value={stats.todayIn.toLocaleString()} 
        color="#111f42" 
        icon={Calendar} 
        subValue="TOTAL UNITS" 
      />
      <KpiCard 
        label="Pending JOs" 
        value={stats.pendingJobs} 
        color="#ab8a3b" 
        icon={ClipboardList} 
        subValue="WAIT FOR WH (FG)" 
      />
      <KpiCard 
        label="Pending POs" 
        value={stats.pendingPOs} 
        color="#72A09E" 
        icon={Truck} 
        subValue="WAIT FOR WH (RM)" 
      />
      <KpiCard 
        label="Total Records" 
        value={stats.completed.toLocaleString()} 
        color="#10b981" 
        icon={CheckCircle} 
        subValue="LEDGER ENTRIES" 
      />
    </div>
  );
};

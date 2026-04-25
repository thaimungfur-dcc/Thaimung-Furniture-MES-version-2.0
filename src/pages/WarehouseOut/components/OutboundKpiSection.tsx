import React from 'react';
import { ArrowUpRight, Truck, Factory, CheckCircle } from 'lucide-react';
import { KpiCard } from '../../../components/shared/KpiCard';

interface OutboundKpiSectionProps {
  stats: {
    todayOut: number;
    pendingDelivery: number;
    pendingMRP: number;
    completed: number;
  };
}

export const OutboundKpiSection: React.FC<OutboundKpiSectionProps> = ({ stats }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 shrink-0">
      <KpiCard 
        label="Outbound Today" 
        value={stats.todayOut?.toLocaleString()} 
        color="#111f42" 
        icon={ArrowUpRight} 
        subValue="TOTAL UNITS ISSUED" 
      />
      <KpiCard 
        label="Pending Delivery" 
        value={stats.pendingDelivery} 
        color="#111f42" 
        icon={Truck} 
        subValue="WAIT FOR SHIPPING" 
      />
      <KpiCard 
        label="Pending Production" 
        value={stats.pendingMRP} 
        color="#E3624A" 
        icon={Factory} 
        subValue="RM TO ISSUE" 
      />
      <KpiCard 
        label="Completed Today" 
        value={stats.completed?.toLocaleString()} 
        color="#10b981" 
        icon={CheckCircle} 
        subValue="DOCS CLOSED" 
      />
    </div>
  );
};

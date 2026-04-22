import React from 'react';
import { ShoppingCart, Clock4, Truck, Circle } from 'lucide-react';
import { KpiCard } from '../../../components/shared/KpiCard';

interface HomeKpiSectionProps {
  deliveryOrders: any[];
  jobOrders: any[];
  outLogs: any[];
}

export const HomeKpiSection: React.FC<HomeKpiSectionProps> = ({ 
  deliveryOrders, 
  jobOrders, 
  outLogs 
}) => {
  const kpis = [
    { 
      label: 'ACTIVE ORDERS', 
      value: deliveryOrders?.filter((d: any) => d.status !== 'Completed').length || 0, 
      subValue: 'ALL POs ISSUED', 
      icon: ShoppingCart, 
      color: '#111f42' 
    },
    { 
      label: 'PENDING JO', 
      value: jobOrders?.filter((j: any) => j.status !== 'Completed').length || 0, 
      subValue: 'WAITING FOR PRODUCTION', 
      icon: Clock4, 
      color: '#ab8a3b' 
    },
    { 
      label: 'OUTBOUND TODAY', 
      value: outLogs?.filter((l: any) => l.date?.startsWith(new Date().toISOString().split('T')[0])).length || 0, 
      subValue: 'OVERALL OEE', 
      icon: Truck, 
      color: '#10b981', 
      trend: { value: '1.2%', isPositive: true } 
    },
    { 
      label: 'LUMBER SPEND', 
      value: '฿2.45M', 
      subValue: 'NET VALUE', 
      icon: Circle, 
      color: '#952425' 
    }
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
      {kpis.map((kpi, i) => (
        <KpiCard
          key={`kpi-card-${i}`}
          label={kpi.label}
          value={kpi.value}
          subValue={kpi.subValue}
          icon={kpi.icon}
          color={kpi.color}
          trend={kpi.trend}
        />
      ))}
    </div>
  );
};

import React from 'react';
import { ShoppingBag, Truck, PackageCheck, Coins } from 'lucide-react';
import { KpiCard } from '../../../components/shared/KpiCard';

interface Stats {
  total: number;
  pendingDelivery: number;
  onTimeRate: number;
  totalSpend: number;
}

export default function KpiSection({ stats }: { stats: Stats }) {
  const formatCurrency = (val: number) => '฿' + (val || 0)?.toLocaleString();

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 shrink-0 animate-in fade-in duration-500">
      <KpiCard 
        label="Total Orders" 
        value={stats.total} 
        color="#111f42" 
        icon={ShoppingBag} 
        subValue="All POs Issued" 
      />
      <KpiCard 
        label="Pending Delivery" 
        value={stats.pendingDelivery} 
        color="#ab8a3b" 
        icon={Truck} 
        subValue="Waiting for Goods" 
      />
      <KpiCard 
        label="On-Time Rate" 
        value={`${stats.onTimeRate}%`} 
        color="#10b981" 
        icon={PackageCheck} 
        subValue="Vendor Performance"
        trend={{ value: '1.2%', isPositive: true }}
      />
      <KpiCard 
        label="Total Spend" 
        value={formatCurrency(stats.totalSpend)} 
        color="#E3624A" 
        icon={Coins} 
        subValue="Net Value"
      />
    </div>
  );
}

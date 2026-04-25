import React from 'react';
import { FileText, Clock, CheckCircle, Coins } from 'lucide-react';
import { KpiCard } from '../../../components/shared/KpiCard';

interface Stats {
  total: number;
  pendingApprove: number;
  approvalRate: number;
  totalBudget: number;
  prevMonthBudget: number;
}

export default function KpiSection({ stats }: { stats: Stats }) {
  const formatCurrency = (val: number) => '฿' + (val || 0)?.toLocaleString();

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 shrink-0 animate-in fade-in duration-500">
      <KpiCard 
        label="Total PRs" 
        value={stats.total} 
        color="#111f42" 
        icon={FileText} 
        subValue="Requests Created" 
      />
      <KpiCard 
        label="Pending Approval" 
        value={stats.pendingApprove} 
        color="#ab8a3b" 
        icon={Clock} 
        subValue="Waiting Manager" 
      />
      <KpiCard 
        label="Approved Rate" 
        value={`${stats.approvalRate}%`} 
        color="#10b981" 
        icon={CheckCircle} 
        subValue="Success Rate"
        trend={{ value: '2.4%', isPositive: true }}
      />
      <KpiCard 
        label="Total Budget" 
        value={formatCurrency(stats.totalBudget)} 
        color="#E3624A" 
        icon={Coins} 
        subValue="Approved Amount"
      />
    </div>
  );
}

import React from 'react';
import { 
  Eye, 
  Pencil, 
  MoreHorizontal,
  ChevronDown,
  LayoutGrid
} from 'lucide-react';
import { JobOrder } from '../types';

interface ProductionTableProps {
  data: JobOrder[];
  onView: (order: JobOrder) => void;
  onEdit: (order: JobOrder) => void;
}

export default function ProductionTable({ data, onView, onEdit }: ProductionTableProps) {
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Completed':
        return 'bg-emerald-50 text-emerald-600 border-emerald-100';
      case 'In Progress':
        return 'bg-blue-50 text-blue-600 border-blue-100';
      default:
        return 'bg-slate-100 text-slate-500 border-slate-200';
    }
  };

  return (
    <div className="w-full relative overflow-x-auto custom-scrollbar">
      <table className="w-full text-left border-collapse whitespace-nowrap">
        <thead className="bg-[#111f42] text-white sticky top-0 z-20">
          <tr>
            <th className="px-6 py-5 text-[10px] font-black uppercase tracking-[0.2em]">Order Status</th>
            <th className="px-6 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-[#ab8a3b]">JO Number</th>
            <th className="px-6 py-5 text-[10px] font-black uppercase tracking-[0.2em]">Product Name</th>
            <th className="px-6 py-5 text-[10px] font-black uppercase tracking-[0.2em]">Production Stage</th>
            <th className="px-6 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-center">Progress</th>
            <th className="px-6 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-center">Due Date</th>
            <th className="px-6 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-center">Action</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100 bg-white">
          {data.map((order) => {
            const progress = (order.received / order.qty) * 100;
            
            return (
              <tr key={order.id} className="hover:bg-slate-50/80 transition-colors group">
                <td className="px-6 py-4">
                  <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border ${getStatusBadge(order.status)}`}>
                    {order.status}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <div className="flex flex-col">
                    <span className="font-mono font-black text-[#111f42] text-[13px] tracking-wider">{order.joNo}</span>
                    <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">Ref: {order.soRef || 'INTERNAL'}</span>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex flex-col">
                    <span className="font-bold text-[#111f42] text-[13px] uppercase tracking-tight line-clamp-1">{order.productName}</span>
                    <span className="text-[10px] text-slate-400 font-mono tracking-wider">{order.sku}</span>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2.5">
                    <div className="p-2 bg-[#ab8a3b]/10 text-[#ab8a3b] rounded-lg">
                      <LayoutGrid size={14} />
                    </div>
                    <span className="text-[11px] font-black text-[#111f42] uppercase tracking-widest">{order.currentStage}</span>
                  </div>
                </td>
                <td className="px-6 py-4 min-w-[140px]">
                  <div className="flex flex-col gap-2">
                    <div className="flex justify-between items-end">
                      <span className="text-[10px] font-black text-slate-400 font-mono">{order.received} / {order.qty}</span>
                      <span className="text-[11px] font-black text-[#111f42] font-mono">{Math.round(progress)}%</span>
                    </div>
                    <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-[#ab8a3b] rounded-full transition-all duration-1000"
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 text-center">
                  <div className="flex flex-col items-center">
                    <span className="font-mono font-bold text-[#111f42] text-[11px]">{order.dueDate}</span>
                    <span className={`text-[10px] font-black uppercase tracking-widest mt-1 ${order.priority === 'Urgent' ? 'text-red-500' : 'text-slate-400'}`}>
                      {order.priority}
                    </span>
                  </div>
                </td>
                <td className="px-6 py-4 text-center">
                  <div className="flex items-center justify-center gap-1.5 opacity-40 group-hover:opacity-100 transition-all">
                    <button 
                      onClick={() => onView(order)}
                      className="p-2 text-[#3b82f6] hover:bg-blue-50 rounded-xl transition-colors border border-transparent hover:border-blue-100"
                    >
                      <Eye size={18} />
                    </button>
                    <button 
                      onClick={() => onEdit(order)}
                      className="p-2 text-[#ab8a3b] hover:bg-amber-50 rounded-xl transition-colors border border-transparent hover:border-amber-100"
                    >
                      <Pencil size={18} />
                    </button>
                    <button className="p-2 text-slate-400 hover:bg-slate-50 rounded-xl transition-colors border border-transparent hover:border-slate-100">
                      <MoreHorizontal size={18} />
                    </button>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

import React from 'react';
import { motion, Reorder } from 'motion/react';
import { 
  Clock, 
  AlertTriangle, 
  CheckCircle2, 
  ArrowRight,
  MoreVertical,
  User,
  Hash
} from 'lucide-react';
import { JobOrder, ProductionStage } from '../types';

interface KanbanBoardProps {
  jobOrders: JobOrder[];
  stages: ProductionStage[];
  onMoveOrder: (id: string, newStage: ProductionStage) => void;
  onViewDetail: (order: JobOrder) => void;
}

export default function KanbanBoard({ jobOrders, stages, onMoveOrder, onViewDetail }: KanbanBoardProps) {
  const getOrdersByStage = (stage: ProductionStage) => {
    return jobOrders.filter(order => order.currentStage === stage);
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'Urgent': return 'text-red-600 bg-red-50 border-red-100';
      case 'High': return 'text-orange-600 bg-orange-50 border-orange-100';
      default: return 'text-blue-600 bg-blue-50 border-blue-100';
    }
  };

  return (
    <div className="flex gap-6 overflow-x-auto pb-6 min-h-[600px] no-scrollbar">
      {stages?.map((stage) => (
        <div key={stage} className="flex-shrink-0 w-80 bg-slate-100/50 rounded-3xl p-4 flex flex-col border border-slate-200/60">
          <div className="flex items-center justify-between mb-4 px-2">
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-6 bg-[#ab8a3b] rounded-full shadow-sm"></div>
              <h3 className="text-sm font-black text-[#111f42] uppercase tracking-widest">{stage}</h3>
              <span className="bg-white border border-slate-200 text-slate-500 text-[10px] font-black px-2 py-0.5 rounded-full">
                {getOrdersByStage(stage).length}
              </span>
            </div>
            <button className="text-slate-400 hover:text-[#111f42] transition-colors p-1">
              <MoreVertical size={16} />
            </button>
          </div>

          <div className="flex-1 space-y-4">
            {getOrdersByStage(stage)?.map((order) => (
              <motion.div
                key={order.id}
                layoutId={order.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                onClick={() => onViewDetail(order)}
                className="bg-white p-5 rounded-[24px] shadow-sm border border-slate-200 hover:border-[#ab8a3b] transition-all cursor-pointer group relative overflow-hidden"
              >
                {/* Priority Indicator */}
                <div className={`absolute top-0 right-0 px-3 py-1 rounded-bl-xl text-[8px] font-black uppercase tracking-widest border-l border-b ${getPriorityColor(order.priority)}`}>
                  {order.priority}
                </div>

                <div className="flex items-center gap-2 mb-3">
                  <Hash size={12} className="text-[#ab8a3b]" />
                  <span className="text-[11px] font-black text-[#111f42] tracking-wider">{order.joNo}</span>
                </div>

                <h4 className="text-sm font-bold text-[#111f42] mb-3 line-clamp-2 uppercase tracking-tight leading-tight">
                  {order.productName}
                </h4>

                <div className="grid grid-cols-2 gap-3 mb-4">
                  <div className="bg-slate-50 p-2 rounded-xl border border-slate-100">
                    <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-0.5">Target Qty</p>
                    <p className="text-xs font-black text-[#111f42] font-mono">{order.qty}</p>
                  </div>
                  <div className="bg-slate-50 p-2 rounded-xl border border-slate-100">
                    <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-0.5">Completed</p>
                    <p className="text-xs font-black text-emerald-600 font-mono">{order.received}</p>
                  </div>
                </div>

                <div className="flex items-center justify-between text-slate-400">
                  <div className="flex items-center gap-1.5 text-[10px] font-bold">
                    <Clock size={12} />
                    <span className="font-mono">{order.dueDate}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <User size={12} />
                    <span className="text-[10px] font-bold uppercase truncate max-w-[80px]">
                      {order.customerName || 'N/A'}
                    </span>
                  </div>
                </div>

                {/* Quick Advance Button */}
                {stage !== 'Packing' && stage !== 'Completed' && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      const currentIndex = stages.indexOf(stage);
                      if (currentIndex < stages.length - 1) {
                        onMoveOrder(order.id, stages[currentIndex + 1]);
                      }
                    }}
                    className="absolute -bottom-10 group-hover:bottom-0 left-0 right-0 h-10 bg-[#111f42] text-white flex items-center justify-center gap-2 transition-all duration-300 hover:bg-[#1e346b]"
                  >
                    <span className="text-[9px] font-black uppercase tracking-widest">Move to {stages[stages.indexOf(stage) + 1]}</span>
                    <ArrowRight size={14} className="text-[#ab8a3b]" />
                  </button>
                )}
              </motion.div>
            ))}
            
            {getOrdersByStage(stage).length === 0 && (
              <div className="border-2 border-dashed border-slate-200 rounded-[24px] py-12 flex flex-col items-center justify-center text-slate-300 opacity-60">
                <Clock size={32} strokeWidth={1} />
                <p className="text-[10px] font-bold uppercase tracking-widest mt-2">Empty Column</p>
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}

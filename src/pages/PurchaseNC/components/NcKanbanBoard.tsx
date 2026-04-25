import React from 'react';
import { ArrowRight, Send, QrCode, ChevronUp } from 'lucide-react';

interface ScarItem {
  id: string;
  date: string;
  vendor: string;
  item: string;
  problem: string;
  severity: string;
  status: string;
  email?: string;
}

interface NcKanbanBoardProps {
  monthFilteredData: ScarItem[];
  stackExpanded: Record<string, boolean>;
  setStackExpanded: React.Dispatch<React.SetStateAction<Record<string, boolean>>>;
  openModal: (mode: string, data: ScarItem) => void;
  handleSendEmail: (item: ScarItem) => void;
  getSeverityClass: (severity: string) => string;
  formatDate: (date: string) => string;
}

const NcKanbanBoard: React.FC<NcKanbanBoardProps> = ({
  monthFilteredData,
  stackExpanded,
  setStackExpanded,
  openModal,
  handleSendEmail,
  getSeverityClass,
  formatDate
}) => {
  const statuses = ['Submitted', 'Vendor Responded', 'Follow up', 'Closed'];

  return (
    <div className="animate-in fade-in duration-500 w-full overflow-x-auto pb-4 kanban-scroll no-print">
      <div className="flex gap-6 min-w-max h-[620px] px-1">
        {statuses?.map(status => {
          const allColItems = monthFilteredData.filter(d => d.status === status);
          const isStacked = !stackExpanded[status] && allColItems.length > 1;
          
          return (
            <div key={status} className="w-[300px] flex flex-col h-full bg-slate-50 rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
              <div className={`flex justify-between items-center px-4 py-3 border-b ${status === 'Submitted' ? 'bg-rose-50' : status === 'Closed' ? 'bg-emerald-50' : 'bg-amber-50'}`}>
                <h4 className="font-bold text-slate-700 text-sm tracking-tight">{status}</h4>
                <span className="bg-white text-slate-500 text-[10px] px-2 py-0.5 rounded font-bold shadow-sm">{allColItems.length}</span>
              </div>
              <div className="flex-1 overflow-y-auto kanban-scroll p-3 relative">
                {stackExpanded[status] && allColItems.length > 1 && (
                  <button 
                    onClick={() => setStackExpanded(prev => ({ ...prev, [status]: false }))} 
                    className="w-full mb-3 bg-white text-slate-400 border border-slate-200 text-[10px] font-bold py-1.5 rounded uppercase flex items-center justify-center gap-1 shadow-sm"
                  >
                    <ChevronUp size={12} /> Stack Cards
                  </button>
                )}
                <div className={`flex flex-col transition-all duration-500 ${isStacked ? 'pt-2 pb-10' : 'space-y-3'}`}>
                  {allColItems?.map((item, index) => (
                    <div 
                      key={item.id} 
                      className={`bg-white p-3 rounded-xl shadow-sm border hover:shadow-md transition-all cursor-pointer group flex flex-col gap-2 relative ${isStacked ? 'border-slate-300' : 'border-slate-200'}`} 
                      style={isStacked ? { 
                        marginTop: index > 0 ? '-105px' : '0px', 
                        zIndex: index, 
                        transform: `scale(${1 - (index * 0.015)})`, 
                        boxShadow: index > 0 ? '0px -6px 12px rgba(0,0,0,0.06)' : '' 
                      } : {}} 
                      onClick={() => { 
                        if (isStacked) setStackExpanded(prev => ({ ...prev, [status]: true })); 
                        else openModal('view', item); 
                      }}
                    >
                      <div className="flex justify-between items-start mb-1">
                        <span className="font-bold text-[10px] text-rose-600 bg-rose-50 px-1.5 py-0.5 rounded border border-rose-100">{item.id}</span>
                        <span className="text-[9px] text-slate-400 font-mono">{formatDate(item.date)}</span>
                      </div>
                      <div className="text-[11px] font-bold text-[#111f42] mb-0.5 uppercase truncate">{item.vendor}</div>
                      <div className="text-[10px] text-slate-500 line-clamp-2 italic">"{item.problem}"</div>
                      <div className="border-t pt-2 mt-1 flex justify-between items-center border-slate-50">
                        <span className={`text-[8px] font-black uppercase px-2 py-0.5 rounded shadow-sm ${getSeverityClass(item.severity)}`}>
                          {item.severity}
                        </span>
                        <ArrowRight size={12} className="text-slate-300 group-hover:text-[#111f42]" />
                      </div>
                      {!isStacked && status === 'Submitted' && (
                        <div className="flex gap-1 mt-2 pt-2 border-t border-slate-100">
                          <button 
                            onClick={(e) => { e.stopPropagation(); handleSendEmail(item); }} 
                            className="flex-1 bg-blue-50 text-blue-600 text-[9px] font-bold py-1.5 rounded uppercase flex items-center justify-center gap-1 transition-colors"
                          >
                            <Send size={10} /> Send
                          </button>
                          <button 
                            onClick={(e) => { e.stopPropagation(); openModal('vendor', item); }} 
                            className="flex-1 bg-amber-50 text-amber-600 text-[9px] font-bold py-1.5 rounded uppercase tracking-widest flex items-center justify-center gap-1 transition-colors"
                          >
                            <QrCode size={10} /> Vendor
                          </button>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default NcKanbanBoard;

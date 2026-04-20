import React, { useState, useMemo } from 'react';
import { 
  Plus, 
  Activity, 
  Search, 
  Filter, 
  ChevronDown,
  LayoutGrid, 
  Table as TableIcon,
  Calendar,
  AlertCircle,
  Clock4,
  CheckCircle2,
  ChevronRight,
  HelpCircle,
  Loader2,
  Package,
  RefreshCcw,
  Settings2,
  BarChart3,
  Clock,
  List
} from 'lucide-react';
import { useGoogleSheets } from '../../hooks/useGoogleSheets';
import { JobOrder, ProductionStage } from './types';
import KanbanBoard from './components/KanbanBoard';
import JobOrderModal from './components/JobOrderModal';
import { KpiCard } from '../../components/shared/KpiCard';
import { DataTable } from '../../components/shared/DataTable';
import { ColumnDef } from '@tanstack/react-table';
import Swal from 'sweetalert2';

const STAGES: ProductionStage[] = [
  'Pending', 
  'Cutting', 
  'Assembly', 
  'Finishing', 
  'Upholstery', 
  'QC', 
  'Packing',
  'Completed'
];

export default function ProductionTracking() {
  const [activeView, setActiveView] = useState<'kanban' | 'list'>('kanban');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStage, setSelectedStage] = useState<ProductionStage | 'All'>('All');
  const [isGuideOpen, setIsGuideOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingOrder, setEditingOrder] = useState<JobOrder | undefined>(undefined);

  // Data Fetching
  const { data: jobOrders, addRow: addJO, updateRow: updateJO, loading, refetch } = useGoogleSheets<any>('JobOrders');

  // Logic: Type normalization & currentStage fallback
  const normalizedOrders = useMemo(() => {
    return (jobOrders || []).map((jo: any) => ({
      ...jo,
      id: String(jo.id),
      qty: Number(jo.qty) || 0,
      received: Number(jo.received) || 0,
      currentStage: (jo.currentStage as ProductionStage) || 'Pending',
      status: jo.status || 'Not Started',
      priority: jo.priority || 'Normal',
      dueDate: jo.dueDate || '-',
    })) as JobOrder[];
  }, [jobOrders]);

  const filteredOrders = useMemo(() => {
    return normalizedOrders.filter(order => {
      const matchesSearch = 
        order.joNo.toLowerCase().includes(searchQuery.toLowerCase()) ||
        order.productName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        order.sku.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesStage = selectedStage === 'All' || order.currentStage === selectedStage;
      
      return matchesSearch && matchesStage;
    });
  }, [normalizedOrders, searchQuery, selectedStage]);

  // KPIs
  const stats = useMemo(() => {
    return {
      active: normalizedOrders.filter(o => o.status !== 'Completed').length,
      delayed: normalizedOrders.filter(o => {
        if (o.status === 'Completed') return false;
        const due = new Date(o.dueDate);
        return !isNaN(due.getTime()) && due < new Date();
      }).length,
      qcPending: normalizedOrders.filter(o => o.currentStage === 'QC').length,
      completedToday: normalizedOrders.filter(o => o.status === 'Completed').length // simplified
    };
  }, [normalizedOrders]);

  // Table Columns Definition
  const columns = useMemo<ColumnDef<JobOrder>[]>(() => [
    {
      accessorKey: 'joNo',
      header: 'Job ID',
      cell: info => <span className="font-mono text-[#E3624A] uppercase">{info.getValue() as string}</span>,
    },
    {
      accessorKey: 'productName',
      header: 'Product',
      cell: info => <span className="font-black truncate block max-w-[200px]">{info.getValue() as string}</span>,
    },
    {
      accessorKey: 'customer',
      header: 'Client',
    },
    {
      accessorKey: 'currentStage',
      header: 'Stage',
      cell: info => {
        const stage = info.getValue() as string;
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-slate-100 text-slate-600 rounded-lg text-[10px] font-black uppercase tracking-wider">
            <Activity size={10} /> {stage}
          </span>
        );
      }
    },
    {
      accessorKey: 'qty',
      header: 'Quantity',
      cell: info => <span className="font-mono text-base">{info.getValue() as number}</span>,
    },
    {
      accessorKey: 'dueDate',
      header: 'Due Date',
      cell: info => {
        const dateStr = info.getValue() as string;
        if (!dateStr || dateStr === '-') return '-';
        const date = new Date(dateStr);
        const isOverdue = !isNaN(date.getTime()) && date < new Date() && info.row.original.status !== 'Completed';
        return (
          <span className={isOverdue ? 'text-[#E3624A] font-black' : 'font-bold'}>
            {!isNaN(date.getTime()) ? date.toLocaleDateString('en-GB') : dateStr}
          </span>
        );
      }
    },
    {
      id: 'actions',
      header: 'Actions',
      cell: info => (
        <button 
          onClick={() => {
            setEditingOrder(info.row.original);
            setIsModalOpen(true);
          }}
          className="p-2 text-[#111f42] hover:bg-slate-50 border border-transparent hover:border-slate-200 rounded-xl transition-all"
        >
          <ChevronRight size={18} />
        </button>
      )
    }
  ], []);

  // Handlers
  const handleMoveOrder = async (id: string, newStage: ProductionStage) => {
    const status = newStage === 'Completed' ? 'Completed' : 'In Progress';
    try {
      await updateJO(id, { currentStage: newStage, status });
    } catch (error) {
      console.error('Failed to move order:', error);
    }
  };

  const handleSaveOrder = async (data: Partial<JobOrder>) => {
    try {
      if (editingOrder) {
        await updateJO(editingOrder.id, data);
        Swal.fire({ icon: 'success', title: 'Work Order Updated', toast: true, position: 'top-end', showConfirmButton: false, timer: 3000 });
      } else {
        await addJO({ ...data, status: data.status || 'Not Started', currentStage: data.currentStage || 'Pending' });
        Swal.fire({ icon: 'success', title: 'New Work Order Created', toast: true, position: 'top-end', showConfirmButton: false, timer: 3000 });
      }
      setIsModalOpen(false);
      setEditingOrder(undefined);
    } catch (error) {
      Swal.fire({ icon: 'error', title: 'Failed to Save', text: 'Please check your connection.' });
    }
  };

  return (
    <div className="min-h-screen bg-[#F9F7F6] pt-8 px-8 pb-10 flex flex-col gap-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
      
      <header className="flex flex-col md:flex-row justify-between items-center gap-6 z-10 shrink-0">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 bg-white flex items-center justify-center rounded-2xl shadow-sm border border-slate-200 text-[#111f42]">
            <Activity size={28} strokeWidth={2.5} />
          </div>
          <div>
            <h1 className="text-2xl font-black tracking-tight uppercase leading-none">
              <span className="text-[#ab8a3b]">PRODUCTION</span> <span className="text-[#111f42]">TRACKING</span>
            </h1>
            <p className="text-slate-400 text-[10px] font-black uppercase tracking-[0.2em] mt-1.5 flex items-center gap-1.5">
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
              Live Manufacturing Operations Hub
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex bg-[#e2e8f0] p-1 border border-slate-200 shadow-inner rounded-xl h-11 overflow-hidden">
            <button 
              onClick={() => setActiveView('kanban')}
              className={`px-6 py-2 text-[10px] font-black transition-all rounded-lg uppercase tracking-widest flex items-center gap-2 ${activeView === 'kanban' ? 'bg-[#111f42] text-[#ab8a3b] shadow-md' : 'text-slate-500 hover:bg-slate-50'}`}
            >
              <LayoutGrid size={14} /> KANBAN
            </button>
            <button 
              onClick={() => setActiveView('list')}
              className={`px-6 py-2 text-[10px] font-black transition-all rounded-lg uppercase tracking-widest flex items-center gap-2 ${activeView === 'list' ? 'bg-[#111f42] text-[#ab8a3b] shadow-md' : 'text-slate-500 hover:bg-slate-50'}`}
            >
              <List size={14} /> DETAILS
            </button>
          </div>
          
          <button 
            onClick={() => refetch()}
            className="p-2.5 transition-all rounded-xl bg-white text-slate-400 hover:bg-slate-100 border border-slate-200 shadow-sm"
          >
            <RefreshCcw size={18} className={loading ? 'animate-spin' : ''} />
          </button>
          
          <button className="p-2.5 transition-all rounded-xl bg-white text-slate-400 hover:bg-slate-100 border border-slate-200 shadow-sm">
            <Settings2 size={18} />
          </button>

          <button 
            onClick={() => setIsGuideOpen(true)}
            className="p-2.5 transition-all rounded-xl bg-[#111f42] text-[#ab8a3b] border border-[#111f42] shadow-sm hover:brightness-110"
          >
            <HelpCircle size={18} />
          </button>
        </div>
      </header>

      {/* KPI Section */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-5 shrink-0">
        <KpiCard 
          label="Active Workload" 
          value={stats.active} 
          trend="+3 New Today" 
          icon={Activity} 
          color="#111f42"
        />
        <KpiCard 
          label="Delayed Orders" 
          value={stats.delayed} 
          trend="Action Required" 
          icon={AlertCircle} 
          color="#E3624A"
          variant="danger"
        />
        <KpiCard 
          label="QC Verification" 
          value={stats.qcPending} 
          color="#ab8a3b" 
          icon={Package} 
          trend={{ value: "12%", isPositive: true }} 
          subValue="Pending Quality" 
        />
        <KpiCard 
          label="Units Produced" 
          value={stats.completedToday} 
          trend="This Cycle" 
          icon={Clock} 
          color="#10b981"
        />
      </div>

      {/* Toolbar */}
      <div className="bg-white border border-slate-200 rounded-[28px] p-4 flex flex-col lg:flex-row items-center justify-between gap-4 shadow-sm z-20 sticky top-4">
        <div className="flex items-center gap-3 w-full lg:w-auto">
          <div className="relative flex-1 lg:w-80">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
            <input 
              type="text" 
              placeholder="Search by JO#, Product, or SKU..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-2xl pl-12 pr-4 py-3 text-sm font-bold text-[#111f42] outline-none focus:border-[#ab8a3b] transition-all h-[48px]"
            />
          </div>
          
          <div className="relative shrink-0">
            <Filter className="absolute left-4 top-1/2 -translate-y-1/2 text-[#ab8a3b]" size={16} />
            <select 
              value={selectedStage}
              onChange={(e) => setSelectedStage(e.target.value as any)}
              className="appearance-none bg-slate-50 border border-slate-200 rounded-2xl pl-12 pr-10 py-3 outline-none focus:border-[#ab8a3b] text-[#111f42] font-black text-[10px] uppercase tracking-widest shadow-sm transition-all cursor-pointer h-[48px] min-w-[200px]"
            >
              <option value="All">All Production Stages</option>
              {STAGES.map(s => <option key={s} value={s}>{s.toUpperCase()}</option>)}
            </select>
            <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
              <ChevronDown size={14} />
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3 w-full lg:w-auto justify-end">
          <button className="px-6 py-3 bg-white text-[#111f42] border border-slate-200 rounded-2xl font-black text-[10px] shadow-sm uppercase tracking-widest flex items-center gap-2 hover:bg-slate-50 transition-all h-[48px]">
            <Calendar size={16} className="text-[#ab8a3b]" />
            Date Range
          </button>
          <button 
            onClick={() => {
              setEditingOrder(undefined);
              setIsModalOpen(true);
            }}
            className="px-6 py-3 bg-[#111f42] text-white rounded-2xl font-black text-[10px] shadow-lg shadow-blue-900/10 uppercase tracking-widest flex items-center gap-2 hover:brightness-110 transition-all h-[48px]"
          >
            <Plus size={18} strokeWidth={3} className="text-[#ab8a3b]" />
            New Job Order
          </button>
        </div>
      </div>

      {/* Content Area */}
      <div className="flex-1 min-h-0 relative">
        {loading ? (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 bg-white/40 backdrop-blur-sm rounded-[32px] z-30">
            <div className="relative w-16 h-16">
              <Loader2 className="animate-spin text-[#ab8a3b]" size={64} strokeWidth={1.5} />
              <Activity className="absolute inset-0 m-auto text-[#111f42]" size={20} />
            </div>
            <p className="font-black text-[#111f42] uppercase tracking-[0.4em] text-[10px] animate-pulse font-mono">Synchronizing Work Orders...</p>
          </div>
        ) : activeView === 'kanban' ? (
          <KanbanBoard 
            jobOrders={filteredOrders} 
            stages={STAGES} 
            onMoveOrder={handleMoveOrder}
            onViewDetail={(order) => {
              setEditingOrder(order);
              setIsModalOpen(true);
            }}
          />
        ) : (
          <DataTable 
            data={filteredOrders}
            columns={columns}
            title="Production Execution Matrix"
            filterColumns={['currentStage', 'priority']}
          />
        )}
      </div>

      {/* Modal */}
      <JobOrderModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveOrder}
        editingOrder={editingOrder}
      />

      {/* Guide Drawer Placeholder */}
      {isGuideOpen && (
        <div className="fixed inset-0 z-[100] flex justify-end">
          <div className="absolute inset-0 bg-[#111f42]/40 backdrop-blur-sm" onClick={() => setIsGuideOpen(false)} />
          <div className="relative w-full max-w-lg bg-white h-full shadow-2xl flex flex-col animate-in slide-in-from-right duration-500">
            <div className="p-8 border-b border-slate-100 flex items-center justify-between">
              <h2 className="text-xl font-black text-[#111f42] uppercase tracking-tighter">Production Guide</h2>
              <button onClick={() => setIsGuideOpen(false)} className="p-2 hover:bg-slate-100 rounded-xl transition-colors">
                <ChevronDown size={24} className="rotate-[-90deg]" />
              </button>
            </div>
            <div className="p-8 flex-1 overflow-y-auto">
              {/* Add meaningful guide content here */}
              <div className="space-y-6">
                 <div>
                    <h4 className="text-sm font-black text-[#ab8a3b] uppercase mb-2">Workflow Management</h4>
                    <p className="text-xs text-slate-500 font-medium leading-relaxed">
                      Use the Kanban board to track Job Orders through the factory floor. Drag orders or use the quick-action button to advance to the next stage.
                    </p>
                 </div>
                 <div className="grid grid-cols-1 gap-4">
                    {[
                      { label: 'Cutting', desc: 'Raw material dimensioning' },
                      { label: 'Assembly', desc: 'Structural joining' },
                      { label: 'Finishing', desc: 'Sanding and coating' },
                      { label: 'Upholstery', desc: 'Padding and fabric' }
                    ].map((s, i) => (
                      <div key={i} className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                         <span className="text-[10px] font-black text-[#111f42] uppercase underline decoration-[#ab8a3b] decoration-2 underline-offset-4">{s.label}</span>
                         <p className="text-[10px] text-slate-400 font-bold mt-2 uppercase tracking-widest">{s.desc}</p>
                      </div>
                    ))}
                 </div>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

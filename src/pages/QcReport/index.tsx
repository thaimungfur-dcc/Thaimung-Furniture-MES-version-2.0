import React, { useState, useEffect } from 'react';
import { 
  ClipboardCheck, 
  Search, 
  Calendar, 
  CheckCircle,
  XCircle,
  AlertTriangle,
  Printer
} from 'lucide-react';
import { ColumnDef } from '@tanstack/react-table';
import { PageHeader } from '../../components/shared/PageHeader';
import { DataTable } from '../../components/shared/DataTable';

interface QcItem {
  id: string;
  date: string;
  product: string;
  batch: string;
  inspector: string;
  totalQty: number;
  passQty: number;
  failQty: number;
  status: string;
  remarks: string;
}

export default function QcReport() {
  const [reportData, setReportData] = useState<QcItem[]>([]);
  const [loading, setLoading] = useState(false);
  // Optional: Month filtering can be handled manually if we want a separate UI control, 
  // but DataTable already handles global search. We will keep the month selector for specific KPI filtering.
  const [selectedMonth, setSelectedMonth] = useState('2026-03');

  useEffect(() => {
    setLoading(true);
    setTimeout(() => {
      const mockData: QcItem[] = [
        { id: 'QC-2603-001', date: '2026-03-01', product: 'โต๊ะทำงาน T-01', batch: 'B-001', inspector: 'สมชาย', totalQty: 100, passQty: 98, failQty: 2, status: 'Passed', remarks: 'รอยขีดข่วนเล็กน้อย 2 ตัว' },
        { id: 'QC-2603-002', date: '2026-03-02', product: 'เก้าอี้ C-05', batch: 'B-002', inspector: 'วิภา', totalQty: 200, passQty: 180, failQty: 20, status: 'Failed', remarks: 'น็อตหลวม 20 ตัว' },
        { id: 'QC-2603-003', date: '2026-03-05', product: 'ตู้เสื้อผ้า W-02', batch: 'B-003', inspector: 'นพดล', totalQty: 50, passQty: 50, failQty: 0, status: 'Passed', remarks: 'ปกติ' },
        { id: 'QC-2603-004', date: '2026-03-08', product: 'เตียงนอน B-01', batch: 'B-004', inspector: 'สมชาย', totalQty: 30, passQty: 28, failQty: 2, status: 'Passed', remarks: 'สีถลอก 2 ตัว' },
        { id: 'QC-2603-005', date: '2026-03-10', product: 'ชั้นวางของ S-03', batch: 'B-005', inspector: 'วิภา', totalQty: 150, passQty: 145, failQty: 5, status: 'Passed', remarks: 'ไม้บิ่น 5 ตัว' },
      ];
      setReportData(mockData);
      setLoading(false);
    }, 500);
  }, []);

  const filteredData = reportData.filter(item => item.date.startsWith(selectedMonth));

  const totalInspected = filteredData.reduce((acc, curr) => acc + curr.totalQty, 0);
  const totalPassed = filteredData.reduce((acc, curr) => acc + curr.passQty, 0);
  const totalFailed = filteredData.reduce((acc, curr) => acc + curr.failQty, 0);
  const passRate = totalInspected > 0 ? ((totalPassed / totalInspected) * 100).toFixed(1) : '0.0';

  const columns: ColumnDef<QcItem>[] = [
    {
      accessorKey: 'id',
      header: 'QC NO.',
      cell: info => <span className="font-bold text-[#111f42]">{info.getValue() as string}</span>
    },
    {
      accessorKey: 'date',
      header: 'DATE',
      cell: info => {
        const val = info.getValue() as string;
        if (!val) return '-';
        return <span className="text-slate-500 font-mono">{new Date(val).toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' })}</span>;
      }
    },
    {
      accessorKey: 'product',
      header: 'PRODUCT',
      cell: info => <span className="font-bold text-slate-700">{info.getValue() as string}</span>
    },
    {
      accessorKey: 'batch',
      header: 'BATCH'
    },
    {
      accessorKey: 'totalQty',
      header: 'TOTAL QTY',
      cell: info => <div className="text-right font-mono font-bold">{info.getValue() as number}</div>
    },
    {
      accessorKey: 'passQty',
      header: 'PASS QTY',
      cell: info => <div className="text-right font-mono font-bold text-emerald-600">{info.getValue() as number}</div>
    },
    {
      accessorKey: 'failQty',
      header: 'FAIL QTY',
      cell: info => <div className="text-right font-mono font-bold text-rose-600">{info.getValue() as number}</div>
    },
    {
      accessorKey: 'status',
      header: 'STATUS',
      cell: info => {
        const status = info.getValue() as string;
        return (
          <div className="text-center">
            <span className={`px-2.5 py-1 rounded text-[9px] font-bold uppercase shadow-sm whitespace-nowrap ${status === 'Passed' ? 'bg-emerald-50 text-emerald-600 border border-emerald-200' : 'bg-rose-50 text-rose-600 border border-rose-200'}`}>
              {status}
            </span>
          </div>
        );
      }
    },
    {
      accessorKey: 'inspector',
      header: 'INSPECTOR'
    },
    {
      accessorKey: 'remarks',
      header: 'REMARKS',
      cell: info => <span className="text-slate-500 italic max-w-xs truncate block">{info.getValue() as string}</span>
    }
  ];

  return (
    <div className="flex flex-col space-y-6 pt-8 pb-10">
      <style>{`
        * { font-family: 'JetBrains Mono', 'Noto Sans Thai', sans-serif !important; }
        @media print {
          @page { size: A4 landscape; margin: 10mm; }
          .no-print { display: none !important; }
        }
      `}</style>
      
      {/* Header */}
      <PageHeader 
        title="QC REPORT" 
        subtitle="Quality Control Summary"
        icon={ClipboardCheck}
        rightContent={
          <div className="flex items-center bg-white border border-slate-200 rounded-lg shadow-sm">
            <div className="px-3 py-2.5 bg-slate-50 border-r border-slate-200 text-slate-500">
              <Calendar size={14} />
            </div>
            <input 
              type="month" 
              value={selectedMonth} 
              onChange={(e) => setSelectedMonth(e.target.value)} 
              className="px-3 py-2 text-[12px] font-bold text-[#111f42] outline-none hover:bg-slate-50 cursor-pointer rounded-r-lg" 
            />
          </div>
        }
        actionButton={
          <button onClick={() => window.print()} className="bg-[#111f42] text-white px-4 py-2.5 rounded-lg font-bold text-[11px] uppercase tracking-widest flex items-center gap-2 shadow-md hover:bg-[#111f42]/90 transition-all">
            <Printer size={16} /> Print
          </button>
        }
      />

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 no-print flex-shrink-0">
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center">
            <ClipboardCheck size={24} />
          </div>
          <div>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Total Inspected</p>
            <p className="text-2xl font-black text-[#111f42]">{totalInspected}</p>
          </div>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <CheckCircle size={24} />
          </div>
          <div>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Total Passed</p>
            <p className="text-2xl font-black text-emerald-600">{totalPassed}</p>
          </div>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-rose-50 text-rose-600 flex items-center justify-center">
            <XCircle size={24} />
          </div>
          <div>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Total Failed</p>
            <p className="text-2xl font-black text-rose-600">{totalFailed}</p>
          </div>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-amber-50 text-amber-600 flex items-center justify-center">
            <AlertTriangle size={24} />
          </div>
          <div>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Pass Rate</p>
            <p className="text-2xl font-black text-amber-600">{passRate}%</p>
          </div>
        </div>
      </div>

      {/* Report Table via Shared DataTable */}
      <div className="flex-1 flex flex-col">
        {loading ? (
          <div className="flex items-center justify-center p-12 bg-white rounded-xl border border-slate-200 shadow-sm">
             <span className="text-slate-400 font-bold uppercase tracking-widest text-sm">Loading Data...</span>
          </div>
        ) : (
          <DataTable 
            data={filteredData} 
            columns={columns} 
            fileName={`QC_Report_${selectedMonth}`} 
            searchPlaceholder="Search QC No., Product, Batch..."
          />
        )}
      </div>
    </div>
  );
}

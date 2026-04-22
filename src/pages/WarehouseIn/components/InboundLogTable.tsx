import React from 'react';
import { Eye, Printer, Tag } from 'lucide-react';
import { ColumnDef } from '@tanstack/react-table';
import { DataTable } from '../../../components/shared/DataTable';

interface InboundLogTableProps {
  data: any[];
  getStatusClass: (status: string) => string;
  onOpenTransactionDetail: (item: any) => void;
  onOpenPrintDocModal: (item: any) => void;
  onOpenTagModal: (item: any) => void;
}

export default function InboundLogTable({
  data, getStatusClass, onOpenTransactionDetail, onOpenPrintDocModal, onOpenTagModal
}: InboundLogTableProps) {
  const columns: ColumnDef<any>[] = [
    {
      accessorKey: 'transId',
      header: 'TRANS ID',
      cell: ({ row }) => <span className="font-black text-[#111f42] font-mono">{String(row.getValue('transId'))}</span>
    },
    {
      accessorKey: 'date',
      header: 'DATE',
      cell: ({ row }) => <span className="text-slate-500 font-mono text-[11px]">{String(row.getValue('date'))}</span>
    },
    {
      accessorKey: 'receiveFrom',
      header: 'SOURCE',
      cell: ({ row }) => <span className="px-2 py-0.5 rounded-none bg-slate-100 text-slate-600 font-black uppercase text-[9px] border border-slate-200 tracking-widest">{String(row.getValue('receiveFrom'))}</span>
    },
    {
      accessorKey: 'refNo',
      header: 'REF DOC',
      cell: ({ row }) => <span className="font-black text-[#ab8a3b] font-mono tracking-tighter uppercase text-[12px]">{String(row.getValue('refNo'))}</span>
    },
    {
      id: 'product',
      header: 'LOGISTICS TARGET',
      accessorFn: (row) => `${row.sku} ${row.itemName}`,
      cell: ({ row }) => (
        <div className="flex flex-col">
          <span className="font-mono font-black text-[#111f42] text-[11px] tracking-tight">{String(row.original.sku)}</span>
          <span className="text-slate-400 font-black text-[10px] uppercase tracking-wider truncate max-w-[180px]">{String(row.original.itemName)}</span>
        </div>
      )
    },
    {
      accessorKey: 'qty',
      header: 'QTY (+)',
      cell: ({ row }) => <div className="text-right font-mono font-black text-emerald-600 text-[13px]">+{Number(row.getValue('qty')).toLocaleString()}</div>
    },
    {
      id: 'warehouse',
      header: 'STORAGE UNIT',
      accessorFn: (row) => `${row.warehouseName} ${row.location}`,
      cell: ({ row }) => (
        <div className="flex flex-col">
            <span className="font-black text-[#111f42] text-[11px] uppercase tracking-wide">{String(row.original.warehouseName)}</span>
            <span className="text-[10px] text-slate-400 font-mono font-black tracking-widest">{String(row.original.location)}</span>
        </div>
      )
    },
    {
      id: 'lotMfg',
      header: 'BATCH ID / MFG',
      accessorFn: (row) => `${row.lotNo} ${row.mfgDate}`,
      cell: ({ row }) => (
        <div className="text-slate-500 font-mono text-[10px]">
            <span className="font-black text-[#111f42] block uppercase tracking-tighter">{String(row.original.lotNo)}</span>
            {String(row.original.mfgDate || '')}
        </div>
      )
    },
    {
      accessorKey: 'status',
      header: 'STATUS',
      cell: ({ row }) => <span className={`badge ${getStatusClass(String(row.getValue('status')))} text-center block rounded-none uppercase text-[9px] font-black tracking-[0.1em]`}>{String(row.getValue('status'))}</span>
    },
    {
      id: 'action',
      header: 'ACTION',
      cell: ({ row }) => (
        <div className="flex justify-center gap-1 opacity-60 hover:opacity-100 transition-opacity">
            <button onClick={() => onOpenTransactionDetail(row.original)} className="w-8 h-8 flex items-center justify-center bg-white border border-slate-200 text-slate-400 hover:text-blue-600 hover:border-blue-300 rounded-none shadow-sm transition-all" title="Preview/Edit"><Eye size={14} /></button>
            <button onClick={() => onOpenPrintDocModal(row.original)} className="w-8 h-8 flex items-center justify-center bg-white border border-slate-200 text-slate-400 hover:text-[#111f42] hover:border-[#111f42] rounded-none shadow-sm transition-all" title="Print Document"><Printer size={14} /></button>
            <button onClick={() => onOpenTagModal(row.original)} className="w-8 h-8 flex items-center justify-center bg-white border border-slate-200 text-slate-400 hover:text-[#ab8a3b] hover:border-[#ab8a3b] rounded-none shadow-sm transition-all" title="Print Tag"><Tag size={14} /></button>
        </div>
      )
    }
  ];

  return <DataTable data={data} columns={columns} searchPlaceholder="Search Inbound Logs..." fileName="Inbound_Logs" />;
}

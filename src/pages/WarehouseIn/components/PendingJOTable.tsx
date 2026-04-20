import React from 'react';
import { Eye, Download, PowerOff } from 'lucide-react';
import { ColumnDef } from '@tanstack/react-table';
import { DataTable } from '../../../components/shared/DataTable';

interface PendingJOTableProps {
  data: any[];
  getProgressColor: (item: any) => string;
  getStatusClass: (status: string) => string;
  onOpenOrderView: (item: any, tab: string) => void;
  onOpenReceiveModal: (item: any, type: string) => void;
  onForceClose: (item: any, tab: string) => void;
}

export default function PendingJOTable({
  data, getProgressColor, getStatusClass, onOpenOrderView, onOpenReceiveModal, onForceClose
}: PendingJOTableProps) {
  const columns: ColumnDef<any>[] = [
    {
      accessorKey: 'joNo',
      header: 'JO NUMBER',
      cell: ({ row }) => <span className="font-black text-[#ab8a3b] font-mono">{String(row.getValue('joNo'))}</span>
    },
    {
      id: 'product',
      header: 'PRODUCT (SKU/NAME)',
      accessorFn: row => `${row.sku} ${row.productName || row.itemName}`,
      cell: ({ row }) => (
        <div className="flex flex-col">
            <span className="font-mono font-black text-[#111f42] text-[11px]">{String(row.original.sku)}</span>
            <span className="text-slate-400 font-bold text-[10px]">{String(row.original.productName || row.original.itemName)}</span>
        </div>
      )
    },
    {
      accessorKey: 'dueDate',
      header: 'DUE DATE',
      cell: ({ row }) => <div className="text-center text-slate-400 font-mono text-[11px] font-bold">{String(row.getValue('dueDate') || '')}</div>
    },
    {
      accessorKey: 'qty',
      header: 'TARGET',
      cell: ({ row }) => <div className="text-right font-mono font-black text-[#111f42]">{Number(row.getValue('qty')).toLocaleString()}</div>
    },
    {
      accessorKey: 'received',
      header: 'RECEIVED',
      cell: ({ row }) => {
        const qty = Number(row.original.qty) || 1;
        const received = Number(row.original.received) || 0;
        const percent = Math.round((received / qty) * 100);
        return (
          <div className="flex flex-col items-center gap-1.5 w-full mx-auto" style={{maxWidth: '12rem'}}>
              <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden border border-slate-200">
                  <div className="h-full transition-all duration-700 rounded-full" style={{ width: `${percent}%`, backgroundColor: getProgressColor(row.original) }}></div>
              </div>
              <span className="text-[10px] font-mono font-black text-slate-500">{received.toLocaleString()} / {percent}%</span>
          </div>
        );
      }
    },
    {
      id: 'balance',
      header: 'BALANCE',
      accessorFn: row => Math.max(0, Number(row.qty) - Number(row.received)),
      cell: ({ row }) => <div className="text-right font-mono font-black text-rose-500">{Math.max(0, Number(row.original.qty) - Number(row.original.received)).toLocaleString()}</div>
    },
    {
      accessorKey: 'status',
      header: 'STATUS',
      cell: ({ row }) => <span className={`badge ${getStatusClass(String(row.getValue('status')))} text-center block`}>{String(row.getValue('status'))}</span>
    },
    {
      id: 'action',
      header: 'ACTION',
      cell: ({ row }) => {
        const item = row.original;
        return (
            <div className="flex justify-center items-center gap-1 opacity-60 hover:opacity-100 transition-opacity">
                <button onClick={() => onOpenOrderView(item, 'pending_jo')} className="p-1.5 bg-white border border-slate-200 text-slate-400 hover:text-blue-600 hover:border-blue-300 rounded-lg shadow-sm" title="View Detail"><Eye size={14}/></button>
                {item.status !== 'Completed' && (
                    <button onClick={() => onOpenReceiveModal(item, 'JO')} className="p-1.5 bg-white border border-slate-200 text-[#ab8a3b] hover:text-white hover:bg-[#ab8a3b] hover:border-[#ab8a3b] rounded-lg shadow-sm" title="Receive">
                        <Download size={14}/>
                    </button>
                )}
                {item.status === 'In Progress' && (
                    <button onClick={() => onForceClose(item, 'pending_jo')} className="p-1.5 bg-white border border-slate-200 text-rose-400 hover:text-white hover:bg-rose-500 hover:border-rose-500 rounded-lg shadow-sm" title="Force Close">
                        <PowerOff size={14}/>
                    </button>
                )}
            </div>
        );
      }
    }
  ];

  return <DataTable data={data} columns={columns} searchPlaceholder="Search Pending JO..." fileName="Pending_JO" />;
}

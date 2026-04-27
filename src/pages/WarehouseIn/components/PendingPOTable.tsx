import React from 'react';
import { Eye, Download, PowerOff } from 'lucide-react';
import { ColumnDef } from '@tanstack/react-table';
import { DataTable } from '../../../components/shared/DataTable';

interface PendingPOTableProps {
  data: any[];
  getProgressColor: (item: any) => string;
  getStatusClass: (status: string) => string;
  onOpenOrderView: (item: any, tab: string) => void;
  onOpenReceiveModal: (item: any, type: string) => void;
  onForceClose: (item: any, tab: string) => void;
}

export default function PendingPOTable({
  data, getProgressColor, getStatusClass, onOpenOrderView, onOpenReceiveModal, onForceClose
}: PendingPOTableProps) {
  const columns: ColumnDef<any>[] = [
    {
      accessorKey: 'poNo',
      header: 'PO NUMBER',
      cell: ({ row }) => <span className="font-black text-[#ab8a3b] font-mono">{String(row.getValue('poNo'))}</span>
    },
    {
      accessorKey: 'supplier',
      header: 'SUPPLIER',
      cell: ({ row }) => <span className="font-bold text-[#111f42]">{String(row.getValue('supplier') || '')}</span>
    },
    {
      id: 'material',
      header: 'MATERIAL (SKU/NAME)',
      accessorFn: row => `${row.sku} ${row.productName || row.itemName}`,
      cell: ({ row }) => (
        <div className="flex flex-col">
            <span className="font-mono font-black text-[#111f42] text-[11px]">{String(row.original.sku)}</span>
            <span className="text-slate-400 font-bold text-[10px]">{String(row.original.productName || row.original.itemName)}</span>
        </div>
      )
    },
    {
      accessorKey: 'qty',
      header: 'ORDERED',
      cell: ({ row }) => <div className="text-right font-mono font-black text-[#111f42]">{Number(row.getValue('qty'))?.toLocaleString()}</div>
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
              <div className="w-full bg-slate-100 rounded-none h-2.5 overflow-hidden border border-slate-200">
                  <div className="h-full transition-all duration-700 rounded-none" style={{ width: `${percent}%`, backgroundColor: getProgressColor(row.original) }}></div>
              </div>
              <span className="text-[9px] font-mono font-black text-slate-500 uppercase tracking-widest">{received?.toLocaleString()} / {percent}% COMPLETE</span>
          </div>
        );
      }
    },
    {
      id: 'balance',
      header: 'BALANCE',
      accessorFn: row => Math.max(0, Number(row.qty) - Number(row.received)),
      cell: ({ row }) => <div className="text-right font-mono font-black text-rose-500">{Math.max(0, Number(row.original.qty) - Number(row.original.received))?.toLocaleString()}</div>
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
                <button onClick={() => onOpenOrderView(item, 'pending_po')} className="p-2 bg-white border border-slate-200 text-slate-400 hover:text-white hover:bg-[#111f42] hover:border-[#111f42] rounded-none shadow-sm transition-all" title="View Detail"><Eye size={14}/></button>
                {item.status !== 'Completed' && (
                    <button onClick={() => onOpenReceiveModal(item, 'PO')} className="p-2 bg-white border border-slate-200 text-[#ab8a3b] hover:text-white hover:bg-[#ab8a3b] hover:border-[#ab8a3b] rounded-none shadow-sm transition-all" title="Receive">
                        <Download size={14}/>
                    </button>
                )}
                {item.status === 'In Progress' && (
                    <button onClick={() => onForceClose(item, 'pending_po')} className="p-2 bg-white border border-slate-200 text-rose-400 hover:text-white hover:bg-rose-500 hover:border-rose-500 rounded-none shadow-sm transition-all" title="Force Close">
                        <PowerOff size={14}/>
                    </button>
                )}
            </div>
        );
      }
    }
  ];

  return (
    <DataTable 
      data={data} 
      columns={columns} 
      searchPlaceholder="Search Pending PO..." 
      fileName="Pending_PO" 
      filterColumns={['status']}
    />
  );
}

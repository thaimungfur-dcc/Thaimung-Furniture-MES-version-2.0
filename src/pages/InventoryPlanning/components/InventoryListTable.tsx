import React from 'react';
import { ColumnDef } from '@tanstack/react-table';
import { DataTable } from '../../../components/shared/DataTable';

interface InventoryListTableProps {
  data: any[];
  getStatusClass: (status: string) => string;
}

export default function InventoryListTable({ data, getStatusClass }: InventoryListTableProps) {
  const columns: ColumnDef<any>[] = [
    {
      id: 'productInfo',
      header: 'PRODUCT INFORMATION',
      accessorFn: row => `${row.id} ${row.name}`,
      cell: ({ row }) => {
        const item = row.original;
        return (
            <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded border border-slate-100 bg-slate-50 flex items-center justify-center overflow-hidden shrink-0 shadow-sm">
                    {item.image ? <img src={item.image} className="w-full h-full object-cover" alt="Product" /> : <span className="text-xs text-slate-300">N/A</span>}
                </div>
                <div className="flex flex-col">
                    <span className="font-black text-[#ab8a3b] font-mono text-[11px] leading-none mb-1">{item.id}</span>
                    <span className="font-bold text-[#111f42] text-[12px] truncate max-w-[200px]">{item.name}</span>
                </div>
            </div>
        );
      }
    },
    {
      accessorKey: 'onhand',
      header: 'ONHAND',
      cell: ({ row }) => <div className="text-right font-mono font-black text-slate-500">{Number(row.getValue('onhand'))?.toLocaleString()}</div>
    },
    {
      accessorKey: 'booking',
      header: 'BOOKING (-)',
      cell: ({ row }) => <div className="text-right font-mono font-bold text-[#E3624A]">{Number(row.getValue('booking'))?.toLocaleString()}</div>
    },
    {
      accessorKey: 'available',
      header: 'AVAILABLE',
      cell: ({ row }) => <div className="text-right font-mono font-semibold text-[#2e4756]">{Number(row.getValue('available'))?.toLocaleString()}</div>
    },
    {
      accessorKey: 'planIn',
      header: 'PLAN IN (+)',
      cell: ({ row }) => {
        const planIn = Number(row.getValue('planIn'));
        return <div className="text-right font-mono font-black text-[#10b981]">{planIn > 0 ? `+${planIn?.toLocaleString()}` : '-'}</div>;
      }
    },
    {
      accessorKey: 'planOut',
      header: 'PLAN OUT (-)',
      cell: ({ row }) => {
        const planOut = Number(row.getValue('planOut'));
        return <div className="text-right font-mono font-black text-[#E3624A]">{planOut > 0 ? `-${planOut?.toLocaleString()}` : '-'}</div>;
      }
    },
    {
      accessorKey: 'estQty',
      header: 'EST. BALANCE',
      cell: ({ row }) => <div className="text-right font-mono font-black text-[#ab8a3b] text-[14px]">{Number(row.getValue('estQty'))?.toLocaleString()}</div>
    },
    {
      accessorKey: 'avgUsage',
      header: 'AVG/DAY',
      cell: ({ row }) => <div className="text-center font-mono font-bold text-slate-400">{row.getValue('avgUsage') as string}</div>
    },
    {
      accessorKey: 'minPoint',
      header: 'MIN POINT',
      cell: ({ row }) => <div className="text-center font-mono font-black text-[#111f42]">{Number(row.getValue('minPoint'))?.toLocaleString()}</div>
    },
    {
      accessorKey: 'status',
      header: 'STATUS',
      cell: ({ row }) => <span className={`badge ${getStatusClass(row.getValue('status') as string)} text-center block`}>{row.getValue('status') as string}</span>
    }
  ];

  return <DataTable data={data} columns={columns} searchPlaceholder="Search ID or Name..." fileName="Inventory_Planning" />;
}

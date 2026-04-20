import React from 'react';
import { FolderCheck, Pencil, X } from 'lucide-react';
import { ColumnDef } from '@tanstack/react-table';
import { HistoryLog } from '../types';
import { DataTable } from '../../../components/shared/DataTable';

interface OutboundTableProps {
    data: HistoryLog[];
    onEdit: (log: HistoryLog) => void;
    onConfirm: (log: HistoryLog) => void;
    onCancel: (log: HistoryLog) => void;
}

export default function OutboundTable({ data, onEdit, onConfirm, onCancel }: OutboundTableProps) {
    const columns: ColumnDef<HistoryLog>[] = [
        {
            accessorKey: 'transId',
            header: 'TRX ID',
            cell: ({ row }) => <span className="font-mono font-black text-[#111f42]">{row.getValue('transId') as string}</span>
        },
        {
            accessorKey: 'date',
            header: 'DATE',
            cell: ({ row }) => <span className="text-[11px] text-slate-500 font-mono">{row.getValue('date') as string}</span>
        },
        {
            accessorKey: 'outType',
            header: 'TYPE',
            cell: ({ row }) => <span className="text-[11px] font-bold text-[#111f42] bg-slate-100 px-2 py-1 rounded-md border border-slate-200">{row.getValue('outType') as string}</span>
        },
        {
            accessorKey: 'refNo',
            header: 'REF. DOCUMENT',
            cell: ({ row }) => <span className="text-[11px] font-mono font-bold text-[#ab8a3b]">{row.getValue('refNo') as string || '-'}</span>
        },
        {
            id: 'product',
            header: 'PRODUCT',
            accessorFn: (row) => `${row.sku} ${row.itemName}`,
            cell: ({ row }) => (
                <div className="flex flex-col">
                    <span className="text-[10px] font-medium text-slate-400 font-mono mb-0.5">{row.original.sku}</span>
                    <span className="text-[12px] font-bold text-[#111f42]">{row.original.itemName}</span>
                </div>
            )
        },
        {
            accessorKey: 'qty',
            header: 'QTY',
            cell: ({ row }) => <div className="text-right font-black text-[#E3624A] text-[12px] font-mono">-{(Number(row.getValue('qty')) || 0).toLocaleString()}</div>
        },
        {
            id: 'warehouse',
            header: 'WAREHOUSE',
            accessorFn: (row) => `${row.location} ${row.warehouseName}`,
            cell: ({ row }) => (
                <div className="flex flex-col">
                    <span className="text-[10px] font-medium text-slate-400 font-mono mb-0.5">{row.original.location}</span>
                    <span className="text-[12px] font-bold text-[#111f42]">{row.original.warehouseName}</span>
                </div>
            )
        },
        {
            accessorKey: 'lotNo',
            header: 'LOT / MFG',
            cell: ({ row }) => <span className="text-[11px] font-mono text-slate-500">{row.getValue('lotNo') as string || '-'}</span>
        },
        {
            accessorKey: 'status',
            header: 'STATUS',
            cell: ({ row }) => {
                const status = row.getValue('status') as string;
                if (status === 'Confirmed') return <span className="badge bg-emerald-50 text-emerald-600 border-emerald-200">Confirmed</span>;
                if (status === 'Cancelled') return <span className="badge bg-red-50 text-red-600 border-red-200">Cancelled</span>;
                return <span className="badge bg-blue-50 text-blue-600 border-blue-200">Pending</span>;
            }
        },
        {
            id: 'actions',
            header: 'ACTION',
            cell: ({ row }) => {
                const log = row.original;
                return log.status === 'Pending' ? (
                    <div className="flex items-center justify-center gap-1 opacity-60 hover:opacity-100 transition-opacity">
                        <button onClick={() => onConfirm(log)} className="w-7 h-7 flex items-center justify-center bg-white border border-slate-200 rounded-md shadow-sm hover:text-white hover:bg-orange-500 hover:border-orange-500 text-slate-400 transition-colors" title="Confirm">
                            <FolderCheck size={14} />
                        </button>
                        <button onClick={() => onEdit(log)} className="w-7 h-7 flex items-center justify-center bg-white border border-slate-200 rounded-md shadow-sm hover:text-[#ab8a3b] hover:border-[#ab8a3b] hover:bg-slate-50 text-slate-400 transition-colors" title="Edit">
                            <Pencil size={14} />
                        </button>
                        <button onClick={() => onCancel(log)} className="w-7 h-7 flex items-center justify-center bg-white border border-slate-200 rounded-md shadow-sm hover:text-white hover:bg-red-500 hover:border-red-500 text-slate-400 transition-colors" title="Cancel">
                            <X size={14} />
                        </button>
                    </div>
                ) : (
                    <div className="text-center text-slate-300 text-[10px] italic">
                        {log.status === 'Confirmed' ? 'Locked' : 'Voided'}
                    </div>
                );
            }
        }
    ];

    return (
        <DataTable
            data={data}
            columns={columns}
            searchPlaceholder="Search TRX ID, Sku, Lot number..."
            itemsPerPage={10}
            fileName="Outbound_Transactions"
        />
    );
}

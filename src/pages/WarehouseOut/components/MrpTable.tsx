import React from 'react';
import { PackageMinus, CheckSquare } from 'lucide-react';
import { ColumnDef } from '@tanstack/react-table';
import { MrpOrder } from '../types';
import { DataTable } from '../../../components/shared/DataTable';

interface MrpTableProps {
    data: MrpOrder[];
    onIssue: (order: MrpOrder) => void;
    onComplete: (order: MrpOrder) => void;
    getProgressColor: (item: any) => string;
    getStatusClass: (status: string) => string;
}

export default function MrpTable({ data, onIssue, onComplete, getProgressColor, getStatusClass }: MrpTableProps) {
    const columns: ColumnDef<MrpOrder>[] = [
        {
            accessorKey: 'moNo',
            header: 'MO NO.',
            cell: ({ row }) => <span className="font-mono font-black text-xs text-[#111f42]">{row.getValue('moNo') as string}</span>
        },
        {
            accessorKey: 'date',
            header: 'PLAN DATE',
            cell: ({ row }) => <span className="text-xs text-slate-500 font-mono">{row.getValue('date') as string}</span>
        },
        {
            id: 'forProduct',
            header: 'FOR PRODUCT (FG)',
            accessorFn: (row) => `${row.fgSku} ${row.fgName}`,
            cell: ({ row }) => (
                <div>
                    <div className="text-xs font-bold text-[#111f42]">{row.original.fgSku}</div>
                    <div className="text-[10px] text-slate-400 mt-0.5">{row.original.fgName}</div>
                </div>
            )
        },
        {
            id: 'materialToIssue',
            header: 'MATERIAL TO ISSUE (RM)',
            accessorFn: (row) => `${row.rmSku} ${row.rmName}`,
            cell: ({ row }) => (
                <div>
                    <div className="text-xs font-bold text-[#72A09E]">{row.original.rmSku}</div>
                    <div className="text-[10px] text-slate-400 mt-0.5">{row.original.rmName}</div>
                </div>
            )
        },
        {
            accessorKey: 'qty',
            header: 'REQUIRED',
            cell: ({ row }) => <div className="text-right font-black text-[#111f42] text-xs font-mono">{(Number(row.getValue('qty')) || 0).toLocaleString()}</div>
        },
        {
            accessorKey: 'issued',
            header: 'ISSUED',
            cell: ({ row }) => {
                const order = row.original;
                return (
                    <div className="flex flex-col items-center">
                        <div className="w-full bg-slate-100 rounded-full h-1.5 mb-1.5 overflow-hidden min-w-[80px]">
                            <div className="h-full rounded-full transition-all duration-500" 
                                style={{width: Math.min((order.issued / order.qty) * 100, 100) + '%', backgroundColor: getProgressColor(order)}}></div>
                        </div>
                        <span className={`text-[10px] font-mono font-bold ${order.issued >= order.qty ? 'text-emerald-600' : 'text-slate-500'}`}>
                            {order.issued.toLocaleString()}
                        </span>
                    </div>
                );
            }
        },
        {
            id: 'balance',
            header: 'BALANCE',
            accessorFn: (row) => row.qty - row.issued,
            cell: ({ row }) => {
                const order = row.original;
                const balance = order.qty - order.issued;
                return (
                    <div className={`text-right text-xs font-mono font-black ${balance <= 0 ? 'text-emerald-500' : 'text-[#E3624A]'}`}>
                        {balance.toLocaleString()}
                    </div>
                );
            }
        },
        {
            accessorKey: 'status',
            header: 'STATUS',
            cell: ({ row }) => {
                const status = row.getValue('status') as string;
                return <span className={`badge ${getStatusClass(status)}`}>{status}</span>;
            }
        },
        {
            id: 'actions',
            header: 'ACTION',
            cell: ({ row }) => {
                const order = row.original;
                return (
                    <div className="flex justify-center items-center gap-1 opacity-60 group-hover:opacity-100 transition-opacity min-w-[100px]">
                        <button onClick={() => onIssue(order)} className="px-3 py-1.5 bg-[#111f42] text-white text-[10px] font-bold rounded-lg shadow hover:bg-[#1e346b] flex items-center gap-1.5 transition-all">
                            <PackageMinus size={12} className="text-[#ab8a3b]" /> Issue
                        </button>
                        {order.issued > 0 && order.status !== 'Completed' && (
                            <button onClick={() => onComplete(order)} className="p-1.5 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors" title="Mark Completed">
                                <CheckSquare size={16} />
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
            searchPlaceholder="Search MO No, Product, Material..."
            itemsPerPage={10}
            fileName="MRP_Issuance"
        />
    );
}

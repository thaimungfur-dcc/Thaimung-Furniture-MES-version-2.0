import React from 'react';
import { Truck, CheckSquare } from 'lucide-react';
import { ColumnDef } from '@tanstack/react-table';
import { DeliveryOrder } from '../types';
import { DataTable } from '../../../components/shared/DataTable';

interface DeliveryTableProps {
    data: DeliveryOrder[];
    onShip: (order: DeliveryOrder) => void;
    onComplete: (order: DeliveryOrder) => void;
    getProgressColor: (item: any) => string;
    getStatusClass: (status: string) => string;
}

export default function DeliveryTable({ data, onShip, onComplete, getProgressColor, getStatusClass }: DeliveryTableProps) {
    const columns: ColumnDef<DeliveryOrder>[] = [
        {
            id: 'soNo',
            header: 'SO NO.',
            accessorFn: (row) => `${row.soNo} ${row.refId}`,
            cell: ({ row }) => (
                <div>
                    <div className="font-mono font-black text-xs text-[#ab8a3b]">{row.original.soNo}</div>
                    <div className="text-[9px] text-slate-400 font-sans mt-0.5">Ref: {row.original.refId}</div>
                </div>
            )
        },
        {
            accessorKey: 'date',
            header: 'DUE DATE',
            cell: ({ row }) => <span className="text-xs text-slate-500 font-mono">{row.getValue('date') as string}</span>
        },
        {
            id: 'customer',
            header: 'CUSTOMER',
            accessorFn: (row) => `${row.customer} ${row.location}`,
            cell: ({ row }) => (
                <div>
                    <div className="font-bold text-[#111f42] text-xs">{row.original.customer}</div>
                    <div className="text-[10px] text-slate-400 mt-0.5">{row.original.location}</div>
                </div>
            )
        },
        {
            id: 'product',
            header: 'PRODUCT (FG)',
            accessorFn: (row) => `${row.sku} ${row.productName}`,
            cell: ({ row }) => (
                <div>
                    <div className="text-xs font-bold text-[#111f42]">{row.original.sku}</div>
                    <div className="text-[10px] text-slate-400 mt-0.5">{row.original.productName}</div>
                </div>
            )
        },
        {
            accessorKey: 'qty',
            header: 'ORDER QTY',
            cell: ({ row }) => <div className="text-right font-black text-[#111f42] text-xs font-mono">{(Number(row.getValue('qty')) || 0)?.toLocaleString()}</div>
        },
        {
            accessorKey: 'shipped',
            header: 'SHIPPED',
            cell: ({ row }) => {
                const order = row.original;
                return (
                    <div className="flex flex-col items-center">
                        <div className="w-full bg-slate-100 rounded-full h-1.5 mb-1.5 overflow-hidden min-w-[80px]">
                            <div className="h-full rounded-full transition-all duration-500" 
                                style={{width: Math.min((order.shipped / order.qty) * 100, 100) + '%', backgroundColor: getProgressColor(order)}}></div>
                        </div>
                        <span className={`text-[10px] font-mono font-bold ${order.shipped >= order.qty ? 'text-emerald-600' : 'text-slate-500'}`}>
                            {order.shipped?.toLocaleString()} / {Math.round((order.shipped/order.qty)*100)}%
                        </span>
                    </div>
                );
            }
        },
        {
            id: 'balance',
            header: 'BALANCE',
            accessorFn: (row) => row.qty - row.shipped,
            cell: ({ row }) => {
                const order = row.original;
                const balance = order.qty - order.shipped;
                return (
                    <div className={`text-right text-xs font-mono font-black ${balance <= 0 ? 'text-emerald-500' : 'text-[#E3624A]'}`}>
                        {balance?.toLocaleString()}
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
                        <button onClick={() => onShip(order)} className="px-3 py-1.5 bg-[#111f42] text-white text-[10px] font-bold rounded-lg shadow hover:bg-[#1e346b] flex items-center gap-1.5 transition-all">
                            <Truck size={12} className="text-[#ab8a3b]" /> Ship
                        </button>
                        {order.shipped > 0 && order.status !== 'Completed' && order.status !== 'Delivered' && (
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
            searchPlaceholder="Search SO No, Customer, Product..."
            itemsPerPage={10}
            fileName="Delivery_Orders"
            variant="seamless"
        />
    );
}

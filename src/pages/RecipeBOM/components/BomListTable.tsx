import React from 'react';
import { Edit3 } from 'lucide-react';
import { ColumnDef } from '@tanstack/react-table';
import { DataTable } from '../../../components/shared/DataTable';

interface Product {
    id: string;
    name: string;
    category: string;
    subCategory?: string;
    version: string;
    cost: number;
    status: string;
}

interface BomListTableProps {
    data: Product[];
    onManageBom: (product: Product) => void;
    getStatusClass: (status: string) => string;
}

export default function BomListTable({ data, onManageBom, getStatusClass }: BomListTableProps) {
    const columns: ColumnDef<Product>[] = [
        {
            id: 'product',
            header: 'PRODUCT (SKU / NAME)',
            accessorFn: (row) => `${row.id} ${row.name}`,
            cell: ({ row }) => (
                <div className="flex flex-col">
                    <span className="font-black text-[#ab8a3b] font-mono">{row.original.id}</span>
                    <span className="font-bold text-[#111f42]">{row.original.name}</span>
                </div>
            )
        },
        {
            id: 'category',
            header: 'CATEGORY / SUB',
            accessorFn: (row) => `${row.category} ${row.subCategory || ''}`,
            cell: ({ row }) => (
                <div className="text-[10px]">
                    <span className="text-slate-400 uppercase font-black">{row.original.category}</span>
                    <span className="text-slate-600 font-bold ml-1">{row.original.subCategory || '-'}</span>
                </div>
            )
        },
        {
            accessorKey: 'version',
            header: 'VERSION',
            cell: ({ row }) => <span className="text-center font-mono font-bold text-slate-500 block">{row.getValue('version') as string}</span>
        },
        {
            accessorKey: 'cost',
            header: 'EST. COST',
            cell: ({ row }) => <div className="text-right font-black">฿{(Number(row.getValue('cost')) || 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}</div>
        },
        {
            accessorKey: 'status',
            header: 'STATUS',
            cell: ({ row }) => {
                const status = row.getValue('status') as string;
                return <span className={`badge ${getStatusClass(status)} block text-center`}>{status}</span>;
            }
        },
        {
            id: 'action',
            header: 'ACTION',
            cell: ({ row }) => (
                <button onClick={() => onManageBom(row.original)} className="w-8 h-8 flex items-center justify-center bg-white border border-slate-200 text-slate-400 hover:text-[#111f42] hover:border-[#ab8a3b] hover:bg-slate-50 rounded-lg transition-all mx-auto shadow-sm" title="Manage BOM">
                    <Edit3 size={14}/>
                </button>
            )
        }
    ];

    return (
        <DataTable
            data={data}
            columns={columns}
            searchPlaceholder="Search Products..."
            itemsPerPage={10}
            fileName="BOM_Products"
        />
    );
}

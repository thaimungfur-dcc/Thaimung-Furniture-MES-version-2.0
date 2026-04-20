import React from 'react';
import { Pencil, Trash2 } from 'lucide-react';
import { ColumnDef } from '@tanstack/react-table';
import { DataTable } from '../../../components/shared/DataTable';

interface ItemTableProps {
    items: any[];
    getTypeClass: (type: string) => string;
    openModal: (item: any) => void;
    deleteItem: (id: string) => void;
}

export default function ItemTable({ items, getTypeClass, openModal, deleteItem }: ItemTableProps) {
    const columns: ColumnDef<any>[] = [
        {
            accessorKey: 'itemCode',
            header: 'ITEM CODE',
            cell: info => <span className="font-black text-[#ab8a3b]">{info.getValue() as string}</span>,
        },
        {
            accessorKey: 'itemType',
            header: 'TYPE',
            cell: info => {
                const type = info.getValue() as string;
                return (
                    <div className="text-center">
                        <span className={`badge ${getTypeClass(type)}`}>{type}</span>
                    </div>
                );
            },
        },
        {
            accessorKey: 'itemName',
            header: 'ITEM NAME',
            cell: info => <span className="font-bold">{info.getValue() as string}</span>,
        },
        {
            accessorKey: 'category',
            header: 'CATEGORY',
            cell: info => <span className="text-slate-500 text-[11px] uppercase tracking-wider">{info.getValue() as string}</span>,
        },
        {
            accessorKey: 'baseUnit',
            header: 'UNIT',
            cell: info => <div className="text-center font-mono">{info.getValue() as string}</div>,
        },
        {
            accessorKey: 'stdCost',
            header: 'STD. COST',
            cell: info => <div className="text-right font-black">฿{(info.getValue() as number).toLocaleString()}</div>,
        },
        {
            accessorKey: 'status',
            header: 'STATUS',
            cell: info => {
                const status = info.getValue() as string;
                return (
                    <div className="text-center">
                        <span className={`badge ${status === 'Active' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-slate-50 text-slate-400'}`}>{status}</span>
                    </div>
                );
            },
        },
        {
            id: 'actions',
            header: 'ACTION',
            cell: ({ row }) => {
                const item = row.original;
                return (
                    <div className="flex justify-center items-center gap-0.5 opacity-60 hover:opacity-100 transition-opacity">
                        <button onClick={() => openModal(item)} className="p-1.5 bg-white border border-slate-200 text-amber-500 hover:bg-amber-50 rounded" title="Edit"><Pencil size={12} /></button>
                        <button onClick={() => deleteItem(item.id)} className="p-1.5 bg-white border border-slate-200 text-rose-500 hover:bg-rose-50 rounded" title="Delete"><Trash2 size={12} /></button>
                    </div>
                );
            }
        }
    ];

    return (
        <div className="w-full">
            <DataTable 
                data={items} 
                columns={columns} 
                fileName="Item_Master_Records"
                searchPlaceholder="Search Item Code, Name, Category..."
                itemsPerPage={15}
            />
        </div>
    );
}


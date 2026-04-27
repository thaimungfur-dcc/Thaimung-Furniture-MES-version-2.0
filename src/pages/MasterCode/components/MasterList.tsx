import React from 'react';
import { Eye, Pencil, Trash2 } from 'lucide-react';
import { ColumnDef } from '@tanstack/react-table';
import { MasterItem, getTypeClass } from '../types';
import { DataTable } from '../../../components/shared/DataTable';

interface MasterListProps {
  items: MasterItem[];
  openModal: (item: MasterItem | null) => void;
  deleteItem: (id: string) => void;
  actionButtons?: React.ReactNode;
}

export default function MasterList({ items, openModal, deleteItem, actionButtons }: MasterListProps) {
  const columns: ColumnDef<MasterItem>[] = [
    {
      accessorKey: 'mastCode',
      header: 'MASTER CODE',
      cell: ({ row }) => <span className="font-black text-[12px] text-[#111f42] tracking-wider">{row.getValue('mastCode') as string}</span>
    },
    {
      accessorKey: 'groups',
      header: 'GROUP',
      cell: ({ row }) => {
        const rawGroups = row.getValue('groups');
        const groups = Array.isArray(rawGroups) 
          ? rawGroups 
          : (typeof rawGroups === 'string' ? rawGroups.split(',').map(s => s.trim()).filter(Boolean) : []);
        
        return (
          <div className="flex gap-1 flex-wrap">
            {groups?.map(g => <span key={g} className={`badge ${getTypeClass(g)}`}>{g}</span>)}
          </div>
        );
      }
    },
    {
      accessorKey: 'category',
      header: 'CATEGORY',
      cell: ({ row }) => <span className="text-[12px] text-[#111f42] font-bold">{row.getValue('category') as string}</span>
    },
    {
      accessorKey: 'catCode',
      header: 'CODE',
      cell: ({ row }) => <div className="text-center text-[12px] font-black text-[#ab8a3b] bg-amber-50/50 rounded">{row.getValue('catCode') as string}</div>
    },
    {
      accessorKey: 'subCategory',
      header: 'SUB CATEGORY',
      cell: ({ row }) => <span className="text-[12px] text-slate-600">{row.getValue('subCategory') as string}</span>
    },
    {
      accessorKey: 'subCatCode',
      header: 'SUB',
      cell: ({ row }) => <div className="text-center text-[12px] font-black text-slate-500 bg-slate-50 rounded">{row.getValue('subCatCode') as string}</div>
    },
    {
      accessorKey: 'note',
      header: 'DESCRIPTION / NOTE',
      cell: ({ row }) => {
        const val = row.getValue('note') as string;
        return <div className="text-[12px] text-slate-500 max-w-[200px] truncate" title={val}>{val || '-'}</div>;
      }
    },
    {
      accessorKey: 'updatedAt',
      header: 'UPDATED',
      cell: ({ row }) => {
        const dateStr = row.getValue('updatedAt') as string;
        const rawBy = row.original.updatedBy;
        const by = rawBy ? String(rawBy) : '';
        
        // Safe date parsing
        let displayDate = '-';
        if (dateStr) {
          const d = new Date(dateStr);
          if (!isNaN(d.getTime())) {
            displayDate = d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
          } else {
            // Fallback for non-iso strings if needed, or just show the string
            displayDate = dateStr.toString().split('T')[0] || '-';
          }
        }

        return (
          <div className="text-center text-[12px] text-slate-400">
            <div className="font-bold text-[#111f42]">{displayDate}</div>
            <div className="text-[10px] opacity-70 mt-0.5">{by ? by.split('@')[0] : '-'}</div>
          </div>
        );
      }
    },
    {
      id: 'actions',
      header: 'ACTION',
      cell: ({ row }) => {
        const item = row.original;
        return (
          <div className="flex justify-center items-center gap-0.5 opacity-60 hover:opacity-100 transition-opacity">
            <button className="w-6 h-6 rounded bg-white border border-slate-200 flex items-center justify-center text-blue-400 transition-colors hover:text-white hover:bg-blue-500 hover:border-blue-500" title="View"><Eye size={12} /></button>
            <button onClick={() => openModal(item)} className="w-6 h-6 rounded bg-white border border-slate-200 flex items-center justify-center text-[#ab8a3b] transition-colors hover:text-white hover:bg-[#ab8a3b] hover:border-[#ab8a3b]" title="Edit"><Pencil size={12} /></button>
            <button onClick={() => deleteItem(item.id)} className="w-6 h-6 rounded bg-white border border-slate-200 flex items-center justify-center text-[#E3624A] transition-colors hover:text-white hover:bg-[#E3624A] hover:border-[#E3624A]" title="Delete"><Trash2 size={12} /></button>
          </div>
        );
      }
    }
  ];

  return (
    <div className="w-full">
      <DataTable 
        data={items || []}
        columns={columns}
        fileName="Master_Code_List"
        searchPlaceholder="Search Master Code, Category..."
        itemsPerPage={15}
        filterColumns={['groups', 'category']}
        actionButtons={actionButtons}
      />
    </div>
  );
}


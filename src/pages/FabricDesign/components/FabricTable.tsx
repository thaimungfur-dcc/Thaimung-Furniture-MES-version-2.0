import React from 'react';
import { Pencil } from 'lucide-react';
import { ColumnDef } from '@tanstack/react-table';
import { DataTable } from '../../../components/shared/DataTable';

interface FabricTableProps {
  patterns: any[];
  onEdit: (pattern: any) => void;
}

const FabricTable: React.FC<FabricTableProps> = ({ patterns, onEdit }) => {
  const columns: ColumnDef<any>[] = [
    {
      id: 'preview',
      header: 'PREVIEW',
      cell: ({ row }) => (
        <div className="w-10 h-10 rounded-lg bg-slate-100 overflow-hidden border border-slate-200">
          {row.original.image && (
            <img 
              src={row.original.image} 
              className="w-full h-full object-cover" 
              alt={row.original.name}
              referrerPolicy="no-referrer"
            />
          )}
        </div>
      )
    },
    {
      accessorKey: 'code',
      header: 'CODE',
      cell: ({ row }) => <span className="font-mono font-black text-xs text-[#ab8a3b]">{row.getValue('code') as string}</span>
    },
    {
      id: 'name',
      header: 'NAME',
      accessorFn: row => `${row.name} ${row.category}`,
      cell: ({ row }) => (
        <div className="font-bold text-[#111f42] text-xs">
          {row.original.name}
          <div className="text-[10px] text-slate-400 mt-0.5 font-normal uppercase tracking-widest">{row.original.category}</div>
        </div>
      )
    },
    {
      accessorKey: 'application',
      header: 'APPLICATION',
      cell: ({ row }) => <span className="text-[11px] text-slate-600 font-bold truncate max-w-[150px]">{row.getValue('application') as string || '-'}</span>
    },
    {
      id: 'specs',
      header: 'SPECS',
      accessorFn: row => `${row.width} / ${row.weight}`,
      cell: ({ row }) => <span className="text-[11px] font-mono text-slate-500 font-bold">{row.original.width} / {row.original.weight}</span>
    },
    {
      accessorKey: 'colors',
      header: 'SHADES',
      cell: ({ row }) => {
        const colors = row.getValue('colors') as string[];
        return (
          <div className="flex flex-wrap items-center gap-1.5 max-w-[200px]">
            {colors && colors.map((c: string, i: number) => (
              <div key={i} className="flex items-center gap-1 bg-white pl-1 pr-1.5 py-0.5 rounded-md border border-slate-200 shadow-sm" title={c}>
                <span className="w-2.5 h-2.5 rounded-full border border-black/10 shadow-inner" style={{backgroundColor: c}}></span>
                <span className="text-[8px] font-mono text-slate-500 font-bold uppercase">{c}</span>
              </div>
            ))}
          </div>
        );
      }
    },
    {
      accessorKey: 'status',
      header: 'STATUS',
      cell: ({ row }) => {
        const status = row.getValue('status') as string;
        return (
          <span className={`badge ${status === 'Active' ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-600'} text-xs font-bold px-2 py-1 rounded-md text-center block`}>
            {status}
          </span>
        );
      }
    },
    {
      id: 'action',
      header: 'ACTION',
      cell: ({ row }) => (
        <div className="flex justify-center gap-2 opacity-60 hover:opacity-100 transition-opacity">
          <button 
            onClick={() => onEdit(row.original)} 
            className="p-1.5 rounded-lg text-[#ab8a3b] hover:bg-[#ab8a3b]/10 transition"
          >
            <Pencil size={14} />
          </button>
        </div>
      )
    }
  ];

  return (
    <DataTable 
      data={patterns} 
      columns={columns} 
      searchPlaceholder="Search Fabrics..."
      fileName="Fabric_Designs"
    />
  );
};

export default FabricTable;

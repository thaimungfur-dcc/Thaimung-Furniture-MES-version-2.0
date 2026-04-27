import React from 'react';
import { Eye, Pencil, Printer } from 'lucide-react';
import { ColumnDef } from '@tanstack/react-table';
import { DataTable } from '../../../components/shared/DataTable';

interface NcLogTableProps {
  logTableData: any[];
  openModal: (mode: string, data: any) => void;
  setSelectedItem: (item: any) => void;
  setPreviewModal: (mode: string) => void;
  getSeverityClass: (severity: string) => string;
  getStatusClass: (status: string) => string;
  formatDate: (date: string) => string;
}

const NcLogTable: React.FC<NcLogTableProps> = ({
  logTableData,
  openModal,
  setSelectedItem,
  setPreviewModal,
  getSeverityClass,
  getStatusClass,
  formatDate
}) => {
  const columns: ColumnDef<any>[] = [
    {
      accessorKey: 'id',
      header: 'NC NO.',
      cell: info => <span className="font-bold text-rose-600">{info.getValue() as string}</span>
    },
    {
      accessorKey: 'date',
      header: 'DATE',
      cell: info => <span className="text-slate-500 font-mono">{formatDate(info.getValue() as string)}</span>
    },
    {
      accessorKey: 'department',
      header: 'DEPARTMENT',
      cell: info => <span className="font-bold text-[#111f42] uppercase">{info.getValue() as string}</span>
    },
    {
      accessorKey: 'severity',
      header: 'SEVERITY',
      cell: info => {
        const severity = info.getValue() as string;
        return (
          <div className="text-center">
            <span className={`px-2.5 py-1 rounded text-[9px] font-bold uppercase shadow-sm whitespace-nowrap ${getSeverityClass(severity)}`}>
              {severity}
            </span>
          </div>
        );
      }
    },
    {
      accessorKey: 'status',
      header: 'STATUS',
      cell: info => {
        const status = info.getValue() as string;
        return (
          <div className="text-center">
            <span className={`px-3 py-1.5 rounded-md border font-bold text-[9px] uppercase whitespace-nowrap ${getStatusClass(status)}`}>
              {status}
            </span>
          </div>
        );
      }
    },
    {
      id: 'actions',
      header: 'ACTION',
      cell: ({ row }) => {
        const nc = row.original;
        return (
          <div className="flex justify-center gap-1.5">
            <button 
              onClick={() => openModal('view', nc)} 
              className="p-1.5 text-[#3d97bd] hover:bg-[#3d97bd]/10 rounded transition-colors"
            >
              <Eye size={16} />
            </button>
            <button 
              onClick={() => openModal('edit', nc)} 
              className="p-1.5 text-amber-600 hover:bg-amber-50 rounded transition-colors"
            >
              <Pencil size={16} />
            </button>
            <button 
              onClick={() => { setSelectedItem(nc); setPreviewModal('print'); }} 
              className="p-1.5 text-purple-600 hover:bg-purple-100 rounded transition-colors"
            >
              <Printer size={16} />
            </button>
          </div>
        );
      }
    }
  ];

  return (
    <div className="w-full">
      <DataTable 
        data={logTableData} 
        columns={columns} 
        fileName="NC_Control_Log"
        searchPlaceholder="Search NC Data..."
        itemsPerPage={15}
      />
    </div>
  );
};

export default NcLogTable;


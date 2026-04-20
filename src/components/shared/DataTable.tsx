import React, { useState, useMemo } from 'react';
import { 
  useReactTable, 
  getCoreRowModel, 
  getFilteredRowModel, 
  getPaginationRowModel, 
  getSortedRowModel,
  flexRender,
  ColumnDef,
  SortingState
} from '@tanstack/react-table';
import { ChevronUp, ChevronDown, ChevronLeft, ChevronRight, Search, Download } from 'lucide-react';
import { downloadCSV } from '../../utils/csvUtils';

interface DataTableProps<T> {
  data: T[];
  columns: ColumnDef<T, any>[];
  fileName?: string;
  searchPlaceholder?: string;
  itemsPerPage?: number;
}

export function DataTable<T>({ 
  data, 
  columns, 
  fileName = "export_data", 
  searchPlaceholder = "ค้นหาข้อมูล...",
  itemsPerPage = 10 
}: DataTableProps<T>) {
  
  const [sorting, setSorting] = useState<SortingState>([]);
  const [globalFilter, setGlobalFilter] = useState('');

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    state: {
      sorting,
      globalFilter,
    },
    onSortingChange: setSorting,
    onGlobalFilterChange: setGlobalFilter,
    initialState: {
      pagination: { pageSize: itemsPerPage }
    }
  });

  const handleExport = () => {
    // Export only the filtered & sorted data
    const exportData = table.getFilteredRowModel().rows.map(row => row.original);
    downloadCSV(exportData, fileName);
  };

  return (
    <div className="w-full space-y-4">
      {/* Table Controls */}
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4 bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
        <div className="relative w-full sm:w-72">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            value={globalFilter ?? ''}
            onChange={e => setGlobalFilter(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-sm border border-slate-200 rounded-lg focus:border-[#111f42] focus:ring-1 focus:ring-[#111f42] outline-none transition-all"
            placeholder={searchPlaceholder}
          />
        </div>
        
        <button 
          onClick={handleExport}
          className="w-full sm:w-auto flex items-center justify-center gap-2 px-5 py-2 min-h-[38px] bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-lg hover:bg-emerald-100 transition-colors text-sm font-bold shadow-sm"
        >
          <Download size={16} /> Export CSV
        </button>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-[#111f42] text-white">
              {table.getHeaderGroups().map(headerGroup => (
                <tr key={headerGroup.id}>
                  {headerGroup.headers.map(header => (
                    <th 
                      key={header.id} 
                      className={`px-4 py-3 font-semibold text-[11px] uppercase tracking-wider ${header.column.getCanSort() ? 'cursor-pointer hover:bg-white/10 transition-colors select-none' : ''}`}
                      onClick={header.column.getToggleSortingHandler()}
                    >
                      <div className="flex items-center gap-2">
                        {flexRender(header.column.columnDef.header, header.getContext())}
                        {{
                          asc: <ChevronUp size={14} className="opacity-70" />,
                          desc: <ChevronDown size={14} className="opacity-70" />,
                        }[header.column.getIsSorted() as string] ?? (header.column.getCanSort() ? <ChevronUp size={14} className="opacity-0 group-hover:opacity-30" /> : null)}
                      </div>
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
            <tbody className="divide-y divide-slate-100">
              {table.getRowModel().rows.length > 0 ? (
                table.getRowModel().rows.map(row => (
                  <tr key={row.id} className="hover:bg-slate-50 transition-colors">
                    {row.getVisibleCells().map(cell => (
                      <td key={cell.id} className="px-4 py-3 text-slate-600">
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </td>
                    ))}
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={columns.length} className="px-4 py-8 text-center text-slate-500 font-medium">
                    ไม่พบข้อมูลที่ค้นหา
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between px-4 py-3 bg-slate-50 border-t border-slate-200">
          <div className="text-xs text-slate-500">
            แสดง {table.getRowModel().rows.length} / {table.getFilteredRowModel().rows.length} รายการ
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
              className="p-1.5 rounded bg-white border border-slate-200 text-slate-600 hover:bg-slate-100 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm transition-colors"
            >
              <ChevronLeft size={16} />
            </button>
            <span className="text-xs font-bold text-slate-700 px-2 min-w-[70px] text-center">
              หน้าที่ {table.getState().pagination.pageIndex + 1} จาก {table.getPageCount()}
            </span>
            <button
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
              className="p-1.5 rounded bg-white border border-slate-200 text-slate-600 hover:bg-slate-100 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm transition-colors"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

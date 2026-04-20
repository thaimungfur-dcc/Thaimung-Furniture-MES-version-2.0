import React from 'react';
import { 
  useReactTable, 
  getCoreRowModel, 
  getPaginationRowModel, 
  getSortedRowModel, 
  getFilteredRowModel,
  flexRender,
  ColumnDef,
  SortingState
} from '@tanstack/react-table';
import { 
  ChevronLeft, 
  ChevronRight, 
  ChevronsLeft, 
  ChevronsRight,
  ArrowUpDown,
  Search,
  Download,
  ChevronDown
} from 'lucide-react';
import { downloadCSV } from '../../utils/sharedUtils';

interface DataTableProps<T> {
  data: T[];
  columns: ColumnDef<T>[];
  title?: string;
  searchPlaceholder?: string;
  onExport?: () => void;
  pageSize?: number;
  itemsPerPage?: number;
  fileName?: string;
  filterColumns?: string[]; // New: Columns to show as dropdown filters
}

export function DataTable<T>({ 
  data, 
  columns, 
  title, 
  searchPlaceholder = "Search all columns...",
  pageSize = 10,
  itemsPerPage,
  fileName,
  filterColumns = []
}: DataTableProps<T>) {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [globalFilter, setGlobalFilter] = React.useState('');
  const [columnFilters, setColumnFilters] = React.useState<any[]>([]);

  const table = useReactTable({
    data,
    columns,
    state: {
      sorting,
      globalFilter,
      columnFilters,
    },
    onSortingChange: setSorting,
    onGlobalFilterChange: setGlobalFilter,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    initialState: {
      pagination: {
        pageSize: itemsPerPage || pageSize,
      },
    },
  });

  const exportTitle = fileName || title || 'export';

  // Calculate facets for filtered columns
  const getFacets = (columnId: string) => {
    const counts: Record<string, number> = {};
    data.forEach((item: any) => {
      const val = item[columnId];
      if (val !== undefined && val !== null) {
        counts[val] = (counts[val] || 0) + 1;
      }
    });
    return Object.entries(counts).sort((a, b) => b[1] - a[1]);
  };

  return (
    <div className="flex flex-col gap-5">
      {/* Table Toolbar */}
      <div className="flex flex-col gap-4">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 px-1">
          {title && (
            <h2 className="text-sm font-black text-[#111f42] uppercase tracking-[0.2em]">
              {title}
            </h2>
          )}
          <div className="flex items-center gap-3 w-full md:w-auto">
            <div className="relative flex-1 md:w-80">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
              <input
                value={globalFilter ?? ''}
                onChange={e => setGlobalFilter(e.target.value)}
                placeholder={searchPlaceholder}
                className="w-full bg-white border border-slate-200 rounded-xl pl-9 pr-4 py-2 text-[12px] font-bold outline-none focus:border-[#ab8a3b] transition-all h-10 shadow-sm"
              />
            </div>
            <button
              onClick={() => downloadCSV(data, exportTitle)}
              className="flex items-center gap-2 px-4 py-2 bg-white text-[#111f42] rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-50 transition-all h-10 border border-slate-200 shadow-sm"
            >
              <Download size={14} />
              Export
            </button>
          </div>
        </div>

        {/* Facet Filters */}
        {filterColumns.length > 0 && (
          <div className="flex flex-wrap gap-3 px-1">
            {filterColumns.map(colId => {
              const facets = getFacets(colId);
              const currentFilter = columnFilters.find(f => f.id === colId)?.value || '';
              const colLabel = columns.find((c: any) => c.accessorKey === colId)?.header as string || colId;

              return (
                <div key={colId} className="flex items-center gap-2">
                  <div className="relative group">
                    <select
                      value={currentFilter}
                      onChange={e => {
                        const val = e.target.value;
                        setColumnFilters(prev => {
                          const existing = prev.filter(f => f.id !== colId);
                          if (!val) return existing;
                          return [...existing, { id: colId, value: val }];
                        });
                      }}
                      className="appearance-none bg-white border border-slate-200 rounded-xl pl-4 pr-10 py-1.5 text-[11px] font-black uppercase tracking-wider text-[#111f42] outline-none focus:border-[#ab8a3b] transition-all h-9 cursor-pointer shadow-sm min-w-[140px]"
                    >
                      <option value="">All {colLabel}</option>
                      {facets.map(([val, count]) => (
                        <option key={val} value={val}>{val}</option>
                      ))}
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none group-hover:text-[#ab8a3b] transition-colors" size={14} />
                  </div>
                  
                  {/* Active Count Badge */}
                  {currentFilter && (
                    <div className="flex items-center bg-[#ab8a3b]/10 text-[#ab8a3b] px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border border-[#ab8a3b]/20 animate-in fade-in zoom-in duration-300">
                      {facets.find(([v]) => v === currentFilter)?.[1] || 0} ITEMS
                    </div>
                  )}
                </div>
              );
            })}
            
            {columnFilters.length > 0 && (
              <button
                onClick={() => setColumnFilters([])}
                className="text-[10px] font-black text-rose-500 uppercase tracking-widest hover:underline px-2 transition-all"
              >
                Clear All
              </button>
            )}
          </div>
        )}
      </div>

      {/* Table Container */}
      <div className="bg-white rounded-[24px] border border-slate-200 shadow-sm overflow-hidden min-h-[400px] flex flex-col">
        <div className="flex-1 overflow-x-auto master-custom-scrollbar">
          <table className="w-full text-left border-collapse">
            <thead>
              {table.getHeaderGroups().map(headerGroup => (
                <tr key={headerGroup.id}>
                  {headerGroup.headers.map(header => {
                    return (
                      <th 
                        key={header.id}
                        className="bg-[#111f42] text-white px-6 py-4 text-[11px] font-black uppercase tracking-widest border-b-[2.5px] border-[#ab8a3b] cursor-pointer hover:bg-[#1a2b5a] transition-colors"
                        onClick={header.column.getToggleSortingHandler()}
                      >
                        <div className="flex items-center gap-2">
                          {flexRender(header.column.columnDef.header, header.getContext())}
                          {header.column.getCanSort() && (
                            <ArrowUpDown size={12} className="text-[#ab8a3b]/60" />
                          )}
                        </div>
                      </th>
                    );
                  })}
                </tr>
              ))}
            </thead>
            <tbody className="divide-y divide-slate-100">
              {table.getRowModel().rows.length > 0 ? (
                table.getRowModel().rows.map(row => (
                  <tr key={row.id} className="hover:bg-slate-50/50 transition-colors group">
                    {row.getVisibleCells().map(cell => (
                      <td key={cell.id} className="px-6 py-3.5 text-[12px] text-[#111f42] font-bold bg-white group-hover:bg-transparent">
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </td>
                    ))}
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={columns.length} className="px-6 py-20 text-center text-slate-300 font-black uppercase tracking-[0.2em] text-[10px]">
                    No data entries matched your search
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="px-6 py-4 border-t border-slate-100 bg-slate-50/30 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
            Showing {table.getRowModel().rows.length} of {data.length} Entries
          </div>
          <div className="flex items-center gap-2">
            <button
              className="p-2 rounded-lg bg-white border border-slate-200 text-[#111f42] disabled:opacity-30 disabled:cursor-not-allowed hover:bg-slate-50 transition-all shadow-sm"
              onClick={() => table.setPageIndex(0)}
              disabled={!table.getCanPreviousPage()}
            >
              <ChevronsLeft size={16} />
            </button>
            <button
              className="p-2 rounded-lg bg-white border border-slate-200 text-[#111f42] disabled:opacity-30 disabled:cursor-not-allowed hover:bg-slate-50 transition-all shadow-sm"
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
            >
              <ChevronLeft size={16} />
            </button>
            
            <div className="flex items-center gap-1 px-3">
              {Array.from({ length: Math.min(5, table.getPageCount()) }, (_, i) => {
                const pageNum = table.getState().pagination.pageIndex;
                const total = table.getPageCount();
                let start = Math.max(0, pageNum - 2);
                if (start + 5 > total) start = Math.max(0, total - 5);
                const displayPage = start + i;
                
                if (displayPage >= total) return null;

                return (
                  <button
                    key={displayPage}
                    onClick={() => table.setPageIndex(displayPage)}
                    className={`w-8 h-8 rounded-lg text-[11px] font-black transition-all ${
                      table.getState().pagination.pageIndex === displayPage
                        ? 'bg-[#111f42] text-white shadow-md'
                        : 'text-slate-500 hover:bg-white hover:shadow-sm'
                    }`}
                  >
                    {displayPage + 1}
                  </button>
                );
              })}
            </div>

            <button
              className="p-2 rounded-lg bg-white border border-slate-200 text-[#111f42] disabled:opacity-30 disabled:cursor-not-allowed hover:bg-slate-50 transition-all shadow-sm"
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
            >
              <ChevronRight size={16} />
            </button>
            <button
              className="p-2 rounded-lg bg-white border border-slate-200 text-[#111f42] disabled:opacity-30 disabled:cursor-not-allowed hover:bg-slate-50 transition-all shadow-sm"
              onClick={() => table.setPageIndex(table.getPageCount() - 1)}
              disabled={!table.getCanNextPage()}
            >
              <ChevronsRight size={16} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

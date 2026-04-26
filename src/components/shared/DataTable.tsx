import React, { useMemo } from 'react';
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
import { downloadCSV } from '../../utils/csvUtils';

interface DataTableProps<T> {
  data: T[];
  columns: ColumnDef<T>[];
  title?: string;
  searchPlaceholder?: string;
  onExport?: () => void;
  pageSize?: number;
  itemsPerPage?: number;
  fileName?: string;
  filterColumns?: string[]; // Columns to show as dropdown filters
  dateFilterColumn?: string; // Column ID for Month/Year filtering
}

export function DataTable<T>({ 
  data, 
  columns, 
  title, 
  searchPlaceholder = "Search all columns...",
  pageSize = 10,
  itemsPerPage,
  fileName,
  filterColumns = [],
  dateFilterColumn
}: DataTableProps<T>) {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [globalFilter, setGlobalFilter] = React.useState('');
  const [columnFilters, setColumnFilters] = React.useState<any[]>([]);
  const [selectedMonth, setSelectedMonth] = React.useState<string>('');
  const [selectedYear, setSelectedYear] = React.useState<string>('');

  const months = [
    { value: '01', label: 'January' }, { value: '02', label: 'February' },
    { value: '03', label: 'March' }, { value: '04', label: 'April' },
    { value: '05', label: 'May' }, { value: '06', label: 'June' },
    { value: '07', label: 'July' }, { value: '08', label: 'August' },
    { value: '09', label: 'September' }, { value: '10', label: 'October' },
    { value: '11', label: 'November' }, { value: '12', label: 'December' }
  ];

  const years = useMemo(() => {
    if (!dateFilterColumn) return [];
    const uniqueYears = new Set<string>();
    data.forEach((item: any) => {
      const dateVal = item[dateFilterColumn];
      if (dateVal) {
        const year = new Date(dateVal).getFullYear().toString();
        if (year !== 'NaN') uniqueYears.add(year);
      }
    });
    return Array.from(uniqueYears).sort((a, b) => b.localeCompare(a));
  }, [data, dateFilterColumn]);

  const filteredData = useMemo(() => {
    let result = data;
    if (dateFilterColumn) {
      if (selectedMonth) {
        result = result?.filter((item: any) => {
          const date = new Date(item[dateFilterColumn]);
          return (date.getMonth() + 1).toString().padStart(2, '0') === selectedMonth;
        });
      }
      if (selectedYear) {
        result = result?.filter((item: any) => {
          const date = new Date(item[dateFilterColumn]);
          return date.getFullYear().toString() === selectedYear;
        });
      }
    }
    return result;
  }, [data, selectedMonth, selectedYear, dateFilterColumn]);

  const table = useReactTable({
    data: filteredData,
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
                className="w-full bg-white border border-slate-200 rounded-xl pl-9 pr-4 py-2 text-[12px] font-black outline-none focus:border-[#111f42] transition-all h-10 shadow-sm uppercase tracking-widest placeholder:font-black placeholder:opacity-50"
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

        {/* Facet Filters & Date Filters */}
        {(filterColumns.length > 0 || dateFilterColumn) && (
          <div className="flex flex-wrap gap-3 px-1">
            {/* Date Filtering (Month/Year) */}
            {dateFilterColumn && (
              <>
                <div className="relative group">
                  <select
                    value={selectedMonth}
                    onChange={e => setSelectedMonth(e.target.value)}
                    className="appearance-none bg-white border border-slate-200 rounded-xl pl-4 pr-10 py-1.5 text-[11px] font-black uppercase tracking-widest text-[#111f42] outline-none focus:border-[#111f42] transition-all h-9 cursor-pointer shadow-sm min-w-[130px]"
                  >
                    <option value="">All Months</option>
                    {months?.map(m => <option key={m.value} value={m.value}>{m.label}</option>)}
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={14} />
                </div>

                <div className="relative group">
                  <select
                    value={selectedYear}
                    onChange={e => setSelectedYear(e.target.value)}
                    className="appearance-none bg-white border border-slate-200 rounded-xl pl-4 pr-10 py-1.5 text-[11px] font-black uppercase tracking-widest text-[#111f42] outline-none focus:border-[#111f42] transition-all h-9 cursor-pointer shadow-sm min-w-[110px]"
                  >
                    <option value="">All Years</option>
                    {years?.map(y => <option key={y} value={y}>{y}</option>)}
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={14} />
                </div>
                <div className="w-px h-6 bg-slate-200 self-center mx-1"></div>
              </>
            )}

            {filterColumns?.map(colId => {
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
                          const existing = prev?.filter(f => f.id !== colId);
                          if (!val) return existing;
                          return [...existing, { id: colId, value: val }];
                        });
                      }}
                      className="appearance-none bg-white border border-slate-200 rounded-xl pl-4 pr-10 py-1.5 text-[11px] font-black uppercase tracking-widest text-[#111f42] outline-none focus:border-[#111f42] transition-all h-9 cursor-pointer shadow-sm min-w-[140px]"
                    >
                      <option value="">All {colLabel}</option>
                      {facets?.map(([val, count]) => (
                        <option key={val} value={val}>{val}</option>
                      ))}
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none group-hover:text-[#111f42] transition-colors" size={14} />
                  </div>
                  
                  {/* Active Count Badge */}
                  {currentFilter && (
                    <div className="flex items-center bg-[#111f42]/10 text-[#111f42] px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-[0.2em] border border-[#111f42]/20 animate-in fade-in zoom-in duration-300">
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
      <div className="bg-white rounded-xl border-t border-b sm:border border-slate-200 shadow-sm sm:rounded-2xl overflow-hidden min-h-[400px] flex flex-col">
        <div className="flex-1 overflow-x-auto master-custom-scrollbar">
          <table className="w-full text-left border-collapse">
            <thead>
              {table.getHeaderGroups()?.map(headerGroup => (
                <tr key={headerGroup.id}>
                  {headerGroup.headers?.map(header => {
                    return (
                      <th 
                        key={header.id}
                        className="bg-[#111f42] text-white px-6 py-4 text-[12px] font-black uppercase tracking-widest border-b border-white/10 cursor-pointer hover:bg-[#1a2b5a] transition-colors"
                        onClick={header.column.getToggleSortingHandler()}
                      >
                        <div className="flex items-center gap-2">
                          {flexRender(header.column.columnDef.header, header.getContext())}
                          {header.column.getCanSort() && (
                            <ArrowUpDown size={12} className="text-[#111f42]/60" />
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
                table.getRowModel().rows?.map(row => (
                  <tr key={row.id} className="hover:bg-slate-50/50 transition-colors group">
                    {row.getVisibleCells()?.map(cell => (
                      <td key={cell.id} className="px-6 py-3 text-[12px] text-[#111f42] font-semibold bg-white group-hover:bg-transparent">
                        {cell.column.id === 'actions' ? (
                          <div className="flex items-center gap-[0.5px]">
                            {flexRender(cell.column.columnDef.cell, cell.getContext())}
                          </div>
                        ) : (
                          flexRender(cell.column.columnDef.cell, cell.getContext())
                        )}
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
        <div className="px-6 py-4 border-t border-slate-100 bg-slate-50/30 flex flex-col sm:flex-row items-center justify-between gap-4 rounded-none">
          <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
            Showing {table.getRowModel().rows.length} of {data.length} Entries
          </div>
          <div className="flex items-center gap-2">
            <button
              className="p-2 rounded-xl bg-white border border-slate-200 text-[#111f42] disabled:opacity-30 disabled:cursor-not-allowed hover:bg-slate-50 transition-all shadow-sm"
              onClick={() => table.setPageIndex(0)}
              disabled={!table.getCanPreviousPage()}
            >
              <ChevronsLeft size={16} />
            </button>
            <button
              className="p-2 rounded-xl bg-white border border-slate-200 text-[#111f42] disabled:opacity-30 disabled:cursor-not-allowed hover:bg-slate-50 transition-all shadow-sm"
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
              className="p-2 rounded-xl bg-white border border-slate-200 text-[#111f42] disabled:opacity-30 disabled:cursor-not-allowed hover:bg-slate-50 transition-all shadow-sm"
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
            >
              <ChevronRight size={16} />
            </button>
            <button
              className="p-2 rounded-xl bg-white border border-slate-200 text-[#111f42] disabled:opacity-30 disabled:cursor-not-allowed hover:bg-slate-50 transition-all shadow-sm"
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

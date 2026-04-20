import React from 'react';
import { Pencil } from 'lucide-react';
import { ColumnDef } from '@tanstack/react-table';
import StarRating from './StarRating';
import { DataTable } from '../../../components/shared/DataTable';

interface CatalogueTableProps {
  products: any[];
  onEdit: (product: any) => void;
}

const CatalogueTable: React.FC<CatalogueTableProps> = ({ products, onEdit }) => {
  const columns: ColumnDef<any>[] = [
    {
      accessorKey: 'image',
      header: 'PREVIEW',
      cell: ({ row }) => {
        const image = row.getValue('image') as string;
        return (
          <div className="w-10 h-10 bg-slate-100 rounded-lg overflow-hidden border border-slate-200">
            {image && (
              <img 
                src={image} 
                className="w-full h-full object-cover" 
                alt={row.original.name}
                referrerPolicy="no-referrer"
              />
            )}
          </div>
        );
      }
    },
    {
      accessorKey: 'sku',
      header: 'SKU',
      cell: ({ row }) => <span className="font-mono font-black text-[11px] text-[#ab8a3b]">{row.getValue('sku') as string}</span>
    },
    {
      accessorKey: 'name',
      header: 'NAME',
      cell: ({ row }) => <span className="font-bold text-[#111f42] text-xs">{row.getValue('name') as string}</span>
    },
    {
      accessorKey: 'category',
      header: 'CATEGORY',
      cell: ({ row }) => <span className="text-xs text-slate-500 uppercase tracking-widest font-bold text-[10px]">{row.getValue('category') as string}</span>
    },
    {
      accessorKey: 'rating',
      header: 'RATING',
      cell: ({ row }) => <StarRating rating={row.getValue('rating') as number} />
    },
    {
      accessorKey: 'price',
      header: 'PRICE',
      cell: ({ row }) => <div className="text-right font-black text-xs text-[#E3624A] font-mono">฿{row.getValue('price') as number}</div>
    },
    {
      id: 'actions',
      header: 'ACTION',
      cell: ({ row }) => {
        const p = row.original;
        return (
          <div className="flex justify-center gap-2 transition-opacity">
            <button 
              onClick={() => onEdit(p)} 
              className="p-1.5 rounded-lg text-[#ab8a3b] hover:bg-[#ab8a3b]/10"
            >
              <Pencil size={14} />
            </button>
          </div>
        );
      }
    }
  ];

  return (
    <div className="w-full">
      <DataTable 
        data={products} 
        columns={columns} 
        fileName="Catalogue_Products" 
        searchPlaceholder="Search Product Name, SKU, Category..."
        itemsPerPage={10}
      />
    </div>
  );
};

export default CatalogueTable;


import React from 'react';
import { Calculator } from 'lucide-react';
import { ColumnDef } from '@tanstack/react-table';
import { DataTable } from '../../../components/shared/DataTable';

interface ProductCostData {
  itemId: string;
  item: string;
  itemName: string;
  totalCost: number;
  suggestedPrice: number;
}

interface ProductCostTableProps {
  data: ProductCostData[];
  onOpenBOM: (product: ProductCostData, e: React.MouseEvent) => void;
  actionButtons?: React.ReactNode;
}

export default function ProductCostTable({ data, onOpenBOM, actionButtons }: ProductCostTableProps) {
  const columns: ColumnDef<ProductCostData>[] = [
    {
      accessorKey: 'item',
      header: 'ITEM CODE',
      cell: ({ row }) => <span className="font-black text-[#ab8a3b] font-mono">{row.getValue('item') as string}</span>
    },
    {
      accessorKey: 'itemName',
      header: 'PRODUCT DETAIL',
      cell: ({ row }) => <span className="font-bold uppercase text-[#111f42]">{row.getValue('itemName') as string}</span>
    },
    {
      accessorKey: 'totalCost',
      header: 'STANDARD COST',
      cell: ({ row }) => <div className="text-right font-black">฿{(Number(row.getValue('totalCost')) || 0)?.toLocaleString()}</div>
    },
    {
      accessorKey: 'suggestedPrice',
      header: 'SUGGESTED PRICE',
      cell: ({ row }) => <div className="text-right font-black text-[#E3624A]">฿{(Number(row.getValue('suggestedPrice')) || 0)?.toLocaleString()}</div>
    },
    {
      id: 'action',
      header: 'ACTION',
      cell: ({ row }) => (
        <button 
          onClick={(e) => onOpenBOM(row.original, e)} 
          className="p-2 border border-slate-200 rounded-lg text-[#111f42] hover:bg-[#111f42] hover:text-white transition-all shadow-sm mx-auto flex"
        >
          <Calculator size={14}/>
        </button>
      )
    }
  ];

  return (
    <DataTable 
      data={data}
      columns={columns}
      searchPlaceholder="Search Product Costs..."
      fileName="Product_Costs"
      actionButtons={actionButtons}
    />
  );
}

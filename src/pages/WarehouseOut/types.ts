import { LucideIcon } from 'lucide-react';

export interface DeliveryOrder {
    id: number;
    soNo: string;
    refId: string;
    customer: string;
    sku: string;
    productName: string;
    qty: number;
    shipped: number;
    date: string;
    status: string;
    location: string;
}

export interface MrpOrder {
    id: number;
    moNo: string;
    date: string;
    fgSku: string;
    fgName: string;
    rmSku: string;
    rmName: string;
    qty: number;
    issued: number;
    status: string;
}

export interface HistoryLog {
    id: number;
    transId: string;
    outType: string;
    refNo: string;
    date: string;
    sku: string;
    itemName: string;
    qty: number;
    location: string;
    warehouseName: string;
    lotNo: string;
    status: string;
    by: string;
    remark?: string;
}

export interface ProductMaster {
    sku: string;
    name: string;
}

export type TabType = 'delivery' | 'mrp' | 'all';
export type ModalType = 'SO' | 'MRP' | 'MANUAL';

export interface ManualItem {
    productSearch: string;
    sku: string;
    itemName: string;
    qty: number;
    warehouseName: string;
    location: string;
    lotNo: string;
    remark: string;
}

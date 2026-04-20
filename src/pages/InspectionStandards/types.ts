import { LucideIcon } from 'lucide-react';

export interface Category {
    id: string;
    name: string;
    Icon: LucideIcon;
    type: string;
    desc: string;
}

export interface Product {
    id: number;
    code: string;
    name: string;
    category: string;
    status: string;
    image: string | null;
    dimensionImage: string | null;
}

export interface InspectionStandard {
    id: number;
    productId: number;
    process: string;
    point: string;
    criteria: string;
    tolerance: string;
    method: string;
    tool: string;
    image: string | null;
}

export type AppState = 'categories' | 'items' | 'detail';
export type ViewMode = 'grid' | 'list';
export type ModalMode = 'product' | 'standard';

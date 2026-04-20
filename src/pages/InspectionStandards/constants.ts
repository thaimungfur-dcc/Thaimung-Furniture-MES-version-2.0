import { 
    Shirt, Server, LayoutTemplate, Armchair, Layers, GlassWater, 
    RockingChair, BedDouble 
} from 'lucide-react';
import { Category } from './types';

export const THEME = {
    primary: '#111f42',     // Navy
    accent: '#E3624A',      // Terracotta
    gold: '#ab8a3b',        // Gold
    bg: '#F9F7F6'           // Neutral Bg
};

export const MAIN_CATEGORIES: Category[] = [
    { id: 'clothes_rack', name: 'ราวตากผ้า', Icon: Shirt, type: 'Laundry', desc: 'Clothes Racks' },
    { id: 'ironing_board', name: 'โต๊ะรีดผ้า', Icon: Server, type: 'Ironing', desc: 'Ironing Boards' }, 
    { id: 'table', name: 'โต๊ะ', Icon: LayoutTemplate, type: 'Furniture', desc: 'Tables' },
    { id: 'chair', name: 'เก้าอี้', Icon: Armchair, type: 'Furniture', desc: 'Chairs' },
    { id: 'shelf', name: 'ชั้นวาง', Icon: Layers, type: 'Furniture', desc: 'Shelves' },
    { id: 'water_bar', name: 'ชั้นบาร์น้ำ', Icon: GlassWater, type: 'Furniture', desc: 'Water Bar' },
    { id: 'cradle', name: 'เปล', Icon: RockingChair, type: 'Furniture', desc: 'Cradles' }, 
    { id: 'extra_bed', name: 'เตียงเสริม', Icon: BedDouble, type: 'Furniture', desc: 'Beds' },
];

export const ITEM_MASTER_DB = [
    { itemCode: 'FG-LD-001', itemName: 'ราวตากผ้าสแตนเลส (รุ่นพับได้)', category: 'clothes_rack' },
    { itemCode: 'FG-LD-002', itemName: 'ราวแขวนผ้าบาร์คู่ (ล้อเลื่อน)', category: 'clothes_rack' },
    { itemCode: 'IB-SIT01', itemName: 'โต๊ะรีดผ้านั่งรีดขาหนีบ', category: 'ironing_board' },
    { itemCode: 'IB-STD03', itemName: 'โต๊ะรีดผ้า 3 ระดับ', category: 'ironing_board' },
    { itemCode: 'TB-W2.5', itemName: 'โต๊ะพับหน้าไม้ 2.5 ฟุต', category: 'table' },
];

export const DEFAULT_CATEGORY_STEPS = {
    'Laundry': ['Welding', 'Bending', 'Coating', 'Assembly', 'Packaging'],
    'Ironing': ['Welding', 'Bending', 'Coating', 'Cutting & Sewing', 'Upholstery', 'Assembly', 'Packaging'],
    'Furniture': ['Welding', 'Bending', 'Coating', 'Assembly', 'Packaging'],
    'General': ['Welding', 'Bending', 'Coating', 'Assembly', 'Packaging']
};

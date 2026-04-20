import { ProductMaster } from './types';

export const WAREHOUSES = ['All', 'FG', 'RM', 'WIP', 'REWORK', 'SCRAP'];
export const STATUSES = ['Ready', 'Partial', 'Completed', 'All'];
export const OUTBOUND_TYPES = [
    'Sales Order', 'Transfer', 'Return to Vendor', 'Production Issue', 
    'Sample / Free Goods', 'Hold / Quarantine', 'Rework / Reprocess', 
    'Disposal / Scrap', 'POSM', 'Adjustment', 'Opening'
];

export const PRODUCT_MASTER: ProductMaster[] = [
    { sku: 'LD-001', name: 'ราวตากผ้าสแตนเลส (รุ่นพับได้)' },
    { sku: 'RM-ST-01', name: 'ท่อสแตนเลส 1 นิ้ว' },
    { sku: 'RM-FB-05', name: 'ผ้ากำมะหยี่สีแดง' },
    { sku: 'OF-001', name: 'เก้าอี้จัดเลี้ยง (เบาะนวม)' },
    { sku: 'PAC-001', name: 'กล่องกระดาษ Size L' }
];

export const MOCK_DELIVERY_ORDERS = [
    { id: 1, soNo: 'SO-2026-001', refId: 'DEL-01', customer: 'HomePro', sku: 'LD-001', productName: 'ราวตากผ้าสแตนเลส', qty: 50, shipped: 20, date: '2026-01-20', status: 'Partial', location: 'Rama 2' },
    { id: 2, soNo: 'SO-2026-002', refId: 'DEL-02', customer: 'Index', sku: 'OF-001', productName: 'เก้าอี้จัดเลี้ยง', qty: 100, shipped: 0, date: '2026-01-22', status: 'Ready', location: 'Bangna' },
    { id: 3, soNo: 'SO-2026-003', refId: 'DEL-03', customer: 'Global House', sku: 'RM-ST-01', productName: 'ท่อสแตนเลส 1 นิ้ว (ขายส่ง)', qty: 500, shipped: 500, date: '2026-01-15', status: 'Completed', location: 'Nonthaburi' },
    { id: 4, soNo: 'SO-2026-004', refId: 'DEL-04', customer: 'DoHome', sku: 'PAC-001', productName: 'กล่องกระดาษ Size L', qty: 1000, shipped: 0, date: '2026-01-25', status: 'Ready', location: 'Rangsit' },
    { id: 5, soNo: 'SO-2026-005', refId: 'DEL-05', customer: 'Thai Watsadu', sku: 'LD-002', productName: 'ราวแขวนผ้าบาร์คู่', qty: 30, shipped: 10, date: '2026-01-21', status: 'Partial', location: 'Bang Bua Thong' },
];

export const MOCK_MRP_ORDERS = [
    { id: 1, moNo: 'MO-2026-001', date: '2026-01-20', fgSku: 'LD-001', fgName: 'ราวตากผ้า', rmSku: 'RM-ST-01', rmName: 'ท่อสแตนเลส 1 นิ้ว', qty: 200, issued: 50, status: 'Partial' },
    { id: 2, moNo: 'MO-2026-002', date: '2026-01-21', fgSku: 'OF-001', fgName: 'เก้าอี้', rmSku: 'RM-FB-05', rmName: 'ผ้ากำมะหยี่', qty: 500, issued: 0, status: 'Ready' },
    { id: 3, moNo: 'MO-2026-003', date: '2026-01-22', fgSku: 'LD-002', fgName: 'ราวแขวนผ้า', rmSku: 'RM-NB-10', rmName: 'น็อตเกลียวปล่อย', qty: 1000, issued: 1000, status: 'Completed' },
];

export const MOCK_HISTORY_LOGS = [
    { id: 101, transId: 'GO260119-001', outType: 'Sales Order', refNo: 'SO-2026-001', date: '2026-01-19 14:00', sku: 'LD-001', itemName: 'ราวตากผ้าสแตนเลส', qty: 20, location: 'A-01-05', warehouseName: 'FG', lotNo: 'LOT-2601', status: 'Confirmed', by: 'Admin' },
    { id: 102, transId: 'GO260118-005', outType: 'Production Issue', refNo: 'MO-2026-003', date: '2026-01-18 09:30', sku: 'RM-NB-10', itemName: 'น็อตเกลียวปล่อย', qty: 1000, location: 'RM-Z01', warehouseName: 'RM', lotNo: 'SUP-LOT-88', status: 'Confirmed', by: 'Storeman B' },
];

import { JobOrder } from "../pages/ProductionTracking/types";

export const MOCK_JOB_ORDERS: JobOrder[] = [
  {
    id: 'jo-1',
    joNo: 'JO-2026-001',
    productName: 'Living Room Sofa (Minimalist)',
    sku: 'SOFA-MIN-001',
    qty: 10,
    received: 2,
    status: 'In Progress',
    currentStage: 'Assembly',
    startDate: '2026-04-15',
    dueDate: '2026-04-25',
    priority: 'Urgent',
    customerName: 'Modern Home Co.'
  },
  {
    id: 'jo-2',
    joNo: 'JO-2026-002',
    productName: 'Dining Table (Oakwood)',
    sku: 'TABLE-OAK-042',
    qty: 5,
    received: 5,
    status: 'Completed',
    currentStage: 'Completed',
    startDate: '2026-04-10',
    dueDate: '2026-04-18',
    priority: 'Normal'
  },
  {
    id: 'jo-3',
    joNo: 'JO-2026-003',
    productName: 'Office Chair (Ergonomic)',
    sku: 'CHAIR-ERG-101',
    qty: 25,
    received: 0,
    status: 'Not Started',
    currentStage: 'Cutting',
    startDate: '2026-04-20',
    dueDate: '2026-05-05',
    priority: 'High'
  }
];

export const MOCK_WAREHOUSE_LOGS = [
  {
    id: 1,
    transId: 'TRX-IN-001',
    date: '2026-04-20 10:00',
    joNo: 'JO-2026-001',
    sku: 'SKU-001',
    productName: 'Sample Product A',
    qty: 50,
    status: 'Completed',
    warehouseName: 'Main Warehouse',
    location: 'A-101',
    operator: 'John Doe'
  }
];

export const MOCK_MASTER_CODES = [
  { Group: 'FURNITURE', Category: 'Living Room', CatCode: 'LR', SubCategory: 'Sofa', SubCode: 'SF', Note: 'Standard Sofa' }
];

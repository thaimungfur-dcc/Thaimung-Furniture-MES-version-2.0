export interface JobOrder {
  id: string;
  joNo: string;
  productName: string;
  sku: string;
  qty: number;
  received: number;
  status: 'Not Started' | 'In Progress' | 'Completed';
  currentStage: ProductionStage;
  startDate: string;
  dueDate: string;
  priority: 'Normal' | 'High' | 'Urgent';
  customerName?: string;
  soRef?: string;
}

export type ProductionStage = 
  | 'Pending'
  | 'Cutting' 
  | 'Assembly' 
  | 'Finishing' 
  | 'Upholstery' 
  | 'QC' 
  | 'Packing' 
  | 'Completed';

export interface ProductionLog {
  id: string;
  joId: string;
  joNo: string;
  stage: ProductionStage;
  action: 'Start' | 'Finish' | 'Pause';
  operator: string;
  timestamp: string;
  qtyCompleted?: number;
  notes?: string;
}

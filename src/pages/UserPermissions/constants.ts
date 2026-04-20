import { 
  Ban, Eye, Edit, CheckSquare, Award,
  LayoutDashboard, ShoppingCart, Package, Truck, ClipboardList,
  Factory, ShieldCheck, Wallet, Coins, FileJson, Database,
  CalendarDays, Settings
} from 'lucide-react';
import { PermissionLevel, Module } from './types';

export const PERMISSION_LEVELS: PermissionLevel[] = [
  { level: 0, label: 'No Access', icon: Ban, color: '#94A3B8', bg: '#F1F5F9' },
  { level: 1, label: 'Viewer', icon: Eye, color: '#3B82F6', bg: '#EFF6FF' },
  { level: 2, label: 'Editor', icon: Edit, color: '#F59E0B', bg: '#FFFBEB' },
  { level: 3, label: 'Verifier', icon: CheckSquare, color: '#8B5CF6', bg: '#F5F3FF' },
  { level: 4, label: 'Approver', icon: Award, color: '#10B981', bg: '#ECFDF5' },
];

export const SYSTEM_MODULES: Module[] = [
  { id: 'dashboard', label: 'DASHBOARD', icon: LayoutDashboard },
  {
    id: 'sales', label: 'SALE', icon: ShoppingCart,
    subItems: [
      { id: 'catalogue', label: 'CATALOGUE' },
      { id: 'quotation', label: 'QUOTATION', isConfidential: true },
      { id: 'orders', label: 'ORDERS' },
      { id: 'analysis', label: 'SALE ANALYSIS', isConfidential: true },
      { id: 'customer', label: 'CUSTOMER' },
      { id: 'credit', label: 'CREDIT ANALYSIS', isConfidential: true },
      { id: 'cust_feedback', label: 'CUST FEEDBACK' },
      { id: 'csat', label: 'CSAT' },
      { id: 'sale_calendar', label: 'SALE CALENDAR' },
    ]
  },
  {
    id: 'warehouse', label: 'WAREHOUSE', icon: Package,
    subItems: [
      { id: 'transaction', label: 'TRANSACTION' },
      { id: 'inventory_planning', label: 'INVENTORY & PLANNING' },
      { id: 'inventory_lot', label: 'INVENTORY BY LOT' },
      { id: 'stock_card', label: 'STOCK CARD' },
      { id: 'logistics', label: 'LOGISTICS' },
      { id: 'return_goods', label: 'RETURN GOODS' },
      { id: 'wh_calendar', label: 'WH CALENDAR' },
    ]
  },
  {
    id: 'procurement', label: 'PROCUREMENT', icon: Truck,
    subItems: [
      { id: 'pr', label: 'PR' },
      { id: 'pq', label: 'PQ' },
      { id: 'po', label: 'PO', isConfidential: true },
      { id: 'purchase_history', label: 'PURCHASE HISTORY' },
      { id: 'supplier', label: 'SUPPLIER' },
      { id: 'materials', label: 'MATERIALS' },
      { id: 'debt', label: 'DEBT MANAGEMENT' },
      { id: 'scar', label: 'SCAR' },
    ]
  },
  {
    id: 'planning', label: 'PLANNING', icon: ClipboardList,
    subItems: [
      { id: 'job_planning', label: 'JOB PLANNING' },
      { id: 'mat_requirement', label: 'MAT. REQUIREMENT' },
      { id: 'prod_schedule', label: 'PRODUCTION SCHEDULE' },
    ]
  },
  {
    id: 'production', label: 'PRODUCTION', icon: Factory,
    subItems: [
      { id: 'prod_plan_tracking', label: 'PLAN TRACKING' },
      { id: 'prod_report', label: 'PRODUCTION REPORT' },
    ]
  },
  {
    id: 'qc', label: 'QUALITY CONTROL', icon: ShieldCheck,
    subItems: [
      { id: 'qc_spec', label: 'PRODUCT SPEC' },
      { id: 'qc_rm', label: 'RM INSPECTION' },
      { id: 'qc_wip', label: 'WIP INSPECTION' },
      { id: 'qc_fg', label: 'FG INSPECTION' },
      { id: 'nc_control', label: 'NC CONTROL' },
    ]
  },
  {
    id: 'financial', label: 'FINANCIAL', icon: Wallet, isConfidential: true,
    subItems: [
      { id: 'acc_cashflow', label: 'CASH FLOW', isConfidential: true },
      { id: 'acc_income', label: 'INCOME', isConfidential: true },
      { id: 'acc_expense', label: 'EXPENSE', isConfidential: true },
      { id: 'acc_summary', label: 'FINANCIAL SUMMARY', isConfidential: true },
    ]
  },
  {
    id: 'cost', label: 'COST CONTROL', icon: Coins, isConfidential: true,
    subItems: [
      { id: 'product_cost', label: 'PRODUCT COST', isConfidential: true },
      { id: 'cost_analysis', label: 'COST ANALYSIS', isConfidential: true },
    ]
  },
  {
    id: 'bom', label: 'BOM', icon: FileJson,
    subItems: [
      { id: 'product_bom', label: 'PRODUCT BOM' },
    ]
  },
  {
    id: 'master', label: 'CODE MASTER', icon: Database,
    subItems: [
      { id: 'code_master', label: 'CODE MASTER' },
      { id: 'item_master', label: 'ITEM MASTER' },
    ]
  },
  { id: 'mes_calendar', label: 'MES CALENDAR', icon: CalendarDays },
  {
    id: 'setting', label: 'SETTING', icon: Settings,
    subItems: [
      { id: 'user_permission', label: 'USER PERMISSIONS' },
      { id: 'system_config', label: 'SYSTEM CONFIG' }
    ]
  }
];

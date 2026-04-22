import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { GoogleAuthProvider, useGoogleAuth } from './context/GoogleAuthContext';
import { MasterDataProvider } from './context/MasterDataContext';
import Layout from './components/Layout';
import ProtectedRoute from './components/ProtectedRoute';

// Pages
import Login from './pages/Login';
import Home from './pages/Home';
import PlaceholderPage from './pages/PlaceholderPage';
import UserPermissions from './pages/UserPermissions/index';
import SaleOrder from './pages/SaleOrder';
import MasterCode from './pages/MasterCode/index';
import ItemMaster from './pages/ItemMaster/index';
import RecipeBOM from './pages/RecipeBOM/index';
import MESCalendar from './pages/MESCalendar/index';
import CashFlow from './pages/CashFlow/index';
import VatManagement from './pages/VatManagement/index';
import AccountsReceivable from './pages/AccountsReceivable/index';
import AccountPayable from './pages/AccountPayable/index';
import BankReconciliation from './pages/BankReconciliation/index';
import PettyCash from './pages/PettyCash/index';
import GeneralLedger from './pages/GeneralLedger/index';
import FixedAsset from './pages/FixedAsset/index';
import PurchaseNC from './pages/PurchaseNC/index';
import PurchaseRequisition from './pages/PurchaseRequisition/index';
import PurchaseOrder from './pages/PurchaseOrder/index';
import PrAnalysis from './pages/PrAnalysis/index';
import PoAnalysis from './pages/PoAnalysis/index';
import Customer from './pages/Customer/index';
import Supplier from './pages/Supplier/index';
import Catalogue from './pages/Catalogue/index';
import FabricDesign from './pages/FabricDesign/index';
import InspectionStandards from './pages/InspectionStandards/index';
import NcControl from './pages/NcControl/index';
import QcReport from './pages/QcReport/index';
import WarehouseIn from './pages/WarehouseIn/index';
import WarehouseOut from './pages/WarehouseOut/index';
import WarehouseBooking from './pages/WarehouseBooking/index';
import InventoryPlanning from './pages/InventoryPlanning/index';
import StockCard from './pages/StockCard/index';
import ProductionTracking from './pages/ProductionTracking/index';
import ProductCost from './pages/ProductCost/index';
import SystemConfig from './pages/SystemConfig/index';
import DataEntry from './pages/DataEntry/index';

function AppContent() {
  const { isAuthenticated, login, loading } = useGoogleAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#111f42] text-white">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-t-transparent border-white rounded-none animate-spin"></div>
          <p className="font-mono text-sm uppercase tracking-[0.2em] font-black">Decrypting Auth Stream...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#111f42] text-white p-6">
        <div className="max-w-md w-full bg-white/5 backdrop-blur-xl p-12 rounded-none border-2 border-white/10 shadow-2xl text-center relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-[#ab8a3b]/50"></div>
          <div className="w-20 h-20 bg-white/10 rounded-none flex items-center justify-center mx-auto mb-10 border-2 border-white/20 shadow-inner">
            <svg className="w-10 h-10 text-white" viewBox="0 0 24 24" fill="currentColor">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" />
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
            </svg>
          </div>
          <h1 className="text-3xl font-black mb-4 uppercase tracking-[0.2em] font-mono">FURNITURE MES</h1>
          <p className="text-[#ab8a3b] text-[10px] mb-12 font-black uppercase tracking-[0.3em]">Access Authorized Personnel Only</p>
          <button 
            onClick={login}
            className="w-full bg-white text-[#111f42] py-5 rounded-none font-black uppercase tracking-[0.2em] hover:bg-slate-100 transition-all shadow-xl active:scale-95 border-b-4 border-slate-300 font-mono"
          >
            Authenticate with Google
          </button>
          <p className="mt-8 text-[10px] text-slate-500 uppercase font-bold tracking-widest leading-relaxed">
            This app requires access to your Google Drive and Sheets to function.
          </p>
        </div>
      </div>
    );
  }

  return (
    <AuthProvider>
      <MasterDataProvider>
        <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          
          {/* Protected Routes */}
          <Route element={<Layout />}>
            <Route path="/" element={
              <ProtectedRoute>
                <Home />
              </ProtectedRoute>
            } />
            
            {/* Real Components */}
            <Route path="/calendar" element={<ProtectedRoute><MESCalendar /></ProtectedRoute>} />
            <Route path="/sale" element={<ProtectedRoute><SaleOrder /></ProtectedRoute>} />
            <Route path="/customer" element={<ProtectedRoute><Customer /></ProtectedRoute>} />
            <Route path="/code-master" element={<ProtectedRoute><MasterCode /></ProtectedRoute>} />
            <Route path="/item-master" element={<ProtectedRoute><ItemMaster /></ProtectedRoute>} />
            <Route path="/recipe-bom" element={<ProtectedRoute><RecipeBOM /></ProtectedRoute>} />
            <Route path="/cashflow" element={<ProtectedRoute isConfidential><CashFlow /></ProtectedRoute>} />
            <Route path="/vat-management" element={<ProtectedRoute isConfidential><VatManagement /></ProtectedRoute>} />
            <Route path="/accounts-receivable" element={<ProtectedRoute isConfidential><AccountsReceivable /></ProtectedRoute>} />
            <Route path="/purchase-nc" element={<ProtectedRoute><PurchaseNC /></ProtectedRoute>} />
            <Route path="/purchase-requisition" element={<ProtectedRoute><PurchaseRequisition /></ProtectedRoute>} />
            <Route path="/purchase-order" element={<ProtectedRoute><PurchaseOrder /></ProtectedRoute>} />
            <Route path="/supplier" element={<ProtectedRoute><Supplier /></ProtectedRoute>} />
            <Route path="/catalogue" element={<ProtectedRoute><Catalogue /></ProtectedRoute>} />
            <Route path="/fabric-design" element={<ProtectedRoute><FabricDesign /></ProtectedRoute>} />
            <Route path="/permissions" element={<ProtectedRoute isConfidential><UserPermissions /></ProtectedRoute>} />

            {/* Placeholders - MES Calendar */}
            <Route path="/factory-schedule" element={<ProtectedRoute><PlaceholderPage title="Factory Schedule" /></ProtectedRoute>} />
            <Route path="/maintenance-calendar" element={<ProtectedRoute><PlaceholderPage title="Maintenance Calendar" /></ProtectedRoute>} />
            <Route path="/shift-planning" element={<ProtectedRoute><PlaceholderPage title="Shift Planning" /></ProtectedRoute>} />

            {/* Placeholders - Sale */}
            <Route path="/sale-analysis" element={<ProtectedRoute><PlaceholderPage title="Sale Analysis" /></ProtectedRoute>} />
            <Route path="/sale-calendar" element={<ProtectedRoute><PlaceholderPage title="Sale Calendar" /></ProtectedRoute>} />

            {/* Placeholders - Warehouse */}
            <Route path="/warehouse" element={<ProtectedRoute><PlaceholderPage title="Warehouse" /></ProtectedRoute>} />
            <Route path="/warehouse-in" element={<ProtectedRoute><WarehouseIn /></ProtectedRoute>} />
            <Route path="/warehouse-out" element={<ProtectedRoute><WarehouseOut /></ProtectedRoute>} />
            <Route path="/warehouse-booking" element={<ProtectedRoute><WarehouseBooking /></ProtectedRoute>} />
            <Route path="/inventory-planning" element={<ProtectedRoute><InventoryPlanning /></ProtectedRoute>} />
            <Route path="/stock-card" element={<ProtectedRoute><StockCard /></ProtectedRoute>} />
            <Route path="/logistics" element={<ProtectedRoute><PlaceholderPage title="Logistics" /></ProtectedRoute>} />
            <Route path="/return-goods" element={<ProtectedRoute><PlaceholderPage title="Return Goods" /></ProtectedRoute>} />
            <Route path="/wh-calendar" element={<ProtectedRoute><PlaceholderPage title="WH Calendar" /></ProtectedRoute>} />

            {/* Placeholders - Procurement */}
            <Route path="/procurement" element={<ProtectedRoute><PlaceholderPage title="Procurement" /></ProtectedRoute>} />
            <Route path="/pr-analysis" element={<ProtectedRoute><PrAnalysis /></ProtectedRoute>} />
            <Route path="/po-analysis" element={<ProtectedRoute><PoAnalysis /></ProtectedRoute>} />
            <Route path="/purchase-history" element={<ProtectedRoute><PlaceholderPage title="Purchase History" /></ProtectedRoute>} />

            {/* Placeholders - Planning */}
            <Route path="/planning" element={<ProtectedRoute><PlaceholderPage title="Planning" /></ProtectedRoute>} />
            <Route path="/production-planning" element={<ProtectedRoute><PlaceholderPage title="Production Planning" /></ProtectedRoute>} />
            <Route path="/mps" element={<ProtectedRoute><PlaceholderPage title="Master Schedule (MPS)" /></ProtectedRoute>} />
            <Route path="/mrp" element={<ProtectedRoute><PlaceholderPage title="Mat. Require Plan" /></ProtectedRoute>} />
            <Route path="/job-tracking" element={<ProtectedRoute><PlaceholderPage title="Job Tracking" /></ProtectedRoute>} />

            {/* Placeholders - Production */}
            <Route path="/production" element={<ProtectedRoute><ProductionTracking /></ProtectedRoute>} />
            <Route path="/production-tracking" element={<ProtectedRoute><ProductionTracking /></ProtectedRoute>} />
            <Route path="/production-report" element={<ProtectedRoute><PlaceholderPage title="Production Report" /></ProtectedRoute>} />

            {/* Placeholders - Quality Control */}
            <Route path="/qc" element={<ProtectedRoute><PlaceholderPage title="Quality Control" /></ProtectedRoute>} />
            <Route path="/inspection-standards" element={<ProtectedRoute><InspectionStandards /></ProtectedRoute>} />
            <Route path="/qc-report" element={<ProtectedRoute><QcReport /></ProtectedRoute>} />
            <Route path="/nc-control" element={<ProtectedRoute><NcControl /></ProtectedRoute>} />

            {/* Placeholders - Financial */}
            <Route path="/financial" element={<ProtectedRoute isConfidential><PlaceholderPage title="Financial" /></ProtectedRoute>} />
            <Route path="/data-entry" element={<ProtectedRoute isConfidential><DataEntry /></ProtectedRoute>} />
            <Route path="/account-payable" element={<ProtectedRoute isConfidential><AccountPayable /></ProtectedRoute>} />
            <Route path="/bank-reconciliation" element={<ProtectedRoute isConfidential><BankReconciliation /></ProtectedRoute>} />
            <Route path="/petty-cash" element={<ProtectedRoute isConfidential><PettyCash /></ProtectedRoute>} />
            <Route path="/general-ledger" element={<ProtectedRoute isConfidential><GeneralLedger /></ProtectedRoute>} />
            <Route path="/fixed-asset" element={<ProtectedRoute isConfidential><FixedAsset /></ProtectedRoute>} />

            {/* Placeholders - Cost Control */}
            <Route path="/cost-control" element={<ProtectedRoute isConfidential><PlaceholderPage title="Cost Control" /></ProtectedRoute>} />
            <Route path="/product-cost" element={<ProtectedRoute isConfidential><ProductCost /></ProtectedRoute>} />
            <Route path="/cost-analysis" element={<ProtectedRoute isConfidential><PlaceholderPage title="Cost Analysis" /></ProtectedRoute>} />

            {/* Placeholders - Code Master */}
            <Route path="/production-standards" element={<ProtectedRoute><PlaceholderPage title="Production Standards" /></ProtectedRoute>} />

            {/* Placeholders - Setting */}
            <Route path="/system-config" element={<ProtectedRoute isConfidential><SystemConfig /></ProtectedRoute>} />
            
            {/* Catch all */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Route>
        </Routes>
      </BrowserRouter>
      </MasterDataProvider>
    </AuthProvider>
  );
}

export default function App() {
  return (
    <GoogleAuthProvider>
      <AppContent />
    </GoogleAuthProvider>
  );
}

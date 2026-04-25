const fs = require('fs');
const glob = require('glob'); // Not available? I'll use fs.readdirSync
const path = require('path');

const targetPages = [
  'Catalogue/index.tsx',
  'Customer/index.tsx',
  'SaleOrder/index.tsx',
  'PurchaseRequisition/index.tsx',
  'PurchaseOrder/index.tsx',
  'PrAnalysis/index.tsx',
  'PoAnalysis/index.tsx',
  'PurchaseNC/index.tsx',
  'InspectionStandards/index.tsx',
  'AccountsReceivable/index.tsx',
  'AccountPayable/index.tsx',
  'BankReconciliation/index.tsx',
  'PettyCash/index.tsx',
  'GeneralLedger/index.tsx',
  'FixedAsset/index.tsx',
  'CashFlow/index.tsx',
  'VatManagement/index.tsx',
  'ProductCost/index.tsx',
  'FabricDesign/index.tsx',
  'DataEntry/index.tsx',
  'InventoryPlanning/index.tsx',
  'WarehouseBooking/index.tsx',
  'WarehouseIn/index.tsx',
  'WarehouseOut/index.tsx',
  'StockCard/index.tsx'
];

targetPages.forEach(p => {
  const file = 'src/pages/' + p;
  if (!fs.existsSync(file)) return;
  
  let content = fs.readFileSync(file, 'utf8');
  let originalContent = content;

  // Since Layout.tsx ALREADY applies `sys-page-layout` (which adds pt-2 px-4 sm:px-6 md:px-8 pb-4) to its wrapper around <Outlet/>
  // We can just REMOVE sys-page-layout, px-*, pt-*, pb-* from the main div of these pages, otherwise padding is doubled.
  
  // also bg-[#F9F7F6] is unnecessary if Layout has it, though it might be fine, but let's remove it if it exists.
  const classesToRemove = [
     'sys-page-layout', 
     'px-4', 'sm:px-6', 'md:px-8', 'lg:px-8', 'px-6', 'px-8',
     'pb-4', 'pt-2', 'py-4', 'py-6', 'py-8', 'pt-0',
     'bg-[#F9F7F6]',
     'max-w-[1600px]', 'mx-auto', 'max-w-7xl', 'max-w-screen-2xl'
  ];

  // RegEx to target className="..."
  content = content.replace(/className=["']([^"']+)["']/g, (match, classList) => {
      let classes = classList.split(/\s+/);
      
      // Attempt to clean
      let newClasses = classes.filter(c => !classesToRemove.includes(c));
      
      // ensure we don't have empty classNames, but it's fine if we do
      return `className="${newClasses.join(' ')}"`;
  });

  if (content !== originalContent) {
    fs.writeFileSync(file, content, 'utf8');
    console.log('Cleaned', p);
  }
});

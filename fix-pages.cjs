const fs = require('fs');

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
  'FabricDesign/index.tsx'
];

targetPages.forEach(p => {
  const file = 'src/pages/' + p;
  if (!fs.existsSync(file)) return;
  
  let content = fs.readFileSync(file, 'utf8');
  let originalContent = content;

  // We find the first <div className="sys-page-layout ..."> or just the first <div className="..."> after return
  // and inject px-4 sm:px-6 md:px-8 pb-4 pt-2 into it if missing. Also ensure sys-page-layout is present.
  // And remove max-w-* limits if present.

  // Regex to find return ( 
  // <div className="..."
  content = content.replace(/return\s*\(\s*(<div[^>]*className=["'][^"']*["'])/, (match, divString) => {
      // Modify the className of this div
      let newDiv = divString.replace(/className=["']([^"']*)["']/, (m, classes) => {
         let classList = classes.split(' ');
         
         // Remove any max-w- limits
         classList = classList.filter(c => !c.startsWith('max-w-'));
         
         // Ensure full width
         if (!classList.includes('w-full')) classList.push('w-full');
         
         // Add sys-page-layout
         if (!classList.includes('sys-page-layout')) classList.push('sys-page-layout');
         
         // Add paddings
         const toRemove = ['px-2', 'px-4', 'px-6', 'px-8', 'sm:px-4', 'sm:px-6', 'sm:px-8', 'md:px-4', 'md:px-6', 'md:px-8', 'lg:px-4', 'lg:px-6', 'lg:px-8', 'pt-2', 'pt-4', 'pt-6', 'pt-8', 'pb-2', 'pb-4', 'pb-6', 'pb-8', 'py-2', 'py-4', 'py-6', 'py-8', 'p-4', 'p-6', 'p-8', 'sm:p-4', 'sm:p-6', 'sm:p-8', 'lg:p-4', 'lg:p-6', 'lg:p-8', 'mx-auto'];
         classList = classList.filter(c => !toRemove.includes(c));
         
         classList.push('px-4', 'sm:px-6', 'md:px-8', 'pb-4', 'pt-2');
         
         return `className="${classList.join(' ')}"`;
      });
      return match.replace(divString, newDiv);
  });

  if (content !== originalContent) {
    fs.writeFileSync(file, content, 'utf8');
    console.log('Fixed', p);
  } else {
    console.log('No match for', p);
  }
});

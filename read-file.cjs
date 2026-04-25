const fs = require('fs');
console.log(fs.readFileSync('src/pages/WarehouseIn/index.tsx', 'utf8').substring(0, 5000));

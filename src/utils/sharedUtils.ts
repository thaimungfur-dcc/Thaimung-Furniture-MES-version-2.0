/**
 * Utility for exporting JSON data to CSV with Thai language support (Excel BOM)
 */
export const downloadCSV = (data: any[], filename: string) => {
  if (!data || data.length === 0) return;

  const headers = Object.keys(data[0]);
  const rows = data.map(obj => 
    headers.map(header => {
      const val = obj[header] === null || obj[header] === undefined ? "" : obj[header];
      // Escape quotes and wrap in quotes
      const escaped = String(val).replace(/"/g, '""');
      return `"${escaped}"`;
    }).join(",")
  );

  const csvContent = [headers.join(","), ...rows].join("\n");
  
  // Important: Add BOM for Excel Thai language support
  const BOM = "\uFEFF";
  const blob = new Blob([BOM + csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement("a");
  
  const url = URL.createObjectURL(blob);
  link.setAttribute("href", url);
  link.setAttribute("download", `${filename}_${new Date().toISOString().split('T')[0]}.csv`);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

/**
 * PDF / Print Helper
 */
export const printElement = (elementId: string) => {
  const content = document.getElementById(elementId);
  if (!content) return;

  const win = window.open('', '_blank');
  if (!win) return;

  win.document.write(`
    <html>
      <head>
        <title>Print Document</title>
        <style>
          @import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@800&family=Noto+Sans+Thai:wght@400;700;900&display=swap');
          body { 
            margin: 0; 
            padding: 20px; 
            font-family: 'Noto Sans Thai', sans-serif; 
            -webkit-print-color-adjust: exact; 
          }
          @page { size: A4; margin: 10mm; }
          .print-header { border-bottom: 2px solid #111f42; padding-bottom: 10px; margin-bottom: 20px; }
          table { width: 100%; border-collapse: collapse; margin-top: 10px; }
          th { background: #111f42; color: white; padding: 10px; text-align: left; font-size: 12px; }
          td { border-bottom: 1px solid #eee; padding: 10px; font-size: 12px; }
        </style>
      </head>
      <body>
        ${content.innerHTML}
        <script>
          window.onload = function() {
            setTimeout(() => {
              window.print();
              window.close();
            }, 300);
          };
        </script>
      </body>
    </html>
  `);
  win.document.close();
};

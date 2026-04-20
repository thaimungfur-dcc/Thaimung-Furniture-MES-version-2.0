import Papa from 'papaparse';

/**
 * ดาวน์โหลดข้อมูลเป็นไฟล์ CSV (รองรับภาษาไทย)
 * @param data Array ของอ็อบเจ็กต์ข้อมูล
 * @param filename ชื่อไฟล์ที่จะเซฟ (ไม่ต้องใส่ .csv)
 */
export const downloadCSV = (data: any[], filename: string) => {
  if (!data || data.length === 0) {
    console.warn("No data to export");
    return;
  }
  
  const csv = Papa.unparse(data);
  // เพิ่ม BOM (Byte Order Mark) เพื่อให้ Excel อ่านภาษาไทย (UTF-8) ได้ถูกต้อง
  const blob = new Blob([new Uint8Array([0xEF, 0xBB, 0xBF]), csv], { type: 'text/csv;charset=utf-8;' });
  
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  link.setAttribute('href', url);
  link.setAttribute('download', `${filename}.csv`);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

/**
 * แปลงไฟล์ CSV เป็น Array ของอ็อบเจ็กต์ข้อมูล (รวดเร็ว รองรับไฟล์ขนาดใหญ่)
 * @param file ไฟล์ CSV จาก input
 * @param onComplete Callback เมื่อ parse เสร็จ
 */
export const parseCSV = (file: File, onComplete: (data: any[]) => void) => {
  Papa.parse(file, {
    header: true,         // ใช้แถวแรกเป็น Header (Keys ของ Object)
    skipEmptyLines: true, // ข้ามบรรทัดว่าง
    complete: (results) => {
      onComplete(results.data);
    },
    error: (error) => {
      console.error("Error parsing CSV:", error);
    }
  });
};

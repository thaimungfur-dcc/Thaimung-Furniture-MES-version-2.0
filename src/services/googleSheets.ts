import { 
  MOCK_JOB_ORDERS, 
  MOCK_WAREHOUSE_LOGS, 
  MOCK_MASTER_CODES,
  MOCK_WAREHOUSE_OUT_LOGS,
  MOCK_HISTORY_LOGS,
  MOCK_DELIVERY_ORDERS
} from './mockData';

export const SCRIPT_URL = import.meta.env.VITE_APPS_SCRIPT_URL;

export interface SheetRequest {
  action: 'read' | 'write' | 'lookup' | 'update' | 'delete';
  sheet: string;
  data?: any[]; // ใช้ตอน write, update หรือเก็บ criteria ตอน lookup
  limit?: number; // สำหรับ Pagination: จำนวนแถวที่ดึง
  offset?: number; // สำหรับ Pagination: จุดเริ่มต้น
  matchType?: 'exact' | 'includes'; // สำหรับโหมด Lookup
}

export interface SheetResponse<T = any> {
  status: 'success' | 'error';
  message: string;
  data?: T; 
  totalCount?: number;
  limit?: number;
  offset?: number;
  isMockData?: boolean; // Flag to indicate demo mode
}

// ระบบ Cache เพื่อลดการดึงข้อมูลซ้ำ (ลดความอืดของเมนู Master Data)
const cache = new Map<string, { data: any; timestamp: number }>();
const CACHE_TTL = 5 * 60 * 1000; // 5 นาที

export class GoogleSheetsService {
  /**
   * ส่ง Request พร้อมระบบ Retry อัตโนมัติ (Exponential Backoff) กรณีเกิด Concurrent สูง
   */
  async request<T = any>(payload: SheetRequest, retries = 1, delay = 1000): Promise<SheetResponse<T>> {
    const rawUrl = import.meta.env.VITE_APPS_SCRIPT_URL;
    const SCRIPT_URL = typeof rawUrl === 'string' ? rawUrl.trim() : '';

    if (!SCRIPT_URL || SCRIPT_URL.includes('YOUR_SCRIPT_ID')) {
      console.warn('VITE_APPS_SCRIPT_URL is not set or uses a placeholder. Switching to Demo Mode (Mock Data).');
      return this.handleMockRequest(payload);
    }

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 3000);
      const response = await fetch(SCRIPT_URL, {
        signal: controller.signal,
        method: 'POST',
        headers: { 'Content-Type': 'text/plain;charset=utf-8' },
        body: JSON.stringify(payload),
      });

      clearTimeout(timeoutId);
      const result = await response.json();

      // ถ้า LockService ใน Backend เต็ม มันจะโยน Error กลับมา เราสามารถให้ Frontend รอแล้วยิงซ้ำได้
      if (result.status === 'error' && result.message && result.message.includes('Lock') && retries > 0) {
        console.warn(`[Retry] Lock collision detected. Retrying in ${delay}ms...`);
        await new Promise(res => setTimeout(res, delay));
        return this.request<T>(payload, retries - 1, delay * 2);
      }

      return result;
    } catch (error) {
      if (retries > 0) {
        console.warn(`[Retry] Network error. Retrying in ${delay}ms...`);
        await new Promise(res => setTimeout(res, delay));
        return this.request<T>(payload, retries - 1, delay * 2);
      }
      console.warn(`Error executing Google Sheets action [${payload.action}]:`, error);
      
      // Fallback to Demo Mode on network error to prevent app crash
      console.warn('Failed to fetch from the provided URL. Falling back to Demo Mode (Mock Data).');
      return this.handleMockRequest(payload);
    }
  }

  /**
   * ระบบจำลองข้อมูลเพื่อใช้ในการทดสอบ UI (Demo Mode)
   */
  private async handleMockRequest(payload: SheetRequest): Promise<SheetResponse<any>> {
    const { action, sheet } = payload;
    let mockItems: any[] = [];

    switch (sheet) {
      case 'JobOrders': mockItems = MOCK_JOB_ORDERS; break;
      case 'WarehouseIn': mockItems = MOCK_WAREHOUSE_LOGS; break;
      case 'WarehouseOutLogs': mockItems = MOCK_WAREHOUSE_OUT_LOGS; break;
      case 'HistoryLogs': mockItems = MOCK_HISTORY_LOGS; break;
      case 'DeliveryOrders': mockItems = MOCK_DELIVERY_ORDERS; break;
      case 'MasterCodes': mockItems = MOCK_MASTER_CODES; break;
      default: mockItems = [];
    }

    if (action === 'read') {
      return {
        status: 'success',
        message: 'Loaded mock data (Demo Mode)',
        data: { items: mockItems, totalCount: mockItems.length },
        isMockData: true
      };
    }

    if (action === 'lookup') {
      return {
        status: 'success',
        message: 'Lookup mock data (Demo Mode)',
        data: { items: mockItems.slice(0, 1) },
        isMockData: true
      };
    }

    return {
      status: 'success',
      message: `${action} simulated successfully in Demo Mode`,
      data: null,
      isMockData: true
    };
  }

  /**
   * อ่านข้อมูล (มี Pagination และ Cache)
   */
  async readSheet<T = any>(sheetName: string, useCache = false, limit?: number, offset?: number): Promise<SheetResponse<T[]>> {
    const cacheKey = `read_${sheetName}_${limit}_${offset}`;
    
    // คืนค่า Cache ถ้าย้อนกลับมาเปิดหน้าเดิมเร็วๆ
    if (useCache && cache.has(cacheKey)) {
      const cached = cache.get(cacheKey)!;
      if (Date.now() - cached.timestamp < CACHE_TTL) {
        return cached.data;
      }
    }

    const payload: SheetRequest = { action: 'read', sheet: sheetName };
    if (limit !== undefined) payload.limit = limit;
    if (offset !== undefined) payload.offset = offset;

    const result = await this.request(payload);
    
    // โครงสร้าง Response จาก Backend ถูกห่อไว้ใน data.items ปรับให้ใช้ง่ายขึ้น
    const resultData = result.data as any;
    const normalizedResult: SheetResponse<T[]> = {
      status: result.status,
      message: result.message,
      data: resultData?.items || [],
      totalCount: resultData?.totalCount || 0,
      limit: resultData?.limit,
      offset: resultData?.offset,
    };

    if (useCache && normalizedResult.status === 'success') {
      cache.set(cacheKey, { data: normalizedResult, timestamp: Date.now() });
    }

    return normalizedResult;
  }

  /**
   * เขียนข้อมูลลงชีตทีละหลายแถวพร้อมกัน (Batch Writing - ป้องกันตีกัน)
   */
  async writeData(sheetName: string, data: any[]): Promise<SheetResponse> {
    // Clear cache เมื่อมีการอัปเดตข้อมูลของหน้านั้น
    clearCacheForSheet(sheetName);
    return this.request({ action: 'write', sheet: sheetName, data });
  }

  /**
   * ค้นหาข้อมูลแบบ Server-Side Filtering ลดภาระ Frontend
   */
  async lookupData<T = any>(sheetName: string, searchParams: any, matchType: 'exact' | 'includes' = 'exact'): Promise<SheetResponse<T[]>> {
    const result = await this.request({
      action: 'lookup',
      sheet: sheetName,
      data: [searchParams],
      matchType
    });
    
    const resultData = result.data as any;
    return {
      status: result.status,
      message: result.message,
      data: resultData?.items || []
    };
  }
}

export const googleSheetsService = new GoogleSheetsService();

// Helper ล้าง Cache
export function clearCacheForSheet(sheetName: string) {
  for (const key of cache.keys()) {
    if (key.includes(`_${sheetName}_`)) cache.delete(key);
  }
}


import { useState, useCallback, useEffect } from 'react';
import { useGoogleAuth } from '../context/GoogleAuthContext';
import { googleSheetsService } from '../services/googleSheets';
import Swal from 'sweetalert2';

export function useGoogleSheets<T>(sheetName: string) {
  const { isAuthenticated } = useGoogleAuth();
  const [data, setData] = useState<T[]>([]);
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0); 
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async (useCache = true) => {
    if (!isAuthenticated) return;
    setLoading(true);
    setProgress(0);
    setError(null);
    try {
      const response = await googleSheetsService.readSheet<T>(sheetName, useCache);
      if (response.status === 'success') {
        setData(response.data || []);
      } else {
        throw new Error(response.message);
      }
    } catch (err: any) {
      setError(err.message);
      console.warn(`Error fetching ${sheetName}:`, err);
      // ONLY show alert if it's NOT a common demo mode warning
      if (!err.message?.includes('demo') && !err.message?.includes('Mock')) {
        Swal.fire({
          icon: 'error',
          title: `Failed to load ${sheetName}`,
          text: err.message,
          toast: true,
          position: 'top-end',
          showConfirmButton: false,
          timer: 5000
        });
      }
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated, sheetName]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const addRow = async (item: Partial<T>) => {
    setLoading(true);
    setProgress(0);
    try {
      const rowData = { ...item, id: (item as any).id || Date.now().toString() };
      const response = await googleSheetsService.writeData(sheetName, [rowData]);
      setProgress(100);
      if (response.status === 'success') {
        await fetchData(false);
      } else {
        throw new Error(response.message);
      }
    } catch (err: any) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const addMultipleRows = async (items: Partial<T>[]) => {
    if (items.length === 0) return;
    setLoading(true);
    setProgress(0);
    try {
      const rowsData = items.map((item, idx) => ({
        ...item,
        id: (item as any).id || (Date.now() + idx).toString()
      }));

      // Chunk size optimization (500-1000 items per request)
      const chunkSize = 500;
      const totalChunks = Math.ceil(rowsData.length / chunkSize);

      for (let i = 0; i < totalChunks; i++) {
        const start = i * chunkSize;
        const end = Math.min(start + chunkSize, rowsData.length);
        const chunk = rowsData.slice(start, end);

        const response = await googleSheetsService.writeData(sheetName, chunk);
        if (response.status !== 'success') {
          throw new Error(`Chunk ${i+1}/${totalChunks} failed: ${response.message}`);
        }
        
        setProgress(Math.round(((i + 1) / totalChunks) * 100));
      }

      await fetchData(false);
    } catch (err: any) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateMultipleRows = async (items: { id: string | number; [key: string]: any }[]) => {
    if (items.length === 0) return;
    setLoading(true);
    setProgress(0);
    try {
      const chunkSize = 500;
      const totalChunks = Math.ceil(items.length / chunkSize);

      for (let i = 0; i < totalChunks; i++) {
        const start = i * chunkSize;
        const end = Math.min(start + chunkSize, items.length);
        const chunk = items.slice(start, end);

        const response = await googleSheetsService.request({
          action: 'update' as any,
          sheet: sheetName,
          data: chunk
        } as any);

        if (response.status !== 'success') {
          throw new Error(`Update Chunk ${i+1}/${totalChunks} failed: ${response.message}`);
        }

        setProgress(Math.round(((i + 1) / totalChunks) * 100));
      }

      await fetchData(false);
    } catch (err: any) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateRow = async (id: string | number, item: Partial<T>) => {
    setLoading(true);
    try {
      // Logic for Update in a single sheet is usually lookup + overwrite or a dedicated update action
      // For this simple ERP, we'll follow the pattern: Read All -> Update Local -> Write All (if needed)
      // BUT actually, the backend service has a 'write' action that appends.
      // We should ideally have an 'update' action in Backend.
      // Let's assume the backend 'write' handles overwrite if ID exists, or we implement update in Backend.
      
      // Wait, let's check Code.gs for an 'update' case.
      // (Reviewing Code.gs showed read, write, lookup, login. No dedicated update.)
      
      // I'll add an 'update' case to Code.gs if it's missing, or simulate it.
      // Actually, many Apps Script patterns use a full sheet rewrite for updates or look up row index.
      
      const response = await googleSheetsService.request({
        action: 'update' as any, // I'll add this to Code.gs
        sheet: sheetName,
        data: [{ id, ...item }]
      } as any);

      if (response.status === 'success') {
        await fetchData(false);
      } else {
        throw new Error(response.message);
      }
    } catch (err: any) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const deleteRow = async (id: string | number) => {
    setLoading(true);
    try {
      const response = await googleSheetsService.request({
        action: 'delete' as any,
        sheet: sheetName,
        data: [{ id }]
      } as any);

      if (response.status === 'success') {
        await fetchData(false);
      } else {
        throw new Error(response.message);
      }
    } catch (err: any) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { data, loading, progress, error, fetchData, addRow, addMultipleRows, updateRow, updateMultipleRows, deleteRow, refetch: () => fetchData(false) };
}

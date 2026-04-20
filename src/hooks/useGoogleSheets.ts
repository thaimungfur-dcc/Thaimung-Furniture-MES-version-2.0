import { useState, useCallback, useEffect } from 'react';
import { useGoogleAuth } from '../context/GoogleAuthContext';

export function useGoogleSheets<T>(sheetName: string) {
  const { isAuthenticated } = useGoogleAuth();
  const [data, setData] = useState<T[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    if (!isAuthenticated) return;
    setLoading(true);
    setError(null);
    try {
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 300));
      
      const storedData = localStorage.getItem(`erp_data_${sheetName}`);
      if (storedData) {
        const parsedData = JSON.parse(storedData);
        setData(parsedData);
      } else {
        setData([]);
      }
    } catch (err: any) {
      setError(err.message);
      console.error(`Error fetching ${sheetName}:`, err);
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated, sheetName]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const addRow = async (item: T) => {
    try {
      const storedData = localStorage.getItem(`erp_data_${sheetName}`);
      const currentData = storedData ? JSON.parse(storedData) : [];
      const newData = [...currentData, item];
      localStorage.setItem(`erp_data_${sheetName}`, JSON.stringify(newData));
      await fetchData();
    } catch (err: any) {
      setError(err.message);
      throw err;
    }
  };

  const updateRow = async (id: string | number, item: Partial<T>) => {
    try {
      const storedData = localStorage.getItem(`erp_data_${sheetName}`);
      if (!storedData) throw new Error(`No data found for ${sheetName}`);
      
      const currentData = JSON.parse(storedData);
      const index = currentData.findIndex((row: any) => row.id === id || row.rowId === id);
      
      if (index === -1) throw new Error(`Row with id ${id} not found in ${sheetName}`);
      
      currentData[index] = { ...currentData[index], ...item };
      localStorage.setItem(`erp_data_${sheetName}`, JSON.stringify(currentData));
      await fetchData();
    } catch (err: any) {
      setError(err.message);
      throw err;
    }
  };

  const deleteRow = async (id: string | number) => {
    try {
      const storedData = localStorage.getItem(`erp_data_${sheetName}`);
      if (!storedData) throw new Error(`No data found for ${sheetName}`);
      
      const currentData = JSON.parse(storedData);
      const newData = currentData.filter((row: any) => row.id !== id && row.rowId !== id);
      
      localStorage.setItem(`erp_data_${sheetName}`, JSON.stringify(newData));
      await fetchData();
    } catch (err: any) {
      setError(err.message);
      throw err;
    }
  };

  return { data, loading, error, fetchData, addRow, updateRow, deleteRow };
}

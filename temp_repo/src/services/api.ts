/// <reference types="vite/client" />
import { ApiResponse } from '../types';

const SCRIPT_URL = import.meta.env.VITE_APPS_SCRIPT_URL || '';

export const api = {
  post: async <T = any>(action: string, sheet?: string, data?: any): Promise<ApiResponse<T>> => {
    if (!SCRIPT_URL) {
      console.warn('VITE_APPS_SCRIPT_URL is not set. Using mock response.');
      return mockResponse(action, data);
    }
    
    try {
      const response = await fetch(SCRIPT_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'text/plain;charset=utf-8',
        },
        body: JSON.stringify({ action, sheet, data }),
      });
      return await response.json();
    } catch (error) {
      console.error('API Error:', error);
      throw error;
    }
  }
};

// Mock response for development if URL is not set
const mockResponse = async (action: string, data: any): Promise<ApiResponse> => {
  await new Promise(resolve => setTimeout(resolve, 800));
  
  if (action === 'login') {
    if ((data.employeeId === 'demo' && data.idCard === 'demo') || 
        (data.employeeId === 'U001' && data.idCard === '1234567890123')) {
      const isDemo = data.employeeId === 'demo';
      return {
        status: 'success',
        data: {
          id: isDemo ? '2' : '1',
          employeeId: data.employeeId,
          name: isDemo ? 'Demo User' : 'Administrator',
          role: isDemo ? 'Viewer' : 'Admin',
          permissions: {
            canCreate: !isDemo,
            canEdit: !isDemo,
            canApprove: !isDemo,
            canVerify: !isDemo,
          }
        }
      };
    }
    return { status: 'error', message: 'Invalid credentials' };
  }
  
  return { status: 'success', data: [] };
};

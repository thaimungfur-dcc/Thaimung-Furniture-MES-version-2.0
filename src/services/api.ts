/// <reference types="vite/client" />
import { ApiResponse } from '../types';

const SCRIPT_URL = import.meta.env.VITE_APPS_SCRIPT_URL || '';

/**
 * Cache utility for storing API responses in localStorage
 */
const cache = {
  set: (key: string, data: any, ttlMinutes: number = 5) => {
    const expiredAt = Date.now() + ttlMinutes * 60 * 1000;
    localStorage.setItem(`api_cache_${key}`, JSON.stringify({ data, expiredAt }));
  },
  get: (key: string) => {
    const cached = localStorage.getItem(`api_cache_${key}`);
    if (!cached) return null;
    const { data, expiredAt } = JSON.parse(cached);
    if (Date.now() > expiredAt) {
      localStorage.removeItem(`api_cache_${key}`);
      return null;
    }
    return data;
  },
  clear: () => {
    Object.keys(localStorage).forEach(key => {
      if (key.startsWith('api_cache_')) localStorage.removeItem(key);
    });
  }
};

export const api = {
  cache,
  post: async <T = any>(action: string, sheet?: string, data?: any, useCache: boolean = false): Promise<ApiResponse<T>> => {
    const cacheKey = `${action}_${sheet}_${JSON.stringify(data)}`;
    
    if (useCache) {
      const cachedData = cache.get(cacheKey);
      if (cachedData) return { status: 'success', data: cachedData };
    }

    if (!SCRIPT_URL) {
      console.warn('VITE_APPS_SCRIPT_URL is not set. Using mock response.');
      const response = await mockResponse(action, data);
      if (useCache && response.status === 'success') cache.set(cacheKey, response.data);
      return response;
    }
    
    try {
      const response = await fetch(SCRIPT_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'text/plain;charset=utf-8',
        },
        body: JSON.stringify({ action, sheet, data }),
      });
      const result = await response.json();
      if (useCache && result.status === 'success') cache.set(cacheKey, result.data);
      return result;
    } catch (error) {
      console.warn('API Error (Fallback):', error);
      console.warn('Failed to fetch from the provided URL. Falling back to mock response.');
      const response = await mockResponse(action, data);
      if (useCache && response.status === 'success') cache.set(cacheKey, response.data);
      return response;
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
          avatar: 'https://drive.google.com/thumbnail?id=1Z_fRbN9S4aA7OkHb3mlim_t60wIT4huY&sz=w400',
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

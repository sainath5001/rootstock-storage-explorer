import apiClient from './axios';
import { StorageResponse } from '@/types';

export const storageApi = {
  /**
   * Get storage analysis for a contract address
   */
  getStorage: async (address: string): Promise<StorageResponse> => {
    const response = await apiClient.get<StorageResponse>('/api/storage', {
      params: { address },
    });
    return response.data;
  },

  /**
   * Get storage with custom ABI and layout
   */
  getStorageWithABI: async (
    address: string,
    abi?: any,
    storageLayout?: any
  ): Promise<StorageResponse> => {
    const response = await apiClient.post<StorageResponse>('/api/storage', {
      address,
      abi,
      storageLayout,
    });
    return response.data;
  },

  /**
   * Get storage for specific slots
   */
  getStorageSlots: async (
    address: string,
    slots: number[]
  ): Promise<StorageResponse> => {
    const response = await apiClient.post<StorageResponse>('/api/storage/slots', {
      address,
      slots,
    });
    return response.data;
  },

  /**
   * Health check
   */
  healthCheck: async (): Promise<{ status: string; timestamp: string }> => {
    const response = await apiClient.get('/api/health');
    return response.data;
  },
};


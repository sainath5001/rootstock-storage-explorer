import { useQuery } from '@tanstack/react-query';
import { storageApi } from '@/services/api';
import { StorageResponse } from '@/types';

export function useStorage(address: string | null) {
  return useQuery<StorageResponse, Error>({
    queryKey: ['storage', address],
    queryFn: () => {
      if (!address) {
        throw new Error('Address is required');
      }
      return storageApi.getStorage(address);
    },
    enabled: !!address && address.length > 0,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes (formerly cacheTime)
    retry: 2,
  });
}

export function useHealthCheck() {
  return useQuery<{ status: string; timestamp: string }, Error>({
    queryKey: ['health'],
    queryFn: () => storageApi.healthCheck(),
    refetchInterval: 60000, // Check every minute
    retry: 1,
  });
}


import NodeCache from 'node-cache';
import { appConfig } from '../config';

export class CacheService {
  private cache: NodeCache;

  constructor() {
    this.cache = new NodeCache({
      stdTTL: appConfig.CACHE_TTL,
      checkperiod: 60,
      useClones: false,
    });
  }

  /**
   * Gets cached value
   */
  get<T>(key: string): T | undefined {
    return this.cache.get<T>(key);
  }

  /**
   * Sets cached value
   */
  set<T>(key: string, value: T, ttl?: number): boolean {
    return this.cache.set(key, value, ttl || appConfig.CACHE_TTL);
  }

  /**
   * Deletes cached value
   */
  delete(key: string): number {
    return this.cache.del(key);
  }

  /**
   * Clears all cache
   */
  clear(): void {
    this.cache.flushAll();
  }

  /**
   * Gets cache key for contract storage
   */
  getStorageKey(address: string, blockNumber?: bigint): string {
    return `storage:${address.toLowerCase()}:${blockNumber || 'latest'}`;
  }

  /**
   * Gets cache key for contract ABI
   */
  getABIKey(address: string): string {
    return `abi:${address.toLowerCase()}`;
  }

  /**
   * Gets cache key for proxy info
   */
  getProxyKey(address: string): string {
    return `proxy:${address.toLowerCase()}`;
  }
}

export const cacheService = new CacheService();


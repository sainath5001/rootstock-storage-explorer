import { createPublicClient, http, PublicClient } from 'viem';
import { appConfig } from '../config';
import { normalizeAddress } from '../utils/address';

export class RPCService {
  private client: PublicClient;

  constructor() {
    this.client = createPublicClient({
      transport: http(appConfig.RPC_URL),
    });
  }

  /**
   * Gets storage at a specific slot for a contract
   */
  async getStorageAt(
    address: string,
    slot: number | string,
    blockNumber?: bigint
  ): Promise<string> {
    const normalizedAddress = normalizeAddress(address);
    const slotHex = typeof slot === 'number' ? `0x${slot.toString(16)}` : slot;

    try {
      const storage = await this.client.getStorageAt({
        address: normalizedAddress as `0x${string}`,
        slot: slotHex as `0x${string}`,
        blockNumber,
      });

      return storage || '0x0000000000000000000000000000000000000000000000000000000000000000';
    } catch (error: any) {
      throw new Error(`Failed to get storage at slot ${slot}: ${error.message}`);
    }
  }

  /**
   * Gets storage for multiple slots in batch
   */
  async getStorageBatch(
    address: string,
    slots: (number | string)[],
    blockNumber?: bigint
  ): Promise<Map<number | string, string>> {
    const results = new Map<number | string, string>();
    
    // Process in batches to avoid overwhelming the RPC
    const batchSize = appConfig.BATCH_SIZE;
    
    for (let i = 0; i < slots.length; i += batchSize) {
      const batch = slots.slice(i, i + batchSize);
      
      const promises = batch.map(async (slot) => {
        try {
          const value = await this.getStorageAt(address, slot, blockNumber);
          return { slot, value };
        } catch (error: any) {
          console.error(`Error fetching slot ${slot}:`, error.message);
          return {
            slot,
            value: '0x0000000000000000000000000000000000000000000000000000000000000000',
          };
        }
      });

      const batchResults = await Promise.all(promises);
      batchResults.forEach(({ slot, value }) => {
        results.set(slot, value);
      });

      // Small delay between batches to be nice to RPC node
      if (i + batchSize < slots.length) {
        await new Promise((resolve) => setTimeout(resolve, 100));
      }
    }

    return results;
  }

  /**
   * Crawls storage slots from 0 to maxSlots
   */
  async crawlStorageSlots(
    address: string,
    maxSlots: number = appConfig.MAX_STORAGE_SLOTS
  ): Promise<Map<number, string>> {
    const slots: number[] = [];
    for (let i = 0; i < maxSlots; i++) {
      slots.push(i);
    }

    const result = await this.getStorageBatch(address, slots);
    const numberMap = new Map<number, string>();
    result.forEach((value, key) => {
      if (typeof key === 'number') {
        numberMap.set(key, value);
      }
    });
    return numberMap;
  }

  /**
   * Gets contract code
   */
  async getCode(address: string): Promise<string> {
    const normalizedAddress = normalizeAddress(address);
    
    try {
      const code = await this.client.getBytecode({
        address: normalizedAddress as `0x${string}`,
      });
      
      return code || '0x';
    } catch (error: any) {
      throw new Error(`Failed to get code: ${error.message}`);
    }
  }

  /**
   * Checks if address is a contract
   */
  async isContract(address: string): Promise<boolean> {
    const code = await this.getCode(address);
    return code !== '0x' && code.length > 2;
  }

  /**
   * Gets the current block number
   */
  async getBlockNumber(): Promise<bigint> {
    try {
      const blockNumber = await this.client.getBlockNumber();
      return blockNumber;
    } catch (error: any) {
      throw new Error(`Failed to get block number: ${error.message}`);
    }
  }
}

export const rpcService = new RPCService();


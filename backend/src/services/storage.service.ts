import { rpcService } from './rpc.service';
import { abiService, AbiSource } from './abi.service';
import { proxyService } from './proxy.service';
import { decodeStorageSlot } from '../utils/slotDecoder';
import { decodeVariableByType, formatValueByType } from '../utils/typeDecoder';
import { parseStorageLayout, getAllVariables } from '../utils/layout';
import { normalizeAddress } from '../utils/address';
import { appConfig } from '../config';
import { Abi } from 'viem';

export interface SlotViewItem {
  slot: number;
  raw: string;
  decodedType: string;
  decodedValue: string | number | boolean | null;
}

export interface VariableViewItem {
  name: string;
  type: string;
  value: string | null;
  slot?: number;
}

export interface StorageResponse {
  address: string;
  isProxy: boolean;
  implementationAddress?: string;
  slotView: SlotViewItem[];
  variableView: VariableViewItem[];
  abiSource?: 'provided' | 'explorer' | 'local' | null;
}

export class StorageService {
  /**
   * Main method to analyze contract storage
   */
  async analyzeStorage(
    contractAddress: string,
    providedABI?: Abi,
    providedLayout?: any
  ): Promise<StorageResponse> {
    const normalizedAddress = normalizeAddress(contractAddress);

    // Check if it's a contract
    try {
      const isContract = await rpcService.isContract(normalizedAddress);
      if (!isContract) {
        throw new Error('Address does not contain contract code. This address is an EOA (Externally Owned Account), not a smart contract.');
      }
    } catch (error: any) {
      // If RPC fails, provide helpful error message
      if (error.message?.includes('fetch failed') || error.message?.includes('timeout') || error.message?.includes('ETIMEDOUT')) {
        throw new Error('Unable to connect to Rootstock RPC node. Please check your network connection and RPC_URL configuration.');
      }
      throw error;
    }

    // Detect proxy
    const proxyInfo = await proxyService.detectProxy(normalizedAddress);
    let targetAddress = normalizedAddress;

    if (proxyInfo.isProxy && proxyInfo.implementationAddress) {
      targetAddress = proxyInfo.implementationAddress;
    }

    // Get or fetch ABI
    let abi: Abi | null = null;
    let abiSource: AbiSource['source'] | null = null;

    if (providedABI) {
      abi = abiService.validateABI(providedABI);
      abiSource = 'provided';
    } else {
      // Try to fetch from explorer
      abi = await abiService.fetchABIFromExplorer(targetAddress);
      if (abi) {
        abiSource = 'explorer';
      }
    }

    // Crawl storage slots
    const storageSlots = await rpcService.crawlStorageSlots(
      normalizedAddress,
      appConfig.MAX_STORAGE_SLOTS
    );

    // Parse storage layout if provided
    let storageLayout = null;
    if (providedLayout) {
      storageLayout = parseStorageLayout(providedLayout);
    }

    // Build slot view
    const slotView: SlotViewItem[] = [];
    storageSlots.forEach((raw, slot) => {
      const decoded = decodeStorageSlot(slot, raw);
      slotView.push({
        slot,
        raw,
        decodedType: decoded.decodedType,
        decodedValue: typeof decoded.decodedValue === 'bigint' 
          ? decoded.decodedValue.toString() 
          : decoded.decodedValue,
      });
    });

    // Build variable view
    const variableView: VariableViewItem[] = [];

    if (storageLayout) {
      // Use storage layout to map variables
      const variables = getAllVariables(storageLayout);
      variables.forEach((variable) => {
        const rawValue = storageSlots.get(variable.slot);
        if (rawValue) {
          const decodedValue = decodeVariableByType(variable.type, rawValue, variable.slot);
          variableView.push({
            name: variable.label,
            type: variable.type,
            value: formatValueByType(variable.type, decodedValue),
            slot: variable.slot,
          });
        }
      });
    } else if (abi) {
      // Infer variables from ABI
      const hints = abiService.extractStateVariableHints(abi);
      hints.forEach((hint, index) => {
        // Try to find matching slot (simplified - would need proper mapping)
        if (index < storageSlots.size) {
          const rawValue = storageSlots.get(index);
          if (rawValue) {
            const decodedValue = decodeVariableByType(hint.type, rawValue);
            variableView.push({
              name: hint.name,
              type: hint.type,
              value: formatValueByType(hint.type, decodedValue),
              slot: index,
            });
          }
        }
      });
    } else {
      // No ABI or layout - show slots with auto-detected types
      storageSlots.forEach((raw, slot) => {
        const decoded = decodeStorageSlot(slot, raw);
        if (decoded.decodedValue !== null) {
          variableView.push({
            name: `slot_${slot}`,
            type: decoded.decodedType,
            value: String(decoded.decodedValue),
            slot,
          });
        }
      });
    }

    return {
      address: normalizedAddress,
      isProxy: proxyInfo.isProxy,
      implementationAddress: proxyInfo.implementationAddress,
      slotView,
      variableView,
      abiSource,
    };
  }

  /**
   * Gets storage for specific slots only
   */
  async getStorageForSlots(
    contractAddress: string,
    slots: number[]
  ): Promise<SlotViewItem[]> {
    const normalizedAddress = normalizeAddress(contractAddress);
    const storageSlots = await rpcService.getStorageBatch(
      normalizedAddress,
      slots
    );

    const slotView: SlotViewItem[] = [];
    storageSlots.forEach((raw, slot) => {
      const decoded = decodeStorageSlot(Number(slot), raw);
      slotView.push({
        slot: Number(slot),
        raw,
        decodedType: decoded.decodedType,
        decodedValue: typeof decoded.decodedValue === 'bigint' 
          ? decoded.decodedValue.toString() 
          : decoded.decodedValue,
      });
    });

    return slotView;
  }
}

export const storageService = new StorageService();


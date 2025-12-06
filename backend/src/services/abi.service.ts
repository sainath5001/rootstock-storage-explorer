import { Abi } from 'viem';
import { appConfig } from '../config';
import { normalizeAddress } from '../utils/address';

export interface AbiSource {
  abi: Abi;
  source: 'provided' | 'explorer' | 'local';
}

export class ABIService {
  /**
   * Attempts to fetch ABI from Rootstock block explorer
   */
  async fetchABIFromExplorer(contractAddress: string): Promise<Abi | null> {
    if (!appConfig.ROOTSTOCK_EXPLORER_API) {
      return null;
    }

    try {
      const normalizedAddress = normalizeAddress(contractAddress);
      const url = `${appConfig.ROOTSTOCK_EXPLORER_API}?module=contract&action=getabi&address=${normalizedAddress}`;

      const response = await fetch(url);
      const data: any = await response.json();

      if (data.status === '1' && data.result) {
        try {
          return JSON.parse(data.result);
        } catch {
          return data.result;
        }
      }

      return null;
    } catch (error: any) {
      console.error('Failed to fetch ABI from explorer:', error.message);
      return null;
    }
  }

  /**
   * Validates and parses ABI
   */
  validateABI(abi: any): Abi | null {
    if (!Array.isArray(abi)) {
      return null;
    }

    // Basic validation - ensure it's a valid ABI structure
    const hasValidTypes = abi.some(
      (item) =>
        item.type === 'function' ||
        item.type === 'event' ||
        item.type === 'constructor' ||
        item.type === 'fallback' ||
        item.type === 'receive'
    );

    return hasValidTypes ? (abi as Abi) : null;
  }

  /**
   * Extracts state variable information from ABI (inferred)
   * Note: ABI doesn't contain state variables directly, so we infer from events/function inputs
   */
  extractStateVariableHints(abi: Abi): Array<{ name: string; type: string }> {
    const hints: Array<{ name: string; type: string }> = [];

    // Extract from events (indexed params often represent state)
    abi
      .filter((item) => item.type === 'event')
      .forEach((event: any) => {
        if (event.inputs) {
          event.inputs
            .filter((input: any) => input.indexed)
            .forEach((input: any) => {
              hints.push({
                name: `${event.name}_${input.name}`,
                type: input.type,
              });
            });
        }
      });

    // Extract from function outputs (getters)
    abi
      .filter((item) => item.type === 'function' && item.outputs)
      .forEach((func: any) => {
        if (func.outputs && func.outputs.length === 1) {
          hints.push({
            name: func.name || 'unknown',
            type: func.outputs[0].type,
          });
        }
      });

    return hints;
  }
}

export const abiService = new ABIService();


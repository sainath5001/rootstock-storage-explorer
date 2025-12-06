import { rpcService } from './rpc.service';
import { normalizeAddress } from '../utils/address';

/**
 * EIP-1967 storage slots for proxy patterns
 */
export const EIP1967_SLOTS = {
  IMPLEMENTATION: '0x360894a13ba1a3210667c828492db98dca3e2076cc3735a920a3ca505d382bbc',
  ADMIN: '0xb53127684a568b3173ae13b9f8a6016e243e63b6e8ee1178d6a717850b5d6103',
  BEACON: '0xa3f0ad74e5423aebfd80d3ef4346578335a9a72aeaee59ff6cb3582b35133d50',
};

export interface ProxyInfo {
  isProxy: boolean;
  proxyType?: 'eip1967' | 'custom';
  implementationAddress?: string;
  adminAddress?: string;
}

export class ProxyService {
  /**
   * Checks if a contract is a proxy (EIP-1967)
   */
  async detectProxy(contractAddress: string): Promise<ProxyInfo> {
    try {
      // Check EIP-1967 implementation slot
      const implSlot = await rpcService.getStorageAt(
        contractAddress,
        EIP1967_SLOTS.IMPLEMENTATION
      );

      if (implSlot && !this.isZeroSlot(implSlot)) {
        const implAddress = this.extractAddressFromSlot(implSlot);
        
        // Also check admin slot
        const adminSlot = await rpcService.getStorageAt(
          contractAddress,
          EIP1967_SLOTS.ADMIN
        );
        
        const adminAddress = adminSlot && !this.isZeroSlot(adminSlot)
          ? this.extractAddressFromSlot(adminSlot)
          : undefined;

        return {
          isProxy: true,
          proxyType: 'eip1967',
          implementationAddress: implAddress,
          adminAddress,
        };
      }

      return { isProxy: false };
    } catch (error: any) {
      console.error('Error detecting proxy:', error.message);
      return { isProxy: false };
    }
  }

  /**
   * Resolves implementation address for proxy contracts
   */
  async resolveImplementation(contractAddress: string): Promise<string | null> {
    const proxyInfo = await this.detectProxy(contractAddress);
    return proxyInfo.implementationAddress || null;
  }

  /**
   * Checks if storage slot is zero
   */
  private isZeroSlot(slot: string): boolean {
    const normalized = slot.startsWith('0x') ? slot.slice(2) : slot;
    return normalized.replace(/0/g, '') === '';
  }

  /**
   * Extracts address from storage slot (last 20 bytes)
   */
  private extractAddressFromSlot(slot: string): string {
    const normalized = slot.startsWith('0x') ? slot.slice(2) : slot;
    const addressPart = '0x' + normalized.slice(normalized.length - 40);
    return normalizeAddress(addressPart);
  }
}

export const proxyService = new ProxyService();


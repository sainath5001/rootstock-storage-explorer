import { getAddress, isAddress } from 'viem';

/**
 * Validates and normalizes an Ethereum/Rootstock address
 */
export function normalizeAddress(address: string): string {
  if (!isAddress(address)) {
    throw new Error(`Invalid address: ${address}`);
  }
  return getAddress(address);
}

/**
 * Validates if the given string is a valid address
 */
export function isValidAddress(address: string): boolean {
  return isAddress(address);
}

/**
 * Checks if an address is a zero address
 */
export function isZeroAddress(address: string): boolean {
  return address.toLowerCase() === '0x0000000000000000000000000000000000000000';
}


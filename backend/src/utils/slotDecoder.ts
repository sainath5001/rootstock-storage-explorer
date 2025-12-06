import { isAddress, getAddress } from 'viem';

/**
 * Decodes a raw storage slot value based on its type
 */
export interface DecodedSlot {
  slot: number;
  raw: string;
  decodedType: string;
  decodedValue: string | number | boolean | bigint | null;
}

/**
 * Removes 0x prefix and normalizes hex string
 */
function normalizeHex(hex: string): string {
  return hex.startsWith('0x') ? hex.slice(2).toLowerCase() : hex.toLowerCase();
}

/**
 * Checks if a hex string is all zeros
 */
function isZeroHex(hex: string): boolean {
  return normalizeHex(hex).replace(/0/g, '') === '';
}

/**
 * Decodes a uint256 from storage slot
 */
function decodeUint256(raw: string): bigint {
  if (isZeroHex(raw)) return 0n;
  return BigInt(raw);
}

/**
 * Decodes an address from storage slot (last 20 bytes)
 */
function decodeAddress(raw: string): string | null {
  if (isZeroHex(raw)) return null;
  
  const normalized = normalizeHex(raw);
  const addressPart = '0x' + normalized.slice(normalized.length - 40);
  
  if (isAddress(addressPart)) {
    return getAddress(addressPart);
  }
  
  return null;
}

/**
 * Decodes a bool from storage slot
 */
function decodeBool(raw: string): boolean {
  const normalized = normalizeHex(raw);
  const lastByte = normalized.slice(normalized.length - 2);
  return lastByte !== '00';
}

/**
 * Attempts to auto-detect the type and decode the slot value
 */
export function decodeStorageSlot(
  slot: number,
  raw: string,
  hintType?: string
): DecodedSlot {
  const normalized = normalizeHex(raw);
  
  if (isZeroHex(raw)) {
    return {
      slot,
      raw,
      decodedType: hintType || 'unknown',
      decodedValue: null,
    };
  }

  // Try to decode based on hint type first
  if (hintType) {
    try {
      if (hintType.startsWith('uint')) {
        const value = decodeUint256(raw);
        return {
          slot,
          raw,
          decodedType: hintType,
          decodedValue: value.toString(),
        };
      }
      
      if (hintType === 'address') {
        const address = decodeAddress(raw);
        return {
          slot,
          raw,
          decodedType: 'address',
          decodedValue: address || raw,
        };
      }
      
      if (hintType === 'bool') {
        return {
          slot,
          raw,
          decodedType: 'bool',
          decodedValue: decodeBool(raw),
        };
      }
    } catch (error) {
      // Fall through to auto-detection
    }
  }

  // Auto-detection: Check if it's an address (valid checksum)
  const address = decodeAddress(raw);
  if (address) {
    return {
      slot,
      raw,
      decodedType: 'address',
      decodedValue: address,
    };
  }

  // Check if it's a boolean (only last byte is non-zero)
  const lastByte = normalized.slice(normalized.length - 2);
  const restIsZero = normalized.slice(0, -2).replace(/0/g, '') === '';
  if (restIsZero && (lastByte === '01' || lastByte === '00')) {
    return {
      slot,
      raw,
      decodedType: 'bool',
      decodedValue: lastByte === '01',
    };
  }

  // Default: treat as uint256
  const uintValue = decodeUint256(raw);
  return {
    slot,
    raw,
    decodedType: 'uint256',
    decodedValue: uintValue.toString(),
  };
}

/**
 * Formats a decoded value for display
 */
export function formatDecodedValue(
  type: string,
  value: string | number | boolean | bigint | null
): string {
  if (value === null) {
    return '0x0';
  }

  if (type.startsWith('uint')) {
    return value.toString();
  }

  if (type === 'address') {
    return value as string;
  }

  if (type === 'bool') {
    return value ? 'true' : 'false';
  }

  return String(value);
}


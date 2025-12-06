import { keccak256, encodePacked, encodeAbiParameters } from 'viem';

export interface DecodedVariable {
  name: string;
  type: string;
  value: string | null;
  slot?: number;
}

/**
 * Calculates the storage slot for a mapping key
 */
export function getMappingSlot(
  baseSlot: number,
  key: string,
  keyType: string
): string {
  // For mappings: keccak256(abi.encode(key, slot))
  const keyHex = key.startsWith('0x') ? key : `0x${key}`;
  
  // Simple implementation - for complex types, would need proper encoding
  const packed = encodePacked(
    keyType === 'address' ? ['address', 'uint256'] : ['bytes32', 'uint256'],
    [keyHex as `0x${string}`, BigInt(baseSlot)]
  );
  
  return keccak256(packed);
}

/**
 * Calculates the storage slot for an array element
 * For arrays, the slot is: keccak256(abi.encode(baseSlot)) + index
 */
export function getArraySlot(baseSlot: number, index: number): string {
  // Encode the base slot as uint256
  const encodedSlot = encodeAbiParameters(
    [{ type: 'uint256' }],
    [BigInt(baseSlot)]
  );
  
  // Hash the encoded slot
  const hash = keccak256(encodedSlot);
  const hashBigInt = BigInt(hash);
  
  // Add the index
  const result = hashBigInt + BigInt(index);
  
  return `0x${result.toString(16).padStart(64, '0')}`;
}

/**
 * Decodes a variable based on its ABI type definition
 */
export function decodeVariableByType(
  type: string,
  rawValue: string,
  _slot?: number
): string | number | boolean | null {
  if (type.startsWith('uint')) {
    const value = BigInt(rawValue);
    return value.toString();
  }

  if (type === 'int256' || type.startsWith('int')) {
    // Handle signed integers (two's complement)
    const value = BigInt(rawValue);
    const maxInt256 = BigInt('0x7fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff');
    if (value > maxInt256) {
      // Negative number
      const complement = BigInt('0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff');
      return (Number(value - complement - 1n) * -1).toString();
    }
    return value.toString();
  }

  if (type === 'address') {
    const normalized = rawValue.startsWith('0x') ? rawValue.slice(2) : rawValue;
    const addressPart = '0x' + normalized.slice(normalized.length - 40);
    return addressPart.toLowerCase();
  }

  if (type === 'bool') {
    const normalized = rawValue.startsWith('0x') ? rawValue.slice(2) : rawValue;
    const lastByte = normalized.slice(normalized.length - 2);
    return lastByte !== '00';
  }

  if (type === 'bytes32' || type.startsWith('bytes')) {
    return rawValue;
  }

  if (type === 'string') {
    // String decoding requires length slot - simplified here
    const normalized = rawValue.startsWith('0x') ? rawValue.slice(2) : rawValue;
    try {
      const bytes = Buffer.from(normalized, 'hex');
      const nullIndex = bytes.indexOf(0);
      if (nullIndex > 0) {
        return bytes.slice(0, nullIndex).toString('utf-8');
      }
      return bytes.toString('utf-8').replace(/\0/g, '') || null;
    } catch {
      return null;
    }
  }

  return null;
}

/**
 * Formats a decoded value based on type
 */
export function formatValueByType(
  type: string,
  value: string | number | boolean | null
): string {
  if (value === null || value === undefined) {
    return '0x0';
  }

  if (type === 'bool') {
    return value ? 'true' : 'false';
  }

  if (type === 'address') {
    return value as string;
  }

  return String(value);
}


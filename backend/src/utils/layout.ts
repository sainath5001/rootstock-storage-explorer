
export interface StorageLayoutEntry {
  label: string; // Variable name
  type: string; // Solidity type
  slot: number; // Storage slot number
  offset: number; // Byte offset within slot
  size: number; // Size in bytes
}

export interface StorageLayout {
  storage: StorageLayoutEntry[];
  types: Record<string, any>;
}

/**
 * Parses Solidity compiler output storage layout
 */
export function parseStorageLayout(compilerOutput: any): StorageLayout | null {
  if (!compilerOutput || !compilerOutput.storageLayout) {
    return null;
  }

  return compilerOutput.storageLayout;
}

/**
 * Gets storage slot for a variable from storage layout
 */
export function getVariableSlot(
  layout: StorageLayout,
  variableName: string
): number | null {
  const entry = layout.storage.find((item) => item.label === variableName);
  return entry ? entry.slot : null;
}

/**
 * Gets all variables from storage layout with their slots
 */
export function getAllVariables(layout: StorageLayout): StorageLayoutEntry[] {
  return layout.storage || [];
}

/**
 * Maps ABI state variables to storage layout
 */
export function mapAbiToLayout(
  _abi: any[],
  layout: StorageLayout
): Map<string, StorageLayoutEntry> {
  const mapping = new Map<string, StorageLayoutEntry>();

  // This is a simplified mapping - in production, you'd need more complex logic
  // to match ABI inputs/outputs with storage layout entries
  
  if (!layout || !layout.storage) {
    return mapping;
  }

  layout.storage.forEach((entry) => {
    mapping.set(entry.label, entry);
  });

  return mapping;
}

/**
 * Calculates storage slot for nested mappings
 * Note: This is a simplified implementation. Full implementation would use proper ABI encoding
 */
export function calculateNestedMappingSlot(
  baseSlot: number,
  _keys: string[],
  _keyTypes: string[]
): string {
  // This is a placeholder - proper implementation would require:
  // 1. ABI encoding of keys
  // 2. Keccak256 hashing
  // 3. Proper handling of nested structures
  
  // For now, return base slot as string
  // Full implementation should be done in typeDecoder.ts using viem utilities
  return baseSlot.toString();
}

/**
 * Extracts state variables from ABI
 */
export function extractStateVariablesFromAbi(abi: any[]): any[] {
  // State variables are not directly in ABI, but we can infer from events and functions
  // This is a simplified approach - full implementation would need contract source
  
  const stateVars: any[] = [];
  
  // Check events for indexed parameters (often state variables)
  abi
    .filter((item) => item.type === 'event')
    .forEach((event) => {
      if (event.inputs) {
        event.inputs
          .filter((input: any) => input.indexed)
          .forEach((input: any) => {
            stateVars.push({
              name: input.name,
              type: input.type,
            });
          });
      }
    });

  return stateVars;
}


/**
 * Type definitions for Rootstock StateLens Backend
 */

export interface StorageSlot {
  slot: number;
  raw: string;
  decodedType: string;
  decodedValue: string | number | boolean | null;
}

export interface VariableInfo {
  name: string;
  type: string;
  value: string | null;
  slot?: number;
}

export interface ContractStorage {
  address: string;
  isProxy: boolean;
  implementationAddress?: string;
  slotView: StorageSlot[];
  variableView: VariableInfo[];
  abiSource?: 'provided' | 'explorer' | 'local' | null;
}

export interface ErrorResponse {
  error: string;
  message?: string;
  details?: any;
}

export interface HealthResponse {
  status: 'healthy' | 'unhealthy';
  timestamp: string;
  error?: string;
}


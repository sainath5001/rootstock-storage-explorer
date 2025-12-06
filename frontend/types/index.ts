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

export interface ApiError {
  error: string;
  message?: string;
  details?: any;
}


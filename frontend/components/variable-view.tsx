'use client';

import { VariableViewItem } from '@/types';
import { CopyButton } from './copy-button';
import { formatAddress, truncateText } from '@/lib/utils';

interface VariableViewProps {
  data: VariableViewItem[];
}

export function VariableView({ data }: VariableViewProps) {
  if (data.length === 0) {
    return (
      <div className="text-center py-12 text-muted-foreground">
        <p>No variables found. The contract may be unverified or have no state variables.</p>
      </div>
    );
  }

  return (
    <div className="w-full">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-lg font-semibold">Variable Inspector</h3>
        <span className="text-sm text-muted-foreground">
          {data.length} variable{data.length !== 1 ? 's' : ''} found
        </span>
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {data.map((variable, index) => (
          <div
            key={`${variable.name}-${index}`}
            className="border border-border rounded-lg p-4 bg-card hover:shadow-lg transition-shadow"
          >
            <div className="flex items-start justify-between mb-2">
              <h4 className="font-semibold text-sm break-all">{variable.name}</h4>
              {variable.slot !== undefined && (
                <span className="text-xs text-muted-foreground ml-2 whitespace-nowrap">
                  Slot {variable.slot}
                </span>
              )}
            </div>
            <div className="mb-2">
              <span className="px-2 py-1 rounded bg-primary/10 text-primary text-xs font-medium">
                {variable.type}
              </span>
            </div>
            <div className="mt-3">
              <div className="flex items-center gap-2">
                <span className="font-mono text-sm break-all flex-1">
                  {variable.value === null ? (
                    <span className="text-muted-foreground italic">null</span>
                  ) : variable.type === 'address' ? (
                    formatAddress(variable.value)
                  ) : variable.value.length > 30 ? (
                    truncateText(variable.value, 30)
                  ) : (
                    variable.value
                  )}
                </span>
                {variable.value && (
                  <CopyButton text={variable.value} />
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}


'use client';

import { useMemo, useEffect, useState } from 'react';
import { AgGridReact } from 'ag-grid-react';
import { ColDef } from 'ag-grid-community';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';
import { SlotViewItem } from '@/types';
import { CopyButton } from './copy-button';
import { truncateText } from '@/lib/utils';

interface SlotViewProps {
  data: SlotViewItem[];
}

export function SlotView({ data }: SlotViewProps) {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    // Check initial theme
    setIsDark(document.documentElement.classList.contains('dark'));

    // Watch for theme changes
    const observer = new MutationObserver(() => {
      setIsDark(document.documentElement.classList.contains('dark'));
    });

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class'],
    });

    return () => observer.disconnect();
  }, []);

  const columnDefs: ColDef[] = useMemo(
    () => [
      {
        field: 'slot',
        headerName: 'Slot Number',
        width: 120,
        sortable: true,
        filter: true,
        cellRenderer: (params: any) => (
          <div className="flex items-center gap-2">
            <span className="font-mono">{params.value}</span>
            <CopyButton text={String(params.value)} />
          </div>
        ),
      },
      {
        field: 'raw',
        headerName: 'Raw Hex Value',
        width: 400,
        sortable: true,
        filter: true,
        cellRenderer: (params: any) => (
          <div className="flex items-center gap-2">
            <span className="font-mono text-xs">{params.value}</span>
            <CopyButton text={params.value} />
          </div>
        ),
      },
      {
        field: 'decodedType',
        headerName: 'Decoded Type',
        width: 150,
        sortable: true,
        filter: true,
        cellRenderer: (params: any) => (
          <span className="px-2 py-1 rounded bg-primary/10 text-primary text-xs font-medium">
            {params.value}
          </span>
        ),
      },
      {
        field: 'decodedValue',
        headerName: 'Decoded Value',
        flex: 1,
        sortable: true,
        filter: true,
        cellRenderer: (params: any) => {
          const value = params.value;
          if (value === null) {
            return (
              <span className="text-muted-foreground italic">null</span>
            );
          }
          const displayValue =
            typeof value === 'string' && value.length > 50
              ? truncateText(value, 50)
              : String(value);
          return (
            <div className="flex items-center gap-2">
              <span className="font-mono text-sm">{displayValue}</span>
              <CopyButton text={String(value)} />
            </div>
          );
        },
      },
    ],
    []
  );

  const defaultColDef = useMemo(
    () => ({
      resizable: true,
      sortable: true,
    }),
    []
  );

  return (
    <div className="w-full h-full">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-lg font-semibold">Slot-By-Slot View</h3>
        <span className="text-sm text-muted-foreground">
          {data.length} slot{data.length !== 1 ? 's' : ''} found
        </span>
      </div>
      <div
        className={`ag-theme-alpine${isDark ? '-dark' : ''} w-full`}
        style={{ height: '600px' }}
      >
        <AgGridReact
          rowData={data}
          columnDefs={columnDefs}
          defaultColDef={defaultColDef}
          pagination={true}
          paginationPageSize={50}
          animateRows={true}
          rowSelection="single"
          suppressRowClickSelection={false}
          enableCellTextSelection={true}
          ensureDomOrder={true}
        />
      </div>
    </div>
  );
}


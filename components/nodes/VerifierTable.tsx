import { useState, useMemo, useEffect } from 'react';
import { ChevronUp, ChevronDown, ChevronLeft, ChevronRight } from 'lucide-react';
import {
  Column,
  ColumnDef,
  RowData,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
  getFacetedUniqueValues,
  getFacetedRowModel,
} from '@tanstack/react-table'

import { Verifier } from '@/lib/types';

declare module '@tanstack/react-table' {
  // see: https://github.com/TanStack/table/discussions/5222
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  interface ColumnMeta<TData extends RowData, TValue> {
    filterVariant?: 'text' | 'select'
  }
}

const myDelegates = [
  "0x885D7D22b5A0D6E155F260bc1Dd61dD116EC7512",
  "0xb5ebEe21D3e6A1205E9F6cE87D1b77c32089A9C0"
]

const verifiers: Verifier[] = [
  {
    "operator": "NodeOps",
    "address": "0xc2F1fF60363cD58398fB3352afE43Ca735371C9C",
    "receivedDelegations": 70,
    "uptimeAll": 100,
    "uptime7d": 100,
    "commission": 0,
    "status": "Active",
  },
  {
    "operator": "Easeflow",
    "address": "0x885D7D22b5A0D6E155F260bc1Dd61dD116EC7512",
    "receivedDelegations": 25,
    "uptimeAll": 100,
    "uptime7d": 100,
    "commission": 0,
    "status": "Inactive",
  },
  {
    "operator": "Solo Operator",
    "address": "0xb5ebEe21D3e6A1205E9F6cE87D1b77c32089A9C0",
    "receivedDelegations": 100,
    "uptimeAll": 100,
    "uptime7d": 100,
    "commission": 0,
    "status": "Active",
  }
]

const data: Verifier[] = new Array(100).fill(null).map((_, index) => verifiers[index % verifiers.length])

const VerifierTable = () => {
  const columns = useMemo<ColumnDef<Verifier, any>[]>(
    () => [
      {
        accessorKey: 'operator',
        header: 'Operator',
        filterFn: 'arrIncludesSome',
        meta: {
          filterVariant: 'select',
        },
      },
      {
        accessorKey: 'address',
        header: 'Address',
        cell: info => info.getValue(),
        meta: {
          filterVariant: 'text',
        },
      },
      {
        accessorKey: 'receivedDelegations',
        header: () => 'Received Delegations',
      },
      {
        accessorKey: 'uptimeAll',
        header: () => 'Uptime All',
      },
      {
        accessorKey: 'uptime7d',
        header: () => 'Uptime 7d',
      },
      {
        accessorKey: 'commission',
        header: () => 'Commission',
      },
      {
        accessorKey: 'status',
        header: () => 'Status',
        filterFn: 'arrIncludesSome',
        meta: {
          filterVariant: 'select',
        },
      },
      {
        accessorKey: 'action',
        header: () => '',
        cell: () => <button>Delegate</button>
      }
    ],
    []
  )

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
    globalFilterFn: 'arrIncludesSome'
  })

  const renderPageNumbers = () => {
    const { pageIndex } = table.getState().pagination;
    const pageCount = table.getPageCount();
    const pages = [];

    if (pageCount <= 5) {
      for (let i = 0; i < pageCount; i++) {
        pages.push(i);
      }
    } else {
      if (pageIndex < 3) {
        pages.push(0, 1, 2, 3, '...', pageCount - 1);
      } else if (pageIndex > pageCount - 4) {
        pages.push(0, '...', pageCount - 4, pageCount - 3, pageCount - 2, pageCount - 1);
      } else {
        pages.push(0, '...', pageIndex - 1, pageIndex, pageIndex + 1, '...', pageCount - 1);
      }
    }

    return pages.map((page, index) => (
      <button
        key={index}
        className={`border rounded p-1 ${pageIndex === page ? 'bg-gray-200' : ''}`}
        onClick={() => typeof page === 'number' && table.setPageIndex(page)}
        disabled={typeof page !== 'number'}
      >
        {typeof page === 'number' ? page + 1 : page}
      </button>
    ));
  };

  return (
    <div className="p-2">
      <div className="flex items-center gap-4">
        <button
          onClick={() => table.setGlobalFilter(null)}
        >
          All
        </button>
        <button
          onClick={() => table.setGlobalFilter(myDelegates)}
        >
          My Delegates
        </button>
      </div>
      <table>
        <thead>
          {table.getHeaderGroups().map(headerGroup => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map(header => {
                return (
                  <th key={header.id} colSpan={header.colSpan}>
                    {header.isPlaceholder ? null : (
                      <>
                        <div
                          {...{
                            className: header.column.getCanSort()
                              ? 'cursor-pointer select-none'
                              : '',
                            onClick: header.column.getToggleSortingHandler(),
                          }}
                        >
                          {flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                          {{
                            asc: <ChevronUp />,
                            desc: <ChevronDown />,
                          }[header.column.getIsSorted() as string] ?? null}
                        </div>
                        {header.column.getCanFilter() ? (
                          <div>
                            <Filter column={header.column} />
                          </div>
                        ) : null}
                      </>
                    )}
                  </th>
                )
              })}
            </tr>
          ))}
        </thead>
        <tbody>
          {table.getRowModel().rows.map(row => {
            return (
              <tr key={row.id}>
                {row.getVisibleCells().map(cell => {
                  return (
                    <td key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </td>
                  )
                })}
              </tr>
            )
          })}
        </tbody>
      </table>
      <div className="h-2" />
      <div className="flex items-center gap-2">
        <button
          className="border rounded p-1"
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
        >
          <ChevronLeft />
        </button>
        {renderPageNumbers()}
        <button
          className="border rounded p-1"
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
        >
          <ChevronRight />
        </button>
        <span className="flex items-center gap-1">
          <div>Page</div>
          <strong>
            {table.getState().pagination.pageIndex + 1} of{' '}
            {table.getPageCount()}
          </strong>
        </span>
        <span className="flex items-center gap-1">
          | Go to page:
          <input
            type="number"
            min="1"
            max={table.getPageCount()}
            defaultValue={table.getState().pagination.pageIndex + 1}
            onChange={e => {
              const page = e.target.value ? Number(e.target.value) - 1 : 0
              table.setPageIndex(page)
            }}
            className="border p-1 rounded w-16"
          />
        </span>
        <select
          value={table.getState().pagination.pageSize}
          onChange={e => {
            table.setPageSize(Number(e.target.value))
          }}
        >
          {[25, 50, 100].map(pageSize => (
            <option key={pageSize} value={pageSize}>
              Show {pageSize}
            </option>
          ))}
        </select>
      </div>
      <div>{table.getPrePaginationRowModel().rows.length} Rows</div>
      <pre>
        {JSON.stringify(
          { columnFilters: table.getState().columnFilters },
          null,
          2
        )}
      </pre>
    </div>
  )
}

export default VerifierTable;

function Filter({ column }: { column: Column<any, unknown> }) {
  const columnFilterValue = column.getFilterValue()
  const { filterVariant } = column.columnDef.meta ?? {}
  const uniqueValues = column.getFacetedUniqueValues();

  const sortedUniqueValues = useMemo(
    () => Array.from(uniqueValues.keys())
          .sort()
          .slice(0, 5000),
    [uniqueValues]
  );

  return filterVariant === 'select' ? (
    <select
      multiple
      onChange={e => {
        const selectedOptions = Array.from(e.target.selectedOptions, option => option.value);
        column.setFilterValue(selectedOptions);
      }}
      value={columnFilterValue as string[]}
    >
      <option value="">All</option>
      {sortedUniqueValues.map(value => (
        <option value={value} key={value}>
          {value}
        </option>
      ))}
    </select>
  ) : filterVariant === 'text' ? (
    <DebouncedInput
      className="w-36 border shadow rounded"
      onChange={value => column.setFilterValue(value)}
      placeholder={`Search...`}
      type="text"
      value={(columnFilterValue ?? '') as string}
    />
  ) : null
}

function DebouncedInput({
  value: initialValue,
  onChange,
  debounce = 500,
  ...props
}: {
  value: string | number
  onChange: (value: string | number) => void
  debounce?: number
} & Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange'>) {
  const [value, setValue] = useState(initialValue)

  useEffect(() => {
    setValue(initialValue)
  }, [initialValue])

  useEffect(() => {
    const timeout = setTimeout(() => {
      onChange(value)
    }, debounce)

    return () => clearTimeout(timeout)
  }, [debounce, onChange, value])

  return (
    <input {...props} value={value} onChange={e => setValue(e.target.value)} />
  )
}

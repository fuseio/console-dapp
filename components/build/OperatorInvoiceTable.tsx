import { useMemo, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Ghost } from 'lucide-react';
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  useReactTable,
  Table,
} from '@tanstack/react-table'

import { OperatorCheckoutSession, Status } from '@/lib/types';
import { useAppDispatch, useAppSelector } from '@/store/store';
import { fetchCheckoutSessions, OperatorStateType, selectOperatorSlice, withRefreshToken } from '@/store/operatorSlice';
import { Notice, renderPageNumbers, Skeleton } from '@/components/ui/Table';

type RowsProps = {
  table: Table<OperatorCheckoutSession>
  operatorSlice: OperatorStateType
}

const Rows = ({ table, operatorSlice }: RowsProps) => {
  if (table.getRowModel().rows.length) {
    return (
      table.getRowModel().rows.map(row => {
        return (
          <tr key={row.id} className='border-b border-light-gray'>
            {row.getVisibleCells().map((cell, index) => {
              return (
                <td key={cell.id} className={`px-2 py-4 ${index === 0 ? 'ps-8' : ''} ${index === row.getVisibleCells().length - 1 ? 'pe-8' : ''}`}>
                  {flexRender(
                    cell.column.columnDef.cell,
                    cell.getContext()
                  )}
                </td>
              )
            })}
          </tr>
        )
      })
    )
  }

  if (operatorSlice.checkoutSessionStatus === Status.PENDING) {
    return (
      <Skeleton
        length={3}
        span={table.getVisibleFlatColumns().length}
      />
    )
  }

  return (
    <Notice
      span={table.getVisibleFlatColumns().length}
      icon={<Ghost size={80} />}
      text="No invoices found"
    />
  )
}

const OperatorInvoiceTable = () => {
  const dispatch = useAppDispatch();
  const operatorSlice = useAppSelector(selectOperatorSlice);

  const columns = useMemo<ColumnDef<OperatorCheckoutSession, any>[]>(
    () => [
      {
        accessorKey: 'billingCycle',
        header: () => 'Billing Cycle',
      },
      {
        accessorKey: 'status',
        header: () => 'Status',
      },
      {
        accessorKey: 'paymentStatus',
        header: () => 'Payment Status',
      },
      {
        accessorKey: 'createdAt',
        header: () => 'Created',
      },
      {
        accessorKey: 'updatedAt',
        header: () => 'Until',
      },
    ],
    []
  )

  const table = useReactTable({
    data: operatorSlice.checkoutSessions,
    columns,
    initialState: {
      pagination: {
        pageSize: 25,
      },
    },
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  })

  useEffect(() => {
    dispatch(withRefreshToken(() => dispatch(fetchCheckoutSessions())));
  }, [dispatch]);

  return (
    <section className="flex flex-col gap-4">
      <div className='bg-white rounded-[1.25rem] xl:overflow-auto'>
        <div className='px-8 py-7'>
          <h3 className="text-2xl font-semibold">
            Invoices
          </h3>
        </div>
        <table className='w-full border-spacing-2'>
          <thead className='bg-transaction-bg text-sm text-text-dark-gray'>
            {table.getHeaderGroups().map(headerGroup => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header, index) => {
                  return (
                    <th
                      key={header.id}
                      colSpan={header.colSpan}
                      className={`whitespace-nowrap font-normal px-2 py-2 ${index === 0 ? 'ps-8' : ''} ${index === headerGroup.headers.length - 1 ? 'pe-8' : ''}`}
                      style={{ width: `${header.getSize() !== 150 ? `${header.getSize()}px` : 'auto'}` }}
                    >
                      {!header.isPlaceholder && (
                        <div className='flex items-center gap-2'>
                          {flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                        </div>
                      )}
                    </th>
                  )
                })}
              </tr>
            ))}
          </thead>
          <tbody>
            <Rows table={table} operatorSlice={operatorSlice} />
          </tbody>
        </table>
        <footer className="px-8 py-7 flex justify-between items-center gap-2">
          <div className="flex items-center gap-2">
            <div className="whitespace-nowrap">
              View records per page
            </div>
            <select
              value={table.getState().pagination.pageSize}
              onChange={e => {
                table.setPageSize(Number(e.target.value))
              }}
              className="border border-light-gray rounded-md text-text-dark-gray p-2"
            >
              {[25, 50, 100].map(pageSize => (
                <option key={pageSize} value={pageSize}>
                  {pageSize}
                </option>
              ))}
            </select>
          </div>
          <div className="flex items-center gap-2">
            <button
              className="border border-light-gray rounded-md text-text-dark-gray w-8 p-1 enabled:hover:bg-light-gray"
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
            >
              <ChevronLeft />
            </button>
            {renderPageNumbers(table)}
            <button
              className="border border-light-gray rounded-md text-text-dark-gray w-8 p-1 enabled:hover:bg-light-gray"
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
            >
              <ChevronRight />
            </button>
          </div>
          <div className="w-60 md:hidden"></div>
        </footer>
      </div>
    </section>
  )
}

export default OperatorInvoiceTable;

import { RowData, Table } from "@tanstack/react-table";

type SkeletonProps = {
  length: number
  span: number
}

type NoticeProps = {
  span: number
  icon: React.ReactNode
  text: string
}

export const renderPageNumbers = <T extends RowData>(table: Table<T>) => {
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
      className={`border border-light-gray rounded-md text-text-dark-gray p-1 w-8 ${pageIndex === page ? 'bg-success-light' : 'hover:bg-light-gray'}`}
      onClick={() => typeof page === 'number' && table.setPageIndex(page)}
      disabled={typeof page !== 'number'}
    >
      {typeof page === 'number' ? page + 1 : page}
    </button>
  ));
};

export const Skeleton = ({ length, span }: SkeletonProps) => {
  return (
    Array.from({ length }).map((_, index) => (
      <tr key={index} className='border-b border-light-gray'>
        <td colSpan={span} className='animate-pulse bg-fuse-black/10 h-[67px]'></td>
      </tr>
    ))
  )
}

export const Notice = ({ span, icon, text }: NoticeProps) => {
  return (
    <tr>
      <td colSpan={span} className='px-2 py-36'>
        <div className='flex flex-col items-center gap-2'>
          <div>
            {icon}
          </div>
          <div>
            {text}
          </div>
        </div>
      </td>
    </tr>
  )
}

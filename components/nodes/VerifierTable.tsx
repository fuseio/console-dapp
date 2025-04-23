import {useState, useMemo, useCallback, useEffect} from "react";
import Image, {StaticImageData} from "next/image";
import {
  ChevronUp,
  ChevronDown,
  Filter as FilterIcon,
  Info,
  Ghost,
  WalletMinimal,
  ChevronLeft,
  ChevronRight,
  Search,
} from "lucide-react";
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
  Table,
} from "@tanstack/react-table";
import {useAccount} from "wagmi";

import {Node, Status} from "@/lib/types";
import {eclipseAddress, getUserNodes} from "@/lib/helpers";
import {useAppDispatch, useAppSelector} from "@/store/store";
import {
  fetchNodes,
  NodesStateType,
  selectNodesSlice,
  setDelegateLicenseModal,
  setIsNoCapacityModalOpen,
  setIsNoLicenseModalOpen,
  setRevokeLicenseModal,
  fetchDelegationsFromContract,
} from "@/store/nodesSlice";
import {Notice, renderPageNumbers, Skeleton} from "@/components/ui/Table";

import nodeops from "@/assets/nodeops.svg";
import fuseIcon from "@/assets/fuse-icon.svg";
import dappnode from "@/assets/dappnode.png";
import {useOutsideClick} from "@/lib/hooks/useOutsideClick";

declare module "@tanstack/react-table" {
  // see: https://github.com/TanStack/table/discussions/5222
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  interface ColumnMeta<TData extends RowData, TValue> {
    filterVariant?: "text" | "select";
    tooltip?: string;
    disableFiltering?: boolean;
  }
}

type FilterProps = {
  column: Column<any, unknown>;
  setFilterOpen: (value: string) => void;
};

type RowsProps = {
  table: Table<Node>;
  nodesSlice: NodesStateType;
  isMyDelegatesTab: boolean;
};

type Verifier = {
  name: string;
  image: StaticImageData;
};

const verifiers: Record<string, Verifier> = {
  nodeops: {
    name: "NodeOps",
    image: nodeops,
  },
  fuse_official_operator: {
    name: "Fuse Node",
    image: fuseIcon,
  },
  dappnode_operator: {
    name: "DappNode",
    image: dappnode,
  },
};

const defaultVerifier = "nodeops";

const Rows = ({table, nodesSlice, isMyDelegatesTab}: RowsProps) => {
  const {address} = useAccount();

  if (table.getRowModel().rows.length) {
    return table.getRowModel().rows.map((row) => {
      return (
        <tr key={row.id} className="border-b border-light-gray">
          {row.getVisibleCells().map((cell, index) => {
            return (
              <td
                key={cell.id}
                className={`px-2 py-4 ${index === 0 ? "ps-8" : ""} ${
                  index === row.getVisibleCells().length - 1 ? "pe-8" : ""
                }`}
              >
                {flexRender(cell.column.columnDef.cell, cell.getContext())}
              </td>
            );
          })}
        </tr>
      );
    });
  }

  if (isMyDelegatesTab) {
    if (nodesSlice.fetchDelegationsFromContractStatus === Status.PENDING) {
      return (
        <Skeleton length={3} span={table.getVisibleFlatColumns().length} />
      );
    } else {
      return (
        <Notice
          span={table.getVisibleFlatColumns().length}
          icon={address ? <Ghost size={80} /> : <WalletMinimal size={80} />}
          text={
            address
              ? "No delegated licenses found"
              : "Connect wallet to view delegated licenses"
          }
        />
      );
    }
  }

  if (nodesSlice.fetchNodesStatus === Status.PENDING) {
    return <Skeleton length={3} span={table.getVisibleFlatColumns().length} />;
  }

  return (
    <Notice
      span={table.getVisibleFlatColumns().length}
      icon={<Ghost size={80} />}
      text={"No data"}
    />
  );
};

const VerifierTable = () => {
  const [filterOpen, setFilterOpen] = useState("");
  const [isMyDelegatesTab, setIsMyDelegatesTab] = useState(false);
  const [hasFetchedDelegations, setHasFetchedDelegations] = useState(false);
  const dispatch = useAppDispatch();
  const nodesSlice = useAppSelector(selectNodesSlice);
  const {address} = useAccount();
  const userNodes = getUserNodes(nodesSlice.user);

  // Add a memoized node address map for fast lookups
  const nodesAddressMap = useMemo(() => {
    const map = new Map();
    nodesSlice.nodes.forEach((node) => {
      map.set(node.Address.toLowerCase(), node);
    });
    return map;
  }, [nodesSlice.nodes]);

  const filteredData = useMemo(() => {
    if (!isMyDelegatesTab) {
      return nodesSlice.nodes;
    }

    if (nodesSlice.user.delegations.length === 0) {
      return [];
    }

    // Use the memoized address map for O(1) lookups instead of O(n) find operations
    return nodesSlice.user.delegations.map((delegation) => {
      const nodeData = nodesAddressMap.get(delegation.Address.toLowerCase());

      return {
        ...delegation,
        ...(nodeData || {}),
        NFTAmount: delegation.NFTAmount || 0,
        AllUptimePercentage: nodeData?.AllUptimePercentage || 0,
        WeeklyUptimePercentage: nodeData?.WeeklyUptimePercentage || 0,
        CommissionRate: nodeData?.CommissionRate || 0,
        Status: nodeData?.Status || "Unknown",
      };
    });
  }, [isMyDelegatesTab, nodesAddressMap, nodesSlice.user.delegations]);

  const columns = useMemo<ColumnDef<Node, any>[]>(
    () => [
      {
        accessorKey: "OperatorName",
        header: "Operator",
        size: 200,
        cell: (info) => (
          <div className="flex items-center gap-2 w-max">
            <Image
              src={
                verifiers[info.getValue()]
                  ? verifiers[info.getValue()].image
                  : verifiers[defaultVerifier].image
              }
              alt={
                verifiers[info.getValue()]
                  ? verifiers[info.getValue()].name
                  : verifiers[defaultVerifier].name
              }
              width={24}
              height={24}
            />
            {verifiers[info.getValue()]
              ? verifiers[info.getValue()].name
              : verifiers[defaultVerifier].name}
          </div>
        ),
        enableColumnFilter: false,
        enableGlobalFilter: false,
        enableSorting: false,
      },
      {
        accessorKey: "Address",
        header: "Address",
        size: 160,
        cell: (info) => eclipseAddress(info.getValue()),
        enableSorting: false,
        meta: {
          filterVariant: "text",
        },
      },
      {
        accessorKey: "NFTAmount",
        header: () => "Received Delegations",
        cell: (info) => <div>{info.getValue()}</div>,
        enableColumnFilter: false,
        enableGlobalFilter: false,
      },
      {
        accessorKey: "AllUptimePercentage",
        header: () => "Uptime (All)",
        cell: (info) => <div>{info.getValue().toFixed(2)}%</div>,
        enableColumnFilter: false,
        enableGlobalFilter: false,
        meta: {
          tooltip:
            "The percentage of days your node has met the minimum uptime requirement since it began operating.",
        },
      },
      {
        accessorKey: "WeeklyUptimePercentage",
        header: () => "Uptime (7d)",
        cell: (info) => <div>{info.getValue().toFixed(2)}%</div>,
        enableColumnFilter: false,
        enableGlobalFilter: false,
        meta: {
          tooltip:
            "The percentage of days your node has met the minimum uptime requirement in the past 7 days.",
        },
      },
      {
        accessorKey: "CommissionRate",
        header: () => "Commission",
        cell: (info) => <div>{info.getValue().toFixed(2)}%</div>,
        enableColumnFilter: false,
        enableGlobalFilter: false,
        meta: {
          tooltip:
            "The percentage of FUSE rewards that you will receive from those who delegate to your verifier address.",
        },
      },
      {
        accessorKey: "Status",
        header: () => "Status",
        filterFn: "arrIncludesSome",
        cell: (info) => (
          <div
            className={`p-2 rounded-full text-center leading-none font-semibold w-24 ${
              info.getValue() === "Active" ? "bg-success" : "bg-light-gray"
            }`}
          >
            {info.getValue()}
          </div>
        ),
        enableGlobalFilter: false,
        enableSorting: false,
        meta: {
          filterVariant: "select",
        },
      },
      {
        accessorKey: "action",
        header: () => "",
        cell: (info) => {
          if (isMyDelegatesTab) {
            return (
              <button
                onClick={() =>
                  dispatch(
                    setRevokeLicenseModal({
                      open: true,
                      address: info.row.original.Address,
                    })
                  )
                }
                className="px-3 py-2 border border-black bg-white text-black rounded-full leading-none font-semibold hover:bg-red-50 hover:text-red-700 hover:border-red-700"
              >
                Revoke
              </button>
            );
          }

          return (
            <button
              onClick={() => {
                if (info.row.original.NFTAmount === 100) {
                  dispatch(setIsNoCapacityModalOpen(true));
                } else if (!userNodes.canDelegate) {
                  dispatch(setIsNoLicenseModalOpen(true));
                } else {
                  dispatch(
                    setDelegateLicenseModal({
                      open: true,
                      address: info.row.original.Address,
                    })
                  );
                }
              }}
              className={`px-3 py-2 border border-black rounded-full leading-none font-semibold enabled:hover:bg-black enabled:hover:text-white disabled:bg-light-gray disabled:border-light-gray disabled:opacity-50`}
              disabled={info.row.original.Status === "Offline"}
            >
              Delegate
            </button>
          );
        },
        enableColumnFilter: false,
        enableGlobalFilter: false,
        enableSorting: false,
      },
    ],
    [dispatch, userNodes.canDelegate, isMyDelegatesTab]
  );

  const table = useReactTable({
    data: filteredData,
    columns,
    globalFilterFn: "arrIncludesSome",
    debugTable: false, // Turn off debug mode for performance
    initialState: {
      pagination: {
        pageSize: 25,
      },
    },
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
  });

  const showAllNodes = useCallback(() => {
    setIsMyDelegatesTab(false);
  }, []);

  const showMyDelegates = useCallback(() => {
    setIsMyDelegatesTab(true);

    // Only fetch if they haven't been fetched already and the fetch isn't currently in progress
    if (
      address &&
      !hasFetchedDelegations &&
      nodesSlice.fetchDelegationsFromContractStatus !== Status.PENDING
    ) {
      dispatch(
        fetchDelegationsFromContract({
          address,
          useNewContract: false,
        })
      );
      setHasFetchedDelegations(true);
    }
  }, [
    address,
    dispatch,
    hasFetchedDelegations,
    nodesSlice.fetchDelegationsFromContractStatus,
  ]);

  // Single fetch with wallet address if available
  useEffect(() => {
    const fetchData = async () => {
      try {
        if (nodesSlice.fetchNodesStatus === Status.IDLE) {
          console.log(
            "Fetching nodes with address:",
            address || "not connected"
          );

          // Pass user address directly in the payload
          await dispatch(
            fetchNodes({
              userAddress: address || undefined,
            })
          );
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [dispatch, address, nodesSlice.fetchNodesStatus]);

  // Reset the delegation fetch flag if the user's address changes
  useEffect(() => {
    if (address) {
      setHasFetchedDelegations(false);
    }
  }, [address]);

  // Listen for revokeLicenseModal changes to refresh delegations after revocation
  useEffect(() => {
    // When the modal closes and we were on the My Delegations tab, refresh the delegations
    const modalJustClosed =
      !nodesSlice.revokeLicenseModal.open && isMyDelegatesTab && address;

    if (modalJustClosed) {
      console.log("Revoke modal just closed, refreshing delegations");

      // Reset fetch flag to trigger a refresh
      setHasFetchedDelegations(false);

      // Direct fetch to ensure we get the latest data
      dispatch(
        fetchDelegationsFromContract({
          address,
          useNewContract: false,
        })
      );
    }
  }, [nodesSlice.revokeLicenseModal.open, isMyDelegatesTab, address, dispatch]);

  // Listen for delegateLicenseModal changes to refresh delegations after delegation
  useEffect(() => {
    // When the modal closes and we were on the My Delegations tab, refresh the delegations
    const modalJustClosed =
      !nodesSlice.delegateLicenseModal.open && isMyDelegatesTab && address;

    if (modalJustClosed) {
      console.log("Delegate modal just closed, refreshing delegations");

      // Reset fetch flag to trigger a refresh
      setHasFetchedDelegations(false);

      // Direct fetch to ensure we get the latest data
      dispatch(
        fetchDelegationsFromContract({
          address,
          useNewContract: false,
        })
      );
    }
  }, [
    nodesSlice.delegateLicenseModal.open,
    isMyDelegatesTab,
    address,
    dispatch,
  ]);

  return (
    <section className="flex flex-col gap-4">
      <header className="flex justify-end items-center gap-3">
        <div>Delegators</div>
        <div>
          <button
            onClick={showAllNodes}
            className={`
                transition-all ease-in-out 
                ${
                  !isMyDelegatesTab
                    ? "bg-success-light text-success-dark"
                    : "bg-white hover:opacity-70"
                }
                text-sm font-semibold rounded-s-full px-7 py-3
              `}
          >
            All
          </button>
          <button
            onClick={showMyDelegates}
            className={`
                transition-all ease-in-out 
                ${
                  isMyDelegatesTab
                    ? "bg-success-light text-success-dark"
                    : "bg-white hover:opacity-70"
                }
                text-sm font-semibold rounded-e-full px-7 py-3
              `}
          >
            My Delegations
          </button>
        </div>
      </header>
      <div className="bg-white rounded-[1.25rem] xl:overflow-auto">
        <div className="px-8 py-7">
          Total of {table.getPrePaginationRowModel().rows.length} nodes.
        </div>
        <table className="w-full border-spacing-2">
          <thead className="bg-transaction-bg text-sm text-text-dark-gray">
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header, index) => {
                  return (
                    <th
                      key={header.id}
                      colSpan={header.colSpan}
                      className={`whitespace-nowrap font-normal px-2 py-2 ${
                        index === 0 ? "ps-8" : ""
                      } ${
                        index === headerGroup.headers.length - 1 ? "pe-8" : ""
                      }`}
                      style={{
                        width: `${
                          header.getSize() !== 150
                            ? `${header.getSize()}px`
                            : "auto"
                        }`,
                      }}
                    >
                      {!header.isPlaceholder && (
                        <div className="flex items-center gap-2">
                          {flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                          {header.column.columnDef.meta?.tooltip && (
                            <div className="group relative hover:text-black">
                              <Info size={12} />
                              <div className="tooltip-text-up hidden top-[200%] left-1/2 -translate-x-1/2 absolute bg-white p-4 rounded-2xl w-[400px] text-sm whitespace-normal shadow-xl group-hover:block">
                                {header.column.columnDef.meta.tooltip}
                              </div>
                            </div>
                          )}
                          {header.column.getCanSort() && (
                            <div className="flex flex-col items-center">
                              <button
                                onClick={() =>
                                  header.column.toggleSorting(false)
                                }
                                disabled={header.column.getIsSorted() === "asc"}
                                className={`${
                                  header.column.getIsSorted() === "asc"
                                    ? "text-fuse-green"
                                    : ""
                                }`}
                              >
                                <ChevronUp size={10} strokeWidth={3} />
                              </button>
                              <button
                                onClick={() =>
                                  header.column.toggleSorting(true)
                                }
                                disabled={
                                  header.column.getIsSorted() === "desc"
                                }
                                className={`${
                                  header.column.getIsSorted() === "desc"
                                    ? "text-fuse-green"
                                    : ""
                                }`}
                              >
                                <ChevronDown size={10} strokeWidth={3} />
                              </button>
                            </div>
                          )}
                          {header.column.getCanFilter() ? (
                            <div className="relative flex items-center">
                              <button
                                onClick={() => setFilterOpen(header.id)}
                                className={`${
                                  filterOpen === header.id ? "text-black" : ""
                                } hover:text-black`}
                              >
                                <FilterIcon size={12} />
                              </button>
                              {filterOpen === header.id && (
                                <div className="absolute top-full left-0 text-base">
                                  <Filter
                                    column={header.column}
                                    setFilterOpen={setFilterOpen}
                                  />
                                </div>
                              )}
                            </div>
                          ) : null}
                        </div>
                      )}
                    </th>
                  );
                })}
              </tr>
            ))}
          </thead>
          <tbody>
            <Rows
              table={table}
              nodesSlice={nodesSlice}
              isMyDelegatesTab={isMyDelegatesTab}
            />
          </tbody>
        </table>
        <footer className="px-8 py-7 flex justify-between items-center gap-2">
          <div className="flex items-center gap-2">
            <div className="whitespace-nowrap">View records per page</div>
            <select
              value={table.getState().pagination.pageSize}
              onChange={(e) => {
                table.setPageSize(Number(e.target.value));
              }}
              className="border border-light-gray rounded-md text-text-dark-gray p-2"
            >
              {[25, 50, 100].map((pageSize) => (
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
  );
};

function Filter({column, setFilterOpen}: FilterProps) {
  const {filterVariant} = column.columnDef.meta ?? {};
  const uniqueValues = column.getFacetedUniqueValues();
  const columnFilterValue = column.getFilterValue();
  const filterRef = useOutsideClick<any>(() => setFilterOpen(""));

  const sortedUniqueValues = useMemo(
    () => Array.from(uniqueValues.keys()).sort(),
    [uniqueValues]
  );

  const handleFilter = useCallback(
    (value: string | number) => {
      column.setFilterValue(value);
    },
    [column]
  );

  return filterVariant === "select" ? (
    <div
      ref={filterRef}
      className="flex flex-col bg-white w-max shadow-xl rounded-xl"
    >
      <label className="flex items-center gap-2 px-4 py-2 rounded-md hover:bg-light-gray">
        <input
          type="checkbox"
          checked={
            !columnFilterValue || (columnFilterValue as string[]).length === 0
          }
          onChange={(e) => {
            column.setFilterValue(e.target.checked ? [] : null);
          }}
        />
        All
      </label>
      {sortedUniqueValues.map((value) => (
        <label
          key={value}
          className="flex items-center gap-2 px-4 py-2 rounded-md hover:bg-light-gray"
        >
          <input
            type="checkbox"
            checked={(columnFilterValue as string[])?.includes(value)}
            onChange={(e) => {
              const currentValues = (columnFilterValue as string[]) || [];
              if (e.target.checked) {
                column.setFilterValue([...currentValues, value]);
              } else {
                column.setFilterValue(currentValues.filter((v) => v !== value));
              }
            }}
          />
          {value}
        </label>
      ))}
    </div>
  ) : filterVariant === "text" ? (
    <div
      ref={filterRef}
      className="flex flex-col bg-white w-max shadow-xl rounded-xl"
    >
      <div className="flex items-center gap-2 p-2">
        <Search size={16} />
        <DebouncedInput
          type="text"
          value={(columnFilterValue ?? "") as string}
          onChange={handleFilter}
          placeholder="Search..."
          className="w-full bg-[transparent] focus:outline-none"
        />
      </div>
      <div className="flex flex-col">
        {sortedUniqueValues
          .filter((value) =>
            value
              .toString()
              .toLowerCase()
              .includes((columnFilterValue ?? "").toString().toLowerCase())
          )
          .map((value: any) => (
            <button
              key={value}
              onClick={() => handleFilter(value)}
              className="p-2 rounded-md text-start hover:bg-light-gray"
            >
              {value}
            </button>
          ))}
      </div>
    </div>
  ) : null;
}
function DebouncedInput({
  value: initialValue,
  onChange,
  debounce = 500,
  ...props
}: {
  value: string | number;
  onChange: (value: string | number) => void;
  debounce?: number;
} & Omit<React.InputHTMLAttributes<HTMLInputElement>, "onChange">) {
  const [value, setValue] = useState(initialValue);

  useEffect(() => {
    setValue(initialValue);
  }, [initialValue]);

  useEffect(() => {
    const timeout = setTimeout(() => {
      onChange(value);
    }, debounce);

    return () => clearTimeout(timeout);
  }, [debounce, onChange, value]);

  return (
    <input
      {...props}
      value={value}
      onChange={(e) => setValue(e.target.value)}
    />
  );
}

export default VerifierTable;

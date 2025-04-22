import {useState, useMemo, useCallback, useEffect} from "react";
import Image, {StaticImageData} from "next/image";
import {
  ChevronUp,
  ChevronDown,
  Filter as FilterIcon,
  Info,
  Ghost,
  WalletMinimal,
  ChevronsLeft,
  ChevronLeft as ChevronLeftIcon,
  ChevronRight as ChevronRightIcon,
  ChevronsRight,
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
import {useOutsideClick} from "@/lib/hooks/useOutsideClick";
import {eclipseAddress, getUserNodes} from "@/lib/helpers";
import {useAppDispatch, useAppSelector} from "@/store/store";
import {
  fetchDelegations,
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
  closeFilter: (value: string) => void;
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
  const dispatch = useAppDispatch();
  const nodesSlice = useAppSelector(selectNodesSlice);
  const {address} = useAccount();
  const userNodes = getUserNodes(nodesSlice.user);

  // Filter data based on the selected tab
  const filteredData = useMemo(() => {
    if (!isMyDelegatesTab) {
      return nodesSlice.nodes;
    }

    // For "My Delegated Licenses" tab, we need to properly merge delegation data
    // with the complete node data to show accurate information
    if (nodesSlice.user.delegations.length === 0) {
      return [];
    }

    return nodesSlice.user.delegations.map((delegation) => {
      // Find the corresponding node data from the nodes array
      // Use lowercase comparison to avoid case sensitivity issues
      const nodeData = nodesSlice.nodes.find(
        (node) =>
          node.Address.toLowerCase() === delegation.Address.toLowerCase()
      );

      if (!nodeData) {
        console.warn(
          `No matching node found for delegation address: ${delegation.Address}`
        );
      }

      // Create a complete record by combining delegation and node data
      return {
        ...delegation, // Keep all delegation fields
        ...(nodeData || {}), // Override with node data where available

        // Ensure critical fields are explicitly copied, defaulting to reasonable values if not found
        NFTAmount: delegation.NFTAmount || 0,
        AllUptimePercentage: nodeData?.AllUptimePercentage || 0,
        WeeklyUptimePercentage: nodeData?.WeeklyUptimePercentage || 0,
        CommissionRate: nodeData?.CommissionRate || 0,
        Status: nodeData?.Status || "Unknown",
      };
    });
  }, [isMyDelegatesTab, nodesSlice.nodes, nodesSlice.user.delegations]);

  // For debugging: Log the merged data when in "My Delegated Licenses" tab
  useEffect(() => {
    if (isMyDelegatesTab && filteredData.length > 0) {
      console.log("Delegated nodes with merged data:", filteredData);
    }
  }, [isMyDelegatesTab, filteredData]);

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
    debugTable: true,
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

  // Switch to the "All" tab
  const showAllNodes = useCallback(() => {
    setIsMyDelegatesTab(false);
  }, []);

  // Switch to "My Delegated Licenses" tab
  const showMyDelegates = useCallback(() => {
    setIsMyDelegatesTab(true);

    // Use contract as source of truth for delegations
    if (address) {
      // Pass the address as an object parameter
      dispatch(
        fetchDelegationsFromContract({
          address,
          useNewContract: false,
        })
      );
    }
  }, [address, dispatch]);

  // Load both nodes and delegations when component mounts
  useEffect(() => {
    dispatch(fetchNodes());

    if (address && isMyDelegatesTab) {
      // Use contract as source of truth for delegations
      dispatch(
        fetchDelegationsFromContract({
          address,
          useNewContract: false,
        })
      );
    }
  }, [dispatch, address, isMyDelegatesTab]);

  // Load delegations again when switching to My Delegated Licenses tab
  useEffect(() => {
    if (isMyDelegatesTab && address) {
      // Use contract as source of truth for delegations
      dispatch(
        fetchDelegationsFromContract({
          address,
          useNewContract: false,
        })
      );
    }
  }, [isMyDelegatesTab, dispatch, address]);

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-bold text-fuse-black">
          {isMyDelegatesTab ? "My Delegated Licenses" : "All Nodes"}
        </h3>
      </div>
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
              My Delegated Licenses
            </button>
          </div>
        </header>

        <div className="rounded-lg overflow-hidden shadow">
          <table className="min-w-full bg-white">
            <thead>
              <tr className="border-b border-light-gray">
                {table.getHeaderGroups().map((headerGroup) => (
                  <>
                    {headerGroup.headers.map((header, index) => (
                      <th
                        key={header.id}
                        className={`px-2 py-4 bg-gray-50 font-medium text-base ${
                          index === 0 ? "ps-8" : ""
                        } ${
                          index === headerGroup.headers.length - 1 ? "pe-8" : ""
                        }`}
                      >
                        <div
                          className={`flex gap-1 items-center select-none ${
                            header.column.getCanSort() ? "cursor-pointer" : ""
                          }`}
                          onClick={header.column.getToggleSortingHandler()}
                        >
                          <div>
                            {flexRender(
                              header.column.columnDef.header,
                              header.getContext()
                            )}
                          </div>
                          {header.column.getCanSort() && (
                            <div className="flex flex-col text-light-gray">
                              <ChevronUp
                                size={16}
                                className={`-mb-1 ${
                                  header.column.getIsSorted() === "asc"
                                    ? "text-black"
                                    : ""
                                }`}
                              />
                              <ChevronDown
                                size={16}
                                className={`-mt-1 ${
                                  header.column.getIsSorted() === "desc"
                                    ? "text-black"
                                    : ""
                                }`}
                              />
                            </div>
                          )}
                          {header.column.columnDef?.meta?.tooltip && (
                            <div className="cursor-help">
                              <Info size={16} className="text-light-gray" />
                            </div>
                          )}
                          {header.column.getCanFilter() &&
                            !header.column.columnDef?.meta
                              ?.disableFiltering && (
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  filterOpen === header.id
                                    ? setFilterOpen("")
                                    : setFilterOpen(header.id);
                                }}
                                className={`${
                                  header.column.getIsFiltered()
                                    ? "bg-success text-white"
                                    : "hover:bg-gray-100"
                                } rounded-full w-5 h-5 flex items-center justify-center`}
                              >
                                <FilterIcon size={12} />
                              </button>
                            )}
                        </div>
                      </th>
                    ))}
                  </>
                ))}
              </tr>
            </thead>
            <tbody>
              <Rows
                table={table}
                nodesSlice={nodesSlice}
                isMyDelegatesTab={isMyDelegatesTab}
              />
            </tbody>
          </table>
        </div>

        <div className="flex justify-between items-center flex-wrap">
          <div className="flex gap-4 items-center py-2">
            <div>
              <b>
                {table.getFilteredRowModel().rows.length} of{" "}
                {table.getPreFilteredRowModel().rows.length}
              </b>{" "}
              rows
            </div>
            <label className="flex gap-1 items-center">
              <span>Page Size:</span>
              <select
                className="border-0 border-b border-black py-1 bg-transparent w-12"
                value={table.getState().pagination.pageSize}
                onChange={(e) => {
                  table.setPageSize(Number(e.target.value));
                }}
              >
                {[25, 50, 100].map((pageSize) => (
                  <option key={pageSize} value={pageSize}>
                    {pageSize}
                  </option>
                ))}
              </select>
            </label>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => table.setPageIndex(0)}
              disabled={!table.getCanPreviousPage()}
              className="flex items-center justify-center p-2 hover:bg-light-gray rounded-full disabled:text-gray-300 disabled:hover:bg-white"
            >
              <ChevronsLeft size={16} />
            </button>
            <button
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
              className="flex items-center justify-center p-2 hover:bg-light-gray rounded-full disabled:text-gray-300 disabled:hover:bg-white"
            >
              <ChevronLeftIcon size={16} />
            </button>
            <div className="flex gap-1">{renderPageNumbers(table)}</div>
            <button
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
              className="flex items-center justify-center p-2 hover:bg-light-gray rounded-full disabled:text-gray-300 disabled:hover:bg-white"
            >
              <ChevronRightIcon size={16} />
            </button>
            <button
              onClick={() => table.setPageIndex(table.getPageCount() - 1)}
              disabled={!table.getCanNextPage()}
              className="flex items-center justify-center p-2 hover:bg-light-gray rounded-full disabled:text-gray-300 disabled:hover:bg-white"
            >
              <ChevronsRight size={16} />
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default VerifierTable;

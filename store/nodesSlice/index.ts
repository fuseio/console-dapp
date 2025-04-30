import { PayloadAction, createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { AppState } from "../rootReducer";
import { NodesUser, Status, Node, DelegateLicenseModal } from "@/lib/types";
import { delegateNodeLicense, getNodeLicenseBalances, getNewNodeLicenseBalances, getDelegationsFromContract, delegateNewNodeLicense as delegateNewNodeLicenseApi } from "@/lib/contractInteract";
import { Address } from "viem";
import { fetchNodesClients, fetchUserDelegations, fetchUserPoints } from "@/lib/api";
import { CONFIG } from "@/lib/config";

const initUser: NodesUser = {
  licences: [],
  newLicences: [],
  delegations: [],
  newDelegations: [],
}

const initDelegateLicenseModal: DelegateLicenseModal = {
  open: false,
  address: undefined,
}

export interface NodesStateType {
  isNodeInstallModalOpen: boolean;
  isNoLicenseModalOpen: boolean;
  isNoCapacityModalOpen: boolean;
  delegateLicenseModal: DelegateLicenseModal;
  delegateLicenseStatus: Status;
  user: NodesUser;
  fetchNodeLicenseBalancesStatus: Status;
  fetchNewNodeLicenseBalancesStatus: Status;
  fetchNodesStatus: Status;
  nodes: Node[];
  fetchDelegationsStatus: Status;
  fetchDelegationsFromContractStatus: Status;
  fetchNewDelegationsFromContractStatus: Status;
  revokeLicenseModal: DelegateLicenseModal;
  redelegationModal: DelegateLicenseModal;
  preventRedelegationModalReopening: boolean;
  testnetPoints: number | null;
  testnetPointsLoading: boolean;
}

const INIT_STATE: NodesStateType = {
  isNodeInstallModalOpen: false,
  isNoLicenseModalOpen: false,
  isNoCapacityModalOpen: false,
  delegateLicenseModal: initDelegateLicenseModal,
  delegateLicenseStatus: Status.IDLE,
  user: initUser,
  fetchNodeLicenseBalancesStatus: Status.IDLE,
  fetchNewNodeLicenseBalancesStatus: Status.IDLE,
  fetchNodesStatus: Status.IDLE,
  nodes: [],
  fetchDelegationsStatus: Status.IDLE,
  fetchDelegationsFromContractStatus: Status.IDLE,
  fetchNewDelegationsFromContractStatus: Status.IDLE,
  revokeLicenseModal: initDelegateLicenseModal,
  redelegationModal: initDelegateLicenseModal,
  preventRedelegationModalReopening: false,
  testnetPoints: null,
  testnetPointsLoading: false,
};

export const delegateLicense = createAsyncThunk(
  "NODES/DELEGATE_LICENSE",
  async ({
    to,
    tokenId,
    amount,
    userAddress
  }: {
    to: Address,
    tokenId: number,
    amount: number,
    userAddress?: Address
  }, { dispatch }) => {
    try {
      await delegateNodeLicense(to, tokenId, amount);

      if (amount === 0 && userAddress) {
        await dispatch(fetchDelegationsFromContract({
          address: userAddress,
          useNewContract: false
        }));
      } else {
        await dispatch(fetchDelegationsFromContract({
          address: to,
          useNewContract: false
        }));
      }
    } catch (error) {
      console.log(error);
      throw error;
    }
  }
);

export const delegateNewNodeLicense = createAsyncThunk(
  "NODES/DELEGATE_NEW_NODE_LICENSE",
  async ({
    to,
    tokenId,
    amount
  }: {
    to: Address,
    tokenId: number,
    amount: number
  }, { dispatch }) => {
    try {
      await delegateNewNodeLicenseApi(to, tokenId, amount);

      await dispatch(fetchDelegationsFromContract({
        address: to,
        useNewContract: true
      }));

      return { success: true };
    } catch (error) {
      console.error("Error delegating new node license:", error);
      throw error;
    }
  }
);

export const fetchNodeLicenseBalances = createAsyncThunk(
  "NODES/FETCH_NODE_LICENSE_BALANCES",
  async ({
    accounts,
    tokenIds,
  }: {
    accounts: Address[],
    tokenIds: number[],
  }) => {
    try {
      const ids = tokenIds.map((id) => BigInt(id));
      const balances = await getNodeLicenseBalances(accounts, ids);
      return balances.map((balance, index) => ({
        tokenId: tokenIds[index] + 1,
        balance: Number(balance),
      }));
    } catch (error) {
      console.log(error);
      throw error;
    }
  }
);

export const fetchNewNodeLicenseBalances = createAsyncThunk(
  "NODES/FETCH_NEW_NODE_LICENSE_BALANCES",
  async ({
    accounts,
    tokenIds,
  }: {
    accounts: Address[],
    tokenIds: number[],
  }) => {
    try {
      const ids = tokenIds.map((id) => BigInt(id));
      const balances = await getNewNodeLicenseBalances(accounts, ids);
      return balances.map((balance, index) => ({
        tokenId: tokenIds[index] + 1,
        balance: Number(balance),
        isNew: true,
      }));
    } catch (error) {
      console.log(error);
      throw error;
    }
  }
);

export const fetchNodes = createAsyncThunk(
  "NODES/FETCH_NODES",
  async (payload: { userAddress?: string } = {}, { dispatch }) => {
    try {
      const nodes = await fetchNodesClients();

      const { userAddress } = payload;

      if (userAddress) {
        await dispatch(
          fetchDelegationsFromContract({
            address: userAddress as `0x${string}`,
            useNewContract: false,
          })
        );
      } else {
        console.log("No user address available, skipping delegations fetch");
      }

      return nodes.data ?? [];
    } catch (error) {
      console.log(error);
      throw error;
    }
  }
);

export const fetchDelegations = createAsyncThunk(
  "NODES/FETCH_DELEGATIONS",
  async (address: Address) => {
    try {
      const delegations = await fetchUserDelegations(address);
      if (!delegations.clients?.length) {
        return [];
      }
      return delegations.clients.map((client: { client: any; }) => ({ ...client.client }));
    } catch (error) {
      console.log(error);
      throw error;
    }
  }
);

export const fetchTestnetPoints = createAsyncThunk(
  'NODES/FETCH_TESTNET_REWARDS',
  async (address: Address) => {
    try {
      const response = await fetchUserPoints(address);
      return {
        total_points: response.total_points || 0
      };
    } catch (error) {
      console.log(error);
      throw error;
    }
  }
);

export const fetchDelegationsFromContract = createAsyncThunk(
  "NODES/FETCH_DELEGATIONS_FROM_CONTRACT",
  async (params: { address: Address, useNewContract: boolean }, { getState }) => {
    try {
      const address = params.address;
      const useNewContract = params.useNewContract;

      const state = getState() as any;
      const currentNodes = state.nodes?.nodes || [];

      const nodesMap = new Map();
      currentNodes.forEach((node: Node) => {
        nodesMap.set(node.Address.toLowerCase(), node);
      });

      const delegationsData = await getDelegationsFromContract(address, useNewContract);

      if (!delegationsData.length) {
        return [];
      }

      let nodes = currentNodes;
      if (nodes.length === 0) {
        const nodeData = await fetchNodesClients();
        nodes = nodeData.data || [];

        nodes.forEach((node: Node) => {
          nodesMap.set(node.Address.toLowerCase(), node);
        });
      }

      const nodeLicenseContract = CONFIG.nodeLicenseAddress.toLowerCase();

      const enhancedDelegations = delegationsData
        .filter(delegation =>
          delegation.contract_.toLowerCase() === nodeLicenseContract &&
          delegation.amount > 0
        )
        .map(delegation => {
          const nodeAddress = delegation.to.toLowerCase();
          const nodeInfo = nodesMap.get(nodeAddress);

          return {
            Address: delegation.to,
            NFTAmount: delegation.amount,
            NFTTokenID: delegation.tokenId,
            OperatorName: nodeInfo?.OperatorName || "Node Operator",
            TotalTime: nodeInfo?.TotalTime || 0,
            LastHeartbeat: nodeInfo?.LastHeartbeat || new Date(),
            CreatedAt: nodeInfo?.CreatedAt || new Date(),
            CommissionRate: nodeInfo?.CommissionRate || 0,
            Status: nodeInfo?.Status || "Active",
            AllUptimePercentage: nodeInfo?.AllUptimePercentage || 0,
            WeeklyUptimePercentage: nodeInfo?.WeeklyUptimePercentage || 0,
          } as Node;
        });

      return enhancedDelegations;
    } catch (error) {
      console.error("Error in fetchDelegationsFromContract:", error);
      throw error;
    }
  }
);

export const fetchNewDelegationsFromContract = createAsyncThunk(
  "NODES/FETCH_NEW_DELEGATIONS_FROM_CONTRACT",
  async (address: Address, { getState }) => {
    try {
      const state = getState() as any;
      const currentNodes = state.nodes?.nodes || [];

      const nodesMap = new Map();
      currentNodes.forEach((node: Node) => {
        nodesMap.set(node.Address.toLowerCase(), node);
      });

      const delegationsData = await getDelegationsFromContract(address, true); // true = use new contract

      if (!delegationsData.length) {
        return [];
      }

      let nodes = currentNodes;
      if (nodes.length === 0) {
        const nodeData = await fetchNodesClients();
        nodes = nodeData.data || [];

        nodes.forEach((node: Node) => {
          nodesMap.set(node.Address.toLowerCase(), node);
        });
      }

      const newNodeLicenseContract = CONFIG.nodeLicenseAddressV2.toLowerCase();

      const enhancedDelegations = delegationsData
        .filter(delegation =>
          delegation.contract_.toLowerCase() === newNodeLicenseContract &&
          delegation.amount > 0
        )
        .map(delegation => {
          const nodeAddress = delegation.to.toLowerCase();
          const nodeInfo = nodesMap.get(nodeAddress);

          return {
            Address: delegation.to,
            NFTAmount: delegation.amount,
            NFTTokenID: delegation.tokenId,
            OperatorName: nodeInfo?.OperatorName || "Node Operator",
            TotalTime: nodeInfo?.TotalTime || 0,
            LastHeartbeat: nodeInfo?.LastHeartbeat || new Date(),
            CreatedAt: nodeInfo?.CreatedAt || new Date(),
            CommissionRate: nodeInfo?.CommissionRate || 0,
            Status: nodeInfo?.Status || "Active",
            AllUptimePercentage: nodeInfo?.AllUptimePercentage || 0,
            WeeklyUptimePercentage: nodeInfo?.WeeklyUptimePercentage || 0,
          } as Node;
        });

      return enhancedDelegations;
    } catch (error) {
      console.error("Error in fetchNewDelegationsFromContract:", error);
      throw error;
    }
  }
);

const nodesSlice = createSlice({
  name: "NODES_STATE",
  initialState: INIT_STATE,
  reducers: {
    setIsNodeInstallModalOpen: (state, action: PayloadAction<boolean>) => {
      state.isNodeInstallModalOpen = action.payload
    },
    setIsNoLicenseModalOpen: (state, action: PayloadAction<boolean>) => {
      state.isNoLicenseModalOpen = action.payload
    },
    setIsNoCapacityModalOpen: (state, action: PayloadAction<boolean>) => {
      state.isNoCapacityModalOpen = action.payload
    },
    setDelegateLicenseModal: (state, action: PayloadAction<DelegateLicenseModal>) => {
      state.delegateLicenseModal = action.payload
    },
    setRevokeLicenseModal: (state, action: PayloadAction<DelegateLicenseModal>) => {
      state.revokeLicenseModal = action.payload
    },
    setRedelegationModal: (state, action: PayloadAction<DelegateLicenseModal>) => {
      state.redelegationModal = action.payload
      if (!action.payload.open) {
        state.preventRedelegationModalReopening = true;
      }
    },
    allowRedelegationModalReopening: (state) => {
      state.preventRedelegationModalReopening = false;
    },
    resetDelegationStatus: (state) => {
      state.delegateLicenseStatus = Status.IDLE;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(delegateLicense.pending, (state) => {
        state.delegateLicenseStatus = Status.PENDING;
      })
      .addCase(delegateLicense.fulfilled, (state) => {
        state.delegateLicenseStatus = Status.SUCCESS;
      })
      .addCase(delegateLicense.rejected, (state) => {
        state.delegateLicenseStatus = Status.ERROR;
      })
      .addCase(delegateNewNodeLicense.pending, (state) => {
        state.delegateLicenseStatus = Status.PENDING;
      })
      .addCase(delegateNewNodeLicense.fulfilled, (state) => {
        state.delegateLicenseStatus = Status.SUCCESS;
      })
      .addCase(delegateNewNodeLicense.rejected, (state) => {
        state.delegateLicenseStatus = Status.ERROR;
      })
      .addCase(fetchNodeLicenseBalances.pending, (state) => {
        state.fetchNodeLicenseBalancesStatus = Status.PENDING;
      })
      .addCase(fetchNodeLicenseBalances.fulfilled, (state, action) => {
        state.fetchNodeLicenseBalancesStatus = Status.SUCCESS;
        state.user.licences = action.payload;
      })
      .addCase(fetchNodeLicenseBalances.rejected, (state) => {
        state.fetchNodeLicenseBalancesStatus = Status.ERROR;
      })
      .addCase(fetchNewNodeLicenseBalances.pending, (state) => {
        state.fetchNewNodeLicenseBalancesStatus = Status.PENDING;
      })
      .addCase(fetchNewNodeLicenseBalances.fulfilled, (state, action) => {
        state.fetchNewNodeLicenseBalancesStatus = Status.SUCCESS;
        state.user.newLicences = action.payload;
      })
      .addCase(fetchNewNodeLicenseBalances.rejected, (state) => {
        state.fetchNewNodeLicenseBalancesStatus = Status.ERROR;
      })
      .addCase(fetchNodes.pending, (state) => {
        state.fetchNodesStatus = Status.PENDING;
      })
      .addCase(fetchNodes.fulfilled, (state, action) => {
        state.fetchNodesStatus = Status.SUCCESS;
        state.nodes = action.payload;
      })
      .addCase(fetchNodes.rejected, (state) => {
        state.fetchNodesStatus = Status.ERROR;
      })
      .addCase(fetchDelegations.pending, (state) => {
        state.fetchDelegationsStatus = Status.PENDING;
      })
      .addCase(fetchDelegations.fulfilled, (state, action) => {
        state.fetchDelegationsStatus = Status.SUCCESS;
        state.user.delegations = action.payload;
      })
      .addCase(fetchDelegations.rejected, (state) => {
        state.fetchDelegationsStatus = Status.ERROR;
      })
      .addCase(fetchTestnetPoints.pending, (state) => {
        state.testnetPointsLoading = true;
      })
      .addCase(fetchTestnetPoints.fulfilled, (state, action) => {
        state.testnetPoints = action.payload.total_points || 0;
        state.testnetPointsLoading = false;
      })
      .addCase(fetchTestnetPoints.rejected, (state) => {
        state.testnetPoints = 0;
        state.testnetPointsLoading = false;
      })
      .addCase(fetchDelegationsFromContract.pending, (state) => {
        state.fetchDelegationsFromContractStatus = Status.PENDING;
      })
      .addCase(fetchDelegationsFromContract.fulfilled, (state, action) => {
        state.fetchDelegationsFromContractStatus = Status.SUCCESS;
        state.user.delegations = action.payload;
      })
      .addCase(fetchDelegationsFromContract.rejected, (state) => {
        state.fetchDelegationsFromContractStatus = Status.ERROR;
      })
      .addCase(fetchNewDelegationsFromContract.pending, (state) => {
        state.fetchNewDelegationsFromContractStatus = Status.PENDING;
      })
      .addCase(fetchNewDelegationsFromContract.fulfilled, (state, action) => {
        state.fetchNewDelegationsFromContractStatus = Status.SUCCESS;
        state.user.newDelegations = action.payload;
      })
      .addCase(fetchNewDelegationsFromContract.rejected, (state) => {
        state.fetchNewDelegationsFromContractStatus = Status.ERROR;
      })
  },
});

export const selectNodesSlice = (state: AppState): NodesStateType => state.nodes;

export const {
  setIsNodeInstallModalOpen,
  setIsNoLicenseModalOpen,
  setIsNoCapacityModalOpen,
  setDelegateLicenseModal,
  setRevokeLicenseModal,
  setRedelegationModal,
  allowRedelegationModalReopening,
  resetDelegationStatus,
} = nodesSlice.actions;


export default nodesSlice.reducer;

import { PayloadAction, createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { AppState } from "../rootReducer";
import { NodesUser, Status, Node, DelegateLicenseModal } from "@/lib/types";
import { delegateNodeLicense, getNodeLicenseBalances, getNewNodeLicenseBalances, getDelegationsFromContract } from "@/lib/contractInteract";
import { Address } from "viem";
import { fetchNodesClients, fetchUserDelegations, fetchUserPoints } from "@/lib/api";
import { CONFIG } from "@/lib/config";

const initUser: NodesUser = {
  licences: [],
  newLicences: [],
  delegations: [],
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
    amount
  }: {
    to: Address,
    tokenId: number,
    amount: number
  }, { dispatch }) => {
    try {
      // Always use old contract (delegateNodeLicense)
      await delegateNodeLicense(to, tokenId, amount);

      // Fetch updated delegations from contract
      await dispatch(fetchDelegationsFromContract({
        address: to,
        useNewContract: false
      }));
    } catch (error) {
      console.log(error);
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
  async () => {
    try {
      const nodes = await fetchNodesClients();
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
  async (params: { address: Address, useNewContract: boolean }) => {
    try {
      const address = params.address;
      const useNewContract = params.useNewContract;
      const delegationsData = await getDelegationsFromContract(address, useNewContract);
      console.log("Delegations from contract:", delegationsData);

      if (!delegationsData.length) {
        return [];
      }

      const nodeData = await fetchNodesClients();
      const nodes = nodeData.data || [];

      // Always use old contract address
      const nodeLicenseContract = CONFIG.oldNodeLicenseAddress.toLowerCase();

      const enhancedDelegations = delegationsData
        .filter(delegation =>
          delegation.contract_.toLowerCase() === nodeLicenseContract &&
          delegation.amount > 0
        )
        .map(delegation => {
          const nodeInfo = nodes.find((node: Node) =>
            node.Address.toLowerCase() === delegation.to.toLowerCase()
          );

          console.log(`Processing delegation to ${delegation.to} with tokenId ${delegation.tokenId}`);

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

      // Log for debugging
      console.log(`Found ${enhancedDelegations.length} node license delegations from contract:`);
      console.log(enhancedDelegations);

      return enhancedDelegations;
    } catch (error) {
      console.error("Error in fetchDelegationsFromContract:", error);
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
        // Always update the delegations array, even if it's empty
        state.user.delegations = action.payload;
      })
      .addCase(fetchDelegationsFromContract.rejected, (state) => {
        state.fetchDelegationsFromContractStatus = Status.ERROR;
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

export const closeModal = () => (dispatch: any) => {
  dispatch(setDelegateLicenseModal({ open: false }));
  dispatch(setRevokeLicenseModal({ open: false }));
  dispatch(setRedelegationModal({ open: false }));
};

export default nodesSlice.reducer;

import { PayloadAction, createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { AppState } from "../rootReducer";
import { NodesUser, Status, Node, DelegateLicenseModal } from "@/lib/types";
import { delegateNodeLicense, getNodeLicenseBalances } from "@/lib/contractInteract";
import { Address } from "viem";
import { fetchNodesClients, fetchUserDelegations } from "@/lib/api";

const initUser: NodesUser = {
  licences: [],
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
  fetchNodesStatus: Status;
  nodes: Node[];
  fetchDelegationsStatus: Status;
  revokeLicenseModal: DelegateLicenseModal;
}

const INIT_STATE: NodesStateType = {
  isNodeInstallModalOpen: false,
  isNoLicenseModalOpen: false,
  isNoCapacityModalOpen: false,
  delegateLicenseModal: initDelegateLicenseModal,
  delegateLicenseStatus: Status.IDLE,
  user: initUser,
  fetchNodeLicenseBalancesStatus: Status.IDLE,
  fetchNodesStatus: Status.IDLE,
  nodes: [],
  fetchDelegationsStatus: Status.IDLE,
  revokeLicenseModal: initDelegateLicenseModal,
};

export const delegateLicense = createAsyncThunk(
  "NODES/DELEGATE_LICENSE",
  async ({
    to,
    tokenId,
    amount,
  }: {
    to: Address,
    tokenId: number,
    amount: number,
  }) => {
    try {
      await delegateNodeLicense(to, tokenId, amount);
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
        tokenId: tokenIds[index],
        balance: Number(balance),
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
  },
  extraReducers: (builder) => {
    builder
      .addCase(delegateLicense.pending, (state) => {
        state.delegateLicenseStatus = Status.PENDING;
      })
      .addCase(delegateLicense.fulfilled, (state) => {
        state.delegateLicenseStatus = Status.SUCCESS;
        state.delegateLicenseModal.open = false;
        state.revokeLicenseModal.open = false;
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
      });
  },
});

export const selectNodesSlice = (state: AppState): NodesStateType => state.nodes;

export const {
  setIsNodeInstallModalOpen,
  setIsNoLicenseModalOpen,
  setIsNoCapacityModalOpen,
  setDelegateLicenseModal,
  setRevokeLicenseModal,
} = nodesSlice.actions;

export default nodesSlice.reducer;

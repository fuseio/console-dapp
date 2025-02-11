import { PayloadAction, createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { AppState } from "../rootReducer";
import { NodesUser, Status } from "@/lib/types";
import { delegateNodeLicense, getNodeLicenseBalances } from "@/lib/contractInteract";
import { Address } from "viem";

const initUser: NodesUser = {
  licences: []
}

export interface NodesStateType {
  isNodeInstallModalOpen: boolean;
  isNoLicenseModalOpen: boolean;
  isNoCapacityModalOpen: boolean;
  isDelegateLicenseModalOpen: boolean;
  deligateLicenseStatus: Status;
  user: NodesUser;
  fetchNodeLicenseBalancesStatus: Status;
}

const INIT_STATE: NodesStateType = {
  isNodeInstallModalOpen: false,
  isNoLicenseModalOpen: false,
  isNoCapacityModalOpen: false,
  isDelegateLicenseModalOpen: false,
  deligateLicenseStatus: Status.IDLE,
  user: initUser,
  fetchNodeLicenseBalancesStatus: Status.IDLE,
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
    setIsDelegateLicenseModalOpen: (state, action: PayloadAction<boolean>) => {
      state.isDelegateLicenseModalOpen = action.payload
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(delegateLicense.pending, (state) => {
        state.deligateLicenseStatus = Status.PENDING;
      })
      .addCase(delegateLicense.fulfilled, (state) => {
        state.deligateLicenseStatus = Status.SUCCESS;
        state.isDelegateLicenseModalOpen = false;
      })
      .addCase(delegateLicense.rejected, (state) => {
        state.deligateLicenseStatus = Status.ERROR;
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
      });
  },
});

export const selectNodesSlice = (state: AppState): NodesStateType => state.nodes;

export const {
  setIsNodeInstallModalOpen,
  setIsNoLicenseModalOpen,
  setIsNoCapacityModalOpen,
  setIsDelegateLicenseModalOpen,
} = nodesSlice.actions;

export default nodesSlice.reducer;

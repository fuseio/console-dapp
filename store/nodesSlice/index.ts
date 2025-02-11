import { PayloadAction, createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { AppState } from "../rootReducer";
import { NodesUser, Status } from "@/lib/types";
import { delegateNodeLicense } from "@/lib/contractInteract";
import { Address } from "viem";

const initUser: NodesUser = {
  licences: 0
}

export interface NodesStateType {
  isNodeInstallModalOpen: boolean;
  isNoLicenseModalOpen: boolean;
  isNoCapacityModalOpen: boolean;
  isDelegateLicenseModalOpen: boolean;
  deligateLicenseStatus: Status;
  user: NodesUser;
}

const INIT_STATE: NodesStateType = {
  isNodeInstallModalOpen: false,
  isNoLicenseModalOpen: false,
  isNoCapacityModalOpen: false,
  isDelegateLicenseModalOpen: false,
  deligateLicenseStatus: Status.IDLE,
  user: initUser,
};

export const delegateLicense = createAsyncThunk(
  "NODES/DELEGATE_LICENSE",
  async ({
    to,
    amount,
  }: {
    to: Address,
    amount: number,
  }) => {
    try {
      const tokenId = 0;
      await delegateNodeLicense(to, tokenId, amount);
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

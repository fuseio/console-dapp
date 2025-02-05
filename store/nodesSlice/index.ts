import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { AppState } from "../rootReducer";
import { NodesUser } from "@/lib/types";

const initUser: NodesUser = {
  licences: 0
}

export interface NodesStateType {
  isNodeInstallModalOpen: boolean;
  isNoLicenseModalOpen: boolean;
  isNoCapacityModalOpen: boolean;
  user: NodesUser;
}

const INIT_STATE: NodesStateType = {
  isNodeInstallModalOpen: false,
  isNoLicenseModalOpen: false,
  isNoCapacityModalOpen: false,
  user: initUser,
};

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
  },
});

export const selectNodesSlice = (state: AppState): NodesStateType => state.nodes;

export const {
  setIsNodeInstallModalOpen,
  setIsNoLicenseModalOpen,
  setIsNoCapacityModalOpen,
} = nodesSlice.actions;

export default nodesSlice.reducer;

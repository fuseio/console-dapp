import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { AppState } from "../rootReducer";

export interface NodesStateType {
  isNodeInstallModalOpen: boolean;
}

const INIT_STATE: NodesStateType = {
  isNodeInstallModalOpen: false,
};

const nodesSlice = createSlice({
  name: "NODES_STATE",
  initialState: INIT_STATE,
  reducers: {
    setIsNodeInstallModalOpen: (state, action: PayloadAction<boolean>) => {
      state.isNodeInstallModalOpen = action.payload
    },
  },
});

export const selectNodesSlice = (state: AppState): NodesStateType => state.nodes;

export const {
  setIsNodeInstallModalOpen,
} = nodesSlice.actions;

export default nodesSlice.reducer;

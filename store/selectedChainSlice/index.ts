import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { AppState } from "../rootReducer";

export interface SelectedChainStateType {
  depositSelectedChainItem: number;
  withdrawSelectedChainItem: number;
}

const INIT_STATE: SelectedChainStateType = {
  depositSelectedChainItem: 0,
  withdrawSelectedChainItem: 0,
};

const selectedChainSlice = createSlice({
  name: "SELECTED_CHAIN",
  initialState: INIT_STATE,
  reducers: {
    setDepositChainItem: (state, action: PayloadAction<number>) => {
      state.depositSelectedChainItem = action.payload
    },
    setWithdrawChainItem: (state, action: PayloadAction<number>) => {
      state.withdrawSelectedChainItem = action.payload
    },
  },
});

export const selectSelectedChainSlice = (state: AppState): SelectedChainStateType => state.selectedChain;

export const {
  setDepositChainItem,
  setWithdrawChainItem
} = selectedChainSlice.actions;

export default selectedChainSlice.reducer;

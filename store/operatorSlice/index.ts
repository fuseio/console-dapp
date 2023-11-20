import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { AppState } from "../rootReducer";

export interface OperatorStateType {
  isCreateAccountModalOpen: boolean;
  isAccountCreationModalOpen: boolean;
  isCongratulationModalOpen: boolean;
}

const INIT_STATE: OperatorStateType = {
  isCreateAccountModalOpen: false,
  isAccountCreationModalOpen: false,
  isCongratulationModalOpen: false,
};

const operatorSlice = createSlice({
  name: "OPERATOR_STATE",
  initialState: INIT_STATE,
  reducers: {
    setIsCreateAccountModalOpen: (state, action: PayloadAction<boolean>) => {
      state.isCreateAccountModalOpen = action.payload
    },
    setIsAccountCreationModalOpen: (state, action: PayloadAction<boolean>) => {
      state.isAccountCreationModalOpen = action.payload
    },
    setIsCongratulationModalOpen: (state, action: PayloadAction<boolean>) => {
      state.isCongratulationModalOpen = action.payload
    },
  },
});

export const selectOperatorSlice = (state: AppState): OperatorStateType => state.operator;

export const { setIsCreateAccountModalOpen, setIsAccountCreationModalOpen, setIsCongratulationModalOpen } = operatorSlice.actions;

export default operatorSlice.reducer;

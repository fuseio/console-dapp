import { PayloadAction, createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { AppState } from "../rootReducer";
import { Signer } from "ethers";
import { NEXT_PUBLIC_FUSE_API_PUBLIC_KEY } from "@/lib/config";
import { FuseSDK } from "@fuseio/fusebox-web-sdk";
import { Address } from "abitype";
import { hex } from "@/lib/helpers";

export interface OperatorStateType {
  isCreateAccountModalOpen: boolean;
  isAccountCreationModalOpen: boolean;
  isCongratulationModalOpen: boolean;
  address: Address;
}

const INIT_STATE: OperatorStateType = {
  isCreateAccountModalOpen: false,
  isAccountCreationModalOpen: false,
  isCongratulationModalOpen: false,
  address: hex,
};

export const createSmartContractAccount = createAsyncThunk(
  "OPERATOR/CREATE_SMART_CONTRACT_ACCOUNT",
  async (
    {
      signer,
    }: {
      signer: Signer;
    },
    thunkAPI
  ) => {
    return new Promise<any>(async (resolve, reject) => {
      const fuseSDK = await FuseSDK.init(NEXT_PUBLIC_FUSE_API_PUBLIC_KEY, signer);
      const senderAddress = fuseSDK.wallet.getSender();

      if (senderAddress) {
        resolve(senderAddress as Address);
      } else {
        reject();
      }
    });
  }
);

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
  extraReducers: {
    [createSmartContractAccount.pending.type]: (state, action) => {
      state.isAccountCreationModalOpen = true;
    },
    [createSmartContractAccount.fulfilled.type]: (state, action) => {
      state.address = action.payload;
      state.isAccountCreationModalOpen = false;
      state.isCongratulationModalOpen = true;
    },
    [createSmartContractAccount.rejected.type]: (state, action) => {
      state.isAccountCreationModalOpen = false;
    },
  },
});

export const selectOperatorSlice = (state: AppState): OperatorStateType => state.operator;

export const { setIsCreateAccountModalOpen, setIsAccountCreationModalOpen, setIsCongratulationModalOpen } = operatorSlice.actions;

export default operatorSlice.reducer;

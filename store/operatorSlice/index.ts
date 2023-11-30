import { PayloadAction, createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { AppState } from "../rootReducer";
import { Signer } from "ethers";
import { NEXT_PUBLIC_FUSE_API_PUBLIC_KEY } from "@/lib/config";
import { FuseSDK } from "@fuseio/fusebox-web-sdk";
import { Address } from "abitype";
import { hex } from "@/lib/helpers";

export interface OperatorStateType {
  isSignUpModalOpen: boolean;
  isLoginModalOpen: boolean;
  isLoggedInModalOpen: boolean;
  isAccountCreationModalOpen: boolean;
  isCongratulationModalOpen: boolean;
  isTopupAccountModalOpen: boolean;
  address: Address;
}

const INIT_STATE: OperatorStateType = {
  isSignUpModalOpen: false,
  isLoginModalOpen: false,
  isLoggedInModalOpen: false,
  isAccountCreationModalOpen: false,
  isCongratulationModalOpen: false,
  isTopupAccountModalOpen: false,
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
    setIsSignUpModalOpen: (state, action: PayloadAction<boolean>) => {
      state.isSignUpModalOpen = action.payload
    },
    setIsLoginModalOpen: (state, action: PayloadAction<boolean>) => {
      state.isLoginModalOpen = action.payload
    },
    setIsLoggedinModalOpen: (state, action: PayloadAction<boolean>) => {
      state.isLoggedInModalOpen = action.payload
    },
    setIsAccountCreationModalOpen: (state, action: PayloadAction<boolean>) => {
      state.isAccountCreationModalOpen = action.payload
    },
    setIsCongratulationModalOpen: (state, action: PayloadAction<boolean>) => {
      state.isCongratulationModalOpen = action.payload
    },
    setIsTopupAccountModalOpen: (state, action: PayloadAction<boolean>) => {
      state.isTopupAccountModalOpen = action.payload
    },
  },
  extraReducers: {
    [createSmartContractAccount.pending.type]: (state, action) => {
      if (!state.isLoginModalOpen) {
        state.isAccountCreationModalOpen = true;
      }
    },
    [createSmartContractAccount.fulfilled.type]: (state, action) => {
      state.address = action.payload;
      if (state.isLoginModalOpen) {
        state.isLoginModalOpen = false;
        state.isLoggedInModalOpen = true;
      } else {
        state.isAccountCreationModalOpen = false;
        state.isCongratulationModalOpen = true;
      }
    },
    [createSmartContractAccount.rejected.type]: (state, action) => {
      if (state.isLoginModalOpen) {
        state.isLoginModalOpen = false;
      } else {
        state.isAccountCreationModalOpen = false;
      }
    },
  },
});

export const selectOperatorSlice = (state: AppState): OperatorStateType => state.operator;

export const {
  setIsSignUpModalOpen,
  setIsLoginModalOpen,
  setIsLoggedinModalOpen,
  setIsAccountCreationModalOpen,
  setIsCongratulationModalOpen,
  setIsTopupAccountModalOpen
} = operatorSlice.actions;

export default operatorSlice.reducer;

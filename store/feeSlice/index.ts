import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { AppState } from "../rootReducer";
import { ethers } from "ethers";
import { estimateOriginalNativeFee } from "@/lib/originalBridge";
import { estimateWrappedNativeFee } from "@/lib/wrappedBridge";

export interface FeeStateType {
  isGasFeeLoading: boolean;
  gasFee: string;
  isError: boolean;
}

const INIT_STATE: FeeStateType = {
  isGasFeeLoading: false,
  gasFee: "0",
  isError: false,
};

export const estimateOriginalFee = createAsyncThunk(
  "FEE/ESTIMATE_GAS",
  async (
    {
      contractAddress,
      rpcUrl,
    }: {
      contractAddress: string;
      rpcUrl: string;
    },
    thunkAPI
  ) => {
    return new Promise<any>(async (resolve, reject) => {
      estimateOriginalNativeFee(contractAddress, rpcUrl)
        .then((fee) => {
          let feeFloat = parseFloat(ethers.utils.formatEther(fee));
          resolve(feeFloat.toFixed(8));
        })
        .catch((err) => {
          reject(err);
        });
    });
  }
);

export const estimateWrappedFee = createAsyncThunk(
  "FEE/ESTIMATE_GAS",
  async (
    {
      contractAddress,
      lzChainId,
      rpcUrl,
    }: {
      contractAddress: string;
      lzChainId: number;
      rpcUrl: string;
    },
    thunkAPI
  ) => {
    return new Promise<any>(async (resolve, reject) => {
      estimateWrappedNativeFee(contractAddress, lzChainId, rpcUrl)
        .then((fee) => {
          let feeFloat = parseFloat(ethers.utils.formatEther(fee));
          resolve(feeFloat.toFixed(5));
        })
        .catch((err) => {
          reject(err);
        });
    });
  }
);

const feeSlice = createSlice({
  name: "FEE_STATE",
  initialState: INIT_STATE,
  reducers: {},
  extraReducers: {
    [estimateOriginalFee.pending.type]: (state) => {
      state.isGasFeeLoading = true;
    },
    [estimateOriginalFee.fulfilled.type]: (state, action) => {
      state.isGasFeeLoading = false;
      state.gasFee = action.payload;
    },
    [estimateOriginalFee.rejected.type]: (state) => {
      state.isGasFeeLoading = false;
      state.isError = true;
    },
    [estimateWrappedFee.pending.type]: (state) => {
      state.isGasFeeLoading = true;
    },
    [estimateWrappedFee.fulfilled.type]: (state, action) => {
      state.isGasFeeLoading = false;
      state.gasFee = action.payload;
    },
    [estimateWrappedFee.rejected.type]: (state) => {
      state.isGasFeeLoading = false;
      state.isError = true;
    },
  },
});

export const selectFeeSlice = (state: AppState): FeeStateType => state.fee;

export default feeSlice.reducer;

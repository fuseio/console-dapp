import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { AppState } from "../rootReducer";
import { ethers } from "ethers";
import {
  estimateOriginalNativeFee,
  getDepositFeeBps,
} from "@/lib/originalBridge";
import {
  estimateWrappedNativeFee,
  getWithdrawalFeeBps,
} from "@/lib/wrappedBridge";
import { Address } from "abitype";

export interface FeeStateType {
  isGasFeeLoading: boolean;
  gasFee: string;
  withdrawFee: number;
  isWithdrawFeeLoading: boolean;
  isError: boolean;
}

const INIT_STATE: FeeStateType = {
  isGasFeeLoading: false,
  gasFee: "0",
  isError: false,
  withdrawFee: 0,
  isWithdrawFeeLoading: false,
};

export const estimateOriginalFee = createAsyncThunk(
  "FEE/ESTIMATE_GAS",
  async (
    {
      contractAddress,
      rpcUrl,
    }: {
      contractAddress: Address;
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
      contractAddress: Address;
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

export const estimateWithdrawFee = createAsyncThunk(
  "FEE/ESTIMATE_WITHDRAW_FEE",
  async (
    {
      contractAddress,
      rpcUrl,
    }: {
      contractAddress: Address;
      rpcUrl: string;
    },
    thunkAPI
  ) => {
    return new Promise<any>(async (resolve, reject) => {
      getWithdrawalFeeBps(contractAddress, rpcUrl)
        .then((fee) => {
          resolve(fee);
        })
        .catch((err) => {
          reject(err);
        });
    });
  }
);

export const estimateDepositFee = createAsyncThunk(
  "FEE/ESTIMATE_DEPOSIT_FEE",
  async (
    {
      contractAddress,
      rpcUrl,
    }: {
      contractAddress: Address;
      rpcUrl: string;
    },
    thunkAPI
  ) => {
    return new Promise<any>(async (resolve, reject) => {
      getDepositFeeBps(contractAddress, rpcUrl)
        .then((fee) => {
          resolve(fee);
        })
        .catch((err) => {
          reject(err);
        });
    });
  }
);

export const resetBridgeFee = createAsyncThunk(
  "FEE/RESET_BRIDGE_FEE",
  async (_, thunkAPI) => {
    return new Promise<any>(async (resolve, reject) => {
      resolve(0);
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
    [estimateWithdrawFee.pending.type]: (state) => {
      state.isWithdrawFeeLoading = true;
    },
    [estimateWithdrawFee.fulfilled.type]: (state, action) => {
      state.isWithdrawFeeLoading = false;
      state.withdrawFee = action.payload;
    },
    [estimateWithdrawFee.rejected.type]: (state) => {
      state.isWithdrawFeeLoading = false;
      state.isError = true;
    },
    [estimateDepositFee.pending.type]: (state) => {
      state.isWithdrawFeeLoading = true;
    },
    [estimateDepositFee.fulfilled.type]: (state, action) => {
      state.isWithdrawFeeLoading = false;
      state.withdrawFee = action.payload;
    },
    [estimateDepositFee.rejected.type]: (state) => {
      state.isWithdrawFeeLoading = false;
      state.isError = true;
    },
    [resetBridgeFee.pending.type]: (state) => {
      state.isWithdrawFeeLoading = true;
    },
    [resetBridgeFee.fulfilled.type]: (state, action) => {
      state.isWithdrawFeeLoading = false;
      state.withdrawFee = action.payload;
    },
    [resetBridgeFee.rejected.type]: (state) => {
      state.isWithdrawFeeLoading = false;
      state.isError = true;
    },
  },
});

export const selectFeeSlice = (state: AppState): FeeStateType => state.fee;

export default feeSlice.reducer;

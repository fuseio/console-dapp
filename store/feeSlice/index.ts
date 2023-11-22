import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { AppState } from "../rootReducer";
import { ethers } from "ethers";
import { estimateOriginalNativeFee } from "@/lib/originalBridge";
import { estimateWrappedNativeFee } from "@/lib/wrappedBridge";
import { Address } from "abitype";
import { rpc } from "viem/utils";
import { createPublicClient, http } from "viem";
import { fetchTokenPrice } from "@/lib/api";

export interface FeeStateType {
  isGasFeeLoading: boolean;
  isSourceGasFeeLoading: boolean;
  destGasFee: number;
  sourceGasFee: number;
  isError: boolean;
  tokenPrice: number;
}

const INIT_STATE: FeeStateType = {
  isGasFeeLoading: false,
  destGasFee: 0,
  sourceGasFee: 0,
  isError: false,
  isSourceGasFeeLoading: false,
  tokenPrice: 0,
};

export const estimateOriginalFee = createAsyncThunk(
  "FEE/ESTIMATE_GAS",
  async (
    {
      contractAddress,
      rpcUrl,
      tokenId,
    }: {
      contractAddress: Address;
      rpcUrl: string;
      tokenId: string;
    },
    thunkAPI
  ) => {
    return new Promise<any>(async (resolve, reject) => {
      thunkAPI.dispatch(estimateSourceFee(rpcUrl));
      thunkAPI.dispatch(fetchNativePrice(tokenId));
      estimateOriginalNativeFee(contractAddress, rpcUrl)
        .then((fee) => {
          let feeFloat = parseFloat(ethers.utils.formatEther(fee));
          resolve(feeFloat);
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
      tokenId,
    }: {
      contractAddress: Address;
      lzChainId: number;
      rpcUrl: string;
      tokenId: string;
    },
    thunkAPI
  ) => {
    return new Promise<any>(async (resolve, reject) => {
      thunkAPI.dispatch(estimateSourceFee(rpcUrl));
      thunkAPI.dispatch(fetchNativePrice(tokenId));
      estimateWrappedNativeFee(contractAddress, lzChainId, rpcUrl)
        .then((fee) => {
          let feeFloat = parseFloat(ethers.utils.formatEther(fee));
          resolve(feeFloat);
        })
        .catch((err) => {
          reject(err);
        });
    });
  }
);

export const estimateSourceFee = createAsyncThunk(
  "FEE/ESTIMATE_SOURCE_GAS",
  async (rpcUrl: string, thunkAPI) => {
    return new Promise<any>(async (resolve, reject) => {
      try {
        const client = createPublicClient({
          transport: http(rpcUrl),
        });
        const gasPrice = await client.getGasPrice();
        resolve(parseFloat(ethers.utils.formatEther(gasPrice)) * 270000);
      } catch (err) {
        console.log(err);
        reject(err);
      }
    });
  }
);

export const fetchNativePrice = createAsyncThunk(
  "FEE/FETCH_TOKEN_PRICE",
  async (tokenId: string, thunkAPI) => {
    return new Promise<any>(async (resolve, reject) => {
      const price = await fetchTokenPrice(tokenId);
      resolve(price);
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
      state.destGasFee = action.payload;
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
      state.destGasFee = action.payload;
    },
    [estimateWrappedFee.rejected.type]: (state) => {
      state.isGasFeeLoading = false;
      state.isError = true;
    },
    [estimateSourceFee.pending.type]: (state) => {
      state.isSourceGasFeeLoading = true;
    },
    [estimateSourceFee.fulfilled.type]: (state, action) => {
      state.isSourceGasFeeLoading = false;
      state.sourceGasFee = action.payload;
    },
    [estimateSourceFee.rejected.type]: (state) => {
      state.isSourceGasFeeLoading = false;
      state.isError = true;
    },
    [fetchNativePrice.pending.type]: (state) => {
      state.isGasFeeLoading = true;
    },
    [fetchNativePrice.fulfilled.type]: (state, action) => {
      state.isGasFeeLoading = false;
      state.tokenPrice = action.payload;
    },
    [fetchNativePrice.rejected.type]: (state) => {
      state.isGasFeeLoading = false;
      state.isError = true;
    },
  },
});

export const selectFeeSlice = (state: AppState): FeeStateType => state.fee;

export default feeSlice.reducer;

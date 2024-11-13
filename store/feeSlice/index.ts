import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { AppState } from "../rootReducer";
import { ethers } from "ethers";
import { estimateOriginalNativeFee } from "@/lib/originalBridge";
import { estimateWrappedNativeFee } from "@/lib/wrappedBridge";
import { Address } from "abitype";
import { createPublicClient, http } from "viem";
import { fetchTokenPrice } from "@/lib/api";

let nativePricePromise: any;

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
  "FEE/ESTIMATE_ORIGINAL_FEE",
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
      if (nativePricePromise) {
        nativePricePromise.abort();
      }
      nativePricePromise = thunkAPI.dispatch(fetchNativePrice(tokenId));
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
  "FEE/ESTIMATE_WRAPPED_FEE",
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
      if (nativePricePromise) {
        nativePricePromise.abort();
      }
      nativePricePromise = thunkAPI.dispatch(fetchNativePrice(tokenId));
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
        const gasLimits = {
          137: 300000, // Polygon
          42161: 710000, // Arbitrum
          10: 290000, // Optimism
          56: 2030000, // BNB
          8453: 16030000, // BASE
          1: 440000, // Ethereum
          default: 270000,
        };
        const chainId = await client.getChainId();
        const gasLimit =
          gasLimits[chainId as keyof typeof gasLimits] || gasLimits.default;
        resolve(parseFloat(ethers.utils.formatEther(gasPrice)) * gasLimit);
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
  extraReducers: (builder) => {
    builder
      .addCase(estimateOriginalFee.pending, (state) => {
        state.isGasFeeLoading = true;
      })
      .addCase(estimateOriginalFee.fulfilled, (state, action) => {
        state.isGasFeeLoading = false;
        state.destGasFee = action.payload;
      })
      .addCase(estimateOriginalFee.rejected, (state) => {
        state.isGasFeeLoading = false;
        state.isError = true;
      })
      .addCase(estimateWrappedFee.pending, (state) => {
        state.isGasFeeLoading = true;
      })
      .addCase(estimateWrappedFee.fulfilled, (state, action) => {
        state.isGasFeeLoading = false;
        state.destGasFee = action.payload;
      })
      .addCase(estimateWrappedFee.rejected, (state) => {
        state.isGasFeeLoading = false;
        state.isError = true;
      })
      .addCase(estimateSourceFee.pending, (state) => {
        state.isSourceGasFeeLoading = true;
      })
      .addCase(estimateSourceFee.fulfilled, (state, action) => {
        state.isSourceGasFeeLoading = false;
        state.sourceGasFee = action.payload;
      })
      .addCase(estimateSourceFee.rejected, (state) => {
        state.isSourceGasFeeLoading = false;
        state.isError = true;
      })
      .addCase(fetchNativePrice.pending, (state) => {
        state.isGasFeeLoading = true;
      })
      .addCase(fetchNativePrice.fulfilled, (state, action) => {
        state.isGasFeeLoading = false;
        state.tokenPrice = action.payload;
      })
      .addCase(fetchNativePrice.rejected, (state) => {
        state.isGasFeeLoading = false;
        state.isError = true;
      });
  },
});

export const selectFeeSlice = (state: AppState): FeeStateType => state.fee;

export default feeSlice.reducer;

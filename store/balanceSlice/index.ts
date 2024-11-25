import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { AppState } from "../rootReducer";
import { getERC20Allowance, getERC20Balance } from "@/lib/erc20";
import { ethers } from "ethers";
import { ChainStateType } from "../chainSlice";
import { fetchTokenPrice } from "@/lib/api";
import { Address } from "abitype";

export interface BalanceStateType {
  lzChainId: number;
  chainId: number;
  liquidity: string;
  address: string;
  balance: string;
  approval: string;
  isBalanceLoading: boolean;
  isApprovalLoading: boolean;
  isLiquidityLoading: boolean;
  isError: boolean;
  price: number;
  isUsdPriceLoading: boolean;
}

const INIT_STATE: BalanceStateType = {
  address: "",
  balance: "0",
  approval: "0",
  liquidity: "0",
  chainId: 0,
  isApprovalLoading: false,
  isBalanceLoading: false,
  isLiquidityLoading: false,
  lzChainId: 0,
  isError: false,
  price: 0,
  isUsdPriceLoading: false,
};

export const fetchBalance = createAsyncThunk(
  "BALANCE/FETCH_BALANCE",
  async (
    {
      contractAddress,
      address,
      decimals = 18,
      rpc,
    }: {
      contractAddress: Address;
      address: Address;
      decimals: number;
      rpc?: string;
    },
    thunkAPI
  ) => {
    return new Promise<any>(async (resolve, reject) => {
      const state = thunkAPI.getState();
      // @ts-ignore
      const chain: ChainStateType = state.chain;
      if (!rpc) rpc = chain.rpcUrl as string;
      getERC20Balance(contractAddress, address, rpc)
        .then((balance) => {
          const bal = ethers.utils.formatUnits(balance, decimals);
          resolve(bal);
        })
        .catch((err) => {
          reject(err);
        });
    });
  }
);

export const setNativeBalanceThunk = createAsyncThunk(
  "BALANCE/SET_NATIVE_BALANCE",
  async (balance: string, thunkAPI) => {
    return new Promise<any>(async (resolve, reject) => {
      resolve(balance);
    });
  }
);

export const fetchUsdPrice = createAsyncThunk(
  "BALANCE/FETCH_USD_PRICE",
  async ({
    tokenId,
    controller,
  }: {
    tokenId: string;
    controller: AbortController;
  }) => {
    return new Promise<any>(async (resolve, reject) => {
      fetchTokenPrice(tokenId)
        .then((price) => {
          resolve(price);
        })
        .catch((error) => {
          reject(error);
        });
      controller.signal.addEventListener("abort", () => reject());
    });
  }
);

export const fetchApproval = createAsyncThunk(
  "BALANCE/FETCH_APPROVAL",
  async (
    {
      contractAddress,
      address,
      spender,
      decimals = 18,
    }: {
      contractAddress: Address;
      address: Address;
      spender: Address;
      decimals: number;
    },
    thunkAPI
  ) => {
    return new Promise<any>(async (resolve, reject) => {
      const state = thunkAPI.getState();
      // @ts-ignore
      const chain: ChainStateType = state.chain;
      getERC20Allowance(
        contractAddress,
        address,
        spender,
        chain.rpcUrl as string
      )
        .then((approval) => {
          const app = ethers.utils.formatUnits(approval, decimals);
          resolve(app);
        })
        .catch((err) => {
          reject(err);
        });
    });
  }
);

export const fetchLiquidity = createAsyncThunk(
  "BALANCE/FETCH_LIQUIDITY",
  async (
    {
      contractAddress,
      bridge,
      decimals = 18,
      rpcUrl,
    }: {
      contractAddress: Address;
      bridge: Address;
      decimals: number;
      rpcUrl: string;
    },
    thunkAPI
  ) => {
    return new Promise<any>(async (resolve, reject) => {
      getERC20Balance(contractAddress, bridge, rpcUrl)
        .then((balance) => {
          const bal = ethers.utils.formatUnits(balance, decimals);
          resolve(bal);
        })
        .catch((err) => {
          console.log(err);
          reject(err);
        });
    });
  }
);

const balanceSlice = createSlice({
  name: "BALANCE_STATE",
  initialState: INIT_STATE,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchBalance.pending, (state) => {
        state.isBalanceLoading = true;
      })
      .addCase(fetchBalance.fulfilled, (state, action) => {
        state.balance = action.payload;
        state.isBalanceLoading = false;
      })
      .addCase(fetchBalance.rejected, (state) => {
        state.isBalanceLoading = false;
        state.isError = true;
      })
      .addCase(fetchApproval.pending, (state, action) => {
        state.isApprovalLoading = true;
      })
      .addCase(fetchApproval.fulfilled, (state, action) => {
        state.approval = action.payload;
        state.isApprovalLoading = false;
      })
      .addCase(fetchApproval.rejected, (state, action) => {
        state.isApprovalLoading = false;
        state.isError = true;
      })
      .addCase(fetchLiquidity.pending, (state, action) => {
        state.isLiquidityLoading = true;
      })
      .addCase(fetchLiquidity.fulfilled, (state, action) => {
        state.liquidity = action.payload;
        state.isLiquidityLoading = false;
      })
      .addCase(fetchLiquidity.rejected, (state, action) => {
        state.isLiquidityLoading = false;
        state.isError = true;
      })
      .addCase(setNativeBalanceThunk.fulfilled, (state, action) => {
        state.balance = action.payload;
        state.isBalanceLoading = false;
      })
      .addCase(fetchUsdPrice.pending, (state, action) => {
        state.isUsdPriceLoading = true;
      })
      .addCase(fetchUsdPrice.fulfilled, (state, action) => {
        state.price = action.payload;
        state.isUsdPriceLoading = false;
      })
      .addCase(fetchUsdPrice.rejected, (state, action) => {
        state.isUsdPriceLoading = false;
      });
  },
});

export const selectBalanceSlice = (state: AppState): BalanceStateType =>
  state.balance;

export default balanceSlice.reducer;

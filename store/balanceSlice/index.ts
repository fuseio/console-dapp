import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { AppState } from "../rootReducer";
import { getERC20Allowance, getERC20Balance } from "@/lib/erc20";
import { ethers } from "ethers";
import { ChainStateType } from "../chainSlice";
import { fetchTokenPrice } from "@/lib/api";

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
      bridge,
      decimals = 18,
    }: {
      contractAddress: string;
      address: string;
      bridge: string;
      decimals: number;
    },
    thunkAPI
  ) => {
    return new Promise<any>(async (resolve, reject) => {
      const state = thunkAPI.getState();
      // @ts-ignore
      const chain: ChainStateType = state.chain;
      getERC20Balance(contractAddress, address, chain.rpcUrl as string)
        .then((balance) => {
          const bal = ethers.utils.formatUnits(balance, decimals);
          thunkAPI.dispatch(
            fetchApproval({
              contractAddress,
              address,
              spender: bridge,
              decimals,
            })
          );
          resolve(bal);
        })
        .catch((err) => {
          reject(err);
        });
    });
  }
);

export const setNativeBalanceThunk = createAsyncThunk(
  "BALANCE/FETCH_BALANCE",
  async (balance: string, thunkAPI) => {
    return new Promise<any>(async (resolve, reject) => {
      resolve(balance);
    });
  }
);

export const fetchUsdPrice = createAsyncThunk(
  'BALANCE/FETCH_USD_PRICE',
  async (controller: AbortController) => {
    return new Promise<any>(async (resolve, reject) => {
      fetchTokenPrice("fuse-network-token").then(price => {
        resolve(price)
      }).catch((error) => {
        reject(error)
      })
      controller.signal.addEventListener('abort', () => reject());
    })
  }
)

export const fetchApproval = createAsyncThunk(
  "BALANCE/FETCH_APPROVAL",
  async (
    {
      contractAddress,
      address,
      spender,
      decimals = 18,
    }: {
      contractAddress: string;
      address: string;
      spender: string;
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
      contractAddress: string;
      bridge: string;
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
  extraReducers: {
    [fetchBalance.pending.type]: (state, action) => {
      state.isBalanceLoading = true;
    },
    [fetchBalance.fulfilled.type]: (state, action) => {
      state.balance = action.payload;
      state.isBalanceLoading = false;
    },
    [fetchBalance.rejected.type]: (state, action) => {
      state.isBalanceLoading = false;
      state.isError = true;
    },
    [fetchApproval.pending.type]: (state, action) => {
      state.isApprovalLoading = true;
    },
    [fetchApproval.fulfilled.type]: (state, action) => {
      state.approval = action.payload;
      state.isApprovalLoading = false;
    },
    [fetchApproval.rejected.type]: (state, action) => {
      state.isApprovalLoading = false;
      state.isError = true;
    },
    [fetchLiquidity.pending.type]: (state, action) => {
      state.isLiquidityLoading = true;
    },
    [fetchLiquidity.fulfilled.type]: (state, action) => {
      state.liquidity = action.payload;
      state.isLiquidityLoading = false;
    },
    [fetchLiquidity.rejected.type]: (state, action) => {
      state.isLiquidityLoading = false;
      state.isError = true;
    },
    [setNativeBalanceThunk.fulfilled.type]: (state, action) => {
      state.balance = action.payload;
      state.isBalanceLoading = false;
    },
    [fetchUsdPrice.pending.type]: (state, action) => {
      state.isUsdPriceLoading = true;
    },
    [fetchUsdPrice.fulfilled.type]: (state, action) => {
      state.price = action.payload;
      state.isUsdPriceLoading = false;
    },
    [fetchUsdPrice.rejected.type]: (state, action) => {
      state.isUsdPriceLoading = false;
    },
  },
});

export const selectBalanceSlice = (state: AppState): BalanceStateType =>
  state.balance;

export default balanceSlice.reducer;

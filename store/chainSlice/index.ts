import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { AppState } from "../rootReducer";

export interface ChainStateType {
  lzChainId: number;
  chainId: number;
  name: string;
  icon: string;
  wrapped: string | undefined;
  rpcUrl: string | undefined;
  tokens:
    | {
        decimals: number;
        symbol: string;
        name: string;
        address: string;
        icon: string;
      }[];
}

const INIT_STATE: ChainStateType = {
  lzChainId: 0,
  chainId: 0,
  name: "",
  icon: "",
  wrapped: "",
  tokens: [],
  rpcUrl: "",
};

export const setChain = createAsyncThunk(
  "CHAIN_STATE/SET_CHAIN",
  async (chain: ChainStateType, thunkAPI) => {
    return new Promise<any>(async (resolve, reject) => {
      resolve(chain);
    });
  }
);

const chainSlice = createSlice({
  name: "CHAIN_STATE",
  initialState: INIT_STATE,
  extraReducers: (builder) => {
    builder.addCase(setChain.fulfilled, (state, action) => {
      state.chainId = action.payload.chainId;
      state.icon = action.payload.icon;
      state.lzChainId = action.payload.lzChainId;
      state.name = action.payload.name;
      state.rpcUrl = action.payload.rpcUrl;
      state.tokens = action.payload.tokens;
    });
  },
  reducers: {},
});

export const selectChainSlice = (state: AppState): ChainStateType =>
  state.chain;

export default chainSlice.reducer;

import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { AppState } from "../rootReducer";
import { appConfig } from "@/lib/config";
import { getERC20Balance } from "@/lib/erc20";
import { ethers } from "ethers";

export interface LiquidityStateType {
    chains: Array<any>;
    amount: string;
}

const INIT_STATE: LiquidityStateType = {
    chains: [],
    amount: "0",
};

export const fetchAvailableLiquidityOnChains = createAsyncThunk(
    "LIQUIDITY/FETCH_AVAILABLE_LIQUIDITY_ON_CHAINS",
    async ({ token, amount }: { token: string, amount: string }, thunkAPI) => {
        return new Promise<any>((resolve, reject) => {
            let chainsToFetch: Array<any> = [];
            for (let chain of appConfig.wrappedBridge.chains) {
                for (let tokens of chain.tokens) {
                    if (tokens.symbol === token) {
                        chainsToFetch.push({
                            contract: tokens.address,
                            decimals: tokens.decimals,
                            ...chain
                        });
                        continue
                    }
                }
            }
            Promise.all(
                chainsToFetch.map(async (chain, i) => {
                    let liquidity = await getERC20Balance(chain.contract, chain.original, chain.rpcUrl);
                    chainsToFetch[i].liquidity = ethers.utils.formatUnits(liquidity, chain.decimals);
                })
            )
                .then(() => {
                    resolve({ chainsToFetch, amount });
                })
                .catch((error) => {
                    reject(error);
                });
        });
    }
);

const liquiditySlice = createSlice({
    name: "LIQUIDITY_STATE",
    initialState: INIT_STATE,
    reducers: {},
    extraReducers: {
        [fetchAvailableLiquidityOnChains.fulfilled.type]: (state, action) => {
            state.chains = action.payload.chainsToFetch;
            console.log(action.payload.chainsToFetch);
            state.amount = action.payload.amount
        },
    },
});

export const selectLiquiditySlice = (state: AppState): LiquidityStateType =>
    state.liquidity;

export default liquiditySlice.reducer;

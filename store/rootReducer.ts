import {
  combineReducers,
  Reducer,
  UnknownAction,
} from "@reduxjs/toolkit";
import validatorReducer from './validatorSlice';
import searchReducer from './searchSlice';
import chainReducer from "./chainSlice";
import balanceReducer from "./balanceSlice";
import contractReducer from "./contractSlice";
import transactionReducer from "./transactionsSlice";
import feeReducer from "./feeSlice";
import toastReducer from "./toastSlice";
import navbarReducer from "./navbarSlice";
import operatorReducer from "./operatorSlice";
import liquidityReducer from "./liquiditySlice";
import selectedChainReducer from "./selectedChainSlice";
import chargeReducer from "./chargeSlice";
import nodesReducer from "./nodesSlice";
import airdropReducer from "./airdropSlice";

const appReducer = combineReducers({
  validator: validatorReducer,
  search: searchReducer,
  chain: chainReducer,
  balance: balanceReducer,
  contract: contractReducer,
  transactions: transactionReducer,
  fee: feeReducer,
  toast: toastReducer,
  navbar: navbarReducer,
  operator: operatorReducer,
  liquidity: liquidityReducer,
  selectedChain: selectedChainReducer,
  charge: chargeReducer,
  nodes: nodesReducer,
  airdrop: airdropReducer,
});

export type AppState = {
  validator: ReturnType<typeof validatorReducer>;
  search: ReturnType<typeof searchReducer>;
  chain: ReturnType<typeof chainReducer>;
  balance: ReturnType<typeof balanceReducer>;
  contract: ReturnType<typeof contractReducer>;
  transactions: ReturnType<typeof transactionReducer>;
  fee: ReturnType<typeof feeReducer>;
  toast: ReturnType<typeof toastReducer>;
  navbar: ReturnType<typeof navbarReducer>;
  operator: ReturnType<typeof operatorReducer>;
  liquidity: ReturnType<typeof liquidityReducer>;
  selectedChain: ReturnType<typeof selectedChainReducer>;
  charge: ReturnType<typeof chargeReducer>;
  nodes: ReturnType<typeof nodesReducer>;
  airdrop: ReturnType<typeof airdropReducer>;
};

const rootReducer: Reducer = (state: AppState, action: UnknownAction) => {
  return appReducer(state, action);
};

export default rootReducer;

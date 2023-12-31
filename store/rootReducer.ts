import {
  AnyAction,
  CombinedState,
  combineReducers,
  Reducer,
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
});

export type AppState = CombinedState<{
  validator: ReturnType<typeof validatorReducer>;
  search: ReturnType<typeof searchReducer>;
  chain: ReturnType<typeof chainReducer>;
  balance: ReturnType<typeof balanceReducer>;
  contract: ReturnType<typeof contractReducer>;
  transactions: ReturnType<typeof transactionReducer>;
  fee: ReturnType<typeof feeReducer>;
  toast: ReturnType<typeof toastReducer>;
  navbar: ReturnType<typeof navbarReducer>;
}>;

const rootReducer: Reducer = (state: AppState, action: AnyAction) => {
  return appReducer(state, action);
};

export default rootReducer;

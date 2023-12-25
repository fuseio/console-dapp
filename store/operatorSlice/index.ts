import { PayloadAction, createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { AppState } from "../rootReducer";
import { Signer } from "ethers";
import { FuseSDK } from "@fuseio/fusebox-web-sdk";
import { hex } from "@/lib/helpers";
import { Operator, OperatorContactDetail, SignData } from "@/lib/types";
import { fetchCurrentOperator, postCreateOperator, postValidateOperator } from "@/lib/api";
import { RootState } from "../store";
import { Address } from "abitype";

const initOperator: Operator = {
  user: {
    name: "",
    email: "",
    auth0Id: "",
    smartContractAccountAddress: hex,
  },
  project: {
    ownerId: "",
    name: "",
    description: "",
    publicKey: "",
  }
}

export interface OperatorStateType {
  isSignUpModalOpen: boolean;
  isLoginModalOpen: boolean;
  isLoggedIn: boolean;
  isLoginError: boolean;
  isAccountCreationModalOpen: boolean;
  isCongratulationModalOpen: boolean;
  isTopupAccountModalOpen: boolean;
  accessToken: string;
  validateRedirectRoute: string;
  operator: Operator;
}

const INIT_STATE: OperatorStateType = {
  isSignUpModalOpen: false,
  isLoginModalOpen: false,
  isLoggedIn: false,
  isLoginError: false,
  isAccountCreationModalOpen: false,
  isCongratulationModalOpen: false,
  isTopupAccountModalOpen: false,
  accessToken: "",
  validateRedirectRoute: "",
  operator: initOperator,
};

export const validateOperator = createAsyncThunk(
  "OPERATOR/VALIDATE_OPERATOR",
  async ({
    signData,
    route,
  }: {
    signData: SignData;
    route: string
  }) => {
    return new Promise<any>(async (resolve, reject) => {
      const accessToken = await postValidateOperator(signData);
      if (accessToken) {
        resolve({ accessToken, route });
      } else {
        reject();
      }
    });
  }
);

export const fetchOperator = createAsyncThunk<
  any,
  {
    signer: Signer;
  },
  { state: RootState }
>(
  "OPERATOR/FETCH_OPERATOR",
  async (
    {
      signer,
    }: {
      signer: Signer;
    },
    thunkAPI
  ) => {
    return new Promise<any>(async (resolve, reject) => {
      try {
        const state = thunkAPI.getState();
        const operatorState: OperatorStateType = state.operator;
        const operator = await fetchCurrentOperator(operatorState.accessToken)
        const fuseSDK = await FuseSDK.init(operator.project.publicKey, signer);
        const smartContractAccountAddress = fuseSDK.wallet.getSender() as Address;
        if (operator) {
          resolve({ operator, smartContractAccountAddress });
        } else {
          reject();
        }
      } catch (error) {
        console.log(error)
        reject();
      }
    });
  }
);

export const createOperator = createAsyncThunk<
  any,
  {
    signer: Signer;
    operatorContactDetail: OperatorContactDetail;
  },
  { state: RootState }
>(
  "OPERATOR/CREATE_OPERATOR",
  async (
    {
      signer,
      operatorContactDetail,
    }: {
      signer: Signer;
      operatorContactDetail: OperatorContactDetail;
    },
    thunkAPI
  ) => {
    return new Promise<any>(async (resolve, reject) => {
      const state = thunkAPI.getState();
      const operatorState: OperatorStateType = state.operator;
      const operator = await postCreateOperator(operatorContactDetail, operatorState.accessToken)
      const fuseSDK = await FuseSDK.init(operator.project.publicKey, signer);
      const smartContractAccountAddress = fuseSDK.wallet.getSender() as Address;

      if (operator) {
        resolve({ operator, smartContractAccountAddress });
      } else {
        reject();
      }
    });
  }
);

const operatorSlice = createSlice({
  name: "OPERATOR_STATE",
  initialState: INIT_STATE,
  reducers: {
    setIsSignUpModalOpen: (state, action: PayloadAction<boolean>) => {
      state.isSignUpModalOpen = action.payload
    },
    setIsLoginModalOpen: (state, action: PayloadAction<boolean>) => {
      state.isLoginModalOpen = action.payload
    },
    setIsLoggedIn: (state, action: PayloadAction<boolean>) => {
      state.isLoggedIn = action.payload
    },
    setIsLoginError: (state, action: PayloadAction<boolean>) => {
      state.isLoginError = action.payload
    },
    setIsAccountCreationModalOpen: (state, action: PayloadAction<boolean>) => {
      state.isAccountCreationModalOpen = action.payload
    },
    setIsCongratulationModalOpen: (state, action: PayloadAction<boolean>) => {
      state.isCongratulationModalOpen = action.payload
    },
    setIsTopupAccountModalOpen: (state, action: PayloadAction<boolean>) => {
      state.isTopupAccountModalOpen = action.payload
    },
    setLogout: (state) => {
      state.accessToken = "";
      state.operator = initOperator;
      localStorage.removeItem("Fuse-operatorAccessToken");
      localStorage.removeItem("Fuse-operator");
    }
  },
  extraReducers: {
    [validateOperator.fulfilled.type]: (state, action) => {
      state.accessToken = action.payload.accessToken;
      state.validateRedirectRoute = action.payload.route;
      localStorage.setItem("Fuse-operatorAccessToken", action.payload.accessToken);
    },
    [fetchOperator.fulfilled.type]: (state, action) => {
      state.operator = action.payload.operator;
      state.operator.user.smartContractAccountAddress = action.payload.smartContractAccountAddress;
      localStorage.setItem("Fuse-operator", JSON.stringify(state.operator));
      state.isLoggedIn = true;
    },
    [fetchOperator.rejected.type]: (state) => {
      state.isLoginError = true;
    },
    [createOperator.pending.type]: (state) => {
      state.isAccountCreationModalOpen = true;
    },
    [createOperator.fulfilled.type]: (state, action) => {
      state.operator = action.payload.operator;
      state.operator.user.smartContractAccountAddress = action.payload.smartContractAccountAddress;
      localStorage.setItem("Fuse-operator", JSON.stringify(state.operator));
      state.isAccountCreationModalOpen = false;
      state.isCongratulationModalOpen = true;
    },
    [createOperator.rejected.type]: (state) => {
      state.isAccountCreationModalOpen = false;
    },
  },
});

export const selectOperatorSlice = (state: AppState): OperatorStateType => state.operator;

export const {
  setIsSignUpModalOpen,
  setIsLoginModalOpen,
  setIsLoggedIn,
  setIsLoginError,
  setIsAccountCreationModalOpen,
  setIsCongratulationModalOpen,
  setIsTopupAccountModalOpen,
  setLogout
} = operatorSlice.actions;

export default operatorSlice.reducer;

import { PayloadAction, createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { AppState } from "../rootReducer";
import { Signer } from "ethers";
import { FuseSDK } from "@fuseio/fusebox-web-sdk";
import { hex } from "@/lib/helpers";
import { Operator, OperatorContactDetail, SignData } from "@/lib/types";
import { fetchCurrentOperator, postCreateApiSecretKey, postCreateOperator, postValidateOperator, updateApiSecretKey } from "@/lib/api";
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
    id: "",
    ownerId: "",
    name: "",
    description: "",
    publicKey: "",
    secretKey: "",
    secretPrefix: "",
    secretLastFourChars: "",
  }
}

export interface OperatorStateType {
  isLogin: boolean;
  isLoggedIn: boolean;
  isLoginError: boolean;
  isAuthenticated: boolean;
  isHydrated: boolean;
  isValidated: boolean;
  isValidatingOperator: boolean;
  isFetchingOperator: boolean;
  isOperatorWalletModalOpen: boolean;
  isContactDetailsModalOpen: boolean;
  isAccountCreationModalOpen: boolean;
  isCongratulationModalOpen: boolean;
  isTopupAccountModalOpen: boolean;
  isGeneratingSecretApiKey: boolean;
  isYourSecretKeyModalOpen: boolean;
  isRollSecretKeyModalOpen: boolean;
  redirect: string;
  signature: string;
  accessToken: string;
  operator: Operator;
}

const INIT_STATE: OperatorStateType = {
  isLogin: false,
  isLoggedIn: false,
  isLoginError: false,
  isAuthenticated: false,
  isHydrated: false,
  isValidated: false,
  isValidatingOperator: false,
  isFetchingOperator: false,
  isOperatorWalletModalOpen: false,
  isContactDetailsModalOpen: false,
  isAccountCreationModalOpen: false,
  isCongratulationModalOpen: false,
  isTopupAccountModalOpen: false,
  isGeneratingSecretApiKey: false,
  isYourSecretKeyModalOpen: false,
  isRollSecretKeyModalOpen: false,
  redirect: "",
  signature: "",
  accessToken: "",
  operator: initOperator,
};

export const validateOperator = createAsyncThunk(
  "OPERATOR/VALIDATE_OPERATOR",
  async ({
    signData,
  }: {
    signData: SignData;
  }) => {
    return new Promise<any>(async (resolve, reject) => {
      const accessToken = await postValidateOperator(signData);
      if (accessToken) {
        resolve({ accessToken, signature: signData.signature });
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
        const fuseSDK = await FuseSDK.init(
          operator.project.publicKey,
          signer,
          {
            jwtToken: operatorState.accessToken,
            signature: operatorState.signature
          }
        );
        const smartContractAccountAddress = fuseSDK.wallet.getSender() as Address;
        if (operator) {
          resolve({ operator, smartContractAccountAddress });
        } else {
          reject();
        }
      } catch (error) {
        console.log(error);
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
      const fuseSDK = await FuseSDK.init(
        operator.project.publicKey,
        signer,
        {
          jwtToken: operatorState.accessToken,
          signature: operatorState.signature
        }
      );
      const smartContractAccountAddress = fuseSDK.wallet.getSender() as Address;

      if (operator) {
        resolve({ operator, smartContractAccountAddress });
      } else {
        reject();
      }
    });
  }
);

export const generateSecretApiKey = createAsyncThunk<
  any,
  undefined,
  { state: RootState }
>(
  "OPERATOR/GENERATE_SECRET_API_KEY",
  async (
    _,
    thunkAPI
  ) => {
    return new Promise<any>(async (resolve, reject) => {
      const state = thunkAPI.getState();
      const operatorState: OperatorStateType = state.operator;
      const { secretKey } = await postCreateApiSecretKey(operatorState.operator.project.id, operatorState.accessToken);
      if (secretKey) {
        resolve(secretKey);
      } else {
        reject();
      }
    });
  }
);

export const regenerateSecretApiKey = createAsyncThunk<
  any,
  undefined,
  { state: RootState }
>(
  "OPERATOR/REGENERATE_SECRET_API_KEY",
  async (
    _,
    thunkAPI
  ) => {
    return new Promise<any>(async (resolve, reject) => {
      const state = thunkAPI.getState();
      const operatorState: OperatorStateType = state.operator;
      const { secretKey } = await updateApiSecretKey(operatorState.operator.project.id, operatorState.accessToken);
      if (secretKey) {
        resolve(secretKey);
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
    setIsLogin: (state, action: PayloadAction<boolean>) => {
      state.isLogin = action.payload
    },
    setIsLoggedIn: (state, action: PayloadAction<boolean>) => {
      state.isLoggedIn = action.payload
    },
    setIsLoginError: (state, action: PayloadAction<boolean>) => {
      state.isLoginError = action.payload
    },
    setIsValidated: (state, action: PayloadAction<boolean>) => {
      state.isValidated = action.payload
    },
    setIsContactDetailsModalOpen: (state, action: PayloadAction<boolean>) => {
      state.isContactDetailsModalOpen = action.payload
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
    setIsYourSecretKeyModalOpen: (state, action: PayloadAction<boolean>) => {
      state.isYourSecretKeyModalOpen = action.payload
    },
    setIsRollSecretKeyModalOpen: (state, action: PayloadAction<boolean>) => {
      state.isRollSecretKeyModalOpen = action.payload
    },
    setIsOperatorWalletModalOpen: (state, action: PayloadAction<boolean>) => {
      state.isOperatorWalletModalOpen = action.payload
    },
    setRedirect: (state, action: PayloadAction<string>) => {
      state.redirect = action.payload
    },
    setOperator: (state, action: PayloadAction<Operator>) => {
      state.operator = action.payload
    },
    setLogout: (state) => {
      state.accessToken = "";
      state.operator = initOperator;
      state.signature = "";
      state.isAuthenticated = false;
      localStorage.removeItem("Fuse-operatorAccessToken");
      localStorage.removeItem("Fuse-operator");
      localStorage.removeItem("Fuse-operatorEoaSignature");
      localStorage.removeItem("Fuse-isOperatorAuthenticated");
      localStorage.removeItem("Fuse-isLoginError");
    },
    setHydrate: (state) => {
      const accessToken = localStorage.getItem("Fuse-operatorAccessToken");
      const operator = localStorage.getItem("Fuse-operator");
      const signature = localStorage.getItem("Fuse-operatorEoaSignature");
      const isAuthenticated = localStorage.getItem("Fuse-isOperatorAuthenticated");
      state.accessToken = accessToken ?? "";
      state.operator = operator ? JSON.parse(operator) : initOperator;
      state.signature = signature ?? "";
      state.isAuthenticated = isAuthenticated ? JSON.parse(isAuthenticated) : false;
      state.isHydrated = true;
    }
  },
  extraReducers: {
    [validateOperator.pending.type]: (state) => {
      state.isValidatingOperator = true;
    },
    [validateOperator.fulfilled.type]: (state, action) => {
      state.isValidatingOperator = false;
      state.accessToken = action.payload.accessToken;
      state.signature = action.payload.signature;
      state.isValidated = true;
      localStorage.setItem("Fuse-operatorAccessToken", action.payload.accessToken);
      localStorage.setItem("Fuse-operatorEoaSignature", action.payload.signature);
    },
    [validateOperator.rejected.type]: (state) => {
      state.isValidatingOperator = false;
    },
    [fetchOperator.pending.type]: (state) => {
      state.isFetchingOperator = true;
    },
    [fetchOperator.fulfilled.type]: (state, action) => {
      state.isFetchingOperator = false;
      state.operator = action.payload.operator;
      state.operator.user.smartContractAccountAddress = action.payload.smartContractAccountAddress;
      state.isLoggedIn = true;
      state.isAuthenticated = true;
      localStorage.setItem("Fuse-operator", JSON.stringify(state.operator));
      localStorage.setItem("Fuse-isOperatorAuthenticated", "true");
    },
    [fetchOperator.rejected.type]: (state) => {
      state.isFetchingOperator = false;
      state.isLoginError = true;
      localStorage.setItem("Fuse-isLoginError", "true");
    },
    [createOperator.pending.type]: (state) => {
      state.isContactDetailsModalOpen = false;
      state.isAccountCreationModalOpen = true;
    },
    [createOperator.fulfilled.type]: (state, action) => {
      state.operator = action.payload.operator;
      state.operator.user.smartContractAccountAddress = action.payload.smartContractAccountAddress;
      state.isAuthenticated = true;
      state.isAccountCreationModalOpen = false;
      state.isCongratulationModalOpen = true;
      localStorage.setItem("Fuse-operator", JSON.stringify(state.operator));
      localStorage.setItem("Fuse-isOperatorAuthenticated", "true");
    },
    [createOperator.rejected.type]: (state) => {
      state.isAccountCreationModalOpen = false;
    },
    [generateSecretApiKey.pending.type]: (state) => {
      state.isGeneratingSecretApiKey = true;
    },
    [generateSecretApiKey.fulfilled.type]: (state, action) => {
      state.isGeneratingSecretApiKey = false;
      state.operator.project.secretKey = action.payload;
      state.isYourSecretKeyModalOpen = true;
    },
    [generateSecretApiKey.rejected.type]: (state) => {
      state.isGeneratingSecretApiKey = false;
    },
    [regenerateSecretApiKey.pending.type]: (state) => {
      state.isGeneratingSecretApiKey = true;
    },
    [regenerateSecretApiKey.fulfilled.type]: (state, action) => {
      state.isGeneratingSecretApiKey = false;
      state.operator.project.secretKey = action.payload;
      state.isRollSecretKeyModalOpen = false;
      state.isYourSecretKeyModalOpen = true;
    },
    [regenerateSecretApiKey.rejected.type]: (state) => {
      state.isGeneratingSecretApiKey = false;
    },
  },
});

export const selectOperatorSlice = (state: AppState): OperatorStateType => state.operator;

export const {
  setIsLogin,
  setIsLoggedIn,
  setIsLoginError,
  setIsValidated,
  setIsOperatorWalletModalOpen,
  setIsContactDetailsModalOpen,
  setIsAccountCreationModalOpen,
  setIsCongratulationModalOpen,
  setIsTopupAccountModalOpen,
  setIsYourSecretKeyModalOpen,
  setIsRollSecretKeyModalOpen,
  setRedirect,
  setOperator,
  setLogout,
  setHydrate
} = operatorSlice.actions;

export default operatorSlice.reducer;

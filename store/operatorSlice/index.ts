import { PayloadAction, createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { AppState } from "../rootReducer";
import { Signer, ethers } from "ethers";
import { FuseSDK } from "@fuseio/fusebox-web-sdk";
import { hex, splitSecretKey } from "@/lib/helpers";
import { Operator, OperatorContactDetail, SignData, Withdraw } from "@/lib/types";
import { checkActivated, checkOperatorExist, fetchAddressTokenBalances, fetchCurrentOperator, fetchSponsoredTransactionCount, postCreateApiSecretKey, postCreateOperator, postCreatePaymaster, postValidateOperator, updateApiSecretKey } from "@/lib/api";
import { RootState } from "../store";
import { Address } from "abitype";
import { parseEther, parseUnits } from "ethers/lib/utils";
import { CONFIG, NEXT_PUBLIC_FUSE_API_BASE_URL } from "@/lib/config";
import { PaymasterAbi } from "@/lib/abi/Paymaster";
import { getSponsorIdBalance } from "@/lib/contractInteract";
import * as amplitude from "@amplitude/analytics-browser";
import { getERC20Balance } from "@/lib/erc20";
import { ERC20ABI } from "@/lib/abi/ERC20";
import { formatUnits } from "viem";

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
    sponsorId: "",
  }
}

const initOperatorContactDetail: OperatorContactDetail = {
  firstName: "",
  lastName: "",
  email: "",
}

const initWithdraw: Withdraw = {
  amount: "",
  token: "",
  coinGeckoId: "",
}

export interface OperatorStateType {
  isLogin: boolean;
  isLoggedIn: boolean;
  isLoginError: boolean;
  isOperatorExist: boolean;
  isAuthenticated: boolean;
  isHydrated: boolean;
  isValidated: boolean;
  isActivated: boolean;
  isWithdrawn: boolean;
  isCheckingOperator: boolean;
  isValidatingOperator: boolean;
  isFetchingOperator: boolean;
  isOperatorWalletModalOpen: boolean;
  isContactDetailsModalOpen: boolean;
  isAccountCreationModalOpen: boolean;
  isCongratulationModalOpen: boolean;
  isTopupAccountModalOpen: boolean;
  isWithdrawModalOpen: boolean;
  isTopupPaymasterModalOpen: boolean;
  isGeneratingSecretApiKey: boolean;
  isYourSecretKeyModalOpen: boolean;
  isRollSecretKeyModalOpen: boolean;
  isFetchingSponsorIdBalance: boolean;
  isFetchingErc20Balance: boolean;
  isCreatingPaymaster: boolean;
  isFundingPaymaster: boolean;
  isWithdrawing: boolean;
  isCheckingActivation: boolean;
  isFetchingSponsoredTransactions: boolean;
  sponsoredTransactions: number;
  sponsorIdBalance: string;
  erc20Balance: string;
  redirect: string;
  signature: string;
  accessToken: string;
  withdraw: Withdraw;
  operatorContactDetail: OperatorContactDetail;
  operator: Operator;
  isFetchingTokenBalances: boolean;
  totalTokenBalance: number;
}

const INIT_STATE: OperatorStateType = {
  isLogin: false,
  isLoggedIn: false,
  isLoginError: false,
  isAuthenticated: false,
  isOperatorExist: false,
  isHydrated: false,
  isValidated: false,
  isActivated: false,
  isWithdrawn: false,
  isCheckingOperator: false,
  isValidatingOperator: false,
  isFetchingOperator: false,
  isOperatorWalletModalOpen: false,
  isContactDetailsModalOpen: false,
  isAccountCreationModalOpen: false,
  isCongratulationModalOpen: false,
  isTopupAccountModalOpen: false,
  isWithdrawModalOpen: false,
  isTopupPaymasterModalOpen: false,
  isGeneratingSecretApiKey: false,
  isYourSecretKeyModalOpen: false,
  isRollSecretKeyModalOpen: false,
  isFetchingSponsorIdBalance: false,
  isFetchingErc20Balance: false,
  isCreatingPaymaster: false,
  isFundingPaymaster: false,
  isWithdrawing: false,
  isCheckingActivation: false,
  isFetchingSponsoredTransactions: false,
  sponsoredTransactions: 0,
  sponsorIdBalance: "",
  erc20Balance: "",
  redirect: "",
  signature: "",
  accessToken: "",
  withdraw: initWithdraw,
  operatorContactDetail: initOperatorContactDetail,
  operator: initOperator,
  isFetchingTokenBalances: false,
  totalTokenBalance: 0,
};

export const checkOperator = createAsyncThunk(
  "OPERATOR/CHECK_OPERATOR",
  async ({
    address,
  }: {
    address: Address;
  }) => {
    return new Promise<any>(async (resolve, reject) => {
      try {
        const operator = await checkOperatorExist(address);
        if (operator.status === 200) {
          resolve("exists");
        } else {
          reject();
        }
      } catch (error) {
        console.error(error);
        reject();
      }
    });
  }
);

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
            baseUrl: NEXT_PUBLIC_FUSE_API_BASE_URL,
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
          baseUrl: NEXT_PUBLIC_FUSE_API_BASE_URL,
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

export const fetchSponsorIdBalance = createAsyncThunk<
  any,
  undefined,
  { state: RootState }
>(
  "OPERATOR/FETCH_SPONSOR_ID_BALANCE",
  async (
    _,
    thunkAPI
  ) => {
    return new Promise<any>(async (resolve, reject) => {
      try {
        const state = thunkAPI.getState();
        const operatorState: OperatorStateType = state.operator;
        const balance = await getSponsorIdBalance(operatorState.operator.project.sponsorId)
        resolve(balance);
      } catch (error) {
        console.log(error);
        reject(error);
      }
    });
  }
);

export const createPaymaster = createAsyncThunk<
  any,
  undefined,
  { state: RootState }
>(
  "OPERATOR/CREATE_PAYMASTER",
  async (
    _,
    thunkAPI
  ) => {
    return new Promise<any>(async (resolve, reject) => {
      const state = thunkAPI.getState();
      const operatorState: OperatorStateType = state.operator;
      const paymasters = await postCreatePaymaster(operatorState.operator.project.id, operatorState.accessToken)
      if (paymasters?.[0]?.sponsorId) {
        resolve(paymasters[0].sponsorId);
      } else {
        reject();
      }
    });
  }
);

export const fundPaymaster = createAsyncThunk<
  any,
  {
    signer: Signer;
    amount: string;
  },
  { state: RootState }
>(
  "OPERATOR/FUND_PAYMASTER",
  async (
    {
      signer,
      amount,
    }: {
      signer: Signer;
      amount: string;
    },
    thunkAPI
  ) => {
    return new Promise<any>(async (resolve, reject) => {
      try {
        const state = thunkAPI.getState();
        const operatorState: OperatorStateType = state.operator;
        const paymasterContract = new ethers.Contract(CONFIG.paymasterAddress, PaymasterAbi);
        const value = parseEther(amount);
        const data = ethers.utils.arrayify(paymasterContract.interface.encodeFunctionData(
          "depositFor",
          [operatorState.operator.project.sponsorId]
        ));

        const fuseSDK = await FuseSDK.init(
          operatorState.operator.project.publicKey,
          signer,
          {
            baseUrl: NEXT_PUBLIC_FUSE_API_BASE_URL,
            jwtToken: operatorState.accessToken,
            signature: operatorState.signature
          }
        );
        const userOp = await fuseSDK.callContract(CONFIG.paymasterAddress, value, data);
        const result = await userOp?.wait();
        const transactionHash = result?.transactionHash;

        if (transactionHash) {
          amplitude.track("Paymaster Balance Funded", { amount: parseFloat(amount) });
          resolve(transactionHash);
        } else {
          reject();
        }
      } catch (error) {
        console.log(error);
        reject(error);
      }
    });
  }
);

export const fetchErc20Balance = createAsyncThunk(
  "OPERATOR/FETCH_ERC20_BALANCE",
  async ({
    contractAddress,
    address,
    decimals
  }: {
    contractAddress: Address,
    address: Address,
    decimals: number,
  }) => {
    return new Promise<any>(async (resolve, reject) => {
      try {
        const balance = await getERC20Balance(contractAddress, address, CONFIG.fuseRPC)
        const formattedBalance = ethers.utils.formatUnits(balance, decimals);
        resolve(formattedBalance);
      } catch (error) {
        console.log(error);
        reject(error);
      }
    });
  }
);

export const withdraw = createAsyncThunk<
  any,
  {
    signer: Signer;
    amount: string;
    to: string;
    decimals: number;
    token: string;
    coinGeckoId: string;
    contractAddress?: string;
  },
  { state: RootState }
>(
  "OPERATOR/WITHDRAW",
  async (
    {
      signer,
      amount,
      to,
      decimals,
      token,
      coinGeckoId,
      contractAddress,
    }: {
      signer: Signer;
      amount: string;
      to: string;
      decimals: number;
      token: string;
      coinGeckoId: string;
      contractAddress?: string;
    },
    thunkAPI
  ) => {
    return new Promise<any>(async (resolve, reject) => {
      try {
        const state = thunkAPI.getState();
        const operatorState: OperatorStateType = state.operator;

        let recipient = to;
        let value = parseEther(amount);
        let data = Uint8Array.from([]);
        let withPaymaster = false;

        if (contractAddress) {
          const erc20Contract = new ethers.Contract(contractAddress as string, ERC20ABI);
          recipient = contractAddress;
          value = parseEther("0");
          data = ethers.utils.arrayify(erc20Contract.interface.encodeFunctionData(
            "transfer",
            [to, parseUnits(amount, decimals)]
          ));
        }

        if (operatorState.isActivated) {
          withPaymaster = true;
        }

        const fuseSDK = await FuseSDK.init(
          operatorState.operator.project.publicKey,
          signer,
          {
            withPaymaster,
            baseUrl: NEXT_PUBLIC_FUSE_API_BASE_URL,
            jwtToken: operatorState.accessToken,
            signature: operatorState.signature
          }
        );

        const userOp = await fuseSDK.callContract(
          recipient,
          value,
          data
        );
        const result = await userOp?.wait();
        const transactionHash = result?.transactionHash;

        if (transactionHash) {
          resolve({ amount, token, coinGeckoId });
        } else {
          reject();
        }
      } catch (error) {
        console.log(error);
        reject(error);
      }
    });
  }
);

export const checkIsActivated = createAsyncThunk<
  any,
  undefined,
  { state: RootState }
>(
  "OPERATOR/IS_ACTIVATED",
  async (_, thunkAPI) => {
    return new Promise<any>(async (resolve, reject) => {
      try {
        const state = thunkAPI.getState();
        const operatorState: OperatorStateType = state.operator;
        const operator = await checkActivated(operatorState.accessToken);
        if (operator.status === 200) {
          resolve("activated");
        } else {
          reject();
        }
      } catch (error: any) {
        if (error?.response?.status === 404) {
          const DEPOSIT_REQUIRED = 10;
          console.log(`Error 404: Operator Wallet is not activated, deposit ${DEPOSIT_REQUIRED} FUSE to activate.`)
        } else {
          console.error(error);
        }
        reject();
      }
    });
  }
);

export const fetchSponsoredTransactions = createAsyncThunk<
  any,
  undefined,
  { state: RootState }
>(
  "OPERATOR/FETCH_SPONSORED_TRANSACTIONS",
  async (
    _,
    thunkAPI
  ) => {
    return new Promise<any>(async (resolve, reject) => {
      try {
        const state = thunkAPI.getState();
        const operatorState: OperatorStateType = state.operator;
        const sponsoredTransactionCount = await fetchSponsoredTransactionCount(operatorState.accessToken)
        resolve(sponsoredTransactionCount.sponsoredTransactions);
      } catch (error) {
        console.log(error);
        reject(error);
      }
    });
  }
);

export const fetchTokenBalances = createAsyncThunk(
  "OPERATOR/FETCH_TOKEN_BALANCES",
  async ({
    address,
  }: {
    address: Address,
  }) => {
    try {
      const tokenBalances = await fetchAddressTokenBalances(address);
      let totalTokenBalance = 0;
      tokenBalances.map((tokenBalance) => {
        totalTokenBalance += parseFloat(formatUnits(BigInt(tokenBalance.value), parseFloat(tokenBalance.token.decimals))) * parseFloat(tokenBalance.token.exchange_rate);
      });
      return totalTokenBalance;
    } catch (error) {
      console.log(error);
      throw error;
    }
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
    setIsWithdrawModalOpen: (state, action: PayloadAction<boolean>) => {
      state.isWithdrawModalOpen = action.payload
    },
    setIsTopupPaymasterModalOpen: (state, action: PayloadAction<boolean>) => {
      state.isTopupPaymasterModalOpen = action.payload
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
    setOperatorContactDetail: (state, action: PayloadAction<OperatorContactDetail>) => {
      state.operatorContactDetail = action.payload
    },
    setOperator: (state, action: PayloadAction<Operator>) => {
      state.operator = action.payload
    },
    setLogout: (state) => {
      state.isOperatorExist = false;
      state.accessToken = "";
      state.operator = initOperator;
      state.signature = "";
      state.isAuthenticated = false;
      state.operatorContactDetail = initOperatorContactDetail;
      state.isActivated = false;
      state.sponsoredTransactions = 0;
      localStorage.removeItem("Fuse-isOperatorExist");
      localStorage.removeItem("Fuse-operatorAccessToken");
      localStorage.removeItem("Fuse-operator");
      localStorage.removeItem("Fuse-operatorEoaSignature");
      localStorage.removeItem("Fuse-isOperatorAuthenticated");
      localStorage.removeItem("Fuse-isLoginError");
      localStorage.removeItem("Fuse-connectedWalletType");
      localStorage.removeItem("Fuse-operatorContactDetail");
      localStorage.removeItem("Fuse-isActivated");
    },
    setHydrate: (state) => {
      const isOperatorExist = localStorage.getItem("Fuse-isOperatorExist");
      const accessToken = localStorage.getItem("Fuse-operatorAccessToken");
      const operator = localStorage.getItem("Fuse-operator");
      const signature = localStorage.getItem("Fuse-operatorEoaSignature");
      const isAuthenticated = localStorage.getItem("Fuse-isOperatorAuthenticated");
      const operatorContactDetail = localStorage.getItem("Fuse-operatorContactDetail");
      const isActivated = localStorage.getItem("Fuse-isActivated");
      state.isOperatorExist = isOperatorExist ? JSON.parse(isOperatorExist) : false;
      state.accessToken = accessToken ?? "";
      state.operator = operator ? JSON.parse(operator) : initOperator;
      state.signature = signature ?? "";
      state.isAuthenticated = isAuthenticated ? JSON.parse(isAuthenticated) : false;
      state.operatorContactDetail = operatorContactDetail ? JSON.parse(operatorContactDetail) : initOperatorContactDetail;
      state.isActivated = isActivated ? JSON.parse(isActivated) : false;
      state.isHydrated = true;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(checkOperator.pending, (state) => {
        state.isCheckingOperator = true;
      })
      .addCase(checkOperator.fulfilled, (state) => {
        state.isCheckingOperator = false;
        state.isOperatorExist = true;
        localStorage.setItem("Fuse-isOperatorExist", "true");
      })
      .addCase(checkOperator.rejected, (state) => {
        state.isCheckingOperator = false;
      })
      .addCase(validateOperator.pending, (state) => {
        state.isValidatingOperator = true;
      })
      .addCase(validateOperator.fulfilled, (state, action) => {
        state.isValidatingOperator = false;
        state.accessToken = action.payload.accessToken;
        state.signature = action.payload.signature;
        state.isValidated = true;
        localStorage.setItem("Fuse-operatorAccessToken", action.payload.accessToken);
        localStorage.setItem("Fuse-operatorEoaSignature", action.payload.signature);
      })
      .addCase(validateOperator.rejected, (state) => {
        state.isValidatingOperator = false;
      })
      .addCase(fetchOperator.pending, (state) => {
        state.isFetchingOperator = true;
      })
      .addCase(fetchOperator.fulfilled, (state, action) => {
        state.isFetchingOperator = false;
        state.operator = action.payload.operator;
        state.operator.user.smartContractAccountAddress = action.payload.smartContractAccountAddress;
        state.isLoggedIn = true;
        state.isAuthenticated = true;
        localStorage.setItem("Fuse-operator", JSON.stringify(state.operator));
        localStorage.setItem("Fuse-isOperatorAuthenticated", "true");
      })
      .addCase(fetchOperator.rejected, (state) => {
        state.isFetchingOperator = false;
        state.isLoginError = true;
        localStorage.setItem("Fuse-isLoginError", "true");
      })
      .addCase(createOperator.pending, (state) => {
        state.isContactDetailsModalOpen = false;
        state.isAccountCreationModalOpen = true;
      })
      .addCase(createOperator.fulfilled, (state, action) => {
        state.operator = action.payload.operator;
        state.operator.user.smartContractAccountAddress = action.payload.smartContractAccountAddress;
        state.isAuthenticated = true;
        state.isAccountCreationModalOpen = false;
        state.isCongratulationModalOpen = true;
        const { secretPrefix, secretLastFourChars } = splitSecretKey(action.payload.operator.project.secretKey);
        state.operator.project.secretPrefix = secretPrefix;
        state.operator.project.secretLastFourChars = secretLastFourChars;
        localStorage.setItem("Fuse-operator", JSON.stringify(state.operator));
        localStorage.setItem("Fuse-isOperatorAuthenticated", "true");
        localStorage.removeItem("Fuse-operatorContactDetail");
      })
      .addCase(createOperator.rejected, (state) => {
        state.isAccountCreationModalOpen = false;
      })
      .addCase(generateSecretApiKey.pending, (state) => {
        state.isGeneratingSecretApiKey = true;
      })
      .addCase(generateSecretApiKey.fulfilled, (state, action) => {
        state.isGeneratingSecretApiKey = false;
        state.operator.project.secretKey = action.payload;
        state.isYourSecretKeyModalOpen = true;
      })
      .addCase(generateSecretApiKey.rejected, (state) => {
        state.isGeneratingSecretApiKey = false;
      })
      .addCase(regenerateSecretApiKey.pending, (state) => {
        state.isGeneratingSecretApiKey = true;
      })
      .addCase(regenerateSecretApiKey.fulfilled, (state, action) => {
        state.isGeneratingSecretApiKey = false;
        state.operator.project.secretKey = action.payload;
        state.isRollSecretKeyModalOpen = false;
        state.isYourSecretKeyModalOpen = true;
      })
      .addCase(regenerateSecretApiKey.rejected, (state) => {
        state.isGeneratingSecretApiKey = false;
      })
      .addCase(fetchSponsorIdBalance.pending, (state) => {
        state.isFetchingSponsorIdBalance = true;

      })
      .addCase(fetchSponsorIdBalance.fulfilled, (state, action) => {
        state.isFetchingSponsorIdBalance = false;
        state.sponsorIdBalance = action.payload;
      })
      .addCase(fetchSponsorIdBalance.rejected, (state) => {
        state.isFetchingSponsorIdBalance = false;
      })
      .addCase(createPaymaster.pending, (state) => {
        state.isCreatingPaymaster = true;
      })
      .addCase(createPaymaster.fulfilled, (state, action) => {
        state.isCreatingPaymaster = false;
        state.operator.project.sponsorId = action.payload;
        localStorage.setItem("Fuse-operator", JSON.stringify(state.operator));
      })
      .addCase(createPaymaster.rejected, (state) => {
        state.isCreatingPaymaster = false;
      })
      .addCase(fundPaymaster.pending, (state) => {
        state.isFundingPaymaster = true;
      })
      .addCase(fundPaymaster.fulfilled, (state, action) => {
        state.isFundingPaymaster = false;
        state.isTopupPaymasterModalOpen = false;
      })
      .addCase(fundPaymaster.rejected, (state) => {
        state.isFundingPaymaster = false;
        state.isTopupPaymasterModalOpen = false;
      })
      .addCase(fetchErc20Balance.pending, (state) => {
        state.isFetchingErc20Balance = true;
      })
      .addCase(fetchErc20Balance.fulfilled, (state, action) => {
        state.isFetchingErc20Balance = false;
        state.erc20Balance = action.payload;
      })
      .addCase(fetchErc20Balance.rejected, (state) => {
        state.isFetchingErc20Balance = false;
      })
      .addCase(withdraw.pending, (state) => {
        state.isWithdrawing = true;
      })
      .addCase(withdraw.fulfilled, (state, action) => {
        state.isWithdrawing = false;
        state.isWithdrawn = true;
        state.withdraw = action.payload;
        state.isWithdrawModalOpen = false;
      })
      .addCase(withdraw.rejected, (state) => {
        state.isWithdrawing = false;
        state.isWithdrawModalOpen = false;
      })
      .addCase(checkIsActivated.pending, (state) => {
        state.isCheckingActivation = true;
      })
      .addCase(checkIsActivated.fulfilled, (state) => {
        state.isCheckingActivation = false;
        state.isActivated = true;
        localStorage.setItem("Fuse-isActivated", "true");
      })
      .addCase(checkIsActivated.rejected, (state) => {
        state.isCheckingActivation = false;
      })
      .addCase(fetchSponsoredTransactions.pending, (state) => {
        state.isFetchingSponsoredTransactions = true;
      })
      .addCase(fetchSponsoredTransactions.fulfilled, (state, action) => {
        state.isFetchingSponsoredTransactions = false;
        state.sponsoredTransactions = action.payload;
      })
      .addCase(fetchSponsoredTransactions.rejected, (state) => {
        state.isFetchingSponsoredTransactions = false;
      })
      .addCase(fetchTokenBalances.pending, (state) => {
        state.isFetchingTokenBalances = true;
      })
      .addCase(fetchTokenBalances.fulfilled, (state, action) => {
        state.isFetchingTokenBalances = false;
        state.totalTokenBalance = action.payload;
      })
      .addCase(fetchTokenBalances.rejected, (state) => {
        state.isFetchingTokenBalances = false;
      })
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
  setIsWithdrawModalOpen,
  setIsTopupPaymasterModalOpen,
  setIsYourSecretKeyModalOpen,
  setIsRollSecretKeyModalOpen,
  setRedirect,
  setOperatorContactDetail,
  setOperator,
  setLogout,
  setHydrate
} = operatorSlice.actions;

export default operatorSlice.reducer;

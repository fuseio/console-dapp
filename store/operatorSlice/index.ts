import { PayloadAction, createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { AppState } from "../rootReducer";
import { Signer, ethers } from "ethers";
import { FuseSDK, OwnerWalletClient } from "@fuseio/fusebox-web-sdk";
import { SmartAccountClient } from "permissionless";
import { hex, splitSecretKey, subscriptionInfo } from "@/lib/helpers";
import { Operator, OperatorCheckout, OperatorCheckoutSession, OperatorContactDetail, SignData, Status, Withdraw } from "@/lib/types";
import { checkActivated, checkOperatorExist, fetchCurrentOperator, fetchOperatorCheckoutSessions, fetchSponsoredTransactionCount, postCreateApiSecretKey, postCreateOperator, postCreateOperatorWallet, postCreatePaymaster, postOperatorCheckout, postOperatorSubscription, postValidateOperator, refreshOperatorToken, updateApiSecretKey } from "@/lib/api";
import { RootState } from "../store";
import { Address } from "abitype";
import { CONFIG, NEXT_PUBLIC_FUSE_API_BASE_URL, NEXT_PUBLIC_PAYMASTER_FUNDER_ADDRESS } from "@/lib/config";
import { PaymasterAbi } from "@/lib/abi/Paymaster";
import { getSponsorIdBalance } from "@/lib/contractInteract";
import * as amplitude from "@amplitude/analytics-browser";
import { getERC20Balance } from "@/lib/erc20";
import { ERC20ABI } from "@/lib/abi/ERC20";
import { Account, parseEther, parseUnits } from "viem";

const initOperator: Operator = {
  user: {
    id: "",
    name: "",
    email: "",
    auth0Id: "",
    smartWalletAddress: hex,
    isActivated: false,
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
  isCheckingOperator: boolean;
  isValidatingOperator: boolean;
  isFetchingOperator: boolean;
  isOperatorWalletModalOpen: boolean;
  isCreatingOperator: boolean;
  isCreatedOperator: boolean;
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
  withdrawStatus: Status;
  isCheckingActivation: boolean;
  isFetchingSponsoredTransactions: boolean;
  sponsoredTransactions: number;
  sponsorIdBalance: string;
  erc20Balance: string;
  redirect: string;
  withdraw: Withdraw;
  operatorContactDetail: OperatorContactDetail;
  operator: Operator;
  isSubscriptionModalOpen: boolean;
  isSubscribing: boolean;
  isSubscribed: boolean;
  isCheckingout: boolean;
  checkoutSessions: OperatorCheckoutSession[];
  checkoutSessionStatus: Status;
}

const INIT_STATE: OperatorStateType = {
  isLogin: false,
  isLoggedIn: false,
  isLoginError: false,
  isAuthenticated: false,
  isOperatorExist: false,
  isHydrated: false,
  isValidated: false,
  isCheckingOperator: false,
  isValidatingOperator: false,
  isFetchingOperator: false,
  isOperatorWalletModalOpen: false,
  isCreatingOperator: false,
  isCreatedOperator: false,
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
  withdrawStatus: Status.IDLE,
  isCheckingActivation: false,
  isFetchingSponsoredTransactions: false,
  sponsoredTransactions: 0,
  sponsorIdBalance: "",
  erc20Balance: "",
  redirect: "",
  withdraw: initWithdraw,
  operatorContactDetail: initOperatorContactDetail,
  operator: initOperator,
  isSubscriptionModalOpen: false,
  isSubscribing: false,
  isSubscribed: false,
  isCheckingout: false,
  checkoutSessions: [],
  checkoutSessionStatus: Status.IDLE,
};

export const checkOperator = createAsyncThunk(
  "OPERATOR/CHECK_OPERATOR",
  async ({
    address,
  }: {
    address: Address;
  }) => {
    try {
      const operator = await checkOperatorExist(address);
      if (operator.status === 200) {
        return "exists";
      } else {
        throw new Error("Operator not found");
      }
    } catch (error) {
      console.error(error);
      throw error;
    }
  }
);

export const validateOperator = createAsyncThunk<
  any,
  {
    signData: SignData;
  }
>(
  "OPERATOR/VALIDATE_OPERATOR",
  async (
    {
      signData
    },
    thunkAPI
  ) => {
    try {
      await postValidateOperator(signData);
      thunkAPI.dispatch(fetchOperator());
      return true;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }
);

export const withRefreshToken = createAsyncThunk<
  any,
  () => Promise<any>,
  { state: RootState }
>(
  "OPERATOR/WITH_REFRESH_TOKEN",
  async (
    callback,
    thunkAPI
  ) => {
    try {
      const result = await callback();
      if (!result?.error?.message?.includes("401")) {
        return result;
      }
      try {
        await refreshOperatorToken();
        return await callback();
      } catch (refreshTokenError) {
        thunkAPI.dispatch(setLogout());
        throw refreshTokenError;
      }
    } catch (error: any) {
      console.log(error);
      throw error;
    }
  }
);

export const fetchOperator = createAsyncThunk(
  "OPERATOR/FETCH_OPERATOR",
  async () => {
    try {
      const operator = await fetchCurrentOperator()
      if (operator) {
        return operator;
      } else {
        throw new Error("Operator not found");
      }
    } catch (error) {
      console.log(error);
      throw error;
    }
  }
);

export const createOperator = createAsyncThunk<
  any,
  {
    operatorContactDetail: OperatorContactDetail;
    account: Account;
  }
>(
  "OPERATOR/CREATE_OPERATOR",
  async (
    {
      operatorContactDetail,
      account
    }: {
      operatorContactDetail: OperatorContactDetail;
      account: Account;
    },
  ) => {
    try {
      const operator = await postCreateOperator(operatorContactDetail)
      if (!operator) {
        throw new Error("Operator not found");
      }

      const fuseSDK = await FuseSDK.init(
        operator.project.publicKey,
        account,
        {
          baseUrl: NEXT_PUBLIC_FUSE_API_BASE_URL,
        }
      );
      const fuseClient = fuseSDK.client as SmartAccountClient
      const smartWalletAddress = fuseClient.account?.address
      if (!smartWalletAddress) {
        throw new Error("Smart wallet address not found");
      }

      const operatorWallet = await postCreateOperatorWallet({
        ownerId: operator.user.id,
        smartWalletAddress
      })
      if (!operatorWallet) {
        throw new Error("Operator wallet not found");
      }

      operator.user.smartWalletAddress = operatorWallet.smartWalletAddress

      return operator;
    } catch (error) {
      console.log(error);
      throw error;
    }
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
    try {
      const state = thunkAPI.getState();
      const operatorState: OperatorStateType = state.operator;
      const { secretKey } = await postCreateApiSecretKey(operatorState.operator.project.id);
      if (secretKey) {
        return secretKey;
      } else {
        throw new Error("Secret key not found");
      }
    } catch (error) {
      console.log(error);
      throw error;
    }
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
    try {
      const state = thunkAPI.getState();
      const operatorState: OperatorStateType = state.operator;
      const { secretKey } = await updateApiSecretKey(operatorState.operator.project.id);
      if (secretKey) {
        return secretKey;
      } else {
        throw new Error("Secret key not found");
      }
    } catch (error) {
      console.log(error);
      throw error;
    }
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
    try {
      const state = thunkAPI.getState();
      const operatorState: OperatorStateType = state.operator;
      const balance = await getSponsorIdBalance(operatorState.operator.project.sponsorId)
      return balance;
    } catch (error) {
      console.log(error);
      throw error;
    }
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
    try {
      const state = thunkAPI.getState();
      const operatorState: OperatorStateType = state.operator;
      const paymasters = await postCreatePaymaster(operatorState.operator.project.id)
      if (paymasters?.[0]?.sponsorId) {
        return paymasters[0].sponsorId;
      } else {
        throw new Error("Paymaster not found");
      }
    } catch (error) {
      console.log(error);
      throw error;
    }
  }
);

export const fundPaymaster = createAsyncThunk<
  any,
  {
    signer: Signer;
    signature: string;
    amount: string;
  },
  { state: RootState }
>(
  "OPERATOR/FUND_PAYMASTER",
  async (
    {
      signer,
      signature,
      amount,
    }: {
      signer: Signer;
      signature: string;
      amount: string;
    },
    thunkAPI
  ) => {
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
          signature
        }
      );
      const userOp = await fuseSDK.callContract(CONFIG.paymasterAddress, value, data);
      const result = await userOp?.wait();
      const transactionHash = result?.transactionHash;

      if (transactionHash) {
        amplitude.track("Paymaster Balance Funded", { amount: parseFloat(amount) });
        return transactionHash;
      } else {
        throw new Error("Transaction failed");
      }
    } catch (error) {
      console.log(error);
      throw error;
    }
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
    try {
      const balance = await getERC20Balance(contractAddress, address, CONFIG.fuseRPC)
      const formattedBalance = ethers.utils.formatUnits(balance, decimals);
      return formattedBalance;
    } catch (error) {
      console.log(error);
      throw error;
    }
  }
);

export const withdraw = createAsyncThunk<
  any,
  {
    walletClient: OwnerWalletClient;
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
      walletClient,
      amount,
      to,
      decimals,
      token,
      coinGeckoId,
      contractAddress,
    }: {
      walletClient: OwnerWalletClient;
      amount: string;
      to: string;
      decimals: number;
      token: string;
      coinGeckoId: string;
      contractAddress?: string;
    },
    thunkAPI
  ) => {
    try {
      const state = thunkAPI.getState();
      const operatorState: OperatorStateType = state.operator;

      let call: any = {
        to,
        value: parseEther(amount)
      }
      let withPaymaster = false;

      if (contractAddress) {
        call = {
          abi: ERC20ABI,
          functionName: 'transfer',
          to: contractAddress,
          args: [to, parseUnits(amount, decimals)]
        }
      }

      if (operatorState.operator.user.isActivated) {
        withPaymaster = true;
      }

      const fuseSDK = await FuseSDK.init(
        operatorState.operator.project.publicKey,
        walletClient,
        {
          withPaymaster,
          baseUrl: NEXT_PUBLIC_FUSE_API_BASE_URL,
        }
      );
      const fuseClient = fuseSDK.client as SmartAccountClient

      const userOpHash = await fuseClient.sendUserOperation({
        calls: [call],
      })
      const userOpReceipt = await fuseClient.waitForUserOperationReceipt({
        hash: userOpHash,
      })

      thunkAPI.dispatch(fetchSponsoredTransactions());

      const transactionHash = userOpReceipt.receipt.transactionHash;
      if (transactionHash) {
        return { amount, token, coinGeckoId };
      } else {
        throw new Error("Transaction failed");
      }
    } catch (error) {
      console.log(error);
      throw error;
    }
  }
);

export const checkIsActivated = createAsyncThunk(
  "OPERATOR/IS_ACTIVATED",
  async () => {
    try {
      const operator = await checkActivated();
      if (operator.status === 200) {
        return "activated";
      } else {
        throw new Error("Operator not found");
      }
    } catch (error: any) {
      if (error?.response?.status === 404) {
        const DEPOSIT_REQUIRED = 10;
        console.log(`Error 404: Operator Wallet is not activated, deposit ${DEPOSIT_REQUIRED} FUSE to activate.`);
      } else {
        console.error(error);
      }
      throw error;
    }
  }
);

export const fetchSponsoredTransactions = createAsyncThunk(
  "OPERATOR/FETCH_SPONSORED_TRANSACTIONS",
  async () => {
    try {
      const sponsoredTransactionCount = await fetchSponsoredTransactionCount()
      return sponsoredTransactionCount.sponsoredTransactions;
    } catch (error) {
      console.log(error);
      throw error;
    }
  }
);

export const subscription = createAsyncThunk<
  any,
  {
    walletClient: OwnerWalletClient;
  },
  { state: RootState }
>(
  "OPERATOR/SUBSCRIPTION",
  async (
    {
      walletClient,
    }: {
      walletClient: OwnerWalletClient;
    },
    thunkAPI
  ) => {
    try {
      const state = thunkAPI.getState();
      const operatorState: OperatorStateType = state.operator;
      const recipient = NEXT_PUBLIC_PAYMASTER_FUNDER_ADDRESS as Address;
      const amount = parseUnits(
        (subscriptionInfo.payment * subscriptionInfo.advance).toString(),
        subscriptionInfo.decimals
      );

      const fuseSDK = await FuseSDK.init(
        operatorState.operator.project.publicKey,
        walletClient,
        {
          withPaymaster: true,
          baseUrl: NEXT_PUBLIC_FUSE_API_BASE_URL,
        }
      );
      const fuseClient = fuseSDK.client as SmartAccountClient

      const userOpHash = await fuseClient.sendUserOperation({
        calls: [{
          abi: ERC20ABI,
          functionName: 'increaseAllowance',
          to: subscriptionInfo.usdcAddress,
          args: [recipient, amount]
        }],
      })
      const userOpReceipt = await fuseClient.waitForUserOperationReceipt({
        hash: userOpHash,
      })

      const transactionHash = userOpReceipt.receipt.transactionHash;
      if (!transactionHash) {
        throw new Error("Transaction failed");
      }

      const invoice = await postOperatorSubscription()
      if (!invoice) {
        throw new Error("Invoice not found");
      }
      return invoice;
    } catch (error) {
      console.log(error);
      throw error;
    }
  }
);

export const checkout = createAsyncThunk(
  "OPERATOR/CHECKOUT",
  async (operatorCheckout: OperatorCheckout) => {
    try {
      const checkoutUrl = await postOperatorCheckout(operatorCheckout)
      if (!checkoutUrl) {
        throw new Error("Checkout URL not found");
      }
      return checkoutUrl;
    } catch (error) {
      console.log(error);
      throw error;
    }
  }
);

export const fetchCheckoutSessions = createAsyncThunk(
  "OPERATOR/FETCH_CHECKOUT_SESSIONS",
  async () => {
    try {
      const checkoutSessions = await fetchOperatorCheckoutSessions()
      return checkoutSessions
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
      localStorage.setItem("Fuse-isValidated", JSON.stringify(action.payload));
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
    setIsSubscriptionModalOpen: (state, action: PayloadAction<boolean>) => {
      state.isSubscriptionModalOpen = action.payload
    },
    setLogout: (state) => {
      Object.assign(state, INIT_STATE);
      localStorage.removeItem("Fuse-isOperatorExist");
      localStorage.removeItem("Fuse-isValidated");
      localStorage.removeItem("Fuse-operator");
      localStorage.removeItem("Fuse-isOperatorAuthenticated");
      localStorage.removeItem("Fuse-isLoginError");
      localStorage.removeItem("Fuse-connectedWalletType");
      localStorage.removeItem("Fuse-operatorContactDetail");
      localStorage.removeItem("Fuse-isActivated");
      state.isHydrated = true;
    },
    setHydrate: (state) => {
      const isOperatorExist = localStorage.getItem("Fuse-isOperatorExist");
      const isValidated = localStorage.getItem("Fuse-isValidated");
      const operator = localStorage.getItem("Fuse-operator");
      const isAuthenticated = localStorage.getItem("Fuse-isOperatorAuthenticated");
      const operatorContactDetail = localStorage.getItem("Fuse-operatorContactDetail");
      state.isOperatorExist = isOperatorExist ? JSON.parse(isOperatorExist) : false;
      state.isValidated = isValidated ? JSON.parse(isValidated) : false;
      state.operator = operator ? JSON.parse(operator) : initOperator;
      state.isAuthenticated = isAuthenticated ? JSON.parse(isAuthenticated) : false;
      state.operatorContactDetail = operatorContactDetail ? JSON.parse(operatorContactDetail) : initOperatorContactDetail;
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
      .addCase(validateOperator.fulfilled, (state) => {
        state.isValidatingOperator = false;
        state.isValidated = true;
        localStorage.setItem("Fuse-isValidated", JSON.stringify(true));
      })
      .addCase(validateOperator.rejected, (state) => {
        state.isValidatingOperator = false;
      })
      .addCase(fetchOperator.pending, (state) => {
        state.isFetchingOperator = true;
      })
      .addCase(fetchOperator.fulfilled, (state, action) => {
        state.isFetchingOperator = false;
        state.operator = action.payload;
        state.isLoggedIn = true;
        state.isAuthenticated = true;
        localStorage.setItem("Fuse-operator", JSON.stringify(state.operator));
        localStorage.setItem("Fuse-isOperatorAuthenticated", "true");
      })
      .addCase(fetchOperator.rejected, (state) => {
        state.isFetchingOperator = false;
        state.isLoginError = true;
      })
      .addCase(createOperator.pending, (state) => {
        state.isLoginError = false;
        state.isCreatingOperator = true;
      })
      .addCase(createOperator.fulfilled, (state, action) => {
        state.operator = action.payload;
        state.isAuthenticated = true;
        state.isCreatingOperator = false;
        state.isCreatedOperator = true;
        const { secretPrefix, secretLastFourChars } = splitSecretKey(action.payload.project.secretKey);
        state.operator.project.secretPrefix = secretPrefix;
        state.operator.project.secretLastFourChars = secretLastFourChars;
        localStorage.setItem("Fuse-operator", JSON.stringify(state.operator));
        localStorage.setItem("Fuse-isOperatorAuthenticated", "true");
        localStorage.removeItem("Fuse-operatorContactDetail");
      })
      .addCase(createOperator.rejected, (state) => {
        state.isCreatingOperator = false;
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
      .addCase(fundPaymaster.fulfilled, (state) => {
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
        state.withdrawStatus = Status.PENDING;
      })
      .addCase(withdraw.fulfilled, (state, action) => {
        state.withdrawStatus = Status.SUCCESS;
        state.withdraw = action.payload;
        state.isWithdrawModalOpen = false;
      })
      .addCase(withdraw.rejected, (state) => {
        state.withdrawStatus = Status.ERROR;
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
      .addCase(subscription.pending, (state) => {
        state.isSubscribing = true;
      })
      .addCase(subscription.fulfilled, (state) => {
        state.isSubscribing = false;
        state.isSubscriptionModalOpen = false;
        state.isSubscribed = true;
        state.operator.user.isActivated = true;
      })
      .addCase(subscription.rejected, (state) => {
        state.isSubscribing = false;
      })
      .addCase(checkout.pending, (state) => {
        state.isCheckingout = true;
      })
      .addCase(checkout.fulfilled, (state, action) => {
        state.isCheckingout = false;
        window.location.href = action.payload
      })
      .addCase(checkout.rejected, (state) => {
        state.isCheckingout = false;
      })
      .addCase(fetchCheckoutSessions.pending, (state) => {
        state.checkoutSessionStatus = Status.PENDING;
      })
      .addCase(fetchCheckoutSessions.fulfilled, (state, action) => {
        state.checkoutSessionStatus = Status.SUCCESS;
        state.checkoutSessions = action.payload;
      })
      .addCase(fetchCheckoutSessions.rejected, (state) => {
        state.checkoutSessionStatus = Status.ERROR;
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
  setIsTopupAccountModalOpen,
  setIsWithdrawModalOpen,
  setIsTopupPaymasterModalOpen,
  setIsYourSecretKeyModalOpen,
  setIsRollSecretKeyModalOpen,
  setRedirect,
  setOperatorContactDetail,
  setOperator,
  setLogout,
  setHydrate,
  setIsSubscriptionModalOpen,
} = operatorSlice.actions;

export default operatorSlice.reducer;

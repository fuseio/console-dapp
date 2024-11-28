import { PayloadAction, createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { AppState } from "../rootReducer";
import { AirdropUser, AirdropLeaderboardUsers, AirdropQuest, CreateAirdropUser } from "@/lib/types";
import { Address } from "viem";
import { fetchAirdropLeaderboard, fetchAirdropTwitterAuthUrl, fetchAirdropUser, postAuthenticateAirdropUser, postCreateAirdropUser, postVerifyAirdropQuest } from "@/lib/api";
import { RootState } from "../store";
import { defaultReferralCode } from "@/lib/helpers";

const initUser: AirdropUser = {
  id: "",
  walletAddress: "0x",
  twitterAccountId: "",
  points: 0,
  referrals: 0,
  referralCode: "",
  leaderboardPosition: 0,
  pointsLastUpdatedAt: "",
  createdAt: "",
  walletAgeInDays: 0,
  seasonOnePoints: 0,
  nextRewardDistributionTime: "",
}

const initQuest: AirdropQuest = {
  id: "",
  title: "",
  point: 0,
  image: "",
  frequency: "",
}

export interface AirdropStateType {
  inviteCode: string;
  user: AirdropUser;
  isQuestModalOpen: boolean;
  selectedQuest: AirdropQuest;
  accessToken: string;
  isAuthenticated: boolean;
  isUser: boolean;
  isHydrated: boolean;
  isAuthenticating: boolean;
  isCreating: boolean;
  isRetrieving: boolean;
  isLeaderboardUsersLoading: boolean;
  leaderboardUsers: AirdropLeaderboardUsers;
  lastLeaderboardUserId: string;
  isLeaderboardUsersFinished: boolean;
  isGeneratingTwitterAuthUrl: boolean;
  twitterAuthUrl: string;
  isWaitlistModalOpen: boolean;
}

const INIT_STATE: AirdropStateType = {
  inviteCode: defaultReferralCode,
  user: initUser,
  isQuestModalOpen: false,
  selectedQuest: initQuest,
  accessToken: "",
  isAuthenticated: false,
  isUser: false,
  isHydrated: false,
  isAuthenticating: false,
  isCreating: false,
  isRetrieving: false,
  isLeaderboardUsersLoading: false,
  leaderboardUsers: [],
  lastLeaderboardUserId: "",
  isLeaderboardUsersFinished: false,
  isGeneratingTwitterAuthUrl: false,
  twitterAuthUrl: "",
  isWaitlistModalOpen: false,
}

export const authenticateAirdropUser = createAsyncThunk<
  any,
  {
    eoaAddress: Address;
  },
  { state: RootState }
>(
  "USER/AUTHENTICATE_AIRDROP_USER",
  async ({
    eoaAddress,
  }: {
    eoaAddress: Address;
  },
    thunkAPI
  ) => {
    try {
      const authenticatedUser = await postAuthenticateAirdropUser(eoaAddress);
      if (authenticatedUser?.jwt) {
        const state = thunkAPI.getState();
        const airdropState: AirdropStateType = state.airdrop;
        thunkAPI.dispatch(createAirdropUser({
          createUserDetail: {
            walletAddress: eoaAddress,
            referralCode: airdropState.inviteCode
          },
          accessToken: authenticatedUser.jwt
        }));
        return authenticatedUser.jwt;
      } else {
        throw new Error("Failed to authenticate Airdrop user");
      }
    } catch (error) {
      console.error(error);
      throw error;
    }
  }
);

export const createAirdropUser = createAsyncThunk<
  any,
  {
    createUserDetail: CreateAirdropUser;
    accessToken: string;
  },
  { state: RootState }
>(
  "USER/CREATE_AIRDROP_USER",
  async ({
    createUserDetail,
    accessToken,
  }: {
    createUserDetail: CreateAirdropUser;
    accessToken: string;
  },
    thunkAPI
  ) => {
    try {
      const createdUser = await postCreateAirdropUser(createUserDetail, accessToken);
      if (createdUser?.id) {
        return createdUser;
      } else {
        throw new Error("Failed to create Airdrop user");
      }
    } catch (error: any) {
      if (error?.response?.status === 400) {
        thunkAPI.dispatch(retrieveAirdropUser());
      }
      console.error(error);
      throw error;
    }
  }
);

export const retrieveAirdropUser = createAsyncThunk<
  any,
  undefined,
  { state: RootState }
>(
  "USER/RETRIEVE_AIRDROP_USER",
  async (
    _,
    thunkAPI
  ) => {
    const state = thunkAPI.getState();
    const airdropState: AirdropStateType = state.airdrop;
    try {
      const fetchedUser = await fetchAirdropUser(airdropState.accessToken);
      if (fetchedUser?.id) {
        return fetchedUser;
      } else {
        throw new Error("Failed to retrieve Airdrop user");
      }
    } catch (error) {
      console.error(error);
      throw error;
    }
  }
);

export const fetchAirdropLeaderboardUsers = createAsyncThunk<
  any,
  {
    queryParams: Record<string, string>;
  },
  { state: RootState }
>(
  "USER/FETCH_AIRDROP_LEADERBOARD_USERS",
  async ({
    queryParams,
  }: {
    queryParams: Record<string, string>;
  },
    thunkAPI
  ) => {
    try {
      const state = thunkAPI.getState();
      const airdropState: AirdropStateType = state.airdrop;
      const leaderboard = await fetchAirdropLeaderboard(queryParams, airdropState.accessToken);
      return leaderboard.users;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }
);

export const generateAirdropTwitterAuthUrl = createAsyncThunk<
  any,
  undefined,
  { state: RootState }
>(
  "USER/GENERATE_AIRDROP_TWITTER_AUTH_URL",
  async (
    _,
    thunkAPI
  ) => {
    try {
      const state = thunkAPI.getState();
      const airdropState: AirdropStateType = state.airdrop;
      const generatedTwitterAuthUrl = await fetchAirdropTwitterAuthUrl(
        airdropState.accessToken,
        window.location.origin
      );
      return generatedTwitterAuthUrl.authUrl;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }
);

export const verifyAirdropQuest = createAsyncThunk<
  any,
  {
    endpoint: string;
  },
  { state: RootState }
>(
  "USER/VERIFY_AIRDROP_QUEST",
  async (
    {
      endpoint
    }: {
      endpoint: string;
    },
    thunkAPI
  ) => {
    try {
      const state = thunkAPI.getState();
      const airdropState: AirdropStateType = state.airdrop;
      const verified = await postVerifyAirdropQuest(airdropState.accessToken, endpoint);
      return verified;
    } catch (error: any) {
      if (error?.response?.status === 409) {
        thunkAPI.dispatch(retrieveAirdropUser());
      }
      console.error(error);
      throw error?.response?.status;
    }
  }
);

const airdropSlice = createSlice({
  name: "AIRDROP_STATE",
  initialState: INIT_STATE,
  reducers: {
    setInviteCode: (state, action: PayloadAction<string>) => {
      state.inviteCode = action.payload
    },
    setIsQuestModalOpen: (state, action: PayloadAction<boolean>) => {
      state.isQuestModalOpen = action.payload
    },
    setSelectedQuest: (state, action: PayloadAction<AirdropQuest>) => {
      state.selectedQuest = action.payload
    },
    setIsWaitlistModalOpen: (state, action: PayloadAction<boolean>) => {
      state.isWaitlistModalOpen = action.payload
    },
    setLogoutAirdrop: (state) => {
      state.inviteCode = "";
      state.accessToken = "";
      state.isAuthenticated = false;
      state.isUser = false;
      state.user = initUser;
      state.leaderboardUsers = [];
      state.lastLeaderboardUserId = "";
      state.isLeaderboardUsersFinished = false;
      localStorage.removeItem("airdrop-inviteCode");
      localStorage.removeItem("airdrop-accessToken");
      localStorage.removeItem("airdrop-isUser");
      localStorage.removeItem("airdrop-user");
    },
    setHydrateAirdrop: (state) => {
      const inviteCode = localStorage.getItem("airdrop-inviteCode");
      const accessToken = localStorage.getItem("airdrop-accessToken");
      const isUser = localStorage.getItem("airdrop-isUser");
      const user = localStorage.getItem("airdrop-user");
      state.inviteCode = inviteCode ?? "";
      state.accessToken = accessToken ?? "";
      state.isAuthenticated = !!accessToken;
      state.isUser = isUser ? JSON.parse(isUser) : false;
      state.user = user ? JSON.parse(user) : initUser;
      state.isHydrated = true;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(authenticateAirdropUser.pending, (state) => {
        state.isAuthenticating = true;
      })
      .addCase(authenticateAirdropUser.fulfilled, (state, action) => {
        state.isAuthenticating = false;
        state.isAuthenticated = true;
        state.accessToken = action.payload;
        localStorage.setItem("airdrop-accessToken", action.payload);
      })
      .addCase(authenticateAirdropUser.rejected, (state) => {
        state.isAuthenticating = false;
      })
      .addCase(createAirdropUser.pending, (state) => {
        state.isCreating = true;
      })
      .addCase(createAirdropUser.fulfilled, (state, action) => {
        state.isCreating = false;
        state.isUser = true;
        state.user = action.payload;
        localStorage.setItem("airdrop-isUser", "true");
        localStorage.setItem("airdrop-user", JSON.stringify(action.payload));
      })
      .addCase(createAirdropUser.rejected, (state) => {
        state.isCreating = false;
      })
      .addCase(retrieveAirdropUser.pending, (state) => {
        state.isRetrieving = true;
      })
      .addCase(retrieveAirdropUser.fulfilled, (state, action) => {
        state.isRetrieving = false;
        state.isUser = true;
        state.user = action.payload;
        localStorage.setItem("airdrop-isUser", "true");
        localStorage.setItem("airdrop-user", JSON.stringify(action.payload));
      })
      .addCase(retrieveAirdropUser.rejected, (state) => {
        state.isRetrieving = false;
      })
      .addCase(fetchAirdropLeaderboardUsers.pending, (state) => {
        state.isLeaderboardUsersLoading = true;
      })
      .addCase(fetchAirdropLeaderboardUsers.fulfilled, (state, action) => {
        state.isLeaderboardUsersLoading = false;
        if (action.payload.length) {
          const leaderboardUsers = [...state.leaderboardUsers, ...action.payload];
          const lastLeaderboardUserId = action.payload[action.payload.length - 1].id

          state.leaderboardUsers = leaderboardUsers
          state.lastLeaderboardUserId = lastLeaderboardUserId;
        } else {
          state.isLeaderboardUsersFinished = true;
        }
      })
      .addCase(fetchAirdropLeaderboardUsers.rejected, (state) => {
        state.isLeaderboardUsersLoading = false;
      })
      .addCase(generateAirdropTwitterAuthUrl.pending, (state) => {
        state.isGeneratingTwitterAuthUrl = true;
      })
      .addCase(generateAirdropTwitterAuthUrl.fulfilled, (state, action) => {
        state.isGeneratingTwitterAuthUrl = false;
        state.twitterAuthUrl = action.payload;
      })
      .addCase(generateAirdropTwitterAuthUrl.rejected, (state) => {
        state.isGeneratingTwitterAuthUrl = false;
      })
  },
});

export const selectAirdropSlice = (state: AppState): AirdropStateType => state.airdrop;

export const {
  setInviteCode,
  setIsQuestModalOpen,
  setSelectedQuest,
  setIsWaitlistModalOpen,
  setLogoutAirdrop,
  setHydrateAirdrop
} = airdropSlice.actions;

export default airdropSlice.reducer;

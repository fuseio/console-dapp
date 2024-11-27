import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { AppState } from "../rootReducer";
import { AirdropUser, LeaderboardUsers, Quest } from "@/lib/types";

const initUser: AirdropUser = {
  id: "",
  walletAddress: "0x",
  twitterAccountId: "",
  points: 1500,
  referrals: 5,
  referralCode: "jmaea",
  leaderboardPosition: 130653,
  pointsLastUpdatedAt: "Wednesday, 27 November 2024 00:00:00",
  createdAt: "",
  walletAgeInDays: 0,
  seasonOnePoints: 0,
  nextRewardDistributionTime: "",
}

const initQuest: Quest = {
  id: "",
  title: "",
  point: 0,
  image: "",
  frequency: "",
}

const initLeaderboardUsers: LeaderboardUsers = [
  {
    id: "1",
    walletAddress: "0x61f0595B99239c00D2c699a4B8D05608c55431af",
    twitterAccountId: "",
    points: 43235,
    referralCode: "",
  },
  {
    id: "2",
    walletAddress: "0x61f0595B99239c00D2c699a4B8D05608c55431af",
    twitterAccountId: "",
    points: 43235,
    referralCode: "",
  },
  {
    id: "3",
    walletAddress: "0x61f0595B99239c00D2c699a4B8D05608c55431af",
    twitterAccountId: "",
    points: 43235,
    referralCode: "",
  },
  {
    id: "4",
    walletAddress: "0x61f0595B99239c00D2c699a4B8D05608c55431af",
    twitterAccountId: "",
    points: 43235,
    referralCode: "",
  },
  {
    id: "5",
    walletAddress: "0x61f0595B99239c00D2c699a4B8D05608c55431af",
    twitterAccountId: "",
    points: 43235,
    referralCode: "",
  }
];

export interface AirdropStateType {
  inviteCode: string;
  user: AirdropUser;
  isQuestModalOpen: boolean;
  selectedQuest: Quest;
  isLeaderboardUsersLoading: boolean;
  leaderboardUsers: LeaderboardUsers;
  lastLeaderboardUserId: string;
  isLeaderboardUsersFinished: boolean;
}

const INIT_STATE: AirdropStateType = {
  inviteCode: "",
  user: initUser,
  isQuestModalOpen: false,
  selectedQuest: initQuest,
  isLeaderboardUsersLoading: false,
  leaderboardUsers: initLeaderboardUsers,
  lastLeaderboardUserId: "",
  isLeaderboardUsersFinished: false,
}

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
    setSelectedQuest: (state, action: PayloadAction<Quest>) => {
      state.selectedQuest = action.payload
    },
  },
  extraReducers: () => {
  },
});

export const selectAirdropSlice = (state: AppState): AirdropStateType => state.airdrop;

export const {
  setInviteCode,
  setIsQuestModalOpen,
  setSelectedQuest,
} = airdropSlice.actions;

export default airdropSlice.reducer;

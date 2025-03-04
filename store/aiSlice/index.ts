import { PayloadAction, createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { Address } from "viem";

import { AppState } from "../rootReducer";
import { postAiMessage } from "@/lib/api";
import { TextResponse } from "@/lib/types";

export interface AiStateType {
  messages: TextResponse[];
  isHydrated: boolean;
}

const INIT_STATE: AiStateType = {
  messages: [],
  isHydrated: false,
};

export const sendMessage = createAsyncThunk(
  "AI/SEND_MESSAGE",
  async ({
    text,
    address
  }: {
    text: string,
    address?: Address
  }) => {
    try {
      const message = await postAiMessage(text);
      return {
        message,
        address
      };
    } catch (error) {
      console.error('Error sending message:', error);
      const message: TextResponse = {
        user: "Fuse Network",
        text: "Sorry, I encountered an error. Please try again."
      };
      return {
        message,
        address
      };
    }
  }
);

const aiSlice = createSlice({
  name: "AI_STATE",
  initialState: INIT_STATE,
  reducers: {
    addMessage: (state, action: PayloadAction<{ message: TextResponse, address?: Address }>) => {
      state.messages = [...state.messages, action.payload.message];
      localStorage.setItem(`chat_history_${action.payload.address}`, JSON.stringify(state.messages));
    },
    updateMessage: (state, action: PayloadAction<{ message: TextResponse, address?: Address }>) => {
      state.messages = state.messages.map((message) => message.text === action.payload.message.text ? action.payload.message : message);
      localStorage.setItem(`chat_history_${action.payload.address}`, JSON.stringify(state.messages));
    },
    setHydrate: (state, action: PayloadAction<{ address?: Address }>) => {
      const chatHistory = localStorage.getItem(`chat_history_${action.payload.address}`);
      state.messages = chatHistory ? JSON.parse(chatHistory) : [];
      state.isHydrated = true;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(sendMessage.pending, (state) => {
        const message: TextResponse = {
          user: "Fuse Network",
          text: "Thinking...",
          isLoading: true
        };
        state.messages = [...state.messages, message];
      })
      .addCase(sendMessage.fulfilled, (state, action) => {
        if (Array.isArray(action.payload.message)) {
          state.messages[state.messages.length - 1] = action.payload.message[0];
          action.payload.message.slice(1).forEach((message: TextResponse) => {
            state.messages = [...state.messages, message];
          });
        } else {
          state.messages[state.messages.length - 1] = action.payload.message;
        }
        localStorage.setItem(`chat_history_${action.payload.address}`, JSON.stringify(state.messages));
      })
  },
});

export const selectAiSlice = (state: AppState): AiStateType => state.ai;

export const {
  addMessage,
  updateMessage,
  setHydrate
} = aiSlice.actions;

export default aiSlice.reducer;

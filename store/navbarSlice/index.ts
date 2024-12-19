import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { AppState } from "../rootReducer";

export interface NavbarStateType {
  selected: string;
  isTransfiModalOpen: boolean;
}

const INIT_STATE: NavbarStateType = {
  selected: "",
  isTransfiModalOpen: false,
};

const navbarSlice = createSlice({
  name: "NAVBAR_STATE",
  initialState: INIT_STATE,
  reducers: {
    setSelectedNavbar: (state, action: PayloadAction<string>) => {
      state.selected = action.payload
    },
    setIsTransfiModalOpen: (state, action: PayloadAction<boolean>) => {
      state.isTransfiModalOpen = action.payload
    },
  },
});

export const selectNavbarSlice = (state: AppState): NavbarStateType => state.navbar;

export const { setSelectedNavbar, setIsTransfiModalOpen } = navbarSlice.actions;

export default navbarSlice.reducer;

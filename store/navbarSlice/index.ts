import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { AppState } from "../rootReducer";

export interface NavbarStateType {
  selected: string;
}

const INIT_STATE: NavbarStateType = {
  selected: "console",
};

const navbarSlice = createSlice({
  name: "NAVBAR_STATE",
  initialState: INIT_STATE,
  reducers: {
    setSelectedNavbar: (state, action: PayloadAction<string>) => {
      state.selected = action.payload
    },
  },
});

export const selectNavbarSlice = (state: AppState): NavbarStateType => state.navbar;

export const { setSelectedNavbar } = navbarSlice.actions;

export default navbarSlice.reducer;

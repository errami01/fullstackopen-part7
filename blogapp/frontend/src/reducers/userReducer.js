import { createSlice } from "@reduxjs/toolkit";

const initialState =
  JSON.parse(localStorage.getItem("loggedBloglistUser")) || null;

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser: (state, action) => action.payload,
    clearUser: (state) => null,
  },
});

export const { setUser, clearUser } = userSlice.actions;
export default userSlice.reducer;

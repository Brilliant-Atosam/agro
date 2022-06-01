import { createSlice } from "@reduxjs/toolkit";

const LoginSlice = createSlice({
  name: "store",
  initialState: {
    Store: null,
    isFetching: false,
    error: false,
  },
  reducers: {
    LoginStart: (state) => {
      state.isFetching = true;
    },
    LoginSuccess: (state, action) => {
      state.isFetching = false;
      state.Store = action.payload;
    },
    LoginFailure: (state) => {
      state.isFetching = false;
      state.error = true;
    },
    Logout: (state) => {
      state.Store = null;
      state.isFetching = false;
      state.error = false;
    },
  },
});

export const { LoginStart, LoginSuccess, LoginFailure, Logout } =
  LoginSlice.actions;
export default LoginSlice.reducer;

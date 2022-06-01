import { createSlice } from "@reduxjs/toolkit";

const LoginSlice = createSlice({
  name: "admin",
  initialState: {
    Admin: null,
    isFetching: false,
    error: false,
  },
  reducers: {
    LoginStart: (state) => {
      state.isFetching = true;
    },
    LoginSuccess: (state, action) => {
      state.isFetching = false;
      state.Admin = action.payload;
    },
    LoginFailure: (state) => {
      state.isFetching = false;
      state.error = true;
    },
    Logout: (state) => {
      state.Admin = null;
      state.isFetching = false;
      state.error = false;
    },
  },
});

export const { LoginStart, LoginSuccess, LoginFailure, Logout } =
  LoginSlice.actions;
export default LoginSlice.reducer;

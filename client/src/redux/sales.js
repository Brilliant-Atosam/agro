import { createSlice } from "@reduxjs/toolkit";

const salesSlice = createSlice({
  name: "sales",
  initialState: {
    Sales: null,
    isFetching: false,
    error: false,
  },
  reducers: {
    salesStart: (state) => {
      state.isFetching = true;
    },
    salesSuccess: (state, action) => {
      state.isFetching = false;
      state.Sales = action.payload;
    },
    salesFailure: (state) => {
      state.isFetching = false;
      state.error = true;
    },
    clearSales: (state) => {
      state.Sales = null;
      state.isFetching = false;
      state.error = false;
    },
  },
});

export const { salesStart, salesSuccess, salesFailure, clearSales } = salesSlice.actions;
export default salesSlice.reducer;

import { createSlice } from "@reduxjs/toolkit";

const itemsSlice = createSlice({
  name: "items",
  initialState: {
    Items: null,
    isFetching: false,
    error: false,
  },
  reducers: {
    itemsStart: (state) => {
      state.isFetching = true;
    },
    itemsSuccess: (state, action) => {
      state.isFetching = false;
      state.Items = action.payload;
    },
    itemsFailure: (state) => {
      state.isFetching = false;
      state.error = true;
    },
    clearItems: (state) => {
      state.Items = null;
      state.isFetching = false;
      state.error = false;
    },
  },
});

export const { itemsStart, itemsSuccess, itemsFailure, clearItems } =
  itemsSlice.actions;
export default itemsSlice.reducer;

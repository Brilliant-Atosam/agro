import { createSlice } from "@reduxjs/toolkit";

const clientsSlice = createSlice({
  name: "clients",
  initialState: {
    Clients: null,
    isFetching: false,
    error: false,
  },
  reducers: {
    clientsStart: (state) => {
      state.isFetching = true;
    },
    clientsSuccess: (state, action) => {
      state.isFetching = false;
      state.Clients = action.payload;
    },
    clientsFailure: (state) => {
      state.isFetching = false;
      state.error = true;
    },
    clearClients: (state) => {
      state.Clients = null;
      state.isFetching = false;
      state.error = false;
    },
  },
});

export const { clientsStart, clientsSuccess, clientsFailure, clearClients } =
  clientsSlice.actions;
export default clientsSlice.reducer;

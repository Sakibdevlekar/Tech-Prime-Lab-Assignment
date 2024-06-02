import { configureStore } from "@reduxjs/toolkit";
import authSlice from "./reducers/auth.reducer.js";

const store = configureStore({
  reducer: {
    [authSlice.name]: authSlice.reducer,
  },
});

export default store;

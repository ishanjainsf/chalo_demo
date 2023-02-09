import { configureStore } from "@reduxjs/toolkit";
import routesReducer from "../slices/routesSlice";

export const store = configureStore({
  reducer: {
    routes: routesReducer,
  },
});

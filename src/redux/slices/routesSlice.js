import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  routes: [],
};

export const routesSlice = createSlice({
  name: "routes",
  initialState,
  reducers: {
    addNewRoute: (state, action) => {
      console.log("action payload : ", action.payload, state.routes);
      state.routes.push(action.payload);
    },
    updateRoute: (state, action) => {
      const { routes } = state;
      for (let i = 0; i < state.routes.length; i++) {
        if (routes[i].route_id === action.payload.route_id) {
          routes[i] = action.payload;
        }
      }
    },
  },
});

export const { addNewRoute, updateRoute } = routesSlice.actions;

export default routesSlice.reducer;

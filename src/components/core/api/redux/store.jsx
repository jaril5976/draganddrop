import { combineReducers, configureStore } from "@reduxjs/toolkit";
import generalReducer from "./features/generalSlice";
import dashboardReducer from "./features/dashboardSlice";

const rootReducer = combineReducers({
  general: generalReducer,
  dashboard: dashboardReducer,
});

export const store = configureStore({
  reducer: rootReducer,
});

export const RootState = store.getState;
export const AppDispatch = store.dispatch;

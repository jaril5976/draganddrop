// src/components/redux/features/dashboardSlice.jsx

import { createSlice } from "@reduxjs/toolkit";
import {
  updateState,
  addNewWidget,
  pushFirstWidget,
  widgetResize,
  widgetDrag,
  deleteWidget,
} from "../lib/dashboard.lib";

const initialState = {
  layout: [],
  layoutLoading: false,
  alldashboard: [],
  selectedDashboard: null,
  activeDashboard: null,
};

const dashboardSlice = createSlice({
  name: "dashboard",
  initialState,
  reducers: {
    updateDashboardState: (state, action) => updateState(state, action),
    pushFirstWidgetState: (state, action) => pushFirstWidget(state, action),
    addWidgetState: (state, action) => addNewWidget(state, action),
    widgetResizeState: (state, action) => widgetResize(state, action),
    widgetDragState: (state, action) => widgetDrag(state, action),
    deleteWidgetState: (state, action) => deleteWidget(state, action),
  },
});
export const {
  updateDashboardState,
  pushFirstWidgetState,
  addWidgetState,
  widgetResizeState,
  widgetDragState,
  deleteWidgetState,
} = dashboardSlice.actions;

export default dashboardSlice.reducer;

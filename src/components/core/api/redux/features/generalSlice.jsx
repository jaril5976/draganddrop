// src/components/redux/features/generalSlice.jsx

import { createSlice } from "@reduxjs/toolkit";
import {
  setCreatingWidget,
  setIsUpdatingTitle,
  setUneditMode,
  setWidgetToUpdate,
  showWidgets,
  toggleSlider,
  updateState,
} from "../lib/general.lib";

const initialState = {
  sliderOpen: true,
  showWidgets: false,
  isCreatingWidget: false,
  uneditMode: false,
  isUpdatingTitle: false,
  widgetToUpdate: null,
  isLoading: false,
  selectedWidget: null,
};

const generalSlice = createSlice({
  name: "general",
  initialState,
  reducers: {
    updateGeneralState: (state, action) => updateState(state, action),
    toggleSliderState: (state, action) => toggleSlider(state, action),
    showWidgetsState: (state, action) => showWidgets(state, action),
    setCreatingWidgetState: (state, action) => setCreatingWidget(state, action),
    setUneditModeState: (state, action) => setUneditMode(state, action),
    setIsUpdatingTitleState: (state, action) =>
      setIsUpdatingTitle(state, action),
    setWidgetToUpdateState: (state, action) => setWidgetToUpdate(state, action),
  },
});

export const {
  updateGeneralState,
  toggleSliderState,
  showWidgetsState,
  setCreatingWidgetState,
  setUneditModeState,
  setIsUpdatingTitleState,
  setWidgetToUpdateState,
} = generalSlice.actions;

export default generalSlice.reducer;

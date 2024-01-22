// src/components/redux/lib/general.lib.jsx
import { cloneDeep } from "lodash";

export const updateState = (state, action) => {
  const data = cloneDeep(state);
  data[action.payload.name] = action.payload.payload;
  return data;
};

export const toggleSlider = (state, action) => {
  return {
    ...state,
    sliderOpen: action.payload,
  };
};

export const showWidgets = (state, action) => {
  return {
    ...state,
    showWidgets: action.payload,
  };
};

export const setCreatingWidget = (state, action) => {
  return {
    ...state,
    isCreatingWidget: action.payload,
  };
};

export const setUneditMode = (state, action) => {
  return {
    ...state,
    uneditMode: action.payload,
  };
};

export const setIsUpdatingTitle = (state, action) => {
  return {
    ...state,
    isUpdatingTitle: action.payload,
  };
};

export const setWidgetToUpdate = (state, action) => {
  return {
    ...state,
    widgetToUpdate: action.payload,
  };
};

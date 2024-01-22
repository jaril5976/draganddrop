// src/components/redux/lib/dashboard.lib.jsx
import { cloneDeep } from "lodash";

export const updateState = (state, action) => {
  const data = cloneDeep(state);
  data[action.payload.name] = action.payload.payload;
  return data;
};

export const addNewWidget = (state, action) => {
  let data = cloneDeep(state);
  if (data.layout.length > 0) {
    let prevObj = data.layout[data.layout.length - 1];
    let prevX = prevObj.x;
    let prevY = prevObj.y;
    let newData = action.payload;
    newData.x = prevX + 1;
    newData.y = prevY + 1;
    newData.w = 1;
    newData.h = 2;
    data.layout.push(newData);
    return data;
  }
  data.layout.push({ ...action.payload, w: 1, h: 2, x: 0, y: 0 });
  return data;
};

export const pushFirstWidget = (state, action) => {
  let data = cloneDeep(state);
  data.layout.push(action.payload);
  return data;
};

export const widgetResize = (state, action) => {
  const data = cloneDeep(state);
  const index = data.layout.findIndex((k) => k.i === action.payload.i);
  data.layout[index] = {
    ...action.payload,
  };
  return data;
};

export const widgetDrag = (state, action) => {
  const data = cloneDeep(state);
  const index = data.layout.findIndex((k) => k.i === action.payload.i);
  data.layout[index] = {
    ...action.payload,
  };

  return data;
};

export const deleteWidget = (state, action) => {
  const data = cloneDeep(state);
  const { widgetUID } = action.payload;

  const index = data.layout.findIndex(
    (widget) => widget.widgetUID === widgetUID
  );

  if (index !== -1) {
    data.layout.splice(index, 1);
  }

  return data;
};

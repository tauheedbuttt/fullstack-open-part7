import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  message: null,
  variant: "error", // | "error" | "success"
};

const notificationSlice = createSlice({
  name: "notification",
  initialState,
  reducers: {
    setNotificationState(state, action) {
      return action.payload;
    },
    clearNotification() {
      return initialState;
    },
  },
});

export const setNotification = (notification, time) => (dispatch) => {
  const data = { variant: "error", ...notification };
  dispatch(setNotificationState(data));
  setTimeout(() => {
    dispatch(clearNotification());
  }, time ?? 5000);
};

export const { clearNotification, setNotificationState } =
  notificationSlice.actions;
export default notificationSlice.reducer;

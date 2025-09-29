import { createSlice } from "@reduxjs/toolkit";
import blogService from "../services/blogs";

export const localStorageKey = "loggedBlogappUser";

const userSlice = createSlice({
  name: "user",
  initialState: null,
  reducers: {
    setUser(state, action) {
      return action.payload;
    },
    removeUser() {
      return null;
    },
  },
});

export const initializeUser = () => (dispatch) => {
  const loggedUserJSON = window.localStorage.getItem(localStorageKey);
  if (loggedUserJSON) {
    const user = JSON.parse(loggedUserJSON);
    dispatch(loginUser(user));
  }
};

export const loginUser = (user) => (dispatch) => {
  dispatch(setUser(user));
  localStorage.setItem(localStorageKey, JSON.stringify(user));
  blogService.setToken(user.token);
};

export const logoutUser = () => (dispatch) => {
  dispatch(removeUser());
  localStorage.removeItem(localStorageKey);
  blogService.setToken(null);
};

export const { setUser, removeUser } = userSlice.actions;
export default userSlice.reducer;

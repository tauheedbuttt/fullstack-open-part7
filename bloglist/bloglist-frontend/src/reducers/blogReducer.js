import { createSlice } from "@reduxjs/toolkit";

const blogsSlice = createSlice({
  name: "blogs",
  initialState: [],
  reducers: {
    setBlogs(state, action) {
      return action.payload;
    },
    addBlog(state, action) {
      state.push(action.payload);
    },
    updateBlog(state, action) {
      const { id } = action.payload;
      const blog = state.find((b) => b.id === id);
      return state.map((b) =>
        b.id === id ? { ...blog, ...action.payload } : b
      );
    },
    deleteBlog(state, action) {
      const id = action.payload;
      return state.filter((b) => b.id !== id);
    },
  },
});

export const createBlog = (blog) => async (dispatch) => {
  dispatch(addBlog(blog));
};

export const likeBlog = (blog) => async (dispatch) => {
  dispatch(updateBlog(blog));
};

export const { setBlogs, addBlog, updateBlog, deleteBlog } = blogsSlice.actions;
export default blogsSlice.reducer;

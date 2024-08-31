import { createSlice } from "@reduxjs/toolkit";

const blogSlice = createSlice({
  name: "blogs",
  initialState: [],
  reducers: {
    addBlogs: (state, action) => {
      return action.payload;
    },
    addBlog: (state, action) => {
      state.push(action.payload);
    },
    removeBlog: (state, action) => {
      return state.filter((blog) => blog.id !== action.payload);
    },
    updateLikes: (state, action) => {
      const updatedBlog = action.payload;
      return state.map((blog) =>
        blog.id === updatedBlog.id ? updatedBlog : blog,
      );
    },
  },
});

export const { addBlog, addBlogs, removeBlog, updateLikes } = blogSlice.actions;

export default blogSlice.reducer;

import { useState } from "react";
import blogService from "../services/blogs";
import { createBlog } from "../reducers/blogReducer";
import { setNotification } from "../reducers/notificationReducer";
import { logoutUser } from "../reducers/userReducer";
import { useDispatch } from "react-redux";

const baseBlogState = {
  title: "",
  url: "",
  author: "",
};

const BlogForm = () => {
  const dispatch = useDispatch();
  const [blog, setBlog] = useState(baseBlogState);

  const handleChange = (e) => {
    setBlog({
      ...blog,
      [e.target.name]: e.target.value,
    });
  };

  const showNotification = (notification, time) => {
    dispatch(setNotification(notification, time));
  };
  const handleError = (err) => {
    const message = err?.response?.data?.error ?? "Internal Server Error";
    const code = err?.response?.status;
    showNotification({ message });
    if (code === 401) return dispatch(logoutUser(null));
  };

  const handleAddBlog = async (blog) => {
    try {
      const returnedBlog = await blogService.create(blog);
      dispatch(createBlog(returnedBlog));
    } catch (err) {
      handleError(err);
    }
  };

  const onSubmit = (event) => {
    event.preventDefault();
    handleAddBlog(blog);
  };
  return (
    <div>
      <h2>Create a new blog</h2>

      <form onSubmit={onSubmit}>
        <label>
          Title:
          <input
            placeholder="title"
            name="title"
            value={blog.title}
            onChange={handleChange}
          />
        </label>
        <br />
        <label>
          Author:
          <input
            placeholder="author"
            name="author"
            value={blog.author}
            onChange={handleChange}
          />
        </label>
        <br />
        <label>
          URL:
          <input
            placeholder="url"
            name="url"
            value={blog.url}
            onChange={handleChange}
          />
        </label>
        <br />
        <button type="submit">save</button>
      </form>
    </div>
  );
};

export default BlogForm;

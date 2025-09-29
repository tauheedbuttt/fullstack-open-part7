import { useState } from "react";
import blogService from "../services/blogs";
import { createBlog } from "../reducers/blogReducer";
import { setNotification } from "../reducers/notificationReducer";
import { logoutUser } from "../reducers/userReducer";
import { useDispatch } from "react-redux";
import { Form } from "react-bootstrap";

const baseBlogState = {
  title: "",
  url: "",
  author: "",
};

const BlogForm = ({ closeToggle }) => {
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
      setBlog(baseBlogState);
      closeToggle();
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

      <Form onSubmit={onSubmit}>
        <Form.Group className="mb-2">
          <Form.Label>Title:</Form.Label>
          <Form.Control
            placeholder="title"
            name="title"
            value={blog.title}
            onChange={handleChange}
          />
        </Form.Group>
        <Form.Group className="mb-2">
          <Form.Label>Author:</Form.Label>
          <Form.Control
            placeholder="author"
            name="author"
            value={blog.author}
            onChange={handleChange}
          />
        </Form.Group>
        <Form.Group className="mb-2">
          <Form.Label>URL:</Form.Label>
          <Form.Control
            placeholder="url"
            name="url"
            value={blog.url}
            onChange={handleChange}
          />
        </Form.Group>
        <button type="submit" className="btn btn-primary mt-2">
          save
        </button>
      </Form>
    </div>
  );
};

export default BlogForm;

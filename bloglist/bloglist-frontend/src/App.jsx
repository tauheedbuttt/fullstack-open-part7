import { useState, useEffect, useRef } from "react";
import Blog from "./components/Blog";
import blogService from "./services/blogs";
import loginService from "./services/login";
import Notification from "./components/Notification";
import LoginForm from "./components/LoginForm";
import BlogForm from "./components/BlogForm";
import Togglable from "./components/Togglable";
import { setNotification } from "./reducers/notificationReducer";
import { useDispatch, useSelector } from "react-redux";
import {
  createBlog,
  deleteBlog,
  likeBlog,
  setBlogs,
} from "./reducers/blogReducer";
import {
  initializeUser,
  localStorageKey,
  loginUser,
  logoutUser,
} from "./reducers/userReducer";
import { Route, Routes } from "react-router";
import Users from "./Users";
import User from "./User";

const App = () => {
  const dispatch = useDispatch();
  const notification = useSelector((state) => state.notification);
  const user = useSelector((state) => state.user);
  const blogs = useSelector((state) =>
    [...state.blogs].sort((a, b) => b.likes - a.likes)
  );
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const blogFormRef = useRef();

  const showNotification = (notification, time) => {
    dispatch(setNotification(notification, time));
  };

  const handleError = (err) => {
    const message = err?.response?.data?.error ?? "Internal Server Error";
    const code = err?.response?.status;
    showNotification({ message });
    if (code === 401) return handleLogout();
  };

  const handleLogin = async (event) => {
    event.preventDefault();

    try {
      const user = await loginService.login({ username, password });
      dispatch(loginUser(user));
      setUsername("");
      setPassword("");
    } catch (err) {
      showNotification({
        message: err?.response?.data?.error ?? "wrong credentials",
      });
    }
  };

  const handleLogout = () => dispatch(logoutUser(null));

  const handleAddBlog = async (blog) => {
    try {
      const returnedBlog = await blogService.create(blog);
      dispatch(createBlog(returnedBlog));
      blogFormRef.current?.toggleVisibility();
    } catch (err) {
      handleError(err);
    }
  };

  const handleLikeBlog = async (id, blog) => {
    try {
      const returnedBlog = await blogService.update(id, blog);
      dispatch(likeBlog(returnedBlog));
    } catch (err) {
      handleError(err);
    }
  };

  const handleDeleteBlog = async (blog) => {
    const isConfirmed = confirm(`Remove blog ${blog.title}`);
    if (!isConfirmed) return;

    try {
      await blogService.deleteBlog(blog.id);
      dispatch(deleteBlog(blog.id));
    } catch (err) {
      handleError(err);
    }
  };

  useEffect(() => {
    blogService.getAll().then((blogs) => dispatch(setBlogs(blogs)));
  }, []);

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem(localStorageKey);
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON);
      dispatch(initializeUser(user));
    }
  }, []);

  return (
    <div>
      <h2>BLOGS</h2>
      <Notification
        message={notification.message}
        variant={notification.variant}
      />
      {!user && (
        <Togglable buttonLabel="Login">
          <LoginForm
            username={username}
            password={password}
            handleUsernameChange={({ target }) => setUsername(target.value)}
            handlePasswordChange={({ target }) => setPassword(target.value)}
            handleSubmit={handleLogin}
          />
        </Togglable>
      )}
      {user && (
        <div>
          {" "}
          <p>
            {user.name} logged in{" "}
            <button onClick={handleLogout}>Log out </button>
          </p>{" "}
          <Togglable buttonLabel="Create new blog" ref={blogFormRef}>
            <BlogForm handleAddBlog={handleAddBlog} />
          </Togglable>
        </div>
      )}
      <br />
      {blogs.map((blog) => (
        <Blog
          key={blog.id}
          blog={blog}
          likeBlog={handleLikeBlog}
          handleDeleteBlog={handleDeleteBlog}
          isDeleteAllowed={blog.user?.username === user?.username}
        />
      ))}
      <Routes>
        <Route path="/users" element={<Users />} />
        <Route path="/users/:id" element={<User />} />
      </Routes>
    </div>
  );
};

export default App;

import { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import BlogForm from "./components/BlogForm";
import Togglable from "./components/Togglable";
import { setBlogs } from "./reducers/blogReducer";
import blogService from "./services/blogs";
import { Link } from "react-router";

const Blogs = () => {
  const dispatch = useDispatch();
  const blogs = useSelector((state) =>
    [...state.blogs].sort((a, b) => b.likes - a.likes)
  );

  const blogFormRef = useRef();

  useEffect(() => {
    blogService.getAll().then((blogs) => dispatch(setBlogs(blogs)));
  }, []);

  const closeToggle = () => blogFormRef.current?.toggleVisibility();

  return (
    <div>
      <Togglable buttonLabel="Create new blog" ref={blogFormRef}>
        <BlogForm closeToggle={closeToggle} />
      </Togglable>
      <br />
      {blogs.map((blog) => (
        <div
          key={blog.id}
          style={{
            borderStyle: "solid",
            borderWidth: "1px",
            borderRadius: "5px",
            marginBottom: "10px",
            padding: "10px",
          }}
        >
          <Link
            to={`/blogs/${blog.id}`}
          >{`${blog.title} - ${blog.author}`}</Link>
        </div>
      ))}
    </div>
  );
};

export default Blogs;

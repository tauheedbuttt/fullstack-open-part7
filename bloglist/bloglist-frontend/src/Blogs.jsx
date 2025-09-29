import { useEffect, useRef } from "react";
import { Card, ListGroup } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router";
import BlogForm from "./components/BlogForm";
import Togglable from "./components/Togglable";
import { setBlogs } from "./reducers/blogReducer";
import blogService from "./services/blogs";

const Blogs = () => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user);
  const blogs = useSelector((state) =>
    [...state.blogs].sort((a, b) => b.likes - a.likes)
  );

  const blogFormRef = useRef();

  useEffect(() => {
    blogService.getAll().then((blogs) => dispatch(setBlogs(blogs)));
  }, [dispatch]);

  const closeToggle = () => blogFormRef.current?.toggleVisibility();

  return (
    <div>
      {user && (
        <div className="mb-4">
          <Togglable buttonLabel="Create new blog" ref={blogFormRef}>
            <BlogForm closeToggle={closeToggle} />
          </Togglable>
        </div>
      )}

      <Card>
        <ListGroup variant="flush">
          {blogs.length === 0 ? (
            <ListGroup.Item className="text-center text-muted">
              No blogs available
            </ListGroup.Item>
          ) : (
            blogs.map((blog) => (
              <ListGroup.Item
                key={blog.id}
                className="d-flex justify-content-between align-items-center"
              >
                <div>
                  <Link
                    to={`/blogs/${blog.id}`}
                    className="text-decoration-none fw-bold"
                  >
                    {blog.title}
                  </Link>
                  <small className="text-muted d-block">
                    {blog.author} • {blog.likes} likes
                  </small>
                </div>
              </ListGroup.Item>
            ))
          )}
        </ListGroup>
      </Card>
    </div>
  );
};

export default Blogs;

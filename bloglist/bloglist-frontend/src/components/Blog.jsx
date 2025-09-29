import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate, useParams } from "react-router";
import { deleteBlog, likeBlog } from "../reducers/blogReducer";
import { setNotification } from "../reducers/notificationReducer";
import { logoutUser } from "../reducers/userReducer";
import blogService from "../services/blogs";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import Comment from "./Comment";
import { Alert, Button, Card, ListGroup, Spinner } from "react-bootstrap";

const Blog = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector((state) => state.user);
  const id = useParams().id;

  const queryClient = useQueryClient();

  const response = useQuery({
    queryKey: ["blog"],
    queryFn: () => blogService.getOne(id),
    enabled: !!id,
  });

  const blog = response.data;
  const { isLoading, error } = response;

  const showNotification = (notification, time) => {
    dispatch(setNotification(notification, time));
  };

  const handleError = (err) => {
    const message = err?.response?.data?.error ?? "Internal Server Error";
    const code = err?.response?.status;
    showNotification({ message });
    if (code === 401) return dispatch(logoutUser(null));
  };

  const handleLikeBlog = async () => {
    try {
      const { id, user, likes, ...blogWithoutFields } = blog;
      const updatedLikes = likes + 1;
      const returnedBlog = await blogService.update(id, {
        ...blogWithoutFields,
        user: user.id,
        likes: updatedLikes,
      });
      dispatch(likeBlog(returnedBlog));
      queryClient.setQueryData(["blog"], returnedBlog);
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
      navigate("/blogs");
    } catch (err) {
      handleError(err);
    }
  };

  if (error) return <Alert variant="danger">Error fetching blog</Alert>;
  if (isLoading)
    return (
      <div className="d-flex justify-content-center my-4">
        <Spinner animation="border" />
      </div>
    );
  if (!blog) return <Alert variant="warning">Blog not found</Alert>;

  const isDeleteAllowed = blog.user?.username === user?.username;

  return (
    <div id={"blog"}>
      <h1>{`${blog.title} - ${blog.author}`} </h1>
      <p>
        added by {blog.user.name}
        <br />
        <a href={blog.url}>{blog.url}</a>
      </p>
      <div>
        {blog.likes} likes
        <Button
          variant="outline-primary"
          size="sm"
          onClick={handleLikeBlog}
          className="ms-2"
        >
          Like
        </Button>
        <br />
      </div>
      {isDeleteAllowed && (
        <Button
          variant="danger"
          size="sm"
          onClick={() => handleDeleteBlog(blog)}
          className="mt-2"
        >
          Delete
        </Button>
      )}

      <Card className="mt-4">
        <Card.Body>
          <Card.Title as="h4">Comments</Card.Title>
          <Comment blogId={blog.id} handleError={handleError} />
          <ListGroup variant="flush" className="mt-3 gap-3 d-flex flex-column">
            {blog.comments.length === 0 && (
              <ListGroup.Item>No comments yet.</ListGroup.Item>
            )}
            {blog.comments.map((comment) => (
              <ListGroup.Item
                key={comment.id}
                className="border rounded bg-light"
              >
                {comment.description}
              </ListGroup.Item>
            ))}
          </ListGroup>
        </Card.Body>
      </Card>
    </div>
  );
};

export default Blog;

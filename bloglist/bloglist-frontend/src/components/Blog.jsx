import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate, useParams } from "react-router";
import { deleteBlog, likeBlog } from "../reducers/blogReducer";
import { setNotification } from "../reducers/notificationReducer";
import { logoutUser } from "../reducers/userReducer";
import blogService from "../services/blogs";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import Comment from "./Comment";

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

  if (error) return <div>error fetching blog</div>;
  if (isLoading) return <div>loading...</div>;
  if (!user) return <div>user not found</div>;
  if (!blog) return <div>blog not found</div>;

  const isDeleteAllowed = blog.user?.username === user?.username;

  return (
    <div id={"blog"}>
      <h1>{`${blog.title} - ${blog.author}`} </h1>
      <div>
        <a href={blog.url}>{blog.url}</a>
      </div>
      <div>
        {blog.likes} likes
        <button onClick={handleLikeBlog}>Like</button> <br />
      </div>
      <div>added by {blog.user.name}</div>
      {isDeleteAllowed && (
        <button onClick={() => handleDeleteBlog(blog)}>Delete</button>
      )}

      <h4>comments</h4>
      <Comment blogId={blog.id} handleError={handleError} />
      <ul>
        {blog.comments.map((comment) => (
          <li key={comment.id}>{comment.description}</li>
        ))}
      </ul>
    </div>
  );
};

export default Blog;

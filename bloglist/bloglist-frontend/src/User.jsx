import { useQuery } from "@tanstack/react-query";
import { Link, useParams } from "react-router";
import usersService from "./services/users";

const User = () => {
  const id = useParams().id;
  const response = useQuery({
    queryKey: ["users", id],
    queryFn: () => usersService.getOne(id),
    enabled: !!id,
  });

  const user = response.data;
  const { isLoading, error } = response;

  if (error) return <div>error fetching user</div>;
  if (isLoading) return <div>loading...</div>;
  if (!user) return <div>user not found</div>;

  return (
    <div>
      <h2>{user.name}</h2>
      <h4>added blogs</h4>
      <ul>
        {user.blogs.map((blog) => (
          <li key={blog.id}>
            <Link to={`/blogs/${blog.id}`}>{blog.title}</Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default User;

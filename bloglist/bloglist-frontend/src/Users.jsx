import { useQuery } from "@tanstack/react-query";
import usersService from "./services/users";
import { Link } from "react-router";

const Users = () => {
  const response = useQuery({
    queryKey: ["users"],
    queryFn: usersService.getAll,
    enabled: true,
  });

  const { data: users, isLoading, error } = response;

  if (error) return <div>error fetching users</div>;
  if (isLoading) return <div>loading...</div>;

  return (
    <div>
      <h2>Users</h2>
      <table>
        <thead>
          <tr>
            <th></th>
            <th>blogs created</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id}>
              <td>
                <Link to={`/users/${user.id}`}>{user.name}</Link>
              </td>
              <td>{user.blogs}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Users;

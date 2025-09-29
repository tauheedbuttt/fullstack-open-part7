import { useQuery } from "@tanstack/react-query";
import { Alert, Card, ListGroup, Spinner } from "react-bootstrap";
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

  if (error) return <Alert variant="danger">Error fetching user</Alert>;
  if (isLoading)
    return (
      <div className="d-flex justify-content-center my-4">
        <Spinner animation="border" />
      </div>
    );
  if (!user) return <Alert variant="warning">User not found</Alert>;

  return (
    <Card className="border-0 shadow-sm">
      <Card.Body>
        <Card.Title as="h2">{user.name}</Card.Title>
        <Card.Subtitle className="mb-3 text-muted">Added blogs</Card.Subtitle>
        <ListGroup variant="flush">
          {user.blogs.map((blog) => (
            <ListGroup.Item key={blog.id}>
              <Link to={`/blogs/${blog.id}`}>{blog.title}</Link>
            </ListGroup.Item>
          ))}
        </ListGroup>
      </Card.Body>
    </Card>
  );
};

export default User;

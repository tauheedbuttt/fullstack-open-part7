import { useMutation, useQueryClient } from "@tanstack/react-query";
import blogService from "../services/blogs";
import { Form } from "react-bootstrap";

const Comment = ({ blogId, handleError }) => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: blogService.addComment,
    onSuccess: (updatedBlog) => {
      queryClient.setQueryData(["blog"], updatedBlog);
    },
    onError: handleError,
  });

  const { mutate, isPending } = mutation;

  const handleSubmit = (e) => {
    e.preventDefault();
    const description = e.target.description.value;
    mutate({ blogId, description });
    e.target.description.value = "";
  };

  return (
    <Form onSubmit={handleSubmit} className="d-flex align-items-center gap-3">
      <Form.Group className="w-100">
        <Form.Control
          name="description"
          type="text"
          placeholder="Add a comment"
        />
      </Form.Group>
      <button
        disabled={isPending}
        type="submit"
        className="btn btn-primary"
        style={{ whiteSpace: "nowrap" }}
      >
        add comment
      </button>
    </Form>
  );
};

export default Comment;

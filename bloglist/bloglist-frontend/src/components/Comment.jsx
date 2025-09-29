import { useMutation, useQueryClient } from "@tanstack/react-query";
import blogService from "../services/blogs";

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
    <form onSubmit={handleSubmit}>
      <label>
        <input name="description" type="text" />
        <button disabled={isPending} type="submit">
          add comment
        </button>
      </label>
    </form>
  );
};

export default Comment;

import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../contexts/userContext";

const BlogView = ({ blog, update, remove, addComment }) => {
  const { user } = useContext(UserContext);
  const navigate = useNavigate();
  const handleLikeClick = async () => {
    await update({
      ...blog,
      likes: blog.likes + 1,
    });
  };
  const handleRemoveClick = async () => {
    if (confirm(`Remove blog ${blog.title} by ${blog.author}`)) {
      await remove(blog);
      navigate("/");
    }
  };
  const displayRemoveButton = () => {
    return (
      blog.user?.username === user.username && (
        <button onClick={handleRemoveClick}>remove</button>
      )
    );
  };
  const handleCommentSubmit = async (event) => {
    event.preventDefault();
    const comment = event.target.comment.value;
    addComment({
      content: comment,
      blog: blog.id,
    });
    event.target.comment.value = "";
  };
  return (
    (blog && (
      <div>
        <h1>{blog.title}</h1>
        <p>{blog.url}</p>
        <p>
          {blog.likes} likes
          <button onClick={handleLikeClick}>like</button>
        </p>
        <p>{blog.author}</p>
        {displayRemoveButton()}
        <h3>comments</h3>
        <form onSubmit={handleCommentSubmit}>
          <input type="text" name="comment" />
          <button type="submit">add comment</button>
        </form>
        <ul>
          {blog.comments.map((comment) => (
            <li key={comment.id}>{comment.content}</li>
          ))}
        </ul>
      </div>
    )) || <div>Loading...</div>
  );
};
export default BlogView;

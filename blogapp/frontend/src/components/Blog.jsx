import { useState } from "react";

const Blog = ({ blog, update, username, remove }) => {
  const [isHidden, setIsHidden] = useState(true);
  const toggleVisibility = () => setIsHidden(!isHidden);
  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: "solid",
    borderWidth: 1,
    marginBottom: 5,
  };
  const handleLikeClick = async () => {
    await update({
      ...blog,
      likes: blog.likes + 1,
    });
  };
  const handleRemoveClick = async () => {
    if (confirm(`Remove blog ${blog.title} by ${blog.author}`)) {
      await remove(blog);
    }
  };
  const displayRemoveButton = () => {
    console.log([blog.user?.username, username]);
    return (
      blog.user?.username === username && (
        <button onClick={handleRemoveClick}>remove</button>
      )
    );
  };
  return (
    <div style={blogStyle} className="blog-container">
      {blog.title} {blog.author}
      <button onClick={toggleVisibility}>{isHidden ? "view" : "hide"}</button>
      {!isHidden && (
        <div className="hiddenInfo">
          <p>{blog.url}</p>
          <p>
            likes <span data-testid="likes-count">{blog.likes}</span>{" "}
            <button onClick={handleLikeClick}>like</button>
          </p>
          <p>
            {blog.user?.name} {blog.user?.username}
          </p>
          {displayRemoveButton()}
        </div>
      )}
    </div>
  );
};

export default Blog;

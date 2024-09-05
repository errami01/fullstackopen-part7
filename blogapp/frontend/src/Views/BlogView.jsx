import { useEffect, useState, useContext } from "react";
import { useNavigate, useParams } from "react-router-dom";
import blogsService from "../services/blogs";
import { UserContext } from "../contexts/userContext";
import { useQueryClient } from "@tanstack/react-query";

const BlogView = ({ blog, update, remove }) => {
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
      </div>
    )) || <div>Loading...</div>
  );
};
export default BlogView;

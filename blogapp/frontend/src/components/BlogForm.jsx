import { Button, TextField } from "@mui/material";
import { useState } from "react";
const BlogForm = ({ createBlog, toggleVisibility }) => {
  const [newBlog, setNewBlog] = useState({ title: "", author: "", url: "" });
  const { title, author, url } = newBlog;

  const handleSubmit = (event) => {
    event.preventDefault();
    createBlog(newBlog, setNewBlog);
  };
  const handleInputChange = (input, value) => {
    setNewBlog({
      ...newBlog,
      [input]: value,
    });
  };
  return (
    <div>
      <h1>create new</h1>
      <form onSubmit={handleSubmit} data-testid="blog-form">
        <div>
          <TextField
            type="text"
            value={title}
            label="title"
            name="title"
            size="small"
            margin="normal"
            onChange={({ target }) => handleInputChange("title", target.value)}
            data-testid="title"
          />
        </div>
        <div>
          <TextField
            type="text"
            value={author}
            name="Author"
            label="Tuthor"
            size="small"
            margin="normal"
            onChange={({ target }) => handleInputChange("author", target.value)}
            data-testid="author"
          />
        </div>
        <div>
          <TextField
            type="text"
            value={url}
            name="Url"
            label="Url"
            size="small"
            margin="normal"
            onChange={({ target }) => handleInputChange("url", target.value)}
            data-testid="url"
          />
        </div>
        <Button variant="contained" color="primary" type="submit">
          create
        </Button>
        <Button onClick={toggleVisibility}>cancel</Button>
      </form>
    </div>
  );
};
export default BlogForm;

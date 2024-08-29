import { useState } from "react";
const BlogForm = ({ createBlog }) => {
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
          title
          <input
            type="text"
            value={title}
            name="title"
            onChange={({ target }) => handleInputChange("title", target.value)}
            placeholder="title"
            data-testid="title"
          />
        </div>
        <div>
          author
          <input
            type="text"
            value={author}
            name="Author"
            onChange={({ target }) => handleInputChange("author", target.value)}
            placeholder="author"
            data-testid="author"
          />
        </div>
        <div>
          url
          <input
            type="text"
            value={url}
            name="Url"
            onChange={({ target }) => handleInputChange("url", target.value)}
            placeholder="url"
            data-testid="url"
          />
        </div>
        <button type="submit">create</button>
      </form>
    </div>
  );
};
export default BlogForm;

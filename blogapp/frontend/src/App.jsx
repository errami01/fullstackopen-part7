import { useState, useEffect, useRef } from "react";
import "./App.css";
import Blog from "./components/Blog";
import blogService from "./services/blogs";
import loginService from "./services/login";
import Notification from "./components/Notification";
import LoginForm from "./components/LoginForm";
import BlogForm from "./components/BlogForm";
import Togglable from "./components/Togglable ";

const App = () => {
  const [blogs, setBlogs] = useState([]);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [notifMessage, setNotifMessage] = useState(null);
  const [user, setUser] = useState(
    JSON.parse(localStorage.getItem("loggedBloglistUser")) || null,
  );
  const blogFormRef = useRef();
  useEffect(() => {
    blogService.getAll().then((blogs) => setBlogs(blogs));
  }, []);
  const handleLogin = async (event) => {
    event.preventDefault();
    try {
      const user = await loginService.login({
        username,
        password,
      });
      blogService.setToken(user.token);
      localStorage.setItem("loggedBloglistUser", JSON.stringify(user));
      setUser(user);
      setUsername("");
      setPassword("");
    } catch (exception) {
      setNotifMessage({ type: "error", message: "Wrong username or passowrd" });
      setTimeout(() => {
        setNotifMessage(null);
      }, 5000);
    }
  };
  const handleLogout = () => {
    localStorage.removeItem("loggedBloglistUser");
    setUser(null);
  };
  const createBlog = async (newBlog, setNewBlog) => {
    try {
      blogService.setToken(user.token);
      blogFormRef.current.toggleVisibility();
      const response = await blogService.create(newBlog);
      setNotifMessage({
        type: "success",
        message: `a new blog ${response.title} by ${response.author} added`,
      });
      setTimeout(() => {
        setNotifMessage(null);
      }, 5000);
      setNewBlog({ title: "", author: "", url: "" });
      console.log(response);
      setBlogs([...blogs, response]);
    } catch (error) {
      setNotifMessage({ type: "error", message: error.message });
      setTimeout(() => {
        setNotifMessage(null);
      }, 5000);
    }
  };
  const updateBlogLikes = async (updatedBlog) => {
    try {
      const response = await blogService.update(updatedBlog);
      const newBlogs = [...blogs];
      const blogIndex = newBlogs.findIndex(
        (blog) => blog.id === updatedBlog.id,
      );
      newBlogs[blogIndex].likes = response.likes;
      setBlogs(newBlogs);
    } catch (error) {
      setNotifMessage({ type: "error", message: error.message });
      setTimeout(() => {
        setNotifMessage(null);
      }, 5000);
    }
  };
  const removeBlog = async (blogId) => {
    try {
      blogService.setToken(user.token);
      await blogService.remove(blogId);
      const newBlogs = blogs.filter((blog) => blog.id !== blogId);
      setBlogs(newBlogs);
    } catch (error) {
      setNotifMessage({ type: "error", message: error.message });
      setTimeout(() => {
        setNotifMessage(null);
      }, 5000);
    }
  };
  const loginForm = () => (
    <LoginForm
      username={username}
      password={password}
      handleUsernameChange={({ target }) => setUsername(target.value)}
      handlePasswordChange={({ target }) => setPassword(target.value)}
      handleSubmit={handleLogin}
    />
  );
  const blogForm = () => (
    <Togglable buttonLabel="new blog" ref={blogFormRef}>
      <BlogForm createBlog={createBlog} />
    </Togglable>
  );
  const loggedUserElements = () => (
    <div data-testid="blogs-list">
      <h1>Blogs</h1>
      <p>
        {user.name} {user.username} is logged in{" "}
        <button onClick={handleLogout}>logout</button>
      </p>
      {blogForm()}
      {blogs
        .toSorted((a, b) => b.likes - a.likes)
        .map((blog) => (
          <Blog
            key={blog.id}
            blog={blog}
            update={updateBlogLikes}
            remove={removeBlog}
            username={user.username}
          />
        ))}
    </div>
  );
  return (
    <div>
      <Notification notifMessage={notifMessage} />
      {!user && loginForm()}
      {user && loggedUserElements()}
    </div>
  );
};

export default App;

import { useState, useEffect, useRef } from "react";
import "./App.css";
import Blog from "./components/Blog";
import blogService from "./services/blogs";
import loginService from "./services/login";
import Notification from "./components/Notification";
import LoginForm from "./components/LoginForm";
import BlogForm from "./components/BlogForm";
import Togglable from "./components/Togglable ";
import {
  setNotification,
  clearNotification,
} from "./reducers/notificationReducer";
import { addBlog, addBlogs } from "./reducers/blogReducer";
import { useSelector, useDispatch } from "react-redux";

const App = () => {
  const dispatch = useDispatch();
  const notification = useSelector((state) => state.notification);
  const blogsRedux = useSelector((state) => state.blogs);
  const [blogs, setBlogs] = useState([]);
  console.log(blogsRedux);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [user, setUser] = useState(
    JSON.parse(localStorage.getItem("loggedBloglistUser")) || null,
  );
  const blogFormRef = useRef();
  useEffect(() => {
    blogService.getAll().then((blogs) => {
      dispatch(addBlogs(blogs));
      setBlogs(blogs);
    });
  }, []);
  const notify = (message, type = "success") => {
    dispatch(
      setNotification({
        type,
        message,
      }),
    );
    setTimeout(() => {
      dispatch(clearNotification(null));
    }, 5000);
  };
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
      notify("Wrong username or password", "error");
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
      notify(`a new blog ${response.title} by ${response.author} added`);
      setNewBlog({ title: "", author: "", url: "" });
      setBlogs([...blogs, response]);
      dispatch(addBlog(response));
    } catch (error) {
      notify(error.message, "error");
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
      notify(`You liked ${updatedBlog.title} by ${updatedBlog.author}`);
    } catch (error) {
      notify(error.message, "error");
    }
  };
  const removeBlog = async (blog) => {
    try {
      const blogId = blog.id;
      blogService.setToken(user.token);
      await blogService.remove(blogId);
      const newBlogs = blogs.filter((blog) => blog.id !== blogId);
      setBlogs(newBlogs);
      notify(`Blog ${blog.title} by ${blog.author} removed`);
    } catch (error) {
      notify(error.message, "error");
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
      {blogsRedux
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
      <Notification notifMessage={notification} />
      {!user && loginForm()}
      {user && loggedUserElements()}
    </div>
  );
};

export default App;

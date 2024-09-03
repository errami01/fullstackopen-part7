import { useState, useRef, useContext } from "react";
import "./App.css";
import Blog from "./components/Blog";
import blogService from "./services/blogs";
import loginService from "./services/login";
import Notification from "./components/Notification";
import LoginForm from "./components/LoginForm";
import BlogForm from "./components/BlogForm";
import Togglable from "./components/Togglable ";
import {
  addBlog,
  addBlogs,
  removeBlog as removeReduxBlog,
  updateLikes,
} from "./reducers/blogReducer";
import { setUser, clearUser } from "./reducers/userReducer";
import { useSelector, useDispatch } from "react-redux";
import { NotificationContext } from "./contexts/notificationContext";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

const App = () => {
  const dispatch = useDispatch();
  const { notification, dispatchNotification } =
    useContext(NotificationContext);
  const user = useSelector((state) => state.user);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const blogFormRef = useRef();
  const {
    data: blogs,
    error,
    isLoading,
  } = useQuery({
    queryKey: ["blogs"],
    queryFn: blogService.getAll,
  });
  const queryClient = useQueryClient();
  const newBlogMutation = useMutation({
    mutationFn: blogService.create,
    onSuccess: (newBlog) => {
      queryClient.invalidateQueries({ queryKey: ["blogs"] });
      notify(`a new blog ${newBlog.title} by ${newBlog.author} added`);
    },
    onError: (error) => {
      // Handle the error
      notify(error.message, "error"); // Show an error message to the user
    },
  });
  const notify = (message, type = "success") => {
    dispatchNotification({
      type: "SET_NOTIFICATION",
      payload: { message, type },
    });
    setTimeout(() => {
      dispatchNotification({ type: "CLEAR_NOTIFICATION" });
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
      dispatch(setUser(user));
      setUsername("");
      setPassword("");
    } catch (exception) {
      notify("Wrong username or password", "error");
    }
  };
  const handleLogout = () => {
    localStorage.removeItem("loggedBloglistUser");
    setUser(null);
    dispatch(clearUser());
  };
  const createBlog = async (newBlog, setNewBlog) => {
    blogService.setToken(user.token);
    blogFormRef.current.toggleVisibility();
    newBlogMutation.mutate(newBlog);
    setNewBlog({ title: "", author: "", url: "" });
  };
  const updateBlogLikes = async (updatedBlog) => {
    try {
      const response = await blogService.update(updatedBlog);
      dispatch(updateLikes(updatedBlog));
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
      dispatch(removeReduxBlog(blogId));
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
      {isLoading ? (
        <p>Loading...</p>
      ) : (
        blogs
          .toSorted((a, b) => b.likes - a.likes)
          .map((blog) => (
            <Blog
              key={blog.id}
              blog={blog}
              update={updateBlogLikes}
              remove={removeBlog}
              username={user.username}
            />
          ))
      )}
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

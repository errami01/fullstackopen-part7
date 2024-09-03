import { useState, useRef, useContext } from "react";
import "./App.css";
import Blog from "./components/Blog";
import blogService from "./services/blogs";
import loginService from "./services/login";
import Notification from "./components/Notification";
import LoginForm from "./components/LoginForm";
import BlogForm from "./components/BlogForm";
import Togglable from "./components/Togglable ";
import { NotificationContext } from "./contexts/notificationContext";
import { UserContext } from "./contexts/userContext";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

const App = () => {
  const { notification, dispatchNotification } =
    useContext(NotificationContext);
  const { user, dispatchUser } = useContext(UserContext);
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
    mutationFn: async (newBlog) => await blogService.create(newBlog),
    onSuccess: async (newBlog) => {
      await queryClient.invalidateQueries({ queryKey: ["blogs"] });
      notify(`a new blog ${newBlog.title} by ${newBlog.author} added`);
    },
    onError: (error) => {
      // Handle the error
      notify(error.message, "error"); // Show an error message to the user
    },
  });
  const likeBlogMutation = useMutation({
    mutationFn: (updatedBlog) => blogService.update(updatedBlog),
    onSuccess: async (updatedBlog) => {
      await queryClient.invalidateQueries({ queryKey: ["blogs"] });
      notify(`You liked ${updatedBlog.title} by ${updatedBlog.author}`);
    },
    onError: (error) => {
      notify(error.message, "error");
    },
  });
  const removeBlogMutation = useMutation({
    mutationFn: async (blog) => {
      await blogService.remove(blog.id);
      return blog;
    },
    onSuccess: async (blog) => {
      await queryClient.invalidateQueries({ queryKey: ["blogs"] });
      notify(`Blog ${blog.title} by ${blog.author} removed`);
    },
    onError: (error) => {
      notify(error.message, "error");
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
      dispatchUser({ type: "LOGIN", payload: user });
      setUsername("");
      setPassword("");
    } catch (exception) {
      notify("Wrong username or password", "error");
    }
  };
  const handleLogout = () => {
    dispatchUser({ type: "LOGOUT" });
  };
  const createBlog = async (newBlog, setNewBlog) => {
    blogService.setToken(user.token);
    blogFormRef.current.toggleVisibility();
    newBlogMutation.mutate(newBlog);
    setNewBlog({ title: "", author: "", url: "" });
  };
  const updateBlogLikes = async (updatedBlog) => {
    const response = await blogService.update(updatedBlog);
    likeBlogMutation.mutate(updatedBlog);
  };
  const removeBlog = async (blog) => {
    blogService.setToken(user.token);
    removeBlogMutation.mutate(blog);
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

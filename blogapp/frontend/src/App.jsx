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
import Home from "./Views/Home";
import Users from "./Views/Users";
import { Link, Route, Routes, useMatch } from "react-router-dom";
import SingleUser from "./Views/SingleUser";
import BlogView from "./Views/BlogView";

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
    mutationFn: async (updatedBlog) => await blogService.update(updatedBlog),
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
  const newCommentMutation = useMutation({
    mutationFn: async (comment) => {
      await blogService.addComment(comment.blog, comment);
      return comment;
    },
    onSuccess: async (comment) => {
      await queryClient.invalidateQueries({
        queryKey: ["blogs"],
      });
      notify(`Your comment was added`);
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
  const match = useMatch("/blogs/:id");
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
    // const response = await blogService.update(updatedBlog);
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
  const homeChildren = () => (
    <div>
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
  const loggedUserElements = () => {
    if (isLoading) return <p>Loading...</p>;
    const blog = match ? blogs.find((b) => b.id === match.params.id) : null;
    return (
      <div data-testid="blogs-list">
        <div style={{ backgroundColor: "#D3D3D3", padding: "5px" }}>
          <Link style={{ marginRight: "5px" }} to={"/"}>
            blogs
          </Link>
          <Link style={{ marginRight: "5px" }} to={"/users"}>
            users
          </Link>
          <span>
            {user.name} {user.username} logged in{" "}
            <button onClick={handleLogout}>logout</button>
          </span>
        </div>
        <h1>Blog app</h1>
        <p></p>
        <Routes>
          <Route path="/users/:id" element={<SingleUser />} />
          <Route
            path="/blogs/:id"
            element={
              <BlogView
                blog={blog}
                remove={removeBlog}
                update={updateBlogLikes}
                addComment={newCommentMutation.mutate}
              />
            }
          />
          <Route path="/users" element={<Users />} />
          <Route path="/" element={<Home>{homeChildren()}</Home>} />
        </Routes>
      </div>
    );
  };
  return (
    <div>
      <Notification notifMessage={notification} />
      {!user && loginForm()}
      {user && loggedUserElements()}
    </div>
  );
};

export default App;

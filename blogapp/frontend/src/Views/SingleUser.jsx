import { useEffect, useState } from "react";
import usersService from "../services/users";
import { useParams } from "react-router-dom";

const SingleUser = () => {
  const id = useParams().id;
  const [user, setUser] = useState(null);
  useEffect(() => {
    usersService.getById(id).then((response) => {
      setUser(response);
    });
  }, []);
  if (!user) return <div>Loading...</div>;
  const blogList = user.blogs.map((blog) => (
    <li key={blog.title}>{blog.title}</li>
  ));
  return (
    <div>
      <h1>
        {user.name} {user.username}
      </h1>
      <h3>added blogs</h3>
      <ul>{blogList}</ul>
    </div>
  );
};
export default SingleUser;

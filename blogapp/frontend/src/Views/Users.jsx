import { useEffect, useState } from "react";
import usersService from "../services/users";

const Users = () => {
  const [users, setUsers] = useState([]);
  useEffect(() => {
    usersService.getAll().then((users) => setUsers(users));
  }, []);
  console.log(users);
  const usersRows = users.map((user) => (
    <tr key={user.id}>
      <td>
        {user.name} {user.username}
      </td>
      <td>{user.blogs.length}</td>
    </tr>
  ));
  return (
    <div>
      <h2>Users</h2>
      {users.length ? (
        <table>
          <thead>
            <tr>
              <th></th>
              <th>blogs created</th>
            </tr>
          </thead>
          <tbody>{usersRows}</tbody>
        </table>
      ) : (
        <h4>Loading...</h4>
      )}
    </div>
  );
};

export default Users;

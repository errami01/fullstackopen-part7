import { useEffect, useState } from "react";
import usersService from "../services/users";
import { Link } from "react-router-dom";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from "@mui/material";

const Users = () => {
  const [users, setUsers] = useState([]);
  useEffect(() => {
    usersService.getAll().then((users) => setUsers(users));
  }, []);
  const usersRows = users.map((user) => (
    <TableRow key={user.id}>
      <TableCell>
        <Link to={user.id}>
          {user.name} {user.username}
        </Link>
      </TableCell>
      <TableCell>{user.blogs.length}</TableCell>
    </TableRow>
  ));
  return (
    <div>
      <h2>Users</h2>
      {users.length ? (
        <Table>
          <TableHead>
            <TableRow>
              <TableCell component="th" variant="head">
                Users
              </TableCell>
              <TableCell component="th" variant="head">
                blogs created
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>{usersRows}</TableBody>
        </Table>
      ) : (
        <h4>Loading...</h4>
      )}
    </div>
  );
};

export default Users;

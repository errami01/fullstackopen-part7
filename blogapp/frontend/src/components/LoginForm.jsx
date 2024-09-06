import { Button, TextField } from "@mui/material";
import PropTypes from "prop-types";

const LoginForm = ({
  handleSubmit,
  handleUsernameChange,
  handlePasswordChange,
  username,
  password,
}) => {
  return (
    <form onSubmit={handleSubmit} data-testid="login-form">
      <h2>Log in to application</h2>
      <div>
        <TextField
          type="text"
          margin="normal"
          value={username}
          label="Username"
          size="small"
          onChange={handleUsernameChange}
          data-testid="username"
        />
      </div>
      <div>
        <TextField
          type="password"
          margin="normal"
          size="small"
          value={password}
          label="Password"
          onChange={handlePasswordChange}
          data-testid="password"
        />
      </div>
      <div>
        <Button variant="contained" color="primary" type="submit">
          login
        </Button>
      </div>
    </form>
  );
};

LoginForm.propTypes = {
  handleSubmit: PropTypes.func.isRequired,
  handleUsernameChange: PropTypes.func.isRequired,
  handlePasswordChange: PropTypes.func.isRequired,
  username: PropTypes.string.isRequired,
  password: PropTypes.string.isRequired,
};
export default LoginForm;

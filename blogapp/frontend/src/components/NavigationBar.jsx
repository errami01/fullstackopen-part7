import { AppBar, Button, Toolbar, Typography } from "@mui/material";
import { Link } from "react-router-dom";

const NavigationBar = () => {
  return (
    <AppBar position={"static"}>
      <Toolbar>
        <Typography marginRight="30px" variant="h6" color="inherit">
          Blog App
        </Typography>
        <Button color="inherit" component={Link} to="/">
          Blogs
        </Button>
        <Button color="inherit" component={Link} to="/users">
          Users
        </Button>
      </Toolbar>
    </AppBar>
  );
};

export default NavigationBar;

import { createContext, useReducer } from "react";

const UserContext = createContext();
const initialState =
  JSON.parse(localStorage.getItem("loggedBloglistUser")) || null;

const userReducer = (state, action) => {
  switch (action.type) {
    case "LOGIN":
      localStorage.setItem("loggedBloglistUser", JSON.stringify(action.payload));
      return action.payload;
    case "LOGOUT":
      localStorage.removeItem("loggedBloglistUser");
      return null;
    default:
      return state;
  }
};

const UserProvider = ({ children }) => {
  const [user, dispatchUser] = useReducer(userReducer, initialState);

  return (
    <UserContext.Provider value={{ user, dispatchUser }}>
      {children}
    </UserContext.Provider>
  );
};

export { UserContext, UserProvider };

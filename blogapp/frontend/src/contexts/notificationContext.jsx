import { createContext, useReducer } from "react";

const NotificationContext = createContext();
const initialState = {
  message: "",
  type: "",
};
const notificationReducer = (state, action) => {
  switch (action.type) {
    case "SET_NOTIFICATION":
      return {
        message: action.payload.message,
        type: action.payload.type,
      };
    case "CLEAR_NOTIFICATION":
      return initialState;
    default:
      return state;
  }
};
const NotificationProvider = ({ children }) => {
  const [notification, dispatchNotification] = useReducer(
    notificationReducer,
    initialState,
  );

  return (
    <NotificationContext.Provider
      value={{ notification, dispatchNotification }}
    >
      {children}
    </NotificationContext.Provider>
  );
};
export { NotificationContext, NotificationProvider };

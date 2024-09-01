import ReactDOM from "react-dom/client";
import { configureStore } from "@reduxjs/toolkit";
import { Provider } from "react-redux";
import App from "./App";
import blogReducer from "./reducers/blogReducer";
import userReducer from "./reducers/userReducer";
import { NotificationProvider } from "./contexts/notificationContext";

const store = configureStore({
  reducer: {
    blogs: blogReducer,
    user: userReducer,
  },
});

// Render the React application to the DOM
ReactDOM.createRoot(document.getElementById("root")).render(
  <Provider store={store}>
    <NotificationProvider>
      <App />
    </NotificationProvider>
  </Provider>,
);

import ReactDOM from "react-dom/client";
import { configureStore } from "@reduxjs/toolkit";
import { Provider } from "react-redux";
import App from "./App";
import userReducer from "./reducers/userReducer";
import { NotificationProvider } from "./contexts/notificationContext";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const store = configureStore({
  reducer: {
    user: userReducer,
  },
});
const queryClient = new QueryClient();
// Render the React application to the DOM
ReactDOM.createRoot(document.getElementById("root")).render(
  <Provider store={store}>
    <QueryClientProvider client={queryClient}>
      <NotificationProvider>
        <App />
      </NotificationProvider>
    </QueryClientProvider>
  </Provider>,
);

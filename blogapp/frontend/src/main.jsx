import ReactDOM from "react-dom/client";
import App from "./App";
import { NotificationProvider } from "./contexts/notificationContext";
import { UserProvider } from "./contexts/userContext";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient();
// Render the React application to the DOM
ReactDOM.createRoot(document.getElementById("root")).render(
  <QueryClientProvider client={queryClient}>
    <NotificationProvider>
      <UserProvider>
        <App />
      </UserProvider>
    </NotificationProvider>
  </QueryClientProvider>,
);

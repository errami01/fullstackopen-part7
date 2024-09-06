import { Alert } from "@mui/material";

const Notification = ({ notifMessage }) => {
  if (!notifMessage.message) return;
  const { type, message } = notifMessage;
  return <Alert severity={type}>{message}</Alert>;
};

export default Notification;

const Notification = ({ notifMessage }) => {
  if (!notifMessage.message) return;
  const { type, message } = notifMessage;
  return <div className={type}>{message}</div>;
};

export default Notification;

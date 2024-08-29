const Notification = ({ notifMessage }) => {
  if (notifMessage === null) return;
  const { type, message } = notifMessage;
  return <div className={type}>{message}</div>;
};

export default Notification;

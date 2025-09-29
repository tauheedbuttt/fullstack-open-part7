import { Alert } from "react-bootstrap";
import { useSelector } from "react-redux";

const Notification = () => {
  const notification = useSelector((state) => state.notification);

  if (notification.message === null) {
    return null;
  }

  return (
    <div className="container">
      <Alert
        variant={
          notification.variant === "error" ? "danger" : notification.variant
        }
      >
        {notification.message}
      </Alert>
    </div>
  );
};

export default Notification;

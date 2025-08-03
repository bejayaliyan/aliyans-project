import { useEffect } from "react";
import addNotification from "react-push-notification";

const useNotification = () => {
  useEffect(() => {
    if (Notification.permission !== "granted") {
      Notification.requestPermission().then((permission) => {
        //console.log("Notification permission:", permission);
      });
    }
  }, []);

  // Function to send notifications dynamically
  const sendNotification = (notificationTitle, notificationMessage, notificationTheme = "darkblue") => {    
    addNotification({
      title: notificationTitle,
      message:notificationMessage,
      theme: notificationTheme,
      duration: 8000,
      native: true, // Use native browser notification if supported
    });
  };

  return sendNotification;
};

export default useNotification;

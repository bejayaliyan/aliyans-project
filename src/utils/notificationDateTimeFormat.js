export const notificationDateTimeFormat = (notificationDate) => {   

    const notificationDateObj = new Date(notificationDate);

    // Format the date as "Sun, May 08, 2022"
    const formattedDate = notificationDateObj.toLocaleDateString('en-US', {
      weekday: 'short', // 'Sun'
      month: 'short', // 'May'
      day: '2-digit', // '08'
      year: 'numeric' // '2022'
    });

    // Format the time as "09:30 AM"
    const formattedTime = notificationDateObj.toLocaleTimeString('en-US', {
      hour: '2-digit', // '09'
      minute: '2-digit', // '30'
      hour12: true // 'AM'
    });

    return formattedDate + " "  + formattedTime;
  }
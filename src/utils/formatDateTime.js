export const formatDateTime = (dateTimeValue) => {
    const date = new Date(dateTimeValue);
    const options = {
      month: '2-digit', 
      day: '2-digit', 
      year: '2-digit',
      hour: '2-digit', 
      minute: '2-digit',
      hour12: true,
    };
    const formattedDateTime = new Intl.DateTimeFormat('en-US', options).format(date);
  
    return `${formattedDateTime}`;
  };  
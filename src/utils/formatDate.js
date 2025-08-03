export const formatDate = (dateTimeValue) => {
    const date = new Date(dateTimeValue);
    const options = {
      month: '2-digit', 
      day: '2-digit', 
      year: '2-digit',
    };
    const formattedDate = new Intl.DateTimeFormat('en-US', options).format(date);
  
    return `${formattedDate}`;
  };
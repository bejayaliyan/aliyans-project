export const formatTime = (timeValue) => {
  const date = new Date(`1970-01-01T${timeValue}Z`); // Use a dummy date for correct parsing
  const options = {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  };
  
  const formattedTime = new Intl.DateTimeFormat('en-US', options).format(date);
  
  return formattedTime;
};
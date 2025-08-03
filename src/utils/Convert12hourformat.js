export const Convert12hourformat = (time24) => {    
    const [hours, minutes, seconds] = time24.split(":").map(Number);
    const date = new Date();
    date.setHours(hours, minutes, seconds);
    
    const time12 = date.toLocaleTimeString("en-US", {
      //hour: "2-digit",
      hour: "numeric",
      minute: "2-digit",
      //second: "2-digit",
      hour12: true,
    });
    return time12;
  }
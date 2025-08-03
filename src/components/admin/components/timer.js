import React, { useState, useEffect } from 'react';

const DynamicTimer = () => {
  const [currentTime, changeTime] = useState(null);

  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  useEffect(() => {
    function checkTime() {
      const temp_time = new Date();
      let temp_day = temp_time.getDate();

      switch (temp_day) {
        case 1:
        case 21:
        case 31:
          temp_day += 'st';
          break;
        case 2:
        case 22:
          temp_day += 'nd';
          break;
        case 3:
        case 23:
          temp_day += 'rd';
          break;
        default:
          temp_day += 'th';
          break;
      }

      const hour = temp_time.getHours() % 12;
      const paddedHour = hour.toString().padStart(2, '0');
      const paddedMinute = temp_time.getMinutes().toString().padStart(2, '0');

      changeTime({
        hour: paddedHour,
        minute: paddedMinute,
        pm: temp_time.getHours() > 11 ? 'PM' : 'AM',
        day: temp_day,
        month: monthNames[temp_time.getMonth()],
        year: temp_time.getFullYear(),
      });
    }

    const intervalId = setInterval(checkTime, 1000);

    return () => clearInterval(intervalId);
  }, []);

  return (
    <>
      {currentTime ? (
        <h5 className='date'>
          { (currentTime.hour.startsWith('0') ? currentTime.hour.slice(1) : currentTime.hour) === '0' ? 12 : (currentTime.hour.startsWith('0') ? currentTime.hour.slice(1) : currentTime.hour)}:{currentTime.minute} {currentTime.pm} <span className="at">at</span> {currentTime.day} {currentTime.month} {currentTime.year}
        </h5>
      ) : (
        ''
      )}
    </>
  );
};

export { DynamicTimer };

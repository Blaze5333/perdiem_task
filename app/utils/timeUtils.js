/*eslint-disable*/
import moment from 'moment-timezone';

export const isTimeWithinRange = (time, startTime, endTime) => {
  if (!startTime || !endTime) return false;
  
  const [hour, minute] = time.split(':').map(Number);
  const [startHour, startMinute] = startTime.split(':').map(Number);
  const [endHour, endMinute] = endTime.split(':').map(Number);
  
  // Convert to minutes for easier comparison
  const timeMinutes = hour * 60 + minute;
  const startMinutes = startHour * 60 + startMinute;
  const endMinutes = endHour * 60 + endMinute;
  
  return timeMinutes >= startMinutes && timeMinutes <= endMinutes;
};


export const isTimeSlotOpen = (timeString, hoursForDay) => {
  if (!hoursForDay || hoursForDay.length === 0) return false;
  
  // Convert time string to minutes for comparison
  const [hour, minute] = timeString.split(':').map(Number);
  const timeInMinutes = hour * 60 + minute;
  
  // Check each hours range
  return hoursForDay.some(range => {
    const [startHour, startMinute] = range.start_time.split(':').map(Number);
    const [endHour, endMinute] = range.end_time.split(':').map(Number);
    
    const startInMinutes = startHour * 60 + startMinute;
    const endInMinutes = endHour * 60 + endMinute;
    
    return timeInMinutes >= startInMinutes && timeInMinutes <= endInMinutes;
  });
};


export const generateTimeSlots = (date, timezone, localTimezoneHours) => {
  if (!date) return [];
  
  const slots = [];
  const tz = timezone === 'NYC' ? 'America/New_York' : moment.tz.guess();
  const momentDate = moment(date).tz(tz);
  
  // Get day of week (1-7, Monday-Sunday)
  const dayOfWeek = momentDate.isoWeekday();
  
  // Find store hours for this day in the user's local timezone
  const localHours = localTimezoneHours.filter(
    h => h.day_of_week === dayOfWeek
  );
  
  // Generate slots for the day (every 30 minutes)
  for (let hour = 0; hour < 24; hour++) {
    for (let minute of [0, 30]) {
      const timeString = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
      const current = momentDate.clone().hour(hour).minute(minute).second(0);
      
      // Check if this time slot is within store hours in local timezone
      const isOpen = isTimeSlotOpen(timeString, localHours);
      
      slots.push({
        time: timeString,
        dateTime: current.toDate(),
        formattedTime: current.format('h:mm A'),
        isOpen: isOpen
      });
    }
  }
  
  return slots;
};


export const getGreeting = (timezone) => {
  const tz = timezone === 'NYC' ? 'America/New_York' : moment.tz.guess();
  const now = moment().tz(tz);
  const hour = now.hour();
  let timeGreeting = '';
  
  if (hour >= 5 && hour <= 9) timeGreeting = 'Good Morning';
  else if (hour >= 10 && hour <= 11) timeGreeting = 'Late Morning Vibes!';
  else if (hour >= 12 && hour <= 16) timeGreeting = 'Good Afternoon';
  else if (hour >= 17 && hour <= 20) timeGreeting = 'Good Evening';
  else timeGreeting = 'Night Owl';
  
  const location = timezone === 'NYC' ? 'New York' : 'Local Time';
  return `${timeGreeting}, ${location}!`;
};


export const generateDates = (timezone, days = 30) => {
  const dates = [];
  const tz = timezone === 'NYC' ? 'America/New_York' : moment.tz.guess();
  
  for (let i = 0; i < days; i++) {
    const date = moment().tz(tz).add(i, 'days').toDate();
    dates.push(date);
  }
  
  return dates;
};

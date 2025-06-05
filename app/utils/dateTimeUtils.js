/*eslint-disable no-unused-vars*/
import moment from 'moment-timezone';

/**
 * Generate an array of dates for the next n days
 * @param {number} numberOfDays - Number of days to generate
 * @param {string} timezone - Timezone to use ('NYC' or 'local')
 * @returns {Array} Array of date objects
 */
export const generateDates = (numberOfDays = 30, timezone = 'local') => {
  const dates = [];
  const tz = timezone === 'NYC' ? 'America/New_York' : moment.tz.guess();
  
  for (let i = 0; i < numberOfDays; i++) {
    // Create a date in the specified timezone
    const date = moment().tz(tz).add(i, 'days').toDate();
    dates.push(date);
  }
  
  return dates;
};

/**
 * Generate time slots in 15-minute intervals
 * @param {Date} date - The date to generate time slots for
 * @param {string} timezone - Timezone to use ('NYC' or 'local')
 * @param {Array} storeHours - Store hours data
 * @param {Array} storeOverrides - Store hours override data
 * @returns {Array} Array of time slot objects
 */
export const generateTimeSlots = (date, timezone, storeHours, storeOverrides) => {
  if (!date || !storeHours) return [];
  
  const slots = [];
  const tz = timezone === 'NYC' ? 'America/New_York' : moment.tz.guess();
  const momentDate = moment(date).tz(tz);
  
  // Get day of week (1-7, Monday-Sunday)
  const dayOfWeek = momentDate.isoWeekday();
  const day = momentDate.date();
  const month = momentDate.month() + 1; // Month is 0-indexed in moment
  
  // Check for overrides first (higher priority)
  const override = storeOverrides?.find(
    o => o.day === day && o.month === month
  );
  
  // If there's an override and the store is closed, return empty array
  if (override && !override.is_open) {
    return [];
  }
  
  // Use regular hours if no overrides or if override exists but store is open
  const regularHours = storeHours?.find(
    h => h.day_of_week === dayOfWeek && h.is_open
  );
  
  // Store is closed on this day
  if (!regularHours && !override) {
    return [];
  }
  
  // Use either override times or regular hours
  const startTime = override ? override.start_time : regularHours.start_time;
  const endTime = override ? override.end_time : regularHours.end_time;
  
  if (!startTime || !endTime) {
    return [];
  }
  
  // Parse start and end times
  const [startHour, startMin] = startTime.split(':').map(Number);
  const [endHour, endMin] = endTime.split(':').map(Number);
  
  // Create moment objects for start and end
  const start = momentDate.clone().hour(startHour).minute(startMin).second(0);
  const end = momentDate.clone().hour(endHour).minute(endMin).second(0);
  
  // Generate slots every 15 minutes
  let current = start.clone();
  while (current.isBefore(end)) {
    slots.push({
      time: current.format('HH:mm'),
      dateTime: current.toDate(),
      formattedTime: current.format('h:mm A')
    });
    current.add(15, 'minutes');
  }
  
  return slots;
};

/**
 * Check if the store is open at a specific date and time
 * @param {Date} date - The date to check
 * @param {string} time - The time to check (format: "HH:MM")
 * @param {string} timezone - Timezone to use ('NYC' or 'local')
 * @param {Array} storeHours - Store hours data
 * @param {Array} storeOverrides - Store hours override data
 * @returns {boolean} True if store is open, false otherwise
 */
export const isStoreOpen = (date, time, timezone, storeHours, storeOverrides) => {
  if (!date || !time || !storeHours) return false;
  
  const tz = timezone === 'NYC' ? 'America/New_York' : moment.tz.guess();
  const momentDate = moment(date).tz(tz);
  
  // Get day of week (1-7, Monday-Sunday)
  const dayOfWeek = momentDate.isoWeekday();
  const day = momentDate.date();
  const month = momentDate.month() + 1; // Month is 0-indexed in moment
  
  // Check for overrides first
  const override = storeOverrides?.find(
    o => o.day === day && o.month === month
  );
  
  if (override) {
    // If there's a specific override for this date, use it
    if (!override.is_open) {
      return false;
    }
    
    if (!override.start_time || !override.end_time) {
      return false;
    }
    
    return isTimeWithinRange(time, override.start_time, override.end_time);
  }
  
  // Use regular hours
  const regularHours = storeHours?.find(
    h => h.day_of_week === dayOfWeek && h.is_open
  );
  
  if (!regularHours) {
    return false;
  }
  
  return isTimeWithinRange(time, regularHours.start_time, regularHours.end_time);
};

/**
 * Check if a time is within a start and end range
 * @param {string} time - Time to check in "HH:MM" format
 * @param {string} startTime - Start time in "HH:MM" format
 * @param {string} endTime - End time in "HH:MM" format
 * @returns {boolean} True if time is within range
 */
const isTimeWithinRange = (time, startTime, endTime) => {
  const [hour, minute] = time.split(':').map(Number);
  const [startHour, startMinute] = startTime.split(':').map(Number);
  const [endHour, endMinute] = endTime.split(':').map(Number);
  
  // Convert to minutes for easier comparison
  const timeMinutes = hour * 60 + minute;
  const startMinutes = startHour * 60 + startMinute;
  const endMinutes = endHour * 60 + endMinute;
  
  return timeMinutes >= startMinutes && timeMinutes <= endMinutes;
};

/**
 * Format a date for display
 * @param {Date} date - The date to format
 * @param {string} timezone - Timezone to use ('NYC' or 'local')
 * @returns {string} Formatted date string
 */
export const formatDate = (date, timezone = 'local') => {
  if (!date) return '';
  
  const tz = timezone === 'NYC' ? 'America/New_York' : moment.tz.guess();
  return moment(date).tz(tz).format('ddd, MMM D');
};

/**
 * Get the current time in the specified timezone
 * @param {string} timezone - Timezone to use ('NYC' or 'local')
 * @returns {Date} Current time as Date object
 */
export const getCurrentTime = (timezone = 'local') => {
  const tz = timezone === 'NYC' ? 'America/New_York' : moment.tz.guess();
  return moment().tz(tz).toDate();
};

/**
 * Find the next time the store will be open
 * @param {Array} storeHours - Array of store hour objects
 * @param {Array} storeOverrides - Array of store override objects
 * @param {string} timezone - User's timezone ('NYC' or 'local')
 * @returns {Object} - Object with next opening date, time and formatted string
 */
export const findNextStoreOpening = (storeHours, storeOverrides, timezone) => {
  if (!storeHours || storeHours.length === 0) {
    return null;
  }
  
  // Always work with NYC time since the store is physically in NYC
  const nycTimezone = 'America/New_York';
  const nowInNYC = moment().tz(nycTimezone);
  let nextOpeningFound = false;
  let nextOpeningDate = null;
  let nextOpeningTime = null;
  
  // Look ahead for up to 7 days
  for (let dayOffset = 0; dayOffset < 7; dayOffset++) {
    const checkDate = nowInNYC.clone().add(dayOffset, 'days');
    const dayOfWeek = checkDate.isoWeekday(); // 1-7 for Monday-Sunday
    const day = checkDate.date();
    const month = checkDate.month() + 1; // Month is 0-indexed in moment
    
    // Check for override first
    const override = storeOverrides?.find(o => o.day === day && o.month === month);
    
    // If there's an override for this date
    if (override) {
      // If the override specifies the store is closed, skip this day entirely
      if (!override.is_open) {
        continue;
      }
      
      // Store is open with special hours
      if (override.start_time) {
        // Parse the start time
        const [startHour, startMin] = override.start_time.split(':').map(Number);
        
        // Create a moment object for the opening time
        const openingTime = checkDate.clone().hour(startHour).minute(startMin).second(0);
        
        // If this time is in the future
        if (openingTime.isAfter(nowInNYC)) {
          nextOpeningDate = openingTime.toDate();
          nextOpeningTime = override.start_time;
          nextOpeningFound = true;
          break;
        }
      }
    } 
    // No override, check regular hours
    else {
      // Find regular hours for this day of week
      const regularHours = storeHours.find(h => h.day_of_week === dayOfWeek && h.is_open);
      
      if (regularHours && regularHours.start_time) {
        // Parse the start time
        const [startHour, startMin] = regularHours.start_time.split(':').map(Number);
        
        // Create a moment object for the opening time
        const openingTime = checkDate.clone().hour(startHour).minute(startMin).second(0);
        
        // If this time is in the future
        if (openingTime.isAfter(nowInNYC)) {
          nextOpeningDate = openingTime.toDate();
          nextOpeningTime = regularHours.start_time;
          nextOpeningFound = true;
          break;
        }
      }
    }
  }
  
  if (nextOpeningFound) {
    // Convert to user's selected timezone for display
    const userTimezone = timezone === 'NYC' ? 'America/New_York' : moment.tz.guess();
    const openingInUserTz = moment(nextOpeningDate).tz(userTimezone);
    
    return {
      date: nextOpeningDate,
      time: nextOpeningTime,
      formattedString: openingInUserTz.format('ddd, MMM D [at] h:mm A'),
      inUserTimezone: openingInUserTz.format('h:mm A z')
    };
  }
  
  return null;
};

export default {
  generateDates,
  generateTimeSlots,
  isStoreOpen,
  formatDate,
  getCurrentTime,
  findNextStoreOpening,
};

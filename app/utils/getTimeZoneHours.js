/*eslint-disable */
import moment from "moment-timezone";
export const processBusinessHours = (apiData, targetTimezone = 'Asia/Kolkata') => {
  // Check if moment is available
  if (typeof moment === 'undefined') {
    throw new Error('moment-timezone library is required. Please install and import moment-timezone.');
  }

  // Helper function to convert time string to minutes
  const timeToMinutes = (timeStr) => {
    const [hours, minutes] = timeStr.split(':').map(Number);
    return hours * 60 + minutes;
  };

  // Helper function to convert minutes back to time string


  // Helper function to merge overlapping time slots
  const mergeOverlappingSlots = (slots) => {
    if (slots.length <= 1) return slots;
    
    // Sort by start time
    slots.sort((a, b) => timeToMinutes(a.start_time) - timeToMinutes(b.start_time));
    
    const merged = [slots[0]];
    
    for (let i = 1; i < slots.length; i++) {
      const current = slots[i];
      const last = merged[merged.length - 1];
      
      const currentStart = timeToMinutes(current.start_time);
      const currentEnd = timeToMinutes(current.end_time);
      const lastStart = timeToMinutes(last.start_time);
      const lastEnd = timeToMinutes(last.end_time);
      
      // Check if current slot overlaps with the last merged slot
      if (currentStart <= lastEnd) {
        // Merge by extending the end time if necessary
        if (currentEnd > lastEnd) {
          last.end_time = current.end_time;
        }
      } else {
        // No overlap, add as new slot
        merged.push(current);
      }
    }
    
    return merged;
  };

  // Helper function to get day of week number from moment weekday
  const getDayOfWeekNumber = (momentWeekday) => {
    // moment.js: Sunday = 0, Monday = 1, ..., Saturday = 6
    // Our format: Monday = 1, Tuesday = 2, ..., Sunday = 7
    return momentWeekday === 0 ? 7 : momentWeekday;
  };

  // Helper function to convert timezone using moment-timezone
  const convertTimezone = (timeStr, dayOfWeek, fromTz = 'America/New_York', toTz) => {
    // Get current week's date for the specified day
    const today = moment();
    let targetDate;
    
    // Find the date for the specified day of week in current week
    if (dayOfWeek === 7) { // Sunday
      targetDate = today.clone().day(0);
    } else {
      targetDate = today.clone().day(dayOfWeek);
    }
    
    // Set the time
    const [hours, minutes] = timeStr.split(':').map(Number);
    targetDate.hour(hours).minute(minutes).second(0).millisecond(0);
    
    // Convert from NYC timezone to target timezone
    const nycMoment = moment.tz(targetDate.format('YYYY-MM-DD HH:mm:ss'), fromTz);
    const targetMoment = nycMoment.clone().tz(toTz);
    
    return {
      time: targetMoment.format('HH:mm'),
      day: getDayOfWeekNumber(targetMoment.day()),
      originalDay: dayOfWeek
    };
  };

  // Main processing function
  
  // Step 1: Clean and filter valid entries
  const validEntries = apiData.filter(entry => 
    entry.day_of_week && 
    entry.is_open === true && 
    entry.start_time && 
    entry.end_time &&
    entry.start_time.trim() !== '' &&
    entry.end_time.trim() !== ''
  );

  // Step 2: Group by day of week
  const groupedByDay = {};
  validEntries.forEach(entry => {
    const day = entry.day_of_week;
    if (!groupedByDay[day]) {
      groupedByDay[day] = [];
    }
    groupedByDay[day].push({
      start_time: entry.start_time,
      end_time: entry.end_time
    });
  });

  // Step 3: Merge overlapping time slots for each day
  Object.keys(groupedByDay).forEach(day => {
    groupedByDay[day] = mergeOverlappingSlots(groupedByDay[day]);
  });

  // Step 4: Convert timezone and handle day changes
  const result = [];
  
  Object.entries(groupedByDay).forEach(([day, slots]) => {
    const dayNum = parseInt(day);
    
    slots.forEach(slot => {
      const startConverted = convertTimezone(slot.start_time, dayNum, 'America/New_York', targetTimezone);
      const endConverted = convertTimezone(slot.end_time, dayNum, 'America/New_York', targetTimezone);
      
      // If start and end are on the same day after conversion
      if (startConverted.day === endConverted.day) {
        result.push({
          day_of_week: startConverted.day,
          start_time: startConverted.time,
          end_time: endConverted.time
        });
      } else {
        // Handle cross-day scenarios
        if (startConverted.day < endConverted.day || 
           (startConverted.day === 7 && endConverted.day === 1)) {
          // Normal case: start day is before end day
          result.push({
            day_of_week: startConverted.day,
            start_time: startConverted.time,
            end_time: '23:59'
          });
          
          result.push({
            day_of_week: endConverted.day,
            start_time: '00:00',
            end_time: endConverted.time
          });
        } else {
          // Edge case: end time is actually next day but shows as previous day
          // This can happen with timezone conversions
          result.push({
            day_of_week: startConverted.day,
            start_time: startConverted.time,
            end_time: endConverted.time
          });
        }
      }
    });
  });

  // Step 5: Group again by day and merge any overlapping slots created by timezone conversion
  const finalGrouped = {};
  result.forEach(entry => {
    const day = entry.day_of_week;
    if (!finalGrouped[day]) {
      finalGrouped[day] = [];
    }
    finalGrouped[day].push({
      start_time: entry.start_time,
      end_time: entry.end_time
    });
  });

  // Final merge of overlapping slots
  const finalResult = [];
  Object.entries(finalGrouped).forEach(([day, slots]) => {
    const merged = mergeOverlappingSlots(slots);
    merged.forEach(slot => {
      finalResult.push({
        day_of_week: parseInt(day),
        start_time: slot.start_time,
        end_time: slot.end_time
      });
    });
  });

  // Sort by day of week
  return finalResult.sort((a, b) => a.day_of_week - b.day_of_week);
}


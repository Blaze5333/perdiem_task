/*eslint-disable*/
import moment from 'moment-timezone';


export const getOverrideForDate = (overrides, day, month) => {
  if (!overrides || !Array.isArray(overrides)) return null;
  
  return overrides.find(o => o.day === day && o.month === month) || null;
};

export const processStoreOverrides = (overrides, targetTimezone) => {
  if (!overrides || overrides.length === 0) return [];
  const nycTz = 'America/New_York';
  
  return overrides.map(override => {
    // Skip conversion if the targetTimezone is NYC
    if (targetTimezone === 'America/New_York') return override;
    
    // Only process time conversion if the store is open (closed days apply to full days)
    if (!override.is_open) return override;
    
    // Create a Date object for this override day in NYC timezone
    // Use current year since overrides don't specify year
    const currentYear = new Date().getFullYear();
    const overrideDate = moment.tz(
      `${currentYear}-${override.month}-${override.day} ${override.start_time}`, 
      'YYYY-M-D HH:mm',
      nycTz
    );
    
    // Convert to target timezone
    const localDate = overrideDate.clone().tz(targetTimezone);
    
    // Create a Date object for this override end time in NYC timezone
    const overrideEndDate = moment.tz(
      `${currentYear}-${override.month}-${override.day} ${override.end_time}`,
      'YYYY-M-D HH:mm',
      nycTz
    );
    
    // Convert to target timezone
    const localEndDate = overrideEndDate.clone().tz(targetTimezone);
    
    return {
      ...override,
      localDay: localDate.date(),
      localMonth: localDate.month() + 1, // month is 0-indexed in moment
      localStartTime: localDate.format('HH:mm'),
      localEndTime: localEndDate.format('HH:mm'),
      crossesMidnight: localDate.date() !== localEndDate.date()
    };
  });
};


export const isHolidayOrSpecialClosure = (overrides, date) => {
  if (!overrides || !overrides.length || !date) return false;
  
  // Convert date to NYC timezone for comparison
  const nycDate = moment(date).tz('America/New_York');
  const day = nycDate.date();
  const month = nycDate.month() + 1; // month is 0-indexed in moment
  
  // Find override for this day
  const override = overrides.find(o => o.day === day && o.month === month);
  
  // If there's an override and is_open is false, it's a holiday/special closure
  return override && !override.is_open;
};


export const isStoreOpenWithOverrides = (regularHours, overrides, date, time, timezone) => {
  if (!regularHours || !regularHours.length || !date || !time) return false;
  
  const nycTz = 'America/New_York';
  const userTz = timezone === 'NYC' ? nycTz : moment.tz.guess();
  
  // Create moment object in user's timezone
  const userDateTime = moment.tz(date, userTz).set({
    hour: parseInt(time.split(':')[0], 10),
    minute: parseInt(time.split(':')[1], 10),
    second: 0
  });
  
  // Convert to NYC time for store hours comparison
  const nycDateTime = userDateTime.clone().tz(nycTz);
  
  // Get NYC date components
  const dayOfWeek = nycDateTime.isoWeekday();
  const day = nycDateTime.date();
  const month = nycDateTime.month() + 1;
  const nycTime = nycDateTime.format('HH:mm');
  
  // Check for overrides first (higher priority)
  const override = overrides?.find(o => o.day === day && o.month === month);
  
  // If there's an override, handle based on is_open flag
  if (override) {
    // For holiday/closure overrides, the entire day is closed
    if (!override.is_open) return false;
    
    // For special opening hours, check if within time range
    const [hour, minute] = nycTime.split(':').map(Number);
    const [startHour, startMinute] = override.start_time.split(':').map(Number);
    const [endHour, endMinute] = override.end_time.split(':').map(Number);
    
    const timeInMinutes = hour * 60 + minute;
    const startInMinutes = startHour * 60 + startMinute;
    const endInMinutes = endHour * 60 + endMinute;
    
    return timeInMinutes >= startInMinutes && timeInMinutes <= endInMinutes;
  }
  
  // Use regular hours if no overrides
  const regularHoursForDay = regularHours.find(
    h => h.day_of_week === dayOfWeek && h.is_open
  );
  
  // Store is closed on this day
  if (!regularHoursForDay) return false;
  
  // Check if time is within regular hours
  const [hour, minute] = nycTime.split(':').map(Number);
  const [startHour, startMinute] = regularHoursForDay.start_time.split(':').map(Number);
  const [endHour, endMinute] = regularHoursForDay.end_time.split(':').map(Number);
  
  const timeInMinutes = hour * 60 + minute;
  const startInMinutes = startHour * 60 + startMinute;
  const endInMinutes = endHour * 60 + endMinute;
  
  return timeInMinutes >= startInMinutes && timeInMinutes <= endInMinutes;
};

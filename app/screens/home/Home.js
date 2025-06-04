/*eslint-disable*/
import React, { useState, useEffect, useRef } from 'react';
import {
  SafeAreaView,
  ScrollView,
  Animated,
  Dimensions,
} from 'react-native';
import { homeStyles } from './homeStyle';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
import moment from 'moment-timezone';
import { findNextStoreOpening } from '../../utils/dateTimeUtils';
import { processBusinessHours } from '../../utils/getTimeZoneHours';

// Import components
import HomeHeader from '../../components/HomeHeader';
import GreetingCard from '../../components/GreetingCard';
import DateTimeSelector from '../../components/DateTimeSelector';
import ModalContainer from '../../components/ModalContainer';
import DatePickerModal from '../../components/DatePickerModal';
import TimePickerModal from '../../components/TimePickerModal';
import StoreStatusCard from '../../components/StoreStatusCard';
import AnimatedTimezoneToggle from '../../components/AnimatedTimezoneToggle';

// Import API services
import { fetchAllStoreData } from '../../services/api/storeService';

const { height } = Dimensions.get('window');

/**
 * Home Screen Component
 * Main screen for displaying store hours and allowing users to check appointment availability
 */
const HomeScreen = () => {
  // User state from Redux
  const name = useSelector((state) => state.user.name);
  const photo = useSelector((state) => state.user.photo);
  
  // Navigation
  const navigation = useNavigation();
  
  // Timezone state
  const [selectedTimezone, setSelectedTimezone] = useState('NYC');
  
  // Date and time selection
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);
  
  // Modal visibility state
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  
  // Store status and time state
  const [storeStatus, setStoreStatus] = useState('open');
  const [currentTime, setCurrentTime] = useState(new Date());
  
  // Animation references
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(height)).current;
  const toggleAnim = useRef(new Animated.Value(0)).current;

  // Store data state
  const [storeHours, setStoreHours] = useState([]);
  const [storeOverrides, setStoreOverrides] = useState([]);
  const [localTimezoneHours, setLocalTimezoneHours] = useState([]);
  const [loading, setLoading] = useState(true);

  // Animation config
  const animationConfig = {
    spring: {
      tension: 100,
      friction: 8,
    },
  };

  /**
   * Fetch store hours and overrides from API
   */
  useEffect(() => {
    const fetchStoreData = async () => {
      setLoading(true);
      try {
        // Use the storeService to fetch store data
        const { storeHours: hours, storeOverrides: overrides } = await fetchAllStoreData();
        
        // Process hours for local timezone
        const userTimezone = selectedTimezone === 'NYC' ? 'America/New_York' : moment.tz.guess();
        const localTimeZoneHours = processBusinessHours(hours, userTimezone);
        
        setStoreHours(hours || []); 
        setStoreOverrides(overrides || []);
        setLocalTimezoneHours(localTimeZoneHours || []); 
      } catch (error) {
        console.error('Error fetching store data:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchStoreData();
  }, []);

  /**
   * Update time every minute
   */
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);

    return () => clearInterval(timer);
  }, []);

  /**
   * Handle timezone change
   */
  useEffect(() => {
    // Animate toggle switch
    Animated.timing(toggleAnim, {
      toValue: selectedTimezone === 'NYC' ? 0 : 1,
      duration: 200,
      useNativeDriver: false,
    }).start();
    
    // Reset selections when timezone changes
    setSelectedDate(null);
    setSelectedTime(null);
    
    // Re-process hours for the new timezone
    if (storeHours && storeHours.length > 0) {
      const userTimezone = selectedTimezone === 'NYC' ? 'America/New_York' : moment.tz.guess();
      const processedHours = processBusinessHours(storeHours, userTimezone);
      setLocalTimezoneHours(processedHours || []);
    }
  }, [selectedTimezone, storeHours]);

  /**
   * Update store status when date or time changes
   */
  useEffect(() => {
    if (selectedDate && selectedTime) {
      const isOpen = checkStoreStatus(selectedDate, selectedTime);
      setStoreStatus(isOpen ? 'open' : 'closed');
    }
  }, [selectedDate, selectedTime, storeHours, storeOverrides]);

  /**
   * Check if the store is open at the selected date and time
   */
  const checkStoreStatus = (date, time) => {
    if (!date || !time || storeHours.length === 0) return false;
    
    // Convert user's selected date/time to NYC timezone for comparison
    const userTz = selectedTimezone === 'NYC' ? 'America/New_York' : moment.tz.guess();
    const nycTz = 'America/New_York';
    
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
    const override = storeOverrides?.find(
      o => o.day === day && o.month === month
    );
    
    // If there's an override and the store is closed, return false
    if (override) {
      if (!override.is_open) return false;
      return isTimeWithinRange(nycTime, override.start_time, override.end_time);
    }
    
    // Use regular hours if no overrides
    const regularHours = storeHours?.find(
      h => h.day_of_week === dayOfWeek && h.is_open
    );
    
    // Store is closed on this day
    if (!regularHours) {
      return false;
    }
    
    return isTimeWithinRange(nycTime, regularHours.start_time, regularHours.end_time);
  };
  
  /**
   * Check if a time is within a range
   */
  const isTimeWithinRange = (time, startTime, endTime) => {
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
  
  /**
   * Generate dates for date picker
   */
  const generateDates = () => {
    const dates = [];
    const tz = selectedTimezone === 'NYC' ? 'America/New_York' : moment.tz.guess();
    
    for (let i = 0; i < 30; i++) {
      const date = moment().tz(tz).add(i, 'days').toDate();
      dates.push(date);
    }
    
    return dates;
  };
  
  /**
   * Generate time slots for the selected date
   */
  const generateTimeSlots = (date) => {
    if (!date) return [];
    
    const slots = [];
    const tz = selectedTimezone === 'NYC' ? 'America/New_York' : moment.tz.guess();
    const momentDate = moment(date).tz(tz);
    
    // Get day of week
    const dayOfWeek = momentDate.isoWeekday();
    
    // Find store hours for this day in the user's local timezone
    const localHours = localTimezoneHours.filter(
      h => h.day_of_week === dayOfWeek
    );
    
    // Generate all slots for the day (every 30 minutes)
    for (let hour = 0; hour < 24; hour++) {
      for (let minute of [0, 30]) {
        const timeString = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
        const current = momentDate.clone().hour(hour).minute(minute).second(0);
        
        // Check if this time slot is within store hours
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
  
  /**
   * Check if a time slot is within store hours
   */
  const isTimeSlotOpen = (timeString, hoursForDay) => {
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

  /**
   * Show modal with animation
   */
  const showModal = (modalType) => {
    if (modalType === 'date') {
      setShowDatePicker(true);
    } else {
      setShowTimePicker(true);
    }
    
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.spring(slideAnim, {
        toValue: 0,
        ...animationConfig.spring,
        useNativeDriver: true,
      }),
    ]).start();
  };

  /**
   * Hide modal with animation
   */
  const hideModal = (modalType) => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: height,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start(() => {
      if (modalType === 'date') {
        setShowDatePicker(false);
      } else {
        setShowTimePicker(false);
      }
      slideAnim.setValue(height);
      fadeAnim.setValue(0);
    });
  };

  /**
   * Get the next store opening time
   */
  const getNextStoreOpening = () => {
    return findNextStoreOpening(
      storeHours,
      storeOverrides,
      selectedTimezone
    );
  };

  return (
    <SafeAreaView style={homeStyles.container}>
      {/* Header Component */}
      <HomeHeader 
        name={name} 
        photo={photo} 
        onProfilePress={() => navigation.navigate('Profile')} 
      />

      <ScrollView style={homeStyles.homeContent} showsVerticalScrollIndicator={false}>
        {/* Timezone Toggle Component */}
        <AnimatedTimezoneToggle
          selectedTimezone={selectedTimezone}
          setSelectedTimezone={setSelectedTimezone}
          toggleAnim={toggleAnim}
        />

        {/* Greeting Card Component */}
        <GreetingCard
          selectedTimezone={selectedTimezone}
          currentTime={currentTime}
          isStoreOpen={checkStoreStatus(new Date(), moment().format('HH:mm'))}
          loading={loading}
        />

        {/* Store Status Component - shows only when date/time selected */}
        {selectedDate && selectedTime && (
          <StoreStatusCard
            selectedDate={selectedDate}
            selectedTime={selectedTime}
            storeStatus={storeStatus}
            nextOpening={getNextStoreOpening()}
          />
        )}

        {/* Date Time Selection Component */}
        <DateTimeSelector
          selectedDate={selectedDate}
          onPress={() => showModal('date')}
        />
      </ScrollView>

      {/* Date Picker Modal */}
      <ModalContainer
        visible={showDatePicker}
        onClose={() => hideModal('date')}
        title="Select Date"
        fadeAnim={fadeAnim}
        slideAnim={slideAnim}
      >
        <DatePickerModal
          dates={generateDates()}
          onSelectDate={(date) => {
            setSelectedDate(date);
            hideModal('date');
            setTimeout(() => showModal('time'), 300);
          }}
        />
      </ModalContainer>

      {/* Time Picker Modal */}
      <ModalContainer
        visible={showTimePicker}
        onClose={() => hideModal('time')}
        title="Available Time Slots"
        fadeAnim={fadeAnim}
        slideAnim={slideAnim}
      >
        <TimePickerModal
          selectedDate={selectedDate}
          timeSlots={generateTimeSlots(selectedDate)}
          selectedTime={selectedTime}
          onSelectTime={(time) => {
            setSelectedTime(time);
            hideModal('time');
          }}
        />
      </ModalContainer>
    </SafeAreaView>
  );
};

export default HomeScreen;

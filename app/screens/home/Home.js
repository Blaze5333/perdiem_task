/*eslint-disable*/
import React, { useState, useEffect, useRef } from 'react';
import { SafeAreaView, ScrollView, Animated, Dimensions, Text, View, Platform, Alert } from 'react-native';
import { homeStyles } from './homeStyle';
import { useSelector } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
import moment from 'moment-timezone';
import { findNextStoreOpening } from '../../utils/dateTimeUtils';
import { processBusinessHours } from '../../utils/getTimeZoneHours';
import HomeHeader from '../../components/HomeHeader'
import GreetingCard from '../../components/GreetingCard';
import DateTimeSelector from '../../components/DateTimeSelector';
import ModalContainer from '../../components/ModalContainer';
import DatePickerModal from '../../components/DatePickerModal';
import TimePickerModal from '../../components/TimePickerModal';
import StoreStatusCard from '../../components/StoreStatusCard';
import AnimatedTimezoneToggle from '../../components/AnimatedTimezoneToggle';
import NextOpeningCard from '../../components/NextOpeningCard';
import RefreshButton from '../../components/RefreshButton';
import { fetchAllStoreData } from '../../services/apis/storeService';
import NotificationService from '../../services/NotificationService';

const { height } = Dimensions.get('window');

const HomeScreen = ({route}) => {
  
  const name = useSelector((state) => state.user.name);
  const photo = useSelector((state) => state.user.photo);
  
 
  const navigation = useNavigation();
  // const route=useRoute()
  

  const [selectedTimezone, setSelectedTimezone] = useState('NYC');

  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);
  
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  
  const [storeStatus, setStoreStatus] = useState('open');
  const [currentTime, setCurrentTime] = useState(new Date());
  const [timeZoneSelectedDate, settimeZoneSelectedDate] = useState({
    timeZone: '',
    date: "",
    time: ""
  })
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(height)).current;
  const toggleAnim = useRef(new Animated.Value(0)).current;

  const [storeHours, setStoreHours] = useState([]);
  const [storeOverrides, setStoreOverrides] = useState([]);
  const [localTimezoneHours, setLocalTimezoneHours] = useState([]);
  const [loading, setLoading] = useState(true);
  const animationConfig = {
    spring: {
      tension: 100,
      friction: 8,
    },
  };


  const fetchStoreData = async () => {
    setLoading(true);
    try {
      // Use the storeService to fetch store data
      const { storeHours: hours, storeOverrides: overrides } = await fetchAllStoreData();
      
      // Add test override for June 7th
      const updatedOverrides = [...(overrides || [])];
      updatedOverrides.push({
          id: 'default',
          day: 7,
          month: 6,
          is_open: false
      });
      
      // Process hours for local timezone
      const userTimezone = selectedTimezone === 'NYC' ? 'America/New_York' : moment.tz.guess();
      const localTimeZoneHours = processBusinessHours(hours, userTimezone);
      
      setStoreHours(hours || []); 
      setStoreOverrides(updatedOverrides || []);
      setLocalTimezoneHours(localTimeZoneHours || []);
    } catch (error) {
      console.error('Error fetching store data:', error);
    } finally {
      setLoading(false);
    }
  };
  
  // Load store data on initial mount
  useEffect(() => {
    fetchStoreData();
  }, []);


  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);

    return () => clearInterval(timer);
  }, []);
// Helper function to combine date and time with timezone support
function combineDateAndTime(dateObj, timeString, timezone) {
  const tz = timezone === 'NYC' ? 'America/New_York' : moment.tz.guess();
  const dateStr = moment(dateObj).format('YYYY-MM-DD');
  return moment.tz(`${dateStr} ${timeString}`, 'YYYY-MM-DD HH:mm', tz);
}


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
    
    // Convert date and time between timezones if available
    if (selectedDate && selectedTime) {
      // Store the current selection with timezone for future conversions
      const oldTimezone = timeZoneSelectedDate.timeZone;
      
      // Always update our timeZoneSelectedDate with the latest selection and timezone
      settimeZoneSelectedDate({
        timeZone: selectedTimezone,
        date: selectedDate.toISOString(),
        time: selectedTime
      });
      
      // Only perform conversion if we're switching timezones (not on first selection)
      if (oldTimezone && oldTimezone !== selectedTimezone && oldTimezone !== '') {
        try {
          // Get timezone strings
          const fromTzString = oldTimezone === 'NYC' ? 'America/New_York' : moment.tz.guess();
          const toTzString = selectedTimezone === 'NYC' ? 'America/New_York' : moment.tz.guess();
          
          // Parse the date in the original timezone
          const dateStr = moment(selectedDate).format('YYYY-MM-DD');
          const originalDateTime = moment.tz(`${dateStr} ${selectedTime}`, 'YYYY-MM-DD HH:mm', fromTzString);
          
          // Convert to the new timezone
          const convertedDateTime = originalDateTime.clone().tz(toTzString);
          
          // Update the UI with converted values
          setSelectedDate(convertedDateTime.toDate());
          setSelectedTime(convertedDateTime.format('HH:mm'));
        } catch (error) {
          console.error('Error converting timezone:', error);
        }
      }
    }
    
    // Process business hours for the selected timezone
    if (storeHours && storeHours.length > 0) {
      const userTimezone = selectedTimezone === 'NYC' ? 'America/New_York' : moment.tz.guess();
      const processedHours = processBusinessHours(storeHours, userTimezone);
      setLocalTimezoneHours(processedHours || []);
    }
  }, [selectedTimezone, storeHours]);

  /**
   * Update store status when date or time changes
   */
  // Update store status when date or time changes
  useEffect(() => {
    if (selectedDate && selectedTime) {
      // Update store status
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
    
    
    if (!regularHours) {
      return false;
    }
    
    return isTimeWithinRange(nycTime, regularHours.start_time, regularHours.end_time);
  };
  

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
  
 
  const generateDates = () => {
    const dates = [];
    const tz = selectedTimezone === 'NYC' ? 'America/New_York' : moment.tz.guess();
    
    for (let i = 0; i < 30; i++) {
      const date = moment().tz(tz).add(i, 'days').toDate();
     
      dates.push(date);
    }
    return dates;
  };
  
  // Function to check if date selection and modals should be enabled
  const isDataAvailable = () => {
    return storeHours && storeHours.length > 0 && storeOverrides && storeOverrides.length > 0;
  };

  const generateTimeSlots = (date) => {
    if (!date) return [];
    const slots = [];
    const tz = selectedTimezone === 'NYC' ? 'America/New_York' : moment.tz.guess();
    const momentDate = moment(date).tz(tz);

    const nextDay = momentDate.clone().add(1, 'day');
     const previousDay = momentDate.clone().subtract(1, 'day');
    // Get day of week
    const dayOfWeek = momentDate.isoWeekday();
    const month = momentDate.month() + 1;
   
    let localHours = localTimezoneHours.filter(
      h => h.day_of_week === dayOfWeek
    );
    let hours=storeOverrides.filter(
      h => (h.day === momentDate.date()) && h.month === month&&!h.is_open
    );
    if(selectedTimezone!='NYC'){
      let hours1,hours2,hours3
        hours1=storeOverrides.filter(
          h => (h.day === momentDate.date()) && h.month === month && !h.is_open
        );
         hours2=storeOverrides.filter(
          h => (h.day===previousDay.date()) && h.month === month && !h.is_open
        );
         hours3=storeOverrides.filter(
          h => ((h.day===nextDay.date())) && h.month === month && !h.is_open
        );
        hours=[...hours1,...hours2,...hours3]
    }
    if(hours.length>0){
      let finalHours=[]
      for (let i=0;i<hours.length;i++){
        const year = momentDate.year();
      const day = hours[i].day;
      const month = hours[i].month;

        const dateFromParts = moment().year(year).month(month - 1).date(day).tz(tz);
        const dayOfWeek1 = dateFromParts.isoWeekday();
        finalHours.push({
           start_time:  "00:00",
                end_time: "23:59",
                is_open: true,
                day_of_week: dayOfWeek1
        })
      }
         let localTimeOverrideHours=processBusinessHours(finalHours, selectedTimezone === 'NYC' ? 'America/New_York' : moment.tz.guess());
         localTimeOverrideHours = localTimeOverrideHours.filter(h => h.day_of_week === dayOfWeek);
       localTimeOverrideHours.forEach((h1)=>{
          localHours = localHours.filter(h => 
           !isTimeWithinRange(h.start_time, h1.start_time, h1.end_time) &&
           !isTimeWithinRange(h.end_time, h1.start_time, h1.end_time)
         );
       })
        

    }

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
  
  
  const isTimeSlotOpen = (timeString, hoursForDay) => {
    if (!hoursForDay || hoursForDay.length === 0) return false;
    
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

  const getNextStoreOpening = () => {
    return findNextStoreOpening(
      storeHours,
      storeOverrides,
      selectedTimezone
    );
  };

  /**
   * Handle notification setup when the user clicks the Notify Me button
   */
  const handleNotificationSetup = (nextOpeningInfo) => {
    if (!nextOpeningInfo) return;
    
    // Schedule notification for one hour before opening time
    NotificationService.scheduleStoreOpeningNotification(nextOpeningInfo);
  };

  // Check if we have valid store data
  const hasValidStoreData = storeHours && storeHours.length > 0 && storeOverrides && storeOverrides.length > 0;

  return (
    <SafeAreaView style={homeStyles.container}>
      {/* Header Component */}
      <HomeHeader 
        name={name} 
        photo={photo} 
        onProfilePress={() => navigation.navigate('Profile')} 
      />

      <ScrollView 
        style={homeStyles.homeContent} 
        contentContainerStyle={homeStyles.contentContainer}
        showsVerticalScrollIndicator={false}>
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
          isStoreOpen={hasValidStoreData ? checkStoreStatus(new Date(), moment().format('HH:mm')) : false}
          loading={loading}
        />

        {/* If we don't have valid store data, show a refresh button */}
        {!hasValidStoreData && !loading ? (
          <View style={homeStyles.noDataContainer}>
            <Text style={homeStyles.noDataText}>No store hour data available</Text>
            <RefreshButton 
              onPress={fetchStoreData}
              loading={loading}
              text="Refresh Data"
            />
          </View>
        ) : (
          <>
            {/* Next Store Opening Card - only shown for local timezone */}
            {selectedTimezone !== 'NYC' && (
              <NextOpeningCard
                nextOpening={getNextStoreOpening()}
                onPressNotify={
                  ()=>{
                    if(Platform.OS=="ios"){
                      Alert.alert(
                        'Notification Setup',
                        'Notification is not implemented for iOS yet as it requires apple developer account. Please check your Android device.',
                        [
                          { text: 'OK', onPress: () => {} }
                        ]
                      );
                      return
                    }
                    handleNotificationSetup()
                  }
                  }
                selectedTimezone={selectedTimezone}
              />
            )}

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
              onPress={() => isDataAvailable() && showModal('date')}
            />
          </>
        )}
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
            
            // If we already have a time selected, update the combined timezone info
            if (selectedTime) {
              settimeZoneSelectedDate({
                timeZone: selectedTimezone,
                date: date.toISOString(),
                time: selectedTime
              });
            }
            
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
            
            // Store timestamp of when the selection was made
            const originalSelection = {
              timeZone: selectedTimezone, 
              date: selectedDate.toISOString(),
              time: time
            };
            
            // Update our timezone tracker
            settimeZoneSelectedDate(originalSelection);
            hideModal('time');
          }}
        />
      </ModalContainer>
    </SafeAreaView>
  );
};

export default HomeScreen;

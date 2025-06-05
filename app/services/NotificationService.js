/*eslint-disable*/
import { Alert } from 'react-native';
import firebase from '@react-native-firebase/app';
import messaging from '@react-native-firebase/messaging';
import moment from 'moment-timezone';


class NotificationService {

  async requestPermissions() {
    try {
      const authStatus = await messaging().requestPermission();
      const enabled =
        authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
        authStatus === messaging.AuthorizationStatus.PROVISIONAL;

      return enabled;
    } catch (error) {
      console.error('Error requesting notification permissions:', error);
      return false;
    }
  }
  
  
  async scheduleStoreOpeningNotification(nextOpening) {
    try {
      const hasPermission = await this.requestPermissions();
      
      if (!hasPermission) {
        Alert.alert(
          'Notification Permission Required',
          'Please enable notifications in your device settings to receive store opening reminders.',
          [{ text: 'OK' }]
        );
        return false;
      }
      
      if (!nextOpening || !nextOpening.date) {
        console.error('Invalid next opening data');
        return false;
      }
      
      // Calculate time for notification (1 hour before opening)
      const openingTime = moment(nextOpening.date);
    //   const notificationTime = openingTime.clone().subtract(1, 'hour');
      const currentTime=moment()
      //for testing purposes
      // Set notification time to 1 minute from now
      const notificationTime=currentTime.clone().add(1,'minute')
       console.log("notification time",notificationTime.minute(),notificationTime.hour())
      // Check if the notification time is in the past
    //   if (notificationTime.isBefore(moment())) {
    //     Alert.alert(
    //       'Cannot Schedule Notification',
    //       'The notification time is in the past.',
    //       [{ text: 'OK' }]
    //     );
    //     return false;
    //   }
      
      // Get the timestamp in milliseconds
      const notificationTimestamp = notificationTime.valueOf();
      
      // Get Firebase Cloud Messaging token
      const token = await messaging().getToken();
      console.log('FCM Token:', token);
      
     
      const messageId = await messaging().sendMessage({
        token,
        data: {
          title: 'Store Opening Soon',
          body: `The store will open in 1 hour at ${openingTime.format('h:mm A')}`,
          scheduleTime: notificationTimestamp.toString(),
          type: 'store_opening',
        },
      });
  
      Alert.alert(
        'Notification Scheduled',
        `You'll be notified 1 hour before the store opens at ${openingTime.format('h:mm A')}`,
        [{ text: 'OK' }]
      );
      
      return true;
    } catch (error) {
      console.error('Error scheduling notification:', error);
      
      Alert.alert(
        'Notification Error',
        'Failed to schedule notification. Please try again.',
        [{ text: 'OK' }]
      );
      
      return false;
    }
  }
}

export default new NotificationService();

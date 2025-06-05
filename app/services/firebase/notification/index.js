/*eslint-disable*/
import messaging from '@react-native-firebase/messaging';
import {PermissionsAndroid, Platform, Alert} from 'react-native';
import {navigationRef} from '../../../navigation/RootNavigation';
import { getApp } from '@react-native-firebase/app';

export const requestUserPermission = async () => {
  try {
    const permission = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS,
    );
    return permission === PermissionsAndroid.RESULTS.GRANTED;
  } catch (error) {
    console.error('Permission request error:', error);
    return false;
  }
};

export const getFCMToken = async () => {
  try {
    const token = await getApp().messaging().getToken();
    console.log('FCM Token:', token);
    return token;
  } catch (error) {
    console.error('Error getting FCM token:', error);
    return null;
  }
};

const handleNotification = async remoteMessage => {
  try {
  
    const message = remoteMessage?.data?.message;

    if (message) {
      // Store navigation intent regardless of navigation state
        const intent = {
            type: 'notification',
            payload: {
            title: remoteMessage.notification?.title || 'New Notification',
            body: remoteMessage.notification?.body || 'You have a new notification.',
            data: remoteMessage.data,
            },
        };
        // If the app is in the foreground, show an alert
        if (navigationRef.isReady()) {
           Alert.alert(
            intent.payload.title,
            intent.payload.body,
            [
              {
                text: 'View',
                onPress: () => {
                  // Navigate to the appropriate screen
                  navigationRef.navigate('Home', {
                    message: intent.payload.message,
                  });
                },
              },
              {
                text: 'Cancel',
                style: 'cancel',
              },
            ],
           )
        } else {
            // If the app is not ready, store the intent for later
         
            // You can implement a storage mechanism here if needed
        }
    }
  } catch (error) {
    console.error('Error handling notification:', error);
  }
};

export const setupNotifications = () => {
  try {
    // Background message handler
    getApp().messaging().setBackgroundMessageHandler(async remoteMessage => {
     
      await handleNotification(remoteMessage);
    });

    // Foreground message handler
    const messageUnsubscribe = getApp().messaging().onMessage(async remoteMessage => {

      Alert.alert(
        remoteMessage.notification?.title || 'New Notification',
        remoteMessage.notification?.body,
        [
          {
            text: 'View',
            onPress: () => handleNotification(remoteMessage),
          },
          {
            text: 'Cancel',
            style: 'cancel',
          },
        ],
      );
    });

    // Handle notification open when app is in background/quit
    const notificationUnsubscribe =
      getApp().messaging().onNotificationOpenedApp(handleNotification);

    // Check if app was opened from a notification when app was quit
    getApp()
      .messaging()
      .getInitialNotification()
      .then(remoteMessage => {
        if (remoteMessage) {
          handleNotification(remoteMessage);
        }
      });

    // Request permissions (will be handled by the native module)
    requestUserPermission();
    getFCMToken();

    // Return cleanup function
    return () => {
      messageUnsubscribe();
      notificationUnsubscribe();
    };
  } catch (error) {
    console.error('Error setting up notifications:', error);
    return () => {}; // Return empty cleanup function if setup fails
  }
};

export const unregisterFCMToken = async () => {
  try {
    await getApp().messaging().deleteToken();
   
  } catch (error) {
    console.error('Error deleting FCM token:', error);
  }
};
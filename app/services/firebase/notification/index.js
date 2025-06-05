/*eslint-disable*/
import messaging from '@react-native-firebase/messaging';
import {PermissionsAndroid, Platform, Alert} from 'react-native';
import {navigationRef} from '../../../navigation/RootNavigation';

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
    const token = await messaging().getToken();
    console.log('FCM Token:', token);
    return token;
  } catch (error) {
    console.error('Error getting FCM token:', error);
    return null;
  }
};

const handleNotification = async remoteMessage => {
  try {
    console.log('Handling notification:', remoteMessage);
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
                    data: intent.payload.data,
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
            console.log('App is not ready, storing intent for later:', intent);
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
    messaging().setBackgroundMessageHandler(async remoteMessage => {
      console.log('Background Message:', remoteMessage);
      await handleNotification(remoteMessage);
    });

    // Foreground message handler
    const messageUnsubscribe = messaging().onMessage(async remoteMessage => {
      console.log('Foreground Message:', remoteMessage);
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
      messaging().onNotificationOpenedApp(handleNotification);

    // Check if app was opened from a notification when app was quit
    messaging()
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
    await messaging().deleteToken();
    console.log('FCM Token deleted successfully');
  } catch (error) {
    console.error('Error deleting FCM token:', error);
  }
};
/*eslint-disable*/
import auth from '@react-native-firebase/auth';
import {GoogleSignin} from '@react-native-google-signin/google-signin';
import { unregisterFCMToken } from './notification';
import { Alert, Platform } from 'react-native';
import { getApp } from '@react-native-firebase/app';


export const signInWithGoogle = async () => {
  try {
    await GoogleSignin.hasPlayServices({showPlayServicesUpdateDialog: true});
    const {data} = await GoogleSignin.signIn();
    if (!data) {
     Alert.alert('Sign In Error', 'No data received from Google Sign-In');
     return null;
    }
    const googleCredential = auth.GoogleAuthProvider.credential(data.idToken);
    const userCredential = await getApp().auth().signInWithCredential(googleCredential);
    if (!userCredential || !userCredential?.user) {
      Alert.alert('Sign In Error',"Please try again later");
      return null;
    }
    return userCredential.user;
  } catch (error) {
    console.error('Google Sign-In Error:', error);

    if (error.code === 'SIGN_IN_CANCELLED') {
      Alert.alert('Sign In Error', 'Sign in was cancelled');
    } else if (error.code === 'PLAY_SERVICES_NOT_AVAILABLE') {
      Alert.alert('Sign In Error', 'Google Play Services is not available');
    } else if (error.code === 'SIGN_IN_REQUIRED') {
      Alert.alert('Sign In Error', 'Sign in is required');
    } else {
      Alert.alert('Sign In Error', error.message || 'An unknown error occurred');
      return null;
    }

   
  }
};

export const signOut = async () => {
  try {
    if(Platform.OS === 'ios'){
      // For iOS, we can directly sign out from Firebase
     return;
    }
    await unregisterFCMToken();

      // First sign out from Firebase
      if(!getApp().auth().currentUser){
        return;
      }
    await getApp().auth().signOut();

      // Check if user is signed in with Google
    // const isSignedIn = await GoogleSignin.isSignedIn();
   await GoogleSignin.signOut();
  } catch (error) {
    console.error('Sign Out Error:', error);
    // Continue with sign out even if there's an error
  }
};
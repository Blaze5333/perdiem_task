/*eslint-disable*/
import React,{useEffect} from 'react';
import {
  Platform,
  SafeAreaView,
  StatusBar,
  StyleSheet,
 
} from 'react-native';
import StackNavigation from "./app/navigation"
import {persistor, store} from './app/redux';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import { setupNotifications } from './app/services/firebase/notification';
function App() {
  GoogleSignin.configure({
    webClientId:"63655638444-tijb25e3vfm5fo0us9vpehvb72jq3os6.apps.googleusercontent.com",
    iosClientId:"63655638444-gi2u5klvahecf1870n4ai0s0nc809gij.apps.googleusercontent.com",
    offlineAccess: true,
    scopes: ['profile', 'email'],
  })
 
  useEffect(() => {
    if(Platform.OS=="ios"){
      return;
    }
     const cleanup=setupNotifications()
     return cleanup
  }, []);
  return (
    <>
     <Provider store={store}>
   <PersistGate loading={null} persistor={persistor}>
    <SafeAreaView style={{flex: 1, backgroundColor: '#fff'}}>
      <StatusBar
       translucent={true}
      />
      <StackNavigation/>
    </SafeAreaView>
    </PersistGate>
    </Provider>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '400',
  },
  highlight: {
    fontWeight: '700',
  },
});

export default App;

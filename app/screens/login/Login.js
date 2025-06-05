/*eslint-disable*/
import React, { useRef, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  SafeAreaView,
  Animated,
  StatusBar
} from 'react-native';
import { loginStyles } from './loginStyle';
import { colors } from '../../constants/colors';
import GoogleIcon from '../../components/GoogleIcon';
import { signInWithGoogle } from '../../services/firebase/google-signin';
import { showAlert } from '../../utils/alert';
import { useDispatch } from 'react-redux';
import { setName, setPhoto, setEmail, setToken, setUserId } from '../../redux/userSlice';
import { useNavigation } from '@react-navigation/native';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import { loginWithEmailPassword } from '../../services/apis/authApi';
import client from '../../client';
// Color palette


const animationConfig = {
  spring: {
    tension: 100,
    friction: 8,
  },
};

const LoginScreen = ({ onLogin }) => {
  const [email, setemail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [isLoading, setIsLoading] = React.useState(false);
  const [googleLoading, setGoogleLoading] = React.useState(false);
  // Animation values
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.9)).current;
  const dispatch=useDispatch()
  const navigation=useNavigation()
  useEffect(() => {
    // Initial fade in animation
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        ...animationConfig.spring,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  // Handle login
  const handleLogin = async () => {
    // Validate inputs
    if (!email || !password) {
      showAlert({
        title: 'Missing Information',
        message: 'Please enter both email and password.',
        type: 'error',
      });
      return;
    }
    
    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      showAlert({
        title: 'Invalid Email',
        message: 'Please enter a valid email address.',
        type: 'error',
      });
      return;
    }
    
    try {
      setIsLoading(true);
      
    
      
      // Call our authApi login function
      
      const result = await loginWithEmailPassword(email, password);
      
     
      
      // Update Redux with user data
      if (result) {
        dispatch(setEmail(result?.user?.email || email));
        dispatch(setName(result?.user?.name || "User"));
        dispatch(setToken(result?.token || ""));
        dispatch(setPhoto(result?.user?.photo || ""));
        // Navigate to home after successful login
        navigation.navigate('Home');
      } else {
        // Handle unexpected response format
        throw new Error('Invalid response from server');
      }
    } catch (error) {
      console.error('Login error:', error);
      
      // Determine the error message based on the error type
      let errorMessage = 'Unable to login. Please try again.';
      
      if (error.message) {
        errorMessage = error.message;
      }
      
      // Special handling for 403 errors
      if (error.response && error.response.status === 403) {
        errorMessage = 'Access denied. You may not have permission to log in.';
      }
      
      showAlert({
        title: 'Login Failed',
        message: errorMessage,
        type: 'error',
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleGoogleSignIn = async () => {
    try {
      setGoogleLoading(true);
      await GoogleSignin.signOut(); // Make sure to await this call
      const user = await signInWithGoogle();
      if (!user) {
        return;
      } else {
        if (user.email) dispatch(setEmail(user.email || ""));
        if (user.displayName) dispatch(setName(user.displayName || ""));
        if (user.photoURL) dispatch(setPhoto(user.photoURL || ""));
        setGoogleLoading(false);
            navigation.navigate('Home');
        }
    } catch (error) {
      showAlert({
        title: 'Login Failed',
        message: error.message || 'Unable to sign in with Google. Please try again.',
        type: 'error',
      });
    } finally {
      setGoogleLoading(false);
    }
  }

  return (
    <SafeAreaView style={loginStyles.container}>
      <StatusBar style="dark" />
      <Animated.View 
        style={[
          loginStyles.loginContainer,
          {
            opacity: fadeAnim,
            transform: [{ scale: scaleAnim }]
          }
        ]}
      >
        {/* Logo Section */}
        <View style={loginStyles.logoSection}>
          <View style={loginStyles.logoIcon}>
            <Text style={loginStyles.logoIconText}>⏰</Text>
          </View>
          <Text style={loginStyles.logoTitle}>PerDiem</Text>
          <Text style={loginStyles.logoSubtitle}>Book your perfect time slot</Text>
        </View>

        {/* Login Form */}
        <View style={loginStyles.loginForm}>
          {/* Google Sign In */}
          <TouchableOpacity 
            style={loginStyles.googleButton}
            onPress={handleGoogleSignIn}
            activeOpacity={0.8}
          >
            <GoogleIcon style={loginStyles.googleIcon} />
            <Text style={loginStyles.googleButtonText}>{googleLoading?"Loading...":"Continue with Google"}</Text>
          </TouchableOpacity>

          {/* Divider */}
          <View style={loginStyles.divider}>
            <View style={loginStyles.dividerLine} />
            <Text style={loginStyles.dividerText}>or</Text>
            <View style={loginStyles.dividerLine} />
          </View>

          {/* Email/Password Form */}
          <View style={loginStyles.inputContainer}>
            <TextInput
              style={loginStyles.input}
              placeholder="Email (user@tryperdiem.com)"
              placeholderTextColor={colors.gray400}
              value={email}
              onChangeText={setemail}
              keyboardType="email-address"
              autoCapitalize="none"
            />
            <TextInput
              style={loginStyles.input}
              placeholder="Password"
              placeholderTextColor={colors.gray400}
              value={password}
              onChangeText={setPassword}
              secureTextEntry
            />
            <TouchableOpacity 
              style={[
                loginStyles.loginButton,
                isLoading && loginStyles.loginButtonDisabled
              ]}
              onPress={handleLogin}
              activeOpacity={0.8}
              disabled={isLoading}
            >
              {isLoading ? (
                <View style={loginStyles.loadingContainer}>
                  <Text style={loginStyles.loginButtonText}>Signing In...</Text>
                </View>
              ) : (
                <Text style={loginStyles.loginButtonText}>Sign In</Text>
              )}
            </TouchableOpacity>
          </View>

          {/* Sign Up Link */}
          <Text style={loginStyles.signupText}>
            Don't have an account? 
            <Text style={loginStyles.signupLink}> Sign up</Text>
          </Text>
        </View>
      </Animated.View>
    </SafeAreaView>
  );
};

export default LoginScreen;

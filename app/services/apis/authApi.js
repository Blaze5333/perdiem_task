/*eslint-disable */

import client from "../../client";

export const loginWithEmailPassword = async (email, password) => {
  try {
    // Make the API call to authenticate the user
    console.log('Attempting to log in with email:', email);
    console.log('API endpoint:', 'auth');
    
    // Log request data for debugging (hide full password)
    console.log('Request data:', { 
      email, 
      password: password ? '***hidden***' : 'not provided' 
    });
    
    // Make the API call with explicit headers
    const response = await client.post('auth', 
      { email, password },
      {
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        }
      }
    );
    
    console.log('Login response status:', response.status);
    console.log('Login response:', response.data);
    
    // If successful (status 200), return the user data
    if (response.status === 200) {
      console.log('Login successful:', response.data);
      return {
        token: response.data.token || '',
      };
    }

    // If login failed, throw an error with the status
    throw new Error('Login failed with status: ' + response.status);

  } catch (error) {
    console.error('Login error:', error);
    
    // Log more details about the error for debugging
    if (error.response) {
      console.error('Error response status:', error.response.status);
      console.error('Error response headers:', error.response.headers);
      console.error('Error response data:', error.response.data);
    }
    
    // Handle specific error status codes
    if (error.response) {
      const { status } = error.response;
      
      switch (status) {
        case 400:
          throw new Error('Invalid email or password format. Please check your credentials.');
        case 401:
          throw new Error('Invalid credentials. Please check your email and password.');
        case 403:
          throw new Error('Access denied. You may not have permission to log in.');
        case 404:
          throw new Error('Account not found. Please sign up or check your credentials.');
        case 429:
          throw new Error('Too many login attempts. Please try again later.');
        case 500:
          throw new Error('Server error. Please try again later.');
        default:
          throw new Error(error.response.data?.message || 'Login failed. Please try again.');
      }
    } else if (error.request) {
      throw new Error('Network error. Please check your connection and try again.');
    } else {
      throw new Error('Login process failed. Please try again later.');
    }
  }
};

export default {
  loginWithEmailPassword,
};
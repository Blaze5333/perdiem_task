/*eslint-disable*/
import axios from 'axios';

// Base API URL - replace with your actual backend URL
const BASE_URL = 'https://coding-challenge-pd-1a25b1a14f34.herokuapp.com/';

const client = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptors for debugging and auth
client.interceptors.request.use(
  (config) => {
        // You could add authentication tokens here from AsyncStorage or Redux
    // const token = store.getState().user.token;
    // if (token) {
    //   config.headers.Authorization = `Bearer ${token}`;
    // }
    
    return config;
  },
  (error) => {
    console.error('API Request Error:', error);
    return Promise.reject(error);
  }
);

// Add response interceptors for better debugging
client.interceptors.response.use(
  (response) => {
   
    return response;
  },
  (error) => {
    // Handle global error cases here
    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      console.error(`API Error [${error.response.status}]:`, error.response.data);
      
      // You could handle global error states here (e.g., 401 unauthorized, etc.)
      // if (error.response.status === 401) {
      //   // Logout user, clear data, redirect to login, etc.
      // }
    } else if (error.request) {
      // The request was made but no response was received
      console.error('API No Response Error:', error.request);
    } else {
      // Something happened in setting up the request
      console.error('API Setup Error:', error.message);
    }
    
    return Promise.reject(error);
  }
);

export default client;

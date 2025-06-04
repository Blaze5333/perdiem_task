/*eslint-disable*/
import axios from 'axios';
const BASE_URL = 'https://coding-challenge-pd-1a25b1a14f34.herokuapp.com/';

const client = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

client.interceptors.request.use(
  (config) => {
 
    
    return config;
  },
  (error) => {
    console.error('API Request Error:', error);
    return Promise.reject(error);
  }
);

client.interceptors.response.use(
  (response) => {
   
    return response;
  },
  (error) => {
    // Handle global error cases here
    if (error.response) {
      
      console.error(`API Error [${error.response.status}]:`, error.response.data);
    
    } else if (error.request) {
    
      console.error('API No Response Error:', error.request);
    } else {
      
      console.error('API Setup Error:', error.message);
    }
    
    return Promise.reject(error);
  }
);

export default client;

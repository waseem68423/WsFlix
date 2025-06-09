import { boot } from 'quasar/wrappers';
import axios from 'axios';
import { store } from '../store/store'; // Import our global store

// Create the Axios instance pointing to our backend
const api = axios.create({ baseURL: 'http://localhost:3000' });

// --- THIS IS THE MOST IMPORTANT FIX ---
// This "interceptor" runs before every single request is sent.
api.interceptors.request.use(
  (config) => {
    // Get the token from our store
    const token = store.token;

    // If a token exists, add it to the request headers
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
      console.log('Token attached to request headers.'); // For debugging
    } else {
      console.log('No token found, sending request without auth.'); // For debugging
    }
    
    return config;
  },
  (error) => {
    // This part is for request errors (like no internet)
    return Promise.reject(error);
  }
);
// --- END OF FIX ---

export default boot(({ app }) => {
  // Make '$api' available throughout the app as this.$api
  app.config.globalProperties.$api = api;
});

export { api };
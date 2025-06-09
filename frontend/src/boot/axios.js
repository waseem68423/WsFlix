import { boot } from 'quasar/wrappers';
import axios from 'axios';
import { store } from '../store/store';

// This line reads the VITE_API_URL from your Vercel environment variables.
// If it can't find it (like when you are running on your own computer),
// it will use 'http://localhost:3000' as a backup.
const baseURL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

// This will print the URL to the browser's console, so we can check if it's correct.
console.log('Using API Base URL:', baseURL);

const api = axios.create({ baseURL: baseURL });

api.interceptors.request.use(
  (config) => {
    const token = store.token;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    } else {
      // This is the console log you were seeing before
      console.log('No token found, sending request without auth.');
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default boot(({ app }) => {
  app.config.globalProperties.$api = api;
  app.config.globalproperties.$store = store;
});

export { api };
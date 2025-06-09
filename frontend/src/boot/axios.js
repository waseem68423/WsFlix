import { boot } from 'quasar/wrappers';
import axios from 'axios';
import { store } from '../store/store';

// --- THIS IS THE CORRECTED WAY TO READ THE VARIABLE ---
// After the quasar.config.js change, the variable is available on `process.env`.
const baseURL = process.env.VITE_API_URL || 'http://localhost:3000';

console.log('Final API Base URL:', baseURL);

const api = axios.create({ baseURL });

// ... (rest of the file is the same)
api.interceptors.request.use(
  (config) => {
    const token = store.token;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default boot(({ app }) => {
  app.config.globalProperties.$api = api;
  app.config.globalProperties.$store = store;
});

export { api };